import React, { useState } from "react";
import "./AddRecipe.css";
import axios from "axios";
export default function AddRecipe() {
  const isLoggedIn = !!localStorage.getItem("token"); // Check if the token exists
  // Function to decode the JWT
  const decodeJwt = (token) => {
    if (!token) return null; // Handle cases where the token is not provided
    const payload = token.split('.')[1]; // Get the payload part of the token
    const decoded = JSON.parse(atob(payload)); // Decode from Base64
    return decoded; // Return the decoded object
  };

  // Assuming you have a way to get your JWT token
  const token = localStorage.getItem("token"); // Fetch the token from local storage
  const userId = decodeJwt(token)?.id; // Decode the JWT to get user ID
  console.log(userId);
  console.log(typeof (userId));

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(false);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [dietary, setDietary] = useState([]);
  const [cookingTime, setCookingTime] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };
  

  const handleDietaryChange = (option) => {
    if (dietary.includes(option)) {
      setDietary(dietary.filter((item) => item !== option));
    } else {
      setDietary([...dietary, option]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const userId = decodeJwt(token)?.id;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("description",description);
    formData.append("category", category);
    formData.append("cuisine", cuisine);
    formData.append("cookingTime", cookingTime);
    formData.append("difficulty", difficulty);
    formData.append("createdBy", userId);

    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}]`, ingredient);
    });

    // Append each instruction individually
    instructions.forEach((instruction, index) => {
      formData.append(`instructions[${index}]`, instruction);
    });
    dietary.forEach((preference, index) => {
      formData.append(`dietaryPreferences[${index}]`, preference);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/recipe/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token to the header
        },
      });

      console.log("FormData before submit:", formData);
      console.log("Submitting the recipe...");

      if (response.data.success) {
        alert("Recipe added successfully!");
        setTitle("");
        setImage(false);
        setDescription("");
        setIngredients([""]);
        setInstructions([""]);
        setCookingTime("");
        setDifficulty("");
        setCategory("");
        setCuisine("");
        setDietary([]);
      } else {
        alert("Error adding recipe: " + response.data.message);
      }
    } catch (error) {
      // Log the entire error object to view the response
      console.error("There was an error adding the recipe!", error);

      // Optionally check for specific error responses
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        alert("Error: " + error.response.data.message || "Something went wrong.");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error message:", error.message);
        alert("Error: " + error.message);
      }
    }
  };


  // Check if the user is logged in, and display a message if they are not
  if (!isLoggedIn) {
    return <p>Please log in to add a recipe.</p>;
  }

  return (
    <div className="container">
      <div className="Header">
        <h1>Unleash Your Culinary Creativity</h1>
        <p>Share your delicious recipes with the world.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Recipe Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter recipe title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Recipe Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Recipe Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Enter recipe description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-group">
              <textarea
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                rows="1"
                placeholder={`Ingredient ${index + 1}`}
                required
              ></textarea>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const updatedIngredients = [...ingredients];
                    updatedIngredients.splice(index, 1);
                    setIngredients(updatedIngredients);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, ""])}>
            Add Ingredient
          </button>
        </div>
        <div className="form-group">
          <label>Instructions</label>
          {instructions.map((instruction, index) => (
            <div key={index} className="instruction-group">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                rows="1"
                placeholder={`Step ${index + 1}`}
                required
              ></textarea>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const updatedInstructions = [...instructions];
                    updatedInstructions.splice(index, 1);
                    setInstructions(updatedInstructions);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setInstructions([...instructions, ""])}>
            Add Step
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Main-course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverages">Beverages</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Salads">Salads</option>
            <option value="Soups">Soups</option>
            <option value="Side-dishes">Side Dishes</option>
            <option value="Sauces-condiments">Sauces & Condiments</option>
            <option value="Baking">Baking</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cuisine">Cuisine</label>
          <select id="cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} required>
            <option value="">Select cuisine</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
            <option value="Mexican">Mexican</option>
            <option value="American">American</option>
            <option value="Japanese">Japanese</option>
            <option value="Asian">Asian</option>
            <option value="General">General</option>

          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            placeholder="Enter cooking time"
            required />
        </div>
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty Level (1-5)</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="">Select difficulty</option>
            {[1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Dietary Preferences</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={dietary.includes("vegetarian")}
                onChange={() => handleDietaryChange("vegetarian")}
              />
              Vegetarian
            </label>
            <label>
              <input
                type="checkbox"
                checked={dietary.includes("vegan")}
                onChange={() => handleDietaryChange("vegan")}
              />
              Vegan
            </label>
            <label>
              <input
                type="checkbox"
                checked={dietary.includes("gluten-free")}
                onChange={() => handleDietaryChange("gluten-free")}
              />
              Gluten-Free
            </label>
            <label>
              <input
                type="checkbox"
                checked={dietary.includes("nut-free")}
                onChange={() => handleDietaryChange("nut-free")}
              />
              Nut-Free
            </label>
            <label>
              <input
                type="checkbox"
                value="dairy-free"
                checked={dietary.includes("dairy-free")}
                onChange={(e) => handleDietaryChange("dairy-free")}
              />
              Dairy-Free
            </label>
            <label>
              <input
                type="checkbox"
                value="low-carb"
                checked={dietary.includes("low-carb")}
                onChange={(e) => handleDietaryChange("low-carb")}
              />
              Low-Carb
            </label>
            <label>
              <input
                type="checkbox"
                value="paleo"
                checked={dietary.includes("paleo")}
                onChange={(e) => handleDietaryChange("paleo")}
              />
              Paleo
            </label>
            <label>
              <input
                type="checkbox"
                value="keto"
                checked={dietary.includes("keto")}
                onChange={(e) => handleDietaryChange("keto")}
              />
              Keto
            </label>
            <label>
              <input
                type="checkbox"
                value="pescatarian"
                checked={dietary.includes("pescatarian")}
                onChange={(e) => handleDietaryChange("pescatarian")}
              />
              Pescatarian
            </label>

            <label>
              <input
                type="checkbox"
                value="kosher"
                checked={dietary.includes("kosher")}
                onChange={(e) => handleDietaryChange("kosher")}
              />
              Kosher
            </label>
          </div>
        </div>
        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
}
