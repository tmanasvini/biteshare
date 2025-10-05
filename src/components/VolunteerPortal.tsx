import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, Calendar, Clock, Car } from 'lucide-react';
import VolunteerMap from './VolunteerMap';

interface VolunteerPortalProps {
  onBack: () => void;
}

export default function VolunteerPortal({ onBack }: VolunteerPortalProps) {
  const [formData, setFormData] = useState({
    volunteerName: '',
    organization: '',
    phone: '',
    vehicleType: '',
    maxDistanceMiles: '10',
    maxDeliveriesPerWeek: '3',
  });
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [aiMatch, setAiMatch] = useState<any>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const vehicleTypes = ['Car', 'SUV', 'Van', 'Truck', 'Bicycle'];

  const toggleDay = (day: string) => {
    setAvailableDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      simulateMatch();
    }, 2000);
  };

  const simulateMatch = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockMatch = {
      donationLocation: 'Bruin Plate - UCLA',
      donationAddress: '330 De Neve Drive, Los Angeles, CA 90095',
      shelterName: 'Hope Harbor Shelter',
      shelterAddress: '1234 Main Street, Los Angeles, CA 90012',
      distance: '4.2 miles',
      estimatedTime: '15 minutes',
      foodDescription: 'Grilled chicken, roasted vegetables, and rice (50 portions)',
      pickupTime: 'Today, 7:00 PM',
      aiMessage: `Hi ${formData.volunteerName}! We have a perfect match for you.\n\nBruin Plate has 50 portions of nutritious food ready for pickup, and Hope Harbor Shelter urgently needs meals for their evening service. The shelter is only 4.2 miles away - well within your 10-mile preference!\n\nPickup: Bruin Plate at 7:00 PM\nDelivery: Hope Harbor Shelter by 7:30 PM\n\nThis delivery will help feed 50 people tonight. Your vehicle (${formData.vehicleType}) is perfect for this delivery.\n\nCan you help make this happen?`
    };

    setAiMatch(mockMatch);
    setShowMatch(true);
  };

  const handleAcceptMatch = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    setShowMatch(false);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        volunteerName: '',
        organization: '',
        phone: '',
        vehicleType: '',
        maxDistanceMiles: '10',
        maxDeliveriesPerWeek: '3',
      });
      setAvailableDays([]);
      setAiMatch(null);
    }, 100);
  };

  const handleDeclineMatch = () => {
    setShowMatch(false);
    setSubmitted(false);
    setAiMatch(null);
  };

  if (showMatch && aiMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Perfect Match Found!</h2>
              <p className="text-gray-600">AI has coordinated a delivery opportunity for you</p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI Coordinator Message
              </h3>
              <p className="text-blue-800 whitespace-pre-line leading-relaxed">{aiMatch.aiMessage}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Pickup Location
                </h4>
                <p className="font-semibold text-gray-900">{aiMatch.donationLocation}</p>
                <p className="text-sm text-gray-600 mt-1">{aiMatch.donationAddress}</p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-600">{aiMatch.pickupTime}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-600" />
                  Delivery Location
                </h4>
                <p className="font-semibold text-gray-900">{aiMatch.shelterName}</p>
                <p className="text-sm text-gray-600 mt-1">{aiMatch.shelterAddress}</p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">{aiMatch.distance} • {aiMatch.estimatedTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-green-900 mb-2">Food Details</h4>
              <p className="text-green-800">{aiMatch.foodDescription}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAcceptMatch}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Accept Delivery
                  </>
                )}
              </button>
              <button
                onClick={handleDeclineMatch}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && !showMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-xl text-center max-w-md">
          <Loader2 className="w-20 h-20 text-orange-500 mx-auto mb-6 animate-spin" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Finding Your Match...</h2>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing available donations and shelters to find the perfect delivery opportunity for you.
          </p>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-800 font-medium">
              Considering your availability, location, and preferences
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Volunteer Portal</h1>
            <p className="text-gray-600">Sign up to deliver food and make a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.volunteerName}
                  onChange={(e) => setFormData({ ...formData, volunteerName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organization (Optional)
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="e.g., Local Church, Community Group"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Available Days
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      availableDays.includes(day)
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Type
                </label>
                <select
                  required
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="">Select vehicle</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Distance (miles)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={formData.maxDistanceMiles}
                  onChange={(e) => setFormData({ ...formData, maxDistanceMiles: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Deliveries Per Week
              </label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={formData.maxDeliveriesPerWeek}
                onChange={(e) => setFormData({ ...formData, maxDeliveriesPerWeek: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || availableDays.length === 0}
              className="w-full py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Availability'
              )}
            </button>

            {availableDays.length === 0 && (
              <p className="text-sm text-red-600 text-center">
                Please select at least one available day
              </p>
            )}
          </form>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">Volunteer Network</h3>
            <VolunteerMap />
          </div>

          <div className="mt-8 bg-orange-50 rounded-lg p-6">
            <h3 className="font-bold text-orange-900 mb-3">What Happens Next?</h3>
            <ol className="space-y-2 text-sm text-orange-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>AI analyzes available donations and shelter requests in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>You receive personalized delivery opportunities matching your availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Accept deliveries that work for you with all details provided</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Make a difference in your community, one delivery at a time</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function Home({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
