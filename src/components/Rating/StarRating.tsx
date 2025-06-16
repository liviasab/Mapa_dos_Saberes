import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating: propRating,
  onRatingChange,
  readOnly = false,
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const [rating, setRating] = useState(propRating);

  useEffect(() => {
    setRating(propRating);
  }, [propRating]);

  const handleClick = (value: number) => {
    if (!readOnly && onRatingChange) {
      setRating(value);
      onRatingChange(value);
    }
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
              className="hidden"
              disabled={readOnly}
            />
            <Star
              className={`w-6 h-6 cursor-pointer ${
                (hover || rating) >= ratingValue
                  ? "text-yellow-500 fill-current"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => !readOnly && setHover(ratingValue)}
              onMouseLeave={() => !readOnly && setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};
