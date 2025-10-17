import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X } from '@phosphor-icons/react';

export type ExtensionCreateDTO = {
  extension: string;
  presence?: "Available" | "Away" | "DND" | "Offline";
  callerIdName?: string;
  role?: string;
  email?: string;
  mobile?: string;
  device?: { sip: boolean; pc: boolean; mobile: boolean; web: boolean };
};

interface ExtensionDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ExtensionCreateDTO) => Promise<void>;
}

export default function ExtensionDrawer({
  open,
  onClose,
  onSubmit,
}: ExtensionDrawerProps) {
  const [formData, setFormData] = React.useState<ExtensionCreateDTO>({
    extension: '',
    presence: 'Available',
    callerIdName: '',
    role: '',
    email: '',
    mobile: '',
    device: {
      sip: false,
      pc: false,
      mobile: false,
      web: false,
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setFormData({
        extension: '',
        presence: 'Available',
        callerIdName: '',
        role: '',
        email: '',
        mobile: '',
        device: {
          sip: false,
          pc: false,
          mobile: false,
          web: false,
        },
      });
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.extension.trim()) {
      newErrors.extension = 'Extension number is required';
    } else if (!/^\d+$/.test(formData.extension)) {
      newErrors.extension = 'Extension must contain only numbers';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create extension:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ExtensionCreateDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-[520px] rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Extension</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={loading}
          >
            <X size={16} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-80px)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Extension Number */}
            <div className="space-y-2">
              <Label htmlFor="extension" className="text-sm font-medium">
                Extension Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="extension"
                value={formData.extension}
                onChange={(e) => updateFormData('extension', e.target.value)}
                placeholder="e.g., 100"
                className={errors.extension ? 'border-red-500' : ''}
              />
              {errors.extension && (
                <p className="text-sm text-red-500">{errors.extension}</p>
              )}
            </div>

            {/* Caller ID Name */}
            <div className="space-y-2">
              <Label htmlFor="callerIdName" className="text-sm font-medium">
                Caller ID Name
              </Label>
              <Input
                id="callerIdName"
                value={formData.callerIdName}
                onChange={(e) => updateFormData('callerIdName', e.target.value)}
                placeholder="Full Name"
              />
            </div>

            {/* User Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                User Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => updateFormData('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="user@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium">
                Mobile Number
              </Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => updateFormData('mobile', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}