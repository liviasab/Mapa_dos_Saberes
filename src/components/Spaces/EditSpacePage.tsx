import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { AboutPlaceForm } from "../Registration/forms/AboutPlaceForm";
import { CharacteristicsForm } from "../Registration/forms/CharacteristicsForm";
import { InterdisciplinarityForm } from "../Registration/forms/InterdisciplinarityForm";
import { InclusionForm } from "../Registration/forms/InclusionForm";
import { TechnologiesForm } from "../Registration/forms/TechnologiesForm";
import { PedagogicalForm } from "../Registration/forms/PedagogicalForm";
import { Space } from "../../lib/supabase";

export const EditSpacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");

  const defaultFormData = useMemo(
    (): Space => ({
      id: "",
      name: "",
      description: "",
      address: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "",
      contact: "",
      email: "",
      visit_date: new Date().toISOString(),
      media_urls: [],
      rating: 0,
      review_count: 0,
      type: "",
      website: "",
      access_tags: [],
      theme_tags: [],
      disciplines: [],
      main_theme: "",
      other_themes: [],
      interdisciplinary_associations: [],
      additional_info: "",
      inclusion_tags: [],
      additional_inclusion: [],
      digital_technologies: [""],
      didactic_strategies: [""],
      technology_relationships: [
        {
          technologyName: "",
          physics: "",
          chemistry: "",
          mathematics: "",
        },
      ],
      technology_developments: [""],
      contents: [],
      objectives: [],
      methodologies: [],
      evaluations: [],
      learning_objective: "",
      general_methodology: "",
      society_relationship: "",
      teacher_contribution: "",
      recommended_references: "",
    }),
    []
  );

  useEffect(() => {
    const fetchSpace = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("spaces")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setSpace({
            ...defaultFormData,
            ...data,
            access_tags: data.access_tags || [],
            theme_tags: data.theme_tags || [],
            digital_technologies: data.digital_technologies || [""],
            didactic_strategies: data.didactic_strategies || [""],
            technology_relationships: data.technology_relationships || [
              {
                technologyName: "",
                physics: "",
                chemistry: "",
                mathematics: "",
              },
            ],
            technology_developments: data.technology_developments || [""],
          });
        }
      } catch (error) {
        console.error("Error fetching space:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [defaultFormData, id]);

  const handleSave = async () => {
    if (!id || !space) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("spaces")
        .update(space)
        .eq("id", id);

      if (error) throw error;

      navigate(`/spaces/${id}`);
    } catch (error) {
      console.error("Error updating space:", error);
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900">Space not found</h2>
          <button
            onClick={() => navigate("/spaces")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Spaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Space: {space.name || "Loading..."}
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate(`/spaces/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto" aria-label="Tabs">
              {[
                { id: "about", name: "About" },
                { id: "characteristics", name: "Characteristics" },
                { id: "interdisciplinarity", name: "Interdisciplinarity" },
                { id: "inclusion", name: "Inclusion" },
                { id: "technologies", name: "Technologies" },
                { id: "pedagogical", name: "Pedagogical" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeSection === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeSection === "about" && (
              <AboutPlaceForm
                data={{
                  name: space.name,
                  visit_date: space.visit_date,
                  address: space.address,
                  contact: space.contact,
                  email: space.email,
                  description: space.description,
                  media_urls: space.media_urls,
                  rating: space.rating,
                }}
                onDataChange={(data) =>
                  setSpace((prev) => ({ ...prev!, ...data }))
                }
              />
            )}
            {activeSection === "characteristics" && (
              <CharacteristicsForm
                data={{
                  access_tags: space.access_tags || [],
                  theme_tags: space.theme_tags || [],
                }}
                onDataChange={(data) =>
                  setSpace((prev) => ({ ...prev!, ...data }))
                }
              />
            )}
            {activeSection === "interdisciplinarity" && (
              <InterdisciplinarityForm
                data={space}
                onDataChange={(data) =>
                  setSpace((prev) => ({ ...prev!, ...data }))
                }
              />
            )}
            {activeSection === "inclusion" && (
              <InclusionForm
                data={space}
                onDataChange={(data) =>
                  setSpace((prev) => ({ ...prev!, ...data }))
                }
              />
            )}
            {activeSection === "technologies" && (
              <TechnologiesForm
                data={{
                  digital_technologies: space.digital_technologies || [""],
                  didactic_strategies: space.didactic_strategies || [""],
                  technology_relationships: space.technology_relationships || [
                    {
                      technologyName: "",
                      physics: "",
                      chemistry: "",
                      mathematics: "",
                    },
                  ],
                  technology_developments: space.technology_developments || [
                    "",
                  ],
                }}
                onDataChange={(data) =>
                  setSpace((prev) => ({ ...prev!, ...data }))
                }
              />
            )}
            {activeSection === "pedagogical" && (
              <PedagogicalForm
                data={space}
                onDataChange={(data) =>
                  setSpace((prev) => ({ ...prev!, ...data }))
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
