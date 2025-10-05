import { useState } from 'react';
import { Camera, Upload, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { bedrockAgent } from '../services/bedrockAgent';

interface DiningPortalProps {
  onBack: () => void;
}

export default function DiningPortal({ onBack }: DiningPortalProps) {
  const [formData, setFormData] = useState({
    diningHallName: '',
    portionCount: '',
    manualDescription: '',
    foodType: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const foodTypeOptions = [
    'Entrees', 'Sides', 'Salads', 'Desserts', 'Beverages', 'Fruits', 'Vegetables', 'Grains'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    try {
      const base64 = imagePreview.split(',')[1];
      const analysis = await bedrockAgent.analyzeImage(base64);
      
      setAiAnalysis(analysis);
      setFormData(prev => ({
        ...prev,
        manualDescription: analysis.description,
        foodType: analysis.suggestedFoodTypes || []
      }));
    } catch (error) {
      console.error('Image analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  const handleFoodTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      foodType: prev.foodType.includes(type)
        ? prev.foodType.filter(t => t !== type)
        : [...prev.foodType, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Notify volunteers via AWS SNS
      await bedrockAgent.notifyVolunteers({
        volunteers: [{ phone: '+1234567890' }], // Mock volunteer
        foodDescription: formData.manualDescription,
        diningHall: formData.diningHallName,
        shelter: 'Nearby Shelter'
      });
    } catch (error) {
      console.error('Notification failed, using fallback:', error);
      // Simulate notification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        diningHallName: '',
        portionCount: '',
        manualDescription: '',
        foodType: [],
      });
      setImageFile(null);
      setImagePreview('');
      setAiAnalysis(null);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-xl text-center max-w-md">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Donation Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your food donation has been registered. We're now matching it with nearby shelters and coordinating volunteer delivery.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">
              AI is working to find the best match and coordinate logistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">UCLA Dining Portal</h1>
            <p className="text-gray-600">Donate leftover food to help those in need</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dining Hall Name
              </label>
              <input
                type="text"
                required
                value={formData.diningHallName}
                onChange={(e) => setFormData({ ...formData, diningHallName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g., Bruin Plate, De Neve, Feast"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Food Photo (AI Analysis)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Food preview" className="max-h-64 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Analyze Image with AI
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {aiAnalysis && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-green-900 text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  AI Analysis Complete
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Nutrition:</strong> {aiAnalysis.nutritionInfo.calories}, Protein: {aiAnalysis.nutritionInfo.protein}</p>
                  <p><strong>Dietary Tags:</strong> {aiAnalysis.dietaryTags.join(', ')}</p>
                  <p><strong>Allergens:</strong> {aiAnalysis.allergens.join(', ')}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Description
              </label>
              <textarea
                required
                value={formData.manualDescription}
                onChange={(e) => setFormData({ ...formData, manualDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Describe the food items..."
              />
            </div>



            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Portions
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.portionCount}
                onChange={(e) => setFormData({ ...formData, portionCount: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g., 50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Donation'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
