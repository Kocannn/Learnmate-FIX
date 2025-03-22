declare global {
  interface Window {
    snap: any;
  }
  type Booking = {
    id: string;
    mentorId: string;
    studentId: string;
    topic: string;
    date: string; // Gunakan Date jika ingin parsing otomatis
    time?: string;
    duration: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    notes: string | null;
    zoomMeetingId: string | null;
    zoomJoinUrl: string | null;
    zoomPassword: string | null;
    zoomStartUrl: string | null;
    reviewed: boolean;
    mentor: {
      id: string;
      name: string;
      profileImage: string;
      expertise: string[];
      rate: number;
    };
    student: {
      id: string;
      name: string;
      email: string;
    };
    price: number;
  };
  type Availability = {
    day: string;
    timeSlots: string[];
  };

  type Education = {
    institution: string;
    degree: string;
    year: number;
  };

  type Experience = {
    company: string;
    position: string;
    years: number;
  };

  type review = {
    id: string;
    bookingId: string;
    mentorId: string;
    studentId: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
    student: {
      id: string;
      name: string;
      email: string;
      profileImage: string;
    };
    user: User;
    comment: string;
  };

  type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    phone: string;
    image: string | null;
    location: string;
    hasCompletedOnboarding: boolean;
    bio: string;
    profileImage: string;
    availability: Availability[];
    completedSessions: number;
    createdAt: string;
    education: Education[];
    experience: Experience[];
    expertise: string[];
    interests: string[];
    isMentor: boolean;
    joinDate: string;
    mentorCount: number;
    password: string;
    rate: number;
    rating: string;
    reviewCount: number;
    totalHours: number;
    updatedAt: string;
    sessionsCompleted: string;
    receivedReviews: review[];
  };
}

export {};
