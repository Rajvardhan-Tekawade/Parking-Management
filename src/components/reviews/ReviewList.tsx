
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface ReviewListProps {
  spotId: string;
  limit?: number;
}

const ReviewList = ({ spotId, limit = 5 }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [spotId, limit]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // Fetch reviews for the specified spot
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('*, profiles(name)')
        .eq('spot_id', spotId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform the data to include the user's name
      const reviewsWithUserNames = reviewsData.map((review: any) => ({
        id: review.id,
        spotId: review.spot_id,
        userId: review.user_id,
        reservationId: review.reservation_id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        userName: review.profiles?.name || 'Anonymous User',
      }));

      setReviews(reviewsWithUserNames);

      // Calculate average rating
      if (reviewsWithUserNames.length > 0) {
        const totalRating = reviewsWithUserNames.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / reviewsWithUserNames.length);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-3 h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No reviews yet. Be the first to review this parking spot!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Reviews</h3>
          <span className="text-sm text-muted-foreground">({reviews.length})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="font-medium">{averageRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div>{renderStars(review.rating)}</div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm">{review.comment}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
