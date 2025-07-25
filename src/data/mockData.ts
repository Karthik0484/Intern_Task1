import { Database } from '@/integrations/supabase/types';

export type Camera = Database['public']['Tables']['cameras']['Row'];
export type Incident = Database['public']['Tables']['incidents']['Row'] & {
  camera?: Camera;
};

// Legacy interfaces for backward compatibility during migration
export interface LegacyCamera {
  id: number;
  name: string;
  location: string;
}

export interface LegacyIncident {
  id: number;
  cameraId: number;
  type: string;
  tsStart: Date;
  tsEnd: Date;
  thumbnailUrl: string;
  resolved: boolean;
  camera?: LegacyCamera;
}

// Remove legacy mock data - now using Supabase

export const getIncidentTypeVariant = (type: string) => {
  switch (type) {
    case "Security Breach":
    case "Unauthorized Access":
      return "critical";
    case "Suspicious Activity":
    case "Loitering":
      return "warning";
    case "Motion Detected":
    case "Face Recognition":
    case "Vehicle Alert":
    case "Parking Violation":
      return "info";
    default:
      return "default";
  }
};