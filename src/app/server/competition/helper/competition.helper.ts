import { competitions } from "@prisma/client";

import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { prisma } from "../../prisma/prisma";
import { getLogger } from "../../utils/helpers/pino.helper";
import { getCompetitionVectorStore } from "../../vector/pgvector.service";
import { checkCompetitionSimilarity } from "../service/similarity-check.service";

export const generateCompetitionText = (competitionData: CreateCompetitionPayload) => {
  const competitionTextParts = [
    `Title: ${competitionData.title}`,
    `Description: ${competitionData.description}`,
    `Fields: ${Array.isArray(competitionData.field) ? competitionData.field.join(", ") : ""}`,
    `Type: ${competitionData.type}`,
    `Source URL: ${competitionData.sourceUrl}`,
    `Relevant Courses: ${Array.isArray(competitionData.relevantCourses) ? competitionData.relevantCourses.join(", ") : ""}`,
    `Relevant Skills: ${Array.isArray(competitionData.relevantSkills) ? competitionData.relevantSkills.join(", ") : ""}`,
  ];

  if (competitionData.minGPA) {
    competitionTextParts.push(`Minimal IPK: ${competitionData.minGPA}`);
  }

  if (competitionData.requirements) {
    const requirementsText = [];
    if (competitionData.requirements.teamComposition) {
      requirementsText.push(`Komposisi Tim: ${competitionData.requirements.teamComposition}`);
    }
    if (competitionData.requirements.originality) {
      requirementsText.push(`Kreativitas: ${competitionData.requirements.originality}`);
    }
    if (competitionData.requirements.other) {
      requirementsText.push(`Lainnya: ${competitionData.requirements.other}`);
    }
    if (requirementsText.length > 0) {
      competitionTextParts.push(`Persyaratan: ${requirementsText.join(", ")}`);
    }
  }

  if (competitionData.location) {
    competitionTextParts.push(`Lokasi: ${competitionData.location}`);
  }

  if (competitionData.organizer) {
    competitionTextParts.push(`Organizer: ${competitionData.organizer}`);
  }

  if (competitionData.startDate) {
    competitionTextParts.push(`Tanggal Mulai: ${competitionData.startDate}`);
  }

  if (competitionData.endDate) {
    competitionTextParts.push(`Tanggal Selesai: ${competitionData.endDate}`);
  }

  if (competitionData.evaluationCriteria) {
    const criteriaText = [];
    if (competitionData.evaluationCriteria.preliminaryRound) {
      criteriaText.push(`Babak Penyisihan: ${competitionData.evaluationCriteria.preliminaryRound}`);
    }
    if (competitionData.evaluationCriteria.finalRound) {
      criteriaText.push(`Babak Final: ${competitionData.evaluationCriteria.finalRound}`);
    }
    if (competitionData.evaluationCriteria.other) {
      criteriaText.push(`Lainnya: ${competitionData.evaluationCriteria.other}`);
    }
    if (criteriaText.length > 0) {
      competitionTextParts.push(`Kriteria Evaluasi: ${criteriaText.join(", ")}`);
    }
  }

  if (competitionData.competitionStatistics) {
    const statisticsText = [];
    if (competitionData.competitionStatistics.summary) {
      statisticsText.push(`Ringkasan: ${competitionData.competitionStatistics.summary}`);
    }
    if (
      competitionData.competitionStatistics.totalApplicantsPastYear &&
      competitionData.competitionStatistics.totalApplicantsPastYear.length > 0
    ) {
      const applicantsText = competitionData.competitionStatistics.totalApplicantsPastYear
        .filter((item) => item.count !== null && item.year !== null)
        .map((item) => `${item.year}: ${item.count} applicants`)
        .join(", ");
      if (applicantsText) {
        statisticsText.push(`Total Pendaftar: ${applicantsText}`);
      }
    }
    if (
      competitionData.competitionStatistics.pastUngParticipants &&
      competitionData.competitionStatistics.pastUngParticipants.length > 0
    ) {
      const ungParticipantsText = competitionData.competitionStatistics.pastUngParticipants
        .map((item) => `${item.year}: ${item.name} (${item.count} members)`)
        .join(", ");
      statisticsText.push(
        `Peserta Mahasiswa Universitas Negeri Gorontalo sebelumnya: ${ungParticipantsText}`
      );
    }
    if (statisticsText.length > 0) {
      competitionTextParts.push(`Statistik Kompetisi: ${statisticsText.join("; ")}`);
    }
  }

  return competitionTextParts.join("\n    ");
};

export const storeToVectorStore = async (competition: competitions, competitionText: string) => {
  const logger = getLogger({ module: "competition/helper/storeToVectorStore" });

  logger.info(
    { competitionId: competition.id },
    "Starting similarity check for competition summary"
  );

  const similarityResult = await checkCompetitionSimilarity(competitionText, competition.id);

  if (similarityResult.isSimilar) {
    logger.info(
      {
        competitionId: competition.id,
        similarityScore: similarityResult.similarityScore,
        existingCompetitionId: similarityResult.existingCompetitionId,
      },
      "Competition summary is similar to existing one, skipping embedding"
    );
    return;
  }

  logger.info(
    {
      competitionId: competition.id,
      similarityScore: similarityResult.similarityScore,
    },
    "Competition summary is unique, proceeding with embedding"
  );

  const vectorStore = getCompetitionVectorStore();
  const t0 = Date.now();
  logger.info(
    { competitionId: competition.id, readyToEmbed: 1 },
    "Embedding start (competition summary)"
  );
  await vectorStore.addModels([
    {
      id: competition.id,
      content: competitionText,
    },
  ] as unknown as competitions[]);
  const t1 = Date.now();
  logger.info(
    { competitionId: competition.id, embeddedPoints: 1, ms: t1 - t0 },
    "Embedding completed (competition summary)"
  );

  try {
    const [{ count: vectorCount }] = await prisma.$queryRawUnsafe<{ count: number }[]>(
      'SELECT COUNT(*)::int as count FROM "competitions" WHERE id = $1 AND vector IS NOT NULL',
      competition.id
    );
    logger.info(
      { competitionId: competition.id, vectorCount },
      "competitions with non-null vector (summary)"
    );
  } catch (e) {
    logger.warn(
      { competitionId: competition.id, err: String(e) },
      "Failed to verify competitions.vector"
    );
  }
};
