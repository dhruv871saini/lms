import express from "express";
import { courseMulter, createCourse } from "../controllers/courseController.js";
const courseRouter=express.Router()

courseRouter.post("/create-course/faculty/:facultyid",courseMulter.single("coursePdf"),createCourse)

export default courseRouter;