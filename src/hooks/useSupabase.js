import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabase() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error.message);
      }

      if (session?.user) {
        setUser(session.user);
      } else {
        // Fallback to anon login
        await signInAnonymously();
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      if (error.status === 422) {
        console.error("422 Error: Anonymous Auth might be disabled in Supabase Dashboard.");
      } else {
        console.error("Anon login failed:", error.message);
      }
    }
    return { data, error };
  };

  const signInWithEmail = async (email, password) => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signUpWithEmail = async (email, password) => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const isAnonymous = user?.is_anonymous || false;
  const isAuthenticated = !!user && !isAnonymous;

  return { 
    user, 
    loading, 
    isAnonymous, 
    isAuthenticated, 
    signInAnonymously, 
    signIn: signInWithEmail, 
    signUp: signUpWithEmail, 
    signOut 
  };
}
