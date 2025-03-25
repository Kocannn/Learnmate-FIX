import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface MeetingErrorProps {
  title?: string;
  description?: string;
}

export function MeetingError({
  title = "Meeting Link Not Found",
  description = "This meeting doesn't have a Zoom link yet.",
}: MeetingErrorProps) {
  const router = useRouter();

  return (
    <div className="container max-w-3xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-500">
            <AlertCircle className="inline mr-2 h-6 w-6" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Zoom meeting might not have been created yet. Please try the
            following:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Return to the booking page and confirm your booking</li>
            <li>Contact your mentor to set up a Zoom meeting</li>
            <li>Try refreshing this page</li>
          </ul>
          <Button
            className="w-full mt-4"
            onClick={() => router.push("/dashboard/booking")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
