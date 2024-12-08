import mongoose from "mongoose";
import "dotenv/config"

const db=async ()=>{
    const mongourl= process.env.MONGO_DB
    if(!mongourl){
console.log("missing the mongodb url ")
    }
try {
 const result=   await mongoose.connect(mongourl)
 if(result){
    console.log("Connected to MongoDB")
 }else{
    console.log("Failed to connect to MongoDB")
 }
    
} catch (error) {
    console.log(error)
}
}
export default db;