import { useEffect, useRef, useState } from 'react';

export default function StatCard({ icon: Icon, title, label, value, color = '#7c3aed' }) {
  const displayLabel = title || label;
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    if (numValue === 0) {
      setDisplayValue(0);
      return;
    }

    startTimeRef.current = null;
    const duration = 600;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setDisplayValue(Math.round(easedProgress * numValue));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}26` }}>
        {Icon && <Icon size={22} color={color} />}
      </div>
      <div className="stat-info">
        <span className="stat-value">{displayValue.toLocaleString()}</span>
        <span className="stat-label">{displayLabel}</span>
      </div>
    </div>
  );
}
