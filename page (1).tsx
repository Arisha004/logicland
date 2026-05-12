'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(s => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login(form);
      setAuth(data.access_token, {
        id: data.user_id,
        username: data.username,
        avatar: data.avatar,
        skill_level: data.skill_level,
        xp_points: data.xp_points,
      });
      toast.success(`Welcome back, ${data.username}! 🎉`);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Login failed';
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }} className="animate-float">🚀</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)' }}>LogicLand</div>
          </Link>
          <p style={{ color: 'var(--text2)', marginTop: '8px' }}>Welcome back, explorer!</p>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '28px', textAlign: 'center' }}>
            Log In
          </h1>

          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>
                Email
              </label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>
                Password
              </label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: '8px', width: '100%', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Logging in...' : '🚀 Log In'}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{
            marginTop: '20px', padding: '14px', borderRadius: '10px',
            background: 'rgba(124,108,255,0.08)', border: '1px solid rgba(124,108,255,0.2)',
            fontSize: '13px', color: 'var(--text2)',
          }}>
            <strong style={{ color: 'var(--accent2)' }}>Demo account:</strong><br />
            demo@logicland.io / Demo1234!
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text3)', fontSize: '14px' }}>
            New here?{' '}
            <Link href="/register" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600 }}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
