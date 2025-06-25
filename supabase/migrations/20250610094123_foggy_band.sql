/*
  # Update order_items table for tax rates

  1. Changes
    - Add tax_rate column to order_items table
    - Add tax_amount column to order_items table
  
  2. Purpose
    - Support different tax rates (1%, 10%, 20%)
    - Track tax amounts per order item
*/

-- Add tax_rate column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'tax_rate'
  ) THEN
    ALTER TABLE order_items ADD COLUMN tax_rate numeric(5,2) DEFAULT 10;
  END IF;
END $$;

-- Add tax_amount column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'tax_amount'
  ) THEN
    ALTER TABLE order_items ADD COLUMN tax_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add tax_rate column to products table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'tax_rate'
  ) THEN
    ALTER TABLE products ADD COLUMN tax_rate numeric(5,2) DEFAULT 10;
  END IF;
END $$;

-- Update existing products with default tax rates
UPDATE products SET tax_rate = 10 WHERE tax_rate IS NULL;