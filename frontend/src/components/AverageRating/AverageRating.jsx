import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AverageRating = ({ recipeId }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/ratings/${recipeId}/average`);
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error("Error fetching average rating", error);
        setError('Error fetching average rating. Please try again later.');
      }
    };

    fetchAverageRating();
  }, [recipeId]);

  return (
    <div className="average-rating">
      <p>
        {Number.isFinite(averageRating) ? averageRating.toFixed(1) : 'N/A'}
      </p>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AverageRating;
