import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Camera,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  User,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

export function ProfileSidebar() {
  const { user, userData, userType, editMode, setEditMode, handleSaveProfile } =
    useProfile();

  return (
    <div className="md:col-span-1">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={userData.profileImage || "/placeholder.svg"}
                alt={userData.name}
                className="rounded-full h-32 w-32 mb-4"
              />
              <Button
                size="icon"
                className="absolute bottom-4 right-0 rounded-full h-8 w-8"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {userType === "mentor" ? "Mentor" : "Mentee"}
            </p>

            {userType === "mentor" && (
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="ml-1 font-medium">{user?.rating}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  ({user?.reviewCount} ulasan)
                </span>
              </div>
            )}

            <div className="w-full mt-6 space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Telepon</p>
                  <p className="text-sm text-muted-foreground">
                    {userData.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Lokasi</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Bergabung Sejak</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.joinDate}
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => {
                setEditMode(!editMode);
                editMode && handleSaveProfile();
              }}
            >
              {editMode ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profil
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {userType === "mentee" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Statistik Pembelajaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sesi Selesai</p>
                </div>
              </div>
              <p className="font-bold">{userData.completedSessions}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Jam</p>
                </div>
              </div>
              <p className="font-bold">{userData.totalHours}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mentor</p>
                </div>
              </div>
              <p className="font-bold">{userData.mentors}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {userType === "mentor" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Tarif Sesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-sm">Per sesi (60 menit)</p>
              <p className="font-bold">Rp {userData.rate?.toLocaleString()}</p>
            </div>

            {editMode && (
              <div className="mt-4">
                <Label htmlFor="rate">Edit Tarif</Label>
                <div className="flex items-center mt-2">
                  <span className="text-sm mr-2">Rp</span>
                  <Input
                    id="rate"
                    type="number"
                    defaultValue={userData.rate}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
