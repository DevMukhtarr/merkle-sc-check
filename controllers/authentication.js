import jwt  from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import refresh from "../models/refresh.js";

// sign up
export const signUp = async (req, res) =>{
    const { email, password, country } = req.body

    if(!(email && password && country)){
        res.json({
            status: false,
            message: "all fields are required"
        })
    }
    
    const oldUser = await (User.findOne({email: email}))
    
    if(oldUser){
        return res.status(409).json({
            status: false,
            message: "User exists already"
        })    
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        email: email,
        password: encryptedPassword,
        country: country
    })
    // jwt token
    const jwtToken = jwt.sign(
        { user_id: user._id, email: email }, 
        process.env.JWT_TOKEN_KEY,{
            expiresIn: "2d",
        })
    // jwt refresh token
    const refreshToken = jwt.sign(
        { user_id: user._id, email: email }, 
        process.env.JWT_TOKEN_KEY,{
            expiresIn: "2d",
        })
    await refresh.create({
        email: email,
        token: refreshToken,
        date: new Date
    })
    
    return res.json({
        status: true,
        message: "registration successful",
        data: [{
            access_token: jwtToken
        }]
    }) 
    
}

// sign in
export const signIn = async (req, res) =>{
    const { email, password } = req.body

    if(!(email && password)){
        return res.json({
            status: false,
            message: "all inputs are required",
        }) 
    }
    
    const user = await User.findOne({ email: email })

     if(user == null){
         return res.json({
             status: false,
             message: "User does not exist",
         }) 
    }
    
    if(user.email && bcrypt.compare(password, user.password)){
        // jwt token 
        const jwtToken = jwt.sign(
            {
                user_id: user._id,
                email: email
            },
            process.env.JWT_TOKEN_KEY,
            {
                expiresIn: "5m"
            })
            
            // refresh token
            const refreshToken = jwt.sign(
                {
                    user_id: user._id,
                    email: email
            }, process.env.JWT_TOKEN_KEY,
            {
                expiresIn: "2d"
            })

            await refresh.updateOne({email: email}, 
                {
                    token: refreshToken,
                    date: new Date
                })

                return res.json({
                    status: true,
                    message: "Login Successful",
                    data: [{
                        access_token: refreshToken
                    }]
                }) 
            }
            
        }
        
// get dashboard
export const dashboard = async (req, res) =>{
    // user id from jwt
    const user = req.user.user_id

    const userDetails = await User.findById(user)

    return res.json({
        status: true,
        message: "dashboard details",
        data: [{
            user_balance: userDetails.user_balance,
            plan_subscription: userDetails.plan_subscription,
            daily_income: userDetails.daily_income,
            latest_transaction: userDetails.latest_transaction
        }]
    }) 
    

}

export const generateAddress = async (req, res) =>{
    
}