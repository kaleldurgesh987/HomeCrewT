import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Filter,
  Map as MapIcon,
  List,
  ShieldCheck,
  Zap,
  Star,
  Search,
  SlidersHorizontal,
  RefreshCw,
  X,
} from 'lucide-react';
import api from '../utils/api';
import { WorkerCard } from '../components/WorkerCard';
import { LeafletMap } from '../components/LeafletMap';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export const FindWorkers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filters state
  const [service, setService] = useState(searchParams.get('service') || 'All');
  const [maxDistance, setMaxDistance] = useState(25);
  const [minRating, setMinRating] = useState('0');
  const [maxRate, setMaxRate] = useState(800);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'list' | 'map'
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Data state
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState([72.8295, 19.0596]); // [lng, lat] (Bandra West default)

  // Direct Booking Modal state
  const [bookModalWorker, setBookModalWorker] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [proposedRate, setProposedRate] = useState(350);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (service && service !== 'All') params.append('service', service);
      if (maxDistance) params.append('maxDistance', maxDistance);
      if (minRating && minRating !== '0') params.append('rating', minRating);
      if (maxRate) params.append('maxRate', maxRate);
      if (verifiedOnly) params.append('verified', 'true');
      if (availableOnly) params.append('available', 'true');

      // Use customer coordinates if present
      if (user?.location?.coordinates) {
        params.append('lng', user.location.coordinates[0]);
        params.append('lat', user.location.coordinates[1]);
      } else {
        params.append('lng', userLocation[0]);
        params.append('lat', userLocation[1]);
      }

      const res = await api.get(`/workers?${params.toString()}`);
      if (res.data.success) {
        setWorkers(res.data.workers);
        if (res.data.userLocation) {
          setUserLocation([res.data.userLocation.lng, res.data.userLocation.lat]);
        }
      }
    } catch (err) {
      console.error('Failed to load workers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [service, maxDistance, minRating, maxRate, verifiedOnly, availableOnly]);

  const handleBookClick = (worker) => {
    setBookModalWorker(worker);
    setProposedRate(worker.hourlyRate);
    setJobTitle(`Direct Request: ${worker.skills?.[0] || 'Service'}`);
    setJobDesc(`Need an urgent appointment. Please confirm arrival.`);
  };

  const handleConfirmDirectBooking = async (e) => {
    e.preventDefault();
    if (!bookModalWorker) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      // 1. Create Job with designated worker
      const jobRes = await api.post('/jobs', {
        service: bookModalWorker.skills?.[0] || 'Service',
        title: jobTitle,
        description: jobDesc,
        initialBudget: Number(proposedRate),
        workerId: bookModalWorker._id,
        isUrgent: true,
      });

      if (jobRes.data.success) {
        const jobId = jobRes.data.job._id;
        // 2. Submit initial offer
        await api.post(`/jobs/${jobId}/offers`, {
          workerId: bookModalWorker._id,
          amount: Number(proposedRate),
          note: `Customer direct request at ₹${proposedRate}`,
        });
        setBookModalWorker(null);
        navigate(`/negotiation/${jobId}`);
      }
    } catch (err) {
      console.error('Direct booking failed:', err);
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900">
              Verified Blue-Collar Pros
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Showing active technicians near Mumbai with verified credentials and dynamic ETA.
            </p>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-colors ${
                viewMode === 'split'
                  ? 'bg-brand-green text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-green text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-colors ${
                viewMode === 'map'
                  ? 'bg-brand-green text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map Only</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
            {/* Service Filter */}
            <div>
              <label className="block text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                Trade / Skill
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-brand-green"
              >
                <option value="All">All Trades</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Maid & Cook">Maid & Cook</option>
                <option value="Painter">Painter</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Pest Control">Pest Control</option>
              </select>
            </div>

            {/* Distance Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                <span>Radius</span>
                <span className="text-brand-green">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={35}
                step={5}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-brand-green cursor-pointer"
              />
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-brand-green"
              >
                <option value="0">Any Rating</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </select>
            </div>

            {/* Max Hourly Rate */}
            <div>
              <div className="flex justify-between text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                <span>Max Rate</span>
                <span className="text-brand-green">₹{maxRate}/hr</span>
              </div>
              <input
                type="range"
                min={200}
                max={1000}
                step={50}
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="w-full accent-brand-green cursor-pointer"
              />
            </div>

            {/* Verified Only Checkbox */}
            <div className="flex items-center pt-2 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-brand-green focus:ring-brand-green w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                  Verified Only
                </span>
              </label>
            </div>

            {/* Available Now Toggle */}
            <div className="flex items-center pt-2 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded text-brand-green focus:ring-brand-green w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available Now
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Content Views */}
        {loading ? (
          <LoadingSpinner size="lg" text="Finding nearby verified professionals..." />
        ) : (
          <div className="space-y-6">
            {/* Split View: List on Left, Sticky Map on Right */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
                    <span>{workers.length} professionals found near you</span>
                    <span className="text-amber-600 font-bold">⚡ Look for &lt; 30-min guarantee tag</span>
                  </div>

                  {workers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-heading font-bold text-gray-800">No workers match this filter</p>
                      <p className="text-xs text-gray-500 mt-1">Try expanding the radius slider or resetting trade filter.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {workers.map((worker) => (
                        <WorkerCard
                          key={worker._id}
                          worker={worker}
                          onBook={handleBookClick}
                          onViewProfile={(w) => navigate(`/worker/${w._id}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Sticky Map Pane */}
                <div className="hidden lg:block lg:col-span-5 sticky top-28 h-[640px]">
                  <LeafletMap
                    height="100%"
                    workers={workers}
                    customerLocation={userLocation}
                    onWorkerSelect={(worker) => setSelectedWorker(worker)}
                  />
                </div>
              </div>
            )}

            {/* List Only View */}
            {viewMode === 'list' && (
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-4 px-1">
                  {workers.length} verified pros matching criteria:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workers.map((worker) => (
                    <WorkerCard
                      key={worker._id}
                      worker={worker}
                      onBook={handleBookClick}
                      onViewProfile={(w) => navigate(`/worker/${w._id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Map Only View */}
            {viewMode === 'map' && (
              <div className="h-[680px] w-full">
                <LeafletMap
                  height="100%"
                  workers={workers}
                  customerLocation={userLocation}
                  onWorkerSelect={(worker) => handleBookClick(worker)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Direct Booking & Offer Proposal Modal */}
      {bookModalWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={bookModalWorker.user?.avatar}
                  alt={bookModalWorker.user?.name}
                  className="w-10 h-10 rounded-full object-cover border border-brand-green"
                />
                <div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm">
                    Book {bookModalWorker.user?.name}
                  </h3>
                  <span className="text-[11px] text-brand-green font-semibold">
                    {bookModalWorker.skills?.join(' • ')} • ETA: {bookModalWorker.etaFormatted}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setBookModalWorker(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDirectBooking} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase mb-1">
                  Task Details &amp; Instructions
                </label>
                <textarea
                  rows={2}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">
                    Your Proposed Rate
                  </label>
                  <span className="text-xs text-gray-500">
                    Worker standard: <strong>₹{bookModalWorker.hourlyRate}/hr</strong>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-500">₹</span>
                  <input
                    type="number"
                    step={25}
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-brand-green focus:outline-none focus:border-brand-green"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Submitting opens a live negotiation channel. Worker can accept or propose a counter-rate within minutes.
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setBookModalWorker(null)}
                  className="w-1/3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-2/3 py-2.5 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  {bookingLoading ? 'Initiating Offer...' : 'Send Direct Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindWorkers;
