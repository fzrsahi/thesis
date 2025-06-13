import { Prisma } from "@prisma/client";

import { prisma } from "../prisma/prisma";

interface CreateTranscriptPayload {
  fileId: string;
  semester: string;
  transcriptText: string;
}

export const createTranscript = (studentId: number, payload: CreateTranscriptPayload) =>
  prisma.transcript.create({
    data: {
      studentId,
      ...payload,
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
