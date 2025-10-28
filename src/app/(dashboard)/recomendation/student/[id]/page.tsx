"use client";

import { User } from "lucide-react";
import { useParams } from "next/navigation";

import { TypographyH2, TypographyP } from "@/components/ui/typography";

import { ChartsSection } from "./components/ChartsSection";
import { StudentOverview } from "./components/StudentOverview";
import { useStudentCompetitionDetail } from "./hooks/useStudentCompetitionDetail";

const StudentCompetitionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const userId = Number(params.id);

  const { data, isLoading } = useStudentCompetitionDetail(userId);
  const student = data?.student;
  const statistics = data?.statistics;
  const competitions = data?.competitions;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <TypographyH2 className="flex items-center gap-2 text-zinc-900">
            <User className="h-8 w-8" />
            {student?.name || "Student Competition Detail"}
          </TypographyH2>
        </div>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Detail Mahasiswa dan rekomendasi untuk mahasiswa ini.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Student Overview */}
          <StudentOverview
            student={student || null}
            statistics={statistics || null}
            isLoading={isLoading}
          />

          {/* Charts Section */}
          <ChartsSection statistics={statistics || null} competitions={competitions} />
        </div>
      </div>
    </div>
  );
};

export default StudentCompetitionDetailPage;
