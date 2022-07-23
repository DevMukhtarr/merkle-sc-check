import mongoose from "mongoose";

const refreshToken = new mongoose.Schema({
    email: {type: String, default:null},
    token: {type: String, default:null},
    date: {type: Date, default: new Date}
})

export default mongoose.model("refresh", refreshToken)