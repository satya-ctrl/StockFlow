import React from 'react';

const PremiumBackground = () => {
  return (
    <>
      <div className="fixed inset-0 z-[-3] bg-[#000000] overflow-hidden pointer-events-none">
        <img 
          src="/mansion-background.png" 
          alt="Mansion Background" 
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns opacity-70"
        />
      </div>
      
      {/* Light frosted glass and dark gradient overlay for crisp text contrast */}
      <div className="fixed inset-0 z-[-2] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none mix-blend-multiply" />
      <div className="fixed inset-0 z-[-1] bg-black/60 backdrop-blur-[6px] pointer-events-none" />
    </>
  );
};

export default PremiumBackground;
