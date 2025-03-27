import { Plus, Trash, Calendar, Clock, X, BadgeCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "../ui/badge";

interface AvailabilityTabProps {
  userData: {
    availability: Array<{ day: string; slots: string[] }>;
    [key: string]: any;
  };
  editMode: boolean;
  setShowAddExperience: (show: boolean) => void;
}
export default function AvailabilityTab({
  userData,
  editMode,
}: AvailabilityTabProps) {
  // Make sure userData.availability is an array

  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Ketersediaan</CardTitle>
          <CardDescription>
            Atur jadwal ketersediaan Anda untuk sesi mentoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userData.availability.map((schedule: any, index: number) => (
            <div key={index} className="pb-6 border-b last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-medium">{schedule.day}</h3>
                </div>
                {editMode && (
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4 mr-2 text-destructive" />
                    Hapus
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {schedule.slots.map((time: string, i: number) => (
                  <div key={i} className="relative group">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                    </Button>
                    {editMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {editMode && (
                  <Button variant="outline" className="border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Slot
                  </Button>
                )}
              </div>
            </div>
          ))}

          {editMode && (
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Hari Baru
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Sesi</CardTitle>
          <CardDescription>
            Konfigurasi pengaturan untuk sesi mentoring Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="session-duration">Durasi Sesi Default</Label>
            <Select defaultValue="60">
              <SelectTrigger id="session-duration" className="mt-1">
                <SelectValue placeholder="Pilih durasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 menit</SelectItem>
                <SelectItem value="60">60 menit</SelectItem>
                <SelectItem value="90">90 menit</SelectItem>
                <SelectItem value="120">120 menit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="buffer-time">Waktu Jeda Antar Sesi</Label>
            <Select defaultValue="15">
              <SelectTrigger id="buffer-time" className="mt-1">
                <SelectValue placeholder="Pilih waktu jeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tidak ada jeda</SelectItem>
                <SelectItem value="5">5 menit</SelectItem>
                <SelectItem value="10">10 menit</SelectItem>
                <SelectItem value="15">15 menit</SelectItem>
                <SelectItem value="30">30 menit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-confirm">Konfirmasi Otomatis</Label>
              <p className="text-sm text-muted-foreground">
                Otomatis konfirmasi booking sesi tanpa persetujuan manual
              </p>
            </div>
            <Switch id="auto-confirm" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder">Pengingat Sesi</Label>
              <p className="text-sm text-muted-foreground">
                Kirim pengingat email/SMS sebelum sesi dimulai
              </p>
            </div>
            <Switch id="reminder" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrasi Zoom</CardTitle>
          <CardDescription>
            Konfigurasi integrasi Zoom untuk sesi mentoring online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center p-4 border rounded-lg">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <svg
                xmlns="<http://www.w3.org/2000/svg>"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-blue-600"
              >
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                <rect x="3" y="6" width="12" height="12" rx="2" ry="2" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">Zoom</p>
              <p className="text-sm text-muted-foreground">
                Akun terhubung: {userData.email}
              </p>
            </div>
            <Badge className="ml-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <BadgeCheck className="h-3 w-3 mr-1" />
              Terhubung
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-generate">Generate Link Otomatis</Label>
              <p className="text-sm text-muted-foreground">
                Otomatis membuat link Zoom saat booking dikonfirmasi
              </p>
            </div>
            <Switch id="auto-generate" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
