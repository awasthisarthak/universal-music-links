import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing Spotify credentials" },
      { status: 500 }
    );
  }

  const tokenResp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResp.ok) {
    return NextResponse.json(
      { error: "Failed to authenticate with Spotify" },
      { status: 500 }
    );
  }

  const tokenData = await tokenResp.json();

  const searchResp = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(
      q
    )}`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  if (!searchResp.ok) {
    return NextResponse.json(
      { error: "Spotify search failed" },
      { status: 500 }
    );
  }

  const searchData = await searchResp.json();
  const url = searchData.tracks?.items?.[0]?.external_urls?.spotify || null;

  return NextResponse.json({ url });
}
