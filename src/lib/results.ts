import { prisma } from "@/lib/prisma";

export type CandidateResult = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  votes: number;
  percentage: number;
};

export async function getResults(): Promise<{
  totalVotes: number;
  candidates: CandidateResult[];
}> {
  const rows = await prisma.candidate.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { votes: true } } },
  });

  const totalVotes = rows.reduce((sum, row) => sum + row._count.votes, 0);

  const candidates = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.imageUrl,
    votes: row._count.votes,
    percentage:
      totalVotes > 0 ? Math.round((row._count.votes / totalVotes) * 100) : 0,
  }));

  return { totalVotes, candidates };
}