import { Document } from "@langchain/core/documents";
import { Prisma } from "@prisma/client";

import { findStudentByUserId } from "./student.repository";
import { prisma } from "../prisma/prisma";
import { getLogger } from "../utils/helpers/pino.helper";
import { getStudentDocumentChunksVectorStore } from "../vector/pgvector.service";

const buildStudentProfileContext = (student: {
  id: number;
  studentId: string | null;
  gpa: string | null;
  interests: string[] | null;
  skills: string[] | null;
  achievements?: { title: string; description: string | null; date: Date }[];
  experiences?: {
    organization: string;
    position: string | null;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
  }[];
}) => {
  const gpa = student.gpa || "Tidak Ada Informasi";
  const interests = student.interests?.length
    ? student.interests.join(", ")
    : "Tidak Ada Informasi";
  const skills = student.skills?.length ? student.skills.join(", ") : "Tidak Ada Informasi";
  const achievements =
    (student.achievements || [])
      .map(
        (a) => `${a.title} (${a.date.getFullYear()})${a.description ? ` - ${a.description}` : ""}`
      )
      .join("; ") || "Tidak Ada Informasi";
  const experiences =
    (student.experiences || [])
      .map(
        (e) =>
          `${e.organization}${e.position ? ` - ${e.position}` : ""} (${e.startDate.getFullYear()} - ${e.endDate ? e.endDate.getFullYear() : "Sekarang"})${e.description ? ` - ${e.description}` : ""}`
      )
      .join("; ") || "Tidak Ada Informasi";

  const content = `PROFIL_MAHASISWA
ID Mahasiswa: ${student.studentId || "Tidak Ada Informasi"}
IPK: ${gpa}
Minat: ${interests}
Keterampilan: ${skills}
Prestasi: ${achievements}
Pengalaman: ${experiences}`;

  return content;
};

export const rebuildStudentVector = async (userId: number) => {
  // Get student with minimal fields plus relations for richer context
  const student = await findStudentByUserId(userId, {
    id: true,
    studentId: true,
    gpa: true,
    interests: true,
    skills: true,
    achievements: { select: { title: true, description: true, date: true } },
    experiences: {
      select: {
        organization: true,
        position: true,
        description: true,
        startDate: true,
        endDate: true,
      },
    },
  } as Prisma.StudentSelect);

  if (!student) return;

  const vectorStore = getStudentDocumentChunksVectorStore();
  const logger = getLogger({ module: "student/rebuildStudentVector" });

  // Remove previous chunks for this student via Prisma
  await prisma.studentDocumentChunk.deleteMany({ where: { studentId: student.id } });

  // Create a single consolidated document chunk
  const content = buildStudentProfileContext(student);
  const docs: Document[] = [
    new Document({
      pageContent: content,
      metadata: { studentId: student.id },
    }),
  ];

  // Use addDocuments to generate embeddings, but types of the store expect model shape;
  // cast to avoid mismatched generic since we only need embeddings persisted.
  await (
    vectorStore as unknown as {
      addDocuments: (
        d: Array<{ pageContent: string; metadata?: Record<string, unknown> }>
      ) => Promise<void>;
    }
  ).addDocuments(
    docs as unknown as Array<{ pageContent: string; metadata?: Record<string, unknown> }>
  );
  logger.info(
    { userId, studentId: student.id, embeddedPoints: docs.length },
    "Embedded student profile to vector store"
  );
};
