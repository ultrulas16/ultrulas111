/*
  # Add modules_email setting

  1. Changes
    - Add modules_email setting to system_settings table
  
  2. Purpose
    - Store email for modules access authentication
    - Pair with existing modules_password for complete authentication
*/

-- Insert modules_email setting if it doesn't exist
INSERT INTO system_settings (key, value, description)
VALUES ('modules_email', 'admin@pestmentor.com.tr', 'Email for accessing modules page')
ON CONFLICT (key) DO NOTHING;