import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";
import { prisma } from "@/app/server/prisma/prisma";
import { createCompetition } from "../competition.repository";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { customError } from "@/app/server/utils/error/custom-error";
import { HttpStatusCode } from "axios";

export const createCompetitionUsecase = async (payload: CreateCompetitionPayload) => {
  // First create the competition
  const competition = await createCompetition(payload);

  try {
    // Initialize Azure OpenAI embeddings
    const embeddings = new AzureOpenAIEmbeddings({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiVersion: "2024-04-01-preview",
      azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deploymentName: "text-embedding-ada-002", // or your Azure deployment name for embeddings
    });

    // Prepare text for embedding
    const competitionText = `
      Title: ${payload.title}
      Description: ${payload.description}
      Fields: ${payload.field.join(", ")}
      Type: ${payload.type}
      Minimum GPA: ${payload.minGPA || "Not specified"}
      Requirements: ${JSON.stringify(payload.requirements)}
      Location: ${payload.location || "Not specified"}
      Organizer: ${payload.organizer || "Not specified"}
    `.trim();

    // Generate embedding
    const vector = await embeddings.embedQuery(competitionText);

    // Store the embedding in the database
    await prisma.embedding.create({
      data: {
        model: "text-embedding-ada-002", // or your Azure model name
        vector: Buffer.from(new Float32Array(vector).buffer),
        metadata: {
          type: "competition",
          id: competition.id,
          title: competition.title,
          fields: competition.field,
          createdAt: competition.createdAt.toISOString(),
        },
      },
    });

    return competition;
  } catch (error) {
    console.error("Error generating competition vector:", error);
    // Even if vector generation fails, we still return the created competition
    // but log the error for monitoring
    return competition;
  }
};
