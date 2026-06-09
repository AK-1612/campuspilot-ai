/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * LaptopLanding – shown when the app is opened on a desktop/laptop browser.
 * Gives users a full product overview and a QR code to open the app on mobile.
 */

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Compass,
  MapPin,
  Wifi,
  ShieldAlert,
  Accessibility,
  Zap,
  Navigation,
  Volume2,
  ArrowRight,
  Github,
} from 'lucide-react';

const VERCEL_URL = 'https://campuspilot-ai.vercel.app/';

const FEATURES = [
  {
    icon: <Navigation className="w-6 h-6" />,
    color: 'from-teal-400/20 to-teal-600/10',
    border: 'border-teal-500/20',
    accent: 'text-teal-400',
    title: 'Smart Route Planning',
    desc: 'Outdoor & indoor routes optimised in real-time around obstacles, closures, and your accessibility needs.',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    color: 'from-blue-400/20 to-blue-600/10',
    border: 'border-blue-500/20',
    accent: 'text-blue-400',
    title: 'Real-Time Positioning',
    desc: 'GPS + BLE beacon fusion gives floor-level accuracy inside any campus building.',
  },
  {
    icon: <Accessibility className="w-6 h-6" />,
    color: 'from-violet-400/20 to-violet-600/10',
    border: 'border-violet-500/20',
    accent: 'text-violet-400',
    title: 'Accessibility First',
    desc: 'Six navigation modes — wheelchair, vision, hearing, cognitive, chronic & standard — all customisable.',
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    color: 'from-red-400/20 to-red-600/10',
    border: 'border-red-500/20',
    accent: 'text-red-400',
    title: 'Emergency SOS',
    desc: 'One-tap SOS broadcasts your GPS location via cellular SMS and peer-to-peer mesh network simultaneously.',
  },
  {
    icon: <Volume2 className="w-6 h-6" />,
    color: 'from-amber-400/20 to-amber-600/10',
    border: 'border-amber-500/20',
    accent: 'text-amber-400',
    title: 'Audio Beacon Guidance',
    desc: 'Directional sound cues help visually impaired users navigate corridors, lifts and doorways hands-free.',
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    color: 'from-emerald-400/20 to-emerald-600/10',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-400',
    title: 'Mesh Network',
    desc: 'Device-to-device mesh keeps emergency alerts alive even when cellular coverage drops inside buildings.',
  },
];

const STATS = [
  { value: '6', label: 'Accessibility Modes' },
  { value: '<3m', label: 'Indoor Accuracy' },
  { value: '100%', label: 'Privacy — No Login' },
  { value: '24 / 7', label: 'Emergency Mesh' },
];

export default function LaptopLanding() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white font-sans antialiased overflow-x-hidden">

      {/* ── Ambient background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-teal-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#080c14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">CampusPilot <span className="text-teal-400">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#scan" className="hover:text-white transition-colors">Get Started</a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16">

        {/* Left copy */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Zap className="w-3.5 h-3.5" />
            Accessibility-First Campus Navigation
          </div>

          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            Navigate any campus
            <br />
            <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              smarter & safer
            </span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
            CampusPilot AI delivers real-time indoor &amp; outdoor routing with six accessibility modes,
            emergency SOS mesh broadcast, and audio beacon guidance — no login required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href="#features"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 hover:border-white/20 text-zinc-300 font-semibold text-sm transition-colors"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Right — QR card */}
        <div id="scan" className="flex-shrink-0 flex flex-col items-center gap-5">
          <div className="relative p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-5">
            {/* Glow */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-teal-500/20 via-transparent to-blue-500/20 pointer-events-none" />

            <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase">Scan to Open on Mobile</p>

            <div className="bg-white p-4 rounded-2xl shadow-xl">
              <QRCodeSVG
                value={VERCEL_URL}
                size={180}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm font-bold text-white">campuspilot-ai.vercel.app</span>
              <span className="text-xs text-zinc-500">Point your phone camera at the QR code</span>
            </div>
          </div>

          {/* Platform pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Works on iOS, Android &amp; any mobile browser
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl font-black bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">{s.value}</span>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Platform Capabilities</p>
          <h2 className="text-4xl font-black tracking-tight mb-4">Everything your campus needs</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Designed from the ground up for inclusive, barrier-free campus movement — for every student, every day.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`relative p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className={`${f.accent} mb-4`}>{f.icon}</div>
              <h3 className="font-bold text-base text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Get Started in Seconds</p>
          <h2 className="text-4xl font-black tracking-tight mb-16">Three steps. Zero friction.</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Scan the QR code', desc: 'Use your phone camera to open CampusPilot AI instantly — no App Store download needed.' },
              { step: '02', title: 'Pick your mode', desc: 'Choose from six accessibility profiles. Your preference is stored locally, never uploaded.' },
              { step: '03', title: 'Start navigating', desc: 'Search your destination, get turn-by-turn directions, and tap SOS if you ever need help.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/20 flex items-center justify-center text-xl font-black text-teal-400">
                  {item.step}
                </div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white">CampusPilot AI</p>
              <p className="text-xs text-zinc-500">Accessibility-first campus navigation</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 text-center md:text-right">
            Built with React + Vite · Leaflet Maps · Deployed on Vercel<br />
            No login · No data collection · 100% client-side
          </p>
        </div>
      </section>
    </div>
  );
}
