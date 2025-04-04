import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Fetch bookings where the user is either the mentor or the student
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [{ mentorId: userId }, { studentId: userId }],
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            expertise: true,
            rate: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      mentorId: booking.mentorId,
      studentId: booking.studentId,
      topic: booking.topic,
      date: booking.date.toISOString(),
      duration: booking.duration,
      status: booking.status,
      zoomJoinUrl: booking.zoomJoinUrl,
      zoomStartUrl: booking.zoomStartUrl,
      zoomPassword: booking.zoomPassword,
      notes: booking.notes,
      time: booking.time,
      reviewed: false, // This would come from a review table in a real system
      student: {
        id: booking.student.id,
        name: booking.student.name,
      },
      mentor: {
        id: booking.mentor.id,
        name: booking.mentor.name,
        profileImage: booking.mentor.profileImage,
        expertise: booking.mentor.expertise,
        rate: booking.mentor.rate,
      },
    }));

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
