import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users.model';
import { generateToken } from '../libs/utils';
import cloudinary from '../libs/cloudinary';

interface AuthRequest extends Request {
    user?: any;  // You can replace `any` with `UserType` if you have a TypeScript type for User
}

//?------------------------------------------------------------------------------------------------------
//! @name: signup
//! @param: req, res
//! @desc: Register a new user

export const signup = async (req: Request, res: Response): Promise<void> => {  

    const { name, email, password } = req.body;

    try {
        if(!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return; 
        }
        //CHECK IF USER EXISTS
        const Existuser = await User.findOne({ email });
        if(Existuser) {
            res.status(400).json({ message: "User already exists" })
            return;
        };
        //CHECK & HASH PASSWORD
        if(password.length < 4) {
            res.status(400).json({ message: "Password must be at least 4 characters long" });
            return;
        }
        const salt = await bcrypt.genSalt(10); //10 is the number of rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        //CREATE USER
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profileUrl: "",
        });
        
        if(newUser){
            //generate jwt token
            generateToken(newUser._id as string, res);
            await newUser.save();
            res.status(201).json({ message: "User created successfully" , New_User: newUser });
        }
     
      
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" , error_area: "signup" });
    }

};

//?------------------------------------------------------------------------------------------------------
//! @name: signin
//! @param: req, res
//! @desc: Signin a user

export const signin = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    try {
        //CHECK IF USER EXISTS
        const Existuser = await
        User
        .findOne
        ({
            email
        });
        if(!Existuser) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }
        //CHECK PASSWORD
        const validPassword = await bcrypt.compare(password, Existuser.password);
        if(!validPassword) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        //generate jwt token
        generateToken(Existuser._id as string, res);
        res.status(200).json({ message: "Signin successful", User: Existuser.name });     
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" , error_area: "signin" });

    }

}

//?------------------------------------------------------------------------------------------------------
//! @name: signout
//! @param: req, res
//! @desc: Signout a user


export const signout = async (req: Request, res: Response): Promise<void> => { 
 
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Signout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" , error_area: "signout" });
        
    }

}


//?------------------------------------------------------------------------------------------------------
//! @name: updateProfile
//! @param: req, res
//! @desc: Update user profile


export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => { 
    try {
        const {profileUrl} = req.body;
        const user = req.user;
        if(!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if(!profileUrl) {
            res.status(400).json({ message: "Profile URL is required" });
            return;
        }
        const uploadRes = await cloudinary.uploader.upload(profileUrl)
        const updateUser = await User.findByIdAndUpdate(user._id, { profileUrl: uploadRes.secure_url }, { new: true });
        res.status(200).json({ message: "Profile updated successfully", User: updateUser });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" , error_area: "updateProfile" });
    }

    
    
}


//?------------------------------------------------------------------------------------------------------
//! @name: getUser
//! @param: req, res
//! @desc: Get user


export const getUser = async (req: AuthRequest, res: Response): Promise<void> => { 
    try {
        const user = req.user;
        if(!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        res.status(200).json({ User: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" , error_area: "getUser" });
    }

    
    
}


//?------------------------------------------------------------------------------------------------------
//! @name: checkAuth
//! @param: req, res
//! @desc: Check if user is authenticated


export const checkAuth = async (req: AuthRequest, res: Response): Promise<void> => {   
    try {
        const user = req.user;
        if(!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        res.status(200).json({ User: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" , error_area: "checkAuth" });
    }

    
    
}
