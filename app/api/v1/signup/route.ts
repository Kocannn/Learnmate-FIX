import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid request body" }),
        { status: 400 },
      );
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exist) {
      return new NextResponse(
        JSON.stringify({ message: "User Already Exists" }),
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: `Internal Server Error ${error}` }),
      { status: 500 },
    );
  }
}
