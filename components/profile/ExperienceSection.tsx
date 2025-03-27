import { Plus, UserCircle, PencilIcon, Trash2Icon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExperienceSectionProps {
  userData: any;
  editMode: boolean;
  setShowAddExperience: (show: boolean) => void;
}

export default function ExperienceSection({
  userData,
  editMode,
  setShowAddExperience,
}: ExperienceSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pengalaman</CardTitle>
          <CardDescription>Riwayat pengalaman kerja Anda</CardDescription>
        </div>
        {editMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddExperience(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userData.experience &&
            userData.experience.map(
              (
                exp: { company: string; position: string; duration: string },
                index: number,
              ) => (
                <div
                  key={`experience-${index}`}
                  className="flex justify-between"
                >
                  <div>
                    <h4 className="font-medium">{exp.company}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exp.position}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {exp.duration}
                    </p>
                  </div>
                  {editMode && (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ),
            )}

          {userData.experience.length === 0 && (
            <div className="text-center py-4">
              <UserCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Belum ada data pengalaman
              </p>
              {editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowAddExperience(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pengalaman
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
