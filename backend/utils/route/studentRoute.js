import express from "express"
import { createStudent, loginStudent, updateStudent } from "../controllers/studentController.js"
const studentRouter = express.Router()
studentRouter.post("/create-student/admin/:adminid",createStudent)
studentRouter.get("/login-student",loginStudent);
studentRouter.put("/update-student/admin/:adminid/student/:studentid",updateStudent);
export default studentRouter