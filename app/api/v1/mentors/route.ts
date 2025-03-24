import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const mentors = await prisma.user.findMany({
      where: {
        isMentor: true,
      },
      select: {
        id: true,
        name: true,
        interests: true,
        rating: true,
        rate: true,
        profileImage: true,
        bio: true,
        reviewCount: true,
      },
    });

    return NextResponse.json(mentors);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
