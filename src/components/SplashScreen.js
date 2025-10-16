import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onDone, minDuration = 1200 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDone) onDone();
    }, minDuration);
    return () => clearTimeout(timer);
  }, [minDuration, onDone]);

  if (!visible) return null;

  return (
    <div className="splash-root" role="status" aria-label="Loading">
      {/* Decorative ambient elements */}
      <div className="splash-ambient">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="rays">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="grid"></div>
      </div>

      {/* Brand */}
      <div className="brand">
        <img
          src="/images/text-logo-xi.png"
          alt="Alhilal XI"
          className="splash-logo"
        />
        <div className="splash-progress" aria-hidden="true">
          <div className="bar"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

