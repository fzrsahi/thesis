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

import { useTranscript } from "../_hooks/useTranscript";

interface TranscriptManagementProps {
  isLoading?: boolean;
}

const TranscriptManagement = ({
  isLoading: externalLoading = false,
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

  const handleUploadKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNewTranscriptUploadClick();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-zinc-300">Transcripts</FormLabel>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
              disabled={transcripts.length > 0}
            >
              <Plus className="h-3 w-3" /> Add Transcript
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-800 bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Upload New Transcript</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Upload your semester transcript in PDF format.
              </DialogDescription>
            </DialogHeader>

            {/* Upload Error Message Display */}
            {uploadError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-900/20 p-3">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">{uploadError}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetUploadError}
                  className="ml-auto h-6 w-6 p-0 text-red-400 hover:bg-red-800 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {/* Semester Selection */}
              <div className="space-y-2">
                <FormLabel className="text-zinc-300">Semester</FormLabel>
                <select
                  value={newTranscriptSemester}
                  onChange={(e) => setNewTranscriptSemester(e.target.value)}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-500 focus:outline-none"
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
                <FormLabel className="text-zinc-300">Transcript File</FormLabel>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleNewTranscriptUploadClick}
                  onKeyDown={handleUploadKeyDown}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-zinc-600 bg-zinc-700/50 p-6 text-center transition-colors hover:border-zinc-500 hover:bg-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none"
                >
                  <Upload className="mx-auto h-6 w-6 text-zinc-400" />
                  <p className="mt-2 text-sm text-white">
                    {newTranscriptFile ? newTranscriptFile.name : "Click to upload transcript"}
                  </p>
                  <p className="text-xs text-zinc-400">PDF only, max 2MB</p>
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
                className="text-zinc-400 hover:bg-zinc-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateTranscript}
                disabled={isUploading}
                className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload Transcript"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Delete Transcript</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this transcript? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* Delete Error Message Display */}
          {deleteError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-900/20 p-3">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-red-400">{deleteError}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetDeleteError}
                className="ml-auto h-6 w-6 p-0 text-red-400 hover:bg-red-800 hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {transcriptToDelete && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
              <p className="text-sm font-medium text-white">
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
              className="text-zinc-400 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-700 p-4">
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="rounded-lg border border-zinc-700 p-4">
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Transcript list */}
          {transcripts.map((transcript) => (
            <div key={transcript.id} className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-black p-2">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
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
                    className="bg-zinc-700 text-white hover:bg-zinc-600"
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
            <div className="rounded-lg border-2 border-dashed border-zinc-600 bg-zinc-800/50 p-8 text-center">
              <Upload className="mx-auto h-8 w-8 text-zinc-400" />
              <p className="mt-2 text-sm font-medium text-white">No transcripts uploaded</p>
              <p className="mt-1 text-xs text-zinc-400">
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
