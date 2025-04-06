import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export async function DELETE(req: Request) {
  try {

    const { id } = await req.json()

    const prismaResponse = await prisma.education.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ ok: true, data: prismaResponse }, { status: 200 })
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ ok: false, error: "Failed to delete education" }, { status: 500 })
  }
}

