import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login user
const loginUser = async (req,res)=>{
    const{email,password}=req.body;
    try{
        const user= await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User does not exist!"})
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials!"})
        }
        const token = createToken(user._id);
        res.json({success:true,token})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error!"})
    }

}
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
}
//register user
const registerUser = async(req,res)=>{
    const {name,email,password} = req.body;
    try{
        //checking if user already exists
        const exists= await User.findOne({email});
        if(exists){
            return res.json({success:false,message:"User Already Exists!"})
        }
        //validating email and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Plz enter a valid Email!"})

        }
        //checking password length is atleast 8 characters
        if(password.length < 8){
            return res.json({success:false,message:"Plz enter a strong password"})
        }

        //hashing user password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser= new User({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save()
        const token= createToken(user._id)
        res.json({success:true,token})

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}
const fetchUserDetails = async (req, res) => {
    const userId = req.params.userId; // Assuming userId is passed as a URL parameter
    try {
        const user = await User.findById(userId).select('-password'); // Fetch user by ID and exclude the password

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user }); // Send the user data in response
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching user details" }); // Proper error handling
    }
};


export {loginUser,registerUser,fetchUserDetails};
