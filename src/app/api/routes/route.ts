import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, intermediates, travelMode = "DRIVE" } = await req.json();

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    // Prepare body for Google modern Routes API v2
    const body: Record<string, unknown> = {
      origin: {
        location: {
          latLng: {
            latitude: origin.lat,
            longitude: origin.lng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat,
            longitude: destination.lng,
          },
        },
      },
      travelMode: travelMode === "WALK" ? "WALK" : "DRIVE",
      routingPreference: travelMode === "WALK" ? undefined : "TRAFFIC_UNAWARE",
      computeAlternativeRoutes: false,
    };

    if (Array.isArray(intermediates) && intermediates.length > 0) {
      // Routes API supports up to 25 intermediates
      body.intermediates = intermediates.slice(0, 25).map((point: { lat: number; lng: number }) => ({
        location: {
          latLng: {
            latitude: point.lat,
            longitude: point.lng,
          },
        },
      }));
    }

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: "Routes API error", details: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const primaryRoute = data?.routes?.[0];

    return NextResponse.json({
      encodedPolyline: primaryRoute?.polyline?.encodedPolyline || null,
      distanceMeters: primaryRoute?.distanceMeters || null,
      duration: primaryRoute?.duration || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
