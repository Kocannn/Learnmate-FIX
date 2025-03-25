import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./star-rating";

interface ProfileSidebarProps {
  mentor: any; // Replace with proper type
}

export function ProfileSidebar({ mentor }: ProfileSidebarProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={mentor.profileImage || "/placeholder.svg"}
              alt={mentor.name || "Mentor"}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold">{mentor.name}</h2>
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-1">Expertise</p>
            <div className="flex flex-wrap justify-center gap-2">
              {mentor.expertise?.map((exp: string, index: number) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full inline-block min-w-[60px] text-center"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center mt-2">
            <MapPin size={16} className="mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {mentor.location || "Indonesia"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {mentor.interests
              ?.slice(0, 3)
              .map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full inline-block min-w-[60px] text-center"
                >
                  {skill}
                </span>
              ))}
          </div>

          <Separator className="my-4" />

          <div className="w-full">
            <div className="flex justify-between mb-2 items-center">
              <span>Rating</span>
              <div className="flex items-center gap-1">
                <StarRating rating={parseFloat(mentor.rating)} size={14} />
                <span className="font-medium ml-1">
                  {mentor.rating || "4.8"}/5
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Sesi Selesai</span>
              <span className="font-medium">
                {mentor.sessionsCompleted || "24"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
