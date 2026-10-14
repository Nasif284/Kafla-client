import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": "suggestions.placePrediction.place,suggestions.placePrediction.text.text",
    },
    body: JSON.stringify({
      input,
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
