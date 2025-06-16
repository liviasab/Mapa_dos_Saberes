import {
  createClient,
  PostgrestResponse,
  PostgrestError,
} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Space {
  id: string;
  name: string;
  description: string;
  address: string;
  contact: string;
  email: string;
  visit_date: string;
  media_urls: string[];
  rating: number;
  review_count?: number;
  type?: string;
  website?: string;

  // Characteristics
  access_tags: string[];
  theme_tags: string[];

  // Interdisciplinarity
  disciplines: string[];
  main_theme: string;
  other_themes: string[];
  interdisciplinary_associations: Array<{
    response: string;
    disciplines: string[];
  }>;
  additional_info?: string;

  // Inclusion and Accessibility
  inclusion_tags: string[];
  additional_inclusion: string[];

  // Technologies
  digital_technologies: string[];
  didactic_strategies: string[];
  technology_relationships: Array<{
    technologyName: string;
    physics: string;
    chemistry: string;
    mathematics: string;
  }>;
  technology_developments: string[];

  // Pedagogical Information
  contents: string[];
  objectives: string[];
  methodologies: string[];
  evaluations: string[];
  learning_objective: string;
  general_methodology: string;
  society_relationship: string;
  teacher_contribution: string;
  recommended_references: string;

  created_at: string;
  updated_at: string;
  user_id: string;
}

export const getSpaces = async (): Promise<PostgrestResponse<Space>> => {
  return supabase.from("spaces").select("*");
};

export const updateSpace = async (
  id: string,
  updates: Partial<Space>
): Promise<{ data: Space | null; error: PostgrestError | null }> => {
  return supabase.from("spaces").update(updates).eq("id", id).select().single();
};

export const deleteSpace = async (id: string) => {
  return supabase.from("spaces").delete().eq("id", id);
};

export const getPublicUrl = (filePath: string): string => {
  const { data } = supabase.storage.from("spaces-media").getPublicUrl(filePath);
  return data.publicUrl;
};

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}
