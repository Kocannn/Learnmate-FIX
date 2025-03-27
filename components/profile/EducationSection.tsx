import { Plus, GraduationCap, PencilIcon, Trash2Icon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EducationSectionProps {
  userData: any;
  editMode: boolean;
  formData: any;
  setShowAddEducation: (show: boolean) => void;
}

export default function EducationSection({
  userData,
  editMode,
  setShowAddEducation,
}: EducationSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pendidikan</CardTitle>
          <CardDescription>Riwayat pendidikan Anda</CardDescription>
        </div>
        {editMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddEducation(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userData?.education &&
            userData?.education.map(
              (
                edu: { institution: string; degree: string; year: string },
                index: number,
              ) => (
                <div
                  key={`education-${index}`}
                  className="flex justify-between"
                >
                  <div>
                    <h4 className="font-medium">{edu.institution}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree}
                    </p>
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
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

          {userData?.education?.length === 0 && (
            <div className="text-center py-4">
              <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Belum ada data pendidikan
              </p>
              {editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowAddEducation(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pendidikan
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
