import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Profile, AccessLog, CreateProfileForm } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Car, Phone, Hash, Clock, CheckCircle, AlertTriangle, LogOut, Plus, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import SimpleRegistrationForm from './SimpleRegistrationForm';

interface GuardInterfaceWorkingProps {
  onLogout: () => void;
}

const GuardInterfaceWorking: React.FC<GuardInterfaceWorkingProps> = ({ onLogout }) => {
  const { 
    logEntry, 
    getAccessLogsWithProfiles, 
    profiles, 
    addProfile,
    addAccessLog,
    isLoading 
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [purpose, setPurpose] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentLog, setCurrentLog] = useState<AccessLog | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simple search function
  const searchResults = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.identifier.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 results

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setSearchQuery('');
    setPurpose('');
  };

  const handleLogEntry = async () => {
    if (!selectedProfile) return;

    const result = await logEntry(selectedProfile.profileId, purpose);
    
    if (result.success && result.data) {
      setCurrentLog(result.data);
      setShowReceipt(true);
      setShowSuccess(true);
      
      // Reset form
      setSelectedProfile(null);
      setPurpose('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCurrentLog(null);
  };

  // Registration handlers
  const handleRegistrationSubmit = async (formData: CreateProfileForm) => {
    try {
      const result = await addProfile(formData);
      
      if (result.success && result.data) {
        // Create access log entry directly using the profile data
        const newLog: AccessLog = {
          logId: crypto.randomUUID(),
          profileId: result.data.profileId,
          entryTime: new Date().toISOString(),
          status: 'Inside',
          purpose: 'New registration',
        };
        
        // Add the access log directly to the context
        addAccessLog(newLog);
        
        // Reset all form state to return to home page
        setSelectedProfile(null);
        setSearchQuery('');
        setPurpose('');
        setShowRegistration(false);
        
        // Show success notification
        toast({
          title: "Saved Successfully",
          description: `${formData.profileType} profile has been created and logged in.`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-2 sm:p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
          {/* Header - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <img 
                  src="/KofaSentinel logo main BB.png" 
                  alt="KofaSentinel Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl shadow-xl border-2 border-blue-100"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  KofaSentinel ATLAS
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-700">Guard Station</p>
                <p className="text-xs text-blue-600 font-medium">Access Control System</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 w-full sm:w-auto"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              Logout
            </Button>
          </div>

          {/* Search Section - Mobile Optimized */}
          <Card className="mb-4 sm:mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-gray-800">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                Search Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, phone, or plate number..."
                  className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl shadow-sm"
                />
              </div>

              {/* Search Results - Mobile Optimized */}
              {searchQuery && searchResults.length > 0 && (
                <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                  {searchResults.map((profile) => (
                    <div
                      key={profile.profileId}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl cursor-pointer hover:bg-blue-50 hover:shadow-md transition-all duration-200 border border-gray-100"
                      onClick={() => handleProfileSelect(profile)}
                    >
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-blue-100">
                        <AvatarImage src={profile.photoUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-xs sm:text-sm font-semibold">
                          {getProfileIcon(profile)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{profile.name}</p>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                          {getIdentifierIcon(profile)}
                          <span className="truncate font-medium">{profile.identifier}</span>
                        </div>
                      </div>
                      <Badge variant={profile.profileType === 'Individual' ? 'default' : 'secondary'} className="text-xs px-2 py-1 sm:px-3 font-semibold">
                        {profile.profileType}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No profiles found</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                </div>
              )}

              {/* Register New Button - Mobile Optimized */}
              <Button
                onClick={() => setShowRegistration(true)}
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Register New Profile
              </Button>
            </CardContent>
          </Card>

          {/* Selected Profile - Mobile Optimized */}
          {selectedProfile && (
            <Card className="mb-4 sm:mb-6 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-gray-800">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  Selected Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-200 shadow-lg">
                    <AvatarImage src={selectedProfile.photoUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 text-sm sm:text-lg font-bold">
                      {getProfileIcon(selectedProfile)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2 truncate">{selectedProfile.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm sm:text-base text-gray-700">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {getIdentifierIcon(selectedProfile)}
                        <span className="font-semibold truncate">{selectedProfile.identifier}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <Badge variant={selectedProfile.profileType === 'Individual' ? 'default' : 'secondary'} className="text-xs sm:text-sm px-2 py-1 sm:px-3 font-semibold">
                          {selectedProfile.profileType}
                        </Badge>
                      </div>
                    </div>
                    {selectedProfile.isBlacklisted && (
                      <Badge variant="destructive" className="text-sm px-3 py-1 font-semibold">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Blacklisted
                      </Badge>
                    )}
                  </div>
                </div>

                {selectedProfile.notes && (
                  <p className="text-sm text-gray-600">{selectedProfile.notes}</p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-sm sm:text-base font-semibold text-gray-700">Purpose of Visit</Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Enter the purpose of visit..."
                    rows={2}
                    className="mt-2 border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>

                <Button
                  onClick={handleLogEntry}
                  disabled={isLoading || selectedProfile.isBlacklisted}
                  className="w-full h-12 sm:h-14 text-sm sm:text-lg font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin" />
                      Logging Entry...
                    </>
                  ) : selectedProfile.isBlacklisted ? (
                    <>
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                      <span className="hidden sm:inline">Access Denied - Blacklisted</span>
                      <span className="sm:hidden">Access Denied</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                      Log Entry
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity - Mobile Optimized */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-gray-800">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                {getAccessLogsWithProfiles()
                  .slice(-5)
                  .reverse()
                  .map((log) => (
                      <div
                        key={log.logId}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-purple-100">
                          <AvatarImage src={log.profile.photoUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-xs sm:text-sm font-semibold">
                            {getProfileIcon(log.profile)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {log.profile.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">
                            {new Date(log.entryTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge
                          variant={log.status === 'Inside' ? 'default' : 'secondary'}
                          className="text-xs sm:text-sm px-2 py-1 sm:px-3 font-semibold"
                        >
                          {log.status}
                        </Badge>
                      </div>
                  ))}
                
                {getAccessLogsWithProfiles().length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-semibold text-base sm:text-lg">No recent activity</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Activity will appear here after entries are logged</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registration Modal - Mobile Optimized */}
      {showRegistration && (
        <Dialog open={showRegistration} onOpenChange={handleCloseRegistration}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-0 shadow-2xl mx-4 sm:mx-0">
            <DialogHeader className="pb-4 sm:pb-6">
              <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold text-gray-800">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                Register New Profile
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600">
                Create a new individual or vehicle profile for access control.
              </DialogDescription>
            </DialogHeader>
            <SimpleRegistrationForm
              onSubmit={handleRegistrationSubmit}
              onCancel={handleCloseRegistration}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Receipt Modal */}
      {showReceipt && currentLog && selectedProfile && (
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-md border-0 shadow-2xl">
            <DialogHeader className="pb-6">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                Entry Logged Successfully
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                Access has been logged successfully. Print or save this receipt.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={selectedProfile.photoUrl} />
                  <AvatarFallback className="bg-green-100">
                    {getProfileIcon(selectedProfile)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{selectedProfile.name}</h3>
                <p className="text-gray-600">{selectedProfile.identifier}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry Time:</span>
                  <span className="font-medium">
                    {new Date(currentLog.entryTime).toLocaleString()}
                  </span>
                </div>
                {currentLog.purpose && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purpose:</span>
                    <span className="font-medium">{currentLog.purpose}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="default">Inside</Badge>
                </div>
              </div>
              
              <Button onClick={handleCloseReceipt} className="w-full">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Entry logged successfully!
        </div>
      )}
    </div>
  );
};

export default GuardInterfaceWorking;
