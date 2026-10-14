import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { placeId } = await req.json();

  const response = await fetch(`https://places.googleapis.com/v1/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": "id,displayName,formattedAddress,location,addressComponents",
    },
  });

  const data = await response.json();

  return NextResponse.json(data);
}
