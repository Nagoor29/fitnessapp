import React from 'react';
import Hero3DMotion from '../components/Hero3DMotion';
import { Sparkles, Shield, Cpu, Rotate3d, CheckCircle2 } from 'lucide-react';

export const MotionShowcase = () => {
  return (
    <div style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'rgba(0, 245, 155, 0.05)',
          border: '1px solid rgba(0, 245, 155, 0.2)',
          borderRadius: '1rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.35rem',
          }}
        >
          <Rotate3d size={16} />
          <span>Interactive 3D Motion Prototype</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>
          Real-Time 3D Holographic Parallax Demo
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
          Move your cursor across the card to tilt in true 3D space, watch the live biometric pulse,
          and click <strong>"Trigger Body Scan"</strong> to fire the holographic laser scanner.
        </p>
      </div>

      {/* 3D Motion Hero Engine */}
      <Hero3DMotion />
    </div>
  );
};

export default MotionShowcase;
