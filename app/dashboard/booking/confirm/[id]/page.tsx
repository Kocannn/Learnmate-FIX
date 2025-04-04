"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function BookingConfirmPage() {
  const router = useRouter();
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingStatus, setProcessingStatus] = useState({
    status: "idle", // idle, processing, success, error
    message: "",
  });
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!clientKey) {
      console.error(
        "Midtrans client key is not defined in environment variables",
      );
      setError(
        "Configuration error: Payment gateway is not properly configured",
      );
      setLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.type = "text/javascript";

    document.body.appendChild(script);

    if (!id) {
      setError("Booking ID tidak ditemukan");
      setLoading(false);
      return;
    }

    async function fetchBookingDetails() {
      try {
        const response = await fetch(`/api/v1/bookings/${id}`);

        if (!response.ok) {
          throw new Error("Gagal mengambil data booking");
        }

        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError("Terjadi kesalahan saat memuat detail booking");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, []);

  const checkoutHandler = async () => {
    const response = await fetch("/api/v1/payment/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: booking?.mentor.rate,
        orderId: booking?.id,
      }),
    });
    const result = await response.json();
    window.snap.pay(result.token, {
      onSuccess: function () {
        handleConfirmBooking();
      },
    });
  };
  // Create Zoom meeting and confirm booking status using Promise.all
  async function createZoomAndConfirmBooking() {
    if (!booking?.id) return false;

    setProcessingStatus({
      status: "processing",
      message: "Membuat Zoom meeting dan mengkonfirmasi booking...",
    });

    try {
      // Prepare Zoom meeting creation request
      const createZoomPromise = fetch("/api/v1/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          mentorId: booking.mentorId,
          studentId: booking.studentId,
          topic:
            booking.topic || `Sesi Mentoring dengan ${booking.mentor.name}`,
          startTime: booking.date,
          duration: booking.duration || 60,
        }),
      });

      // Prepare booking confirmation request
      const confirmBookingPromise = fetch(
        `/api/v1/bookings/${booking.id}/confirm`,
        {
          method: "PUT",
        },
      );

      // Execute both requests in parallel
      const [zoomResponse, bookingUpdateResponse] = await Promise.all([
        createZoomPromise,
        confirmBookingPromise,
      ]);

      // Parse and validate zoom response
      const zoomData = await zoomResponse.json();
      if (!zoomData.success) {
        throw new Error("Gagal membuat Zoom meeting");
      }

      // Validate booking update response
      if (!bookingUpdateResponse.ok) {
        throw new Error("Gagal mengkonfirmasi booking");
      }

      return true;
    } catch (err) {
      console.error("Error in confirmation process:", err);
      setProcessingStatus({
        status: "error",
        message:
          "Terjadi kesalahan saat membuat Zoom meeting atau mengkonfirmasi booking.",
      });
      return false;
    }
  }

  // Handle success and redirect
  function handleSuccess() {
    setProcessingStatus({
      status: "success",
      message: "Booking berhasil dikonfirmasi dan Zoom meeting telah dibuat!",
    });

    // Wait before redirecting for better UX
    setTimeout(() => {
      router.push(`/dashboard/meetings/${booking?.id}`);
    }, 1500);
  }

  // Main function that coordinates the flow
  async function handleConfirmBooking() {
    if (!booking?.id) return;

    setProcessingStatus({
      status: "processing",
      message: "Memproses pembayaran dan membuat sesi...",
    });

    try {
      // Combined step: Create Zoom and confirm booking
      const success = await createZoomAndConfirmBooking();

      if (success) {
        // Handle success and redirect
        handleSuccess();
      }
    } catch (err) {
      console.error("Error in confirmation process:", err);
      setProcessingStatus({
        status: "error",
        message: "Terjadi kesalahan selama proses konfirmasi.",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">Memuat detail booking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Terjadi Kesalahan</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/booking">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Booking
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Booking Tidak Ditemukan</CardTitle>
            <CardDescription>
              Detail booking tidak dapat ditemukan.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/booking">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Booking
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/booking">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Booking
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Konfirmasi Booking</h1>

      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Detail Sesi Mentoring</CardTitle>
          <CardDescription>Pastikan detail sesi sudah sesuai</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src={booking.mentor.profileImage || "/placeholder-avatar.jpg"}
                  alt={booking.mentor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{booking.mentor.name}</h3>
                <p className="text-sm text-gray-500">
                  {booking.mentor.expertise}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>
                  {formatTime(booking.date)} ({booking.duration} menit)
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Topik Sesi</h4>
              <p>{booking.topic || "Tidak disebutkan"}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Biaya</h4>
              <p className="text-xl font-bold">
                {formatCurrency(booking.mentor.rate || 0)}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col">
          {processingStatus.status === "idle" && (
            <Button className="w-full h-12 text-lg" onClick={checkoutHandler}>
              Konfirmasi & Buat Zoom Meeting
            </Button>
          )}

          {processingStatus.status === "processing" && (
            <div className="flex items-center justify-center w-full py-3">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>{processingStatus.message}</span>
            </div>
          )}

          {processingStatus.status === "success" && (
            <div className="flex items-center justify-center w-full py-3 text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{processingStatus.message}</span>
            </div>
          )}

          {processingStatus.status === "error" && (
            <div className="flex flex-col items-center w-full py-3">
              <div className="flex items-center text-red-500 mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{processingStatus.message}</span>
              </div>
              <Button variant="outline" onClick={handleConfirmBooking}>
                Coba Lagi
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
