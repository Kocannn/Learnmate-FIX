import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema for validation
const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  bio: z.string(),
  profileImage: z.string().optional(),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string(),
    }),
  ),
  interests: z.array(z.string()),
  experience: z
    .array(
      z.object({
        company: z.string(),
        position: z.string(),
        duration: z.string(),
      }),
    )
    .optional(),
  isMentor: z.boolean().default(false),
  expertise: z.array(z.string()).optional(),
  rate: z.number().optional(),
  availability: z
    .array(
      z.object({
        day: z.string(),
        slots: z.array(z.string()),
      }),
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    // 1. Update user's basic information
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        location: validatedData.location,
        bio: validatedData.bio,
        profileImage: validatedData.profileImage,
        interests: validatedData.interests,
        isMentor: validatedData.isMentor,
        expertise: validatedData.isMentor ? validatedData.expertise || [] : [],
        rate: validatedData.isMentor ? validatedData.rate : null,
      },
      select: { id: true },
    });

    // 2. Handle education records - delete existing and create new ones
    await prisma.education.deleteMany({
      where: { userId: updatedUser.id },
    });

    if (validatedData.education.length > 0) {
      await prisma.education.createMany({
        data: validatedData.education.map((edu) => ({
          ...edu,
          userId: updatedUser.id,
        })),
      });
    }

    // 3. Handle experience records - delete existing and create new ones
    await prisma.experience.deleteMany({
      where: { userId: updatedUser.id },
    });

    if (validatedData.experience && validatedData.experience.length > 0) {
      await prisma.experience.createMany({
        data: validatedData.experience.map((exp) => ({
          ...exp,
          userId: updatedUser.id,
        })),
      });
    }

    // 4. Handle availability records (for mentors)
    await prisma.availability.deleteMany({
      where: { userId: updatedUser.id },
    });

    if (
      validatedData.isMentor &&
      validatedData.availability &&
      validatedData.availability.length > 0
    ) {
      await prisma.availability.createMany({
        data: validatedData.availability.map((avail) => ({
          day: avail.day,
          slots: avail.slots,
          userId: updatedUser.id,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
