import { Owner } from "../models/owner.model.js";
 export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if owner already exists
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) return res.status(400).json({ message: "Owner already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new owner
        const newOwner = new Owner({
            name,
            email,
            password: hashedPassword,
           
        });

        await newOwner.save();

        // Generate tokens
        const accessToken = generateAccessToken(newOwner);
       

        // Store refresh token in DB
       
        await newOwner.save();

        // Send refresh token as HTTP-Only Cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "Strict"
        });

        res.status(201).json({ message : "signup successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if owner exists
        const owner = await Owner.findOne({ email });
        if (!owner) return res.status(404).json({ message: "Owner not found" });

        // Compare password
        const validPassword = await bcrypt.compare(password, owner.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        // Generate tokens
        const accessToken = generateAccessToken(owner);
       

        
      

        // Send refresh token as HTTP-Only Cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        res.json({ message : "login successfull"});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const owner = await Owner.findOne({ refreshToken: req.cookies.refreshToken });
        if (!owner) return res.status(403).json({ message: "Owner not logged in" });

        // Clear refresh token from DB
       
       

        // Clear cookie
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "Strict" });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
