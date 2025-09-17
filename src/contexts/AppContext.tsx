import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { 
  Profile, 
  AccessLog, 
  ProfileWithLogs, 
  AccessLogWithProfile,
  CreateProfileForm,
  UpdateProfileForm,
  ProfileSearchResult,
  DashboardStats,
  ApiResponse
} from '@/types';

interface AppContextType {
  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Profile Management
  profiles: Profile[];
  accessLogs: AccessLog[];
  addProfile: (profileData: CreateProfileForm) => Promise<ApiResponse<Profile>>;
  updateProfile: (profileData: UpdateProfileForm) => Promise<ApiResponse<Profile>>;
  deleteProfile: (profileId: string) => Promise<ApiResponse<void>>;
  searchProfiles: (query: string) => ProfileSearchResult[];
  
  // Access Log Management
  logEntry: (profileId: string, purpose?: string, associatedProfileId?: string) => Promise<ApiResponse<AccessLog>>;
  logExit: (logId: string) => Promise<ApiResponse<AccessLog>>;
  addAccessLog: (log: AccessLog) => void;
  clearAllAccessLogs: () => void;
  getAccessLogsWithProfiles: () => AccessLogWithProfile[];
  getProfilesWithLogs: () => ProfileWithLogs[];
  
  // Dashboard Data
  getDashboardStats: () => DashboardStats;
  
  // Blacklist Management
  toggleBlacklist: (profileId: string) => Promise<ApiResponse<Profile>>;
  getBlacklistedProfiles: () => Profile[];
  
  // Loading States
  isLoading: boolean;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  profiles: [],
  accessLogs: [],
  addProfile: async () => ({ success: false, error: 'Not implemented' }),
  updateProfile: async () => ({ success: false, error: 'Not implemented' }),
  deleteProfile: async () => ({ success: false, error: 'Not implemented' }),
  searchProfiles: () => [],
  logEntry: async () => ({ success: false, error: 'Not implemented' }),
  logExit: async () => ({ success: false, error: 'Not implemented' }),
  addAccessLog: () => {},
  getAccessLogsWithProfiles: () => [],
  getProfilesWithLogs: () => [],
  getDashboardStats: () => ({
    totalProfiles: 0,
    totalAccessLogs: 0,
    currentlyInside: 0,
    todayEntries: 0,
    thisWeekEntries: 0,
    thisMonthEntries: 0,
    blacklistedProfiles: 0,
  }),
  toggleBlacklist: async () => ({ success: false, error: 'Not implemented' }),
  getBlacklistedProfiles: () => [],
  isLoading: false,
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('kofasentinel-profiles');
    const savedLogs = localStorage.getItem('kofasentinel-access-logs');
    
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    } else {
      // Initialize with sample data if no saved data exists
      const sampleProfiles: Profile[] = [
        {
          profileId: uuidv4(),
          profileType: 'Individual',
          name: 'John Doe',
          identifier: '08123456789',
          photoUrl: '',
          notes: 'Regular visitor',
          isBlacklisted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          profileId: uuidv4(),
          profileType: 'Vehicle',
          name: 'Toyota Camry',
          identifier: 'ABC-123',
          photoUrl: '',
          notes: 'Staff vehicle',
          isBlacklisted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          profileId: uuidv4(),
          profileType: 'Vehicle',
          name: 'Honda Accord',
          identifier: 'XYZ-789',
          photoUrl: '',
          notes: 'Visitor vehicle',
          isBlacklisted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      setProfiles(sampleProfiles);
    }
    
    if (savedLogs) {
      try {
        setAccessLogs(JSON.parse(savedLogs));
      } catch (error) {
        console.error('Error loading access logs:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kofasentinel-profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('kofasentinel-access-logs', JSON.stringify(accessLogs));
  }, [accessLogs]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Profile Management Functions
  const addProfile = async (profileData: CreateProfileForm): Promise<ApiResponse<Profile>> => {
    console.log('addProfile called with:', profileData);
    setIsLoading(true);
    try {
      // Check if profile with same identifier already exists
      const existingProfile = profiles.find(p => 
        p.identifier.toLowerCase() === profileData.identifier.toLowerCase()
      );
      
      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        return {
          success: false,
          error: `A profile with identifier "${profileData.identifier}" already exists`
        };
      }

      const newProfile: Profile = {
        profileId: uuidv4(),
        profileType: profileData.profileType,
        name: profileData.name,
        identifier: profileData.identifier,
        email: profileData.email,
        company: profileData.company,
        driverName: profileData.driverName,
        driverPhone: profileData.driverPhone,
        notes: profileData.notes,
        photoUrl: profileData.photo ? URL.createObjectURL(profileData.photo) : undefined,
        isBlacklisted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedProfileId: profileData.linkedProfileId,
      };

      console.log('Creating new profile:', newProfile);
      setProfiles(prev => {
        const updated = [...prev, newProfile];
        console.log('Updated profiles array:', updated);
        return updated;
      });

      console.log('Profile created successfully');
      return { success: true, data: newProfile };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { success: false, error: 'Failed to create profile' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: UpdateProfileForm): Promise<ApiResponse<Profile>> => {
    setIsLoading(true);
    try {
      const updatedProfile: Profile = {
        ...profiles.find(p => p.profileId === profileData.profileId)!,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      setProfiles(prev => prev.map(p => 
        p.profileId === profileData.profileId ? updatedProfile : p
      ));

      toast({
        title: "Profile Updated",
        description: `Profile "${updatedProfile.name}" has been updated successfully.`,
      });

      return { success: true, data: updatedProfile };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfile = async (profileId: string): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    try {
      const profile = profiles.find(p => p.profileId === profileId);
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      setProfiles(prev => prev.filter(p => p.profileId !== profileId));
      
      // Also remove related access logs
      setAccessLogs(prev => prev.filter(log => log.profileId !== profileId));

      toast({
        title: "Profile Deleted",
        description: `Profile "${profile.name}" has been deleted successfully.`,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete profile' };
    } finally {
      setIsLoading(false);
    }
  };

  const searchProfiles = (query: string): ProfileSearchResult[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    
    return profiles
      .map(profile => {
        const nameMatch = profile.name.toLowerCase().includes(lowercaseQuery);
        const identifierMatch = profile.identifier.toLowerCase().includes(lowercaseQuery);
        
        if (!nameMatch && !identifierMatch) return null;
        
        let matchType: 'name' | 'identifier' | 'both' = 'name';
        let matchScore = 0;
        
        if (nameMatch && identifierMatch) {
          matchType = 'both';
          matchScore = 100;
        } else if (identifierMatch) {
          matchType = 'identifier';
          matchScore = 90;
        } else {
          matchType = 'name';
          matchScore = 80;
        }
        
        return { profile, matchType, matchScore };
      })
      .filter((result): result is ProfileSearchResult => result !== null)
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  // Access Log Management Functions
  const logEntry = async (
    profileId: string, 
    purpose?: string, 
    associatedProfileId?: string
  ): Promise<ApiResponse<AccessLog>> => {
    console.log('logEntry called with:', { profileId, purpose, associatedProfileId });
    setIsLoading(true);
    try {
      const profile = profiles.find(p => p.profileId === profileId);
      console.log('Found profile for logging:', profile);
      if (!profile) {
        console.log('Profile not found for logging');
        return { success: false, error: 'Profile not found' };
      }

      // Check if profile is blacklisted
      if (profile.isBlacklisted) {
        toast({
          title: "Access Denied",
          description: `Profile "${profile.name}" is blacklisted and cannot enter.`,
          variant: "destructive",
        });
        return { success: false, error: 'Profile is blacklisted' };
      }

      // Check if profile is already inside
      const activeLog = accessLogs.find(log => 
        log.profileId === profileId && log.status === 'Inside'
      );
      
      if (activeLog) {
        return { success: false, error: 'Profile is already inside' };
      }

      const newLog: AccessLog = {
        logId: uuidv4(),
        profileId,
        entryTime: new Date().toISOString(),
        status: 'Inside',
        associatedProfileId,
        purpose,
      };

      console.log('Creating new access log:', newLog);
      setAccessLogs(prev => {
        const updated = [...prev, newLog];
        console.log('Updated access logs array:', updated);
        return updated;
      });
      
      console.log('Access log created successfully');
      toast({
        title: "Entry Logged",
        description: `${profile.profileType} "${profile.name}" has entered successfully.`,
      });

      return { success: true, data: newLog };
    } catch (error) {
      return { success: false, error: 'Failed to log entry' };
    } finally {
      setIsLoading(false);
    }
  };

  const addAccessLog = (log: AccessLog): void => {
    console.log('Adding access log directly:', log);
    setAccessLogs(prev => {
      const updated = [...prev, log];
      console.log('Updated access logs array (direct):', updated);
      return updated;
    });
  };

  const clearAllAccessLogs = (): void => {
    console.log('Clearing all access logs');
    setAccessLogs([]);
    toast({
      title: "Access Logs Cleared",
      description: "All recent entries have been cleared. System is ready for new entries.",
    });
  };

  const logExit = async (logId: string): Promise<ApiResponse<AccessLog>> => {
    setIsLoading(true);
    try {
      const log = accessLogs.find(l => l.logId === logId);
      if (!log) {
        return { success: false, error: 'Access log not found' };
      }

      if (log.status === 'Exited') {
        return { success: false, error: 'Exit already logged' };
      }

      const updatedLog: AccessLog = {
        ...log,
        exitTime: new Date().toISOString(),
        status: 'Exited',
      };

      setAccessLogs(prev => prev.map(l => 
        l.logId === logId ? updatedLog : l
      ));

      const profile = profiles.find(p => p.profileId === log.profileId);
      
      toast({
        title: "Exit Logged",
        description: `${profile?.profileType} "${profile?.name}" has exited successfully.`,
      });

      return { success: true, data: updatedLog };
    } catch (error) {
      return { success: false, error: 'Failed to log exit' };
    } finally {
      setIsLoading(false);
    }
  };

  const getAccessLogsWithProfiles = (): AccessLogWithProfile[] => {
    return accessLogs.map(log => ({
      ...log,
      profile: profiles.find(p => p.profileId === log.profileId)!,
      associatedProfile: log.associatedProfileId 
        ? profiles.find(p => p.profileId === log.associatedProfileId)
        : undefined,
    })).filter(log => log.profile); // Filter out logs with missing profiles
  };

  const getProfilesWithLogs = (): ProfileWithLogs[] => {
    return profiles.map(profile => {
      const profileLogs = accessLogs.filter(log => log.profileId === profile.profileId);
      const isCurrentlyInside = profileLogs.some(log => log.status === 'Inside');
      
      return {
        ...profile,
        recentLogs: profileLogs
          .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
          .slice(0, 5), // Get last 5 logs
        isCurrentlyInside,
      };
    });
  };

  // Dashboard Functions
  const getDashboardStats = (): DashboardStats => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const todayEntries = accessLogs.filter(log => 
      new Date(log.entryTime) >= today
    ).length;

    const thisWeekEntries = accessLogs.filter(log => 
      new Date(log.entryTime) >= weekAgo
    ).length;

    const thisMonthEntries = accessLogs.filter(log => 
      new Date(log.entryTime) >= monthAgo
    ).length;

    const currentlyInside = accessLogs.filter(log => log.status === 'Inside').length;
    const blacklistedProfiles = profiles.filter(p => p.isBlacklisted).length;

    return {
      totalProfiles: profiles.length,
      totalAccessLogs: accessLogs.length,
      currentlyInside,
      todayEntries,
      thisWeekEntries,
      thisMonthEntries,
      blacklistedProfiles,
    };
  };

  // Blacklist Management
  const toggleBlacklist = async (profileId: string): Promise<ApiResponse<Profile>> => {
    setIsLoading(true);
    try {
      const profile = profiles.find(p => p.profileId === profileId);
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      const updatedProfile: Profile = {
        ...profile,
        isBlacklisted: !profile.isBlacklisted,
        updatedAt: new Date().toISOString(),
      };

      setProfiles(prev => prev.map(p => 
        p.profileId === profileId ? updatedProfile : p
      ));

      toast({
        title: updatedProfile.isBlacklisted ? "Profile Blacklisted" : "Profile Unblacklisted",
        description: `Profile "${updatedProfile.name}" has been ${updatedProfile.isBlacklisted ? 'blacklisted' : 'unblacklisted'}.`,
      });

      return { success: true, data: updatedProfile };
    } catch (error) {
      return { success: false, error: 'Failed to update blacklist status' };
    } finally {
      setIsLoading(false);
    }
  };

  const getBlacklistedProfiles = (): Profile[] => {
    return profiles.filter(p => p.isBlacklisted);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        profiles,
        accessLogs,
        addProfile,
        updateProfile,
        deleteProfile,
        searchProfiles,
        logEntry,
        logExit,
        addAccessLog,
        clearAllAccessLogs,
        getAccessLogsWithProfiles,
        getProfilesWithLogs,
        getDashboardStats,
        toggleBlacklist,
        getBlacklistedProfiles,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
