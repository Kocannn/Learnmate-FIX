"use client";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronRight, Clock, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Mentor {
  id: string;
  name: string;
  interests: string[];
  rating: number;
  rate: number | null;
  profileImage: string | null;
  bio: string | null;
  reviewCount: number;
}
interface Booking {
  id: string;
  mentor: Mentor;
  mentorId: string;
  studentId: string;
  student: any;
  topic: string;
  date: string;
  time: string; // Added time field for when the zoom meeting starts
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  zoomPassword?: string;
  reviewed?: boolean;
}
// Fetch all mentors function
async function getMentors() {
  const res = await fetch("/api/v1/mentors");
  if (!res.ok) {
    throw new Error("Failed to fetch mentors");
  }
  return res.json();
}

async function generateRecommendations(
  mentors: Mentor[],
  pastBookings: Booking[],
  currentUserId: string | null = null,
  limit = 3,
): Promise<Mentor[]> {
  // Filter out current user dengan type checking
  const filteredMentors = currentUserId
    ? mentors.filter((mentor) => mentor.id !== String(currentUserId))
    : mentors;

  const userInterests = new Set<string>();
  const mentorInteractionCount = new Map<string, number>();
  const pastMentorIds = new Set<string>();

  pastBookings.forEach((booking) => {
    if (booking.topic) {
      booking.topic
        .split(/,\s*/)
        .forEach((t) => userInterests.add(t.toLowerCase()));
    }
    pastMentorIds.add(booking.mentorId);
    mentorInteractionCount.set(
      booking.mentorId,
      (mentorInteractionCount.get(booking.mentorId) || 0) + 1,
    );
  });

  const scoredMentors = filteredMentors.map((mentor) => {
    let score = mentor.rating || 0;
    score += Math.min(Math.sqrt(mentor.reviewCount) / 2, 2);

    const interestMatchScore = mentor.interests.reduce(
      (sum, interest) =>
        userInterests.has(interest.toLowerCase()) ? sum + 0.75 : sum,
      0,
    );
    score += Math.min(interestMatchScore, 3);

    if (pastMentorIds.has(mentor.id)) {
      const interactionCount = mentorInteractionCount.get(mentor.id) || 0;
      score += Math.min(0.5 * Math.sqrt(interactionCount), 1.5);
    }

    if (mentor.reviewCount < 3) score -= 0.5;

    return {
      mentor,
      score,
      interestMatch: interestMatchScore > 0,
    };
  });

  scoredMentors.sort((a, b) => b.score - a.score);

  const diverseRecommendations = [];
  const interestMatched = scoredMentors.filter((item) => item.interestMatch);
  const otherOptions = scoredMentors.filter((item) => !item.interestMatch);

  if (interestMatched.length > 0) {
    diverseRecommendations.push(
      interestMatched[0].mentor,
      ...scoredMentors.slice(0, limit - 1).map((item) => item.mentor),
    );
  } else {
    diverseRecommendations.push(
      ...scoredMentors.slice(0, limit).map((item) => item.mentor),
    );
  }

  return Array.from(new Set(diverseRecommendations)).slice(0, limit);
}

export default function DashboardPage() {
  // Sample data for recommended mentors
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedMentors, setRecommendedMentors] = useState<Mentor[]>([]);
  const { data: user } = useSession();
  console.log(user)

  const currentUserId = user?.user?.id;
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    async function loadMentors() {
      try {
        const data = await getMentors();
        setMentors(data);
        // Generate recommendations based on past bookings
        const recommended = await generateRecommendations(
          data,
          pastBookings,
          currentUserId,
        );
        setRecommendedMentors(recommended);
      } catch (error) {
        console.error("Error loading mentors:", error);
      } finally {
        setLoading(false);
      }
    }
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // Fetch bookings from your API
        const response = await fetch("/api/v1/bookings");

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        // Separate bookings into upcoming and past based on date and status
        const now = new Date();
        const upcoming = data.bookings.filter(
          (booking: Booking) =>
            new Date(booking.date) > now ||
            (booking.status !== "completed" && booking.status !== "cancelled"),
        );

        const past = data.bookings.filter(
          (booking: Booking) =>
            new Date(booking.date) < now ||
            booking.status === "completed" ||
            booking.status === "cancelled",
        );

        setUpcomingBookings(upcoming);
        setPastBookings(past);
        setCurrentPage(1); // Reset to first page when data changes
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    loadMentors();
  }, [currentUserId]);
  // Sample data for upcoming sessions

  console.log(upcomingBookings);
  if (recommendedMentors.length !== 0) {
    console.log(recommendedMentors);
  }
  // Sort upcoming bookings by date & time and limit to even number
  const upcomingSessions = upcomingBookings
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 2);
  return (
    <div className="space-y-8">
      {/* Recommended Mentors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Mentor Rekomendasi</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/search">
              Lihat Semua
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? // Skeleton loaders while content is loading
            Array(3)
              .fill(0)
              .map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 h-12 animate-pulse" />
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex flex-col items-center -mt-8">
                      <div className="rounded-full border-4 border-white dark:border-slate-800 h-16 w-16 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                      <div className="mt-2 h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="flex items-center gap-1 mt-1">
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        <span className="text-xs">•</span>
                        <div className="flex items-center">
                          <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="text-sm text-center mt-3 space-y-2">
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t p-4">
                    <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  </CardFooter>
                </Card>
              ))
            : recommendedMentors.map((mentor) => (
              <Card key={mentor.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-12" />
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex flex-col items-center -mt-8">
                    <img
                      src={mentor.profileImage || "/placeholder.svg"}
                      alt={mentor.name}
                      className="rounded-full border-4 border-white dark:border-slate-800 h-16 w-16 bg-white"
                    />
                    <h3 className="mt-2 font-semibold text-lg">
                      {mentor.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {mentor.interests[0]}
                      </span>
                      <span className="text-xs">•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm ml-1">{mentor.rating}</span>
                        <span className="text-xs ml-1">
                          ({mentor.reviewCount})
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-center text-muted-foreground mt-3">
                      {mentor.bio}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t p-4">
                  <Button asChild>
                    <Link href={`/dashboard/mentors/${mentor.id}`}>
                      Lihat Profil
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sesi Mendatang</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/booking">
              Lihat Semua
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array(2)
              .fill(0)
              .map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 h-12 animate-pulse" />
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex flex-col items-center -mt-8">
                      <div className="rounded-full border-4 border-white dark:border-slate-800 h-16 w-16 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                      <div className="mt-2 h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="flex items-center gap-1 mt-1">
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        <span className="text-xs">•</span>
                        <div className="flex items-center">
                          <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="text-sm text-center mt-3 space-y-2">
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t p-4">
                    <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  </CardFooter>
                </Card>
              ))
            : upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className="text-base">{session.topic}</CardTitle>
                  <CardDescription>
                    {
                      user?.user.isMentor ? `dengan ${session.student.name}` : `dengan ${session.mentor.name}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{session.time}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Link href={`/dashboard/meetings/${session.id}`}>
                    <Button>Join Zoom</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          {upcomingSessions.length === 0 && !loading && (
            <Card className="col-span-2">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">
                  Tidak Ada Sesi Mendatang
                </h3>
                <p className="text-muted-foreground text-center mt-2">
                  Anda belum memiliki sesi mentoring yang dijadwalkan.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/search">
                    Cari Mentor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
