import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Briefcase,
  Award,
  Phone,
  MessageSquare,
  ArrowLeft,
  X,
  CheckCircle2,
} from 'lucide-react';
import api from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [proposedRate, setProposedRate] = useState(350);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/workers/${id}`);
        if (res.data.success) {
          setWorker(res.data.worker);
          setReviews(res.data.reviews || []);
          setProposedRate(res.data.worker.hourlyRate);
          setJobTitle(`Request for ${res.data.worker.skills?.[0] || 'Work'}`);
        }
      } catch (err) {
        console.error('Failed to load worker profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const jobRes = await api.post('/jobs', {
        service: worker.skills?.[0] || 'Service',
        title: jobTitle,
        description: jobDesc,
        initialBudget: Number(proposedRate),
        workerId: worker._id,
        isUrgent: true,
      });

      if (jobRes.data.success) {
        const jobId = jobRes.data.job._id;
        await api.post(`/jobs/${jobId}/offers`, {
          workerId: worker._id,
          amount: Number(proposedRate),
          note: `Customer direct booking offer at ₹${proposedRate}`,
        });
        setIsModalOpen(false);
        navigate(`/negotiation/${jobId}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading pro profile..." />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 text-center">
        <h2 className="text-xl font-heading font-bold text-gray-900">Worker Profile Not Found</h2>
        <Link to="/find-workers" className="text-sm text-brand-green font-bold mt-3 inline-block">
          &larr; Back to Worker Search
        </Link>
      </div>
    );
  }

  const isVerified = worker.verificationStatus === 'verified';

  return (
    <div className="min-h-screen bg-brand-cream py-10 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/find-workers"
          className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-gray-600 hover:text-brand-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pro Listings</span>
        </Link>

        {/* Profile Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-soft mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={worker.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={worker.user?.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-brand-green-100 shadow-sm"
                />
                <span
                  className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                    worker.availability ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                  title={worker.availability ? 'Online' : 'Busy'}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900">
                    {worker.user?.name}
                  </h1>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green bg-brand-green-50 px-2.5 py-0.5 rounded-full border border-brand-green-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                      Government ID Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{worker.user?.address || 'Mumbai, Maharashtra'}</span>
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {worker.avgRating} ({worker.totalReviews} reviews)
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs font-semibold text-gray-600">
                    {worker.completedJobsCount || 120}+ Jobs Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Hourly Rate & Quick Action */}
            <div className="sm:text-right w-full sm:w-auto p-4 sm:p-0 bg-gray-50 sm:bg-transparent rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Hourly Base Rate
              </span>
              <div className="text-3xl font-heading font-extrabold text-brand-green-900">
                ₹{worker.hourlyRate}
                <span className="text-xs font-medium text-gray-500">/hr</span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 w-full sm:w-auto px-6 py-3 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-brand-gold text-brand-gold" />
                <span>Book / Make an Offer</span>
              </button>
            </div>
          </div>

          {/* Bio & Skills */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">
                Professional Bio &amp; Experience
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {worker.bio}
              </p>

              <div>
                <h4 className="text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Specialized Skills &amp; Equipment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {worker.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold bg-brand-green-50 text-brand-green-800 border border-brand-green-200 px-3 py-1 rounded-lg"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="bg-brand-cream/80 rounded-2xl p-5 border border-gray-100 space-y-3.5 text-xs text-gray-700">
              <h4 className="font-heading font-bold text-xs text-gray-900 uppercase tracking-wider">
                Service Reliability
              </h4>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Average ETA:</span>
                <span className="font-bold text-amber-600">{worker.etaFormatted || '18 min'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Experience:</span>
                <span className="font-bold">{worker.experienceYears || 5} Years</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Availability:</span>
                <span className="font-bold text-emerald-600">
                  {worker.availability ? 'Online Now' : 'Busy'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Commission Cut:</span>
                <span className="font-bold text-brand-green">0% (Worker gets 100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-heading font-bold text-lg text-gray-900">
                Verified Customer Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-gray-500">Honest feedback from completed home visits</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-extrabold text-amber-600">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {worker.avgRating} / 5.0
            </span>
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-8">
              No reviews yet for this professional. Be the first to book!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.customer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                        alt={rev.customer?.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <h5 className="font-heading font-bold text-xs text-gray-900">
                          {rev.customer?.name || 'Homeowner'}
                        </h5>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-semibold bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded-md"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Book / Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-heading font-bold text-gray-900 text-sm">
                Book {worker.user?.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase mb-1">
                  Task Summary
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
                  Task Details
                </label>
                <textarea
                  rows={2}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Describe your issue or repair required..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase mb-1">
                  Your Proposed Offer (₹)
                </label>
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

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-2.5 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  {submitting ? 'Sending Request...' : 'Send Direct Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;
