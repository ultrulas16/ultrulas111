/*
  # Fix order number generation function
  
  1. Changes
    - Fixes the set_order_number() function to properly cast bigint to text
    - Ensures proper handling of dependencies when updating the function
  
  2. Details
    - Drops the trigger first to avoid dependency issues
    - Recreates the function with proper type casting
    - Recreates the trigger
    - Creates the sequence if it doesn't exist
*/

-- Drop the trigger first to avoid dependency issues
DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;

-- Drop the existing function
DROP FUNCTION IF EXISTS set_order_number();

-- Create the corrected function
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate order number with proper type casting
  NEW.order_number := 'ORD-' || lpad(nextval('order_number_seq')::text, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the sequence if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Recreate the trigger
CREATE TRIGGER set_order_number_trigger
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();