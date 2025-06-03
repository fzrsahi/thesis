import path from "path";
import { Readable } from "stream";

import { drive_v3 } from "@googleapis/drive";
import { HttpStatusCode } from "axios";
import { JWT } from "google-auth-library";

import { GOOGLE_DRIVE_ERROR_RESPONSE } from "./google-drive.error";
import { customError } from "../utils/error/custom-error";

const scopes = "https://www.googleapis.com/auth/drive.file";
const filename = "google-credentials.json";
const parentFolderId = "1hYcOHEWdoetWqy0gj5ilc-wHP9CoByCK";

export const authorize = async () => {
  try {
    const credentialsPath = path.join(process.cwd(), filename);
    const auth = new JWT({
      keyFile: credentialsPath,
      scopes,
    });

    await auth.authorize();
    return auth;
  } catch (error) {
    throw customError(
      GOOGLE_DRIVE_ERROR_RESPONSE.MISSING_CREDENTIALS.code,
      GOOGLE_DRIVE_ERROR_RESPONSE.MISSING_CREDENTIALS.message,
      HttpStatusCode.InternalServerError
    );
  }
};

export const uploadFile = async (file: File) => {
  try {
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
  } catch (error) {
    throw customError(
      GOOGLE_DRIVE_ERROR_RESPONSE.INTERNAL_SERVER_ERROR.code,
      GOOGLE_DRIVE_ERROR_RESPONSE.INTERNAL_SERVER_ERROR.message,
      HttpStatusCode.InternalServerError
    );
  }
};
