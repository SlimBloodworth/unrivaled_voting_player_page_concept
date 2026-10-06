import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResults } from "@/lib/results";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const candidateId = (body as { candidateId?: unknown })?.candidateId;
  if (typeof candidateId !== "number" || !Number.isInteger(candidateId)) {
    return NextResponse.json(
      { error: "candidateId must be a whole number" },
      { status: 400 }
    );
  }

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    await prisma.vote.create({ data: { candidateId } });

    const results = await getResults();
    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("Failed to record vote:", error);
    return NextResponse.json({ error: "Could not record vote" }, { status: 500 });
  }
}