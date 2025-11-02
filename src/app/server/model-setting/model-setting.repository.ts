import { prisma } from "../prisma/prisma";

export const findActiveModelSetting = async () =>
  prisma.modelSetting.findFirst({
    where: {
      isActive: true,
      provider: "azure-openai",
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

export const findModelSettingByProviderAndModel = async (provider: string, model: string) =>
  prisma.modelSetting.findFirst({
    where: {
      provider,
      model,
    },
  });

export const getAllModelSettings = async () =>
  prisma.modelSetting.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

export const createModelSetting = async (data: {
  apiKey?: string | null;
  provider: string;
  model: string;
  instanceName?: string | null;
  gptEndpoint?: string | null;
  isActive?: boolean;
}) => {
  // Set all other settings to inactive if this one is active
  if (data.isActive) {
    await prisma.modelSetting.updateMany({
      where: {
        provider: data.provider,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  // Check if setting exists
  const existing = await prisma.modelSetting.findFirst({
    where: {
      provider: data.provider,
      model: data.model,
    },
  });

  if (existing) {
    return prisma.modelSetting.update({
      where: {
        id: existing.id,
      },
      data: {
        apiKey: data.apiKey,
        instanceName: data.instanceName,
        gptEndpoint: data.gptEndpoint,
        isActive: data.isActive ?? true,
      },
    });
  }

  return prisma.modelSetting.create({
    data: {
      apiKey: data.apiKey,
      provider: data.provider,
      model: data.model,
      instanceName: data.instanceName,
      gptEndpoint: data.gptEndpoint,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateModelSetting = async (
  id: number,
  data: Partial<{
    apiKey: string | null;
    provider: string;
    model: string;
    instanceName: string | null;
    gptEndpoint: string | null;
    isActive: boolean;
  }>
) => {
  // If setting this to active, deactivate others with same provider
  if (data.isActive) {
    const existing = await prisma.modelSetting.findUnique({
      where: { id },
      select: { provider: true },
    });

    if (existing) {
      await prisma.modelSetting.updateMany({
        where: {
          provider: existing.provider,
          isActive: true,
          id: { not: id },
        },
        data: {
          isActive: false,
        },
      });
    }
  }

  return prisma.modelSetting.update({
    where: { id },
    data,
  });
};
