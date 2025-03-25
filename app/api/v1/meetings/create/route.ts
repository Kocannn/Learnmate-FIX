import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get these from environment variables
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

export async function POST(request: Request) {
  try {
    const { bookingId, mentorId, studentId, topic, startTime, duration } =
      await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 },
      );
    }

    // Get Zoom access token
    const tokenResponse = await fetch(`https://zoom.us/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID as string,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error("Failed to get Zoom access token:", tokenData);
      return NextResponse.json(
        { success: false, error: "Failed to get Zoom access token" },
        { status: 500 },
      );
    }

    const accessToken = tokenData.access_token;

    const meetingResponse = await fetch(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          type: 2, // Scheduled meeting
          start_time: startTime, // ISO format: 2023-10-24T15:00:00Z
          duration, // Duration in minutes
          timezone: "Asia/Jakarta",
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true, // Changed to true for better user experience
            waiting_room: false, // Changed to false for easier joining
          },
        }),
      },
    );

    const meetingData = await meetingResponse.json();
    if (!meetingData.id) {
      console.error("Failed to create Zoom meeting:", meetingData);
      return NextResponse.json(
        { success: false, error: "Failed to create Zoom meeting" },
        { status: 500 },
      );
    }

    console.log(meetingData);
    // Save meeting details to database
    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        zoomMeetingId: meetingData.id.toString(), // Convert to string to ensure compatibility
        zoomJoinUrl: meetingData.join_url,
        zoomStartUrl: meetingData.start_url,
      },
    });

    return NextResponse.json({
      success: true,
      meetingId: meetingData.id,
      joinUrl: meetingData.join_url,
      booking: booking, // Return the updated booking data
    });
  } catch (error) {
    console.error("Failed to create meeting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create meeting" },
      { status: 500 },
    );
  }
}
