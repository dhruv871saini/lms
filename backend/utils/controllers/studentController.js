import multer from "multer"
import path from 'path'
import handleError from "../middleware/handleError";
import bcrypt from "bcryptjs"
import studentModel from "../module/studentModule";
import adminModel from "../module/adminModule";
import jwt from "jsonwebtoken"

const studentPath =path.join("public/student/")
const store =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,studentPath)
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});
export const studentMulter=multer({storage:store})
export const createStudent=async()=>{
    const {adminid}=req.params;
    const {studentName,studentCourse,studentPassword,studentConfirmPassword,studentAddress,studentEmail,studentMobile,adminId}=req.body;
    const studentProfile=req.file
 
    if(!studentProfile){
        return handleError(400,"student profile is required")
    }
    if(!studentName||!studentCourse||!studentPassword||!studentConfirmPassword||!studentAddress||!studentEmail||!studentMobile||!adminId){
        return handleError(400,"all fields are required")
    }
    if(studentPassword!=studentConfirmPassword){
        return handleError(400,"password and confirm password is not match")
    }
    try {
        const verifyEmail=await studentModel.findOne({studentEmail:studentEmail})
        if(!verifyEmail){
            return handleError(400,"email is already exist")
        }
        const verifyAdmin= await adminModel.findById(adminid)
        if(!verifyAdmin){
            return handleError(400,"admin id is not valid")
        }
        if(verifyAdmin._id.toString()==adminId.toString()){
            return handleError(400,"admin id is not match")
        }
        const hashedPassword = await bcrypt.hash(studentPassword,12)
        const student = new studentModel({
            studentName,
            studentEmail,
            studentMobile,
            studentPassword:hashedPassword,
            studentProfile:studentProfile.filename,
            studentAddress,
            studentCourse,
            adminId
        })
        const saveStudent =await student.save()
        if(!saveStudent){
            return handleError(400,"student is not saved")
        }
const token = jwt.sign({UserID:saveStudent._id},process.env.SECRET_KEY,{expiresIn:"7d"})
        return handleError(res,201,"student user create successfully", saveStudent,token)

    } catch (error) {
        return handleError(res,500, "Internal server error")
    }
}

export const loginStudent=async()=>{
    const {studentEmail,studentPassword}=req.body;
    if(!studentEmail||!studentPassword){
        return handleError(400,"all fields are required")
    }
    try {
        const verifyEmail=await studentModel.findOne(studentEmail)
        if(!verifyEmail){
            return handleError(400,"email don't found ")
        }
        const compare = await bcrypt.compare(student,verifyEmail.studentPassword)
        if(!compare){
            return handleError(400,"password is not match")
        }
        return handleError(400,"student login successfully ")

    } catch (error) {
        
    }
}
// update by adminid and student id
export const updateStudent =async()=>{
    const {adminid,studentid}=req.params;
    const {studentName,studentEmail,studentMobile,studentAddress,studentCourse,adminId}=req.body
    if(!studentName ||!studentEmail ||!studentMobile ||!studentAddress ||!studentCourse){
        return handleError(400,"all fields are required")
    }
    try {
        const verifyAdmin = await adminModel.findById(adminid);
        if(!verifyAdmin){
            return handleError(400,"admin id is not found")
        }
        const verifystudent = await studentModel.findById(studentid)
        if(!verifystudent){
            return handleError(400,"student id is not found")
        }
        if(verifyAdmin._id.toString()==adminId.toString()){
            const validUpdate= await studentModel.findByIdAndUpdate(studentid,{studentName,studentEmail,studentMobile,studentAddress,studentCourse,adminId},{new:true})
            if (!validUpdate) {

                return handleError(400, "student update failed")
                
            }else{
                return handleError(200,"student update successfully",validUpdate)
            }
        }else{
            return handleError(400,"admin id is not match")
        }
    } catch (error) {
        return handleError(400,"Internal server error")
    }
        
}