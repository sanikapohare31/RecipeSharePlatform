import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    uploadedRecipes:{type:Object,default:{}},
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]

},{minimize:false})

const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;