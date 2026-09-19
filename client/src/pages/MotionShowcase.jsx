import React from 'react';
import Hero3DMotion from '../components/Hero3DMotion';
import { Rotate3d } from 'lucide-react';

export const MotionShowcase = () => {
  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 72px)' }}>
      {/* 3D Motion Hero Engine Full Screen */}
      <Hero3DMotion />
    </div>
  );
};

export default MotionShowcase;
