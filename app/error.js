'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="error-boundary-page">
      <Navbar />
      <main className="container error-content">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h1>Something went wrong</h1>
          <p>We're having trouble loading this page. Please try again or return home.</p>
          <div className="error-actions">
            <button onClick={() => reset()} className="btn btn-primary">Try Again</button>
            <Link href="/" className="btn btn-secondary">Go Back Home</Link>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .error-boundary-page { min-height: 100vh; display: flex; flex-direction: column; background: var(--background-color); }
        .error-content { flex: 1; display: flex; align-items: center; justify-content: center; padding: 100px 0; }
        .error-card { text-align: center; max-width: 500px; padding: 60px; background: #fff; border-radius: 24px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
        .error-icon { font-size: 4rem; margin-bottom: 20px; }
        .error-card h1 { font-family: var(--font-display); margin-bottom: 15px; color: var(--navy); }
        .error-card p { color: var(--text-secondary); margin-bottom: 35px; line-height: 1.6; }
        .error-actions { display: flex; gap: 15px; justify-content: center; }
      `}</style>
    </div>
  );
}
