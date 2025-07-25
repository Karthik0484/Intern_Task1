// Extended types for our database schema with new columns
export interface ExtendedCamera {
  id: string;
  name: string;
  location: string;
  stream_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ExtendedIncident {
  id: string;
  camera_id?: string | null;
  type: string;
  location?: string | null;
  status?: string | null;
  thumbnail_url: string;
  ts_start: string;
  ts_end: string;
  resolved: boolean;
  created_at: string;
}

export interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  profile_url?: string | null;
  created_at: string;
}

export interface IncidentWithCamera extends ExtendedIncident {
  camera?: ExtendedCamera | null;
}