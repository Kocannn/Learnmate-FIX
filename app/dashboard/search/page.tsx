"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, Search, Star } from "lucide-react";
import { PrismaClient } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Interface for our mentor data structure
interface Mentor {
  id: string;
  name: string;
  interests: string[];
  rating: number;
  rate: number | null;
  profileImage: string | null;
  bio: string | null;
  reviewCount: number;
}

// Fetch all mentors function
async function getMentors() {
  const res = await fetch("/api/v1/mentors");
  if (!res.ok) {
    throw new Error("Failed to fetch mentors");
  }
  return res.json();
}
export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    minRating: "0",
    maxPrice: 1000000,
  });

  useEffect(() => {
    async function loadMentors() {
      try {
        const data = await getMentors();
        setMentors(data);
      } catch (error) {
        console.error("Error loading mentors:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, []);

  // Filter mentors based on search query and other filters
  const filteredMentors = mentors.filter((mentor) => {
    // Filter by search query (name or interests)
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    // Filter by category
    const matchesCategory =
      filters.category === "all" ||
      mentor.interests.some((interest) =>
        interest.toLowerCase().includes(filters.category.toLowerCase()),
      );

    // Filter by rating
    const matchesRating = mentor.rating >= parseFloat(filters.minRating);

    // Filter by price
    const matchesPrice =
      mentor.rate === null || mentor.rate <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesRating && matchesPrice;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cari Mentor</h1>
        <p className="text-muted-foreground">
          Temukan mentor yang sesuai dengan kebutuhan belajar Anda
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama atau keahlian..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            defaultValue={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">UI/UX Design</SelectItem>
              <SelectItem value="data">Data Science</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <div className="col-span-2">
          <h3 className="text-sm font-medium mb-2">Rating</h3>
          <Select
            defaultValue={filters.minRating}
            onValueChange={(value) =>
              setFilters({ ...filters, minRating: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Minimum Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Semua Rating</SelectItem>
              <SelectItem value="3">3+ Bintang</SelectItem>
              <SelectItem value="4">4+ Bintang</SelectItem>
              <SelectItem value="4.5">4.5+ Bintang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Harga per Sesi</h3>
          <div className="pt-4">
            <Slider
              defaultValue={[filters.maxPrice]}
              max={1000000}
              step={50000}
              onValueChange={(value) =>
                setFilters({ ...filters, maxPrice: value[0] })
              }
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Rp 100.000</span>
              <span>Rp {filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Memuat data mentor...</p>
        ) : filteredMentors.length === 0 ? (
          <p>Tidak ada mentor yang sesuai dengan pencarian Anda</p>
        ) : (
          filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-12" />
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="flex flex-col items-center -mt-8">
                  <img
                    src={mentor.profileImage || "/placeholder.svg"}
                    alt={mentor.name}
                    className="rounded-full border-4 border-white dark:border-slate-800 h-16 w-16 bg-white"
                  />
                  <h3 className="mt-2 font-semibold text-lg">{mentor.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {mentor.interests[0]}
                    </span>
                    {mentor.interests[1] && (
                      <>
                        <span className="text-xs">•</span>
                        <span className="text-sm text-muted-foreground">
                          {mentor.interests[1]}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm ml-1">{mentor.rating}</span>
                  </div>
                  <p className="text-sm text-center text-muted-foreground mt-3">
                    {mentor.bio}
                  </p>
                  <div className="mt-4 text-center">
                    <span className="font-medium">
                      Rp {mentor.rate?.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / sesi
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t p-4">
                <Button asChild>
                  <Link href={`/dashboard/mentors/${mentor.id}`}>
                    Lihat Profil
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
