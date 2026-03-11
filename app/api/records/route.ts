import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DoneRecord from "@/models/DoneRecord";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || "");
    const month = parseInt(searchParams.get("month") || "");

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: "Valid year and month (1–12) are required" },
        { status: 400 }
      );
    }

    const records = await DoneRecord.find({ year, month }).lean();
    const monthTotal = records.reduce((sum, r) => sum + r.count, 0);

    return NextResponse.json({
      success: true,
      records: records.map((r) => ({ date: r.date, count: r.count })),
      monthTotal,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
