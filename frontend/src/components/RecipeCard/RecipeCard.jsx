import React from 'react';
import { Star, BookmarkPlus, Clock } from "lucide-react";
import './RecipeCard.css';
import AverageRating from '../AverageRating/AverageRating';

const RecipeCard = ({ recipe, isSaved, onView, onSave }) => {
    console.log(recipe);
    return (
        <div className="recipe-card">
            <div className="recipe-image-wrapper">
                <img
                    src={`http://localhost:4000/images/${recipe.image}`}
                    alt={recipe.title}
                    className="recipe-image"
                />
                <button
                    className={`save-icon ${isSaved ? "saved" : ""}`}
                    onClick={onSave}
                >
                    <BookmarkPlus className="bookmark-icon" />
                </button>
            </div>
            <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <div className="ratings">
                    <Star className="icon" />
                    <AverageRating recipeId={recipe._id}/>
                    <span className="reviews-count"></span>
                </div>
                <div className="recipe-time">
                    <Clock className="clock-icon" />
                    <span>{recipe.cookingTime} mins</span>
                </div>
            </div>
            <button className="view-recipe-btn" onClick={onView}>
                View Full Recipe
            </button>
        </div>
    );
};

export default RecipeCard;
