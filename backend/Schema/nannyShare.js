import mongoose from "mongoose";

const { Schema } = mongoose;

const nannyShareSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  noOfChildren: {
    type: Schema.Types.Mixed,
    required: true,
  },
  specificDays: {
    type: Schema.Types.Mixed,
    required: true,
  },
  schedule: {
    type: Schema.Types.String,
    required: true,
  },
  scheduleSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  style: {
    type: Schema.Types.String,
    required: true,
  },
  styleSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  responsibility: {
    type: [Schema.Types.String],
    required: true,
  },
  responsibilitySpecify: {
    type: Schema.Types.String,
    required: false,
  },
  hourlyRate: {
    type: Schema.Types.Mixed,
    required: true,
  },
  hourlyRateSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  pets: {
    type: Schema.Types.String,
    required: true,
  },
  petsSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  communicate: {
    type: Schema.Types.String,
    required: true,
  },
  communicateSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  backupCare: {
    type: Schema.Types.String,
    required: true,
  },
  backupCareSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  involve: {
    type: Schema.Types.String,
    required: true,
  },
  involveSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  activity: {
    type: [Schema.Types.String],
    required: true,
  },
  activitySpecify: {
    type: Schema.Types.String,
    required: false,
  },
  guideline: {
    type: [Schema.Types.String],
    required: true,
  },
  guidelineSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  healthConsideration: {
    type: [Schema.Types.String],
    required: true,
  },
  healthConsiderationSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  scheduleAndArrangement: {
    type: Schema.Types.String,
    required: true,
  },
  scheduleAndArrangementSpecify: {
    type: Schema.Types.String,
    required: false,
  },
  jobDescription: {
    type: Schema.Types.String,
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("NannyShare", nannyShareSchema);