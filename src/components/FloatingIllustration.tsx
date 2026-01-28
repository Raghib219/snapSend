
import { useEffect, useRef } from 'react';

const FloatingIllustration = () => {
  const illustrationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={illustrationRef} className="relative w-full max-w-3xl mx-auto">
      <img 
        src="/landing/hero.png" 
        alt="Expense Management Illustration" 
        className="w-4/5  h-auto"
      />
      
      {/* Floating Elements */}
      <div className="absolute -top-10 -left-10 w-16 h-16 bg-gray-100 rounded-full animate-float opacity-80"></div>
      <div className="absolute top-2 -right-0 w-12 h-12 border-2 border-gray-300 rounded-md animate-float opacity-60" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute bottom-0 left-10 w-8 h-8 bg-gray-200 rounded-full animate-float opacity-70" style={{animationDelay: '1s'}}></div>
      <div className="absolute -bottom-10 right-20 w-20 h-10 border-2 border-gray-300 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default FloatingIllustration;
