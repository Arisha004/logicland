import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'LogicLand — Learn to Code! 🚀',
  description: 'AI-powered coding game for kids aged 8–16',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="stars" aria-hidden>
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                '--dur': `${2 + Math.random() * 4}s`,
                '--delay': `${Math.random() * 4}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--text)',
              border: '1px solid var(--border2)',
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '15px',
            },
          }}
        />
      </body>
    </html>
  );
}
