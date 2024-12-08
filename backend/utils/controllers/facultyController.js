import bcrypt from "bcryptjs";
import path from "path";
import multer from "multer";
import jwt from "jsonwebtoken";
import adminModel from "../module/adminModule.js";
import facultyModel from "../module/facultyModule.js";
import handleError from "../middleware/handleError.js";
import courseModel from "../module/courseModule.js";
const facultyPath = path.join("public/faculty/");
const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, facultyPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const facultyMulter = multer({ storage: store });

export const createFaculty = async (req, res) => {
  const { adminid } = req.params;
  const { facultyName, facultyPassword, facultyMobile, facultyEmail, adminId } =
    req.body;
  const facultyProfile = req.file;
  if (!facultyProfile) {
    return res.status(400).json({ message: "Please upload a profile picture" });
  }
  if (
    facultyName &&
    facultyPassword &&
    facultyMobile &&
    facultyEmail &&
    adminId
  ) {
    try {
      const verifyAdmin = await adminModel.findById(adminid);
      if (!verifyAdmin) {
        return res.status(400).json({ message: "Invalid Admin Id" });
      }
      if (verifyAdmin._id.toString() !== adminId.toString()) {
        return res
          .status(400)
          .json({ message: "Admin is invalid and not matched" });
      }

      const verifyEmail = await facultyModel.findOne ({ facultyEmail });
      if (verifyEmail) {
        return handleError(res, 400, "email already exist");
      }
      const hashedPassword = await bcrypt.hash(facultyPassword, 10);
      const faculty = new facultyModel({
        facultyName,
        facultyPassword: hashedPassword,
        facultyMobile,
        facultyEmail,
        facultyProfile: facultyProfile.filename,
        adminId,
      });
      if (faculty) {
        const saveFaculty = await faculty.save();
        if (saveFaculty) {
          return res.status(201).json({
            message: "faculty is save or created successfully",
            data: saveFaculty,
          });
        } else {
          return res.status(400).json({
            message: "faculty data is not save and created",
          });
        }
      } else {
        return res.status(400).json({
          message: "faculty data is not  created",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "internal server  error",
      });
    }
  }
};
export const loginFaculty = async (req, res) => {
  const { facultyPassword, facultyEmail } = req.body;
  try {
    if (!facultyEmail || !facultyPassword) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }
    const faculty = await facultyModel.findOne({ facultyEmail });
    if (!faculty) {
      return res.status(400).json({ message: "Invalid Faculty Email" });
    } else {
      const isMatch = await bcrypt.compare(
        facultyPassword,
        faculty.facultyPassword
      );
      if (isMatch) {
        const token = jwt.sign(
          { UserId: faculty._id },
          process.env.SECRET_KEY,
          { expiresIn: "1m" }
        );
        return res
          .status(200)
          .json({
            message: "Faculty is login successfully",
            data: faculty,
            cookie: token,
          });
      } else {
        return res.status(400).json({ message: "Invalid Faculty Password" });
      }
    }
  } catch (error) {
    handleError(res, 500, "Internal server error ");
  }
};
export const updateFacultyByAdmin = async (req, res) => {
  const { adminid, facultyid } = req.params;
  const { facultyName, facultyMobile, facultyEmail, adminId } = req.body;
  if (!adminid) {
    return handleError(res, 400, "adminid not found");
  }
  if (!facultyid) {
    return handleError(res, 400, "faculty id not found");
  }
  try {
    const verifyAdmin = await adminModel.findById(adminid);
    if (!verifyAdmin) {
      return handleError(res, 400, "admin id doesn't valid");
    }
    const verifyFaculty = await facultyModel.findById(facultyid);

    if (!verifyFaculty) {
      return handleError(res, 400, "faculty id doesn't valid");
    }
    const checkAdminId = verifyAdmin._id.toString() == adminId.toString();
    if (!checkAdminId) {
      return handleError(
        res,
        400,
        "admin id pass in params is different from body"
      );
    }
    const updateFaculty = await facultyModel.findByIdAndUpdate(
      verifyFaculty,
      { facultyName, facultyMobile, facultyEmail, adminId },
      { new: true }
    );
    if (!updateFaculty) {
      return handleError(res, 400, "Faculty not updated");
    }
    return res
      .status(200)
      .json({ message: "Faculty updated successfully", data: updateFaculty });
  } catch (error) {
    return handleError(res, 500, "Internal server error");
  }
};
//! get all course by faculty
export const getAllCourseByFaculty = async (req, res) => {
  const { facultyid } = req.params;
  if (!facultyid) {
    return handleError(res, 400, "Faculty id not found");
  }
  if(facultyid.length!==24){
    return handleError(res,400,"faculty doesn't have 24 letter")
  }
  try {
    const verifyFaculty = await facultyModel.findById(facultyid);
    if (!verifyFaculty) {
      return handleError(res, 400, "Faculty id doesn't valid");
    }
    const getAllCourse = await courseModel.find({facultyId: verifyFaculty._id});
    if (!getAllCourse) {
      return handleError(res, 400, "No course found");
    }
    return res.status(200).json({ message: "All course by faculty", data: getAllCourse });
  } catch (error) {
    return handleError(res, 500, "Internal server error");
  }
};
