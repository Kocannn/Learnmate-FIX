import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Anda harus login untuk memberikan ulasan" },
        { status: 401 },
      );
    }

    // Get the user ID from the session
    const userId = session.user.id;

    // Parse the request body
    const { mentorId, rating, comment } = await request.json();

    console.log("mentorId:", mentorId);
    console.log("rating:", rating);
    console.log("comment:", comment);
    // Validate required fields
    if (!mentorId || !rating || !comment) {
      return NextResponse.json(
        { error: "Mentee ID, rating, dan komentar diperlukan" },
        { status: 400 },
      );
    }

    // Create the review in the database
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        mentorId,
        userId,
      },
    });

    // Update mentor's average rating
    await updateMentorRating(mentorId);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Gagal membuat ulasan" },
      { status: 500 },
    );
  }
}

// Helper function to update mentor's average rating
async function updateMentorRating(mentorId: string) {
  const reviews = await prisma.review.findMany({
    where: { mentorId },
    select: { rating: true },
  });

  if (reviews.length > 0) {
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await prisma.user.update({
      where: { id: mentorId },
      data: { rating: parseFloat(averageRating.toFixed(1)) },
    });
  }
}
