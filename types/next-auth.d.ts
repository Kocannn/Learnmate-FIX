import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      date?: Date;
      name?: string;
      email?: string | null;
      image?: string | null;
      hasCompletedOnboarding?: boolean;
      location?: string;
      phone?: string | null;
      bio?: string;
      profileImage?: string | null;
      joinDate?: string | null;
      interests?: string[] | null;
      completedSessions?: number;
      totalHours?: number;
      mentorCount?: number;
      isMentor?: boolean;
      expertise?: string[] | null;
      rate?: number;
      rating?: number | null;
      reviewCount?: number;
      education?: Education[];
      experience?: Experience[];
    };
  }

  interface Education {
    institution: string;
    degree: string;
    year: string;
  }

  interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }

  interface User {
    id?: string;
    name?: string;
    email?: string | null;
    image?: string | null;
    hasCompletedOnboarding?: boolean;
    location?: string;
    phone?: string | null;
    bio?: string;
    profileImage?: string | null;
    joinDate?: string | null;
    interests?: string[] | null;
    completedSessions?: number;
    totalHours?: number;
    mentorCount?: number;
    isMentor?: boolean;
    expertise?: string[] | null;
    education?: Education[];
    experience?: Experience[];
    rate?: number;
    rating?: number | null;
    reviewCount?: number;
  }
}
