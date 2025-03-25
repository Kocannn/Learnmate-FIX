import { useState } from "react";
import Image from "next/image";
import { User, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface MeetingJoinOptionsProps {
  zoomJoinUrl: string;
  mentorName: string;
}

export function MeetingJoinOptions({
  zoomJoinUrl,
  mentorName,
}: MeetingJoinOptionsProps) {
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Function to directly open Zoom meeting in new tab (most reliable method)
  const openZoomMeeting = () => {
    window.open(zoomJoinUrl, "_blank");
  };

  // Function to attempt browser-based meeting join
  const joinInBrowser = () => {
    setJoining(true);
    setJoinError("");

    try {
      // Extract meeting number from URL
      // Example URL: https://us04web.zoom.us/j/1234567890?pwd=abcdef
      const urlMatch = zoomJoinUrl.match(/\/j\/(\d+)(?:\?pwd=([^&]+))?/);

      if (!urlMatch) {
        throw new Error("Could not extract meeting details from URL");
      }

      const meetingNumber = urlMatch[1];
      const password = urlMatch[2] || "";

      // Redirect to the browser version
      const browserUrl = `https://zoom.us/wc/${meetingNumber}/join?pwd=${password}`;
      window.open(browserUrl, "_blank");
    } catch (err) {
      console.error("Error joining meeting:", err);
      setJoinError(
        "Failed to join meeting in browser. Please try using the Zoom app option.",
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Zoom Meeting</CardTitle>
        <CardDescription>
          Sesi mentoring online dengan {mentorName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center rounded-md p-6 bg-muted/30 min-h-80">
          <Image
            src="https://zoom.us/cms/images/zoom-logo-transparent.png"
            alt="Zoom"
            width={120}
            height={30}
            className="mb-6"
          />
          <h3 className="text-xl font-bold mb-2">
            Bergabung Dalam Sesi Meeting
          </h3>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            Pilih metode untuk bergabung dengan sesi Zoom meeting
          </p>

          {joinError && (
            <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {joinError}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={joinInBrowser}
              disabled={joining}
            >
              <User className="mr-2 h-5 w-5" />
              Join in Browser
            </Button>

            <Button size="lg" className="flex-1" onClick={openZoomMeeting}>
              <ExternalLink className="mr-2 h-5 w-5" />
              Open in Zoom App
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground max-w-md text-center">
            Menggunakan browser lebih praktis, namun fitur mungkin terbatas.
            Untuk pengalaman terbaik, gunakan aplikasi Zoom.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
