import { NextResponse } from "next/server";
import { getArticles } from "@/lib/hipinup-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const collection = await getArticles({
    search: query || undefined,
    perPage: 5,
  });

  return NextResponse.json(
    { items: collection?.items || [] },
    {
      headers: {
        "Cache-Control": query
          ? "public, s-maxage=30, stale-while-revalidate=120"
          : "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
