
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewFormData } from '@/lib/types';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(500, 'Review cannot exceed 500 characters'),
  reservationId: z.string().optional(),
});

interface ReviewFormProps {
  spotId: string;
  reservationId?: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ spotId, reservationId, onSuccess }: ReviewFormProps) => {
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      reservationId,
    },
  });

  const watchedRating = form.watch('rating');

  const handleSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        spot_id: spotId,
        user_id: user.id,
        reservation_id: data.reservationId,
        rating: data.rating,
        comment: data.comment,
      });

      if (error) throw error;

      toast.success('Review submitted successfully');
      form.reset({ rating: 0, comment: '', reservationId });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => form.setValue('rating', rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`cursor-pointer ${
                rating <= (hoveredRating || watchedRating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience with this parking spot</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      {renderStars()}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {watchedRating > 0 ? `${watchedRating} ${watchedRating === 1 ? 'star' : 'stars'}` : 'Select a rating'}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share details of your experience with this parking spot..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your review will help others make better decisions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || watchedRating === 0}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ReviewForm;
