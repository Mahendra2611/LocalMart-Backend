import { Owner } from "../models/owner.model.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken.js";
 export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
       
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) return res.status(400).json({ message: "Owner already exists" });
      
        const hashedPassword = await bcrypt.hash(password, 10);
       
        const newOwner = new Owner({
            name,
            email,
            password: hashedPassword,
           
        });
        
        const savedOwner = await newOwner.save();

        const accessToken = generateToken({name:newOwner.name,email:newOwner.email});
       
      

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "Strict",
            maxAge:7*24*60*60*1000,
        });

        res.status(201).json({ message : "signup successfully" ,name:savedOwner.name,email:savedOwner.email});
    } catch (error) {
        res.status(500).json({ error : error.message , message:"server error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
       
        const owner = await Owner.findOne({ email });
        if (!owner) return res.status(404).json({ message: "Owner not found" });

        const validPassword = await bcrypt.compare(password, owner.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = generateToken({name:owner.name,email:owner.email});
       
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge:7*24*60*60*1000,
        });

        res.json({ message : "login successfull" ,name:owner.name,email:owner.email});
    } catch (error) {
        res.status(500).json({ error : error.message,message: "Server error" });
    }
};

export const logout = async (req, res) => {
    
    try {
        const {user} = req;
        console.log(user)
        const owner = await Owner.findOne({email});
        if (!owner) return res.status(403).json({ message: "Owner doesn't exist" });

        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "Strict" });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error : error.message,message: "Server error" });
    }
};
