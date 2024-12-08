import mongoose from "mongoose";

const courseSchema=mongoose.Schema({
    courseTitle:String,
    courseContent:String,
    coursePdf:String,
    courseAuthor:String,
    facultyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Faculty",
        required:true
    }
},{
    timestamps:true
}
)
 const courseModel = mongoose.model("courseModel",courseSchema)
export default  courseModel