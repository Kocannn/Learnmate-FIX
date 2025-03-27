import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface PreferencesTabProps {
  userData: any;
  isMentor?: boolean;
}

export default function PreferencesTab({ isMentor }: PreferencesTabProps) {
  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferensi Pembelajaran</CardTitle>
          <CardDescription>
            Atur preferensi pembelajaran Anda untuk mendapatkan rekomendasi yang
            lebih baik
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="learning-style">Gaya Belajar</Label>
            <Select defaultValue="visual">
              <SelectTrigger id="learning-style" className="mt-1">
                <SelectValue placeholder="Pilih gaya belajar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual</SelectItem>
                <SelectItem value="auditory">Auditori</SelectItem>
                <SelectItem value="reading">Membaca/Menulis</SelectItem>
                <SelectItem value="kinesthetic">Kinestetik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="session-frequency">
              Frekuensi Sesi yang Diinginkan
            </Label>
            <Select defaultValue="weekly">
              <SelectTrigger id="session-frequency" className="mt-1">
                <SelectValue placeholder="Pilih frekuensi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="biweekly">Dua Minggu Sekali</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="preferred-time">Waktu yang Disukai</Label>
            <Select defaultValue="evening">
              <SelectTrigger id="preferred-time" className="mt-1">
                <SelectValue placeholder="Pilih waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Pagi (08:00 - 12:00)</SelectItem>
                <SelectItem value="afternoon">Siang (12:00 - 17:00)</SelectItem>
                <SelectItem value="evening">Malam (17:00 - 21:00)</SelectItem>
                <SelectItem value="flexible">Fleksibel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tujuan Pembelajaran</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="goal-1"
                  className="rounded text-indigo-600"
                  defaultChecked
                />
                <Label htmlFor="goal-1" className="text-sm font-normal">
                  Meningkatkan Keterampilan Teknis
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="goal-2"
                  className="rounded text-indigo-600"
                  defaultChecked
                />
                <Label htmlFor="goal-2" className="text-sm font-normal">
                  Persiapan Karir
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="goal-3"
                  className="rounded text-indigo-600"
                />
                <Label htmlFor="goal-3" className="text-sm font-normal">
                  Pengembangan Proyek
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="goal-4"
                  className="rounded text-indigo-600"
                />
                <Label htmlFor="goal-4" className="text-sm font-normal">
                  Persiapan Wawancara
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isMentor && (
        <Card>
          <CardHeader>
            <CardTitle>Preferensi Mentor</CardTitle>
            <CardDescription>
              Atur preferensi untuk jenis mentor yang Anda inginkan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="experience-level">Tingkat Pengalaman</Label>
              <Select defaultValue="mid">
                <SelectTrigger id="experience-level" className="mt-1">
                  <SelectValue placeholder="Pilih tingkat pengalaman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (1-3 tahun)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 tahun)</SelectItem>
                  <SelectItem value="senior">Senior (5+ tahun)</SelectItem>
                  <SelectItem value="any">Tidak ada preferensi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="communication-style">Gaya Komunikasi</Label>
              <Select defaultValue="structured">
                <SelectTrigger id="communication-style" className="mt-1">
                  <SelectValue placeholder="Pilih gaya komunikasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Langsung dan Tegas</SelectItem>
                  <SelectItem value="supportive">
                    Suportif dan Memotivasi
                  </SelectItem>
                  <SelectItem value="structured">
                    Terstruktur dan Sistematis
                  </SelectItem>
                  <SelectItem value="any">Tidak ada preferensi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai-recommendations">Rekomendasi AI</Label>
                <p className="text-sm text-muted-foreground">
                  Aktifkan rekomendasi mentor berbasis AI berdasarkan preferensi
                  Anda
                </p>
              </div>
              <Switch id="ai-recommendations" defaultChecked />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Notifikasi</CardTitle>
          <CardDescription>
            Atur preferensi notifikasi untuk platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi melalui email
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi melalui SMS
              </p>
            </div>
            <Switch id="sms-notifications" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="browser-notifications">Browser</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi melalui browser
              </p>
            </div>
            <Switch id="browser-notifications" defaultChecked />
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Jenis Notifikasi</h3>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="booking-notifications"
                className="text-sm font-normal"
              >
                Konfirmasi Booking
              </Label>
              <Switch id="booking-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="reminder-notifications"
                className="text-sm font-normal"
              >
                Pengingat Sesi
              </Label>
              <Switch id="reminder-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="promo-notifications"
                className="text-sm font-normal"
              >
                Promo dan Penawaran
              </Label>
              <Switch id="promo-notifications" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
