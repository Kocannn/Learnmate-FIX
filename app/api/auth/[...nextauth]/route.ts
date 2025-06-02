import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials) {
          throw new Error("Credentials not provided.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          throw new Error("Email atau password salah.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Ambil data terbaru dari database berdasarkan email pengguna
        const updatedUser = await prisma.user.findUnique({
          where: { email: (session.user.email as string) || undefined },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            location: true,
            hasCompletedOnboarding: true,
            bio: true,
            profileImage: true,
            joinDate: true,
            interests: true,
            completedSessions: true,
            totalHours: true,
            mentorCount: true,
            isMentor: true,
            expertise: true,
            rate: true,
            rating: true,
            reviewCount: true,
            education: true,
            experience: true,
          },
        });

        if (updatedUser) {
          session.user = updatedUser;
          token.user = updatedUser;
        }
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const userProfile = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            location: true,
            hasCompletedOnboarding: true,
            bio: true,
            profileImage: true,
            joinDate: true,
            interests: true,
            completedSessions: true,
            totalHours: true,
            mentorCount: true,
            isMentor: true,
            expertise: true,
            rate: true,
            rating: true,
            reviewCount: true,
          },
        });

        token.user = userProfile;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
