/* eslint-disable no-console */

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";

import { prisma } from "@/app/server/prisma/prisma";

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

createAdmin();
