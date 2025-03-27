"use client";

import ProfileTab from "@/components/profile/Profile-tab";
import AccountTab from "@/components/profile/AccountTab";
import AvailabilityTab from "@/components/profile/Availability";
import PreferencesTab from "@/components/profile/PreferencesTab";
import AddEducationDialog from "@/components/profile/AddEducationDialog";
import AddExperienceDialog from "@/components/profile/AddExperienceDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";

// Wrapper component yang menggunakan context
function ProfilePageContent() {
  const {
    user,
    handleAddEducation,
    userData,
    userType,
    editMode,
    showAddEducation,
    showAddExperience,
    setShowAddEducation,
    setShowAddExperience,
  } = useProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">
          Kelola informasi profil dan pengaturan akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <ProfileSidebar />

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="account">Akun</TabsTrigger>
              {userType === "mentor" && (
                <TabsTrigger value="availability">Ketersediaan</TabsTrigger>
              )}
              {userType === "mentee" && (
                <TabsTrigger value="preferences">Preferensi</TabsTrigger>
              )}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <AccountTab userData={user} userType={userType} />
            </TabsContent>

            {/* Availability Tab (Mentor Only) */}
            {userType === "mentor" && (
              <TabsContent value="availability">
                <AvailabilityTab
                  userData={userData}
                  editMode={editMode}
                  setShowAddExperience={setShowAddExperience}
                />
              </TabsContent>
            )}

            {/* Preferences Tab (Mentee Only) */}
            {userType === "mentee" && (
              <TabsContent value="preferences">
                <PreferencesTab
                  userData={userData}
                  isMentor={false} // Explicitly set to false for mentee
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Add Education Dialog */}
      <AddEducationDialog
        open={showAddEducation}
        onOpenChange={setShowAddEducation}
        onSubmit={(education) => {
          handleAddEducation(education);
        }}
      />

      {/* Add Experience Dialog */}
      <AddExperienceDialog
        open={showAddExperience}
        onOpenChange={setShowAddExperience}
        onSubmit={(experience) => {
          // Add logic to update experience data
          console.log("New experience:", experience);
        }}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfilePageContent />
    </ProfileProvider>
  );
}
