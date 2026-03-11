import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DoneRecord from "@/models/DoneRecord";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { date } = await request.json();

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const [year, month, day] = date.split("-").map(Number);

    const record = await DoneRecord.findOneAndUpdate(
      { date },
      { $inc: { count: 1 }, $set: { year, month, day } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, record });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to mark done" },
      { status: 500 }
    );
  }
}
