import { Document } from "@langchain/core/documents";

import { getCompetitionVectorStore } from "@/app/server/vector/pgvector.service";
import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { createCompetition } from "../competition.repository";

export const createCompetitionUsecase = async (payload: CreateCompetitionPayload) => {
  const competitionText = generateCompetitionText(payload);
  const competition = await createCompetition(payload, competitionText);

  const vectorStore = getCompetitionVectorStore();
  const document = new Document({
    pageContent: competitionText,
    metadata: competition,
  });

  await vectorStore.addDocuments([document]);
  return competition;
};

const generateCompetitionText = (competitionData: CreateCompetitionPayload) => {
  const competitionTextParts = [
    `Title: ${competitionData.title}`,
    `Description: ${competitionData.description}`,
    `Fields: ${competitionData.field.join(", ")}`,
    `Type: ${competitionData.type}`,
    `Source URL: ${competitionData.sourceUrl}`,
    `Relevant Courses: ${competitionData.relevantCourses.join(", ")}`,
    `Relevant Skills: ${competitionData.relevantSkills.join(", ")}`,
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
