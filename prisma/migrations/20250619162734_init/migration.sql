-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gpa" TEXT,
    "interests" TEXT[],
    "skills" TEXT[],
    "studentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transcripts" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "transcriptText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transcripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advisors" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advisors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "organization" TEXT NOT NULL,
    "position" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "field" TEXT[],
    "type" TEXT,
    "minGPA" TEXT,
    "requirements" JSONB DEFAULT '{}',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "organizer" TEXT,
    "evaluationCriteria" JSONB DEFAULT '{}',
    "sourceUrl" TEXT,
    "relevantCourses" TEXT[],
    "relevantSkills" TEXT[],
    "fileId" TEXT,
    "vector" vector,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitionStats" (
    "id" SERIAL NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "summary" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitionStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentChunks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vector" vector,
    "competitionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentChunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pastUngParticipants" (
    "id" SERIAL NOT NULL,
    "competitionStatsId" INTEGER NOT NULL,
    "year" TEXT,
    "name" TEXT,
    "count" INTEGER,

    CONSTRAINT "pastUngParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "totalApplicantsPastYear" (
    "id" SERIAL NOT NULL,
    "competitionStatsId" INTEGER NOT NULL,
    "count" INTEGER,
    "year" TEXT,

    CONSTRAINT "totalApplicantsPastYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "studentSummary" TEXT,
    "overallAssessment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendationSkillProfiles" (
    "id" SERIAL NOT NULL,
    "recommendationId" INTEGER NOT NULL,
    "skillName" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "breakdown" TEXT NOT NULL,

    CONSTRAINT "recommendationSkillProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendationCompetitions" (
    "id" SERIAL NOT NULL,
    "recommendationId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "competitionName" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "matchReason" TEXT,
    "reasoning" TEXT,
    "keyFactors" TEXT,
    "preparationTips" TEXT,
    "skillRequirements" TEXT,
    "feedbackScore" DOUBLE PRECISION DEFAULT 0.0,
    "feedbackReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendationCompetitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendationDevelopmentSuggestions" (
    "id" SERIAL NOT NULL,
    "recommendationId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "recommendationDevelopmentSuggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llmChatSessions" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llmChatSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llmChatMessages" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llmChatMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "advisors_userId_key" ON "advisors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "competitionStats_competitionId_key" ON "competitionStats"("competitionId");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transcripts" ADD CONSTRAINT "transcripts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisors" ADD CONSTRAINT "advisors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitionStats" ADD CONSTRAINT "competitionStats_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentChunks" ADD CONSTRAINT "documentChunks_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastUngParticipants" ADD CONSTRAINT "pastUngParticipants_competitionStatsId_fkey" FOREIGN KEY ("competitionStatsId") REFERENCES "competitionStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "totalApplicantsPastYear" ADD CONSTRAINT "totalApplicantsPastYear_competitionStatsId_fkey" FOREIGN KEY ("competitionStatsId") REFERENCES "competitionStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendationSkillProfiles" ADD CONSTRAINT "recommendationSkillProfiles_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendationCompetitions" ADD CONSTRAINT "recommendationCompetitions_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendationDevelopmentSuggestions" ADD CONSTRAINT "recommendationDevelopmentSuggestions_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llmChatSessions" ADD CONSTRAINT "llmChatSessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llmChatMessages" ADD CONSTRAINT "llmChatMessages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "llmChatSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
