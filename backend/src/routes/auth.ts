import express,{Request , Response} from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";



const router = express.Router();

router.post("/login", [
    check("email", "Email is empty").isEmail(),
    check("passsword", "Password with 6 or more characters required").isLength({
        min: 6 ,
    })
],async (req:Request , res: Response) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return res.status(400).json({message : errors.array()})
        
    }
    

    const {email ,password} = req.body;
    try {
        const user = await User.findOne({email})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message : " Something went Wrong"});
        
    }

})