import React, { useState } from 'react';
import { Profile, AccessLogWithProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Car, Phone, Hash, AlertTriangle, Shield, Clock, Search } from 'lucide-react';

interface BlacklistManagerProps {
  profiles: Profile[];
  accessLogs: AccessLogWithProfile[];
}

interface BlacklistItem {
  id: string;
  profileId: string;
  profileName: string;
  identifier: string;
  profileType: 'Individual' | 'Vehicle';
  reason: string;
  addedDate: string;
  addedBy: string;
  status: 'active' | 'suspended';
  driverName?: string;
  driverPhone?: string;
}

const BlacklistManager: React.FC<BlacklistManagerProps> = ({ profiles, accessLogs }) => {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBlacklistItem, setNewBlacklistItem] = useState({
    profileId: '',
    reason: '',
    status: 'active' as 'active' | 'suspended'
  });

  // Get blacklisted profiles from the profiles array
  const blacklistedProfiles = profiles.filter(profile => profile.isBlacklisted);
  
  // Get recent access logs for blacklisted profiles
  const blacklistedEntries = accessLogs.filter(log => 
    blacklistedProfiles.some(profile => profile.profileId === log.profileId)
  );

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.identifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProfileIcon = (profile: Profile) => {
    return profile.profileType === 'Individual' ? (
      <User className="w-4 h-4" />
    ) : (
      <Car className="w-4 h-4" />
    );
  };

  const getIdentifierIcon = (profile: Profile) => {
    return profile.profileType === 'Individual' ? (
      <Phone className="w-3 h-3" />
    ) : (
      <Hash className="w-3 h-3" />
    );
  };

  const handleAddToBlacklist = (profile: Profile) => {
    if (newBlacklistItem.reason) {
      const newItem: BlacklistItem = {
        id: Date.now().toString(),
        profileId: profile.profileId,
        profileName: profile.name,
        identifier: profile.identifier,
        profileType: profile.profileType,
        reason: newBlacklistItem.reason,
        addedDate: new Date().toISOString().split('T')[0],
        addedBy: 'Admin',
        status: newBlacklistItem.status,
        driverName: profile.driverName,
        driverPhone: profile.driverPhone
      };
      
      setBlacklist(prev => [...prev, newItem]);
      setNewBlacklistItem({ profileId: '', reason: '', status: 'active' });
      setShowAddForm(false);
    }
  };

  const handleRemoveFromBlacklist = (profileId: string) => {
    setBlacklist(prev => prev.filter(item => item.profileId !== profileId));
  };

  const handleStatusChange = (profileId: string, newStatus: 'active' | 'suspended') => {
    setBlacklist(prev => prev.map(item => 
      item.profileId === profileId ? { ...item, status: newStatus } : item
    ));
  };

  const activeBlacklist = blacklist.filter(item => item.status === 'active');
  const suspendedBlacklist = blacklist.filter(item => item.status === 'suspended');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              Security Management
            </h2>
            <p className="text-xl text-gray-600 mt-3 font-medium">Manage driver and vehicle access restrictions</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              placeholder="Search drivers or vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 text-lg border-2 border-gray-200 focus:border-red-500 rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Blacklisted Profiles */}
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            Blacklisted Profiles ({blacklistedProfiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blacklistedProfiles.map((profile) => (
              <Card key={profile.profileId} className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16 border-4 border-red-200 shadow-lg">
                      <AvatarImage src={profile.photoUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-red-100 to-pink-100 text-red-700 text-lg font-bold">
                        {getProfileIcon(profile)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate text-lg">{profile.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        {getIdentifierIcon(profile)}
                        <span className="truncate">{profile.identifier}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive" className="text-sm px-3 py-1 font-semibold">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Blacklisted
                      </Badge>
                      <Badge variant={profile.profileType === 'Individual' ? 'default' : 'secondary'} className="text-sm px-3 py-1 font-semibold">
                        {profile.profileType}
                      </Badge>
                    </div>
                    
                    {profile.profileType === 'Vehicle' && profile.driverName && (
                      <div className="text-sm text-gray-600 bg-white/50 p-3 rounded-lg">
                        <p className="font-semibold">Driver: {profile.driverName}</p>
                        {profile.driverPhone && (
                          <p className="text-xs text-gray-500 mt-1">Phone: {profile.driverPhone}</p>
                        )}
                      </div>
                    )}
                    
                    {profile.notes && (
                      <p className="text-sm text-gray-500 truncate bg-white/50 p-2 rounded-lg">{profile.notes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {blacklistedProfiles.length === 0 && (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-bold text-2xl mb-2">No blacklisted profiles</p>
                <p className="text-gray-500 text-lg">All profiles have normal access</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            Recent Security Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {blacklistedEntries.slice(-10).reverse().map((log) => (
              <div key={log.logId} className="flex items-center gap-6 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl hover:shadow-lg transition-all duration-200">
                <Avatar className="w-14 h-14 border-4 border-orange-200 shadow-lg">
                  <AvatarImage src={log.profile.photoUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-700 text-lg font-bold">
                    {getProfileIcon(log.profile)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-gray-900 text-lg">{log.profile.name}</p>
                    <Badge variant="destructive" className="text-sm px-3 py-1 font-semibold">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Blacklisted
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-base text-gray-600 font-medium">
                    {getIdentifierIcon(log.profile)}
                    <span>{log.profile.identifier}</span>
                    <span className="text-gray-400">•</span>
                    <span>{log.profile.profileType}</span>
                  </div>
                  {log.purpose && (
                    <p className="text-sm text-gray-500 mt-2 bg-white/50 p-2 rounded-lg">Purpose: {log.purpose}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-base text-gray-500 font-medium">{new Date(log.entryTime).toLocaleString()}</p>
                  <Badge variant={log.status === 'Inside' ? 'default' : 'secondary'} className="text-sm px-3 py-1 font-semibold mt-2">
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            {blacklistedEntries.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-bold text-2xl mb-2">No recent security activity</p>
                <p className="text-gray-500 text-lg">Activity will appear here when blacklisted profiles attempt access</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-base font-semibold mb-2">Blacklisted Profiles</p>
                <p className="text-4xl font-bold mb-2">{blacklistedProfiles.length}</p>
                <p className="text-red-200 text-sm font-medium">Restricted access</p>
              </div>
              <div className="bg-red-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-base font-semibold mb-2">Recent Attempts</p>
                <p className="text-4xl font-bold mb-2">{blacklistedEntries.length}</p>
                <p className="text-orange-200 text-sm font-medium">Security alerts</p>
              </div>
              <div className="bg-orange-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-base font-semibold mb-2">Total Profiles</p>
                <p className="text-4xl font-bold mb-2">{profiles.length}</p>
                <p className="text-blue-200 text-sm font-medium">In system</p>
              </div>
              <div className="bg-blue-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                <User className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-base font-semibold mb-2">Active Entries</p>
                <p className="text-4xl font-bold mb-2">{accessLogs.filter(log => log.status === 'Inside').length}</p>
                <p className="text-green-200 text-sm font-medium">Currently inside</p>
              </div>
              <div className="bg-green-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlacklistManager;