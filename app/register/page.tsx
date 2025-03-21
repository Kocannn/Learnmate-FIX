"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validatorForm = () => {
    if (user.password !== user.confirmPassword) {
      alert("Password doesn't match");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    if (!validatorForm()) return;

    fetch("/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    router.push("/login");
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Set up your account in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Full Name"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email address"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="password"
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <Button
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm">
            <div className="text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
