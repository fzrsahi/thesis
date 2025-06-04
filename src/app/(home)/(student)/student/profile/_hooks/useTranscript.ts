import { useDeleteTranscript } from "./useDeleteTranscript";
import { usePostTranscript } from "./usePostTranscript";
import { useQueryGetTranscripts, Transcript } from "../_api/useQueryGetTranscripts";

export const useTranscript = () => {
  const { data: transcriptsData, isLoading: isLoadingTranscripts } = useQueryGetTranscripts();

  const postTranscriptHook = usePostTranscript();
  const deleteTranscriptHook = useDeleteTranscript();

  const transcripts = transcriptsData?.data || [];

  const handleViewTranscript = (transcript: Transcript) => {
    window.open(transcript.fileUrl, "_blank", "noopener,noreferrer");
  };

  return {
    transcripts,
    isLoadingTranscripts,

    ...postTranscriptHook,

    ...deleteTranscriptHook,

    handleViewTranscript,
  };
};
