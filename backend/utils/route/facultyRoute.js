import express from "express";
import { createFaculty, facultyMulter, getAllCourseByFaculty, loginFaculty, updateFacultyByAdmin } from "../controllers/facultyController.js";
const facultyRouter = express.Router()
 
facultyRouter.post("/admin/:adminid/create-faculty",facultyMulter.single("facultyProfile"),createFaculty)
facultyRouter.post("/login/faculty",loginFaculty)
facultyRouter.put("/update-faculty/admin/:adminid/faculty/:facultyid",updateFacultyByAdmin)
facultyRouter.get("/get-course-faculty/faculty/:facultyid",getAllCourseByFaculty);

export default facultyRouter
