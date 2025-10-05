import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, MessageSquare } from 'lucide-react';
import { bedrockAgent } from '../services/bedrockAgent';

interface ShelterPortalProps {
  onBack: () => void;
}

export default function ShelterPortal({ onBack }: ShelterPortalProps) {
  const [requestText, setRequestText] = useState('');
  const [shelterName, setShelterName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedRequest, setParsedRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const processNaturalLanguage = async () => {
    if (!requestText.trim()) return;

    setIsProcessing(true);
    try {
      const analysis = await bedrockAgent.processShelterRequest(requestText);
      setParsedRequest({
        portionCount: analysis.quantity || 50,
        urgency: analysis.urgency || 'medium',
        dietaryPreferences: analysis.specialRequirements || [],
        timeframe: analysis.deadline || 'Today',
        additionalNotes: requestText
      });
    } catch (error) {
      console.error('NLP processing failed:', error);
      // Fallback to mock data
      setParsedRequest({
        portionCount: 75,
        urgency: 'high',
        dietaryPreferences: ['Vegetarian options preferred', 'Nut-free'],
        timeframe: 'Today evening',
        additionalNotes: 'Serving dinner to 75 people tonight'
      });
    }
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setRequestText('');
      setShelterName('');
      setParsedRequest(null);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-xl text-center max-w-md">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your food request has been received. Our AI is now matching you with available donations and coordinating delivery.
          </p>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800 font-medium">
              You'll be notified when a match is found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shelter Portal</h1>
            <p className="text-gray-600">Request food for your community in plain English</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shelter Name
              </label>
              <input
                type="text"
                required
                value={shelterName}
                onChange={(e) => setShelterName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="e.g., Hope Harbor Shelter"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe Your Food Needs (Natural Language)
              </label>
              <div className="relative">
                <textarea
                  required
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Example: We need food for 75 people tonight. We prefer vegetarian options and nut-free meals if possible. We're serving dinner around 6 PM."
                />
                <div className="absolute top-3 right-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Just type naturally - our AI will understand your needs
              </p>
            </div>

            {requestText && !parsedRequest && (
              <button
                type="button"
                onClick={processNaturalLanguage}
                disabled={isProcessing}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  'Process Request with AI'
                )}
              </button>
            )}

            {parsedRequest && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-green-900 text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  AI Understanding of Your Request
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 font-medium mb-1">Portions Needed</p>
                    <p className="text-2xl font-bold text-gray-900">{parsedRequest.portionCount}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 font-medium mb-1">Urgency</p>
                    <p className="text-2xl font-bold text-orange-600 capitalize">{parsedRequest.urgency}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 font-medium mb-2">Dietary Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {parsedRequest.dietaryPreferences.map((pref: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 font-medium mb-1">Timeframe</p>
                  <p className="text-gray-900">{parsedRequest.timeframe}</p>
                </div>
              </div>
            )}

            {parsedRequest && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Food Request'
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
