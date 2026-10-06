import { NextResponse } from "next/server";
import { getResults } from "@/lib/results";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await getResults();
    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to load results:", error);
    return NextResponse.json(
      { error: "Could not load results" },
      { status: 500 }
    );
  }
}