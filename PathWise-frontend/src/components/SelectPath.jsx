import React, { useState } from 'react'
import { School, GraduationCap, Bell, User, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const SelectPath = () => {
  const [selectedPath, setSelectedPath] = useState(null);
    const navigate = useNavigate();

    const handleContinue = () => {
      if (!selectedPath) return;

      if (selectedPath === 'high-school') {
        navigate('/highschool-path');
        console.log('Navigating to course-selection for High School');
      } else if (selectedPath === 'college') {
        navigate('/course-selection');
        console.log('Navigating to course-selection for College');
     }
   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background blurs */}
      <div
        className="absolute pointer-events-none animate-pulse"
        style={{
          top: '-10%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(1,116,43,0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <div
        className="absolute pointer-events-none animate-pulse"
        style={{
          bottom: '-15%',
          right: '0%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
          animationDelay: '1s'
        }}
      />

      {/* Header */}
      <div className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex justify-between items-center px-8 py-5">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            PATHWISE AI
          </h1>
          <div className="flex gap-6 items-center">
            <button className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-300">
              <Bell className="w-6 h-6 text-gray-300 hover:text-green-400 transition-colors" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300">
              <User className="w-6 h-6 text-gray-300 hover:text-green-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 py-16 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
            Welcome to Pathwise AI
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Choose your academic level so we can guide you better and provide personalized recommendations.
          </p>
        </div>

        {/* Path Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* High School Card */}
          <button
            onClick={() => setSelectedPath('high-school')}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 transform hover:scale-105 ${
              selectedPath === 'high-school'
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500 shadow-2xl shadow-green-500/50'
                : 'bg-white/5 border-2 border-white/10 hover:border-green-500/50 backdrop-blur-sm'
            }`}
          >
            <div className="relative z-10">
              <div className={`inline-flex p-4 rounded-xl mb-6 transition-all duration-300 ${
                selectedPath === 'high-school' ? 'bg-green-500/20' : 'bg-white/10 group-hover:bg-green-500/10'
              }`}>
                <School className={`w-12 h-12 transition-colors duration-300 ${
                  selectedPath === 'high-school' ? 'text-green-400' : 'text-gray-300 group-hover:text-green-400'
                }`} />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-white">High School</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Perfect for students in grades 9-12 looking for guidance on college prep and career paths.
              </p>
            </div>
            {selectedPath === 'high-school' && (
              <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>

          {/* College Card */}
          <button
            onClick={() => setSelectedPath('college')}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 transform hover:scale-105 ${
              selectedPath === 'college'
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500 shadow-2xl shadow-green-500/50'
                : 'bg-white/5 border-2 border-white/10 hover:border-green-500/50 backdrop-blur-sm'
            }`}
          >
            <div className="relative z-10">
              <div className={`inline-flex p-4 rounded-xl mb-6 transition-all duration-300 ${
                selectedPath === 'college' ? 'bg-green-500/20' : 'bg-white/10 group-hover:bg-green-500/10'
              }`}>
                <GraduationCap className={`w-12 h-12 transition-colors duration-300 ${
                  selectedPath === 'college' ? 'text-green-400' : 'text-gray-300 group-hover:text-green-400'
                }`} />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-white">College</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ideal for undergraduate students seeking major selection and career development support.
              </p>
            </div>
            {selectedPath === 'college' && (
              <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedPath}
            className={`group flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-semibold transition-all duration-300 transform ${
              selectedPath
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 hover:scale-105'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
              selectedPath ? 'group-hover:translate-x-1' : ''
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPath;