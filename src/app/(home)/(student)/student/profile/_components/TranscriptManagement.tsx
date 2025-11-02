"use client";

import { Plus, X, Upload, AlertCircle } from "lucide-react";

import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useTranscript } from "../_hooks/useTranscript";

interface TranscriptManagementProps {
  isLoading?: boolean;
  isLight?: boolean;
}

const TranscriptManagement = ({
  isLoading: externalLoading = false,
  isLight = false,
}: TranscriptManagementProps) => {
  const {
    transcripts,
    isLoadingTranscripts,
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
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    transcriptToDelete,
    isDeleting,
    deleteError,
    handleDeleteTranscriptClick,
    handleConfirmDelete,
    handleCancelDelete,
    resetDeleteError,
    handleViewTranscript,
  } = useTranscript();

  const isLoading = externalLoading || isLoadingTranscripts;

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const surface = isLight ? "border-stone-300 bg-white/90" : "border-zinc-700 bg-zinc-800";
  const buttonCancel = isLight
    ? "text-[#7A6B5B] hover:bg-stone-200"
    : "text-zinc-400 hover:bg-zinc-700 hover:text-white";
  const primaryButton = isLight
    ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A] text-white hover:brightness-105"
    : "bg-white text-black hover:bg-zinc-200";
  const outlineButton = isLight
    ? "border-stone-300 bg-white text-[#2F2A24] hover:bg-stone-200"
    : "bg-zinc-700 text-white hover:bg-zinc-600";

  const handleUploadKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNewTranscriptUploadClick();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className={textSecondary}>Transcripts</FormLabel>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn("flex items-center gap-1 px-3 py-1 disabled:opacity-60", primaryButton)}
              disabled={transcripts.length > 0}
            >
              <Plus className="h-3 w-3" /> Add Transcript
            </Button>
          </DialogTrigger>
          <DialogContent
            className={cn(
              isLight
                ? "border-stone-300 bg-white text-[#2F2A24]"
                : "border-zinc-800 bg-zinc-900 text-white"
            )}
          >
            <DialogHeader>
              <DialogTitle className={textPrimary}>Upload New Transcript</DialogTitle>
              <DialogDescription className={textSecondary}>
                Unggah transkrip semester Anda dalam format PDF.
              </DialogDescription>
            </DialogHeader>

            {/* Upload Error Message Display */}
            {uploadError && (
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3",
                  isLight
                    ? "border-red-300 bg-red-100 text-red-700"
                    : "border-red-700 bg-red-900/20 text-red-400"
                )}
              >
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{uploadError}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetUploadError}
                  className={cn(
                    "ml-auto h-6 w-6 p-0",
                    isLight
                      ? "text-red-600 hover:bg-red-200"
                      : "text-red-400 hover:bg-red-800 hover:text-red-300"
                  )}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {/* Semester Selection */}
              <div className="space-y-2">
                <FormLabel className={textSecondary}>Semester</FormLabel>
                <select
                  value={newTranscriptSemester}
                  onChange={(e) => setNewTranscriptSemester(e.target.value)}
                  className={cn(
                    "w-full rounded-md border px-3 py-2 focus:outline-none",
                    isLight
                      ? "border-stone-300 bg-white text-[#2F2A24] focus:border-stone-400"
                      : "border-zinc-700 bg-zinc-800 text-white focus:border-zinc-500"
                  )}
                >
                  <option value="">Select semester</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((sem) => (
                    <option key={sem} value={sem.toString()}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <FormLabel className={textSecondary}>Transcript File</FormLabel>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleNewTranscriptUploadClick}
                  onKeyDown={handleUploadKeyDown}
                  className={cn(
                    "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors focus:outline-none",
                    isLight
                      ? "border-stone-300 bg-white/70 hover:border-stone-400 hover:bg-white focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
                      : "border-zinc-600 bg-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                  )}
                >
                  <Upload
                    className={cn("mx-auto h-6 w-6", isLight ? "text-[#7A6B5B]" : "text-zinc-400")}
                  />
                  <p className={cn("mt-2 text-sm", textPrimary)}>
                    {newTranscriptFile ? newTranscriptFile.name : "Click to upload transcript"}
                  </p>
                  <p className={cn("text-xs", textSecondary)}>PDF only, max 2MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleNewTranscriptFileChange}
                  ref={newTranscriptFileInputRef}
                  className="hidden"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelCreateTranscript}
                disabled={isUploading}
                className={buttonCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateTranscript}
                disabled={isUploading}
                className={cn("disabled:opacity-50", primaryButton)}
              >
                {isUploading ? "Uploading..." : "Upload Transcript"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className={cn(
            isLight
              ? "border-stone-300 bg-white text-[#2F2A24]"
              : "border-zinc-800 bg-zinc-900 text-white"
          )}
        >
          <DialogHeader>
            <DialogTitle className={textPrimary}>Hapus Transkrip</DialogTitle>
            <DialogDescription className={textSecondary}>
              Apakah Anda yakin ingin menghapus transkrip ini? Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {/* Delete Error Message Display */}
          {deleteError && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3",
                isLight
                  ? "border-red-300 bg-red-100 text-red-700"
                  : "border-red-700 bg-red-900/20 text-red-400"
              )}
            >
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{deleteError}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetDeleteError}
                className={cn(
                  "ml-auto h-6 w-6 p-0",
                  isLight
                    ? "text-red-600 hover:bg-red-200"
                    : "text-red-400 hover:bg-red-800 hover:text-red-300"
                )}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {transcriptToDelete && (
            <div className={cn("rounded-lg border p-3", surface)}>
              <p className={cn("text-sm font-medium", textPrimary)}>
                Semester {transcriptToDelete.semester} Transcript
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className={buttonCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className={cn(
                "disabled:opacity-50",
                isLight
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="space-y-4">
          <div className={cn("rounded-lg border p-4", surface)}>
            <Skeleton className="h-20 w-full" />
          </div>
          <div className={cn("rounded-lg border p-4", surface)}>
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Transcript list */}
          {transcripts.map((transcript) => (
            <div key={transcript.id} className={cn("rounded-lg border p-4", surface)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded p-2", isLight ? "bg-[#F0E4D6]" : "bg-black")}>
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", textPrimary)}>
                      Semester {transcript.semester} Transcript
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTranscript(transcript)}
                    className={outlineButton}
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTranscriptClick(transcript)}
                    disabled={isDeleting}
                    className="text-red-400 hover:bg-red-900/20 hover:text-red-300 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {transcripts.length === 0 && (
            <div
              className={cn(
                "rounded-lg border-2 border-dashed p-8 text-center",
                isLight ? "border-stone-300 bg-white/70" : "border-zinc-600 bg-zinc-800/50"
              )}
            >
              <Upload
                className={cn("mx-auto h-8 w-8", isLight ? "text-[#7A6B5B]" : "text-zinc-400")}
              />
              <p className={cn("mt-2 text-sm font-medium", textPrimary)}>No transcripts uploaded</p>
              <p className={cn("mt-1 text-xs", textSecondary)}>
                Click &ldquo;Add Transcript&rdquo; to upload your semester transcripts
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranscriptManagement;
