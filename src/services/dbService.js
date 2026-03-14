import { supabase } from '../lib/supabase';

export const dbService = {
  /**
   * Upload a raw CV file to the 'cv-files' bucket
   * @param {File} file 
   * @param {string} userId
   * @returns {Promise<string>} Public URL of the uploaded file
   */
  async uploadCV(file, userId) {
    if (!supabase) throw new Error("Supabase client not initialized.");
    
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('cv-files')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      if (error.message === 'Bucket not found') {
        console.error("Storage Error: The 'cv-files' bucket does not exist. Please create it in your Supabase Dashboard -> Storage.");
      } else {
        console.error("Upload error:", error);
      }
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from('cv-files')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  },

  /**
   * Save a CV analysis result to the database
   * @param {Object} data - The analysis record
   */
  async saveAnalysis(data) {
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { data: result, error } = await supabase
      .from('cv_analysis')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Save analysis error:", error);
      throw error;
    }
    
    return result;
  },

  /**
   * Get user history
   * @param {string} userId
   * @param {boolean} isAnonymous
   */
  async getUserHistory(userId, isAnonymous = false) {
    if (!supabase) throw new Error("Supabase client not initialized.");
    
    if (isAnonymous) {
      console.log("Guest users do not have access to history");
      return [];
    }

    const { data, error } = await supabase
      .from('cv_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Get history error:", error);
      throw error;
    }

    return data;
  },

  /**
   * Delete an analysis
   * @param {string} analysisId 
   */
  async deleteAnalysis(analysisId) {
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { data, error } = await supabase
      .from('cv_analysis')
      .delete()
      .eq('id', analysisId)
      .select();

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    return data;
  }
};
