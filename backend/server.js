import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.js"
import recipeRouter from "./routes/recipeRoute.js"
import userRouter from "./routes/userRoute.js"
import saveRecipeRouter from "./routes/saveRecipeRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import ratingRouter from "./routes/ratingRoute.js"
import 'dotenv/config'
//app config
const app=express()
const port=4000

//middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

//api endpoints
app.use("/api/recipe",recipeRouter)
app.use("/images",express.static('uploads'))
app.get("/",(req,res)=>{
    res.send("API Working")
})

app.use("/api/user",userRouter);
app.use("/api/savedRecipes",saveRecipeRouter);

app.use('/api/ratings', ratingRouter);
app.use('/api/reviews', reviewRouter);

app.listen(port,()=>{
    console.log(`Server started in http://localhost:${port}`)
})
