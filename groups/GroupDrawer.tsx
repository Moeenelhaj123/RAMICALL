import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, X, Users } from 'lucide-react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Group, UserLite, CreateGroupRequest, UpdateGroupRequest } from '@/types/groups';
import { GROUP_COLORS } from '@/types/groups';
import { createGroup, updateGroup } from '@/services/groups';
import { fetchUsers } from '@/services/users';

interface GroupDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Group | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function GroupDrawer({ open, onOpenChange, group, onSaved, onCancel }: GroupDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserLite[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSelectorOpen, setUserSelectorOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: GROUP_COLORS[0] as string,
    notes: '',
    memberUserIds: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when group changes
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        color: group.color || GROUP_COLORS[0] as string,
        notes: group.notes || '',
        memberUserIds: group.memberUserIds,
      });
    } else {
      setFormData({
        name: '',
        color: GROUP_COLORS[0] as string,
        notes: '',
        memberUserIds: [],
      });
    }
    setErrors({});
  }, [group]);

  // Load available users
  const loadUsers = useCallback(async (searchQuery: string = '') => {
    setUsersLoading(true);
    try {
      const response = await fetchUsers({
        active: true,
        query: searchQuery || undefined,
        pageSize: 100, // Load more for selection
      });
      setAvailableUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open, loadUsers]);

  // Debounced user search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userSearchQuery !== undefined) {
        loadUsers(userSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearchQuery, loadUsers]);

  const selectedUsers = useMemo(() => {
    return availableUsers.filter(user => formData.memberUserIds.includes(user.id));
  }, [availableUsers, formData.memberUserIds]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }

    if (formData.memberUserIds.length === 0) {
      newErrors.members = 'At least one member is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        name: formData.name.trim(),
        memberUserIds: formData.memberUserIds,
        color: formData.color,
        notes: formData.notes.trim() || undefined,
      };

      if (group) {
        await updateGroup(group.id, requestData as UpdateGroupRequest);
        toast.success(`Group "${requestData.name}" updated successfully`);
      } else {
        await createGroup(requestData as CreateGroupRequest);
        toast.success(`Group "${requestData.name}" created successfully`);
      }

      onSaved();
    } catch (error) {
      console.error('Failed to save group:', error);
      toast.error('Failed to save group');
    } finally {
      setLoading(false);
    }
  }, [formData, group, validateForm, onSaved]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleMemberToggle = useCallback((userId: string) => {
    setFormData(prev => ({
      ...prev,
      memberUserIds: prev.memberUserIds.includes(userId)
        ? prev.memberUserIds.filter(id => id !== userId)
        : [...prev.memberUserIds, userId]
    }));
  }, []);

  const handleMemberRemove = useCallback((userId: string) => {
    setFormData(prev => ({
      ...prev,
      memberUserIds: prev.memberUserIds.filter(id => id !== userId)
    }));
  }, []);

  const getUserInitials = useCallback((name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{group ? 'Edit Group' : 'Create New Group'}</SheetTitle>
          <SheetDescription>
            {group ? 'Update the group details and members.' : 'Create a new group to organize users for filtering and analytics.'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter group name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-4 w-4 rounded-full" 
                      style={{ backgroundColor: formData.color }}
                    />
                    <span>Group Color</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {GROUP_COLORS.map((color, index) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span>Color {index + 1}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Optional description or notes"
              rows={3}
            />
          </div>

          {/* Members */}
          <div className="space-y-2">
            <Label>Members *</Label>
            <div className="space-y-3">
              {/* Selected members */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-slate-600">
                    Selected ({selectedUsers.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <Badge
                        key={user.id}
                        variant="secondary"
                        className="flex items-center gap-2 pl-1 pr-2"
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{user.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleMemberRemove(user.id)}
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Member selector */}
              <Popover open={userSelectorOpen} onOpenChange={setUserSelectorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={userSelectorOpen}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Add members...</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onValueChange={setUserSearchQuery}
                    />
                    <CommandList>
                      {usersLoading ? (
                        <CommandEmpty>Loading users...</CommandEmpty>
                      ) : availableUsers.length === 0 ? (
                        <CommandEmpty>No users found.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {availableUsers.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={() => handleMemberToggle(user.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.memberUserIds.includes(user.id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback className="text-xs">
                                  {getUserInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{user.name}</div>
                                <div className="text-xs text-slate-500 truncate">
                                  {user.email} • Ext. {user.extension}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {errors.members && (
              <p className="text-sm text-red-600">{errors.members}</p>
            )}
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : group ? 'Update Group' : 'Create Group'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}