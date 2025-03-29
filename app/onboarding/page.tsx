"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { X, Plus, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const steps = [
  { id: "step-1", name: "Personal Information" },
  { id: "step-2", name: "Education & Interests" },
  { id: "step-3", name: "Experience" },
  { id: "step-4", name: "Mentor Profile (Optional)" },
  { id: "step-5", name: "Review & Submit" },
];

const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+62\s\d{3}\s\d{4}\s\d{4}$/,
      "Phone format should be +62 8xx xxxx xxxx",
    ),
  location: z.string().min(3, "Please enter your location"),
  bio: z.string().max(500, "Bio should be less than 500 characters"),
  profileImage: z.string().optional(),
  education: z.array(
    z.object({
      institution: z.string().min(2, "Institution name is required"),
      degree: z.string().min(2, "Degree is required"),
      year: z.string().min(4, "Year range is required"),
    }),
  ),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  experience: z
    .array(
      z.object({
        company: z.string().min(2, "Company name is required"),
        position: z.string().min(2, "Position is required"),
        duration: z.string().min(2, "Duration is required"),
      }),
    )
    .optional(),
  isMentor: z.boolean().default(false),
  expertise: z.array(z.string()).optional(),
  rate: z.number().optional(),
  availability: z
    .array(
      z.object({
        day: z.string(),
        slots: z.array(z.string()),
      }),
    )
    .optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [interest, setInterest] = useState("");
  const [expertise, setExpertise] = useState("");
  const [availableDay, setAvailableDay] = useState("Senin");
  const [availableSlot, setAvailableSlot] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues: Partial<OnboardingFormValues> = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    location: "",
    bio: "",
    profileImage: "/placeholder.svg?height=200&width=200",
    education: [{ institution: "", degree: "", year: "" }],
    interests: [],
    experience: [{ company: "", position: "", duration: "" }],
    isMentor: false,
    expertise: [],
    rate: 0,
    availability: [{ day: "Senin", slots: [] }],
  };

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const watchIsMentor = watch("isMentor");
  const watchInterests = watch("interests") || [];
  const watchExpertise = watch("expertise") || [];
  const watchAvailability = watch("availability") || [];

  const addEducation = () => {
    const currentEducation = getValues("education") || [];
    setValue("education", [
      ...currentEducation,
      { institution: "", degree: "", year: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    const currentEducation = getValues("education") || [];
    setValue(
      "education",
      currentEducation.filter((_, i) => i !== index),
    );
  };

  const addExperience = () => {
    const currentExperience = getValues("experience") || [];
    setValue("experience", [
      ...currentExperience,
      { company: "", position: "", duration: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    const currentExperience = getValues("experience") || [];
    setValue(
      "experience",
      currentExperience.filter((_, i) => i !== index),
    );
  };

  const addInterest = () => {
    if (!interest || watchInterests.includes(interest)) return;
    setValue("interests", [...watchInterests, interest]);
    setInterest("");
  };

  const removeInterest = (item: string) => {
    setValue(
      "interests",
      watchInterests.filter((i) => i !== item),
    );
  };

  const addExpertiseItem = () => {
    if (!expertise || watchExpertise.includes(expertise)) return;
    setValue("expertise", [...watchExpertise, expertise]);
    setExpertise("");
  };

  const removeExpertiseItem = (item: string) => {
    setValue(
      "expertise",
      watchExpertise.filter((i) => i !== item),
    );
  };

  const addAvailabilitySlot = () => {
    if (!availableSlot) return;

    const updatedAvailability = [...watchAvailability];
    const dayIndex = updatedAvailability.findIndex(
      (a) => a.day === availableDay,
    );

    if (dayIndex >= 0) {
      if (!updatedAvailability[dayIndex].slots.includes(availableSlot)) {
        updatedAvailability[dayIndex].slots.push(availableSlot);
      }
    } else {
      updatedAvailability.push({
        day: availableDay,
        slots: [availableSlot],
      });
    }

    setValue("availability", updatedAvailability);
    setAvailableSlot("");
  };

  const removeAvailabilitySlot = (day: string, slot: string) => {
    const updatedAvailability = watchAvailability
      .map((item) => {
        if (item.day === day) {
          return {
            ...item,
            slots: item.slots.filter((s) => s !== slot),
          };
        }
        return item;
      })
      .filter((item) => item.slots.length > 0);

    setValue("availability", updatedAvailability);
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      // Save user profile data
      const profileResponse = await fetch("/api/v1/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to save profile");
      }

      // Mark onboarding as completed
      const onboardingResponse = await fetch(
        "/api/v1/user/complete-onboarding",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!onboardingResponse.ok) {
        throw new Error("Failed to mark onboarding as complete");
      }

      // Force session refresh to update the session with new onboarding status
      await fetch("/api/auth/session?update=true");

      // Redirect to dashboard after successful onboarding
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const uploadProfileImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server or a cloud storage
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setValue("profileImage", imageUrl);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-center">
              Let's set up your profile to get the most out of the platform
            </CardDescription>

            <div className="mt-8">
              <nav aria-label="Progress">
                <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                  {steps.map((step, index) => (
                    <li key={step.id} className="md:flex-1">
                      <div
                        className={`flex flex-col border-l-4 md:border-l-0 md:border-t-4 py-2 pl-4 md:pl-0 md:pt-4 md:pb-0 
                          ${index <= currentStep ? "border-indigo-600" : "border-gray-200"}`}
                      >
                        <span
                          className={`text-xs font-semibold uppercase tracking-wide ${
                            index <= currentStep
                              ? "text-indigo-600"
                              : "text-gray-500"
                          }`}
                        >
                          Step {index + 1}
                        </span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="px-4 sm:px-6">
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={
                          getValues("profileImage") ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={uploadProfileImage}
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Upload className="h-8 w-8 text-white" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={uploadProfileImage}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Upload Photo
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="+62 8xx xxxx xxxx"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="City, Country"
                        {...register("location")}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        className="h-32 resize-none"
                        {...register("bio")}
                      />
                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bio.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Education & Interests */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  {/* Education */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Education</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEducation}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Education
                      </Button>
                    </div>

                    {watch("education")?.map((_, index) => (
                      <div
                        key={index}
                        className="space-y-4 p-4 border rounded-md relative"
                      >
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEducation(index)}
                            className="absolute right-2 top-2 h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}

                        <div>
                          <Label>Institution</Label>
                          <Input
                            placeholder="University or School name"
                            {...register(`education.${index}.institution`)}
                          />
                        </div>

                        <div>
                          <Label>Degree/Program</Label>
                          <Input
                            placeholder="e.g., Bachelor of Computer Science"
                            {...register(`education.${index}.degree`)}
                          />
                        </div>

                        <div>
                          <Label>Year</Label>
                          <Input
                            placeholder="e.g., 2022 - 2026 (Ongoing)"
                            {...register(`education.${index}.year`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interests */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Interests</h3>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an interest"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                      />
                      <Button type="button" onClick={addInterest}>
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {watchInterests.map((item, i) => (
                        <Badge key={i} variant="secondary" className="py-1.5">
                          {item}
                          <button
                            type="button"
                            onClick={() => removeInterest(item)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    {errors.interests && (
                      <p className="text-red-500 text-sm">
                        {errors.interests.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Experience */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Work Experience</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExperience}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Experience
                    </Button>
                  </div>

                  {watch("experience")?.map((_, index) => (
                    <div
                      key={index}
                      className="space-y-4 p-4 border rounded-md relative"
                    >
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExperience(index)}
                          className="absolute right-2 top-2 h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      <div>
                        <Label>Company</Label>
                        <Input
                          placeholder="Company name"
                          {...register(`experience.${index}.company`)}
                        />
                      </div>

                      <div>
                        <Label>Position</Label>
                        <Input
                          placeholder="e.g., Software Engineer"
                          {...register(`experience.${index}.position`)}
                        />
                      </div>

                      <div>
                        <Label>Duration</Label>
                        <Input
                          placeholder="e.g., 2022 - Present"
                          {...register(`experience.${index}.duration`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4: Mentor Profile */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isMentor"
                      checked={watchIsMentor}
                      onCheckedChange={(checked) =>
                        setValue("isMentor", checked)
                      }
                    />
                    <Label htmlFor="isMentor">
                      I want to register as a mentor
                    </Label>
                  </div>

                  {watchIsMentor && (
                    <>
                      {/* Expertise */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Areas of Expertise
                        </h3>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Add an expertise"
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                          />
                          <Button type="button" onClick={addExpertiseItem}>
                            Add
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {watchExpertise.map((item, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="py-1.5"
                            >
                              {item}
                              <button
                                type="button"
                                onClick={() => removeExpertiseItem(item)}
                                className="ml-2 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Rate */}
                      <div>
                        <Label htmlFor="rate">Hourly Rate (Rp)</Label>
                        <Input
                          id="rate"
                          type="number"
                          placeholder="e.g., 350000"
                          onChange={(e) =>
                            setValue("rate", parseInt(e.target.value))
                          }
                        />
                      </div>

                      {/* Availability */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Availability</h3>

                        <div className="flex gap-2">
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                            value={availableDay}
                            onChange={(e) => setAvailableDay(e.target.value)}
                          >
                            <option value="Senin">Senin</option>
                            <option value="Selasa">Selasa</option>
                            <option value="Rabu">Rabu</option>
                            <option value="Kamis">Kamis</option>
                            <option value="Jumat">Jumat</option>
                            <option value="Sabtu">Sabtu</option>
                            <option value="Minggu">Minggu</option>
                          </select>
                          <Input
                            placeholder="e.g., 13:00 - 15:00"
                            value={availableSlot}
                            onChange={(e) => setAvailableSlot(e.target.value)}
                          />
                          <Button type="button" onClick={addAvailabilitySlot}>
                            Add
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {watchAvailability.map((day, i) => (
                            <div key={i} className="border rounded-md p-4">
                              <h4 className="font-medium">{day.day}</h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {day.slots.map((slot, j) => (
                                  <Badge
                                    key={j}
                                    variant="outline"
                                    className="py-1.5"
                                  >
                                    {slot}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeAvailabilitySlot(day.day, slot)
                                      }
                                      className="ml-2 text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">
                      Review Your Information
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please review your information before submitting.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4 space-y-4">
                      <h4 className="font-medium">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Name:</div>
                        <div>{watch("name")}</div>
                        <div className="text-muted-foreground">Email:</div>
                        <div>{watch("email")}</div>
                        <div className="text-muted-foreground">Phone:</div>
                        <div>{watch("phone")}</div>
                        <div className="text-muted-foreground">Location:</div>
                        <div>{watch("location")}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">
                          Bio:
                        </div>
                        <div className="text-sm mt-1">{watch("bio")}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4">
                      <h4 className="font-medium">Education</h4>
                      {watch("education")?.map((edu, i) => (
                        <div key={i} className="mt-2 text-sm">
                          <div className="font-medium">{edu.institution}</div>
                          <div className="text-muted-foreground">
                            {edu.degree}, {edu.year}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4">
                      <h4 className="font-medium">Interests</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {watchInterests.map((interest, i) => (
                          <Badge key={i} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {watchIsMentor && (
                      <>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4">
                          <h4 className="font-medium">Mentor Information</h4>
                          <div className="mt-2 space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Expertise:{" "}
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {watchExpertise.map((item, i) => (
                                  <Badge key={i} variant="secondary">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Rate:{" "}
                              </span>
                              Rp {watch("rate")}
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4">
                          <h4 className="font-medium">Availability</h4>
                          <div className="mt-2 space-y-2">
                            {watchAvailability.map((day, i) => (
                              <div key={i} className="text-sm">
                                <div className="font-medium">{day.day}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {day.slots.map((slot, j) => (
                                    <Badge key={j} variant="outline">
                                      {slot}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    onSubmit(getValues());
                    router.push("/dashboard");
                  }}
                >
                  Complete Profile
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
