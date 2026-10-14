"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Marker,
  InfoWindow,
  Polyline,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapPin, ExternalLink } from "lucide-react";
import { decodeGooglePolyline } from "../../utils/routeIntelligence";
import {
  MapContentProps,
  ValidMarkerPoint,
  getDayColor,
  roadPathCache,
} from "./mapTypes";

export default function MapContent({
  stops,
  activeStop,
  onSelectStop,
  dayMode,
  activeDayTab,
  routeColor,
  onRoadRouteLoaded,
}: MapContentProps) {
  const map = useMap();
  const [roadPath, setRoadPath] = useState<Array<{ lat: number; lng: number }> | null>(null);

  // Filter stops if user is viewing a specific day tab in multi-day mode
  const displayedStops = useMemo(() => {
    if (dayMode === "multi" && activeDayTab !== "all") {
      return stops.filter((s) => s.dayIndex === activeDayTab);
    }
    return stops;
  }, [stops, dayMode, activeDayTab]);

  const straightCoords = useMemo(() => {
    return displayedStops.map((s) => ({
      lat: s.latitude,
      lng: s.longitude,
    }));
  }, [displayedStops]);

  // Unique cache key for current stop sequence
  const routeCacheKey = useMemo(() => {
    return displayedStops
      .map((s) => `${s.latitude.toFixed(5)},${s.longitude.toFixed(5)}`)
      .join(";");
  }, [displayedStops]);

  // Fit map bounds to displayed stops
  const fitBoundsToStops = useCallback(() => {
    if (!map || displayedStops.length === 0) return;
    if (displayedStops.length === 1) {
      map.setCenter({
        lat: displayedStops[0].latitude,
        lng: displayedStops[0].longitude,
      });
      map.setZoom(15);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    displayedStops.forEach((s) =>
      bounds.extend({ lat: s.latitude, lng: s.longitude })
    );
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, displayedStops]);

  useEffect(() => {
    fitBoundsToStops();
  }, [fitBoundsToStops]);

  // Fetch real road curves using Google's modern Routes API v2 via /api/routes
  useEffect(() => {
    if (straightCoords.length < 2 || (dayMode === "multi" && activeDayTab === "all")) {
      setRoadPath(null);
      onRoadRouteLoaded?.(false);
      return;
    }

    const cached = roadPathCache.get(routeCacheKey);
    if (cached) {
      setRoadPath(cached);
      onRoadRouteLoaded?.(true);
      return;
    }

    let isCurrent = true;
    const origin = displayedStops[0];
    const destination = displayedStops[displayedStops.length - 1];
    const intermediates = displayedStops.slice(1, -1).map((s) => ({
      lat: s.latitude,
      lng: s.longitude,
    }));

    fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: { lat: origin.latitude, lng: origin.longitude },
        destination: { lat: destination.latitude, lng: destination.longitude },
        intermediates,
        travelMode: "DRIVE",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isCurrent) return;
        if (data?.encodedPolyline) {
          const decoded = decodeGooglePolyline(data.encodedPolyline);
          if (decoded.length > 0) {
            roadPathCache.set(routeCacheKey, decoded);
            setRoadPath(decoded);
            onRoadRouteLoaded?.(true);
            return;
          }
        }
        setRoadPath(null);
        onRoadRouteLoaded?.(false);
      })
      .catch(() => {
        if (isCurrent) {
          setRoadPath(null);
          onRoadRouteLoaded?.(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [routeCacheKey, straightCoords.length, dayMode, activeDayTab, displayedStops, onRoadRouteLoaded]);

  // Group stops by dayIndex for rendering day-specific route lines
  const daySegments = useMemo(() => {
    const groups: { [dIdx: number]: ValidMarkerPoint[] } = {};
    displayedStops.forEach((s) => {
      if (!groups[s.dayIndex]) groups[s.dayIndex] = [];
      groups[s.dayIndex].push(s);
    });
    return Object.entries(groups).map(([dIdxStr, stopsInDay]) => ({
      dayIndex: Number(dIdxStr),
      color: getDayColor(Number(dIdxStr)),
      coords: stopsInDay.map((s) => ({ lat: s.latitude, lng: s.longitude })),
    }));
  }, [displayedStops]);

  // Inter-day and circular circuit lines
  const interDayTransfers = useMemo(() => {
    if (dayMode !== "multi" || activeDayTab !== "all" || daySegments.length <= 1) {
      return [];
    }
    const transfers: Array<{ from: { lat: number; lng: number }; to: { lat: number; lng: number }; isReturn?: boolean }> = [];
    for (let i = 0; i < daySegments.length - 1; i++) {
      const currentDayCoords = daySegments[i].coords;
      const nextDayCoords = daySegments[i + 1].coords;
      if (currentDayCoords.length > 0 && nextDayCoords.length > 0) {
        transfers.push({
          from: currentDayCoords[currentDayCoords.length - 1],
          to: nextDayCoords[0],
          isReturn: false,
        });
      }
    }

    const firstDayCoords = daySegments[0].coords;
    const lastDayCoords = daySegments[daySegments.length - 1].coords;
    if (firstDayCoords.length > 0 && lastDayCoords.length > 0) {
      transfers.push({
        from: lastDayCoords[lastDayCoords.length - 1],
        to: firstDayCoords[0],
        isReturn: true,
      });
    }

    return transfers;
  }, [dayMode, activeDayTab, daySegments]);

  // High-contrast, self-contained SVG Pill Badge marker
  const getPillMarkerIcon = useCallback(
    (label: string, color: string, isSelected: boolean) => {
      if (typeof window === "undefined" || typeof window.google === "undefined") {
        return undefined;
      }
      const isMulti = label.length > 2;
      const width = isMulti ? 48 : 32;
      const height = 30;
      const rectW = width - 4;
      const rectH = 19;
      const centerX = width / 2;
      const tipY = 26;

      const strokeColor = isSelected ? "#facc15" : "#ffffff";
      const strokeWidth = isSelected ? 2.5 : 1.8;

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <filter id="pShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <g filter="url(#pShadow)">
          <polygon points="${centerX - 4},19 ${centerX + 4},19 ${centerX},${tipY}" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
          <rect x="2" y="2" width="${rectW}" height="${rectH}" rx="9.5" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
          <text x="${centerX}" y="15" fill="#ffffff" font-size="10.5" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="0.2">${label}</text>
        </g>
      </svg>`;

      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(width, height),
        anchor: new google.maps.Point(centerX, tipY),
      };
    },
    []
  );

  return (
    <>
      {dayMode === "multi" && activeDayTab === "all" ? (
        <>
          {daySegments.map((segment) =>
            segment.coords.length >= 2 ? (
              <Polyline
                key={`day-route-${segment.dayIndex}`}
                path={segment.coords}
                strokeColor={segment.color}
                strokeOpacity={0.88}
                strokeWeight={3.8}
                geodesic={true}
              />
            ) : null
          )}

          {interDayTransfers.map((t, idx) => (
            <Polyline
              key={`inter-transfer-${idx}`}
              path={[t.from, t.to]}
              strokeColor="#0f6e56"
              strokeOpacity={0.82}
              strokeWeight={3.5}
              geodesic={true}
            />
          ))}
        </>
      ) : (
        straightCoords.length >= 2 && (
          <Polyline
            path={roadPath || straightCoords}
            strokeColor={routeColor}
            strokeOpacity={0.88}
            strokeWeight={4}
            geodesic={true}
          />
        )
      )}

      {displayedStops.map((stop) => {
        const isSelected = activeStop?.id === stop.id;
        const icon = getPillMarkerIcon(stop.label, stop.color, isSelected);
        return (
          <Marker
            key={stop.id}
            position={{ lat: stop.latitude, lng: stop.longitude }}
            title={`${stop.label}. ${stop.title}`}
            icon={icon}
            zIndex={isSelected ? 9999 : 100 + stop.seqNumber}
            onClick={() => onSelectStop(stop)}
          />
        );
      })}

      {activeStop && (
        <InfoWindow
          position={{ lat: activeStop.latitude, lng: activeStop.longitude }}
          onCloseClick={() => onSelectStop(null)}
        >
          <div className="p-1 max-w-[240px] text-left font-sans">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ backgroundColor: activeStop.color }}
              >
                {activeStop.label}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7a74]">
                {activeStop.category?.name || "Activity Stop"}
              </span>
              {activeStop.startTime && (
                <span className="ml-auto text-[10px] font-bold text-[#0f6e56] bg-[#0f6e56]/10 px-1.5 py-0.5 rounded tabular-nums">
                  {activeStop.startTime}
                </span>
              )}
            </div>

            <h4 className="text-xs font-bold text-[#181d1a] leading-snug mb-1">
              {activeStop.title}
            </h4>

            {activeStop.location && (
              <p className="text-[11px] text-[#6f7a74] line-clamp-2 mb-2 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-[#0f6e56] shrink-0 mt-0.5" />
                <span>{activeStop.location}</span>
              </p>
            )}

            <div className="pt-2 border-t border-[#f1f4f1] flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#6f7a74]">
                {activeStop.durationMinutes
                  ? `${activeStop.durationMinutes}m visit`
                  : "Scheduled Stop"}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeStop.latitude},${activeStop.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f6e56] hover:underline"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
