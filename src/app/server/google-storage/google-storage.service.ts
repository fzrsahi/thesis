import { Storage } from "@google-cloud/storage";

const GOOGLE_CONFIG = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: "./google-credentials.json",
};

const BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME || "thesis-storage-bucket";

export const uploadFile = async (file: File) => {
  const storage = new Storage({
    projectId: GOOGLE_CONFIG.projectId,
    keyFilename: GOOGLE_CONFIG.keyFilename,
  });

  const bucket = storage.bucket(BUCKET_NAME);
  
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  
  const fileUpload = bucket.file(fileName);
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  await fileUpload.save(buffer, {
    metadata: {
      contentType: file.type,
    },
  });

  const [signedUrl] = await fileUpload.getSignedUrl({
    action: 'read',
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  return {
    id: fileName,
    url: signedUrl,
  };
};

export const getFileUrl = async (fileName: string) => {
  const storage = new Storage({
    projectId: GOOGLE_CONFIG.projectId,
    keyFilename: GOOGLE_CONFIG.keyFilename,
  });

  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(fileName);
  
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
  });
  
  return signedUrl;
};

export const getFileById = async (fileName: string) => {
  const storage = new Storage({
    projectId: GOOGLE_CONFIG.projectId,
    keyFilename: GOOGLE_CONFIG.keyFilename,
  });

  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(fileName);
  
  const [buffer] = await file.download();
  return {
    data: buffer,
  };
};