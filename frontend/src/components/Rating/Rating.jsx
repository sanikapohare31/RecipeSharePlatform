import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Rating.css';

const RatingComponent = ({ recipeId }) => {
  const [userRating, setUserRating] = useState(0); // or null to signify no rating
  const [averageRating, setAverageRating] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch average rating on component mount
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

  const handleRatingSubmit = async () => {
    if (userRating < 1 || userRating > 5) {
      setMessage('Rating must be between 1 and 5.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/ratings', { recipeId, rating: userRating }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage('Rating submitted successfully!');

      // Update average rating after new rating is added
      const response = await axios.get(`http://localhost:4000/api/ratings/${recipeId}/average`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      setMessage('Error submitting rating');
      console.error("Error submitting rating", error);
    }
  };

  return (
    <div>
      <h3>Rate this Recipe</h3>
      <input
        type="number"
        value={userRating}
        min="1"
        max="5"
        onChange={(e) => setUserRating(Number(e.target.value))}
      />
      <button onClick={handleRatingSubmit} disabled={userRating < 1 || userRating > 5}>
        Submit Rating
      </button>
      <p>Average Rating: {Number.isFinite(averageRating) ? averageRating.toFixed(1) : 'N/A'}</p>
      {message && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RatingComponent;
