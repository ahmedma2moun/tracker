import mongoose, { Schema, Document } from "mongoose";

export interface IDoneRecord extends Document {
  date: string; // YYYY-MM-DD format
  count: number;
  year: number;
  month: number; // 1-indexed (1=January)
  day: number;
}

const DoneRecordSchema = new Schema<IDoneRecord>(
  {
    date: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
  },
  { timestamps: true }
);

// Compound index for efficient per-month queries
DoneRecordSchema.index({ year: 1, month: 1 });

export default mongoose.models.DoneRecord ||
  mongoose.model<IDoneRecord>("DoneRecord", DoneRecordSchema);
