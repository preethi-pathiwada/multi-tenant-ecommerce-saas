import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req, res, next) => {
    try{
        // const authHeader = req.headers.authorization
        // // console.log("authHeader is ", authHeader.startsWith("Bearer"))
        // if (!req.headers || !authHeader.startsWith("Bearer")){
        //     res.status(401).json({
        //         message:"Authentication required"
        //     })
        // }

        // const jwtToken = authHeader.split(" ")[1]

        console.log("Checking if JWT is there", req.cookies);

        const jwtToken = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
        
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            res.status(401).json({
                message:"User not found"
            })
        }

        req.user = user
        next()

    }
    catch(error){
        res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)){
            res.status(403).json({
                message:"You are not authorized to access the resource"
            })
        }
        next();
    }
}