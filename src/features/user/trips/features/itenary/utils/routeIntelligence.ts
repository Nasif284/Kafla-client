/**
 * Route Intelligence & Schedule Sanity Engine
 * Provides client-side distance calculations, commute estimates,
 * timing overlap detection, and day pacing diagnostics.
 */

export interface ActivityLocationPoint {
  title: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  startTime?: string | null;
  durationMinutes?: number | null;
}

export type CommuteMode = "walk" | "drive" | "transit";

export interface CommuteEstimate {
  hasCoordinates: boolean;
  distanceKm: number;
  distanceFormatted: string;
  mode: CommuteMode;
  estimatedMinutes: number;
  durationFormatted: string;
  googleMapsUrl: string;
}

export type WarningSeverity = "none" | "leisure" | "tight" | "overlap";

export interface SegmentAnalysis {
  fromActivity: ActivityLocationPoint;
  toActivity: ActivityLocationPoint;
  commute?: CommuteEstimate;
  timeGapMinutes: number;
  timeGapFormatted: string;
  severity: WarningSeverity;
  alertTitle?: string;
  alertDetail?: string;
  suggestedStartTime?: string;
  googleMapsUrl: string;
}

export interface DayRouteAnalysis {
  segments: SegmentAnalysis[];
  totalDistanceKm: number;
  totalDistanceFormatted: string;
  totalCommuteMinutes: number;
  overlapCount: number;
  tightTransitCount: number;
  isPackedDay: boolean;
  pacingLevel: "relaxed" | "balanced" | "active" | "packed";
  pacingSummary: string;
}

// ── Math & Geographic Helpers ──────────────────────────────────────────────────

/**
 * Calculates Haversine great-circle distance between two GPS coordinates in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats distance in meters or kilometers.
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Parses time string like "09:30", "9:30 AM", "14:15", "2:15 PM" to minutes from midnight (0..1439).
 */
export function parseTimeToMinutes(timeStr?: string | null): number | null {
  if (!timeStr) return null;
  const clean = timeStr.trim().toUpperCase();

  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");
  const stripped = clean.replace(/[APM\s]/g, "");

  const parts = stripped.split(":");
  if (parts.length < 2) return null;

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return null;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight back to 12-hour formatted string (e.g. "1:15 PM").
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(norm / 60);
  const mins = norm % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;

  return `${hours12}:${minsStr} ${period}`;
}

/**
 * Formats duration into human-readable string (e.g. "45m", "1h 15m").
 */
export function formatDurationMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Builds a direct Google Maps Directions URL between two points or names.
 */
export function buildGoogleMapsRouteUrl(
  from: ActivityLocationPoint,
  to: ActivityLocationPoint
): string {
  const originParam =
    from.latitude && from.longitude
      ? `${from.latitude},${from.longitude}`
      : encodeURIComponent(from.location || from.title);

  const destParam =
    to.latitude && to.longitude
      ? `${to.latitude},${to.longitude}`
      : encodeURIComponent(to.location || to.title);

  return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}`;
}

/**
 * Builds a multi-stop Google Maps URL connecting all points in sequence.
 */
export function buildMultiStopGoogleMapsUrl(
  points: ActivityLocationPoint[]
): string {
  const valid = points.filter(
    (p) =>
      p.latitude != null &&
      p.longitude != null &&
      !isNaN(p.latitude) &&
      !isNaN(p.longitude)
  );

  if (valid.length === 0) {
    const named = points.filter((p) => (p.location || p.title)?.trim());
    if (named.length >= 2) {
      const origin = encodeURIComponent(named[0].location || named[0].title);
      const dest = encodeURIComponent(named[named.length - 1].location || named[named.length - 1].title);
      const waypoints = named
        .slice(1, -1)
        .map((p) => encodeURIComponent(p.location || p.title))
        .join("|");
      return waypoints
        ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&waypoints=${waypoints}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
    }
    return "https://www.google.com/maps";
  }

  if (valid.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${valid[0].latitude},${valid[0].longitude}`;
  }

  const origin = `${valid[0].latitude},${valid[0].longitude}`;
  const dest = `${valid[valid.length - 1].latitude},${valid[valid.length - 1].longitude}`;

  if (valid.length === 2) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
  }

  const waypoints = valid
    .slice(1, -1)
    .map((p) => `${p.latitude},${p.longitude}`)
    .join("|");

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&waypoints=${encodeURIComponent(
    waypoints
  )}&travelmode=driving`;
}

/**
 * Estimates commute distance, travel time, and mode between two points.
 */
export function estimateCommuteBetween(
  from: ActivityLocationPoint,
  to: ActivityLocationPoint
): CommuteEstimate {
  const hasCoords =
    from.latitude != null &&
    from.longitude != null &&
    to.latitude != null &&
    to.longitude != null;

  const mapsUrl = buildGoogleMapsRouteUrl(from, to);

  if (!hasCoords) {
    return {
      hasCoordinates: false,
      distanceKm: 0,
      distanceFormatted: "Unknown",
      mode: "drive",
      estimatedMinutes: 15, // standard city transit buffer
      durationFormatted: "~15m",
      googleMapsUrl: mapsUrl,
    };
  }

  const distanceKm = haversineDistance(
    from.latitude!,
    from.longitude!,
    to.latitude!,
    to.longitude!
  );

  // If distance <= 1.2 km, assume scenic/urban walk at ~4.8 km/h (12.5 min/km)
  if (distanceKm <= 1.2) {
    const mins = Math.max(3, Math.round(distanceKm * 12.5));
    return {
      hasCoordinates: true,
      distanceKm,
      distanceFormatted: formatDistance(distanceKm),
      mode: "walk",
      estimatedMinutes: mins,
      durationFormatted: `${mins} min walk`,
      googleMapsUrl: mapsUrl,
    };
  }

  // Urban drive / taxi: average 28 km/h in city traffic + 3 min pickup cushion
  const driveMins = Math.max(5, Math.round(3 + (distanceKm / 28) * 60));
  return {
    hasCoordinates: true,
    distanceKm,
    distanceFormatted: formatDistance(distanceKm),
    mode: "drive",
    estimatedMinutes: driveMins,
    durationFormatted: `${driveMins} min drive`,
    googleMapsUrl: mapsUrl,
  };
}

// ── Segment & Day Route Analyzer ───────────────────────────────────────────────

/**
 * Analyzes the transition between Activity A and Activity B.
 */
export function analyzeActivitySegment(
  from: ActivityLocationPoint,
  to: ActivityLocationPoint
): SegmentAnalysis {
  const commute = estimateCommuteBetween(from, to);
  const startFromMins = parseTimeToMinutes(from.startTime);
  const startToMins = parseTimeToMinutes(to.startTime);
  const fromDuration = from.durationMinutes || 60;

  const mapsUrl = buildGoogleMapsRouteUrl(from, to);

  // If times are missing, fallback to neutral segment
  if (startFromMins === null || startToMins === null) {
    return {
      fromActivity: from,
      toActivity: to,
      commute,
      timeGapMinutes: 0,
      timeGapFormatted: "Flexible",
      severity: "none",
      googleMapsUrl: mapsUrl,
    };
  }

  const finishFromMins = startFromMins + fromDuration;
  const gapMinutes = startToMins - finishFromMins;
  const finishFromFormatted = formatMinutesToTime(finishFromMins);

  // 1. Time Overlap Alert (gap < 0)
  if (gapMinutes < 0) {
    const conflictMins = Math.abs(gapMinutes);
    const suggestedMins = finishFromMins + (commute.hasCoordinates ? commute.estimatedMinutes : 15);
    const suggestedTime = formatMinutesToTime(suggestedMins);

    return {
      fromActivity: from,
      toActivity: to,
      commute,
      timeGapMinutes: gapMinutes,
      timeGapFormatted: `${conflictMins}m overlap`,
      severity: "overlap",
      alertTitle: "Schedule Overlap",
      alertDetail: `"${to.title}" starts at ${to.startTime}, but "${from.title}" finishes at ${finishFromFormatted} (${conflictMins} min conflict).`,
      suggestedStartTime: suggestedTime,
      googleMapsUrl: mapsUrl,
    };
  }

  // 2. Tight Commute Warning (gap >= 0 but gap < estimated commute)
  if (commute.hasCoordinates && gapMinutes < commute.estimatedMinutes) {
    const deficitMins = commute.estimatedMinutes - gapMinutes;
    return {
      fromActivity: from,
      toActivity: to,
      commute,
      timeGapMinutes: gapMinutes,
      timeGapFormatted: `${gapMinutes}m window`,
      severity: "tight",
      alertTitle: "Tight Commute",
      alertDetail: `Estimated ${commute.durationFormatted} (${commute.distanceFormatted}), but only ${gapMinutes} min window scheduled (${deficitMins} min deficit).`,
      googleMapsUrl: mapsUrl,
    };
  }

  // Back-to-back warning when no coords and 0 min gap
  if (!commute.hasCoordinates && gapMinutes <= 5) {
    return {
      fromActivity: from,
      toActivity: to,
      commute,
      timeGapMinutes: gapMinutes,
      timeGapFormatted: `${gapMinutes}m buffer`,
      severity: "tight",
      alertTitle: "Back-to-Back Schedule",
      alertDetail: `No transition buffer between "${from.title}" and "${to.title}".`,
      googleMapsUrl: mapsUrl,
    };
  }

  // 3. Leisure Free Time Window (gap >= 90 mins)
  if (gapMinutes >= 90) {
    return {
      fromActivity: from,
      toActivity: to,
      commute,
      timeGapMinutes: gapMinutes,
      timeGapFormatted: `${formatDurationMinutes(gapMinutes)} free window`,
      severity: "leisure",
      alertTitle: "Free Window",
      alertDetail: `You have ${formatDurationMinutes(gapMinutes)} of leisure buffer between stops.`,
      googleMapsUrl: mapsUrl,
    };
  }

  // 4. Healthy standard transit
  return {
    fromActivity: from,
    toActivity: to,
    commute,
    timeGapMinutes: gapMinutes,
    timeGapFormatted: `${formatDurationMinutes(gapMinutes)} window`,
    severity: "none",
    googleMapsUrl: mapsUrl,
  };
}

/**
 * Analyzes an entire day's sequence of activities.
 */
export function analyzeDayRoute(activities: ActivityLocationPoint[]): DayRouteAnalysis {
  if (!activities || activities.length <= 1) {
    return {
      segments: [],
      totalDistanceKm: 0,
      totalDistanceFormatted: "0 km",
      totalCommuteMinutes: 0,
      overlapCount: 0,
      tightTransitCount: 0,
      isPackedDay: false,
      pacingLevel: "relaxed",
      pacingSummary: "Relaxed pacing with light schedule.",
    };
  }

  // Sort activities chronologically by startTime
  const sorted = [...activities].sort((a, b) => {
    const timeA = parseTimeToMinutes(a.startTime) ?? 9999;
    const timeB = parseTimeToMinutes(b.startTime) ?? 9999;
    return timeA - timeB;
  });

  const segments: SegmentAnalysis[] = [];
  let totalDistanceKm = 0;
  let totalCommuteMinutes = 0;
  let overlapCount = 0;
  let tightTransitCount = 0;

  for (let i = 0; i < sorted.length - 1; i++) {
    const segment = analyzeActivitySegment(sorted[i], sorted[i + 1]);
    segments.push(segment);

    if (segment.commute?.hasCoordinates) {
      totalDistanceKm += segment.commute.distanceKm;
      totalCommuteMinutes += segment.commute.estimatedMinutes;
    }
    if (segment.severity === "overlap") overlapCount++;
    if (segment.severity === "tight") tightTransitCount++;
  }

  // Determine overall Day Pacing
  const totalStops = sorted.length;
  let pacingLevel: DayRouteAnalysis["pacingLevel"] = "balanced";
  let pacingSummary = "Balanced pacing with comfortable transitions.";

  if (overlapCount > 0) {
    pacingLevel = "packed";
    pacingSummary = `${overlapCount} schedule overlap${overlapCount > 1 ? "s" : ""} detected.`;
  } else if (totalStops >= 6 || tightTransitCount >= 2) {
    pacingLevel = "packed";
    pacingSummary = "Packed schedule: Multiple back-to-back stops with tight transit windows.";
  } else if (totalStops >= 4 || totalDistanceKm > 15) {
    pacingLevel = "active";
    pacingSummary = `Active itinerary: ${totalStops} stops covering ~${formatDistance(totalDistanceKm)} transit.`;
  } else {
    pacingLevel = "relaxed";
    pacingSummary = `Relaxed day: ${totalStops} stops with generous breathing room.`;
  }

  return {
    segments,
    totalDistanceKm,
    totalDistanceFormatted: formatDistance(totalDistanceKm),
    totalCommuteMinutes,
    overlapCount,
    tightTransitCount,
    isPackedDay: pacingLevel === "packed",
    pacingLevel,
    pacingSummary,
  };
}

/**
 * Decodes a Google Encoded Polyline string into an array of { lat, lng } coordinates.
 */
export function decodeGooglePolyline(
  encoded: string
): Array<{ lat: number; lng: number }> {
  if (!encoded) return [];
  const coords: Array<{ lat: number; lng: number }> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coords.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return coords;
}
