"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { GenerateOrderID } from "@/lib/utils";

import { ProfileSidebar } from "@/components/mentor/profile-sidebar";
import { AboutTab } from "@/components/mentor/about-tab";
import { ScheduleTab } from "@/components/mentor/schedule-tab";
import { ReviewsTab } from "@/components/mentor/reviews-tab";

export default function MentorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch mentor data initially and when ID changes
  useEffect(() => {
    fetchMentorData();
  }, [id]);

  async function fetchMentorData() {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/mentors/${id}?includeReviews=true`);
      if (!response.ok) throw new Error("Failed to fetch mentor data");
      const data = await response.json();
      setMentor(data);
    } catch (error) {
      console.error("Error fetching mentor data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReview(rating: number, comment: string) {
    if (!comment) {
      toast({
        title: "Informasi tidak lengkap",
        description: "Mohon isi komentar ulasan",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await fetch("/api/v1/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: mentor?.id,
          rating,
          comment,
        }),
      });

      if (!response.ok) throw new Error("Gagal menambahkan ulasan");

      toast({ title: "Berhasil", description: "Ulasan berhasil ditambahkan" });

      // Refresh mentor data to show the new review
      fetchMentorData();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Gagal menambahkan ulasan",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  }

  async function handleBookSession(
    selectedDate: string,
    selectedTime: string,
    topic: string,
    notes: string,
  ) {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Informasi tidak lengkap",
        description: "Pilih tanggal dan waktu sesi terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    if (!topic) {
      toast({
        title: "Informasi tidak lengkap",
        description: "Mohon pilih topik untuk sesi mentoring",
        variant: "destructive",
      });
      return;
    }

    const orderId = GenerateOrderID();
    setIsBooking(true);
    try {
      // Format date for the API
      const sessionDateTime = `${selectedDate}T${selectedTime}`;

      // Create booking in the database
      const response = await fetch("/api/v1/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId: mentor?.id,
          date: sessionDateTime,
          time: selectedTime.slice(0, 5), // Extract HH:MM format from selectedTime
          duration: 60, // 1 hour sessions
          topic: topic,
          notes: notes,
          orderId: orderId,
        }),
      });
      if (!response.ok) {
        throw new Error("Gagal membuat booking");
      }

      const bookingData = await response.json();

      // Navigate to booking confirmation page with the booking ID
      router.push(`/dashboard/booking/confirm/${bookingData.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Gagal membuat booking",
        description:
          "Terjadi kesalahan saat membuat booking. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Mentor tidak ditemukan</h2>
          <p className="mt-2">Mentor yang Anda cari tidak tersedia</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/mentors")}
          >
            Kembali ke Daftar Mentor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Mentor Profile Section */}
        <div className="md:col-span-1">
          <ProfileSidebar mentor={mentor} />
        </div>

        {/* Main Content Section */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="about">Tentang</TabsTrigger>
              <TabsTrigger value="schedule">Jadwal Sesi</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <AboutTab mentor={mentor} />
            </TabsContent>

            <TabsContent value="schedule">
              <ScheduleTab
                mentor={mentor}
                onSchedule={handleBookSession}
                isBooking={isBooking}
              />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab
                mentor={mentor}
                onSubmitReview={handleSubmitReview}
                isSubmittingReview={isSubmittingReview}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
