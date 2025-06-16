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

export interface CharacteristicsData {
  access_tags?: string[];
  theme_tags?: string[];
}

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
