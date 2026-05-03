'use client';
import { useState } from 'react';
import { signUp, signInWithGoogle } from '@/lib/auth';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Lock, Globe } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { data, error } = await signUp(email, password, fullName);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main>
        <Navbar />
        <div className="container" style={{ padding: '100px 20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '50px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '450px', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '20px' }}>Verify Your Email</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>We've sent a confirmation link to {email}. Please check your inbox to activate your account.</p>
            <Link href="/login" className="btn btn-primary">Go to Login</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', padding: '50px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '450px' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Account</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Join us for your next adventure</p>

          {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label><User size={16} /> Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '15px' }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
            <span style={{ padding: '0 15px', color: '#888', fontSize: '0.9rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
          </div>

          <button 
            onClick={() => signInWithGoogle()}
            className="btn btn-outline" 
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <Globe size={20} /> Sign up with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Log In</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-weight: 600; font-size: 0.9rem; color: #1a1a2e; display: flex; align-items: center; gap: 8px; }
        .form-group input { padding: 12px 15px; border: 1px solid #ddd; border-radius: 10px; font-family: inherit; }
        .form-group input:focus { border-color: var(--primary-color); outline: none; }
      `}</style>
      <Footer />
    </main>
  );
}
