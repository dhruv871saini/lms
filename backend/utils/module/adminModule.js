import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true,
    },
    adminPassword: {
        type: String,
        required: true,
    },
    adminProfile: {
        type: String,
        required: true,
    },
});

const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;
