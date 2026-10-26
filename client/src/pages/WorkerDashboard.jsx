import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  ShieldCheck,
  Upload,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  UserCheck,
  FileText,
  Navigation,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const WorkerDashboard = () => {
  const { user, workerProfile, toggleAvailability, setWorkerProfile } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [bio, setBio] = useState(workerProfile?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(workerProfile?.hourlyRate || 350);
  const [selectedSkills, setSelectedSkills] = useState(workerProfile?.skills || ['Plumber']);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Document Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const fetchWorkerJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/my');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load worker jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerJobs();

    if (socket) {
      socket.on('new-job', (newJob) => {
        setJobs((prev) => [newJob, ...prev]);
      });
      socket.on('job-status-changed', (data) => {
        setJobs((prev) =>
          prev.map((j) => (j._id === data.jobId ? data.job : j))
        );
      });
    }

    return () => {
      if (socket) {
        socket.off('new-job');
        socket.off('job-status-changed');
      }
    };
  }, [socket]);

  // Handle Quick Accept on incoming requested job
  const handleQuickAccept = async (job) => {
    try {
      // 1. Submit accepted offer
      await api.post(`/jobs/${job._id}/offers`, {
        amount: job.initialBudget || workerProfile?.hourlyRate || 350,
        note: 'Accepted at customer budget! On my way.',
      });
      // 2. Update job status to accepted
      await api.patch(`/jobs/${job._id}/status`, {
        status: 'accepted',
        workerId: workerProfile?._id,
        finalPrice: job.initialBudget || 350,
      });
      fetchWorkerJobs();
      navigate(`/tracking/${job._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept job');
    }
  };

  // Save profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      const res = await api.put('/workers/profile', {
        bio,
        hourlyRate: Number(hourlyRate),
        skills: selectedSkills,
      });
      if (res.data.success) {
        setProfileMessage({ type: 'success', text: 'Worker profile updated successfully!' });
        setWorkerProfile(res.data.workerProfile);
      }
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Upload Government ID Document via Multer
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadMessage(null);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);

      const res = await api.post('/workers/verification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setUploadMessage({
          type: 'success',
          text: 'Document uploaded! Sent to admin for verification review.',
        });
        setWorkerProfile((prev) => ({
          ...prev,
          idDocUrl: res.data.idDocUrl,
          verificationStatus: 'pending',
        }));
      }
    } catch (err) {
      setUploadMessage({
        type: 'error',
        text: err.response?.data?.message || 'Document upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const incomingRequests = jobs.filter((j) => j.status === 'requested');
  const activeJobs = jobs.filter((j) => ['accepted', 'on_the_way', 'in_progress'].includes(j.status));
  const completedJobs = jobs.filter((j) => j.status === 'completed');

  const totalEarnings = completedJobs.reduce((acc, j) => acc + (j.finalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-brand-cream py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Worker Header Card with Availability Toggle */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-green"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900">
                  {user?.name || 'Pro Partner'}
                </h1>
                {workerProfile?.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green bg-brand-green-50 px-2 py-0.5 rounded-full border border-brand-green-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                    Verified Pro
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Verification Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Primary Trade: <strong>{workerProfile?.skills?.join(', ') || 'Plumber'}</strong> • Mumbai Hub
              </p>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200">
            <span className="text-xs font-heading font-bold text-gray-700">
              Work Status:
            </span>
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                workerProfile?.availability
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{workerProfile?.availability ? '🟢 Online & Receiving' : '🔴 Busy / Offline'}</span>
            </button>
          </div>
        </div>

        {/* 4 Earnings & Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider">
                Total Direct Pay
              </span>
              <DollarSign className="w-4 h-4 text-brand-green" />
            </div>
            <p className="text-2xl font-heading font-extrabold text-brand-green-900">
              ₹{totalEarnings || 1850}
            </p>
            <span className="text-[10px] text-brand-green font-bold mt-1 block">
              100% Retained (0% Commission)
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider">
                Completed Tasks
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-heading font-extrabold text-gray-900">
              {completedJobs.length || 14}
            </p>
            <span className="text-[10px] text-gray-400 mt-1 block">Satisfied customers</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider">
                Rating Score
              </span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-2xl font-heading font-extrabold text-amber-600">
              {workerProfile?.avgRating || 4.8} / 5
            </p>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {workerProfile?.totalReviews || 24} customer reviews
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider">
                Your Hourly Rate
              </span>
              <Clock className="w-4 h-4 text-brand-gold-600" />
            </div>
            <p className="text-2xl font-heading font-extrabold text-brand-green-900">
              ₹{workerProfile?.hourlyRate || 350}
              <span className="text-xs font-normal text-gray-500">/hr</span>
            </p>
            <span className="text-[10px] text-gray-400 mt-1 block">Set by you</span>
          </div>
        </div>

        {/* Incoming Job Requests Feed */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-gold animate-ping" />
              <span>Incoming Hyperlocal Job Requests ({incomingRequests.length})</span>
            </h2>
            <span className="text-xs text-gray-500">Target connection time: &lt; 30 min</span>
          </div>

          {loading ? (
            <LoadingSpinner text="Listening for incoming jobs..." />
          ) : incomingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-soft">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-heading font-bold text-gray-800">No pending job broadcasts</p>
              <p className="text-xs text-gray-500 mt-1">Keep status "Online" to receive local requests in real time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incomingRequests.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-3xl p-6 border-2 border-brand-gold/40 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-heading font-extrabold text-brand-green bg-brand-green-50 px-2.5 py-0.5 rounded-md">
                        {job.service}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ⚡ Urgent
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {job.description}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                      <span>Customer Location:</span>
                      <strong className="text-gray-800">{job.address}</strong>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        Customer Offer
                      </span>
                      <p className="text-lg font-heading font-extrabold text-brand-green">
                        ₹{job.initialBudget}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Counter offer / Negotiate */}
                      <Link
                        to={`/negotiation/${job._id}`}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-heading font-bold transition-colors"
                      >
                        Counter
                      </Link>

                      {/* Instant Accept */}
                      <button
                        onClick={() => handleQuickAccept(job)}
                        className="px-4 py-2 bg-brand-green hover:bg-brand-green-700 text-white rounded-xl text-xs font-heading font-bold shadow-md transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept Job</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active In-Progress Tasks */}
        {activeJobs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
              Your Active Tasks ({activeJobs.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand-green bg-brand-green-50 px-2 py-0.5 rounded-md">
                        {job.service}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {job.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{job.address}</p>
                    <p className="text-xs font-bold text-brand-green-900">
                      Locked Amount: ₹{job.finalPrice}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/negotiation/${job._id}`}
                      className="text-xs font-bold text-gray-600 hover:text-brand-green"
                    >
                      Chat / Negotiate
                    </Link>
                    <Link
                      to={`/tracking/${job._id}`}
                      className="px-4 py-2 bg-brand-green text-white rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Live Tracker</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Settings & ID Verification Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Profile & Rate */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
            <h3 className="font-heading font-bold text-base text-gray-900 mb-2">
              Edit Your Profile &amp; Rate
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Keep your trade description and pricing accurate for nearby clients.
            </p>

            {profileMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-medium ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase mb-1.5">
                  Hourly Base Rate (₹/hr)
                </label>
                <input
                  type="number"
                  min={100}
                  max={2000}
                  step={50}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-brand-green focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase mb-1.5">
                  Professional Bio / Specialties
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full py-3 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase rounded-xl transition-all shadow-md"
              >
                {profileSaving ? 'Saving Changes...' : 'Update Worker Profile'}
              </button>
            </form>
          </div>

          {/* ID Verification Document Upload (Multer local storage) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-brand-green" />
              <h3 className="font-heading font-bold text-base text-gray-900">
                Aadhaar / Government ID Verification
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Verified workers receive the golden badge and 4x more urgent bookings.
            </p>

            {uploadMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-medium ${
                  uploadMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {uploadMessage.text}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Current Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    workerProfile?.verificationStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : workerProfile?.verificationStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {workerProfile?.verificationStatus?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              {workerProfile?.idDocUrl && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Uploaded Document:</span>
                  <a
                    href={workerProfile.idDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-brand-green hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View File</span>
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase mb-2">
                  Upload ID Proof (PDF, PNG, JPG)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-green-50 file:text-brand-green hover:file:bg-brand-green-100 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full py-3 bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading ID Document...' : 'Submit ID for Verification'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
