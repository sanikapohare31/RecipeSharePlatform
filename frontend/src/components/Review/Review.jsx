// import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Review.css'; // Make sure to update this CSS file to match the styles
import { useState,useEffect } from 'react';
const ReviewComponent = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all reviews for the recipe on component mount
    axios.get(`http://localhost:4000/api/reviews/${recipeId}`)
      .then((response) => {
        console.log("Reviews fetched:", response.data); // Log the response data
        if (response.data.success && Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews); // Set the reviews array
        } else {
          console.error("Expected an array of reviews, but got:", response.data);
          setReviews([]); // Reset to an empty array if the response is not valid
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews", error);
        setReviews([]); // Reset to an empty array on error
      });
  }, [recipeId]);

  const handleReviewSubmit = () => {
    axios.post(`http://localhost:4000/api/reviews`, { recipeId, review: newReview }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        setMessage('Review added successfully!');
        setReviews((prevReviews) => [...prevReviews, response.data.review]); // Assuming the API response includes the new review
        setNewReview(''); // Clear the input
      })
      .catch((error) => {
        setMessage('Error adding review');
        console.error("Error adding review", error);
      });
  };

  return (
    <div className="comments-container">
      <h2 className="comments-title">Comments</h2>
      
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Write your review here..."
        className="review-input"
      />
      <button onClick={handleReviewSubmit} className="submit-button">Submit Review</button>
      <p className="message">{message}</p>
      
      <div className="comment-list">
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="comment">
              <div className="comment-header">
                <div className="avatar">
                  <img src="/frontend/public/userProfileImage.jpg" alt={review.createdBy?.name || 'Unknown User'} />
                </div>
                <div className="comment-meta">
                  <div className="comment-author-date">
                    <h3 className="comment-author">{review.createdBy?.name || 'Unknown User'}</h3>
                    <span className="comment-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="comment-content">{review.review}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
