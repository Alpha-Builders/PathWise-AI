import React from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';

const LandingPage = () => {
  return (
    <main style={{ background: '#0a1120', minHeight: '100vh' }}>
      <HeroSection />
      <HowItWorks />
    </main>
  );
};

export default LandingPage;