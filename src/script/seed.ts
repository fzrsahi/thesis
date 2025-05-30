/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax, no-await-in-loop */

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "@/app/server/prisma/prisma";

const seedCompetitions = async () => {
  const competitions = [
    {
      title: "Lomba Inovasi Bisnis Digital Nasional",
      description:
        "Ajang kompetisi untuk mahasiswa dalam mengembangkan ide bisnis digital yang inovatif dan berkelanjutan.",
      field: ["Bisnis", "Teknologi"],
      type: "Tim",
      minGPA: "3.2",
      requirements: { skill: "Business Plan Development", platform: "Online" },
      startDate: new Date("2025-08-01T00:00:00Z"),
      endDate: new Date("2025-08-31T00:00:00Z"),
      location: "Online",
      organizer: "Asosiasi Inkubator Bisnis Indonesia",
    },
    {
      title: "National Cyber Security Competition",
      description:
        "Kompetisi keamanan siber tingkat nasional untuk menguji kemampuan mahasiswa dalam bidang ethical hacking dan defense.",
      field: ["Teknologi", "Bisnis"],
      type: "Individu",
      minGPA: "3.0",
      requirements: { certification: "CEH (Optional)", experience: "CTF" },
      startDate: new Date("2025-09-10T00:00:00Z"),
      endDate: new Date("2025-09-12T00:00:00Z"),
      location: "Surabaya",
      organizer: "Pusat Studi Keamanan Siber Nasional",
    },
    {
      title: "Sustainable Engineering Design Challenge",
      description:
        "Tantangan bagi mahasiswa untuk merancang solusi rekayasa yang ramah lingkungan dan berkelanjutan.",
      field: ["Teknik", "Bisnis"],
      type: "Tim",
      minGPA: "3.1",
      requirements: { software: "AutoCAD", focus: "Renewable Energy" },
      startDate: new Date("2025-10-05T00:00:00Z"),
      endDate: new Date("2025-11-05T00:00:00Z"),
      location: "Yogyakarta",
      organizer: "Ikatan Ahli Teknik Indonesia",
    },
    {
      title: "Mobile App Development Hackathon",
      description:
        "Hackathon 48 jam untuk mengembangkan aplikasi mobile inovatif yang memecahkan masalah sosial.",
      field: ["Teknologi", "Bisnis"],
      type: "Tim",
      minGPA: "2.75",
      requirements: { language: "Kotlin/Swift", platform: "Android/iOS" },
      startDate: new Date("2025-07-20T00:00:00Z"),
      endDate: new Date("2025-07-22T00:00:00Z"),
      location: "Makassar",
      organizer: "Komunitas Developer Makassar",
    },
    {
      title: "Scientific Paper Competition: AI in Education",
      description:
        "Kompetisi penulisan karya ilmiah mengenai penerapan Kecerdasan Buatan dalam dunia pendidikan.",
      field: ["Riset", "Bisnis"],
      type: "Individu",
      minGPA: "3.3",
      requirements: { format: "IEEE", topic_scope: "LLM in Learning" },
      startDate: new Date("2025-06-10T00:00:00Z"),
      endDate: new Date("2025-08-10T00:00:00Z"),
      location: "Online",
      organizer: "Asosiasi Peneliti Pendidikan Indonesia",
    },
  ];

  try {
    for (const competition of competitions) {
      await prisma.competition.create({
        data: competition,
      });
    }
    console.log("Competitions seeded successfully");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      console.log("Some competitions already exist");
    } else {
      console.log(error);
    }
  }
};

seedCompetitions();
