import express from "express";
import { adminMulter, createAdmin, deleteAllFaculty, deleteById, deleteCourseByAdmin, findFacultyById, get_all_faculty, getCourseByAdmin } from "../controllers/adminController.js";
const Route =express.Router()

Route.post("/create-admin", adminMulter.single('adminProfile'), createAdmin);
Route.get("/get-faculty/admin/:adminid/faculty/:facultyid", findFacultyById);
Route.get("/get-all-faculty/admin/:adminid/", get_all_faculty);
Route.delete("/delete-faculty/admin/:adminid/faculty/:facultyid",deleteById);
Route.delete("/delete-all-faculty/admin/:adminid/",deleteAllFaculty);
Route.delete("/delete-all-course/admin/:adminid",deleteCourseByAdmin);
Route.get("/get-all-course/admin/:adminid",getCourseByAdmin);
export default Route; 