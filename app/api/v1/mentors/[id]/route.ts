import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const includeReviews = url.searchParams.get("includeReviews") === "true";
  const mentor = await prisma.user.findUnique({
    where: {
      id: id,
      isMentor: true,
    },
    include: {
      experience: true,
      education: true,
      availability: true,

      ...(includeReviews && {
        receivedReviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      }),
    },
  });

  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
  }
  return NextResponse.json(mentor);
}
