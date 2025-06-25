/*
  # Add UV-A Measurement Column to visit_equipment_data Table

  1. Changes
    - Add uva_measurement column to visit_equipment_data table
  
  2. Purpose
    - Store UV-A fluorescent lamp measurements as percentage values
    - Support monitoring of UV-A lamp effectiveness for flying insect traps
*/

-- Add uva_measurement column to visit_equipment_data table
ALTER TABLE visit_equipment_data 
ADD COLUMN IF NOT EXISTS uva_measurement numeric(5,2);

-- Add comment to explain the column purpose
COMMENT ON COLUMN visit_equipment_data.uva_measurement IS 'UV-A fluorescent lamp measurement as a percentage value (e.g., 86.00 for 86%)';