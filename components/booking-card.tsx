import Link from "next/link";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock, Video, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Booking } from "../app/dashboard/booking/types";
import { StatusBadge } from "./status-badges";

interface BookingCardProps {
  booking: Booking;
  isPast?: boolean;
  mentor?: boolean;
}

export function BookingCard({
  booking,
  isPast = false,
  mentor,
}: BookingCardProps) {
  // Format date function
  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Format time function
  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  // Calculate time until session
  const getTimeUntil = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
      locale: id,
    });
  };

  console.log("Booking Card", booking);
  return (
    <Card
      className={`overflow-hidden border-l-4 ${
        isPast ? "border-l-gray-400" : "border-l-primary"
      } shadow-md hover:shadow-lg transition-all`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <CardTitle className="text-2xl">
              {booking.topic || "Sesi Mentoring"}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={booking.mentor.profileImage || "/placeholder-avatar.jpg"}
                  alt={booking.mentor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">
                  {mentor
                    ? `${booking.student.name}`
                    : `${booking.mentor.name}`}
                </div>
                {mentor ? null : (
                  <div className="text-xs text-muted-foreground">
                    {booking.mentor.expertise}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={booking.status} />
            {!isPast && (
              <div className="text-sm text-muted-foreground">
                {getTimeUntil(booking.date)}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar
            className={`h-5 w-5 ${isPast ? "text-gray-500" : "text-primary"}`}
          />
          <span>{formatSessionDate(booking.date)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock
            className={`h-5 w-5 ${isPast ? "text-gray-500" : "text-primary"}`}
          />
          <span>
            {formatSessionTime(booking.date)} ({booking.duration} menit)
          </span>
        </div>
        {!isPast && booking.zoomJoinUrl && (
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-primary" />
            <a
              href={booking.zoomJoinUrl}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Link Zoom Meeting
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-4 border-t pt-6">
        <Button variant="outline" className="flex-1 h-12" asChild>
          <Link href={`/dashboard/mentors/${booking.mentorId}`}>
            <User className="h-4 w-4 mr-2" /> Profil Mentor
          </Link>
        </Button>
        {!isPast && booking.status === "confirmed" && booking.zoomJoinUrl ? (
          <Button
            className="flex-1 h-12 bg-primary hover:bg-primary/90"
            asChild
          >
            <Link href={`/dashboard/meetings/${booking.id}`}>
              <Video className="h-4 w-4 mr-2" /> Join Meeting
            </Link>
          </Button>
        ) : !isPast && booking.status === "pending" ? (
          <Button
            className="flex-1 h-12 bg-amber-500 hover:bg-amber-600"
            asChild
          >
            <Link href={`/dashboard/booking/confirm?id=${booking.id}`}>
              <Calendar className="h-4 w-4 mr-2" /> Konfirmasi Booking
            </Link>
          </Button>
        ) : isPast && booking.status === "completed" && !booking.reviewed ? (
          <Button
            className="flex-1 h-12 bg-primary hover:bg-primary/90"
            asChild
          >
            <Link href={`/dashboard/reviews/create?bookingId=${booking.id}`}>
              <Clock className="h-4 w-4 mr-2" /> Beri Ulasan
            </Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
