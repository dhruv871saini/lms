import mongoose from "mongoose";

const studentSchema= mongoose.Schema({
    studentName:String,
    studentEmail:{
        type:String,
        required:true,
        unique:true,
    },
    studentProfile:String,
    studentPassword:String,
    studentConfirmPassword:String,
    studentMobile:String,
    studentCourse:String,
    studentAddress:String,
    adminId:{
        type:mongoose.Schema.Types.ObjectId,    
        ref:"Admin",
        required:true,
        
    }

},{
    timestamps: true,
}
)
const studentModel= mongoose.model("student",studentSchema);
export default studentModel; 