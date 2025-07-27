import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DarkModeToggle from './DarkModeToggle';
import { Menu, X, User, LogOut, Settings, Home, ChevronDown, Palette, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to load user data from localStorage
  const loadUserData = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserData();

    // Listen for custom user update events
    const handleUserUpdate = () => {
      loadUserData();
    };

    // Listen for localStorage changes (for cross-tab updates)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        loadUserData();
      }
    };

    // Add event listeners
    window.addEventListener('userProfileUpdated', handleUserUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Add debug function to global scope (for troubleshooting)
    window.debugProfileImage = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('🔍 Profile Image Debug Info:');
        console.log('User object:', user);
        console.log('Profile Image URL:', user.profileImageUrl || user.profileImage || 'Not set');
        console.log('Has profile image:', !!(user.profileImageUrl || user.profileImage));
        return user;
      } else {
        console.log('❌ No user data found in localStorage');
        return null;
      }
    };

    // Cleanup event listeners
    return () => {
      window.removeEventListener('userProfileUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleStorageChange);
      delete window.debugProfileImage;
    };
  }, []);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setIsOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ href, children, onClick, isActive = false }) => (
    <button
      onClick={onClick || (() => handleNavigation(href))}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:text-primary hover:bg-muted'
      }`}
    >
      {children}
    </button>
  );

  const MobileNavLink = ({ href, children, icon: Icon, isActive = false }) => (
    <button
      onClick={() => handleNavigation(href)}
      className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:text-primary hover:bg-muted'
      }`}
    >
      {Icon && <Icon className="mr-3 h-5 w-5" />}
      {children}
    </button>
  );

  // Profile Image Component
  const ProfileAvatar = ({ className = "h-8 w-8" }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Check for profile image URL in multiple possible locations
    const profileImageUrl = user?.profileImageUrl || user?.profileImage;
    
    // Reset error state when user changes
    useEffect(() => {
      setImageError(false);
      setImageLoaded(false);
    }, [user]);
    
    // Helper function to check if URL is valid
    const isValidImageUrl = (url) => {
      if (!url) return false;
      if (typeof url !== 'string') return false;
      // Check if it's a valid URL format
      try {
        new URL(url);
        return true;
      } catch {
        // If not a full URL, check if it's a relative path
        return url.startsWith('/') || url.includes('uploads/');
      }
    };

    const hasValidProfileImage = isValidImageUrl(profileImageUrl);

    if (hasValidProfileImage && !imageError) {
      return (
        <div className="relative">
          <img
            src={profileImageUrl}
            alt="Profile"
            className={`${className} rounded-full object-cover border border-gray-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className={`absolute inset-0 ${className} bg-gray-200 rounded-full flex items-center justify-center animate-pulse`}>
              <User className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      );
    }

    // Fallback: Show default user icon
    return (
      <div className={`${className} bg-primary rounded-full flex items-center justify-center`}>
        <User className="h-4 w-4 text-primary-foreground" />
      </div>
    );
  };

  return (
    <nav className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <span>ServiceHub</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {/* Navigation Links */}
              <NavLink href="/" isActive={isActiveRoute('/')}>
                Home
              </NavLink>
              <NavLink href="/services" isActive={isActiveRoute('/services')}>
                Services
              </NavLink>

              {user ? (
                <>
                  {user.role === 'provider' && (
                    <NavLink href="/dashboard" isActive={isActiveRoute('/dashboard')}>
                      Dashboard
                    </NavLink>
                  )}
                  {user.role === 'client' && (
                    <NavLink href="/messages" isActive={isActiveRoute('/messages')}>
                      Messages
                    </NavLink>
                  )}
                  {user.role === 'admin' && (
                    <NavLink href="/admin" isActive={isActiveRoute('/admin')}>
                      Admin
                    </NavLink>
                  )}
                  
                  {/* User Profile Dropdown */}
                  <div className="relative ml-4 pl-4 border-l border-gray-200" ref={profileDropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <ProfileAvatar />
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-foreground truncate max-w-32">
                          {user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg border border-border py-1 z-50 animate-in fade-in duration-200">
                        <button
                          onClick={() => {
                            handleNavigation('/settings');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </button>
                        <div className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <Palette className="h-4 w-4 mr-3" />
                              <span>Dark Mode</span>
                            </div>
                            <DarkModeToggle className="h-6 w-6" />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <NavLink href="/login" isActive={isActiveRoute('/login')}>
                    Sign In
                  </NavLink>
                  <Button onClick={() => handleNavigation('/register')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
            <MobileNavLink href="/" icon={Home} isActive={isActiveRoute('/')}>
              Home
            </MobileNavLink>
            
            {user ? (
              <>
                                {user.role === 'provider' && (
                  <MobileNavLink href="/dashboard" isActive={isActiveRoute('/dashboard')}>
                    Dashboard
                  </MobileNavLink>
                )}
                <MobileNavLink href="/services">Services</MobileNavLink>
                {user.role === 'client' && (
                  <MobileNavLink href="/messages" isActive={isActiveRoute('/messages')}>
                    Messages
                    </MobileNavLink>
                )}
                
                {/* User info section */}
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="flex items-center px-3">
                    <ProfileAvatar className="h-10 w-10" />
                    <div className="ml-3">
                      <div className="text-base font-medium text-foreground">{user.email}</div>
                      <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <MobileNavLink href="/settings" icon={Settings}>
                      Settings
                    </MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-red-600 hover:bg-muted transition-colors duration-200"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink href="/login" isActive={isActiveRoute('/login')}>
                  Sign In
                </MobileNavLink>
                <MobileNavLink href="/register" isActive={isActiveRoute('/register')}>
                  Sign Up
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 