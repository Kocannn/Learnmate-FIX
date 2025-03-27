import { X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SkillsSectionProps {
  userData: any;
  userType: "mentor" | "mentee";
  editMode: boolean;
  handleAddInterests: (interests: string[]) => void;
}

export default function SkillsSection({
  userData,
  userType,
  editMode,
  handleAddInterests,
}: SkillsSectionProps) {
  const [skills, setSkills] = useState<string[]>([]);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Keahlian</CardTitle>
          <CardDescription>
            {userType === "mentor"
              ? "Keahlian yang Anda ajarkan"
              : "Keahlian yang ingin Anda pelajari"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mt-2">
          {/* Add proper null check and handle both undefined and empty array cases */}
          {userData && userData.interests && userData.interests.length > 0 ? (
            userData.interests.map((skill: string, index: number) => (
              <Badge
                key={`skill-${index}`}
                variant="outline"
                className="px-3 py-1"
              >
                {skill}
                {editMode && (
                  <button
                    className="ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      // Handle remove skill logic would go here
                      console.log("Remove skill:", skill);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada keahlian yang ditambahkan
            </p>
          )}
        </div>

        {editMode && (
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Tambahkan keahlian"
              className="flex-1"
              value={skills.join(", ")}
              onChange={(e) => {
                const value = e.target.value;
                if (value !== skills.join(", ")) {
                  setSkills(value.split(", ").filter((skill) => skill));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddInterests(skills);
                  setSkills([]);
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleAddInterests(skills);
                setSkills([]);
              }}
            >
              Tambah
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
