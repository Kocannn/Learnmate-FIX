import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
interface Education {
  institution: string;
  degree: string;
  year: string;
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  console.log(data);

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      include: {
        education: true,
      },
      data: {
        location: data.location,
        bio: data.bio,
        interests: data.interests,
      },
    });

    // Handle education data
    if (data.education && data.education.length > 0) {
      // Separate existing and new education entries
      const existingEducation = data.education.filter((item: any) => item.id);
      const newEducation = data.education
        .filter((item: any) => !item.id)
        .map((item: Education) => ({
          userId: data.id,
          institution: item.institution,
          degree: item.degree,
          year: item.year,
        }));

      // Create new education entries if any
      if (newEducation.length > 0) {
        await prisma.education.createMany({
          data: newEducation,
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
