import { Lock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface AccountTabProps {
  userData: any;
  userType: string;
}

export default function AccountTab({ userData, userType }: AccountTabProps) {
  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Kontak</CardTitle>
          <CardDescription>
            Informasi kontak yang digunakan untuk komunikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={userData.email}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue={userData.phone}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
          <CardDescription>Pengaturan keamanan akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Ubah Password
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">Verifikasi Dua Faktor</Label>
              <p className="text-sm text-muted-foreground">
                Aktifkan verifikasi dua faktor untuk keamanan tambahan
              </p>
            </div>
            <Switch id="2fa" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Hapus Akun</CardTitle>
          <CardDescription>Menghapus akun Anda secara permanen</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Setelah Anda menghapus akun, semua data Anda akan dihapus secara
            permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
          <Button variant="destructive">Hapus Akun</Button>
        </CardContent>
      </Card>
    </div>
  );
}
