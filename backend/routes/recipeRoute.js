import  express from "express"
import { addRecipe, listRecipe,removeRecipe,listUserRecipes,fetchRecipe ,filterRecipes,getRecommendations} from "../controllers/recipeController.js"
import multer from "multer"

const recipeRouter=express.Router();

// recipeRouter.post("/add",addRecipe)
//image storage engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
});

const upload = multer({storage:storage});
recipeRouter.post("/add",upload.single("image"),addRecipe);
recipeRouter.get("/list",listRecipe);
recipeRouter.get('/filter', filterRecipes);
recipeRouter.get('/user/:userId', listUserRecipes); 
recipeRouter.post("/remove",removeRecipe);
recipeRouter.get('/recommendations/:id', getRecommendations);
recipeRouter.get('/:id', fetchRecipe);



export default recipeRouter;