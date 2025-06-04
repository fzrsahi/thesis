import { Prisma } from "@prisma/client";

import { prisma } from "../prisma/prisma";

export const createTranscript = (
  studentId: number,
  { fileId, semester }: { fileId: string; semester: string }
) =>
  prisma.transcript.create({
    data: {
      studentId,
      fileId,
      semester,
    },
  });

export const getTranscriptsByStudentId = (
  studentId: number,
  fields: Prisma.TranscriptSelect = {
    id: true,
    semester: true,
    fileId: true,
    createdAt: true,
  }
) =>
  prisma.transcript.findMany({
    where: {
      studentId,
    },
    select: fields,
  });

export const findTranscriptByIdAndStudentId = (
  id: number,
  studentId: number,
  fields: Prisma.TranscriptSelect = {
    id: true,
    semester: true,
    fileId: true,
    createdAt: true,
  }
) =>
  prisma.transcript.findUnique({
    where: {
      id,
      studentId,
    },
    select: fields,
  });

export const deleteTranscriptByIdAndStudentId = (id: number, studentId: number) =>
  prisma.transcript.delete({
    where: {
      id,
      studentId,
    },
  });
