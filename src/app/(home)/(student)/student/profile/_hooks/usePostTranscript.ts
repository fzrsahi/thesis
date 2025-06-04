import { useState, useRef } from "react";
import { ZodError } from "zod";

import { UploadTranscriptSchema } from "@/app/shared/schema/student/profile/TranscriptSchema";

import { useMutationPostTranscript } from "../_api/useMutationPostTranscript";
import { useQueryGetTranscripts } from "../_api/useQueryGetTranscripts";

export const usePostTranscript = () => {
  const { data: transcriptsData } = useQueryGetTranscripts();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTranscriptSemester, setNewTranscriptSemester] = useState("");
  const [newTranscriptFile, setNewTranscriptFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const newTranscriptFileInputRef = useRef<HTMLInputElement>(null);

  const transcripts = transcriptsData?.data || [];

  const { mutate: uploadTranscript, isPending: isUploading } = useMutationPostTranscript({
    onSuccess: () => {
      handleCancelCreateTranscript();
    },
    onError: (error) => {
      setUploadError(error?.response?.data?.message || "");
    },
  });

  const handleCancelCreateTranscript = () => {
    setIsCreateDialogOpen(false);
    setNewTranscriptSemester("");
    setNewTranscriptFile(null);
    setUploadError("");
    if (newTranscriptFileInputRef.current) {
      newTranscriptFileInputRef.current.value = "";
    }
  };

  const handleNewTranscriptFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError("");

    if (file) {
      try {
        UploadTranscriptSchema.shape.transcript.parse(file);
        setNewTranscriptFile(file);
      } catch (error) {
        if (error instanceof ZodError) {
          setUploadError(error.errors.map((e) => e.message).join(", "));
        } else {
          setUploadError("Invalid file");
        }
        if (newTranscriptFileInputRef.current) {
          newTranscriptFileInputRef.current.value = "";
        }
      }
    }
  };

  const handleNewTranscriptUploadClick = () => {
    newTranscriptFileInputRef.current?.click();
  };

  const handleCreateTranscript = () => {
    if (!newTranscriptSemester || !newTranscriptFile) {
      setUploadError("Please select semester and upload a file");
      return;
    }

    const existingSemester = transcripts.find((t) => t.semester === newTranscriptSemester);
    if (existingSemester) {
      setUploadError(`Transcript for semester ${newTranscriptSemester} already exists`);
      return;
    }

    try {
      const validatedData = UploadTranscriptSchema.parse({
        semester: newTranscriptSemester,
        transcript: newTranscriptFile,
      });

      setUploadError("");
      uploadTranscript(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        setUploadError(error.errors.map((e) => e.message).join(", "));
      } else {
        setUploadError("Validation failed");
      }
    }
  };

  const resetUploadError = () => {
    setUploadError("");
  };

  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    newTranscriptSemester,
    setNewTranscriptSemester,
    newTranscriptFile,
    newTranscriptFileInputRef,
    isUploading,
    uploadError,
    handleCancelCreateTranscript,
    handleNewTranscriptFileChange,
    handleNewTranscriptUploadClick,
    handleCreateTranscript,
    resetUploadError,
  };
};
