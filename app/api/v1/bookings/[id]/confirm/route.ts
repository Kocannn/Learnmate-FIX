import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    // Get the booking first to make sure it exists
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }

    // Update booking status to confirmed
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "confirmed",
        // You could update other fields here as needed
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm booking" },
      { status: 500 },
    );
  }
}
