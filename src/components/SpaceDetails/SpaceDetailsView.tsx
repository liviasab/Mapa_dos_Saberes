import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Star,
} from "lucide-react";
import { supabase, Space } from "../../lib/supabase";
import { Edit, Trash2 } from "lucide-react";

export const SpaceDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (id) {
      fetchSpaceDetails(id);
    }
  }, [id]);

  const fetchSpaceDetails = async (spaceId: string) => {
    try {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", spaceId)
        .single();

      if (error) {
        console.error("Error fetching space:", error);
      } else {
        setSpace(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const handleBack = () => {
    navigate("/spaces");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this space?")) {
      const { error } = await supabase.from("spaces").delete().eq("id", id);

      if (error) {
        console.error("Error deleting space:", error);
      } else {
        navigate("/spaces");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Space not found
          </h2>
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Spaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/spaces")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Spaces
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/spaces/${id}/edit`)}
                className="p-2 text-gray-500 hover:text-blue-600"
                title="Edit space"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-600"
                title="Delete space"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {space.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {space.rating ? space.rating.toFixed(1) : "Sem avaliação"}
                  </span>
                </div>
                {space.type && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {space.type}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{space.address}</span>
                </div>
                {space.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={space.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {space.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{space.contact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{space.email}</span>
                </div>
              </div>
            </div>

            {space.media_urls && space.media_urls.length > 0 && (
              <div className="ml-6">
                <img
                  src={space.media_urls[0]}
                  alt={space.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-orange-800 font-medium">ATTENTION!</p>
              <p className="text-orange-700 text-sm">
                You are now in an area whose information is collected by ENFOR.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">
              <span className="font-medium">Date of visit:</span>{" "}
              {new Date(space.visit_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Characteristics Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection("characteristics")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Characteristics of the visited spaces
              </h2>
              {expandedSections.has("characteristics") ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.has("characteristics") && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {space.access_tags?.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{tag}</span>
                    </div>
                  ))}
                  {space.theme_tags?.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interdisciplinarity Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection("interdisciplinarity")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Interdisciplinarity
              </h2>
              {expandedSections.has("interdisciplinarity") ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.has("interdisciplinarity") && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Learning objective of visiting this space:
                  </h3>
                  <p className="text-gray-700">{space.learning_objective}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Disciplines that can be worked on in the space:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {space.disciplines?.map((discipline, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {discipline}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Main theme of the visited space:
                  </h3>
                  <p className="text-gray-700">{space.main_theme}</p>
                </div>
                {space.other_themes && space.other_themes.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Other themes that can be worked on:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {space.other_themes.map((theme, index) => (
                        <li key={index}>{theme}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Inclusion and Accessibility Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection("inclusion")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Inclusion and accessibility
              </h2>
              {expandedSections.has("inclusion") ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.has("inclusion") && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {space.inclusion_tags?.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Technologies Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection("technologies")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Technologies
              </h2>
              {expandedSections.has("technologies") ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.has("technologies") && (
              <div className="px-6 pb-6 space-y-4">
                {space.digital_technologies &&
                  space.digital_technologies.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Digital Technologies:
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {space.digital_technologies.map((tech, index) => (
                          <li key={index}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {space.didactic_strategies &&
                  space.didactic_strategies.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Didactic Strategies:
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {space.didactic_strategies.map((strategy, index) => (
                          <li key={index}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Pedagogical Information Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection("pedagogical")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Pedagogical information
              </h2>
              {expandedSections.has("pedagogical") ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.has("pedagogical") && (
              <div className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Area 01: Main Exhibition
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Contents:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {space.contents?.map((content, index) => (
                          <li key={index}>• {content}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Objectives:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {space.objectives?.map((objective, index) => (
                          <li key={index}>• {objective}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Methodology:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {space.methodologies?.map((methodology, index) => (
                          <li key={index}>• {methodology}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Evaluation:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {space.evaluations?.map((evaluation, index) => (
                          <li key={index}>• {evaluation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      General methodology used:
                    </h4>
                    <p className="text-gray-700">{space.general_methodology}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Relationship with society:
                    </h4>
                    <p className="text-gray-700">
                      {space.society_relationship}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Contribution to teacher training:
                    </h4>
                    <p className="text-gray-700">
                      {space.teacher_contribution}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Recommended references:
                    </h4>
                    <p className="text-gray-700">
                      {space.recommended_references}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Profiles Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Back to profiles
          </button>
        </div>
      </div>
    </div>
  );
};
