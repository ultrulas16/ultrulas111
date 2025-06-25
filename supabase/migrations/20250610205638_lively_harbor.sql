/*
  # Add flying insect count columns to visit_equipment_data

  1. Changes
    - Add housefly_count column for karasinek counts
    - Add mosquito_count column for sivrisinek counts
    - Add moth_count column for güve counts
    - Add bee_count column for arı counts
    - Add fruit_fly_count column for meyve sineği counts
  
  2. Purpose
    - Support tracking specific flying insect counts for EFK/EFC/LFT devices
    - Enable more detailed trend analysis for flying insect monitoring
*/

-- Add specific flying insect count columns to visit_equipment_data table
ALTER TABLE visit_equipment_data 
ADD COLUMN IF NOT EXISTS housefly_count integer,
ADD COLUMN IF NOT EXISTS mosquito_count integer,
ADD COLUMN IF NOT EXISTS moth_count integer,
ADD COLUMN IF NOT EXISTS bee_count integer,
ADD COLUMN IF NOT EXISTS fruit_fly_count integer;

-- Add comments to explain the column purposes
COMMENT ON COLUMN visit_equipment_data.housefly_count IS 'Number of houseflies (karasinek) detected in flying insect monitoring devices';
COMMENT ON COLUMN visit_equipment_data.mosquito_count IS 'Number of mosquitoes (sivrisinek) detected in flying insect monitoring devices';
COMMENT ON COLUMN visit_equipment_data.moth_count IS 'Number of moths (güve) detected in flying insect monitoring devices';
COMMENT ON COLUMN visit_equipment_data.bee_count IS 'Number of bees (arı) detected in flying insect monitoring devices';
COMMENT ON COLUMN visit_equipment_data.fruit_fly_count IS 'Number of fruit flies (meyve sineği) detected in flying insect monitoring devices';