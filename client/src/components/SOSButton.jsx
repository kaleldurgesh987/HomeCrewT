import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneCall, AlertTriangle, X, CheckCircle, Navigation } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export const SOSButton = ({ activeJobId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [alertDetails, setAlertDetails] = useState(null);
  const { triggerSosAlert } = useSocket();
  const { user } = useAuth();

  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio synthesis unavailable:', e);
    }
  };

  const handleTriggerSOS = () => {
    playAlarmSound();
    const coords = user?.location?.coordinates || [72.8295, 19.0596];

    const data = {
      jobId: activeJobId || 'EMERGENCY_DIRECT',
      userId: user?._id || 'guest',
      userName: user?.name || 'HomeCrew User',
      role: user?.role || 'customer',
      coordinates: coords,
      message: 'URGENT: Emergency SOS triggered from active HomeCrew session!',
      timestamp: new Date().toLocaleTimeString(),
    };

    triggerSosAlert(data);
    setAlertDetails(data);
    setAlertTriggered(true);
  };

  const handleReset = () => {
    setAlertTriggered(false);
    setAlertDetails(null);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating SOS Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-sm shadow-2xl hover:shadow-red-500/50 transition-all border-2 border-white/80"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="SOS Safety Alarm"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <ShieldAlert className="w-5 h-5 text-white" />
        <span>SOS Safety</span>
      </motion.button>

      {/* SOS Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-red-500"
            >
              {/* Header */}
              <div className="bg-red-600 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-700 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading">HomeCrew Safety SOS</h3>
                    <p className="text-xs text-red-100">24/7 Rapid Emergency Response</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {!alertTriggered ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-700">
                      Feeling unsafe or facing an immediate emergency? Tapping below instantly notifies
                      the <strong>HomeCrew Safety Squad</strong> and shares your real-time GPS location.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-left flex items-start gap-2.5">
                      <Navigation className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Live GPS Location:</span>
                        <p className="text-gray-600 mt-0.5">
                          {user?.address || 'Bandra West, Mumbai (19.0596° N, 72.8295° E)'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleTriggerSOS}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-heading font-extrabold text-base tracking-wide rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
                      >
                        <ShieldAlert className="w-6 h-6" />
                        TRIGGER EMERGENCY SOS NOW
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1 font-semibold text-gray-800">
                        <PhoneCall className="w-3.5 h-3.5 text-red-600" /> Police: 112
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-gray-800">
                        <PhoneCall className="w-3.5 h-3.5 text-red-600" /> Women Helpline: 1091
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-2">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <ShieldAlert className="w-10 h-10" />
                    </div>

                    <div>
                      <h4 className="text-xl font-heading font-bold text-red-700">
                        EMERGENCY ALERT DISPATCHED!
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Mock SOS alert sent to HomeCrew Safety Control Room and recorded on active socket channel.
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-left text-gray-700 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Alerted By:</span>
                        <span className="font-semibold">{alertDetails?.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time Sent:</span>
                        <span className="font-semibold">{alertDetails?.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="text-green-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> High Priority Alert Active
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Dismiss & Mark Safe
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
