import { Building2, Home, Users } from 'lucide-react';
import { UserType } from '../types';

interface HomePageProps {
  onSelectUserType: (type: UserType) => void;
}

export default function HomePage({ onSelectUserType }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Food Rescue Network
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting UCLA dining halls with shelters and volunteers to reduce food waste and serve our community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <button
            onClick={() => onSelectUserType('dining')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <Building2 className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                UCLA Dining
              </h2>
              <p className="text-gray-600">
                Donate leftover food and help reduce waste while feeding those in need
              </p>
            </div>
          </button>

          <button
            onClick={() => onSelectUserType('shelter')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-green-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                <Home className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Shelter
              </h2>
              <p className="text-gray-600">
                Request food portions for your community and receive timely deliveries
              </p>
            </div>
          </button>

          <button
            onClick={() => onSelectUserType('volunteer')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-orange-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                <Users className="w-10 h-10 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Volunteer
              </h2>
              <p className="text-gray-600">
                Deliver food from dining halls to shelters and make a difference
              </p>
            </div>
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Powered by AI-driven matching and coordination</span>
          </div>
        </div>
      </div>
    </div>
  );
}
