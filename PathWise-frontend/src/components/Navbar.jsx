import React from 'react';

const Navbar = () => {
  return (
    <div className="w-full px-6 py-4 relative" style={{ background: '#101727' }}>
      {/* Green elliptical blur effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '10%',
          width: '300px',
          height: '150px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.3,
          zIndex: 1
        }}
      />
      
      <nav
        className="flex items-center justify-between px-12 py-4 relative overflow-hidden w-full max-w-[95%] mx-auto mt-8"
        style={{
          background: 'rgba(19, 21, 27, 0.03)',
          backdropFilter: 'blur(7.4px)',
          borderRadius: '17px',
          zIndex: 10
        }}
      >
        {/* Gradient border */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            borderRadius: '17px',
            padding: '1px',
            background: 'linear-gradient(to bottom, #aaa 0%, #019438 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude'
          }}
        />

        <div className="text-green-400 font-bold text-xl relative z-10">
          PathWise AI
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 relative z-10">
          <a href="#resources" className="text-white hover:text-green-400 transition-colors duration-200 cursor-pointer">
            Resources
          </a>
          <a href="#contact" className="text-white hover:text-green-400 transition-colors duration-200 cursor-pointer">
            Contact Us
          </a>
          <a href="#about" className="text-white hover:text-green-400 transition-colors duration-200 cursor-pointer">
            About Us
          </a>
        </div>

        <div className="flex items-center relative z-10">
          <a href="/select-path" className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all duration-200 font-medium">
            Launch
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;