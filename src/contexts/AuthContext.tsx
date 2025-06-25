import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserModuleAccess } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  moduleAccess: string[];
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any, user: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>;
  checkModuleAccess: (modulePath: string) => boolean;
  refreshModuleAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleAccess, setModuleAccess] = useState<string[]>([]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setModuleAccess([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        // If no profile exists (PGRST116 error code), create a default one using upsert
        if (profileError.code === 'PGRST116') {
          const { data: newProfile, error: upsertError } = await supabase
            .from('users')
            .upsert([
              {
                id: userId,
                email: userEmail || '',
                role: 'user',
                first_name: '',
                last_name: '',
                company: '',
                phone: '',
              },
            ], {
              onConflict: 'id'
            })
            .select()
            .single();

          if (upsertError) throw upsertError;

          if (newProfile) {
            // Convert snake_case to camelCase
            setUser({
              id: newProfile.id,
              email: newProfile.email,
              role: newProfile.role,
              firstName: newProfile.first_name,
              lastName: newProfile.last_name,
              company: newProfile.company,
              phone: newProfile.phone,
              createdAt: newProfile.created_at,
              updatedAt: newProfile.updated_at
            });
            
            // Create default empty module access using upsert
            await supabase
              .from('user_module_access')
              .upsert([
                {
                  user_id: userId,
                  modules: [],
                },
              ], {
                onConflict: 'user_id'
              });
            
            // Fetch module access
            await refreshModuleAccess();
          }
        } else {
          throw profileError;
        }
      } else if (profile) {
        // Convert snake_case to camelCase
        setUser({
          id: profile.id,
          email: profile.email,
          role: profile.role,
          firstName: profile.first_name,
          lastName: profile.last_name,
          company: profile.company,
          phone: profile.phone,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        });
        
        // Fetch module access
        await refreshModuleAccess();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const refreshModuleAccess = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_module_access')
        .select('modules')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no module access exists, create default empty access using upsert
        if (error.code === 'PGRST116') {
          await supabase
            .from('user_module_access')
            .upsert([
              {
                user_id: user.id,
                modules: [],
              },
            ], {
              onConflict: 'user_id'
            });
          setModuleAccess([]);
        } else {
          throw error;
        }
      } else if (data) {
        setModuleAccess(data.modules || []);
      } else {
        setModuleAccess([]);
      }
    } catch (error) {
      console.error('Error fetching module access:', error);
      setModuleAccess([]);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile using upsert to avoid duplicate key errors
        const { error: profileError } = await supabase
          .from('users')
          .upsert([
            {
              id: data.user.id,
              email: data.user.email,
              role: 'user', // Default role
              first_name: userData.firstName || '',
              last_name: userData.lastName || '',
              company: userData.company || '',
              phone: userData.phone || '',
            },
          ], {
            onConflict: 'id'
          });

        if (profileError) throw profileError;

        // Create default empty module access using upsert
        const { error: accessError } = await supabase
          .from('user_module_access')
          .upsert([
            {
              user_id: data.user.id,
              modules: [],
            },
          ], {
            onConflict: 'user_id'
          });

        if (accessError) throw accessError;
      }

      return { error: null, user: data.user };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { error, user: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setModuleAccess([]);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Convert camelCase to snake_case for database
      const dbData: any = {};
      if (data.firstName !== undefined) dbData.first_name = data.firstName;
      if (data.lastName !== undefined) dbData.last_name = data.lastName;
      if (data.company !== undefined) dbData.company = data.company;
      if (data.phone !== undefined) dbData.phone = data.phone;
      if (data.role !== undefined) dbData.role = data.role;

      const { error } = await supabase
        .from('users')
        .update(dbData)
        .eq('id', user.id);

      if (!error) {
        setUser({ ...user, ...data });
      }

      return { error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const checkModuleAccess = (modulePath: string) => {
    // Admins have access to all modules
    if (user?.role === 'admin') return true;
    
    // Check if the user has access to the specific module
    return moduleAccess.includes(modulePath);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        moduleAccess,
        signIn,
        signUp,
        signOut,
        updateProfile,
        checkModuleAccess,
        refreshModuleAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};