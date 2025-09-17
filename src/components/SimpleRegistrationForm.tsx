import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Car } from 'lucide-react';

interface SimpleRegistrationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SimpleRegistrationForm: React.FC<SimpleRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [profileType, setProfileType] = useState<'Individual' | 'Vehicle'>('Individual');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleProfileTypeChange = (newType: 'Individual' | 'Vehicle') => {
    setProfileType(newType);
    // Reset all fields when switching profile types
    setName('');
    setIdentifier('');
    setEmail('');
    setCompany('');
    setDriverName('');
    setDriverPhone('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !identifier.trim()) {
      return;
    }
    
    if (profileType === 'Vehicle' && (!driverName.trim() || !driverPhone.trim())) {
      return;
    }
    
    onSubmit({
      profileType,
      name,
      identifier,
      email: profileType === 'Individual' ? email : '',
      company: profileType === 'Individual' ? company : '',
      driverName: profileType === 'Vehicle' ? driverName : '',
      driverPhone: profileType === 'Vehicle' ? driverPhone : '',
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      
      {/* Profile Type Selection - Mobile Optimized */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-sm sm:text-base font-semibold text-gray-700">Profile Type</Label>
        <div className="flex gap-2 sm:gap-3">
          <Button
            type="button"
            variant={profileType === 'Individual' ? 'default' : 'outline'}
            onClick={() => handleProfileTypeChange('Individual')}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Individual
          </Button>
          <Button
            type="button"
            variant={profileType === 'Vehicle' ? 'default' : 'outline'}
            onClick={() => handleProfileTypeChange('Vehicle')}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl"
          >
            <Car className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Vehicle
          </Button>
        </div>
      </div>

      {/* Name Field - Mobile Optimized */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base font-semibold text-gray-700">
          {profileType === 'Individual' ? 'Full Name' : 'Vehicle Name/Model'}
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={profileType === 'Individual' ? 'e.g., John Doe' : 'e.g., Toyota Camry'}
          className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl"
          required
        />
      </div>

      {/* Identifier Field - Mobile Optimized */}
      <div className="space-y-2">
        <Label htmlFor="identifier" className="text-sm sm:text-base font-semibold text-gray-700">
          {profileType === 'Individual' ? 'Phone Number' : 'Plate Number'}
        </Label>
        <Input
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={profileType === 'Individual' ? 'e.g., 08123456789' : 'e.g., ABC-123'}
          className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl"
          required
        />
      </div>

      {/* Individual-specific fields */}
      {profileType === 'Individual' && (
        <>
          {/* Email Field - Mobile Optimized */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., john.doe@company.com"
              className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl"
            />
          </div>

          {/* Company Field - Mobile Optimized */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm sm:text-base font-semibold text-gray-700">Company/Organization</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., ATLAS LTD, University of Maiduguri"
              className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl"
            />
          </div>
        </>
      )}

      {/* Vehicle-specific fields */}
      {profileType === 'Vehicle' && (
        <>
          {/* Driver Name Field - Mobile Optimized */}
          <div className="space-y-2">
            <Label htmlFor="driverName" className="text-sm sm:text-base font-semibold text-gray-700">Driver Name</Label>
            <Input
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="e.g., Shedrack Joel"
              className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl"
              required
            />
          </div>

          {/* Driver Phone Field - Mobile Optimized */}
          <div className="space-y-2">
            <Label htmlFor="driverPhone" className="text-sm sm:text-base font-semibold text-gray-700">Driver Phone Number</Label>
            <Input
              id="driverPhone"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              placeholder="e.g., 08123456789"
              className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl"
              required
            />
          </div>
        </>
      )}

      {/* Notes Field - Mobile Optimized */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm sm:text-base font-semibold text-gray-700">Vital Information</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional important information"
          className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl"
        />
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl border-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default SimpleRegistrationForm;
