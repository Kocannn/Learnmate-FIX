import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  try {
    const meeting = await prisma.booking.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        topic: true,
        zoomMeetingId: true,
        zoomJoinUrl: true,
        mentor: { select: { name: true } },
        student: { select: { name: true } },
      },
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Failed to fetch meeting:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting" },
      { status: 500 },
    );
  }
}
