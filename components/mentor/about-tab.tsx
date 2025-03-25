import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Experience {
  position: string;
  company: string;
  years: string;
}

interface AboutTabProps {
  mentor: {
    bio?: string;
    experience?: Experience[];
  };
}

export function AboutTab({ mentor }: AboutTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tentang Mentor</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {mentor.bio || "Tidak ada deskripsi tersedia."}
        </p>

        <h3 className="font-semibold mt-6 mb-2 flex items-center">
          <Award size={18} className="mr-2 text-primary" />
          Pengalaman
        </h3>
        <ul className="space-y-2">
          {mentor.experience?.map((exp, index) => (
            <li key={index} className="border-b border-border pb-2">
              <div className="font-medium">{exp.position}</div>
              <div className="text-sm text-muted-foreground">
                {exp.company} • {exp.years}
              </div>
            </li>
          )) || <li>Tidak ada data pengalaman</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
