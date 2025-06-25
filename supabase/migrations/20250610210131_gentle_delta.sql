/*
  # Add warehouse pest trap columns to visit_equipment_data

  1. New Columns
    - `dried_fruit_moth_count` (integer) - For tracking Kuru Meyve Güvesi counts
    - `flour_moth_count` (integer) - For tracking Değirmen Güvesi counts
    - `clothes_moth_count` (integer) - For tracking Elbise Güvesi counts
    - `tobacco_moth_count` (integer) - For tracking Tütün Güvesi counts
    - `other_stored_pest_count` (integer) - For tracking other warehouse pest counts

  2. Purpose
    - Enable detailed tracking of specific moth types and stored product pests
    - Support trend analysis for warehouse pest monitoring
    - Enhance reporting capabilities for warehouse pest management
*/

-- Add warehouse pest trap columns to visit_equipment_data table
ALTER TABLE visit_equipment_data 
ADD COLUMN IF NOT EXISTS dried_fruit_moth_count integer,
ADD COLUMN IF NOT EXISTS flour_moth_count integer,
ADD COLUMN IF NOT EXISTS clothes_moth_count integer,
ADD COLUMN IF NOT EXISTS tobacco_moth_count integer,
ADD COLUMN IF NOT EXISTS other_stored_pest_count integer;

-- Add comments to explain the column purposes
COMMENT ON COLUMN visit_equipment_data.dried_fruit_moth_count IS 'Number of dried fruit moths (Kuru Meyve Güvesi) detected in warehouse pest traps';
COMMENT ON COLUMN visit_equipment_data.flour_moth_count IS 'Number of flour moths (Değirmen Güvesi) detected in warehouse pest traps';
COMMENT ON COLUMN visit_equipment_data.clothes_moth_count IS 'Number of clothes moths (Elbise Güvesi) detected in warehouse pest traps';
COMMENT ON COLUMN visit_equipment_data.tobacco_moth_count IS 'Number of tobacco moths (Tütün Güvesi) detected in warehouse pest traps';
COMMENT ON COLUMN visit_equipment_data.other_stored_pest_count IS 'Number of other stored product pests detected in warehouse pest traps';