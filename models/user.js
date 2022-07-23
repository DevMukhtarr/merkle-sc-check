import mongoose from "mongoose";

const user = new mongoose.Schema({
    firstname: {type: String, default:null},
    lastname: {type: String, default:null},
    user_balance: {type: String, default:null},
    plan_subscription: {type: String, default:null},
    daily_income: {type: String, default:null},
    latest_transaction: {type: String, default:null},
    email: {type: String, sparse: true, default: null},
    password: {type: String, default:null},
    country: {type: String, default:null}
})

export default mongoose.model("user", user)