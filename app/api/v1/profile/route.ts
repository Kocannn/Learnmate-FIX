import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...data,
        education: {
          upsert: data.education.map((edu: any) => ({
            where: { id: edu.id || "" },
            update: edu,
            create: edu,
          })),
        },
        experience: {
          upsert: data.experience.map((exp: any) => ({
            where: { id: exp.id || "" },
            update: exp,
            create: exp,
          })),
        },
        availability: {
          upsert: data.availability.map((avail: any) => ({
            where: { id: avail.id || "" },
            update: avail,
            create: avail,
          })),
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
