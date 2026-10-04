import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error("DIRECT_URL is missing from your .env file");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const players = [
  {
    name: "Breanna Stewart",
    description: "Forward",
    imageUrl: "/players/stewie-removebg.png",
  },
  {
    name: "Napheesa Collier",
    description: "Forward",
    imageUrl: "/players/phee-removebg.png",
  },
  {
    name: "Gabby Williams",
    description: "Forward/Wing",
    imageUrl: "/players/gabby-williams-removebg.png",
  },
  {
    name: "Olivia Miles",
    description: "Guard",
    imageUrl: "/players/olivia-miles-removebg.png",
  },
];

async function main() {
  const existing = await prisma.candidate.count();
  if (existing > 0) {
    console.log(`Found ${existing} candidates already. Nothing to do.`);
    return;
  }

  await prisma.candidate.createMany({ data: players });
  console.log(`Added ${players.length} candidates.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });