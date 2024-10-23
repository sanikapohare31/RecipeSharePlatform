import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import './SharedByYou.css';

const SharedByYou = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [filters, setFilters] = useState({
        cuisine: [],
        dietary: [],
        cookingTime: [],
    });
    const navigate = useNavigate();

    const [showMoreCuisines, setShowMoreCuisines] = useState(false);
    const [showMoreDietary, setShowMoreDietary] = useState(false);

    const cuisines = ["Italian", "Mexican", "Indian", "Chinese", "Thai", "French", "Japanese", "Mediterranean"];
    const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo", "Dairy-Free"];

    const viewFullRecipe = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

    const handleSave = async (recipeId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:4000/api/savedRecipes/add`,
                { recipeId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setSavedRecipes((prevSavedRecipes) =>
                    prevSavedRecipes.includes(recipeId)
                        ? prevSavedRecipes.filter((id) => id !== recipeId)
                        : [...prevSavedRecipes, recipeId]
                );
                console.log("Saved successfully!!");
            }
        } catch (err) {
            console.error("Failed to save recipe", err);
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/recipe/list');
                setRecipes(response.data.data);
                setFilteredRecipes(response.data.data); // Display all recipes initially
            } catch (err) {
                console.error(err);
                setError('Failed to fetch recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleFilterChange = (name, value) => {
        setFilters(prevFilters => {
            if (name === 'cookingTime') {
                const currentValues = prevFilters.cookingTime;
                const newValues = currentValues.some(range => range[0] === value[0] && range[1] === value[1])
                    ? currentValues.filter(range => range[0] !== value[0] || range[1] !== value[1])
                    : [...currentValues, value];
                return {
                    ...prevFilters,
                    [name]: newValues,
                };
            } else {
                const currentValues = prevFilters[name];
                const newValues = currentValues.includes(value)
                    ? currentValues.filter(v => v !== value)
                    : [...currentValues, value];
                return {
                    ...prevFilters,
                    [name]: newValues,
                };
            }
        });
    };

    const handleApplyFilters = async () => {
        // Check if no filters are selected
        if (
            filters.cuisine.length === 0 &&
            filters.dietary.length === 0 &&
            filters.cookingTime.length === 0
        ) {
            setFilteredRecipes(recipes); // Show all recipes if no filters are selected
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:4000/api/recipe/filter', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    cuisine: filters.cuisine.join(','), // Join array to string for query
                    dietary: filters.dietary.join(','),
                    cookingTime: filters.cookingTime.map(range => `${range[0]}-${range[1]}`).join(','),
                },
            });

            // Update state with filtered recipes
            setFilteredRecipes(response.data.data);
        } catch (err) {
            console.error("Failed to fetch filtered recipes", err);
        }
    };

    if (loading) return <p>Loading recipes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='shared-by-you-container'>
            <div className="sidebar-and-recipes">
                <div className="filter-sidebar">
                    <h3>Filters</h3>
                    <hr></hr>
                    <div className="filter-section">
                        <h4>Cuisine</h4>
                        {cuisines.slice(0, 5).map(cuisine => (
                            <label key={cuisine}>
                                <input
                                    type="checkbox"
                                    value={cuisine}
                                    checked={filters.cuisine.includes(cuisine)} // Maintain checkbox state
                                    onChange={() => handleFilterChange('cuisine', cuisine)}
                                />
                                {cuisine}
                            </label>
                        ))}
                        {showMoreCuisines && cuisines.slice(5).map(cuisine => (
                            <label key={cuisine}>
                                <input
                                    type="checkbox"
                                    value={cuisine}
                                    checked={filters.cuisine.includes(cuisine)} // Maintain checkbox state
                                    onChange={() => handleFilterChange('cuisine', cuisine)}
                                />
                                {cuisine}
                            </label>
                        ))}
                        <button onClick={() => setShowMoreCuisines(prev => !prev)}>
                            {showMoreCuisines ? "Show Less" : "Show More"}
                        </button>
                    </div>

                    <div className="filter-section">
                        <h4>Dietary Preferences</h4>
                        {dietaryOptions.slice(0, 5).map(diet => (
                            <label key={diet}>
                                <input
                                    type="checkbox"
                                    value={diet}
                                    checked={filters.dietary.includes(diet)} // Maintain checkbox state
                                    onChange={() => handleFilterChange('dietary', diet)}
                                />
                                {diet}
                            </label>
                        ))}
                        {showMoreDietary && dietaryOptions.slice(5).map(diet => (
                            <label key={diet}>
                                <input
                                    type="checkbox"
                                    value={diet}
                                    checked={filters.dietary.includes(diet)} // Maintain checkbox state
                                    onChange={() => handleFilterChange('dietary', diet)}
                                />
                                {diet}
                            </label>
                        ))}
                        <button onClick={() => setShowMoreDietary(prev => !prev)}>
                            {showMoreDietary ? "Show Less" : "Show More"}
                        </button>
                    </div>

                    <div className="filter-section">
                        <h4>Cooking Time</h4>
                        {[
                            { label: "Under 30 minutes", range: [0, 30] },
                            { label: "30-60 minutes", range: [30, 60] },
                            { label: "Over 60 minutes", range: [60, Infinity] },
                        ].map(time => (
                            <label key={time.label}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleFilterChange('cookingTime', time.range)}
                                />
                                {time.label}
                            </label>
                        ))}
                    </div>

                    <button className="apply-filters" onClick={handleApplyFilters}>
                        Apply Filters
                    </button>
                </div>

                <div className="recipe-list">
                    {Array.isArray(filteredRecipes) && filteredRecipes.length ? (
                        filteredRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe._id}
                                recipe={recipe}
                                isSaved={savedRecipes.includes(recipe._id)}
                                onView={() => viewFullRecipe(recipe._id)}
                                onSave={() => handleSave(recipe._id)}
                            />
                        ))
                    ) : (
                        <p>No recipes found with the selected filters.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedByYou;
