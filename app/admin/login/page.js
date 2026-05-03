'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [masterKey, setMasterKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterKey })
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: '120px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', padding: '50px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ background: '#fff9e6', color: '#e8a020', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
            <ShieldCheck size={40} />
          </div>
          <h1 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Admin Access</h1>
          <p style={{ color: '#666', marginBottom: '35px' }}>Enter the Master Key to access the dashboard</p>

          {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
              <input 
                type="password" 
                value={masterKey} 
                onChange={(e) => setMasterKey(e.target.value)} 
                required 
                placeholder="Enter Master Key" 
                style={{ 
                  width: '100%', 
                  padding: '15px 15px 15px 45px', 
                  borderRadius: '12px', 
                  border: '1px solid #ddd', 
                  fontSize: '1rem' 
                }} 
              />
            </div>
            <button type="submit" className="btn btn-secondary" disabled={loading} style={{ width: '100%', padding: '15px', fontSize: '1rem' }}>
              {loading ? 'Verifying...' : 'Authorize Access'}
            </button>
          </form>

          <p style={{ marginTop: '30px', fontSize: '0.85rem', color: '#888' }}>
            Security Note: Rate limiting is active on this route.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
