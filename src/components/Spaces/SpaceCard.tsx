import React from "react";
import { Star, MapPin, ExternalLink, Edit, Trash2 } from "lucide-react";
import { Space, deleteSpace } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SpaceCardProps {
  space: Space;
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedSpace: Space) => void;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  onViewDetails,
  onDelete,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this space?")) {
      const { error } = await deleteSpace(space.id);
      if (error) {
        console.error("Error deleting space:", error);
      } else {
        onDelete(space.id);
      }
    }
  };

  const handleClick = () => {
    onViewDetails(space.id);
  };

  const handleEdit = () => {
    navigate(`/spaces/${space.id}/edit`);
  };



  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          {space.media_urls && space.media_urls.length > 0 ? (
            <img
              src={space.media_urls[0]}
              alt={space.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
          <span className="ml-1 text-xs font-medium text-gray-700">
            {space.rating ? space.rating.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {space.name}
          </h3>
          {space.type && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
              {space.type}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {space.description}
        </p>

        <a
  href={`https://www.google.com/maps/search/?api=1&query=${space.address.replace(/\s+/g, '+')}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-start space-x-2 text-sm text-gray-500 mb-4 hover:text-blue-600 transition-colors cursor-pointer min-w-0"
  onClick={(e) => e.stopPropagation()}
>
  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
  <span className="hover:underline">{space.address}</span>
</a>

        {space.theme_tags && space.theme_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {space.theme_tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  index % 2 === 0
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {tag}
              </span>
            ))}
            {space.theme_tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{space.theme_tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-[#12557B] to-[#40B873] hover:from-[#12557B]/90 hover:to-[#40B873]/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
        >
          <span>Ver mais informações</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {user && user.email === "lms18@discente.ifpe.edu.br" && (
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-blue-600"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
