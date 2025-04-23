import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

export const isLoggedIn = async (req,res,next) => {

    try {
        //get token from cookie
        console.log("hiiiiiiiii");
        
        // console.log(req.cookies)
        let token = req.cookies?.token;

        console.log("Token Founded:",token);
        
        // validate token

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token not found so authentication failed"
            });
        }
        console.log("i am here");
        

        const decoded = await  jwt.verify(token,process.env.SECREAT_KEY)
        console.log(decoded);

        //send it to req.user

        req.user = decoded;   // value of decoded assign to the user
        
    } catch (error) {
        console.log("Auth middleware failure");
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:error
        });
    }
    next();   // next is imp for next line run 
};