import { NextRequest, NextResponse } from "next/server";

// Import the storage from other routes (this is a simple approach for testing)
// In a real app, you'd use a shared database or storage service

export const GET = async (_request: NextRequest) => {
  try {
    // Since we can't directly import the storage variables, we'll make API calls
    const personalDataResponse = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/students/personal-data`
    );
    const academicDataResponse = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/students/academic-data`
    );

    const personalData = await personalDataResponse.json();
    const academicData = await academicDataResponse.json();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      storage: {
        personalData: {
          current: personalData.data,
          debug: personalData.debug,
        },
        academicData: {
          current: academicData.data,
          debug: academicData.debug,
        },
      },
      summary: {
        totalPersonalUpdates: personalData.debug?.updateCount || 0,
        totalAcademicUpdates: academicData.debug?.updateCount || 0,
        lastPersonalUpdate: personalData.debug?.lastUpdate || "Never",
        lastAcademicUpdate: academicData.debug?.lastUpdate || "Never",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching debug storage:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch storage debug info",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
