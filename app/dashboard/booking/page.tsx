"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BookingCard } from "@/components/booking-card";
import { EmptyState } from "@/components/empty-state";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { PaginationControls } from "@/components/pagination-controls";
import { SearchFilter } from "@/components/search-filter";
import type { Booking } from "@/app/dashboard/booking/types";
import { UserProvider, useUser } from "@/context/UserContext";

export function BookingsPageContent() {
  const { user } = useUser();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
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
  }, []);

  // Filter bookings based on search term
  const filteredUpcoming = upcomingBookings.filter(
    (booking) =>
      booking.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPast = pastBookings.filter(
    (booking) =>
      booking.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(
    (activeTab === "upcoming" ? filteredUpcoming.length : filteredPast.length) /
      itemsPerPage,
  );

  // Get current page items
  const currentItems =
    activeTab === "upcoming"
      ? filteredUpcoming.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage,
        )
      : filteredPast.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage,
        );

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-muted/40">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Jadwal Sesi
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Sesi mentoring yang telah di jadwalkan
          </p>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
        />

        <Tabs
          defaultValue="upcoming"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            setCurrentPage(1); // Reset to first page when switching tabs
          }}
        >
          <TabsList className="h-14 w-full bg-background mb-6">
            <TabsTrigger
              value="upcoming"
              className="text-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2 px-6"
            >
              <CalendarIcon className="h-5 w-5 mr-2" /> Mendatang
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="text-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2 px-6"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" /> Selesai
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="upcoming">
            {loading ? (
              <LoadingSkeleton count={2} isPast={false} />
            ) : activeTab === "upcoming" && currentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentItems.map((booking) => (
                    <BookingCard
                      mentor={user?.isMentor}
                      key={booking.id}
                      booking={booking}
                      isPast={false}
                    />
                  ))}
                </div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </>
            ) : (
              <EmptyState
                icon={CalendarIcon}
                title="Belum Ada Sesi Mendatang"
                description="Anda belum memiliki jadwal sesi mentoring yang akan datang. Jadwalkan sesi dengan mentor untuk mulai belajar."
                showAction={true}
                actionLink="/dashboard/mentors"
                actionText="Temukan Mentor"
              />
            )}
          </TabsContent>

          {/* Past Sessions Tab Content */}
          <TabsContent value="past">
            {loading ? (
              <LoadingSkeleton count={2} isPast={true} />
            ) : activeTab === "past" && currentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentItems.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      isPast={true}
                    />
                  ))}
                </div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="Belum Ada Sesi Selesai"
                description="Anda belum menyelesaikan sesi mentoring apapun. Selesaikan sesi untuk melihat riwayatnya di sini."
                showAction={false}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
export default function BookingsPage() {
  return (
    <UserProvider>
      <BookingsPageContent />
    </UserProvider>
  );
}
