export interface AboutPlaceData {
  name: string;
  visit_date: string;
  address: string;
  contact: string;
  email: string;
  description: string;
  media_urls: string[];
  rating: number;
}

export interface CharacteristicsData {
  access_tags?: string[];
  theme_tags?: string[];
}

export interface InterdisciplinarityData {
  disciplines: string[];
  main_theme: string;
  other_themes: string[];
  interdisciplinary_associations: Array<{
    response: string;
    disciplines: string[];
  }>;
  additional_info: string;
}

export interface InclusionData {
  inclusion_tags: string[];
  additional_inclusion: string[];
}

export interface TechnologiesData {
  digital_technologies: string[];
  didactic_strategies: string[];
  technology_relationships: Array<{
    technologyName: string;
    physics: string;
    chemistry: string;
    mathematics: string;
  }>;
  technology_developments: string[];
}

export interface PedagogicalData {
  contents: string[];
  objectives: string[];
  methodologies: string[];
  evaluations: string[];
  learning_objective: string;
  general_methodology: string;
  society_relationship: string;
  teacher_contribution: string;
  recommended_references: string;
}

export type SpaceFormData = AboutPlaceData &
  CharacteristicsData &
  InterdisciplinarityData &
  InclusionData &
  TechnologiesData &
  PedagogicalData;

