"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MeetingHeader } from "@/components/meetings/meeting-header";
import { MeetingJoinOptions } from "@/components/meetings/meeting-join-options";
import { MeetingError } from "@/components/meetings/meeting-error";

interface Meeting {
  id: string;
  topic: string;
  date: string;
  zoomJoinUrl?: string;
  zoomMeetingId?: string;
  mentor?: {
    id: string;
    name: string;
  };
}

export default function MeetingRoom() {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const res = await fetch(`/api/v1/meetings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch meeting");
        const data = await res.json();
        setMeeting(data);

        // Debug: Log the meeting data to inspect zoomJoinUrl
        console.log("Meeting data:", data);
      } catch (err) {
        setError("Could not load meeting details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeeting();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!meeting) {
    return <div className="p-10 text-center">Meeting not found</div>;
  }

  if (!meeting.zoomJoinUrl) {
    return <MeetingError />;
  }

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <MeetingHeader title={meeting.topic} />

      <Tabs defaultValue="meeting" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="meeting">Sesi Meeting</TabsTrigger>
          <TabsTrigger value="info">Informasi Sesi</TabsTrigger>
        </TabsList>

        <TabsContent value="meeting">
          <MeetingJoinOptions
            zoomJoinUrl={meeting.zoomJoinUrl}
            mentorName={meeting.mentor?.name || "mentor"}
          />
        </TabsContent>

        <TabsContent value="info">
          {/* Info tab content goes here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
