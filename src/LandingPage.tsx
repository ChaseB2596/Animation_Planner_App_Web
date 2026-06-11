import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Play, CheckCircle2, Layers, Calendar, PieChart, Network, X } from 'lucide-react';

interface Props {
  onLaunchDemo: () => void;
}

const features = [
  {
    icon: Layers,
    title: 'Scene Management',
    description: 'Organize every shot with rich metadata — progress stages, assets, references, and version history in one view.',
  },
  {
    icon: PieChart,
    title: 'Budget Tracking',
    description: 'Track costs per scene and asset. Categorize purchases, in-house creations, and existing inventory at a glance.',
  },
  {
    icon: Calendar,
    title: 'Production Schedule',
    description: 'Gantt-style timeline across all four production stages. Visualize your entire pipeline in a 30-day view.',
  },
  {
    icon: Network,
    title: 'Node Editor',
    description: 'An infinite canvas for visual planning — sketch layouts, annotate frames, and attach reference images.',
  },
];

const stats = [
  { value: '4×', label: 'Faster scene review' },
  { value: '100%', label: 'Pipeline visibility' },
  { value: '9+', label: 'Views & layouts' },
];

export default function LandingPage({ onLaunchDemo }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#060914] text-white font-['Inter',sans-serif] overflow-x-hidden">

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 md:px-16 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Layers size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">FrameFlow</span>
        </div>
        <button
          onClick={onLaunchDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
        >
          Try Demo <ArrowRight size={14} />
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Now in early access
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mb-8"
        >
          Animation planning{' '}
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(96,165,250,0.4)]">
            built for teams
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-12"
        >
          FrameFlow brings your entire production pipeline into one elegant workspace — from storyboard to final render, every scene, budget, and deadline in perfect order.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <button
            onClick={onLaunchDemo}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-base transition-all duration-300 shadow-[0_8px_32px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.5)] hover:-translate-y-1"
          >
            Try the Demo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setShowVideo(true)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-semibold text-base transition-all duration-200"
          >
            <Play size={16} className="text-blue-400" />
            Watch overview
          </button>
        </motion.div>

        {/* App preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative w-full max-w-5xl"
        >
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-600/30 via-blue-500/10 to-indigo-600/20 blur-2xl" />
          <div
            onClick={onLaunchDemo}
            className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] cursor-pointer group"
          >
            <img
              src="/images/6.jpg"
              alt="FrameFlow app interface"
              className="w-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600/90 backdrop-blur-sm text-white font-bold shadow-xl">
                <Play size={16} fill="white" /> Launch Demo
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-br from-blue-300 to-blue-500 bg-clip-text mb-2 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]">
                {s.value}
              </span>
              <span className="text-white/40 text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-28 px-8 md:px-16 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Everything your team needs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-blue-500/20 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.1)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/25 transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <f.icon size={22} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">{f.title}</h3>
              <p className="text-white/45 leading-relaxed text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Screenshot gallery */}
      <section className="relative z-10 py-16 px-8 md:px-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-white/40 text-sm">Click any shot to launch the demo</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 7].map((n) => (
            <div
              key={n}
              onClick={onLaunchDemo}
              className="group relative rounded-2xl overflow-hidden border border-white/8 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(59,130,246,0.2)] hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={`/images/${n}.jpg`}
                alt={`App screenshot ${n}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Open Demo</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="relative z-10 py-28 px-8 flex flex-col items-center text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/12 blur-[100px]" />
        </div>
        <div className="relative w-full max-w-2xl">
          <div className="p-12 rounded-3xl border border-white/8 bg-white/[0.03] shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Early Access</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Be first in line
            </h2>
            <p className="text-white/45 mb-10 leading-relaxed">
              FrameFlow is coming soon as a full production app. Join the waitlist and we'll notify you the moment it launches.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-4"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <CheckCircle2 size={24} className="text-blue-400" />
                  </div>
                  <p className="text-white font-semibold">You're on the list!</p>
                  <p className="text-white/40 text-sm">We'll reach out to <strong className="text-white/60">{email}</strong> when we launch.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleWaitlist}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-blue-500/50 focus:bg-white/8 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-7 py-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-sm hover:from-blue-400 hover:to-blue-600 transition-all shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.5)] whitespace-nowrap"
                  >
                    Join Waitlist
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-white/20 text-xs mt-6">No spam. Just one email when we launch.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-8 md:px-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white/20">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Layers size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold">FrameFlow</span>
        </div>
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} FrameFlow. All rights reserved.</p>
        <button
          onClick={onLaunchDemo}
          className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors"
        >
          Try the demo →
        </button>
      </footer>

      {/* Video modal placeholder */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950"
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-950 to-zinc-950">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto">
                    <Play size={32} className="text-blue-400 ml-1" fill="currentColor" />
                  </div>
                  <p className="text-white/40 text-sm">Overview video coming soon</p>
                  <button
                    onClick={() => { setShowVideo(false); onLaunchDemo(); }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
                  >
                    Try the Demo Instead <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
