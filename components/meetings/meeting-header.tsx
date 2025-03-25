import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingHeaderProps {
  title: string;
}

export function MeetingHeader({ title }: MeetingHeaderProps) {
  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/dashboard/booking">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Jadwal Sesi
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">{title}</h1>
    </>
  );
}
