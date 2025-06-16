import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../Layout/Header";
import { SpaceCard } from "./SpaceCard";
import { supabase, Space } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export const SpacesList: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchSpaces();
  }, []);

  useEffect(() => {
    // Filter spaces based on search query
    if (searchQuery.trim() === "") {
      setFilteredSpaces(spaces);
    } else {
      const filtered = spaces.filter(
        (space) =>
          space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          space.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpaces(filtered);
    }
  }, [spaces, searchQuery]);

  const fetchSpaces = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching spaces:", error);
    } else if (data) {
      setSpaces(data);
      setFilteredSpaces(data);
    }
    setLoading(false);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/spaces/${id}`);
  };

  const handleDelete = (id: string) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));
    setFilteredSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdate = (updatedSpace: Space) => {
    const newSpaces = spaces.map((s) =>
      s.id === updatedSpace.id ? updatedSpace : s
    );
    setSpaces(newSpaces);
    setFilteredSpaces(newSpaces);
  };

  const handleRegisterNew = () => {
    navigate("/register");
  };

  const handleFilterClick = () => {
    // TODO: Implement filter modal
    console.log("Filter clicked");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={handleFilterClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Discover Spaces
            </h1>
            <p className="text-gray-600 mt-2">
              Explore educational spaces for interdisciplinary learning
            </p>
          </div>

          {user?.email === "lms18@discente.ifpe.edu.br" && (
            <button
              onClick={handleRegisterNew}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Register New Space</span>
            </button>
          )}
        </div>

        {filteredSpaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No spaces found" : "No spaces yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No spaces match "${searchQuery}". Try a different search term.`
                : "Be the first to register an educational space!"}
            </p>
            {user?.email === "lms18@discente.ifpe.edu.br" && (
              <button
                onClick={handleRegisterNew}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Register First Space
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
