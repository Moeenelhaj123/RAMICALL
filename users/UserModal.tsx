import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeSlash, User, Camera, Upload } from '@phosphor-icons/react'
import type { UserAccount, UserRole, CreateUserPayload, UpdateUserPayload } from '@/types/users'

type UserModalProps = {
  open: boolean
  onClose: () => void
  user?: UserAccount
  onSave: (payload: CreateUserPayload | { id: string; updates: UpdateUserPayload }) => Promise<void>
}

type FormData = {
  name: string
  email: string
  role: UserRole
  mobileNumber: string
  password: string
  confirmPassword: string
  currentPassword: string
  avatarUrl: string
}

export function UserModal({ open, onClose, user, onSave }: UserModalProps) {
  const isEditMode = !!user
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'User' as UserRole,
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    currentPassword: '',
    avatarUrl: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (open) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }

    if (user && isEditMode) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        mobileNumber: user.mobileNumber || '',
        password: '',
        confirmPassword: '',
        currentPassword: '',
        avatarUrl: user.avatarUrl || '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'User' as UserRole,
        mobileNumber: '',
        password: '',
        confirmPassword: '',
        currentPassword: '',
        avatarUrl: '',
      })
    }
    setErrors({})
  }, [user, isEditMode, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!isEditMode && !formData.password) {
      newErrors.password = 'Password is required for new users'
    }

    if (!isEditMode && formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

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

        if (formData.password) {
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
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        handleInputChange('avatarUrl', result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!open && !isAnimating) return null

  return (
    <>
      {/* Floating Drawer */}
      <div 
        className={`fixed top-4 right-4 bottom-4 z-50 w-[45%] min-w-[400px] max-w-[600px] transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer content */}
        <div className="h-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Drawer header - Sticky */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit User' : 'Create New User'}
            </h3>
            <button 
              type="button" 
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-10 h-10 inline-flex justify-center items-center transition-colors"
              onClick={onClose}
            >
              <X size={20} />
              <span className="sr-only">Close drawer</span>
            </button>
          </div>

          {/* Drawer body - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 h-full flex flex-col">
            {/* Avatar Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div 
                  className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
                  onClick={handleAvatarClick}
                >
                  {formData.avatarUrl ? (
                    <img 
                      src={formData.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera size={24} className="mx-auto text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 font-medium">Upload Avatar</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 text-white rounded-full p-2 transition-colors shadow-lg"
                  style={{ backgroundColor: '#1f2937' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                >
                  <Upload size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

              <div className="grid gap-6 mb-6 grid-cols-1">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block mb-3 text-sm font-semibold text-gray-900">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 block w-full p-3 transition-all`}
                    placeholder="Enter full name" 
                    required
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block mb-3 text-sm font-semibold text-gray-900">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 block w-full p-3 transition-all`}
                    placeholder="user@example.com" 
                    required
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Role and Mobile Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Role Dropdown */}
                  <div>
                    <label htmlFor="role" className="block mb-3 text-sm font-semibold text-gray-900">
                      Role
                    </label>
                    <select 
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 block w-full p-3 transition-all"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="mobile" className="block mb-3 text-sm font-semibold text-gray-900">
                      Mobile Number
                    </label>
                    <input 
                      type="tel" 
                      name="mobile" 
                      id="mobile"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 block w-full p-3 transition-all"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                {/* Password Section */}
                {isEditMode && (
                  <div>
                    <label htmlFor="currentPassword" className="block mb-3 text-sm font-semibold text-gray-900">
                      Current Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword" 
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 block w-full p-3 pr-10 transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Password Row */}
                <div className={`grid ${!isEditMode ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block mb-3 text-sm font-semibold text-gray-900">
                      {isEditMode ? 'New Password (optional)' : 'Password'}
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        name="password" 
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 block w-full p-3 pr-10 transition-all`}
                        placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                        {...(!isEditMode && { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Input */}
                  {!isEditMode && (
                    <div>
                      <label htmlFor="confirmPassword" className="block mb-3 text-sm font-semibold text-gray-900">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword" 
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 block w-full p-3 pr-10 transition-all`}
                          placeholder="Confirm password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  )}
                </div>
            </div>

              {/* Submit Button - Sticky at bottom */}
              <div className="flex justify-center pt-6 mt-auto">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="text-white inline-flex items-center focus:ring-4 focus:outline-none font-semibold rounded-xl text-sm px-8 py-4 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: loading ? '#6b7280' : '#1f2937' }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#374151')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1f2937')}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <User size={18} className="me-2 -ms-1" />
                      {isEditMode ? 'Update User' : 'Create User'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}