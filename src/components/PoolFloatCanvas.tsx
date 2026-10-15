'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CapybaraSvg } from './CapybaraSvg';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { Compass, Sparkles, Smartphone } from 'lucide-react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface SplashParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface PoolFloatCanvasProps {
  onSplashTriggered?: (type: string) => void;
  dailyProgressPct: number;
  isExpanded?: boolean;
}

export const PoolFloatCanvas: React.FC<PoolFloatCanvasProps> = ({
  dailyProgressPct,
  isExpanded = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sensor and orientation hook
  const {
    orientation,
    requestPermission,
    effectiveTiltX,
    effectiveTiltY,
    handlePointerMove,
    handlePointerLeave,
    isPointerActive,
  } = useDeviceOrientation();

  // Float Position and Physics State in Ref for 60fps loop
  const physicsRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0, // degrees
    targetRotation: 0,
    initialized: false,
    width: 360,
    height: 380,
    pointerTarget: null as { x: number; y: number } | null,
  });

  const [floatDisplay, setFloatDisplay] = useState({
    x: 0,
    y: 0,
    rotation: 0,
  });

  const ripplesRef = useRef<Ripple[]>([]);
  const splashParticlesRef = useRef<SplashParticle[]>([]);
  const rippleIdCounter = useRef(0);
  const lastSpawnTime = useRef(0);

  // Initialize center position once container is measured
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      physicsRef.current.width = rect.width;
      physicsRef.current.height = rect.height;

      if (!physicsRef.current.initialized) {
        physicsRef.current.x = rect.width / 2;
        physicsRef.current.y = rect.height / 2;
        physicsRef.current.initialized = true;
        setFloatDisplay({
          x: rect.width / 2,
          y: rect.height / 2,
          rotation: 0,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Main 60FPS Physics and Particle Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const loop = (timestamp: number) => {
      const p = physicsRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      // 1. Calculate Acceleration Vector
      let ax = 0;
      let ay = 0;

      if (p.pointerTarget) {
        // Attract towards touch / mouse point (as in Jason's prompt)
        const dx = p.pointerTarget.x - p.x;
        const dy = p.pointerTarget.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
          const force = Math.min(1.2, dist * 0.008);
          ax = (dx / dist) * force;
          ay = (dy / dist) * force;
        }
      } else {
        // Driven by Tilt / Accelerometer
        // Multiply tilt intensity to create smooth acceleration
        ax = effectiveTiltX * 0.85;
        ay = effectiveTiltY * 0.85;
      }

      // 2. Numerical Integration with Water Resistance (Damping)
      p.vx = (p.vx + ax) * 0.93; // 7% drag each frame gives natural liquid drift
      p.vy = (p.vy + ay) * 0.93;

      // Clamp max velocity
      const maxSpeed = 7.5;
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      // 3. Update Position
      p.x += p.vx;
      p.y += p.vy;

      // 4. Soft Wall Bounding & Elastic Bounce
      const floatRadius = 55;
      const minX = floatRadius;
      const maxX = p.width - floatRadius;
      const minY = floatRadius;
      const maxY = p.height - floatRadius;

      if (p.x < minX) {
        p.x = minX;
        p.vx = -p.vx * 0.4;
      } else if (p.x > maxX) {
        p.x = maxX;
        p.vx = -p.vx * 0.4;
      }

      if (p.y < minY) {
        p.y = minY;
        p.vy = -p.vy * 0.4;
      } else if (p.y > maxY) {
        p.y = maxY;
        p.vy = -p.vy * 0.4;
      }

      // 5. Boat-like Leaning Rotation:
      // "As it moves it leans left or right a little, like a boat turning, up to about 30 degrees.
      // It never spins or turns upside down. It rotates around the centre of the float."
      const targetRoll = Math.max(-28, Math.min(28, p.vx * 5.5));
      p.rotation += (targetRoll - p.rotation) * 0.12;

      // 6. Spawn Water Ripples when moving
      // "Ripples only appear while the character is moving. None when it's still.
      // Faster movement means more and stronger ripples, dropped just behind it."
      if (speed > 0.4 && timestamp - lastSpawnTime.current > Math.max(70, 240 - speed * 30)) {
        lastSpawnTime.current = timestamp;
        // Spawn slightly behind velocity vector
        const offsetDist = 20;
        const normVx = p.vx / speed;
        const normVy = p.vy / speed;
        const spawnX = p.x - normVx * offsetDist;
        const spawnY = p.y - normVy * offsetDist + 15; // float center offset

        ripplesRef.current.push({
          id: rippleIdCounter.current++,
          x: spawnX,
          y: spawnY,
          radius: 12 + speed * 2,
          maxRadius: 55 + speed * 12,
          opacity: Math.min(0.7, 0.25 + speed * 0.08),
          speed: 0.8 + speed * 0.25,
        });
      }

      // 7. Render Ripples & Particles onto Canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw ripples
        ripplesRef.current = ripplesRef.current.filter((r) => r.opacity > 0.02);
        for (const ripple of ripplesRef.current) {
          ripple.radius += ripple.speed;
          // Spreads fast then slows
          ripple.speed *= 0.98;
          ripple.opacity *= 0.955;

          // Outer bright thin ring
          ctx.beginPath();
          ctx.ellipse(ripple.x, ripple.y, ripple.radius, ripple.radius * 0.55, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.9})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Inner darker shadow refraction band
          ctx.beginPath();
          ctx.ellipse(ripple.x, ripple.y, Math.max(0, ripple.radius - 3), Math.max(0, (ripple.radius - 3) * 0.55), 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(2, 132, 199, ${ripple.opacity * 0.4})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Update and draw splash particles
        splashParticlesRef.current = splashParticlesRef.current.filter((sp) => sp.alpha > 0.02);
        for (const sp of splashParticlesRef.current) {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.18; // gravity
          sp.alpha *= 0.95;

          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = sp.color.replace(')', `, ${sp.alpha})`).replace('rgb', 'rgba');
          ctx.fill();
        }
      }

      // Update state for DOM SVG element
      setFloatDisplay({
        x: p.x,
        y: p.y,
        rotation: p.rotation,
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [effectiveTiltX, effectiveTiltY]);

  // Touch and pointer interactions for water attraction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    physicsRef.current.pointerTarget = { x, y };

    // Trigger mini splash on tap
    spawnSplash(x, y, '#BAE6FD');
  };

  const handlePointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerMove(e);
    if (physicsRef.current.pointerTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      physicsRef.current.pointerTarget = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handlePointerUp = () => {
    physicsRef.current.pointerTarget = null;
    handlePointerLeave();
  };

  // Helper to trigger splash droplets (also callable when a drink is added)
  const spawnSplash = (x: number, y: number, color: string = '#E0F2FE') => {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4.5;
      splashParticlesRef.current.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 2.5 + Math.random() * 3,
        alpha: 0.9,
        color: color.startsWith('rgb') ? color : 'rgb(186, 230, 253)',
      });
    }

    ripplesRef.current.push({
      id: rippleIdCounter.current++,
      x,
      y,
      radius: 10,
      maxRadius: 75,
      opacity: 0.8,
      speed: 2.2,
    });
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerDrag}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full ${isExpanded ? 'h-[520px]' : 'h-[380px]'} rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-inner border border-sky-300/40 transition-all duration-300`}
      style={{
        background: 'linear-gradient(180deg, #38BDF8 0%, #0EA5E9 40%, #0284C7 100%)',
      }}
    >
      {/* Pool Tile Caustic Pattern */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Sun Caustic Distortion Shimmer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-sky-200/20 to-transparent" />

      {/* 2D Canvas for High-Performance Water Ripples */}
      <canvas
        ref={canvasRef}
        width={physicsRef.current.width}
        height={physicsRef.current.height}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Floating Capybara Character (Driven by 60FPS physics transform) */}
      <div
        className="absolute z-20 transition-transform duration-75 ease-out will-change-transform"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${floatDisplay.x - 70}px, ${floatDisplay.y - 70}px, 0) rotate(${floatDisplay.rotation}deg)`,
        }}
      >
        <CapybaraSvg 
          size={140}
          hasSunglasses={true}
          hasDrink={true}
          hasYuzu={dailyProgressPct >= 100}
        />
      </div>

      {/* Tilt & Sensor Helper Pill at Top */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium shadow-sm border border-white/20">
          <Compass className="w-3.5 h-3.5 text-sky-100 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Tilt phone or drag water to float</span>
        </div>

        {orientation.permissionState === 'prompt' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              requestPermission();
            }}
            className="pointer-events-auto flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-sky-700 text-xs font-semibold shadow-md active:scale-95 transition-transform"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-600" />
            Enable Tilt
          </button>
        )}
      </div>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-3 inset-x-4 flex justify-between items-center z-20 pointer-events-none">
        <div className="text-[11px] font-medium text-white/80 bg-black/15 backdrop-blur-md px-2.5 py-1 rounded-lg">
          🌊 Hydro-Physics: {dailyProgressPct}% Hydrated
        </div>
        {dailyProgressPct >= 100 && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-200 bg-amber-900/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/30">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Yuzu Crown Unlocked!
          </div>
        )}
      </div>
    </div>
  );
};
