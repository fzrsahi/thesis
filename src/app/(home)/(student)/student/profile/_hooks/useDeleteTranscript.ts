import { useState } from "react";

import { useMutationDeleteTranscript } from "../_api/useMutationDeleteTranscript";
import { Transcript } from "../_api/useQueryGetTranscripts";

export const useDeleteTranscript = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transcriptToDelete, setTranscriptToDelete] = useState<Transcript | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const { mutate: deleteTranscript, isPending: isDeleting } = useMutationDeleteTranscript({
    onSuccess: () => {
      handleCancelDelete();
    },
    onError: (error) => {
      setDeleteError(error?.response?.data?.message || "");
    },
  });

  const handleDeleteTranscriptClick = (transcript: Transcript) => {
    setTranscriptToDelete(transcript);
    setIsDeleteDialogOpen(true);
    setDeleteError("");
  };

  const handleConfirmDelete = () => {
    if (transcriptToDelete) {
      setDeleteError("");
      deleteTranscript(transcriptToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTranscriptToDelete(null);
    setDeleteError("");
  };

  const resetDeleteError = () => {
    setDeleteError("");
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    transcriptToDelete,
    isDeleting,
    deleteError,
    handleDeleteTranscriptClick,
    handleConfirmDelete,
    handleCancelDelete,
    resetDeleteError,
  };
};
