import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in the correct order (respecting foreign key constraints)
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database...");

  // Create mentors
  const mentors = [
    {
      name: "Budi Santoso",
      email: "budi.santoso@example.com",
      phone: "+62812345678",
      location: "Jakarta",
      hasCompletedOnboarding: true,
      bio: "Senior Software Engineer dengan 10 tahun pengalaman di berbagai teknologi web dan mobile. Spesialisasi di JavaScript, React, dan Node.js. Saya telah membantu lebih dari 50 mentee untuk mengembangkan karir mereka di bidang pengembangan web.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Web Development", "Mobile Development", "JavaScript"],
      isMentor: true,
      expertise: [
        "JavaScript",
        "React",
        "Node.js",
        "TypeScript",
        "Next.js",
        "Express",
        "MongoDB",
      ],
      rate: 350000,
      rating: 4.9,
      reviewCount: 15,
      completedSessions: 25,
      totalHours: 50.5,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Siti Rahma",
      email: "siti.rahma@example.com",
      phone: "+62856789012",
      location: "Bandung",
      hasCompletedOnboarding: true,
      bio: "UI/UX Designer dengan pengalaman 8 tahun di industri teknologi. Mengutamakan desain yang berpusat pada pengguna dan estetika yang clean. Saya senang membantu talenta baru menemukan jalan mereka di dunia desain digital.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["UI/UX Design", "User Research", "Prototyping"],
      isMentor: true,
      expertise: [
        "UI Design",
        "UX Design",
        "Figma",
        "Adobe XD",
        "User Research",
        "Prototyping",
        "Design Systems",
      ],
      rate: 300000,
      rating: 4.8,
      reviewCount: 12,
      completedSessions: 18,
      totalHours: 36.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Ahmad Wijaya",
      email: "ahmad.wijaya@example.com",
      phone: "+62878901234",
      location: "Surabaya",
      hasCompletedOnboarding: true,
      bio: "Data Scientist dengan latar belakang matematika dan statistik. Berpengalaman dalam machine learning, data visualization, dan analytics. Saya percaya data adalah kunci pengambilan keputusan yang lebih baik di era digital.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Data Science", "Machine Learning", "Data Visualization"],
      isMentor: true,
      expertise: [
        "Python",
        "R",
        "SQL",
        "TensorFlow",
        "PyTorch",
        "Tableau",
        "Power BI",
      ],
      rate: 400000,
      rating: 4.7,
      reviewCount: 9,
      completedSessions: 15,
      totalHours: 30.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Dewi Anggraini",
      email: "dewi.anggraini@example.com",
      phone: "+62812987654",
      location: "Yogyakarta",
      hasCompletedOnboarding: true,
      bio: "Product Manager dengan pengalaman 7 tahun membangun produk digital yang sukses. Menerapkan metodologi agile dan lean startup dalam pengembangan produk. Senang berbagi tentang product strategy, market research, dan user-centric design.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Product Management", "Agile", "User Research"],
      isMentor: true,
      expertise: [
        "Product Strategy",
        "Agile Methodologies",
        "User Stories",
        "Market Research",
        "Roadmapping",
        "Stakeholder Management",
        "Analytics",
      ],
      rate: 375000,
      rating: 4.8,
      reviewCount: 14,
      completedSessions: 22,
      totalHours: 44.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Raden Wibowo",
      email: "raden.wibowo@example.com",
      phone: "+62856432109",
      location: "Jakarta",
      hasCompletedOnboarding: true,
      bio: "DevOps Engineer dengan fokus pada cloud infrastructure dan automation. Pengalaman 6 tahun mengelola infrastruktur skala besar dan implementasi CI/CD pipeline. Passionate tentang sharing knowledge di bidang cloud technology.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["DevOps", "Cloud Computing", "Automation"],
      isMentor: true,
      expertise: [
        "AWS",
        "Docker",
        "Kubernetes",
        "Terraform",
        "CI/CD",
        "Linux",
        "Jenkins",
      ],
      rate: 425000,
      rating: 4.9,
      reviewCount: 11,
      completedSessions: 19,
      totalHours: 38.5,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Lina Kusuma",
      email: "lina.kusuma@example.com",
      phone: "+62878654321",
      location: "Bali",
      hasCompletedOnboarding: true,
      bio: "Digital Marketing Specialist dengan 9 tahun pengalaman di berbagai industri. Ahli dalam SEO, content marketing, dan social media strategy. Membantu banyak bisnis meningkatkan online presence dan conversion rates.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Digital Marketing", "SEO", "Content Strategy"],
      isMentor: true,
      expertise: [
        "SEO",
        "SEM",
        "Social Media Marketing",
        "Content Strategy",
        "Email Marketing",
        "Analytics",
        "Growth Hacking",
      ],
      rate: 325000,
      rating: 4.7,
      reviewCount: 16,
      completedSessions: 26,
      totalHours: 52.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Joko Prasetyo",
      email: "joko.prasetyo@example.com",
      phone: "+62812345987",
      location: "Surabaya",
      hasCompletedOnboarding: true,
      bio: "Mobile App Developer dengan keahlian di Flutter dan React Native. 5 tahun pengalaman membangun aplikasi mobile cross-platform yang performant dan user-friendly. Senang mendiskusikan arsitektur aplikasi dan best practices.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Mobile Development", "Flutter", "React Native"],
      isMentor: true,
      expertise: [
        "Flutter",
        "React Native",
        "Dart",
        "JavaScript",
        "Firebase",
        "App Architecture",
        "State Management",
      ],
      rate: 350000,
      rating: 4.8,
      reviewCount: 10,
      completedSessions: 16,
      totalHours: 32.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Nina Hartono",
      email: "nina.hartono@example.com",
      phone: "+62856789123",
      location: "Jakarta",
      hasCompletedOnboarding: true,
      bio: "Project Manager dengan sertifikasi PMP dan pengalaman 10 tahun menangani proyek IT skala besar. Ahli dalam risk management, resource allocation, dan stakeholder management. Senang membimbing project manager pemula.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Project Management", "Agile", "Leadership"],
      isMentor: true,
      expertise: [
        "Project Planning",
        "Scrum",
        "Kanban",
        "Risk Management",
        "Budgeting",
        "Team Leadership",
        "Stakeholder Management",
      ],
      rate: 450000,
      rating: 4.9,
      reviewCount: 18,
      completedSessions: 28,
      totalHours: 56.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Eko Nugroho",
      email: "eko.nugroho@example.com",
      phone: "+62878123456",
      location: "Bandung",
      hasCompletedOnboarding: true,
      bio: "Frontend Developer spesialis dalam building high-performance web applications. 7 tahun pengalaman dengan React, Vue, dan modern JavaScript. Fokus pada accessibility, performance optimization, dan component-based architecture.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Frontend Development", "React", "Web Performance"],
      isMentor: true,
      expertise: [
        "React",
        "Vue.js",
        "JavaScript",
        "TypeScript",
        "CSS/SASS",
        "Webpack",
        "Web Performance",
      ],
      rate: 375000,
      rating: 4.8,
      reviewCount: 13,
      completedSessions: 21,
      totalHours: 42.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Anita Sari",
      email: "anita.sari@example.com",
      phone: "+62834567123",
      location: "Medan",
      hasCompletedOnboarding: true,
      bio: "QA Engineer dengan 6 tahun pengalaman dalam automated testing dan quality assurance. Ahli dalam test planning, automated testing frameworks, dan continuous integration. Berdedikasi untuk membantu meningkatkan kualitas software.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Quality Assurance", "Automated Testing", "Test Planning"],
      isMentor: true,
      expertise: [
        "Selenium",
        "Cypress",
        "Jest",
        "Manual Testing",
        "Test Planning",
        "CI/CD Integration",
        "Performance Testing",
      ],
      rate: 325000,
      rating: 4.7,
      reviewCount: 9,
      completedSessions: 15,
      totalHours: 30.0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
  ];
  // Create mentees
  const mentees = [
    {
      name: "Rina Wati",
      email: "rina.wati@example.com",
      phone: "+62834567890",
      location: "Jakarta",
      hasCompletedOnboarding: true,
      bio: "Junior Web Developer yang sedang mengembangkan keterampilan dalam React dan Node.js.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Web Development", "JavaScript", "React"],
      isMentor: false,
      completedSessions: 0,
      totalHours: 0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Deni Susanto",
      email: "deni.susanto@example.com",
      phone: "+62890123456",
      location: "Yogyakarta",
      hasCompletedOnboarding: true,
      bio: "Mahasiswa jurusan Ilmu Komputer yang ingin memperdalam pengetahuan di bidang data science.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["Data Science", "Python", "Machine Learning"],
      isMentor: false,
      completedSessions: 0,
      totalHours: 0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
    {
      name: "Maya Putri",
      email: "maya.putri@example.com",
      phone: "+62845678901",
      location: "Bandung",
      hasCompletedOnboarding: true,
      bio: "UI Designer pemula yang ingin belajar lebih banyak tentang UX dan user research.",
      profileImage: "/placeholder.svg?height=200&width=200",
      password: await hash("password123", 10),
      interests: ["UI Design", "UX Design", "Figma"],
      isMentor: false,
      completedSessions: 0,
      totalHours: 0,
      mentorCount: 0,
      emailVerified: new Date(),
    },
  ];

  // Insert mentors and create related data
  for (const mentorData of mentors) {
    const mentor = await prisma.user.create({
      data: mentorData,
    });

    console.log(`Created mentor: ${mentor.name}`);

    // Create education for mentors
    if (mentor.email === mentors[0].email) {
      // Budi Santoso
      await prisma.education.createMany({
        data: [
          {
            institution: "Universitas Indonesia",
            degree: "S1 Ilmu Komputer",
            year: "2013 - 2017",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[1].email) {
      // Siti Rahma
      await prisma.education.createMany({
        data: [
          {
            institution: "Institut Teknologi Bandung",
            degree: "S1 Desain Komunikasi Visual",
            year: "2012 - 2016",
            userId: mentor.id,
          },
          {
            institution: "School of Visual Arts New York",
            degree: "Digital Experience Design Certificate",
            year: "2018",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[2].email) {
      // Ahmad Wijaya
      await prisma.education.createMany({
        data: [
          {
            institution: "Institut Teknologi Sepuluh November",
            degree: "S1 Matematika",
            year: "2010 - 2014",
            userId: mentor.id,
          },
          {
            institution: "Universitas Gadjah Mada",
            degree: "S2 Data Science",
            year: "2016 - 2018",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[3].email) {
      // Dewi Anggraini
      await prisma.education.createMany({
        data: [
          {
            institution: "Universitas Gadjah Mada",
            degree: "S1 Manajemen Bisnis",
            year: "2011 - 2015",
            userId: mentor.id,
          },
          {
            institution: "University of Melbourne",
            degree: "Master of Business Administration",
            year: "2016 - 2018",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[4].email) {
      // Raden Wibowo
      await prisma.education.createMany({
        data: [
          {
            institution: "Institut Teknologi Bandung",
            degree: "S1 Teknik Informatika",
            year: "2012 - 2016",
            userId: mentor.id,
          },
          {
            institution: "AWS Certified Solutions Architect",
            degree: "Professional Certification",
            year: "2019",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[5].email) {
      // Lina Kusuma
      await prisma.education.createMany({
        data: [
          {
            institution: "Universitas Bina Nusantara",
            degree: "S1 Marketing Communication",
            year: "2010 - 2014",
            userId: mentor.id,
          },
          {
            institution: "Digital Marketing Institute",
            degree: "Professional Diploma in Digital Marketing",
            year: "2016",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[6].email) {
      // Joko Prasetyo
      await prisma.education.createMany({
        data: [
          {
            institution: "Institut Teknologi Sepuluh November",
            degree: "S1 Teknik Informatika",
            year: "2014 - 2018",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[7].email) {
      // Nina Hartono
      await prisma.education.createMany({
        data: [
          {
            institution: "Universitas Indonesia",
            degree: "S1 Teknik Industri",
            year: "2009 - 2013",
            userId: mentor.id,
          },
          {
            institution: "Project Management Institute",
            degree: "Project Management Professional (PMP)",
            year: "2016",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[8].email) {
      // Eko Nugroho
      await prisma.education.createMany({
        data: [
          {
            institution: "Institut Teknologi Bandung",
            degree: "S1 Teknik Informatika",
            year: "2013 - 2017",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[9].email) {
      // Anita Sari
      await prisma.education.createMany({
        data: [
          {
            institution: "Universitas Sumatera Utara",
            degree: "S1 Ilmu Komputer",
            year: "2012 - 2016",
            userId: mentor.id,
          },
          {
            institution: "ISTQB",
            degree: "Certified Tester Advanced Level",
            year: "2019",
            userId: mentor.id,
          },
        ],
      });
    }

    // Create experience for mentors
    if (mentor.email === mentors[0].email) {
      // Budi Santoso
      await prisma.experience.createMany({
        data: [
          {
            company: "Tech Company A",
            position: "Senior Software Engineer",
            duration: "2020 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "Tech Company B",
            position: "Software Engineer",
            duration: "2017 - 2020",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[1].email) {
      // Siti Rahma
      await prisma.experience.createMany({
        data: [
          {
            company: "Digital Agency X",
            position: "Senior UI/UX Designer",
            duration: "2019 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "Startup Y",
            position: "UI Designer",
            duration: "2016 - 2019",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[2].email) {
      // Ahmad Wijaya
      await prisma.experience.createMany({
        data: [
          {
            company: "Tech Unicorn Z",
            position: "Lead Data Scientist",
            duration: "2021 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "Consulting Firm",
            position: "Data Analyst",
            duration: "2018 - 2021",
            userId: mentor.id,
          },
          {
            company: "Research Institute",
            position: "Research Assistant",
            duration: "2014 - 2018",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[3].email) {
      // Dewi Anggraini
      await prisma.experience.createMany({
        data: [
          {
            company: "Product Company",
            position: "Senior Product Manager",
            duration: "2020 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "E-commerce Platform",
            position: "Product Manager",
            duration: "2017 - 2020",
            userId: mentor.id,
          },
          {
            company: "Tech Startup",
            position: "Associate Product Manager",
            duration: "2015 - 2017",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[4].email) {
      // Raden Wibowo
      await prisma.experience.createMany({
        data: [
          {
            company: "Cloud Provider",
            position: "Senior DevOps Engineer",
            duration: "2021 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "Fintech Company",
            position: "DevOps Engineer",
            duration: "2018 - 2021",
            userId: mentor.id,
          },
          {
            company: "IT Services",
            position: "System Administrator",
            duration: "2016 - 2018",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[5].email) {
      // Lina Kusuma
      await prisma.experience.createMany({
        data: [
          {
            company: "Digital Marketing Agency",
            position: "Head of Digital Marketing",
            duration: "2019 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "E-commerce Giant",
            position: "Digital Marketing Manager",
            duration: "2016 - 2019",
            userId: mentor.id,
          },
          {
            company: "Advertising Agency",
            position: "Digital Marketing Specialist",
            duration: "2014 - 2016",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[6].email) {
      // Joko Prasetyo
      await prisma.experience.createMany({
        data: [
          {
            company: "Mobile App Studio",
            position: "Senior Mobile Developer",
            duration: "2021 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "Tech Company",
            position: "Mobile App Developer",
            duration: "2018 - 2021",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[7].email) {
      // Nina Hartono
      await prisma.experience.createMany({
        data: [
          {
            company: "Enterprise Software Company",
            position: "Senior Project Manager",
            duration: "2018 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "IT Consulting Firm",
            position: "Project Manager",
            duration: "2014 - 2018",
            userId: mentor.id,
          },
          {
            company: "Software Development Agency",
            position: "Project Coordinator",
            duration: "2013 - 2014",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[8].email) {
      // Eko Nugroho
      await prisma.experience.createMany({
        data: [
          {
            company: "Web Development Agency",
            position: "Lead Frontend Developer",
            duration: "2020 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "Tech Startup",
            position: "Frontend Developer",
            duration: "2017 - 2020",
            userId: mentor.id,
          },
        ],
      });
    } else if (mentor.email === mentors[9].email) {
      // Anita Sari
      await prisma.experience.createMany({
        data: [
          {
            company: "Software Product Company",
            position: "Senior QA Engineer",
            duration: "2020 - Sekarang",
            userId: mentor.id,
          },
          {
            company: "Digital Services Agency",
            position: "QA Engineer",
            duration: "2016 - 2020",
            userId: mentor.id,
          },
        ],
      });
    }
    // Create availability with dynamic dates
    const today = new Date();
    await prisma.availability.createMany({
      data: [
        {
          day: new Date(today.setDate(today.getDate() + 1))
            .toISOString()
            .split("T")[0],
          slots: ["09:00", "13:00", "15:00"],
          userId: mentor.id,
        },
        {
          day: new Date(today.setDate(today.getDate() + 1))
            .toISOString()
            .split("T")[0],
          slots: ["10:00", "14:00"],
          userId: mentor.id,
        },
        {
          day: new Date(today.setDate(today.getDate() + 1))
            .toISOString()
            .split("T")[0],
          slots: ["09:00", "11:00", "16:00"],
          userId: mentor.id,
        },
      ],
    });
  }

  // Insert mentees
  for (const menteeData of mentees) {
    const mentee = await prisma.user.create({
      data: menteeData,
    });

    console.log(`Created mentee: ${mentee.name}`);
  }

  // Create sample bookings
  const sampleBookings = [
    {
      mentorId: (await prisma.user.findUnique({
        where: { email: mentors[0].email },
      }))!.id,
      studentId: (await prisma.user.findUnique({
        where: { email: mentees[0].email },
      }))!.id,
      topic: "JavaScript Fundamentals",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: "14:00", // Added time field
      duration: 60,
      status: "confirmed",
      notes: "Focus on ES6+ features",
    },
    {
      mentorId: (await prisma.user.findUnique({
        where: { email: mentors[1].email },
      }))!.id,
      studentId: (await prisma.user.findUnique({
        where: { email: mentees[1].email },
      }))!.id,
      topic: "UI/UX Design Principles",
      date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      time: "10:30", // Added time field
      duration: 90,
      status: "pending",
      notes: "Portfolio review session",
    },
    {
      mentorId: (await prisma.user.findUnique({
        where: { email: mentors[2].email },
      }))!.id,
      studentId: (await prisma.user.findUnique({
        where: { email: mentees[2].email },
      }))!.id,
      topic: "Data Science Basics",
      date: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
      time: "15:45", // Added time field
      duration: 120,
      status: "confirmed",
      notes: "Introduction to Python for Data Science",
    },
  ];

  for (const bookingData of sampleBookings) {
    await prisma.booking.create({
      data: bookingData,
    });
    console.log(`Created booking for topic: ${bookingData.topic}`);
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
