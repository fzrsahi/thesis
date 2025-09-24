import { prisma } from "../prisma/prisma";

export const getStudyPrograms = async () => prisma.studyProgram.findMany();
