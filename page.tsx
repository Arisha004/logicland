'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const FEATURES = [
  { icon: '🧩', title: 'Puzzle Challenges', desc: 'Solve real coding puzzles that teach programming logic through play.' },
  { icon: '🤖', title: 'AI Tutor Logi', desc: 'Get personalized hints from your friendly AI companion without spoilers.' },
  { icon: '🏆', title: 'Earn Badges', desc: 'Collect achievements as you master variables, loops, functions, and more.' },
  { icon: '📈', title: 'Track Progress', desc: 'See your XP grow, streaks build, and skills level up in real time.' },
];

const MODULES = [
  { icon: '📦', name: 'Variables', color: '#4a8c5c', tier: 8 },
  { icon: '🔄', name: 'Loops', color: '#e8a030', tier: 6 },
  { icon: '🔀', name: 'Conditionals', color: '#2a90a8', tier: 5 },
  { icon: '⚙️', name: 'Functions', color: '#7b6fa0', tier: 3 },
  { icon: '🌊', name: 'Data Flow', color: '#c4603a', tier: 2 },
  { icon: '🧠', name: 'How AI Thinks', color: '#7fb896', tier: 1 },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main style={{ minHeight: '100vh', padding: '0' }}>
      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--border)',
        background: 'rgba(13,15,26,0.8)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent), #5b4dd6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: 'var(--glow)',
          }}>🚀</div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>LogicLand</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login">
            <button className="btn-ghost">Log In</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary">Start for Free</button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        textAlign: 'center', padding: '100px 40px 80px',
        maxWidth: '800px', margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(124,108,255,0.1)', border: '1px solid rgba(124,108,255,0.3)',
          borderRadius: '20px', padding: '6px 16px', marginBottom: '32px',
          color: 'var(--accent2)', fontSize: '14px', fontWeight: 500,
        }}>
          <span>✨</span> AI-Powered Learning for Kids 8–16
        </div>

        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 700, lineHeight: 1.1,
          marginBottom: '24px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          Learn to Code<br />
          <span style={{
            background: 'linear-gradient(135deg, var(--accent2), var(--cyan), var(--green))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Through Play!</span>
        </h1>

        <p style={{
          fontSize: '20px', color: 'var(--text2)', lineHeight: 1.7,
          marginBottom: '48px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s 0.1s ease',
        }}>
          Solve puzzles, earn badges, and grow your coding superpowers<br />
          with your personal AI tutor, Logi! 🤖
        </p>

        <div style={{
          display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
          opacity: mounted ? 1 : 0,
          transition: 'all 0.6s 0.2s ease',
        }}>
          <Link href="/register">
            <button className="btn-primary" style={{ fontSize: '18px', padding: '16px 36px' }}>
              🚀 Start Adventure
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-ghost" style={{ fontSize: '18px', padding: '16px 36px' }}>
              I have an account
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '48px', justifyContent: 'center',
          marginTop: '64px', flexWrap: 'wrap',
          opacity: mounted ? 1 : 0,
          transition: 'all 0.6s 0.3s ease',
        }}>
          {[['10K+', 'Students'], ['6', 'Modules'], ['150+', 'Puzzles'], ['100%', 'Free']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent2)' }}>{num}</div>
              <div style={{ fontSize: '14px', color: 'var(--text3)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section style={{ padding: '80px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 700, marginBottom: '48px' }}>
          🗺️ Your Learning Path
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}>
          {MODULES.map((mod, i) => (
            <div key={mod.name} className="card" style={{
              padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderTop: `3px solid ${mod.color}`,
              animationDelay: `${i * 0.05}s`,
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${mod.color}33`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{mod.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{mod.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Tier {mod.tier}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{
        padding: '80px 40px',
        background: 'linear-gradient(180deg, transparent, rgba(124,108,255,0.05), transparent)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 700, marginBottom: '48px' }}>
            ✨ Why Kids Love LogicLand
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: '32px 24px' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '100px 40px' }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, rgba(124,108,255,0.1), rgba(34,211,238,0.05))',
          border: '1px solid var(--border2)',
          borderRadius: '24px', padding: '64px 80px',
        }}>
          <div style={{ fontSize: '60px', marginBottom: '24px' }} className="animate-float">🦊</div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
            Ready to become a coding hero?
          </h2>
          <p style={{ color: 'var(--text2)', marginBottom: '32px', fontSize: '18px' }}>
            Join thousands of young coders on their adventure!
          </p>
          <Link href="/register">
            <button className="btn-primary" style={{ fontSize: '18px', padding: '16px 48px' }}>
              🚀 Begin Your Journey
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 40px', textAlign: 'center',
        color: 'var(--text3)', fontSize: '14px',
      }}>
        <div style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 600, color: 'var(--text2)' }}>
          🚀 LogicLand
        </div>
        AI-powered coding education for kids © 2026
      </footer>
    </main>
  );
}
