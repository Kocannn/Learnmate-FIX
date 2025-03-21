import { getServerSession } from "next-auth";
import { authOptins } from "@/app/api/auth/[...nextauth]/route";

export const authUserSession = async () => {
  try {
    const session = await getServerSession(authOptions);
    const session?.user || null
  } catch (error) {
    console.log("Error fetching session", error);
    return null;
  }
}
