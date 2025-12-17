/*
  # Create Health Activities Table

  1. New Tables
    - `health_activities`
      - `id` (uuid, primary key) - Unique identifier for each activity
      - `activity_type` (text) - Type of activity: 'water', 'steps', or 'sleep'
      - `value` (decimal) - The amount/value of the activity
      - `logged_at` (timestamptz) - When the activity was logged
      - `notes` (text, optional) - Optional notes about the activity
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `health_activities` table
    - Add permissive policy for public access (no auth required per requirements)

  3. Indexes
    - Index on `logged_at` for efficient date-based queries
    - Index on `activity_type` for filtering by type

  Note: This implementation allows public access as no authentication
  was specified in the requirements. For production use with real health data,
  proper authentication should be implemented.
*/

CREATE TABLE IF NOT EXISTS health_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL CHECK (activity_type IN ('water', 'steps', 'sleep')),
  value decimal NOT NULL CHECK (value >= 0),
  logged_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_activities_logged_at ON health_activities(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_activities_type ON health_activities(activity_type);

ALTER TABLE health_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON health_activities
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON health_activities
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON health_activities
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON health_activities
  FOR DELETE
  TO anon
  USING (true);
