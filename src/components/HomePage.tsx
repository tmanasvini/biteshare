import { Building2, Home, Users } from 'lucide-react';
import { UserType } from '../types';

interface HomePageProps {
  onSelectUserType: (type: UserType) => void;
}

export default function HomePage({ onSelectUserType }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-blue-100" style={{ fontFamily: 'Palatino, serif' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🐻</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent" style={{ fontFamily: 'Palatino, serif' }}>
                BruinBiteShare
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">


        {/* Main Action Cards */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Palatino, serif' }}>
            Choose Your Role
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <button
              onClick={() => onSelectUserType('dining')}
              className="bg-white rounded-3xl p-16 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-blue-400 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Palatino, serif' }}>
                  UCLA Dining
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Palatino, serif' }}>
                  Donate leftover food and help reduce waste while feeding those in need
                </p>
              </div>
            </button>

            <button
              onClick={() => onSelectUserType('shelter')}
              className="bg-white rounded-3xl p-16 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-green-400 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Home className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Palatino, serif' }}>
                  Shelter
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Palatino, serif' }}>
                  Request food portions for your community and receive timely deliveries
                </p>
              </div>
            </button>

            <button
              onClick={() => onSelectUserType('volunteer')}
              className="bg-white rounded-3xl p-16 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-purple-400 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Palatino, serif' }}>
                  Volunteer
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Palatino, serif' }}>
                  Deliver food from dining halls to shelters and make a difference
                </p>
              </div>
            </button>
          </div>
        </div>


      </div>

    </div>
  );
}