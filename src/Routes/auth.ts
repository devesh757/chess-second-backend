import {Router,Request,Response} from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../db/userModel"
import z from "zod"

const user = Router();

user.post("/signup",async(req:Request,res:Response) =>{
  try{
    const body = req.body;
    const usermodel = z.object({
        firstname:z.string().min(4).max(20),
        lastname:z.string().min(4).max(20),
        email:z.string().min(6).max(40).email(),
        password:z.string().min(6).max(16)
    })

    const user = usermodel.safeParse(body);
    if(!user.success){
        return res.status(403).json({
            message:"Invalid format",
            success:false
        })
    }

   const existinguser = await User.findOne({email:user.data.email});
   if(existinguser){
     return res.status(404).json({
        message:"Username already exists",
        success:false
     })
   }

   const hashedpassword = await bcrypt.hash(user.data.password,10);

   await User.create({
    firstname:user.data.firstname,
    lastname:user.data.lastname,
    email:user.data.email,
    password:hashedpassword
   })

   return res.status(200).json({
    message: "you are successfully signedup",
    success:true
   })

  }catch(e){
    res.status(500).json({
        message:"internal server error",
        success:false
    })
  }
})

user.post("/signin",async(req:Request,res:Response) => {
  try{
    const body = req.body;
    const usermodel = z.object({
      email:z.string().min(6).max(40).email(),
      password:z.string().min(6).max(16)
    })

    const user = usermodel.safeParse(body);
    if(!user.success){
      return res.status(403).json({
        message:"Invalid format",
        success:false
    })}

    const existinguser = await User.findOne({email:user.data.email});
    if(!existinguser){
      return res.status(404).json({
        message:"Invalid Username and Password",
        success:false
      })
    }

    const isvalidPassword = await bcrypt.compare(user.data.password,existinguser.password);
    if(!isvalidPassword){
      return res.status(401).json({
        message:"Invalid Credentials",
        success:false
    })}

    const token = jwt.sign({
      userId:existinguser._id
    },process.env.JWT_SECRET as string,{expiresIn:'7d'})
    
  return res.status(200).json({
    message:"you are successfully signin",
    token:token,
  })
  }catch(e){
    return res.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
})

export default user;