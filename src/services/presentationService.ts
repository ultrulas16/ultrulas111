import { supabase } from '../lib/supabase';
import { defaultTemplates } from '../lib/presentationTemplates';

// Define template interface
export interface Template {
  id: string;
  name: string;
  standard: string;
  description: string;
  slides: any[];
  thumbnail_url: string | null;
  is_active: boolean;
}

/**
 * Fetches presentation templates from Supabase
 * Falls back to default templates if Supabase fetch fails
 */
export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const { data, error } = await supabase
      .from('presentation_templates')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    } else {
      console.log('No templates found in Supabase, using default templates');
      return defaultTemplates;
    }
  } catch (error) {
    console.error('Error fetching templates from Supabase:', error);
    console.log('Using default templates due to error');
    return defaultTemplates;
  }
};

/**
 * Creates a new presentation template in Supabase
 */
export const createTemplate = async (template: Omit<Template, 'id' | 'is_active'>): Promise<Template | null> => {
  try {
    const { data, error } = await supabase
      .from('presentation_templates')
      .insert([{
        ...template,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    return null;
  }
};

/**
 * Updates an existing presentation template in Supabase
 */
export const updateTemplate = async (id: string, updates: Partial<Template>): Promise<Template | null> => {
  try {
    const { data, error } = await supabase
      .from('presentation_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating template:', error);
    return null;
  }
};

/**
 * Deletes a presentation template from Supabase
 */
export const deleteTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('presentation_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
};

/**
 * Uploads a thumbnail image for a template
 */
export const uploadThumbnail = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `presentation_templates/${fileName}`;

    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return null;
  }
};