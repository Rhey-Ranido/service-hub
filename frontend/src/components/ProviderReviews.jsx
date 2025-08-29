import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Star, User, Calendar, Edit, Trash2, Loader2, Info } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ProviderReviews = ({ providerId, onReviewUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  // Debug logging
  console.log('🔍 ProviderReviews component initialized with providerId:', providerId);
  console.log('🌐 API_BASE_URL:', API_BASE_URL);


  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  // Debug authentication
  console.log('🔐 Authentication status:', {
    hasToken: !!token,
    currentUser: currentUser ? { id: currentUser._id, name: currentUser.firstName } : null
  });

  useEffect(() => {
    if (providerId) {
      fetchReviews();
    } else {
      console.warn('⚠️ ProviderReviews: No providerId provided');
      setError('No provider ID provided');
      setLoading(false);
    }
  }, [providerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching reviews for provider:', providerId);
      console.log('🌐 API URL:', `${API_BASE_URL}/reviewProvider/${providerId}`);
      
      const response = await fetch(`${API_BASE_URL}/reviewProvider/${providerId}`);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch reviews');
      }
      
      const data = await response.json();
      console.log('✅ Reviews fetched:', data);
      setReviews(data);
    } catch (err) {
      console.error('❌ Error fetching reviews:', err);
      setError(`Failed to load reviews: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Please log in to leave a review');
      return;
    }

    if (!formData.comment.trim()) {
      setError('Please provide a comment');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const url = editingReview 
        ? `${API_BASE_URL}/reviewProvider/${editingReview._id}`
        : `${API_BASE_URL}/reviewProvider/${providerId}`;
      
      const method = editingReview ? 'PUT' : 'POST';
      
      console.log('🚀 Submitting review:', {
        url,
        method,
        providerId,
        editingReview: editingReview?._id,
        formData
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: formData.rating,
          comment: formData.comment.trim()
        })
      });

      console.log('📡 Submit response status:', response.status);
      console.log('📡 Submit response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Submit API Error:', errorData);
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const result = await response.json();
      console.log('✅ Review submitted:', result);
      
      if (editingReview) {
        setReviews(prev => prev.map(review => 
          review._id === editingReview._id ? result.review || result : review
        ));
        setSuccess('✅ Your review has been updated successfully!');
      } else {
        setReviews(prev => [result, ...prev]);
        setSuccess('✅ Your review has been submitted successfully!');
      }

      // Reset form
      setFormData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      setEditingReview(null);

      // Notify parent component about review update
      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (err) {
      console.error('❌ Error submitting review:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const reviewToDelete = reviews.find(review => review._id === reviewId);
    const userName = reviewToDelete?.userId?.fullName || 
                   `${reviewToDelete?.userId?.firstName || ''} ${reviewToDelete?.userId?.lastName || ''}`.trim() || 
                   'this review';
    
    if (!confirm(`Are you sure you want to delete ${userName}'s review? This action cannot be undone.`)) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      console.log('🗑️ Deleting review:', reviewId);
      
      const response = await fetch(`${API_BASE_URL}/reviewProvider/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Delete API Error:', errorData);
        throw new Error(errorData.message || 'Failed to delete review');
      }

      setReviews(prev => prev.filter(review => review._id !== reviewId));
      setSuccess('🗑️ Your review has been deleted successfully!');
      console.log('✅ Review deleted successfully');

      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (err) {
      console.error('❌ Error deleting review:', err);
      setError(`Failed to delete review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    if (confirm('Are you sure you want to edit this review? You can modify your rating and comment.')) {
      setEditingReview(review);
      setFormData({
        rating: review.rating,
        comment: review.comment
      });
      setShowReviewForm(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setFormData({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const formatDate = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return reviewDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const userHasReviewed = currentUser ? reviews.some(review => 
    review.userId?._id === currentUser._id || review.userId === currentUser._id
  ) : false;

  const userReview = currentUser ? reviews.find(review => 
    review.userId?._id === currentUser._id || review.userId === currentUser._id
  ) : null;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading reviews...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {reviews.length > 0 
                    ? `${(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)} average`
                    : 'No reviews yet'
                  }
                </span>
              </div>
            )}
          </div>
          {token && !userHasReviewed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(true)}
            >
              {reviews.length === 0 ? 'Be the First to Review' : 'Write a Review'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <Card className={`mb-6 border-2 ${editingReview ? 'border-primary/30 bg-primary/5' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {editingReview ? (
                  <Edit className="h-5 w-5 text-primary" />
                ) : (
                  <Star className="h-5 w-5 text-primary" />
                )}
                <CardTitle className="text-lg">
                  {editingReview ? 'Edit Your Review' : 'Write a Review'}
                </CardTitle>
              </div>
              {currentUser && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">
                      {editingReview ? 'Editing review as' : 'Writing as'}:
                    </span>
                    <div className="flex items-center gap-2">
                      {currentUser?.profileImage ? (
                        <img
                          src={currentUser.profileImage}
                          alt={`${currentUser.firstName || 'User'}'s profile`}
                          className="w-5 h-5 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <span className="font-medium text-primary">
                        {currentUser.fullName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                  {editingReview && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                      <p className="text-xs text-blue-700 mb-2">
                        <Info className="h-3 w-3 inline mr-1" />
                        You're editing your existing review. Changes will update your rating and comment.
                      </p>
                      <div className="text-xs text-blue-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Current Rating:</span>
                          <div className="flex gap-1">
                            {renderStars(editingReview.rating)}
                          </div>
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Current Comment:</span>
                          <p className="text-blue-700 mt-1 italic">"{editingReview.comment}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            index < formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {editingReview ? 'New rating' : 'Current rating'}: {formData.rating} out of 5 stars
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comment <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this provider..."
                    rows={4}
                    required
                    minLength={10}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>Minimum 10 characters, maximum 1000 characters</span>
                    <span className={`font-medium ${formData.comment.length >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.comment.length}/1000
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className={editingReview ? 'bg-primary hover:bg-primary/90' : 'bg-primary hover:bg-primary/90'}
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editingReview ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Review
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* User's Review (if exists) */}
        {userReview && (
          <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-primary flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Your Review
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(userReview.createdAt)}
                    </Badge>
                    {userReview.updatedAt && userReview.updatedAt !== userReview.createdAt && (
                      <Badge variant="outline" className="text-xs text-gray-600">
                        <Edit className="h-3 w-3 mr-1" />
                        Edited {formatDate(userReview.updatedAt)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {renderStars(userReview.rating)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-start gap-3 mb-4">
                {currentUser?.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={`${currentUser.firstName || 'User'}'s profile`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    {currentUser?.fullName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Your Review'}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{userReview.comment}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                <div className="text-xs text-gray-500">
                  You can edit or delete this review at any time
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditReview(userReview)}
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteReview(userReview._id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Other Reviews */}
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No reviews yet</p>
            <p className="text-sm text-gray-600 mb-4">Be the first to review this provider!</p>
            {token && (
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(true)}
                className="mx-auto"
              >
                Write the First Review
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.filter(review => !userReview || review._id !== userReview._id).length > 0 && (
              <div className="border-b border-gray-100 pb-2 mb-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Other Reviews ({reviews.filter(review => !userReview || review._id !== userReview._id).length})
                </h4>
              </div>
            )}
            {reviews
              .filter(review => !userReview || review._id !== userReview._id)
              .map((review) => (
                <Card key={review._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        {review.userId?.profileImage ? (
                          <img
                            src={review.userId.profileImage}
                            alt={`${review.userId.firstName || 'User'}'s profile`}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">
                            {review.userId?.fullName || `${review.userId?.firstName || ''} ${review.userId?.lastName || ''}`.trim() || 'Anonymous'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderReviews; 