import path from "path";
import { Readable } from "stream";

import { drive_v3 } from "@googleapis/drive";
import { JWT } from "google-auth-library";

const scopes = "https://www.googleapis.com/auth/drive.file";
const filename = "google-credentials.json";
const parentFolderId = "1hYcOHEWdoetWqy0gj5ilc-wHP9CoByCK";

export const authorize = async () => {
  const credentialsPath = path.join(process.cwd(), filename);
  const auth = new JWT({
    keyFile: credentialsPath,
    scopes,
  });

  await auth.authorize();
  return auth;
};

export const uploadFile = async (file: File) => {
  const auth = await authorize();
  const drive = new drive_v3.Drive({ auth });

  const fileMetadata = {
    name: file.name,
    parents: [parentFolderId],
  };

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = Readable.from(buffer);

  const media = {
    mimeType: file.type,
    body: stream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  const fileId = response.data.id;

  await drive.permissions.create({
    fileId: fileId!,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  const fullUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

  return {
    id: fileId!,
    url: fullUrl,
  };
};

export const getFileUrl = (fileId: string) =>
  `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

export const getFileById = async (fileId: string) => {
  const auth = await authorize();
  const drive = new drive_v3.Drive({ auth });

  return await drive.files.get({ fileId, alt: "media" }, { responseType: "arraybuffer" });
};
