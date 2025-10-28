/* eslint-disable no-console */

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";

import { prisma } from "@/app/server/prisma/prisma";
import { extractStudentId } from "@/app/server/utils/helpers/extract-student-id.helper";

const AdvisorType = {
  HeadOfDepartment: "HeadOfDepartment",
  HeadOfStudyProgram: "HeadOfStudyProgram",
} as const;

const createAdmin = async () => {
  try {
    const password = "password";
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: "admin@gmail.com",
        password: hashedPassword,
        name: "admin",
      },
    });

    await prisma.admin.create({
      data: {
        userId: user.id,
      },
    });

    console.log("Admin created successfully");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      console.log("Admin already exists");
    } else {
      console.log(error);
    }
  }
};

const createStudent = async () => {
  try {
    // Mahasiswa 1
    const nim1 = "531421066";
    const extracted1 = extractStudentId(nim1);

    const student1Password = await hash(nim1, 10);

    const user1 = await prisma.user.create({
      data: {
        email: "fazrul.anugrah17@gmail.com",
        password: student1Password,
        name: "Fazrul Anugrah Sahi",
      },
    });

    await prisma.student.create({
      data: {
        userId: user1.id,
        studyProgramId: extracted1.studyProgram.id,
        studentId: nim1,
        entryYear: extracted1.entryYear,
      },
    });

    // Mahasiswa 2
    const nim2 = "532421032";
    const extracted2 = extractStudentId(nim2);

    const student2Password = await hash(nim2, 10);

    const user2 = await prisma.user.create({
      data: {
        email: "student2@gmail.com",
        password: student2Password,
        name: "student2",
      },
    });

    await prisma.student.create({
      data: {
        userId: user2.id,
        studyProgramId: extracted2.studyProgram.id,
        studentId: nim2,
        entryYear: extracted2.entryYear,
      },
    });

    console.log("Students created successfully");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      console.log("Student already exists");
    } else {
      console.log(error);
    }
  }
};

const createAdvisors = async () => {
  try {
    const password = "password";
    const hashedPassword = await hash(password, 10);

    const siUser = await prisma.user.create({
      data: {
        email: "dosen.si@gmail.com",
        password: hashedPassword,
        name: "Kaprodi SI",
      },
    });
    await prisma.advisor.create({
      data: {
        userId: siUser.id,
        type: AdvisorType.HeadOfStudyProgram,
        studyProgramId: 1,
      },
    });

    const deptHead = await prisma.user.create({
      data: {
        email: "dosen.pti.depthead@gmail.com",
        password: hashedPassword,
        name: "Kepala Jurusan",
      },
    });
    await prisma.advisor.create({
      data: {
        userId: deptHead.id,
        type: AdvisorType.HeadOfDepartment,
      },
    });

    const ptiUser = await prisma.user.create({
      data: {
        email: "dosen.pti@gmail.com",
        password: hashedPassword,
        name: "Kaprodi PTI",
      },
    });
    await prisma.advisor.create({
      data: {
        userId: ptiUser.id,
        type: AdvisorType.HeadOfStudyProgram,
        studyProgramId: 2,
      },
    });

    console.log("Advisors created successfully");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      console.log("One or more advisors already exist");
    } else {
      console.log(error);
    }
  }
};

const createStudyProgram = async () => {
  await prisma.studyProgram.createMany({
    data: [
      {
        name: "Sistem Informasi",
      },
      {
        name: "Pendidikan Teknologi Informasi",
      },
    ],
    skipDuplicates: true,
  });
};

const main = async () => {
  await createAdmin();
  await createStudyProgram();
  await createStudent();
  await createAdvisors();
};

main();
