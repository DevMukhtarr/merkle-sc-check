import mongoose from "mongoose";

const user = new mongoose.Schema({
    firstname: {type: String, default:null},
    lastname: {type: String, default:null},
    email: {type: String, sparse: true, default: null},
    password: {type: String, default:null},
    country: {type: String, default:null}
})

export default mongoose.model("user", user)