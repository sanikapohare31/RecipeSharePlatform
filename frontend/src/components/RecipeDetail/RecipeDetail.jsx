import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './RecipeDetail.css';
import ReviewComponent from '../Review/Review';
import RatingComponent from '../Rating/Rating';
import { Link } from 'react-router-dom';

const RecipeDetail = () => {
    const { id } = useParams(); // Get the recipe ID from the URL parameters
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    useEffect(() => {
        const getRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/recipe/${id}`);
                setRecipe(response.data.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch recipe details');
            } finally {
                setLoading(false);
            }
        };
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/recipe/recommendations/${id}`); // Adjust this endpoint based on your backend
                console.log(response.data);
                setRecommendations(response.data);
                console.log(recommendations);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch recommendations');
            }
        };


        getRecipe();
        fetchRecommendations();
    }, [id]);
    

    if (loading) return <p>Loading recipe details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="view-full-recipe">
            <div className="Recipe-header">
                <div className="Recipe-info">
                    <h2 className='Recipe-title'>{recipe.title}</h2>
                    <h2 className='Recipe-owner'>By {recipe.createdBy.name}</h2>
                </div>
                <img className="Recipe-image" src={`http://localhost:4000/images/${recipe.image}`} alt={recipe.title} />

            </div>
            <div className='recipe-description'>
                <div className='recipe-details'>
                <div className='label-info'>
                    <b>Cooking Time:</b>
                    <span className='value'>{recipe.cookingTime} mins</span>
                </div>
                <div className='label-info'>
                    <b>Cuisine:</b>
                    <span className='value'>{recipe.cuisine}</span>
                </div>
                </div>
                <div className='description'>
                    <b>Description</b>
                    <p>{recipe.description}</p>
                </div>
            </div>

            <div className="Recipe-content">
                <div className="ingredients-section">
                    <h2 className="section-title">Ingredients</h2>
                    <ul className="ingredients-list">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="ingredient-item">
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="instructions-section">
                    <h2 className="section-title">Instructions</h2>
                    <ol className="instructions-list">
                        {recipe.instructions.map((instruction, index) => (
                            <li key={index} className="instruction-item">
                                <b>Step {index + 1}:</b>
                                {instruction}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            <div className="rating-section">
                <h2 className="section-title">Rate this Recipe</h2>
                <RatingComponent recipeId={id} />
            </div>

            {/* Review Component */}
            <div className="review-section">
                <h2 className="section-title">Reviews</h2>
                <ReviewComponent recipeId={id} />
            </div>

            <div className="recommendationsSection">
                <h2 className="sectionTitle">Recommended Recipes</h2>
                {Array.isArray(recommendations) && recommendations.length > 0 ? (
                    <div className="recipeGrid">
                        {recommendations.map(recipe => (
                            <div className="recipe--card" key={recipe._id}>
                                <Link to={`http://localhost:4000/api/recipe/${id}`}>
                                    <img src={`http://localhost:4000/images/${recipe.image}`} alt={recipe.title} />
                                    <h3>{recipe.title}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recommendations available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
