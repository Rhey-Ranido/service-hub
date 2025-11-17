import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { API_BASE_URL, SOCKET_URL } from '../config/api';
import { 
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  UserCheck,
  UserX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    providers: { total: 0, pending: 0, approved: 0, rejected: 0, suspended: 0 },
    users: { total: 0, clients: 0, providers: 0, admins: 0 },
    services: { total: 0, active: 0 },
    recentProviders: []
  });
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [adminFeedback, setAdminFeedback] = useState('');
  const [actionType, setActionType] = useState('');



  // Check if user is admin and redirect if not
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(savedUser);
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Load dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to load dashboard stats');
      }

      const statsData = await statsResponse.json();
      setStats(statsData);

      // Only load providers or users if we're on their respective tabs
      if (activeTab === 'providers') {
        await loadProviders();
      } else if (activeTab === 'users') {
        await loadUsers();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`${API_BASE_URL}/admin/providers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load providers');
      }

      const data = await response.json();
      setProviders(data.providers);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'providers') {
      loadProviders();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [currentPage, userCurrentPage, searchTerm, statusFilter, roleFilter, activeTab]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: userCurrentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(roleFilter !== 'all' && { role: roleFilter })
      });

      const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users);
      setUserTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserStatusUpdate = async (userId, newStatus) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user status');
      }

      // Reload users data
      await loadUsers();
      await loadDashboardData(); // Refresh stats
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserVerificationUpdate = async (userId, isVerified) => {
    try {
      setActionLoading(`verify-${userId}`);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/verification`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user verification status');
      }

      // Reload users data
      await loadUsers();
      await loadDashboardData(); // Refresh stats
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleProviderStatusUpdateFromUser = async (providerId, newStatus, reason = '', feedback = '') => {
    try {
      setActionLoading(`provider-${providerId}`);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/admin/providers/${providerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, reason, feedback })
      });

      if (!response.ok) {
        throw new Error('Failed to update provider status');
      }

      // Reload users data and dashboard stats
      await loadUsers();
      await loadDashboardData();
      setShowFeedbackModal(false);
      setSelectedProvider(null);
      setAdminFeedback('');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (providerId, newStatus, reason = '', feedback = '') => {
    try {
      setActionLoading(providerId);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/admin/providers/${providerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, reason, feedback })
      });

      if (!response.ok) {
        throw new Error('Failed to update provider status');
      }

      // Reload providers data and dashboard stats
      if (activeTab === 'providers') {
        await loadProviders();
      }
      await loadDashboardData(); // Refresh stats to update pending count
      setShowFeedbackModal(false);
      setSelectedProvider(null);
      setAdminFeedback('');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openFeedbackModal = (providerOrUser, type, providerId = null) => {
    setSelectedProvider(providerOrUser);
    setActionType(type);
    if (providerId) {
      setSelectedProvider({ ...providerOrUser, id: providerId });
    }
    setShowFeedbackModal(true);
  };

  const handleDeleteProvider = async (providerId) => {
    if (!window.confirm('Are you sure you want to delete this provider? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(providerId);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/admin/providers/${providerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete provider');
      }

      // Reload providers data
      await loadProviders();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      suspended: 'destructive'
    };

    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      suspended: AlertTriangle
    };

    const Icon = icons[status];
    const variant = variants[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getUserStatusBadge = (status) => {
    const variants = {
      active: 'default',
      suspended: 'destructive',
      banned: 'destructive'
    };

    const icons = {
      active: CheckCircle,
      suspended: AlertTriangle,
      banned: XCircle
    };

    const Icon = icons[status] || CheckCircle;
    const variant = variants[status] || 'default';

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage providers and monitor platform activity
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'providers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('providers')}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Providers
            {stats.providers.pending > 0 && (
              <Badge variant="destructive" className="ml-1">
                {stats.providers.pending}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Users
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.users.clients} clients, {stats.users.providers} providers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Providers</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.providers.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.services.active}</div>
                  <p className="text-xs text-muted-foreground">
                    Out of {stats.services.total} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Providers</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.providers.approved}</div>
                  <p className="text-xs text-muted-foreground">
                    Live on platform
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Providers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Provider Registrations
                  {stats.providers.pending > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {stats.providers.pending} Pending
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentProviders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No recent registrations</p>
                  ) : (
                    stats.recentProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{provider.name}</h4>
                            <p className="text-sm text-muted-foreground">{provider.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(provider.status)}
                          <span className="text-sm text-muted-foreground">
                            {formatDate(provider.createdAt)}
                          </span>
                          {provider.status === 'pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedProvider({ id: provider.id, name: provider.name, ...provider });
                                  setActionType('approve');
                                  setShowFeedbackModal(true);
                                }}
                                disabled={actionLoading === provider.id}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === provider.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedProvider({ id: provider.id, name: provider.name, ...provider });
                                  setActionType('reject');
                                  setShowFeedbackModal(true);
                                }}
                                disabled={actionLoading === provider.id}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === provider.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {stats.providers.pending > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('providers')}
                      className="w-full"
                    >
                      View All Providers ({stats.providers.pending} pending approval)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="all">All Roles</option>
                      <option value="client">Clients</option>
                      <option value="provider">Providers</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No users found</p>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              {user.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt={user.firstName || user.email} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                <Users className="h-6 w-6 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {user.firstName || user.lastName 
                                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                  : 'Anonymous'
                                }
                              </h4>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                                {user.isVerified ? (
                                  <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Unverified
                                  </Badge>
                                )}
                                {user.providerStatus && (
                                  <Badge variant="outline" className="text-xs">
                                    Provider: {user.providerStatus}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getUserStatusBadge(user.status)}
                            <span className="text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          {/* Verification Status Button */}
                          {!user.isVerified && user.role !== 'admin' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUserVerificationUpdate(user.id, true)}
                              disabled={actionLoading === `verify-${user.id}` || user.role === 'admin'}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                            >
                              {actionLoading === `verify-${user.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                              Verify User
                            </Button>
                          )}

                          {user.status === 'active' && (
                            <>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUserStatusUpdate(user.id, 'suspended')}
                                disabled={actionLoading === user.id || user.role === 'admin'}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4" />
                                )}
                                Suspend
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUserStatusUpdate(user.id, 'banned')}
                                disabled={actionLoading === user.id || user.role === 'admin'}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                Ban
                              </Button>
                            </>
                          )}

                          {(user.status === 'suspended' || user.status === 'banned') && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUserStatusUpdate(user.id, 'active')}
                              disabled={actionLoading === user.id || user.role === 'admin'}
                              className="flex items-center gap-1"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Activate
                            </Button>
                          )}

                          {/* Provider Status Management - Only show if user has a provider account with pending status */}
                          {user.providerId && user.providerStatus === 'pending' && (
                            <>
                              <div className="border-l border-border h-6 mx-2" />
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleProviderStatusUpdateFromUser(user.providerId, 'approved')}
                                disabled={actionLoading === `provider-${user.providerId}`}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === `provider-${user.providerId}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                Approve Provider
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openFeedbackModal(user, 'reject-provider', user.providerId)}
                                disabled={actionLoading === `provider-${user.providerId}`}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === `provider-${user.providerId}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                Reject Provider
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {userTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setUserCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={userCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {userCurrentPage} of {userTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setUserCurrentPage(prev => Math.min(userTotalPages, prev + 1))}
                      disabled={userCurrentPage === userTotalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Providers List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Provider Registrations
                    {statusFilter === 'all' && stats.providers.pending > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {stats.providers.pending} Pending Approval
                      </Badge>
                    )}
                  </CardTitle>
                  {statusFilter === 'all' && stats.providers.pending > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatusFilter('pending')}
                      className="flex items-center gap-1"
                    >
                      <Clock className="h-4 w-4" />
                      Show Pending Only
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No providers found</p>
                  ) : (
                    providers.map((provider) => (
                      <div 
                        key={provider.id} 
                        className={`border rounded-lg p-4 ${
                          provider.status === 'pending' 
                            ? 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/10' 
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{provider.name}</h4>
                                {provider.status === 'pending' && (
                                  <Badge variant="secondary" className="text-xs animate-pulse">
                                    New Registration
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{provider.user?.email}</p>
                              {provider.location && (
                                <p className="text-sm text-muted-foreground">{provider.location}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusBadge(provider.status)}
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(provider.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        {provider.bio && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{provider.bio}</p>
                        )}

                        {provider.categories && provider.categories.length > 0 && (
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {provider.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/provider/${provider.id}`)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>

                          {provider.status === 'pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => openFeedbackModal(provider, 'approve')}
                                disabled={actionLoading === provider.id}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              >
                                {actionLoading === provider.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                Approve Provider
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openFeedbackModal(provider, 'reject')}
                                disabled={actionLoading === provider.id}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === provider.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                Reject Provider
                              </Button>
                            </>
                          )}

                          {provider.status === 'approved' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusUpdate(provider.id, 'suspended')}
                              disabled={actionLoading === provider.id}
                              className="flex items-center gap-1"
                            >
                              {actionLoading === provider.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <AlertTriangle className="h-4 w-4" />
                              )}
                              Suspend
                            </Button>
                          )}

                          {(provider.status === 'suspended' || provider.status === 'rejected') && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusUpdate(provider.id, 'approved')}
                              disabled={actionLoading === provider.id}
                              className="flex items-center gap-1"
                            >
                              {actionLoading === provider.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Approve
                            </Button>
                          )}

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProvider(provider.id)}
                            disabled={actionLoading === provider.id}
                            className="flex items-center gap-1"
                          >
                            {actionLoading === provider.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {actionType === 'approve' && 'Approve Provider'}
                {(actionType === 'reject' || actionType === 'reject-provider') && 'Reject Provider'}
                {actionType === 'suspend' && 'Suspend Provider'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {(actionType === 'reject' || actionType === 'reject-provider') ? 
                  'Please provide a reason for rejecting this provider (optional):' :
                  'Would you like to provide feedback to this provider? (optional):'
                }
              </p>
              <Textarea
                value={adminFeedback}
                onChange={(e) => setAdminFeedback(e.target.value)}
                placeholder={
                  (actionType === 'reject' || actionType === 'reject-provider') ? 
                    'Reason for rejection...' :
                    'Provide feedback or instructions for the provider...'
                }
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const statusMap = {
                      'approve': 'approved',
                      'reject': 'rejected',
                      'reject-provider': 'rejected',
                      'suspend': 'suspended'
                    };
                    const providerId = selectedProvider.id || selectedProvider.providerId;
                    if (actionType === 'reject-provider') {
                      handleProviderStatusUpdateFromUser(providerId, statusMap[actionType], 
                        adminFeedback, ''
                      );
                    } else {
                      handleStatusUpdate(providerId, statusMap[actionType], 
                        (actionType === 'reject' || actionType === 'reject-provider') ? adminFeedback : '', 
                        (actionType !== 'reject' && actionType !== 'reject-provider') ? adminFeedback : ''
                      );
                    }
                  }}
                  disabled={actionLoading === selectedProvider.id || actionLoading === `provider-${selectedProvider.id || selectedProvider.providerId}`}
                  variant={(actionType === 'reject' || actionType === 'reject-provider') ? 'destructive' : 'default'}
                  className="flex-1"
                >
                  {(actionLoading === selectedProvider.id || actionLoading === `provider-${selectedProvider.id || selectedProvider.providerId}`) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    actionType === 'approve' ? 'Approve' :
                    (actionType === 'reject' || actionType === 'reject-provider') ? 'Reject' : 'Suspend'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedProvider(null);
                    setAdminFeedback('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 