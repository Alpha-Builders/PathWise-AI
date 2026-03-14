import React from 'react';


const HeroSection = () => {
  return (
    <div className="bg-[#101727] flex flex-col items-center justify-center text-center w-full px-6 pb-10 relative overflow-hidden">
      {/* Multiple green elliptical blur effects */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          left: '15%',
          width: '400px',
          height: '200px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.25,
          zIndex: 1
        }}
      />
      
      <div
        className="absolute pointer-events-none"
        style={{
          top: '60%',
          right: '20%',
          width: '350px',
          height: '175px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.2,
          zIndex: 1
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%',
          left: '30%',
          width: '300px',
          height: '150px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.15,
          zIndex: 1
        }}
      />
      
      <h1 className="text-5xl  p-10 font-bold text-white mb-5 max-w-4xl leading-tight mt-10 relative z-10">
        Find Your Career Path<br />
        With Confidence
      </h1>

      <p className="text-xl text-gray-200 mb-10 max-w-2xl relative z-10">
        PathWise AI guides you to discover, plan, and succeed in the career you're meant for.
      </p>

      <button
        className="relative overflow-hidden font-semibold text-white transition-all duration-300 hover:transform hover:-translate-y-0.5 px-8 py-3 border rounded-lg hover:bg-green-700 mb-10 z-10"
        style={{
          background: '#0000003D',
          borderColor: 'linear-gradient(89.97deg, rgba(1, 111, 42, 0.62) 0.03%, rgba(0, 167, 62, 0.62) 71.71%)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = '0 5px 15px rgba(0, 100, 25, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = 'none';
        }}
      >
        <Link to="/select-path"><span className="relative z-10 ">
          Get Started
        </span></Link>
      </button>

      {/* PNG Image */}
      <div className="w-full overflow-hidden flex justify-center px-4 relative z-10">
        <img
          src="/images/journey.png"
          alt="Journey illustration"
          className="max-w-full h-auto object-contain"
          style={{
            width: '100%',
            display: 'block',
            marginBottom: 0
          }}
        />
      </div>
    </div>
  );
};

export default HeroSection;