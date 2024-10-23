import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./SavedRecipes.css";
const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the saved recipes when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("token"); // Assuming you're using localStorage for the token

        const getSavedRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/savedRecipes/get', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the headers
                    },
                });

                // Extract the savedRecipes from the response data
                const recipes = response.data.savedRecipes;
                
                if (Array.isArray(recipes)) {
                    setSavedRecipes(recipes);
                } else {
                    throw new Error("Fetched data does not contain an array of recipes.");
                }
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message); // Set the error message
            } finally {
                setLoading(false);
            }
        };

        getSavedRecipes();
    }, []); // Empty dependency array to run only on mount

    // Render loading state
    if (loading) {
        return <div>Loading saved recipes...</div>;
    }

    // Render error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render saved recipes
    return (
        <div className='saved-recipes'>
            <h1>Saved Recipes</h1>
            <ul>
                {savedRecipes.length === 0 ? (
                    <li>No saved recipes found.</li>
                ) : (
                    savedRecipes.map(recipe => (
                        <li key={recipe._id}>
                            <h2>{recipe.title}</h2>
                            <p>Ingredients: {recipe.ingredients?.join(', ')}</p>
                            <p>Instructions: {recipe.instructions?.join(', ')}</p>
                            {/* Add other relevant fields as necessary */}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default SavedRecipes;
