import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useDashboardData = () => {
  // Fetch unresolved incidents
  const {
    data: unresolvedIncidents = [],
    isLoading: incidentsLoading,
    refetch: refetchIncidents
  } = useQuery({
    queryKey: ['unresolvedIncidents'],
    queryFn: async () => {
      // Use raw API call to avoid type instantiation issues
      const response = await fetch(`https://qzviudmiwhwbiezpcwkj.supabase.co/rest/v1/incidents?status=eq.unresolved&select=*,camera:cameras(*)&order=ts_start.desc`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      
      return await response.json();
    },
  });

  // Fetch resolved incidents count
  const {
    data: resolvedCount = 0,
    isLoading: resolvedCountLoading
  } = useQuery({
    queryKey: ['resolvedCount'],
    queryFn: async () => {
      // Use raw API call for count
      const response = await fetch(`https://qzviudmiwhwbiezpcwkj.supabase.co/rest/v1/incidents?status=eq.resolved&select=count`, {
        method: 'HEAD',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U`,
          'Prefer': 'count=exact'
        }
      });
      
      const count = response.headers.get('Content-Range')?.split('/')[1] || '0';
      return parseInt(count) || 0;
    },
  });

  // Fetch cameras
  const {
    data: cameras = [],
    isLoading: camerasLoading
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: async () => {
      // Use raw API call to avoid type issues
      const response = await fetch(`https://qzviudmiwhwbiezpcwkj.supabase.co/rest/v1/cameras?select=*&order=name`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cameras');
      }
      
      return await response.json();
    },
  });

  // Fetch current user - we'll get the first user for demo
  const {
    data: currentUser,
    isLoading: userLoading
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        // Simple query to get first user
        const response = await fetch(`https://qzviudmiwhwbiezpcwkj.supabase.co/rest/v1/users?select=*&limit=1`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U`,
          }
        });
        const users = await response.json();
        return users[0] || null;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
  });

  // Set up real-time subscription for incidents
  useEffect(() => {
    const channel = supabase
      .channel('incidents_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents'
        },
        (payload) => {
          console.log('Real-time incident update:', payload);
          refetchIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchIncidents]);

  return {
    unresolvedIncidents,
    resolvedCount,
    cameras,
    currentUser,
    isLoading: incidentsLoading || resolvedCountLoading || camerasLoading || userLoading,
    refetchIncidents
  };
};