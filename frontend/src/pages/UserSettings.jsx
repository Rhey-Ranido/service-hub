import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileImageUpload from '../components/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Lock, 
  Settings, 
  Save,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

const UserSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [emailForm, setEmailForm] = useState({
    email: '',
    currentPassword: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI states
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submitting, setSubmitting] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const API_BASE_URL = 'http://localhost:3000/api';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      const userData = data.user;
      
      // Ensure profileImageUrl is properly set
      const updatedUserData = {
        ...userData,
        profileImageUrl: userData.profileImageUrl || userData.profileImage || null
      };
      
      setUser(updatedUserData);
      
      // Update localStorage with the complete user data including profile image
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      // Pre-fill forms
      setProfileForm({
        firstName: updatedUserData.firstName || '',
        lastName: updatedUserData.lastName || '',
        phone: updatedUserData.phone || ''
      });
      setEmailForm({
        email: updatedUserData.email || '',
        currentPassword: ''
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage('Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Show message
  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(prev => ({ ...prev, profile: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = data.user;
      setUser(updatedUser);
      
      // Update localStorage to persist the change
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Trigger custom event to notify other components (like Navbar)
      window.dispatchEvent(new CustomEvent('userProfileUpdated'));
      
      showMessage('Profile updated successfully', 'success');

    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage(error.message, 'error');
    } finally {
      setSubmitting(prev => ({ ...prev, profile: false }));
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSubmitting(prev => ({ ...prev, password: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showMessage('Password changed successfully', 'success');

    } catch (error) {
      console.error('Error changing password:', error);
      showMessage(error.message, 'error');
    } finally {
      setSubmitting(prev => ({ ...prev, password: false }));
    }
  };

  // Handle image update
  const handleImageUpdate = (imageUrl) => {
    // Get current user from localStorage to make sure we have the latest data
    const currentUserData = localStorage.getItem('user');
    const currentUser = currentUserData ? JSON.parse(currentUserData) : user;
    
    const updatedUser = {
      ...currentUser,
      profileImageUrl: imageUrl
    };
    
    setUser(updatedUser);
    
    // Update localStorage to persist the change
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Trigger custom event to notify other components (like Navbar)
    window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
      detail: { profileImageUrl: imageUrl } 
    }));
    
    showMessage('Profile picture updated successfully', 'success');
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : messageType === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <ProfileImageUpload
                  type="user"
                  currentImageUrl={user?.profileImageUrl}
                  onImageUpdate={handleImageUpdate}
                />
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={user?.isVerified ? 'default' : 'secondary'}>
                            {user?.isVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                          <Badge variant="outline">{user?.role}</Badge>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={submitting.profile}
                          className="flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{submitting.profile ? 'Saving...' : 'Save Changes'}</span>
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter new email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailPassword">Current Password</Label>
                    <Input
                      id="emailPassword"
                      type="password"
                      value={emailForm.currentPassword}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password to confirm"
                    />
                  </div>
                  <Button type="button" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Update Email</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting.password}
                    className="flex items-center space-x-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{submitting.password ? 'Changing...' : 'Change Password'}</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserSettings; 