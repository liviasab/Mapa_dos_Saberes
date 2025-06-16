/*
  # Create spaces table for educational space registration

  1. New Tables
    - `spaces`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the educational space
      - `description` (text, required) - Description of the space
      - `address` (text, required) - Physical address
      - `contact` (text, required) - Contact phone number
      - `email` (text, required) - Contact email
      - `visit_date` (date, required) - Date of visit
      - `media_urls` (text array) - URLs for images/media
      - `rating` (numeric) - Average rating
      - `review_count` (integer) - Number of reviews
      - `type` (text) - Type of space (Museum, University, etc.)
      - `website` (text) - Website URL
      - `access_tags` (text array) - Access characteristics
      - `theme_tags` (text array) - Theme characteristics
      - `disciplines` (text array) - Academic disciplines
      - `main_theme` (text) - Primary theme
      - `other_themes` (text array) - Additional themes
      - `interdisciplinary_associations` (jsonb) - Complex associations data
      - `additional_info` (text) - Additional information
      - `inclusion_tags` (text array) - Inclusion/accessibility features
      - `additional_inclusion` (text array) - Additional inclusion features
      - `digital_technologies` (text array) - Digital tech available
      - `didactic_strategies` (text array) - Teaching strategies
      - `technology_relationships` (jsonb) - Technology relationships data
      - `technology_developments` (text array) - Technology developments
      - `contents` (text array) - Educational contents
      - `objectives` (text array) - Learning objectives
      - `methodologies` (text array) - Teaching methodologies
      - `evaluations` (text array) - Evaluation methods
      - `learning_objective` (text) - Main learning objective
      - `general_methodology` (text) - General methodology description
      - `society_relationship` (text) - Relationship with society
      - `teacher_contribution` (text) - Contribution to teacher training
      - `recommended_references` (text) - Recommended references
      - `user_id` (uuid, foreign key) - User who created the space
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `spaces` table
    - Add policy for authenticated users to read all spaces
    - Add policy for authenticated users to insert their own spaces
    - Add policy for users to update their own spaces
    - Add policy for users to delete their own spaces
*/

CREATE TABLE IF NOT EXISTS spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  contact text NOT NULL,
  email text NOT NULL,
  visit_date date NOT NULL,
  media_urls text[] DEFAULT '{}',
  rating numeric,
  review_count integer DEFAULT 0,
  type text,
  website text,
  access_tags text[] DEFAULT '{}',
  theme_tags text[] DEFAULT '{}',
  disciplines text[] DEFAULT '{}',
  main_theme text,
  other_themes text[] DEFAULT '{}',
  interdisciplinary_associations jsonb DEFAULT '[]',
  additional_info text,
  inclusion_tags text[] DEFAULT '{}',
  additional_inclusion text[] DEFAULT '{}',
  digital_technologies text[] DEFAULT '{}',
  didactic_strategies text[] DEFAULT '{}',
  technology_relationships jsonb DEFAULT '[]',
  technology_developments text[] DEFAULT '{}',
  contents text[] DEFAULT '{}',
  objectives text[] DEFAULT '{}',
  methodologies text[] DEFAULT '{}',
  evaluations text[] DEFAULT '{}',
  learning_objective text,
  general_methodology text,
  society_relationship text,
  teacher_contribution text,
  recommended_references text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read spaces
CREATE POLICY "Anyone can read spaces"
  ON spaces
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert their own spaces
CREATE POLICY "Users can insert their own spaces"
  ON spaces
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to update their own spaces
CREATE POLICY "Users can update their own spaces"
  ON spaces
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own spaces
CREATE POLICY "Users can delete their own spaces"
  ON spaces
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS spaces_user_id_idx ON spaces(user_id);

-- Create an index on created_at for better performance when ordering
CREATE INDEX IF NOT EXISTS spaces_created_at_idx ON spaces(created_at);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();