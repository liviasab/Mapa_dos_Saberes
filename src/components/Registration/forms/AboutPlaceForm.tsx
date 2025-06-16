import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { StarRating } from "../../Rating/StarRating";

interface AboutPlaceData {
  name: string;
  visit_date: string;
  address: string;
  contact: string;
  email: string;
  description: string;
  media_urls: string[];
  rating: number;
}

interface AboutPlaceFormProps {
  data: AboutPlaceData;
  onDataChange: (data: AboutPlaceData) => void;
}

export const AboutPlaceForm: React.FC<AboutPlaceFormProps> = ({
  data,
  onDataChange,
}) => {
  const [rating, setRating] = useState(data?.rating || 0);

  const lastDataRef = useRef<AboutPlaceData | null>(null);
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<AboutPlaceData>({
    defaultValues: data,
  });

  const watchedData = watch();
  const [mediaUrls, setMediaUrls] = useState<string[]>(data.media_urls || []);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);

  // Função para extrair o caminho do arquivo da URL
  const getFilePathFromUrl = useCallback((url: string): string | null => {
    const pattern = /\/spaces\/(.+)$/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  }, []);

  useEffect(() => {
    if (lastDataRef.current !== data) {
      reset(data);
      setMediaUrls(data.media_urls || []);

      // Extrair e armazenar o caminho do arquivo da URL existente
      if (data.media_urls && data.media_urls.length > 0) {
        const path = getFilePathFromUrl(data.media_urls[0]);
        setCurrentFilePath(path);
      } else {
        setCurrentFilePath(null);
      }

      lastDataRef.current = data;
    }
  }, [data, reset, getFilePathFromUrl]);

  useEffect(() => {
    const currentFormData = {
      ...watchedData,
      media_urls: mediaUrls,
      rating: rating,
    };
    const hasChanged =
      JSON.stringify(currentFormData) !== JSON.stringify(lastDataRef.current);

    if (hasChanged) {
      onDataChange(currentFormData);
      lastDataRef.current = currentFormData;
    }
  }, [watchedData, mediaUrls, onDataChange, rating]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
        // Remover imagem existente ANTES de fazer novo upload
        if (mediaUrls.length > 0) {
          const url = mediaUrls[0];
          const pathToDelete = currentFilePath || getFilePathFromUrl(url);
          console.log(pathToDelete);
          if (pathToDelete) {
            console.log("entrei aqui");
            const { error } = await supabase.storage
              .from("spaces")
              .remove([pathToDelete]);
            if (error) console.error("Erro ao remover imagem anterior:", error);
          }
        }

        const { data: authData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !authData?.user) {
          alert("Erro de autenticação!");
          return;
        }

        const fileName = `${Date.now()}-${file.name.replace(
          /[^a-z0-9.]/gi,
          "_"
        )}`;
        const filePath = `${authData.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("spaces")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("spaces")
          .getPublicUrl(filePath);
        const publicUrl = publicUrlData?.publicUrl;
        if (publicUrl) {
          setMediaUrls([publicUrl]);
          setCurrentFilePath(filePath);
        } else {
          throw new Error("Erro ao obter URL pública.");
        }
      } catch (err) {
        alert("Erro ao fazer upload: " + err);
        console.error(err);
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [mediaUrls, currentFilePath, getFilePathFromUrl]
  );

  const handleRemoveImage = useCallback(async () => {
    if (mediaUrls.length === 0) return;

    const url = mediaUrls[0];
    const pathToDelete = currentFilePath || getFilePathFromUrl(url);

    if (!pathToDelete) {
      alert("Não foi possível determinar o caminho do arquivo para exclusão.");
      return;
    }

    try {
      const { error } = await supabase.storage
        .from("spaces")
        .remove([pathToDelete]);

      if (error) {
        throw new Error(error.message);
      }

      // Atualiza estados apenas se a exclusão for bem-sucedida
      setMediaUrls([]);
      setCurrentFilePath(null);
    } catch (err) {
      alert("Erro ao excluir imagem do storage: " + err);
      console.error(err);
    }
  }, [mediaUrls, currentFilePath, getFilePathFromUrl]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Place Name *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...register("name", { required: "Place name is required" })}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter place name"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Visit *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              {...register("visit_date", {
                required: "Visit date is required",
              })}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.visit_date && (
            <p className="text-sm text-red-600">{errors.visit_date.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register("address", { required: "Address is required" })}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full address"
          />
        </div>
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...register("contact", { required: "Contact is required" })}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number"
            />
          </div>
          {errors.contact && (
            <p className="text-sm text-red-600">{errors.contact.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={4}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the place and its educational value..."
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Avaliação (1-5 estrelas)
        </label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div>
        <label
          htmlFor="media-upload"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Visit Media (Image)
        </label>

        <input
          id="media-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading || mediaUrls.length >= 1}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />

        {isUploading && (
          <p className="mt-2 text-sm text-blue-600 flex items-center">
            <UploadCloud className="w-4 h-4 mr-2 animate-bounce" />
            Uploading image...
          </p>
        )}

        {mediaUrls.length > 0 && (
          <div className="mt-4 bg-gray-100 p-3 rounded-md flex items-center justify-between">
            <span className="text-sm text-gray-800 truncate max-w-[80%]">
              {mediaUrls[0].split("/").pop()?.split("?")[0]}
            </span>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="ml-4 text-red-500 hover:text-red-700"
              aria-label="Remove image"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
