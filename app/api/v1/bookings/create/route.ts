import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 },
      );
    }

    // Get the current user ID
    const studentId = session.user.id;

    // Get data from request body
    const { mentorId, date, duration, topic, notes, time } =
      await request.json();

    // Validate required fields
    if (!mentorId || !date) {
      return NextResponse.json(
        { error: "Missing required fields: mentorId and date are required" },
        { status: 400 },
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        mentorId,
        time,
        studentId,
        topic,
        date: new Date(date),
        duration: duration || 60,
        notes: notes || null,
        status: "pending",
        // Initialize Zoom fields as null
        zoomMeetingId: null,
        zoomJoinUrl: null,
        zoomStartUrl: null,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 },
    );
  }
}
