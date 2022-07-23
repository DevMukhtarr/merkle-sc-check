import jwt  from "jsonwebtoken";
import User from "../models/user.js"
import bcrypt from 'bcrypt'


// sign up
export const signUp = async = (req, res) =>{
    const { email, password, country } = req.body

    if(!(email && password && country)){
        res.json({
            status: false,
            message: "all fields are required"
        })
    }
    
    const user = User.findOne({email: email})
    
    if(user){
        res.json({
            status: false,
            message: "User exists already"
        })    
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    
    User.create({
        email: email,
        password: encryptedPassword,
        country: country
    })
    
    res.json({
        status: true,
        message: "registration successful"
    })    
}