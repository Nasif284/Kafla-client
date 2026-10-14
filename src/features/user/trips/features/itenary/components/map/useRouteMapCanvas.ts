import { useMemo } from "react";
import {
  ActivityLocationPoint,
  buildMultiStopGoogleMapsUrl,
  formatDistance,
  haversineDistance,
  parseTimeToMinutes,
} from "../../utils/routeIntelligence";
import {
  RouteMapCanvasProps,
  ValidMarkerPoint,
  getDayColor,
} from "./mapTypes";

interface UseRouteMapCanvasProps {
  dayNumber?: number;
  activities?: RouteMapCanvasProps["activities"];
  days?: RouteMapCanvasProps["days"];
  title?: string;
  activeDayTab: number | "all";
}

export function useRouteMapCanvas({
  dayNumber,
  activities = [],
  days,
  title,
  activeDayTab,
}: UseRouteMapCanvasProps) {
  const isMultiDay = Boolean(days && days.length > 0);

  // Extract all valid points with coordinates
  const validStops = useMemo<ValidMarkerPoint[]>(() => {
    if (isMultiDay && days) {
      const all: ValidMarkerPoint[] = [];
      days.forEach((day, dIdx) => {
        const sortedActs = [...(day.activities || [])].sort((a, b) => {
          const tA = parseTimeToMinutes(a.startTime) ?? 9999;
          const tB = parseTimeToMinutes(b.startTime) ?? 9999;
          return tA - tB;
        });

        let daySeq = 1;
        sortedActs.forEach((act) => {
          if (
            act.latitude != null &&
            act.longitude != null &&
            !isNaN(act.latitude) &&
            !isNaN(act.longitude)
          ) {
            all.push({
              id: act.id,
              dayIndex: dIdx,
              seqNumber: daySeq,
              label: days.length > 1 ? `D${dIdx + 1}.${daySeq}` : `${daySeq}`,
              title: act.title,
              location: act.location,
              latitude: act.latitude,
              longitude: act.longitude,
              startTime: act.startTime,
              durationMinutes: act.durationMinutes,
              category: act.category,
              color: getDayColor(dIdx),
            });
            daySeq++;
          }
        });
      });
      return all;
    }

    const sorted = [...activities].sort((a, b) => {
      const tA = parseTimeToMinutes(a.startTime) ?? 9999;
      const tB = parseTimeToMinutes(b.startTime) ?? 9999;
      return tA - tB;
    });

    let seq = 1;
    const result: ValidMarkerPoint[] = [];
    sorted.forEach((act) => {
      if (
        act.latitude != null &&
        act.longitude != null &&
        !isNaN(act.latitude) &&
        !isNaN(act.longitude)
      ) {
        result.push({
          id: act.id,
          dayIndex: (dayNumber || 1) - 1,
          seqNumber: seq,
          label: `${seq}`,
          title: act.title,
          location: act.location,
          latitude: act.latitude,
          longitude: act.longitude,
          startTime: act.startTime,
          durationMinutes: act.durationMinutes,
          category: act.category,
          color: getDayColor((dayNumber || 1) - 1),
        });
        seq++;
      }
    });
    return result;
  }, [isMultiDay, days, activities, dayNumber]);

  // Calculate total route distance across valid points
  const totalDistanceKm = useMemo(() => {
    if (validStops.length < 2) return 0;
    let dist = 0;
    for (let i = 0; i < validStops.length - 1; i++) {
      dist += haversineDistance(
        validStops[i].latitude,
        validStops[i].longitude,
        validStops[i + 1].latitude,
        validStops[i + 1].longitude
      );
    }
    return dist;
  }, [validStops]);

  // Target points for external Google Maps link
  const pointsForGoogleMaps = useMemo<ActivityLocationPoint[]>(() => {
    if (isMultiDay && activeDayTab !== "all") {
      return validStops
        .filter((s) => s.dayIndex === activeDayTab)
        .map((s) => ({
          title: s.title,
          location: s.location,
          latitude: s.latitude,
          longitude: s.longitude,
        }));
    }
    return validStops.map((s) => ({
      title: s.title,
      location: s.location,
      latitude: s.latitude,
      longitude: s.longitude,
    }));
  }, [validStops, isMultiDay, activeDayTab]);

  const googleMapsUrl = useMemo(() => {
    return buildMultiStopGoogleMapsUrl(pointsForGoogleMaps);
  }, [pointsForGoogleMaps]);

  const headerTitle = useMemo(() => {
    if (title) return title;
    if (isMultiDay) {
      return "Complete Trip Route Map";
    }
    return `Day ${dayNumber || 1} Route Map`;
  }, [title, isMultiDay, dayNumber]);

  const headerSummary = useMemo(() => {
    const stopsCount = validStops.length;
    if (stopsCount === 0) {
      return "No GPS coordinates mapped";
    }
    const distFormatted = formatDistance(totalDistanceKm);
    if (isMultiDay && days) {
      return `${stopsCount} Stops · ${days.length} Days · ~${distFormatted} route`;
    }
    return `${stopsCount} Stops · ~${distFormatted} route`;
  }, [validStops.length, totalDistanceKm, isMultiDay, days]);

  const defaultCenter = useMemo(() => {
    if (validStops.length > 0) {
      return { lat: validStops[0].latitude, lng: validStops[0].longitude };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [validStops]);

  const routeColor = useMemo(() => {
    if (!isMultiDay) return getDayColor((dayNumber || 1) - 1);
    if (activeDayTab !== "all") return getDayColor(activeDayTab);
    return "#0f6e56";
  }, [isMultiDay, dayNumber, activeDayTab]);

  return {
    isMultiDay,
    validStops,
    pointsForGoogleMaps,
    googleMapsUrl,
    headerTitle,
    headerSummary,
    defaultCenter,
    routeColor,
  };
}
