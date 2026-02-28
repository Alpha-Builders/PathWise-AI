import React, { useEffect, useState } from 'react';

const HowItWorks = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('[data-testimonial]');
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      cards.forEach((card, index) => {
        const cardTop = card.offsetTop;
        const cardHeight = card.offsetHeight;
        const cardCenter = cardTop + cardHeight / 2;
        
        // Card becomes visible when it's 70% into the viewport
        if (cardCenter < scrollTop + windowHeight * 0.8 && cardCenter > scrollTop + windowHeight * 0.2) {
          setVisibleCards(prev => new Set([...prev, index]));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Martin Goutry",
      text: "PathWise AI made choosing a career less overwhelming. It gave me clarity and confidence to pursue a path that fits both my personality and skills",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      position: { top: '20px', left: '60px', rotate: '-5deg', zIndex: 4 }
    },
    {
      name: "Theo Champion", 
      text: "PathWise AI made choosing a career less overwhelming. It gave me clarity and confidence to pursue a path that fits both my personality and skills",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      position: { top: '160px', left: '20px', rotate: '3deg', zIndex: 3 }
    },
    {
      name: "Agnes Remi",
      text: "PathWise AI made choosing a career less overwhelming. It gave me clarity and confidence to pursue a path that fits both my personality and skills", 
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      position: { top: '60px', right: '40px', rotate: '7deg', zIndex: 5 }
    },
    {
      name: "Theo Champion",
      text: "PathWise AI made choosing a career less overwhelming. It gave me clarity and confidence to pursue a path that fits both my personality and skills",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", 
      position: { top: '200px', right: '80px', rotate: '-3deg', zIndex: 2 },
      isBackground: true
    },
    {
      name: "Theo Champion",
      text: "PathWise AI made choosing a career less overwhelming. It gave me clarity and confidence to pursue a path that fits both my personality and skills",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      position: { bottom: '20px', left: '50%', transform: 'translateX(-50%)', rotate: '2deg', zIndex: 6 }
    }
  ];

  return (
    <>
      {/* How It Works Section */}
      <div className="pt-0 pb-10 px-10 relative overflow-hidden" style={{ background: '#101727' }}>
        {/* Green elliptical blur effects for How It Works section */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '10%',
            left: '20%',
            width: '300px',
            height: '150px',
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
            top: '50%',
            right: '15%',
            width: '250px',
            height: '125px',
            background: '#01742B',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.15,
            zIndex: 1
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 mt-0">
            <h1 className="text-5xl font-semibold m-0 text-white">How It Works</h1>
          </div>

          <div className="flex gap-6 justify-center flex-nowrap">
            <div 
              className="rounded-3xl"
              style={{ 
                width: '447px',
                height: '267px',
                background: '#4E5852',
                border: '1px solid rgba(0, 167, 62, 0.3)'
              }}
            >
              <img 
                src="/images/box-1.jpg" 
                alt="Discover Paths Tailored to your interest" 
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>

            <div 
              className="rounded-3xl"
              style={{ 
                width: '447px',
                height: '267px',
                background: '#4E5852',
                border: '1px solid rgba(0, 167, 62, 0.3)'
              }}
            >
              <img 
                src="/images/box-2.jpg" 
                alt="Know what skills to learn and when" 
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>

            <div 
              className="rounded-3xl"
              style={{ 
                width: '447px',
                height: '267px',
                background: '#4E5852',
                border: '1px solid rgba(0, 167, 62, 0.3)'
              }}
            >
              <img 
                src="/images/box-3.jpg" 
                alt="See how close you are to your dream role" 
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-10 relative overflow-hidden" style={{ background: '#101727' }}>
        {/* Green elliptical blur effects for Testimonials section */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '15%',
            left: '10%',
            width: '350px',
            height: '175px',
            background: '#01742B',
            borderRadius: '50%',
            filter: 'blur(75px)',
            opacity: 0.25,
            zIndex: 1
          }}
        />
        
        <div
          className="absolute pointer-events-none"
          style={{
            top: '40%',
            right: '10%',
            width: '400px',
            height: '200px',
            background: '#01742B',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.2,
            zIndex: 1
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '20%',
            left: '25%',
            width: '300px',
            height: '150px',
            background: '#01742B',
            borderRadius: '50%',
            filter: 'blur(65px)',
            opacity: 0.18,
            zIndex: 1
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            top: '70%',
            right: '35%',
            width: '280px',
            height: '140px',
            background: '#01742B',
            borderRadius: '50%',
            filter: 'blur(55px)',
            opacity: 0.15,
            zIndex: 1
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl font-semibold text-white mb-16 text-center">
            Trusted by Students and Professionals
          </h2>
          
          {/* Layered Testimonial Cards */}
          <div className="relative mx-auto" style={{ height: '400px', maxWidth: '800px' }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                data-testimonial
                className={`absolute bg-white rounded-xl p-6 shadow-lg transition-all duration-700 ease-out cursor-pointer ${
                  visibleCards.has(index) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                } ${testimonial.isBackground ? 'opacity-60' : 'opacity-100'} hover:scale-105 hover:shadow-xl`}
                style={{
                  width: '280px',
                  ...testimonial.position,
                  transform: `rotate(${testimonial.position.rotate}) ${testimonial.position.transform || ''} ${
                    visibleCards.has(index) ? 'translateY(0px) scale(1)' : 'translateY(32px) scale(0.95)'
                  }`,
                  zIndex: testimonial.position.zIndex,
                  transitionDelay: `${index * 100 + 100}ms`
                }}
              >
                <div className="flex items-start mb-3">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div className={`font-bold ${testimonial.isBackground ? 'text-gray-600' : 'text-gray-800'}`}>
                    {testimonial.name}
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${
                  testimonial.isBackground ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <h3 className="text-3xl font-semibold text-white mb-4">
              Start Your Career With PathWise AI
            </h3>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Get personalized career guidance in minutes. Free to start, easy to use.
            </p>
            <a href="/auth">
            <button 
              className="px-8 py-4 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ background: '#00a73e' }}
            >
              Sign Up Now
            </button></a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;