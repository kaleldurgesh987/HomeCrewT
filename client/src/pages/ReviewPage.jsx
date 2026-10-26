import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ReviewPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Punctual', 'Skilled', 'Fair Price']);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    'Punctual',
    'Skilled',
    'Fair Price',
    'Polite',
    'Clean Work',
    'Safety First',
    'Fast Response',
    'Honest Advice',
  ];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${jobId}`);
        if (res.data.success) {
          setJob(res.data.job);
        }
      } catch (err) {
        console.error('Failed to load completed job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please share a brief comment about your experience.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        jobId,
        workerId: job?.worker?._id,
        rating,
        comment,
        tags: selectedTags,
      });

      if (res.data.success) {
        setSubmitted(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#0B5D43', '#F9B000', '#FAFBF8'],
        });
        setTimeout(() => {
          navigate('/customer/dashboard');
        }, 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading review form..." />
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

  return (
    <div className="min-h-screen bg-brand-cream py-12 select-none">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-gray-600 hover:text-brand-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-soft">
          {!submitted ? (
            <div>
              <div className="text-center pb-6 border-b border-gray-100 mb-6">
                <span className="text-xs font-heading font-extrabold text-brand-green uppercase tracking-wider bg-brand-green-50 px-3 py-1 rounded-full border border-brand-green-200">
                  Job Completed Successfully
                </span>
                <h1 className="text-2xl font-heading font-extrabold text-gray-900 mt-3">
                  How was your experience?
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Your review directly helps local blue-collar workers build community trust and earn fair livelihoods.
                </p>
              </div>

              {/* Worker Card summary */}
              {job.worker && (
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-brand-cream/80 border border-gray-100 mb-6">
                  <img
                    src={job.worker.user?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80'}
                    alt={job.worker.user?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-green"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-gray-900">
                      {job.worker.user?.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {job.service} • Final Settle Price: <strong>₹{job.finalPrice || job.initialBudget}</strong>
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* 5-Star Rating Selector */}
                <div className="text-center">
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-9 h-9 ${
                            (hoverRating || rating) >= star
                              ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600 mt-1 block">
                    {rating === 5 ? 'Exceptional Work! 🌟' : rating === 4 ? 'Great Service' : 'Satisfactory'}
                  </span>
                </div>

                {/* Quick Tag Pills */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Highlight Worker Qualities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-brand-green text-white shadow-xs'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Written Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell other homeowners about punctuality, problem-solving skills, and fair behavior..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  <span>{submitting ? 'Submitting Review...' : 'Submit Review & Thank Pro'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading font-extrabold text-gray-900">
                Thank You for Empowering Local Talent!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Your rating and review has been added to the worker's verified profile. Redirecting to your dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
