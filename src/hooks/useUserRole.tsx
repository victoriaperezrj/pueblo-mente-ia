import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { safeJSONParse } from '@/lib/safe-json';

type AppRole = 'entrepreneur' | 'business' | 'pyme_enterprise' | 'admin';

interface UserRoleData {
  role: AppRole | null;
  loading: boolean;
  error: string | null;
}

export function useUserRole(): UserRoleData {
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          fetchUserRole();
        } else if (event === 'SIGNED_OUT') {
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        setError(roleError.message);
        setRole(null);
      } else if (data) {
        setRole(data.role as AppRole);
      } else {
        setRole(null);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching role:', err);
      setError(err.message);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  return { role, loading, error };
}

export async function assignUserRole(userId: string, role: AppRole): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role })
      .select()
      .single();

    if (error) {
      console.error('Error assigning role:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error assigning role:', err);
    return { success: false, error: err.message };
  }
}
