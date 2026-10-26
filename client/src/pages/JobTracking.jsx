import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle,
  Navigation,
  Star,
  Zap,
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { LeafletMap } from '../components/LeafletMap';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SOSButton } from '../components/SOSButton';

export const JobTracking = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinJob, leaveJob, sendWorkerLocation } = useSocket();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated moving coordinates for worker
  const [workerCoords, setWorkerCoords] = useState([72.8310, 19.0610]); // [lng, lat]
  const [routeStep, setRouteStep] = useState(0);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${jobId}`);
      if (res.data.success) {
        setJob(res.data.job);
        if (res.data.job.worker?.currentLocation?.coordinates) {
          setWorkerCoords(res.data.job.worker.currentLocation.coordinates);
        }
      }
    } catch (err) {
      console.error('Failed to load tracking details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    joinJob(jobId);

    if (socket) {
      socket.on('job-status-changed', (data) => {
        if (data.jobId === jobId) {
          setJob(data.job);
        }
      });

      socket.on('worker-location', (locData) => {
        if (locData.coordinates) {
          setWorkerCoords(locData.coordinates);
        }
      });
    }

    return () => {
      leaveJob(jobId);
      if (socket) {
        socket.off('job-status-changed');
        socket.off('worker-location');
      }
    };
  }, [jobId, socket]);

  // Simulate mock live movement towards customer when status is "on_the_way"
  useEffect(() => {
    if (!job || job.status !== 'on_the_way') return;

    const customerCoords = job.location?.coordinates || [72.8295, 19.0596];
    const initialWorkerCoords = [72.8450, 19.0800]; // starting slightly northeast in Mumbai

    // Create 8 interpolation points between worker and customer
    const interval = setInterval(() => {
      setRouteStep((prev) => {
        const nextStep = prev + 1;
        const fraction = Math.min(1, nextStep / 10);

        const currentLng = initialWorkerCoords[0] + (customerCoords[0] - initialWorkerCoords[0]) * fraction;
        const currentLat = initialWorkerCoords[1] + (customerCoords[1] - initialWorkerCoords[1]) * fraction;

        const newPos = [currentLng, currentLat];
        setWorkerCoords(newPos);

        // Broadcast through socket
        sendWorkerLocation({
          jobId,
          workerId: job.worker?._id,
          coordinates: newPos,
        });

        if (fraction >= 1) {
          clearInterval(interval);
        }
        return nextStep;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [job?.status]);

  // Manual status advancement for hackathon demo evaluation
  const handleUpdateStatus = async (nextStatus) => {
    try {
      const res = await api.patch(`/jobs/${jobId}/status`, {
        status: nextStatus,
      });
      if (res.data.success) {
        setJob(res.data.job);
        if (nextStatus === 'completed') {
          navigate(`/review/${jobId}`);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Connecting to GPS live tracking..." />
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

  const timelineSteps = [
    { key: 'requested', label: 'Requested', desc: 'Broadcasted to nearby workers' },
    { key: 'accepted', label: 'Accepted', desc: 'Price finalized and confirmed' },
    { key: 'on_the_way', label: 'On The Way', desc: 'Worker traveling to location' },
    { key: 'in_progress', label: 'In Progress', desc: 'Task execution underway' },
    { key: 'completed', label: 'Completed', desc: 'Payment settled & reviewed' },
  ];

  const currentStepIndex = timelineSteps.findIndex((s) => s.key === job.status);
  const customerLocation = job.location?.coordinates || [72.8295, 19.0596];

  // Route Polyline between customer and worker
  const routePoints = [
    [customerLocation[1], customerLocation[0]],
    [workerCoords[1], workerCoords[0]],
  ];

  return (
    <div className="min-h-screen bg-brand-cream py-8 relative select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Back */}
        <Link
          to={user?.role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}
          className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-gray-600 hover:text-brand-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-extrabold text-brand-green bg-brand-green-50 px-2.5 py-0.5 rounded-md">
                {job.service}
              </span>
              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ⚡ 30-min Hyperlocal Service
              </span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mt-2">
              {job.title}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{job.address}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400">Locked Price</span>
              <p className="text-2xl font-heading font-extrabold text-brand-green-900">
                ₹{job.finalPrice || job.initialBudget}
              </p>
            </div>
            <Link
              to={`/negotiation/${job._id}`}
              className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-bold text-xs uppercase transition-colors"
            >
              Negotiation Thread
            </Link>
          </div>
        </div>

        {/* 5-Step Visual Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft mb-8">
          <h2 className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider mb-6">
            Real-Time Job Progression Timeline
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
            {timelineSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isCurrent
                      ? 'border-brand-green bg-brand-green-50/80 shadow-md ring-2 ring-brand-green/20'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/50 text-gray-800'
                      : 'border-gray-200 bg-gray-50/50 opacity-60 text-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-extrabold">0{idx + 1}</span>
                    {isPast ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-gray-900 mb-0.5">
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-tight">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demo Status Controller for hackathon judges to advance statuses */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-2xl">
            <span className="text-xs font-heading font-bold text-gray-600">
              Demo Status Switcher:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['accepted', 'on_the_way', 'in_progress', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-heading font-bold uppercase transition-all ${
                    job.status === st
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Set {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map & Worker Tracking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Live OpenStreetMap view */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-green" />
                <h3 className="font-heading font-bold text-base text-gray-900">
                  Live Dispatch GPS Map
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {job.status === 'on_the_way' ? 'Pro Worker Moving in Real-Time' : 'Live Pin Verified'}
              </span>
            </div>

            <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-gray-200">
              <LeafletMap
                height="100%"
                customerLocation={customerLocation}
                workers={
                  job.worker
                    ? [
                        {
                          ...job.worker,
                          currentLocation: { type: 'Point', coordinates: workerCoords },
                          isUnder30Min: true,
                        },
                      ]
                    : []
                }
                routePolyline={routePoints}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Customer: Blue Pin</span>
              <span>•</span>
              <span className="text-brand-green font-bold">Pro Technician: Green Badge</span>
              <span>•</span>
              <span className="text-gray-400">Average transit speed: ~25 km/h</span>
            </div>
          </div>

          {/* Assigned Worker Contact Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
              <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider block mb-3">
                Assigned Pro Partner
              </span>

              {job.worker ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={job.worker.user?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80'}
                      alt={job.worker.user?.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-brand-green"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-heading font-bold text-base text-gray-900">
                          {job.worker.user?.name || 'Assigned Worker'}
                        </h4>
                        <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                      </div>
                      <span className="text-xs text-gray-500">
                        {job.worker.skills?.join(' • ')}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{job.worker.avgRating || 4.8} / 5.0 Rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1.5 text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Status:</span>
                      <strong className="text-brand-green uppercase">{job.status}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service ETA:</span>
                      <strong className="text-amber-600">~12 - 18 minutes</strong>
                    </div>
                  </div>

                  {/* Direct Contact Button */}
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`tel:${job.worker.user?.phone || '9820099881'}`}
                      className="flex-1 py-2.5 bg-brand-green hover:bg-brand-green-700 text-white rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Worker</span>
                    </a>
                    <Link
                      to={`/negotiation/${job._id}`}
                      className="px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 rounded-xl text-xs font-heading font-bold flex items-center justify-center transition-colors"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-500">
                  Worker assignment pending confirmation.
                </div>
              )}
            </div>

            {/* Safety & SOS Quick Note */}
            <div className="bg-red-50 rounded-3xl p-5 border border-red-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-red-800 font-heading font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Protected by HomeCrew SOS</span>
              </div>
              <p className="text-red-700/90 leading-relaxed text-[11px]">
                Both worker and customer can trigger the floating red SOS button at any time during
                the visit for immediate police/support dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating SOS Safety Trigger Button */}
      <SOSButton activeJobId={jobId} />
    </div>
  );
};

export default JobTracking;
