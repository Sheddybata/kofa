// KofaSentinel ATLAS - Profile-based Access Control System Types

export type ProfileType = 'Individual' | 'Vehicle';

export interface Profile {
  profileId: string;
  profileType: ProfileType;
  name: string;
  identifier: string; // Phone number for individuals, plate number for vehicles
  email?: string; // For individuals
  company?: string; // For individuals
  driverName?: string; // For vehicles
  driverPhone?: string; // For vehicles
  photoUrl?: string;
  notes?: string;
  isBlacklisted?: boolean;
  createdAt: string;
  updatedAt: string;
  linkedProfileId?: string; // For vehicles linked to individuals
}

export type AccessStatus = 'Inside' | 'Exited';

export interface AccessLog {
  logId: string;
  profileId: string;
  entryTime: string;
  exitTime?: string;
  status: AccessStatus;
  associatedProfileId?: string; // Links a vehicle to a person for this specific entry
  purpose?: string;
  guardNotes?: string;
}

// Extended interfaces for UI components
export interface ProfileWithLogs extends Profile {
  recentLogs: AccessLog[];
  isCurrentlyInside: boolean;
}

export interface AccessLogWithProfile extends AccessLog {
  profile: Profile;
  associatedProfile?: Profile;
}

// Search and filter types
export interface ProfileSearchResult {
  profile: Profile;
  matchType: 'name' | 'identifier' | 'both';
  matchScore: number;
}

export interface AccessLogFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  profileType?: ProfileType;
  status?: AccessStatus;
  searchQuery?: string;
}

// Dashboard analytics types
export interface DashboardStats {
  totalProfiles: number;
  totalAccessLogs: number;
  currentlyInside: number;
  todayEntries: number;
  thisWeekEntries: number;
  thisMonthEntries: number;
  blacklistedProfiles: number;
}

export interface ProfileTypeStats {
  individual: number;
  vehicle: number;
}

// Form types for profile creation/editing
export interface CreateProfileForm {
  profileType: ProfileType;
  name: string;
  identifier: string;
  email?: string; // For individuals
  company?: string; // For individuals
  driverName?: string; // For vehicles
  driverPhone?: string; // For vehicles
  notes?: string;
  photo?: File;
  linkedProfileId?: string;
}

export interface UpdateProfileForm extends Partial<CreateProfileForm> {
  profileId: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

