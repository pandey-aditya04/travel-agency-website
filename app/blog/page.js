'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Hidden Gems in Kerala You Must Visit',
    excerpt: 'Beyond the backwaters, Kerala has secret waterfalls and misty hills that most travelers miss...',
    date: 'May 10, 2026',
    author: 'Travel Guru',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Packing Guide for your First Swiss Alps Adventure',
    excerpt: 'Switzerland is beautiful but can be tricky to pack for. Here is our essential gear list...',
    date: 'May 12, 2026',
    author: 'Adventure Al',
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'The Spiritual Significance of Char Dham Yatra',
    excerpt: 'Understand the deep history and spiritual journey behind India\'s most sacred pilgrimage...',
    date: 'May 15, 2026',
    author: 'Shanti Path',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'
  }
];

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <section style={{ 
        background: 'linear-gradient(rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.8)), url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 0',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Tips & Tales</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '700px', margin: '0 auto' }}>Stories, guides, and inspiration for your next great adventure across the globe.</p>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 20px' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {blogPosts.map(post => (
            <article key={post.id} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', transition: 'transform 0.3s ease' }}>
              <img src={post.image} alt={post.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {post.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> {post.author}</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '800', lineHeight: '1.3' }}>{post.title}</h2>
                <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>{post.excerpt}</p>
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Read Story <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
