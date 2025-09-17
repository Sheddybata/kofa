import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { CreateProfileForm, ProfileType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, User, Car, Phone, Hash } from 'lucide-react';

interface ProfileRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profileId: string) => void;
  defaultProfileType?: ProfileType;
}

const ProfileRegistration: React.FC<ProfileRegistrationProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
  defaultProfileType = 'Individual'
}) => {
  const { addProfile, profiles, isLoading } = useAppContext();
  const [formData, setFormData] = useState<CreateProfileForm>({
    profileType: defaultProfileType,
    name: '',
    identifier: '',
    notes: '',
    linkedProfileId: undefined,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateProfileForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Identifier is required';
    } else {
      // Check for duplicate identifier
      const existingProfile = profiles.find(p => 
        p.identifier.toLowerCase() === formData.identifier.toLowerCase()
      );
      if (existingProfile) {
        newErrors.identifier = 'A profile with this identifier already exists';
      }
    }

    // Validate identifier format based on profile type
    if (formData.profileType === 'Individual' && formData.identifier.trim()) {
      const phoneRegex = /^(\+?234|0)?[789][01]\d{8}$/;
      if (!phoneRegex.test(formData.identifier.replace(/\s/g, ''))) {
        newErrors.identifier = 'Please enter a valid Nigerian phone number';
      }
    }

    if (formData.profileType === 'Vehicle' && formData.identifier.trim()) {
      const plateRegex = /^[A-Z]{3}[- ]?[0-9]{3}[A-Z]{0,2}$/i;
      if (!plateRegex.test(formData.identifier.replace(/\s/g, ''))) {
        newErrors.identifier = 'Please enter a valid plate number (e.g., ABC-123)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await addProfile({
      ...formData,
      photo: photo || undefined,
    });

    if (result.success && result.data) {
      onProfileCreated(result.data.profileId);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      profileType: defaultProfileType,
      name: '',
      identifier: '',
      notes: '',
      linkedProfileId: undefined,
    });
    setPhoto(null);
    setPhotoPreview(null);
    setErrors({});
    onClose();
  };

  const getIdentifierPlaceholder = () => {
    switch (formData.profileType) {
      case 'Individual':
        return 'e.g., 08123456789 or +2348123456789';
      case 'Vehicle':
        return 'e.g., ABC-123 or XYZ-456';
      default:
        return 'Enter identifier';
    }
  };

  const getIdentifierIcon = () => {
    switch (formData.profileType) {
      case 'Individual':
        return <Phone className="w-4 h-4" />;
      case 'Vehicle':
        return <Hash className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Register New Profile
          </DialogTitle>
          <DialogDescription>
            Create a new {formData.profileType.toLowerCase()} profile in the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Type Selection */}
          <div className="space-y-2">
            <Label>Profile Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.profileType === 'Individual' ? 'default' : 'outline'}
                onClick={() => handleInputChange('profileType', 'Individual')}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Individual
              </Button>
              <Button
                type="button"
                variant={formData.profileType === 'Vehicle' ? 'default' : 'outline'}
                onClick={() => handleInputChange('profileType', 'Vehicle')}
                className="flex-1"
              >
                <Car className="w-4 h-4 mr-2" />
                Vehicle
              </Button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a photo for better identification
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {formData.profileType === 'Individual' ? 'Full Name' : 'Vehicle Name/Model'}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={formData.profileType === 'Individual' ? 'e.g., John Doe' : 'e.g., Toyota Camry'}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Identifier */}
          <div className="space-y-2">
            <Label htmlFor="identifier">
              {formData.profileType === 'Individual' ? 'Phone Number' : 'Plate Number'}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {getIdentifierIcon()}
              </div>
              <Input
                id="identifier"
                value={formData.identifier}
                onChange={(e) => handleInputChange('identifier', e.target.value)}
                placeholder={getIdentifierPlaceholder()}
                className={`pl-10 ${errors.identifier ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.identifier && <p className="text-sm text-red-500">{errors.identifier}</p>}
          </div>

          {/* Vehicle Linking (only for vehicles) */}
          {formData.profileType === 'Vehicle' && (
            <div className="space-y-2">
              <Label htmlFor="linkedProfile">Link to Individual (Optional)</Label>
              <Select
                value={formData.linkedProfileId || ''}
                onValueChange={(value) => handleInputChange('linkedProfileId', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an individual to link this vehicle to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No link</SelectItem>
                  {profiles
                    .filter(p => p.profileType === 'Individual')
                    .map(profile => (
                      <SelectItem key={profile.profileId} value={profile.profileId}>
                        {profile.name} ({profile.identifier})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Link this vehicle to an individual for easier access management
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="e.g., VIP guest, Staff vehicle, Regular visitor..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileRegistration;



