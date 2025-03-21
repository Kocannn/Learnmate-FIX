"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }

    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Belajar dari Mentor Ahli,{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  Raih Karier Impianmu
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Platform mentoring yang menghubungkan pelajar, mahasiswa, dan
                profesional dengan mentor ahli untuk pembelajaran keterampilan
                baru.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Pelajari Lebih Lanjut
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Mentoring Platform"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Fitur Utama Platform
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Semua yang kamu butuhkan untuk meningkatkan keterampilan baru
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Rekomendasi AI</CardTitle>
                <CardDescription>
                  Temukan mentor yang paling sesuai dengan kebutuhanmu melalui
                  sistem rekomendasi AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Booking Sesi</CardTitle>
                <CardDescription>
                  Jadwalkan sesi mentoring dengan mudah sesuai waktu yang kamu
                  inginkan
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Pembelajaran Terstruktur</CardTitle>
                <CardDescription>
                  Dapatkan arahan yang jelas dan dukungan berkelanjutan dari
                  mentor ahli
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Testimoni Pengguna
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Apa kata mereka yang telah menggunakan platform kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src={`/placeholder.svg?height=50&width=50`}
                      alt={`User ${i}`}
                      className="rounded-full h-12 w-12"
                    />
                    <div>
                      <CardTitle className="text-base">Pengguna {i}</CardTitle>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className="h-4 w-4 fill-current text-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    "Platform ini sangat membantu saya dalam mempelajari
                    keterampilan baru. Mentor yang saya dapatkan sangat
                    profesional dan memberikan arahan yang jelas."
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                Siap Untuk Memulai?
              </h2>
              <p className="mt-4 text-lg text-indigo-100">
                Bergabunglah dengan ribuan pengguna yang telah meningkatkan
                keterampilan mereka
              </p>
              <Button
                size="lg"
                className="mt-8 bg-white text-indigo-600 hover:bg-indigo-50"
              >
                <Link href="/register">Daftar Sekarang</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Mentor Platform
              </h3>
              <p className="text-slate-400">
                Platform mentoring yang menghubungkan pelajar dengan mentor
                ahli.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Fitur</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Cari Mentor
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Booking Sesi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Pembayaran
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Perusahaan
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Bantuan</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-400">
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>© 2025 Mentor Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
