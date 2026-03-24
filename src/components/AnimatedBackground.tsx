import React from 'react';

const AnimatedBackground: React.FC = () => (
  <>
    <div className="bg-orbs">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
    <div className="noise-overlay" />
  </>
);

export default AnimatedBackground;
