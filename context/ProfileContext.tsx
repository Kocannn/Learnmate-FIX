"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { formatDate } from "@/lib/utils";

// Define types for education and experience
interface Education {
  institution: string;
  degree: string;
  year: string;
}

// Extend the Next-Auth user type to include our custom fields

type UserType = "mentor" | "mentee";

interface ProfileContextType {
  user: User | null;
  userData: any; // Sample data
  userType: UserType;
  editMode: boolean;
  formData: any;
  userUi: User | null;
  setUserUi: (value: any) => void;
  isSubmitting: boolean;
  showAddEducation: boolean;
  showAddExperience: boolean;
  setEditMode: (value: boolean) => void;
  setFormData: (value: any) => void;
  setShowAddEducation: (value: boolean) => void;
  setShowAddExperience: (value: boolean) => void;
  handleSaveProfile: () => Promise<void>;
  handleAddEducation: (educationData: Education) => void;
  handleAddInterests: (interests: string[]) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [userType, setUserType] = useState<UserType>("mentee");
  const [editMode, setEditMode] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userUi, setUserUi] = useState<User | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      const userData = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        hasCompletedOnboarding: session.user.hasCompletedOnboarding,
        location: session.user.location,
        phone: session.user.phone,
        bio: session.user.bio,
        profileImage: session.user.profileImage,
        joinDate: session.user.joinDate
          ? formatDate(session.user.joinDate.toString())
          : "",
        interests: session.user.interests,
        completedSessions: session.user.completedSessions,
        totalHours: session.user.totalHours,
        mentorCount: session.user.mentorCount,
        isMentor: session.user.isMentor,
        expertise: session.user.expertise,
        rate: session.user.rate,
        rating: session.user.rating,
        reviewCount: session.user.reviewCount,
        education: session.user.education,
        experience: session.user.experience,
      };
      setUser(userData);
      setUserUi(userData);
      setFormData(userData);
      setUserType(session.user.isMentor ? "mentor" : "mentee");
    }
  }, [session]);

  // Sample user data (tetap disimpan di context untuk kemudahan akses)
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    profileImage: "/placeholder.svg",
    bio: "Software developer with 5 years of experience",
    location: "Jakarta, Indonesia",
    phone: "+62 812 3456 7890",
    joinDate: "January 2022",
    completedSessions: 12,
    totalHours: 24,
    mentors: 3,
    mentorCount: 3,
    rate: 250000,
    rating: 4.8,
    reviewCount: 25,
    // Add education array
    education: [],
    // Add experience array for mentor profile
    experience: [
      {
        company: "Tech Solutions",
        position: "Software Engineer",
        duration: "2020 - 2022",
      },
      {
        company: "Digital Innovations",
        position: "Senior Developer",
        duration: "2022 - Present",
      },
    ],
    // Add skills array
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Next.js"],
    availability: [
      {
        day: "Senin",
        slots: ["09:00 - 10:00", "13:00 - 14:00", "19:00 - 20:00"],
      },
      {
        day: "Rabu",
        slots: ["10:00 - 11:00", "15:00 - 16:00"],
      },
      {
        day: "Jumat",
        slots: ["14:00 - 15:00", "16:00 - 17:00"],
      },
    ],
  };

  // Helper function to check if formData has actual changes compared to user data
  const hasChanges = () => {
    if (!user || !formData) return false;

    // Get the keys that exist in both objects
    const keys = Object.keys(formData).filter(
      (key) =>
        formData[key] !== undefined &&
        user[key as keyof typeof user] !== undefined,
    );

    // Check if any values are different
    for (const key of keys) {
      if (
        JSON.stringify(formData[key]) !==
        JSON.stringify(user[key as keyof typeof user])
      ) {
        return true; // Found a change
      }
    }

    return false; // No changes found
  };
  const handleAddInterests = async (interests: string[]) => {
    if (!formData) return;

    // Add the new interests to the form data state
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      interests: [...(prevFormData.interests || []), ...interests],
    }));
    setUserUi((prevUiData: any) => ({
      ...prevUiData,
      interests: [...(prevUiData.interests || []), ...interests],
    }));
  };

  const handleAddEducation = async (educationData: Education) => {
    if (!formData) return;

    // Add the new education data to the form data state
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      education: [...(prevFormData.education || []), educationData],
    }));
    setUserUi((prevUiData: any) => ({
      ...prevUiData,
      education: [...(prevUiData.education || []), educationData],
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData) return;

    // Check if there are actual changes before making the API call
    if (!hasChanges()) {
      console.log("No changes detected in profile data, skipping API call");
      setEditMode(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      console.log("Profile updated successfully:", updatedUser);
      setUser(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        userData,
        userType,
        editMode,
        userUi,
        setUserUi,
        formData,
        isSubmitting,
        showAddEducation,
        showAddExperience,
        setEditMode,
        setFormData,
        handleAddInterests,
        handleAddEducation,
        setShowAddEducation,
        setShowAddExperience,
        handleSaveProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
}
