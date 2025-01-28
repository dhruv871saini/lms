import multer from "multer"
import path from "path"
import handleError from "../middleware/handleError.js"
import facultyModel from "../module/facultyModule.js"
import courseModule from "../module/courseModule.js"
const publicPath=path.join("public/course/")
const store =multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null,publicPath)
    },
    filename:(req,file,cb)=>{
        return cb(null,file.originalname)
    }
})
export const courseMulter=multer({storage:store})
export const createCourse=async(req,res)=>{
    const {facultyid}=req.params;
    const{courseTitle,courseContent,courseAuthor,facultyId}=req.body;
    const coursePdf=req.file;
    if(!facultyid){
        return handleError(res,400,"facultyid is not founded")
    }
    const verifyFaculty=await facultyModel.findById(facultyid);
    if(!verifyFaculty){
        return handleError(res,400,"facultyid is invalid")
    }
    if(verifyFaculty._id.toString()!==facultyId.toString()){
        return handleError(res,400,"facultyid is invalid or mismatch")
    }
    if(!coursePdf){
        return handleError(res,400,"must provide the coursr pdf ")
    }
    if(courseTitle&&courseAuthor&&courseContent&&facultyId ){
        try {
            const stoereCourse = new courseModule({
                courseTitle,
                courseAuthor,
                courseContent,
                coursePdf:coursePdf.filname,
                facultyId,
            })
            if(stoereCourse){
                const saveCourse =await stoereCourse.save()
                if(saveCourse){
                    return handleError(res,201,'course create successfully',saveCourse)
                }
            }
        } catch (error) {
            return handleError(res,500,"Internal server error " ,error)
        }
    }
}