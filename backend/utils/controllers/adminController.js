import jwt from "jsonwebtoken";
import adminModel from "../module/adminModule.js";
import path from "path";
import bcrypt from "bcryptjs";
import multer from "multer";
import handleError from "../middleware/handleError.js";
import facultyModel from "../module/facultyModule.js";
import courseModel from "../module/courseModule.js";
const adminPath = path.join("public/admin/");
const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, adminPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const adminMulter = multer({ storage: store });
export const createAdmin = async (req, res) => {
  const { adminName, adminPassword, adminEmail } = req.body;
  const adminProfile = req.file;
  if (!adminProfile) {
    return res.status(400).json({ msg: "Please upload a profile picture" });
  }
  if (adminEmail && adminName && adminPassword) {
    try {
      const hassPassward = await bcrypt.hash(adminPassword, 12);
      const checkEmail = await adminModel.findOne({ adminEmail });
      if (checkEmail) {
        return res.status(400).json({ msg: "Email already exist" });
      }
      const adminUser = new adminModel({
        adminName,
        adminEmail,
        adminPassword: hassPassward,
        adminProfile: adminProfile.filename,
      });
      if (adminUser) {
        const saveAdmin = await adminUser.save();
        if (!saveAdmin) {
          return res
            .status(400)
            .json({ message: "admin is not save the data" });
        } else {
          const UserToken = await adminModel.findOne({ adminEmail });
          const token = jwt.sign(
            { UserID: UserToken._id },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
          );
          return res
            .status(201)
            .json({
              message: "admin is created succesfully ",
              data: saveAdmin,
              cookie: token,
            });
        }
      } else {
        return res.status(400).json({ message: "admin is not created " });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(400).json({ message: "Please fill all the fields " });
  }
};

export const findFacultyById = async (req, res) => {
  const { adminid, facultyid } = req.params;
  if (!adminid || !facultyid) {
    return handleError(
      res,
      400,
      "adminid and faculty id is not found as params"
    );
  }
  try {
    const verifyAdmin = await adminModel.findById(adminid);
    if (!verifyAdmin) {
      return handleError(res, 400, "adminid is invalid ");
    }
    const verifyFaculty = await facultyModel.findById(facultyid);
    if (!verifyFaculty) {
      return handleError(res, 400, "facultyid is invalid");
    } else {
      return handleError(res, 200, "success", verifyFaculty);
    }
  } catch (error) {
    return handleError(res, 500, "Internal server error");
  }
};
export const get_all_faculty = async (req, res) => {
  const { adminid } = req.params;
  if (!adminid) {
    return handleError(res, 400, "adminid is not found");
  }
  try {
    const verifyAdmin = await adminModel.findById(adminid);
    if (!verifyAdmin) {
      return handleError(res, 400, "admin is not valid");
    }
    const allfaculty = await facultyModel.find();
    if (allfaculty) {
      return handleError(res, 200, "success", allfaculty);
    } else {
      return handleError(res, 400, " faculty doesn't found");
    }
  } catch (error) {
    return handleError(res, 500, "Internal server error");
  }
};
export const deleteById = async (req, res) => {
  const { adminid, facultyid } = req.params;
  if (!adminid || !facultyid) {
    return handleError(
      res,
      400,
      "adminid and faultyid is not found as a params"
    );
  }
  try{
    const verifyAdmin = await adminModel.findById(adminid);
    if (!verifyAdmin) {
      return handleError(res, 400, "adminid is not vaid");
    }
    const verifyFaculty = await facultyModel.findById(facultyid);
    if (!verifyFaculty) {
      return handleError(res, 400, "facultyid is not valid");
    }
    const deleteFaculty = await facultyModel.findByIdAndDelete(verifyFaculty);
    if (deleteFaculty) {
        const deleteAssociatedCourse=await courseModel.deleteMany({facultyId:verifyFaculty._id})
        if(deleteAssociatedCourse)
      return handleError(res, 200, "faculty and it's all course delete successfully", deleteAssociatedCourse);
    } else {
      return handleError(res, 400, "cannot delete");
    }
  } catch (error) {
    return handleError(res, 500, "Internal server error");
  }
};
export const deleteAllFaculty = async (req, res) => {
  const { adminid } = req.params;
  if (!adminid) {
    return handleError(res, 400, "adminid is not found");
  }
  try {
    const verifyAdmin = await adminModel.findById(adminid);
    if (!verifyAdmin) {
      return handleError(res, 400, "adminid is not valid");
    }
    const deleteAllFaculty = await facultyModel.deleteMany();
    if (!deleteAllFaculty) {
      return handleError(res, 400, "cannot delete any faculty");
    }
    return handleError(res, 200, "delete all faculty successfully");
  } catch (error) {
    return handleError(res, 500, "Internal server error");
  }
};
// ! delete course by admin
export const deleteCourseByAdmin = async (req, res) => {
  const { adminid } = req.params;
  if (!adminid) {
    return handleError(res, 400, "adminid not found");
  }
  const verifyAdmin = await adminModel.findById(adminid);
  if (!verifyAdmin) {
    return handleError(res, 400, "adminid is not valid ");
  }
  try {
    const deleteCourse= await courseModel.deleteMany()
    if(!deleteCourse){
        return handleError(res,400,"all course is not deleted")
    }else{
        return handleError(res,400,"all course is deleted successfully")
    }
  } catch (error) {
    return handleError(res,400,"Internal server error")
  }
};

export const getCourseByAdmin = async (req, res) => {
  const { adminid } = req.params;
  if (!adminid) {
    return handleError(res, 400, "adminid not found");
  }
  const verifyAdmin = await adminModel.findById(adminid);
  if (!verifyAdmin) {
    return handleError(res, 400, "adminid is not valid ");
  }
  try {
    const findCourse= await courseModel.find()
    if(!findCourse){
        return handleError(res,400,"no course found")
    }else{
        return handleError(res,400,"here is course presented ", findCourse)
    }
  } catch (error) {
    return handleError(res,400,"Internal server error")
  }
};