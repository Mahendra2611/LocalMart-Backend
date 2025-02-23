import jwt from "jsonwebtoken"
export function generateToken(info){
    console.log("token")
    const token =  jwt.sign(info,process.env.JWT_SECRET_KEY)
    return `Bearer ${token}`
}