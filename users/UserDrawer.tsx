import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeSlash, Upload, User } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { UserAccount, UserRole, CreateUserPayload, UpdateUserPayload } from '@/types/users'
import { formatDistanceToNow } from 'date-fns'

type UserDrawerProps = {
  open: boolean
  onClose: () => void
  user?: UserAccount
  onSave: (payload: CreateUserPayload | { id: string; updates: UpdateUserPayload }) => Promise<void>
  onDisable?: (id: string) => Promise<void>
  onEnable?: (id: string) => Promise<void>
}

type FormData = {
  name: string
  email: string
  role: UserRole
  mobileNumber: string
  password: string
  confirmPassword: string
  avatarUrl: string
}

export function UserDrawer({ open, onClose, user, onSave, onDisable, onEnable }: UserDrawerProps) {
  const isEditMode = !!user
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'User',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    avatarUrl: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDialog, setConfirmDialog] = useState<'disable' | 'enable' | null>(null)

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          mobileNumber: user.mobileNumber || '',
          password: '',
          confirmPassword: '',
          avatarUrl: user.avatarUrl || '',
        })
        setShowResetPassword(false)
      } else {
        setFormData({
          name: '',
          email: '',
          role: 'User',
          mobileNumber: '',
          password: '',
          confirmPassword: '',
          avatarUrl: '',
        })
      }
      setErrors({})
    }
  }, [open, user])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!isEditMode || showResetPassword) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    if (formData.mobileNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.mobileNumber.replace(/[\s-]/g, ''))) {
      newErrors.mobileNumber = 'Invalid mobile number format (E.164)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      if (isEditMode && user) {
        const updates: UpdateUserPayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          mobileNumber: formData.mobileNumber || undefined,
          avatarUrl: formData.avatarUrl || undefined,
        }
        if (showResetPassword && formData.password) {
          updates.newPassword = formData.password
        }
        await onSave({ id: user.id, updates })
      } else {
        const payload: CreateUserPayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          mobileNumber: formData.mobileNumber || undefined,
          password: formData.password,
          avatarUrl: formData.avatarUrl || undefined,
        }
        await onSave(payload)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!user) return
    setLoading(true)
    try {
      if (user.disabled) {
        await onEnable?.(user.id)
      } else {
        await onDisable?.(user.id)
      }
      setConfirmDialog(null)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: 'Image must be less than 5MB' })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string })
        setErrors({ ...errors, avatar: '' })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date?: string) => {
    if (!date) return 'Never'
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  const getPasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 15
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10
    return Math.min(strength, 100)
  }

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : 0

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[90vw] sm:w-[500px] md:w-[540px] max-w-[600px] overflow-y-auto p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <h2 className="text-lg font-semibold">
                {isEditMode ? 'Edit User' : 'Add User'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={loading}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <X size={24} weight="bold" />
              </Button>
            </div>

            {loading && (
              <div className="w-full h-1 bg-muted">
                <div className="h-full bg-primary animate-pulse" style={{ width: '50%' }}></div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-muted cursor-pointer transition-all group-hover:border-primary" onClick={handleAvatarClick}>
                    <AvatarImage src={formData.avatarUrl} alt={formData.name || 'User'} />
                    <AvatarFallback className="text-2xl bg-muted">
                      {formData.name ? getInitials(formData.name) : <User size={32} />}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={loading}
                  >
                    <Upload size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                {errors.avatar && <p className="text-sm text-destructive">{errors.avatar}</p>}
                <p className="text-xs text-muted-foreground text-center">Click to upload avatar (max 5MB)</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                      disabled={loading}
                    >
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      disabled={loading}
                      placeholder="+971501234567"
                    />
                  </div>
                </div>
                
                {errors.mobileNumber ? (
                  <p className="text-sm text-destructive">{errors.mobileNumber}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">E.164 format (e.g., +971501234567)</p>
                )}
              </div>

              {(!isEditMode || showResetPassword) && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold">
                    {isEditMode ? 'Reset Password' : 'Password'}
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                    {errors.password ? (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                    )}
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Strength</span>
                        <span>
                          {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Fair' : 'Strong'}
                        </span>
                      </div>
                      <Progress value={passwordStrength} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {isEditMode && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResetPassword(false)
                        setFormData({ ...formData, password: '', confirmPassword: '' })
                      }}
                      className="w-full"
                    >
                      Cancel Password Reset
                    </Button>
                  )}
                </div>
              )}

              {isEditMode && !showResetPassword && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowResetPassword(true)}
                    disabled={loading}
                    className="w-full"
                  >
                    Reset Password
                  </Button>
                </div>
              )}

              {isEditMode && user && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-sm font-semibold">Account Info</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Created On</dt>
                      <dd className="tabular-nums font-medium">
                        {formatDate(user.createdOn)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last Login</dt>
                      <dd className="tabular-nums font-medium">
                        {formatDate(user.lastLogin)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last Call</dt>
                      <dd className="tabular-nums font-medium">
                        {formatDate(user.lastCall)}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            <div className="border-t p-4 space-y-2">
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>

              {isEditMode && (onDisable || onEnable) && user && (
                <Button
                  variant={user.disabled ? 'default' : 'destructive'}
                  onClick={() => setConfirmDialog(user.disabled ? 'enable' : 'disable')}
                  disabled={loading}
                  className="w-full"
                >
                  {user.disabled ? 'Enable User' : 'Disable User'}
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDialog === 'disable' || confirmDialog === 'enable'} onOpenChange={() => setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog === 'disable' ? 'Disable User' : 'Enable User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog === 'disable'
                ? 'Are you sure you want to disable this user? They will not be able to log in.'
                : 'Are you sure you want to enable this user? They will be able to log in again.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} disabled={loading}>
              {confirmDialog === 'disable' ? 'Disable' : 'Enable'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
