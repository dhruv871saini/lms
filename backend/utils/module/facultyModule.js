import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    facultyName: { type: String },
    facultyEmail: { type: String, unique: true, required: true },
    facultyPassword: { type: String },
    facultyMobile: { type: String },
    facultyProfile :String,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const facultyModel = mongoose.model("Faculty", facultySchema);
export default facultyModel;