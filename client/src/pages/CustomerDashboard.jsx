import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Briefcase,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Zap,
  MessageSquare,
  Navigation,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LeafletMap } from '../components/LeafletMap';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('post'); // 'post' | 'active' | 'past'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post Job form state
  const [service, setService] = useState('Plumber');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initialBudget, setInitialBudget] = useState(400);
  const [isUrgent, setIsUrgent] = useState(true);
  const [scheduledAt, setScheduledAt] = useState('');
  const [address, setAddress] = useState(user?.address || 'Flat 402, Sea Green Apts, Bandra West, Mumbai');
  const [coordinates, setCoordinates] = useState(user?.location?.coordinates || [72.8295, 19.0596]);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/my');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load user jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setFormMessage({ type: 'error', text: 'Please fill in job title and description.' });
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    try {
      const payload = {
        service,
        title,
        description,
        initialBudget: Number(initialBudget),
        isUrgent,
        scheduledAt: isUrgent ? new Date() : (scheduledAt ? new Date(scheduledAt) : new Date()),
        address,
        coordinates,
      };

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        setFormMessage({ type: 'success', text: 'Job posted! Local workers will start sending offers immediately.' });
        setTitle('');
        setDescription('');
        fetchJobs();
        setTimeout(() => {
          setActiveTab('active');
        }, 1200);
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: err.response?.data?.message || 'Failed to post job.' });
    } finally {
      setSubmitting(false);
    }
  };

  const activeJobs = jobs.filter((j) => ['requested', 'accepted', 'on_the_way', 'in_progress'].includes(j.status));
  const pastJobs = jobs.filter((j) => ['completed', 'cancelled'].includes(j.status));

  const getStatusBadge = (status) => {
    const map = {
      requested: { bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'Requested (Finding Workers)' },
      accepted: { bg: 'bg-blue-100 text-blue-800 border-blue-300', text: 'Accepted • Offer Finalized' },
      on_the_way: { bg: 'bg-indigo-100 text-indigo-800 border-indigo-300 animate-pulse', text: '⚡ Pro On The Way' },
      in_progress: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'In Progress' },
      completed: { bg: 'bg-green-100 text-green-800 border-green-300', text: 'Completed' },
      cancelled: { bg: 'bg-gray-100 text-gray-800 border-gray-300', text: 'Cancelled' },
    };
    const s = map[status] || map.requested;
    return (
      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${s.bg}`}>
        {s.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-extrabold text-brand-green bg-brand-green-50 px-2.5 py-1 rounded-full border border-brand-green-200">
                Customer Portal
              </span>
              <span className="text-xs text-gray-400">• Mumbai</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 mt-2">
              Welcome, {user?.name || 'Customer'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Post urgent tasks with 30-minute target connection or manage active bookings.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/find-workers"
              className="px-4 py-2.5 rounded-xl border border-brand-green-600 text-brand-green hover:bg-brand-green-50 text-xs font-heading font-bold transition-colors"
            >
              Browse Nearby Pros
            </Link>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('post')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-heading font-bold transition-all shrink-0 ${
              activeTab === 'post'
                ? 'bg-brand-green text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a New Job</span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-heading font-bold transition-all shrink-0 ${
              activeTab === 'active'
                ? 'bg-brand-green text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Active Jobs ({activeJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-heading font-bold transition-all shrink-0 ${
              activeTab === 'past'
                ? 'bg-brand-green text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Past Bookings ({pastJobs.length})</span>
          </button>
        </div>

        {/* TAB 1: Post a Job */}
        {activeTab === 'post' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">
                What assistance do you need?
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill the details below. Nearby verified pros will review and counter-offer within minutes.
              </p>

              {formMessage && (
                <div
                  className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    formMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {formMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{formMessage.text}</span>
                </div>
              )}

              <form onSubmit={handlePostJob} className="space-y-5">
                {/* Service Selector */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Service Category
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-green bg-white"
                  >
                    <option value="Plumber">Plumber (Leakages, Taps, Drainage)</option>
                    <option value="Electrician">Electrician (MCB, Wiring, Fixtures)</option>
                    <option value="Deep Cleaning">Deep Cleaning (Home, Kitchen, Bath)</option>
                    <option value="Maid & Cook">Maid & Cook (Wholesome Meals, Housekeeping)</option>
                    <option value="Painter">Painter (Wall Putty, Waterproofing)</option>
                    <option value="Carpenter">Carpenter (Furniture, Doors, Locks)</option>
                    <option value="Appliance Repair">Appliance Repair (AC, Fridge, Washing Machine)</option>
                    <option value="Pest Control">Pest Control (Termites, Bed Bugs)</option>
                  </select>
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Job Title / Short Summary
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Master bathroom tap dripping heavily"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Detailed Problem Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what is broken, what tools or replacement parts might be needed, and any floor details..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                    required
                  />
                </div>

                {/* Timing: Now (30-min urgent) vs Schedule */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    When do you need the Pro?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsUrgent(true)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        isUrgent
                          ? 'border-brand-gold bg-brand-gold-50/50 text-brand-green-900 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Zap className={`w-4 h-4 mt-0.5 ${isUrgent ? 'fill-brand-gold text-brand-gold' : 'text-gray-400'}`} />
                      <div>
                        <span className="block text-xs font-heading font-bold">Now (Urgent)</span>
                        <span className="text-[10px] text-gray-500">Connect within 30 minutes</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsUrgent(false)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        !isUrgent
                          ? 'border-brand-green bg-brand-green-50 text-brand-green-900 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Clock className="w-4 h-4 mt-0.5 text-brand-green" />
                      <div>
                        <span className="block text-xs font-heading font-bold">Schedule for Later</span>
                        <span className="text-[10px] text-gray-500">Pick preferred time slot</span>
                      </div>
                    </button>
                  </div>

                  {!isUrgent && (
                    <div className="mt-3">
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-brand-green"
                      />
                    </div>
                  )}
                </div>

                {/* Initial Budget Estimate */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Initial Proposed Budget (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      step={50}
                      min={100}
                      max={10000}
                      value={initialBudget}
                      onChange={(e) => setInitialBudget(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-brand-green focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    You can negotiate and adjust final amount live in the chat offer thread.
                  </span>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Service Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 402, Sea Green Apts, Bandra West, Mumbai"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  <span>{submitting ? 'Broadcasting Job...' : 'Broadcast Job to Nearby Pros'}</span>
                </button>
              </form>
            </div>

            {/* Map Pin Selector Side Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    <span>Confirm Pin on Map</span>
                  </h3>
                  <span className="text-[11px] text-gray-400">Click map to adjust</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Workers compute their ETA and arrival routes based on this map pin:
                </p>

                <div className="h-72 w-full rounded-2xl overflow-hidden border border-gray-200">
                  <LeafletMap
                    height="100%"
                    interactivePin={coordinates}
                    customerLocation={coordinates}
                    onLocationSelect={(coords) => setCoordinates(coords)}
                  />
                </div>

                <div className="mt-3 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-600 flex items-center justify-between">
                  <span>Coordinates:</span>
                  <span className="font-mono font-bold text-brand-green">
                    {coordinates[1].toFixed(4)}° N, {coordinates[0].toFixed(4)}° E
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Active Jobs */}
        {activeTab === 'active' && (
          <div>
            {loading ? (
              <LoadingSpinner text="Fetching active bookings..." />
            ) : activeJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-gray-800 text-base">No active jobs right now</h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  Ready to solve a home issue? Post a new request in seconds.
                </p>
                <button
                  onClick={() => setActiveTab('post')}
                  className="px-6 py-3 bg-brand-green text-white font-heading font-bold text-xs uppercase rounded-xl"
                >
                  Post a Job Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-xs font-heading font-extrabold text-brand-green-800 bg-brand-green-50 px-2.5 py-1 rounded-lg">
                          {job.service}
                        </span>
                        {getStatusBadge(job.status)}
                      </div>

                      <h3 className="font-heading font-bold text-base text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {job.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-gray-500 pb-4 border-b border-gray-100">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{job.address}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Posted {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {job.finalPrice ? 'Agreed Price' : 'Budget'}
                        </span>
                        <p className="text-base font-heading font-extrabold text-brand-green-900">
                          ₹{job.finalPrice || job.initialBudget}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Live Negotiation Thread Button */}
                        <Link
                          to={`/negotiation/${job._id}`}
                          className="px-3.5 py-2 rounded-xl bg-brand-gold-50 hover:bg-brand-gold-100 text-brand-green-900 border border-brand-gold-300 text-xs font-heading font-bold flex items-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-brand-gold-700" />
                          <span>Negotiation</span>
                        </Link>

                        {/* Live Tracking Button */}
                        <Link
                          to={`/tracking/${job._id}`}
                          className="px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-700 text-white text-xs font-heading font-bold flex items-center gap-1 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Live Track</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Past Bookings */}
        {activeTab === 'past' && (
          <div>
            {loading ? (
              <LoadingSpinner text="Fetching past history..." />
            ) : pastJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-gray-800 text-base">No completed jobs yet</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Once your tasks are marked completed by the pro worker, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-brand-green-800 bg-brand-green-50 px-2 py-0.5 rounded-md">
                          {job.service}
                        </span>
                        {getStatusBadge(job.status)}
                      </div>

                      <h3 className="font-heading font-bold text-base text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">{job.address}</p>

                      <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 text-xs">
                        <span className="text-gray-500">Paid to Pro:</span>
                        <span className="font-extrabold text-brand-green-900">
                          ₹{job.finalPrice || job.initialBudget}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(job.updatedAt).toLocaleDateString()}
                      </span>

                      {/* Review Button */}
                      <Link
                        to={`/review/${job._id}`}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-heading font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Rate &amp; Review</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
