'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

const AVATARS = ["🦊","🐉","🦁","🐺","🦅","🐬","🐸","🦄","🐼","🦋","🐯","🦖","🚀","⭐","🌟"];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore(s => s.setAuth);
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', age: 12 });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      const data = await authApi.register(form);
      setAuth(data.access_token, {
        id: data.user_id,
        username: data.username,
        avatar: data.avatar,
        skill_level: data.skill_level,
        xp_points: data.xp_points,
      });
      toast.success(`Welcome to LogicLand, ${data.username}! 🎉`);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }} className="animate-float">🚀</div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>LogicLand</div>
          </Link>
          <p style={{ color: 'var(--text2)', marginTop: '8px' }}>Join thousands of young coders!</p>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: s <= step ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
            {step === 1 ? '👋 Your Account' : '🎨 Your Character'}
          </h1>

          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {step === 1 ? (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>Username</label>
                  <input className="input" placeholder="CoolCoder42" value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>Email</label>
                  <input className="input" type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>Password</label>
                  <input className="input" type="password" placeholder="Min 8 characters" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>Full Name (optional)</label>
                  <input className="input" placeholder="Alex Explorer" value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>Age</label>
                  <input className="input" type="number" min={6} max={18} value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || 12 }))} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>
                    Pick your avatar (you can change later)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {AVATARS.map(av => (
                      <button key={av} type="button" onClick={() => setForm(f => ({ ...f }))}
                        style={{
                          width: '44px', height: '44px', borderRadius: '10px', fontSize: '22px',
                          background: 'var(--bg3)', border: '2px solid var(--border)',
                          cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {step === 2 && (
                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  ← Back
                </button>
              )}
              <button type="submit" className="btn-primary" disabled={loading}
                style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Creating...' : step === 1 ? 'Next →' : '🚀 Start Playing!'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text3)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600 }}>Log In</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
