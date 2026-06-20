import { Link } from 'react-router-dom';
import { PackageSearch, Activity, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-transparent">
      {/* Navbar Pill */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-full px-8 py-4 flex items-center justify-between w-[90%] max-w-5xl">
        <div className="font-bold text-xl tracking-tighter">StockFlow.</div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium hover:text-gray-300 transition-colors">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-[12vw] md:text-[8vw] leading-[0.9] font-bold tracking-tighter mb-4 flex flex-col items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">PRODUCTS</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-200 to-gray-600">CUSTOMERS</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-400 to-gray-800">ORDERS</span>
          </h1>
          
          <p className="mt-8 text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            The premium inventory management platform for modern businesses. Built for speed, designed for scale.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Start Managing
            </Link>
            <Link to="/dashboard" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center">
              <Activity className="mr-2" size={20} /> View Demo
            </Link>
          </div>

          {/* Dashboard Preview Screenshot */}
          <div className="mt-24 relative w-full max-w-5xl mx-auto">
            <div className="glass-panel p-2 rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative z-10 transform transition-transform hover:scale-[1.02] duration-500">
              <img 
                src="/dashboard-preview.png" 
                alt="StockFlow Dashboard Preview" 
                className="w-full h-auto object-cover rounded-xl border border-white/5 shadow-inner"
              />
            </div>
            {/* Ambient Glow behind the image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/20 blur-[120px] rounded-full z-0" />
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      </main>

      {/* Stats Section */}
      <section id="stats" className="py-24 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
            <PackageSearch size={40} className="mx-auto mb-6 text-gray-400" />
            <div className="text-5xl font-bold mb-2">+10K</div>
            <div className="text-gray-400 tracking-wide">Products Managed</div>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
            <ShieldCheck size={40} className="mx-auto mb-6 text-gray-400" />
            <div className="text-5xl font-bold mb-2">+500</div>
            <div className="text-gray-400 tracking-wide">Businesses</div>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
            <Activity size={40} className="mx-auto mb-6 text-gray-400" />
            <div className="text-5xl font-bold mb-2">+1M</div>
            <div className="text-gray-400 tracking-wide">Orders Processed</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
