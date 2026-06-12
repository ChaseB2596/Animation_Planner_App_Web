import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Layers, Calendar, PieChart, Network, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  onLaunchDemo: () => void;
}

const features = [
  {
    icon: Layers,
    title: 'Scene Management',
    description: 'Organize every shot with progress stages, assets, references, and version history in one view.',
  },
  {
    icon: PieChart,
    title: 'Budget Tracking',
    description: 'Track costs per scene and asset. Categorize purchases, in-house work, and existing inventory.',
  },
  {
    icon: Calendar,
    title: 'Production Schedule',
    description: 'Gantt-style timeline across all four production stages. Visualize your full pipeline at a glance.',
  },
  {
    icon: Network,
    title: 'Node Editor',
    description: 'An infinite canvas for visual planning — sketch layouts, annotate frames, attach references.',
  },
];

export default function LandingPage({ onLaunchDemo }: Props) {
  const [yesCount, setYesCount] = useState(0);
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null);

  const handleVote = (vote: 'yes' | 'no') => {
    if (voted) return;
    setVoted(vote);
    if (vote === 'yes') setYesCount(c => c + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Inter',sans-serif] overflow-x-hidden">

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 md:px-16 py-5 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200">
            <Layers size={15} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Animation Planner</span>
        </div>
        <button
          onClick={onLaunchDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-200 hover:-translate-y-0.5"
        >
          Try Demo <ArrowRight size={14} />
        </button>
      </nav>

      {/* Hero — two column */}
      <section className="relative px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: text */}
          <div className="flex-1 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Early Access
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-slate-900"
            >
              Animation planning{' '}
              <span className="text-blue-600">
                built for teams
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg"
            >
              One workspace for your entire production pipeline — scenes, budgets, schedules, and assets, all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={onLaunchDemo}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
              >
                Try the Demo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right: image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 blur-2xl opacity-80" />
              <div
                onClick={onLaunchDemo}
                className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.12)] cursor-pointer group"
              >
                <img
                  src="/regenerated_image_1777330920029.png"
                  alt="Animation Planner preview"
                  className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity px-5 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-bold shadow-lg">
                    Launch Demo →
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Features */}
      <section className="px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Everything your team needs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                <f.icon size={18} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-bold mb-2 text-slate-900">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vote section */}
      <section className="px-8 md:px-16 py-20 bg-white border-t border-slate-100">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-10">
              Would you want this?
            </h2>

            <AnimatePresence mode="wait">
              {voted ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="text-slate-500 text-base">
                    {voted === 'yes' ? 'Thanks! Glad to hear it.' : 'Thanks for the honest feedback.'}
                  </p>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 border border-blue-100">
                    <ThumbsUp size={16} className="text-blue-600" />
                    <span className="text-blue-700 font-bold text-sm">{yesCount} {yesCount === 1 ? 'person wants' : 'people want'} this</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="buttons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVote('yes')}
                      className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
                    >
                      <ThumbsUp size={18} /> Yes
                    </button>
                    <button
                      onClick={() => handleVote('no')}
                      className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <ThumbsDown size={18} /> No
                    </button>
                  </div>
                  {yesCount > 0 && (
                    <p className="text-slate-400 text-sm">{yesCount} {yesCount === 1 ? 'person' : 'people'} said yes</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 md:px-16 border-t border-slate-100 flex items-center justify-center">
        <button
          onClick={onLaunchDemo}
          className="text-blue-600 hover:text-blue-500 text-sm font-semibold transition-colors"
        >
          Try the demo →
        </button>
      </footer>

    </div>
  );
}
