import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import SearchBar from '@/components/SearchBar';
import TripCard from '@/components/TripCard';
import { supabase } from '@/lib/supabase';
import { CheckCircle, ShieldCheck, Headphones, Wallet, Map } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

async function getPackages() {
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('status', 'Published')
    .eq('featured', true);
  
  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
  return packages;
}

export default async function Home() {
  const featuredPackages = await getPackages();

  const indianEscapes = featuredPackages.filter(p => p.category === 'Indian Escapes');
  const overseasAdventures = featuredPackages.filter(p => p.category === 'Overseas Adventures');
  const divineDestinations = featuredPackages.filter(p => p.category === 'Divine Destinations');

  return (
    <main>
      <Navbar />
      <HeroSlider />
      <SearchBar />

      {/* Indian Escapes Section */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <h2 className="section-title">Explore Popular Indian Destinations</h2>
        {indianEscapes.length > 0 ? (
          <div className="grid">
            {indianEscapes.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>No featured Indian escapes at the moment.</p>
        )}
      </section>

      {/* Promo Banner */}
      <section style={{ 
        background: 'linear-gradient(45deg, #1a1a2e, #16213e)', 
        color: '#fff', 
        padding: '100px 0', 
        textAlign: 'center',
        margin: '60px 0'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Up to 80% Discount!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#ccc' }}>
            Book your dream vacation today and save big on selected destinations.
          </p>
          <a href="/destinations" className="btn btn-primary" style={{ padding: '15px 50px', fontSize: '1.2rem' }}>
            Discover More
          </a>
        </div>
      </section>

      {/* Overseas Adventures Section */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <h2 className="section-title">Most Popular Overseas Adventures</h2>
        {overseasAdventures.length > 0 ? (
          <div className="grid">
            {overseasAdventures.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>No featured overseas adventures at the moment.</p>
        )}
      </section>

      {/* Stats Counter */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px', textAlign: 'center' }}>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: '#e8a020' }}>500+</h3>
            <p style={{ fontWeight: '600' }}>Flight Bookings</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: '#e8a020' }}>200+</h3>
            <p style={{ fontWeight: '600' }}>Cruises Bookings</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: '#e8a020' }}>1000+</h3>
            <p style={{ fontWeight: '600' }}>Amazing Tours</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: '#e8a020' }}>800+</h3>
            <p style={{ fontWeight: '600' }}>Hotel Bookings</p>
          </div>
        </div>
      </section>

      {/* Divine Destinations Section */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <h2 className="section-title">Find Peace For Your Next Trip</h2>
        {divineDestinations.length > 0 ? (
          <div className="grid">
            {divineDestinations.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>No featured divine destinations at the moment.</p>
        )}
      </section>

      {/* Why Choose Us */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '100px 0' }}>
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="grid">
            {[
              { icon: <Map color="#e8a020" />, title: "Expertly Crafted Packages", desc: "Tailored to your specific travel needs and preferences." },
              { icon: <Headphones color="#e8a020" />, title: "24/7 Customer Support", desc: "Always there for you, ensuring a stress-free journey." },
              { icon: <Wallet color="#e8a020" />, title: "Affordable Pricing", desc: "Best value for your money with no hidden costs." },
              { icon: <ShieldCheck color="#e8a020" />, title: "Trusted Network", desc: "Vetted hotels, guides, and transport providers." },
              { icon: <CheckCircle color="#e8a020" />, title: "Memorable Experiences", desc: "Personalized touches that make your trip special." }
            ].map((point, i) => (
              <div key={i} className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', display: 'inline-block' }}>{point.icon}</div>
                <h3 style={{ marginBottom: '1rem' }}>{point.title}</h3>
                <p style={{ color: '#666' }}>{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
