import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VerifyRecipes.css';

const VerifyRecipes = () => {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:4000/api/admin/pendingRecipes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingRecipes(response.data.recipes || []);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRecipes();
  }, []);

  const approveRecipe = async (id) => {
    try {
      await axios.post(`http://localhost:4000/api/admin/approveRecipe/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPendingRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const rejectRecipe = async (id) => {
    try {
      await axios.post(`http://localhost:4000/api/admin/rejectRecipe/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPendingRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  if (loading) {
    return <div>Loading pending recipes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="verify-recipes-container">
      <h1>Verify Pending Recipes</h1>
      <ul className="recipe-list">
        {pendingRecipes.length > 0 ? (
          pendingRecipes.map((recipe) => (
            <li key={recipe._id} className="recipe-item">
              <div className="recipe-info">
                <h3>{recipe.title} by {recipe.createdBy.name}</h3>
                <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
                <p><strong>Dietary Preferences:</strong> {recipe.dietaryPreferences.join(', ') || 'None'}</p>
                <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
                <p><strong>Difficulty Level:</strong> {recipe.difficulty}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
                <p><strong>Instructions:</strong></p>
                <ol>
                  {recipe.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ol>
                {recipe.image && (
                  <>
                    <p><strong>Image URL:</strong> {recipe.image}</p>
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                  </>
                )}
              </div>
              <div className="recipe-actions">
                <button className="approve-btn" onClick={() => approveRecipe(recipe._id)}>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => rejectRecipe(recipe._id)}>
                  Reject
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No pending recipes available for review.</p>
        )}
      </ul>
    </div>
  );
};

export default VerifyRecipes;
