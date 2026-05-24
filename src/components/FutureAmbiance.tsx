import React, { useEffect, useRef, useState } from "react";
import { TRANSLATIONS } from "../data";
import { Language } from "../types";
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Activity, 
  Cpu, 
  Zap, 
  Terminal, 
  Network, 
  Command, 
  Workflow
} from "lucide-react";

// Web Audio API Synthesizer Engine for Futuristic HUD Sound FX
export class FutureSoundEngine {
  private static enabled = false;

  static toggle(forceValue?: boolean) {
    this.enabled = forceValue !== undefined ? forceValue : !this.enabled;
    localStorage.setItem("futuristic_sound_fx_v3", this.enabled ? "true" : "false");
    return this.enabled;
  }

  static isEnabled() {
    if (typeof localStorage !== "undefined" && !this.enabled) {
      this.enabled = localStorage.getItem("futuristic_sound_fx_v3") === "true";
    }
    return this.enabled;
  }

  static playTick() {
    if (!this.isEnabled()) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (_) {}
  }

  static playSuccess() {
    if (!this.isEnabled()) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1318.51, now + 0.06);
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(659.25, now + 0.06);
      
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch (_) {}
  }

  static playScan() {
    if (!this.isEnabled()) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(2400, ctx.currentTime + 0.28);
      
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch (_) {}
  }

  static playToggle() {
    if (!this.isEnabled()) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); 
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (_) {}
  }
}

// 1. High Performance Background Canvas Particle Stream with Cursor Interactivity
export function FutureParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 140 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      originalX: number;
      originalY: number;
      alpha: number;
      pulseDirection: number;
    }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const density = Math.min(60, Math.floor((canvas.width * canvas.height) / 16000));
      for (let i = 0; i < density; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 0.8;
        
        // Premium cyber hues: Neon Cyan, Violet Purple, Neon Pink, Deep Dark Sockets
        const colors = [
          "rgba(34, 211, 238,", // cyan-400
          "rgba(168, 85, 247,", // purple-500
          "rgba(244, 63, 94,",  // rose-500
          "rgba(56, 189, 248,"   // sky-400
        ];
        const colorPrefix = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x,
          y,
          size,
          color: colorPrefix,
          speedX: (Math.random() * 0.4 - 0.2),
          speedY: (Math.random() * 0.4 - 0.2),
          originalX: x,
          originalY: y,
          alpha: Math.random() * 0.5 + 0.1,
          pulseDirection: Math.random() > 0.5 ? 0.01 : -0.01
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle holographic background coordinate grid lines 
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      const gridSpacing = 80;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Live Laser Sweep Animation over Grid
      const sweepY = (Date.now() / 40) % (canvas.height + 600) - 300;
      if (sweepY > 0 && sweepY < canvas.height) {
        const gradient = ctx.createLinearGradient(0, sweepY - 80, 0, sweepY + 40);
        gradient.addColorStop(0, "rgba(34, 211, 238, 0)");
        gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.04)");
        gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, sweepY - 80, canvas.width, 120);

        ctx.strokeStyle = "rgba(34, 211, 238, 0.18)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, sweepY);
        ctx.lineTo(canvas.width, sweepY);
        ctx.stroke();
      }

      // Cursor Radial Glow effect (glow mapping)
      if (mouseRef.current.x !== -1000) {
        const cursorGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.radius
        );
        cursorGlow.addColorStop(0, "rgba(34, 211, 238, 0.08)");
        cursorGlow.addColorStop(0.5, "rgba(168, 85, 247, 0.03)");
        cursorGlow.addColorStop(1, "rgba(15, 23, 42, 0)");
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, mouseRef.current.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and Reposition Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wave cycle opacity pulsation
        p.alpha += p.pulseDirection;
        if (p.alpha > 0.7 || p.alpha < 0.15) {
          p.pulseDirection = -p.pulseDirection;
        }

        // Float drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Screen wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Cursor magnetic push
        if (mouseRef.current.x !== -1000) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
            // push away
            p.x -= (dx / distance) * force * 1.5;
            p.y -= (dy / distance) * force * 1.5;
          }
        }

        // Draw particle
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw laser connections between close particles for a neural constellation effect
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 110) {
            const lineOpacity = (110 - dist) / 110 * 0.11;
            ctx.strokeStyle = `rgba(147, 51, 234, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 opacity-45 select-none"
      id="neon-tactile-hologram-canvas"
    />
  );
}

// 2. Beautiful sound controller widget
export function AudioToggleWidget({ language }: { language: Language }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(FutureSoundEngine.isEnabled());
  }, []);

  const handleToggle = () => {
    const nextState = FutureSoundEngine.toggle();
    setEnabled(nextState);
    if (nextState) {
      FutureSoundEngine.playSuccess();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-xl border flex items-center space-x-1.5 rtl:space-x-reverse transition-all duration-300 font-mono text-[10px] uppercase font-bold tracking-widest ${
        enabled 
          ? "bg-cyan-950/45 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
          : "bg-slate-950/90 text-slate-500 border-slate-900 hover:border-slate-800"
      }`}
      title={language === "ar" ? "تأثيرات صوتية مستقبلية" : "Toggle Futuristic UI Audio FX"}
    >
      {enabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-600" />}
      <span className="hidden sm:inline">
        {language === "ar" 
          ? (enabled ? "الصوت: مفعّل" : "الصوت: مغلق")
          : (enabled ? "SND: ON" : "SND: OFF")
        }
      </span>
    </button>
  );
}

// 3. Holographic Diagnostics floating Widget (Telemetry feed)
export function CyberTelemetryWidget({ language }: { language: Language }) {
  const [uptime, setUptime] = useState("02:55:12");
  const [neuralLoads, setNeuralLoads] = useState<number[]>([42, 55, 61, 39, 48]);
  const [pulseCounter, setPulseCounter] = useState(88);
  const isAr = language === "ar";

  useEffect(() => {
    const timer = setInterval(() => {
      // Dynamic loads mapping and countdowns
      setNeuralLoads(prev => prev.map(l => Math.max(10, Math.min(100, l + Math.floor(Math.random() * 9) - 4))));
      setPulseCounter(Math.floor(Math.random() * 15) + 82);
      
      const parts = uptime.split(":").map(Number);
      let s = parts[2] + 1;
      let m = parts[1];
      let h = parts[0];
      if (s >= 60) { s = 0; m++; }
      if (m >= 60) { m = 0; h++; }
      
      const pad = (n: number) => n.toString().padStart(2, "0");
      setUptime(`${pad(h)}:${pad(m)}:${pad(s)}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [uptime]);

  const handleActionClick = () => {
    FutureSoundEngine.playScan();
  };

  return (
    <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group shadow-2xl" id="cyber-telemetry-hud-card">
      {/* Absolute visual scanning radar light indicator */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl pointer-events-none rounded-full"></div>
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </div>
          <span className="text-[10px] font-mono font-black text-slate-400 tracking-wider">
            {isAr ? "مركز التشخيص المعرفي" : "AI NETWORK COGNITION ENGINE"}
          </span>
        </div>
        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-900/40 px-2 py-0.5 rounded font-black">
          v4.0.59
        </span>
      </div>

      <div className="py-4 space-y-4">
        {/* Radar Scanner Grid visualization */}
        <div className="relative h-28 w-28 mx-auto flex items-center justify-center rounded-full border border-slate-900/80 bg-slate-950" onClick={handleActionClick} style={{ cursor: "crosshair" }}>
          
          {/* Infinite scanning radar ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-purple-500/20"></div>
          <div className="absolute inset-6 rounded-full border border-cyan-500/15"></div>
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(34,211,238,0.18)_0deg,transparent_270deg)] animate-spin" style={{ animationDuration: "5s" }}></div>
          
          <div className="text-center z-10">
            <Cpu className="w-5 h-5 text-purple-400 mx-auto mb-1 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 block font-bold leading-none">{pulseCounter} %</span>
            <span className="text-[8px] font-mono text-slate-500 block">{isAr ? "نبض المحاذاة" : "SYNC FLUX"}</span>
          </div>
        </div>

        {/* Real-time parameters listing */}
        <div className="space-y-2 text-[10px] font-mono text-slate-400">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">{isAr ? "توقيت الخادم المحلي" : "Server Uptime (UTC)"}</span>
            <span className="text-white font-extrabold">{uptime}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">{isAr ? "دقة ترشيح المسارات" : "Routing Precision"}</span>
            <span className="text-emerald-400 font-extrabold">99.998%</span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase">
              <span>{isAr ? "أحمال مصفوفة الاتصال" : "NEURAL COGNITIVE LOAD STACK"}</span>
              <span>avg {(neuralLoads.reduce((a,b)=>a+b,0)/5).toFixed(0)}%</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {neuralLoads.map((load, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="h-10 bg-slate-950 border border-slate-900 rounded overflow-hidden flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 via-cyan-400 to-rose-400 transition-all duration-500"
                      style={{ height: `${load}%` }}
                    />
                  </div>
                  <span className="text-[7px] text-slate-600 font-black block text-center">N{idx+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-3 flex items-center justify-between text-[9px] font-mono text-slate-500 select-none">
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-purple-400 font-black">
          <Workflow className="w-3.5 h-3.5" />
          <span>CYBERNETIC_ACTIVE_BUS</span>
        </div>
        <span className="text-emerald-500">SECURE SHD_v4</span>
      </div>
    </div>
  );
}
