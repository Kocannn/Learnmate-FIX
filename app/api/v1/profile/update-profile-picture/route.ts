import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await getServerSession();

  console.log(session)
  const { data } = await request.json();

  console.log(data)

  if (!session?.user.email || !data?.fullPath) {
    throw new Error('Invalid session or data provided');
  }

  await prisma.user.update({
    where: {
      email: session?.user.email,
    },
    data: {
      profileImage: `https://fhpxusxofboncwiozcmf.supabase.co/storage/v1/object/public/${data.fullPath}`,
    },
  });

  return new Response(JSON.stringify({ message: "Profile picture updated" }), {
    status: 200,
  });
}
