import dotenv from "dotenv";
dotenv.config();
import  User  from "../models/UserModel.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import  zod  from "zod";

const JWT_SECRET = process.env.JWT_SECRET;


const  signUpBody = zod.object({
    name: zod.string().min(2, "Name must be at least 2 characters"),
    email: zod.string().email('Invalid email format'),
    password: zod.string().min(6, "Password must be at least 6 characters")
})

export const registerUser = async (req, res) => {
    try {
        const parsedData = signUpBody.safeParse(req.body);

        if(!parsedData.success){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                errors: parsedData.error.errors
            })
        }
        const { name , email, password } = parsedData.data;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            name, 
            email,
            password: hashedPassword
        });

        const savedUser  = await newUser.save();


        const token =  jwt.sign({ _id:savedUser._id}, JWT_SECRET, { expiresIn: "7d"});
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: { name:savedUser.name, email:savedUser.email}
        })
                 
    } catch(error){
        console.error("Error in user registration", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    };
}


const signInBody = zod.object({
    email: zod.string().email('Invalid email format'),
    password: zod.string().min(6, "Password must at least 6 characters")
})
export const loginUser = async (req, res) => {
    try {
       const parsedData = signInBody.safeParse(req.body);
       if(!parsedData.success){
          return res.status(411).json({
            success: false,
            message: "Invalid credentials"
          })
       }
      const { email, password } = parsedData.data;
       const existingUser = await User.findOne({ email });
       if(!existingUser){
        return res.status(411).json({
            success: false,
            message:"User does not exist"
        })
       }

       const isMatch = await bcrypt.compare(password,existingUser.password);
       if(isMatch){
          const token = jwt.sign({ _id: existingUser._id}, JWT_SECRET);
          return res.status(200).json({
            success: true,
            token,
            user: { name: existingUser.name},
            message: "Login successfull"
          })
       } else {
        return res.json({
            success:false,
            message: "Invalid credentials"
        })
       }
    } catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
} 



export const userCredits = async (req, res) => {
   try {
    const userId = req.user._id;
    console.log('userrrId', userId);

    const  user = await User.findById(userId)
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "user not found"
        });
    }
    res.status(200).json({
        success: true,
        credits: user.creditBalance,
        user: { name: user.name}
    })
   } catch(error){
    console.log('Error fetching credits: ', error);
    return res.status(411).json({
        success: 'false',
        message: "Doesnt able to retrieve creditbalance"
    })
   }
}

