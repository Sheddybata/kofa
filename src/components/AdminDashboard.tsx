import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Profile, AccessLogWithProfile } from '@/types';
import BlacklistManager from './BlacklistManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Car, Phone, Hash, Clock, AlertTriangle, LogOut, Search, Users, Shield, BarChart3 } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    getDashboardStats, 
    getAccessLogsWithProfiles, 
    getProfilesWithLogs,
    profiles,
    searchProfiles,
    toggleBlacklist,
    logExit,
    clearAllAccessLogs,
    syncData
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<AccessLogWithProfile[]>([]);

  const stats = getDashboardStats();
  const accessLogs = getAccessLogsWithProfiles();
  const profilesWithLogs = getProfilesWithLogs();

  // Filter logs based on search query
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLogs(accessLogs);
    } else {
      const searchResults = searchProfiles(searchQuery);
      const profileIds = searchResults.map(result => result.profile.profileId);
      setFilteredLogs(accessLogs.filter(log => profileIds.includes(log.profile.profileId)));
    }
  }, [searchQuery, accessLogs, searchProfiles]);

  const handleLogExit = async (logId: string) => {
    await logExit(logId);
  };

  const handleToggleBlacklist = async (profileId: string) => {
    await toggleBlacklist(profileId);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src="/KofaSentinel logo main BB.png" 
                  alt="KofaSentinel Logo" 
                  className="w-24 h-24 rounded-2xl shadow-xl border-4 border-blue-100"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  KofaSentinel ATLAS
                </h1>
                <p className="text-xl text-gray-700 font-semibold mt-2">Admin Dashboard</p>
                <p className="text-lg text-blue-600 font-medium">Profile-Based Access Control Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                <p className="text-sm text-gray-600 font-medium">Welcome back, Admin</p>
                <p className="text-lg text-gray-800 font-bold">{new Date().toLocaleDateString()}</p>
                <p className="text-xs text-blue-600 font-semibold">{new Date().toLocaleTimeString()}</p>
              </div>
              <Button
                onClick={syncData}
                variant="outline"
                className="flex items-center gap-2 px-4 py-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-semibold"
              >
                <Search className="w-4 h-4" />
                Sync Data
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="flex items-center gap-3 px-6 py-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-base font-semibold mb-2">Total Profiles</p>
                  <p className="text-4xl font-bold mb-2">{stats.totalProfiles}</p>
                  <p className="text-blue-200 text-sm font-medium">Registered in system</p>
                </div>
                <div className="bg-blue-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-base font-semibold mb-2">Currently Inside</p>
                  <p className="text-4xl font-bold mb-2">{stats.currentlyInside}</p>
                  <p className="text-green-200 text-sm font-medium">Active entries</p>
                </div>
                <div className="bg-green-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-base font-semibold mb-2">Today's Entries</p>
                  <p className="text-4xl font-bold mb-2">{stats.todayEntries}</p>
                  <p className="text-purple-200 text-sm font-medium">Access logs</p>
                </div>
                <div className="bg-purple-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                  <BarChart3 className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-base font-semibold mb-2">Blacklisted</p>
                  <p className="text-4xl font-bold mb-2">{stats.blacklistedProfiles}</p>
                  <p className="text-orange-200 text-sm font-medium">Restricted access</p>
                </div>
                <div className="bg-orange-400 bg-opacity-40 p-4 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-3 px-6 py-6 text-base font-semibold rounded-xl transition-all duration-200 bg-white text-blue-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Users className="w-5 h-5" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="profiles" 
              className="flex items-center gap-3 px-6 py-6 text-base font-semibold rounded-xl transition-all duration-200 bg-white text-blue-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <User className="w-5 h-5" />
              Profiles
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-3 px-6 py-6 text-base font-semibold rounded-xl transition-all duration-200 bg-white text-blue-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Shield className="w-5 h-5" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    Recent Access Activity
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search profiles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 w-80 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="px-6 py-3 h-12 text-base font-semibold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl"
                      >
                        Export Data
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={clearAllAccessLogs}
                        className="px-6 py-3 h-12 text-base font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
                      >
                        Clear All Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                        <th className="text-left py-6 px-6 font-bold text-gray-800 text-lg">Profile</th>
                        <th className="text-left py-6 px-6 font-bold text-gray-800 text-lg">Type</th>
                        <th className="text-left py-6 px-6 font-bold text-gray-800 text-lg">Identifier</th>
                        <th className="text-left py-6 px-6 font-bold text-gray-800 text-lg">Purpose</th>
                        <th className="text-left py-6 px-6 font-bold text-gray-800 text-lg">Entry Time</th>
                        <th className="text-left py-6 px-6 font-bold text-gray-800 text-lg">Status</th>
                        <th className="text-left py-6 px-6 font-bold text-gray-800 text-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.slice(-20).reverse().map((log) => (
                        <tr key={log.logId} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                          <td className="py-6 px-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 border-2 border-gray-200 shadow-lg">
                                <AvatarImage src={log.profile.photoUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                                  {getProfileIcon(log.profile)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{log.profile.name}</p>
                                {log.profile.isBlacklisted && (
                                  <Badge variant="destructive" className="text-sm px-3 py-1 font-semibold mt-1">
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Blacklisted
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6">
                            <Badge 
                              variant={log.profile.profileType === 'Individual' ? 'default' : 'secondary'}
                              className="text-sm px-4 py-2 font-semibold"
                            >
                              {log.profile.profileType}
                            </Badge>
                          </td>
                          <td className="py-6 px-6">
                            <div className="flex items-center gap-2 text-base text-gray-700 font-medium">
                              {getIdentifierIcon(log.profile)}
                              <span>{log.profile.identifier}</span>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-gray-600 max-w-xs truncate text-base">
                            {log.purpose || 'N/A'}
                          </td>
                          <td className="py-6 px-6 text-gray-500 text-base font-medium">
                            {new Date(log.entryTime).toLocaleString()}
                          </td>
                          <td className="py-6 px-6">
                            <Badge 
                              variant={log.status === 'Inside' ? 'default' : 'secondary'}
                              className="text-sm px-4 py-2 font-semibold"
                            >
                              {log.status}
                            </Badge>
                          </td>
                          <td className="py-6 px-6">
                            {log.status === 'Inside' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleLogExit(log.logId)}
                                className="px-4 py-2 font-semibold border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 rounded-xl"
                              >
                                Log Exit
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-bold text-2xl mb-2">No access logs found</p>
                      <p className="text-gray-500 text-lg">Start logging entries to see activity here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-8">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  Profile Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {profilesWithLogs.map((profile) => (
                    <Card key={profile.profileId} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-16 h-16 border-4 border-gray-200 shadow-lg">
                            <AvatarImage src={profile.photoUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 text-lg font-bold">
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
                            <Badge 
                              variant={profile.profileType === 'Individual' ? 'default' : 'secondary'}
                              className="text-sm px-3 py-1 font-semibold"
                            >
                              {profile.profileType}
                            </Badge>
                            {profile.isCurrentlyInside && (
                              <Badge variant="default" className="text-sm px-3 py-1 font-semibold">
                                <Clock className="w-4 h-4 mr-1" />
                                Inside
                              </Badge>
                            )}
                          </div>
                          
                          {profile.notes && (
                            <p className="text-sm text-gray-500 truncate bg-gray-50 p-2 rounded-lg">{profile.notes}</p>
                          )}
                          
                          <div className="flex gap-2 pt-3">
                            <Button
                              size="sm"
                              variant={profile.isBlacklisted ? "default" : "destructive"}
                              onClick={() => handleToggleBlacklist(profile.profileId)}
                              className="flex-1 h-10 font-semibold rounded-xl"
                            >
                              {profile.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {profilesWithLogs.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-bold text-2xl mb-2">No profiles registered</p>
                    <p className="text-gray-500 text-lg">Profiles will appear here once created</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-8">
            <BlacklistManager profiles={profiles} accessLogs={accessLogs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;