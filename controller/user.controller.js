import User from "../model/User.model.js";
import crpto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req,res) => {
    //get data
    //validate data
    //check if user already exists
    //create new user in database
    //varification token generate
    //save varification token database
    //send varification token to user
    // sucess message display

     const {name ,email,password} = req.body; // collect data  in request body

    if(!name || !email || !password)        // check if user already exists
        return res.status(400).json({
            message:" All fields are required"
        });
        
    try {
        const existingUser =await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message:"User is already exists"
            })
        }
        const user = await User.create({
            name,
            email,
            password,
        });
        console.log(user);
        

        if(!user){
            return res.status(400).json({
                message:"User not registered"
            })
        }
        
        const token = crpto.randomBytes(32).toString("hex");
        console.log(token);
        user.verificationToken = token;
        await user.save();

        //send email
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,    // true for port 465, false for other ports
            auth: {
              user: process.env.MAILTRAP_USERNAME,
              pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOption ={
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: "Verify your Email",
            text: `Plase varify your email through this link ${process.env.BASE_URL}/api/v1/users/varify/${token}`,
            html: "<b>Email For Varification </b>",
        }
        
        transporter.sendMail(mailOption)

        res.status(200).json({
            message:"User registere succesfully",
            success:true,
        });

    } catch (error) {
        return res.status(400).json({
            message:"User failed to register",
            error,
        })
    }

};

const varifyUser = async (req,res) => {
    //get token from url
    //validate
    //find user based on token
    //if not
    //isVarified status ture
    //remove token
    //save
    //return responce

    const {token} = req.params;
    // console.log(token);

    if(!token){
        return res.status(400).json({
            message:"Invaid token 1"
        });
    }
    const user = await User.findOne({verificationToken:token});
    // console.log(user);
    
    if(!user){
        return res.status(400).json({
            message:"Invaid token 2"
        });
    }

    user.isVerified =true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({
        success:true,
        message:"User is varified succesfully",
    });
};

const login = async (req,res) => {

    const {email,password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({
            message:"All the fields are required"
        });
    }

    try {
       const user = await  User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Invaid email or password"
            });
        }
        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message:"Invaid email or password"
            });
        }
        console.log(isMatch);
        
        const token = jwt.sign({id: user._id},
            process.env.SECREAT_KEY,
            {
                expiresIn: "24h",
            }
        )
        const cookieOption = {
            httpOnly: true,
            secure:true,
            maxAge: 24*60*60*1000, //24 hour
        }
        res.cookie("token",token,cookieOption);

        res.status(200).json({
            success:true,
            message:"user login succesfully",
            user:{
                id:user._id,
                roll:user.roll,
                name:user.name,
            }
        });
    } catch (error) {
        res.status(500).json({
            message:"failed to login due to server problem",
            success:true,
            error : error.message,
        });
    }

};

const resetPassword = async (req,res) => {
    
    try {
        const {token} = req.params;
    // console.log(token);

    if(!token){
        return res.status(400).json({
            message:"Invaid token 1"
        });
    }
    const user = await User.findOne({verificationToken:token});
    // console.log(user);
    
    if(!user){
        return res.status(400).json({
            message:"Invaid token 2"
        });
    }

    user.isVerified =true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({
        success:true,
        message:"User is varified succesfully",
    });
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"User is  not varified ",
            error:error.message
        })
    }
}

const getProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        console.log(user);  // for checking
        
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not found"
            });
        }
        res.status(201).json({
            success:true,
            user,
        });
    } catch (error) {
        console.log("error founding user profile:",error);  
    }
}

const forgetPassword = async (req,res) => {
    try {
        // get mail
        const {email} = req.body;

        if(!email){
            return res.status(401).json({
                success:false,
                message:"please enter email"
            })
        }
        // find user based on email
        const user = await User.findOne({email});
        console.log(user);     // just checking

        //reset token 
        // user.verificationToken = undefined;
        // await user.save();

        const token = crpto.randomBytes(32).toString("hex");
        console.log(token);
        user.verificationToken = token;
        await user.save();

        //send email
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,    // true for port 465, false for other ports
            auth: {
              user: process.env.MAILTRAP_USERNAME,
              pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOption ={
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: "Verify your Email",
            text: `varify your email for reset password ${process.env.BASE_URL}/api/v1/users/reset/${token}`,
            html: "<b>Email For Varification foe pass </b>",
        }
        
        transporter.sendMail(mailOption)


        //send mail to user for password
        res.status(200).json({
            message:" plaese varify"
        })
        
    } catch (error) {
        return res.status(400).json({
            message:"User failed to varify for reset pass",
            error,
        })
    }
}

const logout = async (req,res) => {
    try {
        res.cookie("token","",{});
        res.status(201).json({
            message:"User logout succesfully",
            success:true
        })
        
    } catch (error) {
        res.status(401).json({
            message:"interval server issue in logout",
            success:false
        })
    }
}

export { registerUser ,varifyUser ,login ,forgetPassword ,resetPassword ,logout ,getProfile};