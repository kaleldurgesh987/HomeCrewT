import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MessageSquare,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Negotiation = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinJob, leaveJob } = useSocket();

  const [job, setJob] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Counter proposal form
  const [counterAmount, setCounterAmount] = useState(400);
  const [counterNote, setCounterNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchJobAndOffers = async () => {
    try {
      setLoading(true);
      const [jobRes, offersRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/jobs/${jobId}/offers`),
      ]);

      if (jobRes.data.success) {
        setJob(jobRes.data.job);
        if (jobRes.data.job.initialBudget) {
          setCounterAmount(jobRes.data.job.initialBudget);
        }
      }
      if (offersRes.data.success) {
        setOffers(offersRes.data.offers);
        if (offersRes.data.offers.length > 0) {
          const latest = offersRes.data.offers[0];
          setCounterAmount(latest.amount);
        }
      }
    } catch (err) {
      console.error('Failed to load negotiation session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAndOffers();
    joinJob(jobId);

    if (socket) {
      socket.on('new-offer', (newOffer) => {
        setOffers((prev) => {
          const filtered = prev.filter((o) => o._id !== newOffer._id);
          return [newOffer, ...filtered];
        });
      });

      socket.on('offer-updated', (updatedOffer) => {
        setOffers((prev) =>
          prev.map((o) => (o._id === updatedOffer._id ? updatedOffer : o))
        );
      });

      socket.on('job-status-changed', (data) => {
        if (data.jobId === jobId) {
          setJob(data.job);
        }
      });
    }

    return () => {
      leaveJob(jobId);
      if (socket) {
        socket.off('new-offer');
        socket.off('offer-updated');
        socket.off('job-status-changed');
      }
    };
  }, [jobId, socket]);

  // Handle counter offer submission
  const handleSendCounter = async (e) => {
    e.preventDefault();
    if (!counterAmount || Number(counterAmount) <= 0) return;

    setSubmitting(true);
    try {
      const activeOffer = offers[0];

      if (activeOffer) {
        // Counter existing offer
        const res = await api.patch(`/offers/${activeOffer._id}`, {
          action: 'counter',
          counterAmount: Number(counterAmount),
          note: counterNote || 'Counter offer proposed',
        });
        if (res.data.success) {
          setCounterNote('');
        }
      } else {
        // Create initial offer for this job
        const res = await api.post(`/jobs/${jobId}/offers`, {
          amount: Number(counterAmount),
          note: counterNote || 'Initial proposal',
        });
        if (res.data.success) {
          setCounterNote('');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit counter offer');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle accept offer
  const handleAcceptOffer = async (offerId) => {
    try {
      const res = await api.patch(`/offers/${offerId}`, {
        action: 'accept',
        note: 'Offer accepted! Deal finalized.',
      });

      if (res.data.success) {
        // Confetti celebration animation!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0B5D43', '#F9B000', '#FAFBF8'],
        });
        fetchJobAndOffers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept offer');
    }
  };

  // Handle decline offer
  const handleDeclineOffer = async (offerId) => {
    try {
      await api.patch(`/offers/${offerId}`, {
        action: 'decline',
        note: 'Offer declined',
      });
      fetchJobAndOffers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline offer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Connecting to live negotiation room..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 text-center">
        <h2 className="text-xl font-heading font-bold text-gray-900">Job Not Found</h2>
        <Link to="/customer/dashboard" className="text-sm text-brand-green font-bold mt-2 inline-block">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const isJobAccepted = job.status !== 'requested';
  const primaryOffer = offers[0];

  return (
    <div className="min-h-screen bg-brand-cream py-8 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Back */}
        <Link
          to={user?.role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}
          className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-gray-600 hover:text-brand-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Job Header Summary */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-extrabold text-brand-green bg-brand-green-50 px-2.5 py-0.5 rounded-md">
                  {job.service}
                </span>
                <span className="text-xs text-gray-400">• Posted by {job.customer?.name}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mt-1">
                {job.title}
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">{job.address}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {isJobAccepted ? 'Final Agreed Price' : 'Customer Initial Budget'}
              </span>
              <div className="text-2xl font-heading font-extrabold text-brand-green">
                ₹{job.finalPrice || job.initialBudget}
              </div>
            </div>
          </div>

          {/* Locked Status Banner if Accepted */}
          {isJobAccepted && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-heading font-bold text-xs text-emerald-900">
                    Deal Finalized &amp; Price Locked: ₹{job.finalPrice}
                  </span>
                  <p className="text-[11px] text-emerald-700">
                    Both parties agreed. Pro worker is now assigned to this task.
                  </p>
                </div>
              </div>
              <Link
                to={`/tracking/${job._id}`}
                className="px-4 py-2 bg-brand-green hover:bg-brand-green-700 text-white rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Go to Live Tracking</span>
              </Link>
            </div>
          )}
        </div>

        {/* Live Offer Chat-Style Thread */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-green" />
              <h3 className="font-heading font-bold text-base text-gray-900">
                Live Price Negotiation Channel
              </h3>
            </div>
            <span className="text-xs text-brand-green font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Real-time Socket Connected
            </span>
          </div>

          {/* Offers List & History */}
          <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
            {offers.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                No active offer yet. Propose your rate below to begin negotiation.
              </div>
            ) : (
              offers.map((offer) => {
                const isMyOffer =
                  user?.role === 'worker'
                    ? offer.worker?.user?._id === user?._id || offer.worker?._id === user?._id
                    : offer.customer?._id === user?._id;

                return (
                  <div key={offer._id} className="space-y-3">
                    {/* Offer Summary Banner */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={offer.worker?.user?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=100&q=80'}
                          alt={offer.worker?.user?.name}
                          className="w-10 h-10 rounded-full object-cover border border-brand-green"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-bold text-xs text-gray-900">
                              {offer.worker?.user?.name || 'Pro Worker'}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                offer.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : offer.status === 'countered'
                                  ? 'bg-amber-100 text-amber-800'
                                  : offer.status === 'declined'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {offer.status.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Current Proposed Price:{' '}
                            <strong className="text-brand-green-900 font-extrabold text-sm">
                              ₹{offer.amount}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons (Accept / Decline) if not finalized */}
                      {!isJobAccepted && offer.status !== 'declined' && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleAcceptOffer(offer._id)}
                            className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accept ₹{offer.amount}</span>
                          </button>
                          <button
                            onClick={() => handleDeclineOffer(offer._id)}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-heading font-semibold transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Chronological negotiation history chat bubbles */}
                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      {offer.history?.map((h, hIdx) => {
                        const isWorker = h.by === 'worker';
                        return (
                          <div
                            key={hIdx}
                            className={`p-3 rounded-2xl max-w-md text-xs space-y-1 ${
                              isWorker
                                ? 'bg-brand-green-50 text-brand-green-900 border border-brand-green-100 ml-auto'
                                : 'bg-brand-gold-50 text-brand-gold-900 border border-brand-gold-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold opacity-75">
                              <span>{isWorker ? '👷 Pro Worker' : '👤 Customer'}</span>
                              <span>{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="font-semibold text-sm">
                              Proposed: <span className="font-extrabold">₹{h.amount}</span>
                            </p>
                            {h.note && <p className="text-[11px] opacity-90">{h.note}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Negotiation Input Box (only if not yet finalized) */}
          {!isJobAccepted ? (
            <form onSubmit={handleSendCounter} className="mt-8 pt-6 border-t border-gray-100 space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Propose Your Rate
                </label>
                {/* Quick preset chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[250, 300, 350, 400, 450, 500, 600].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCounterAmount(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        counterAmount === preset
                          ? 'bg-brand-green text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      step={25}
                      min={100}
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-brand-green focus:outline-none focus:border-brand-green"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={counterNote}
                      onChange={(e) => setCounterNote(e.target.value)}
                      placeholder="Add an optional negotiation note..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Submitting...' : 'Send Counter Offer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500 font-medium">
              Negotiation closed. The agreed price of <strong>₹{job.finalPrice}</strong> is locked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Negotiation;
