import React, { useEffect, useState } from 'react';
import './Profile.css'; // Import the CSS file
import axios from "axios";

export default function Profile() {
  const [recipes, setRecipes] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);

  // Decode the JWT token to get the user ID
  const decodeJwt = (token) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  };

  const token = localStorage.getItem("token");
  const userId = decodeJwt(token)?.id;

  // Fetch user recipes from the API
  const fetchUserRecipes = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/recipe/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        setRecipes(data.data); // Update state with user recipes
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      setError('Failed to fetch user recipes');
    }
  };

  // Fetch user name from the API
  const fetchUserName = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        setUserName(data.data.name); // Update state with user name
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      setError('Failed to fetch user name');
    }
  };

  useEffect(() => {
    fetchUserRecipes();
    fetchUserName();
  }, [userId]);

  const handleView = (id) => {
    // Navigate to the recipe details page
    window.location.href = `/recipe/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/recipe/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setRecipes(recipes.filter((recipe) => recipe._id !== id)); // Remove the deleted recipe from the list
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError('Failed to delete the recipe');
    }
  };

  return (
    <div className="Container">
      <div className="Content">
        <div className="ProfileCard">
          <div className="ProfileHeader">
            <div className="avatar">
              <img src="/placeholder.svg" alt="Avatar" />
            </div>
            <div className="ProfileInfo">
              <h2 className="ProfileName">{userName}</h2> {/* Display fetched user name */}
              <p className="Username">@flavarFanatic</p>
            </div>
          </div>
        </div>

        <div className="RecipesCard">
          <h2 className="RecipesTitle">My Recipes</h2>

          <div className="RecipeList">
            {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe._id} className="RecipeRow">
                  <div className="RecipeInfo">
                    <h3 className="RecipeName">{recipe.title}</h3>
                    <p className="RecipeDescription">{recipe.description}</p>
                  </div>
                  <div className="RecipeActions">
                    <button className="view-button" onClick={() => handleView(recipe._id)}>View</button>
                    <button className="delete-button" onClick={() => handleDelete(recipe._id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No recipes found.</p> 
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
