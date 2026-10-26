import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import api from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('verification'); // 'verification' | 'users' | 'jobs'

  const [stats, setStats] = useState(null);
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, usersRes, jobsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/pending-workers?status=all'),
        api.get('/admin/users'),
        api.get('/admin/jobs'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (pendingRes.data.success) setPendingWorkers(pendingRes.data.workers);
      if (usersRes.data.success) setAllUsers(usersRes.data.users);
      if (jobsRes.data.success) setAllJobs(jobsRes.data.jobs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (workerId, newStatus) => {
    try {
      const res = await api.patch(`/admin/workers/${workerId}/verify`, {
        status: newStatus,
      });
      if (res.data.success) {
        setActionMessage({
          type: 'success',
          text: `Worker verification status updated to: ${newStatus.toUpperCase()}`,
        });
        fetchAdminData();
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Verification update failed',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin control console..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                HomeCrew Administrator Portal
              </span>
              <span className="text-xs text-gray-400">• Mumbai Region</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 mt-2">
              Platform Verification &amp; Oversight
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review blue-collar ID credentials, monitor live bookings, and inspect platform safety.
            </p>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-gray-400">
                Pending Verification
              </span>
              <p className="text-2xl font-heading font-extrabold text-amber-600 mt-1">
                {stats.pendingVerifications}
              </p>
              <span className="text-[10px] text-gray-500">Require document check</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-gray-400">
                Verified Pro Workers
              </span>
              <p className="text-2xl font-heading font-extrabold text-brand-green mt-1">
                {stats.verifiedWorkers}
              </p>
              <span className="text-[10px] text-gray-500">Active background cleared</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-gray-400">
                Total Registered Users
              </span>
              <p className="text-2xl font-heading font-extrabold text-gray-900 mt-1">
                {stats.totalUsers}
              </p>
              <span className="text-[10px] text-gray-500">
                {stats.totalCustomers} Customers • {stats.totalWorkers} Pros
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-gray-400">
                Completed Jobs
              </span>
              <p className="text-2xl font-heading font-extrabold text-brand-gold-700 mt-1">
                {stats.completedJobs}
              </p>
              <span className="text-[10px] text-gray-500">
                {stats.activeJobs} Active in transit
              </span>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-heading font-bold transition-all shrink-0 ${
              activeTab === 'verification'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Worker Verification Queue ({pendingWorkers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-heading font-bold transition-all shrink-0 ${
              activeTab === 'users'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Users ({allUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-heading font-bold transition-all shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>All Platform Jobs ({allJobs.length})</span>
          </button>
        </div>

        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* TAB 1: Verification Queue */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft overflow-x-auto">
            <h2 className="text-base font-heading font-bold text-gray-900 mb-4">
              Worker Document Verification Queue
            </h2>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-heading uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Worker / Name</th>
                  <th className="pb-3">Trade &amp; Rate</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">ID Document</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingWorkers.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50/70">
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={w.user?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=80&q=80'}
                          alt={w.user?.name}
                          className="w-9 h-9 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-heading font-bold text-gray-900">{w.user?.name}</p>
                          <p className="text-[11px] text-gray-500">{w.user?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-3">
                      <span className="font-semibold text-gray-800">{w.skills?.join(', ')}</span>
                      <p className="text-[11px] text-brand-green font-bold">₹{w.hourlyRate}/hr</p>
                    </td>
                    <td className="py-4 pr-3 text-gray-600 max-w-[140px] truncate">
                      {w.user?.address || 'Mumbai'}
                    </td>
                    <td className="py-4 pr-3">
                      {w.idDocUrl ? (
                        <a
                          href={w.idDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-brand-green hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Document</span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No document uploaded</span>
                      )}
                    </td>
                    <td className="py-4 pr-3">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                          w.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : w.verificationStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleVerify(w._id, 'verified')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(w._id, 'rejected')}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft overflow-x-auto">
            <h2 className="text-base font-heading font-bold text-gray-900 mb-4">
              Registered Platform Users
            </h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-heading uppercase text-[10px] tracking-wider">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Address</th>
                  <th className="pb-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/70">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{u.name}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'worker'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-gray-600 font-mono">{u.phone}</td>
                    <td className="py-3 pr-3 text-gray-600">{u.address}</td>
                    <td className="py-3 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Jobs */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft overflow-x-auto">
            <h2 className="text-base font-heading font-bold text-gray-900 mb-4">
              All Platform Jobs &amp; Bookings
            </h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-heading uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Job Details</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Assigned Pro</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Final Amount</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allJobs.map((j) => (
                  <tr key={j._id} className="hover:bg-gray-50/70">
                    <td className="py-3 pr-3">
                      <p className="font-bold text-gray-900">{j.title}</p>
                      <span className="text-[10px] text-brand-green font-semibold">{j.service}</span>
                    </td>
                    <td className="py-3 pr-3 text-gray-700">{j.customer?.name}</td>
                    <td className="py-3 pr-3 text-gray-700">
                      {j.worker?.user?.name || <span className="text-gray-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700">
                        {j.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-3 font-extrabold text-brand-green-900">
                      ₹{j.finalPrice || j.initialBudget}
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/tracking/${j._id}`}
                        className="text-brand-green font-bold hover:underline"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
