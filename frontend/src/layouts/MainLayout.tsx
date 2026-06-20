import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PremiumBackground from '../components/PremiumBackground';

const MainLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <PremiumBackground />
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 glass-panel m-4 rounded-2xl z-50 flex flex-col md:flex-row md:items-center px-6 py-3">
        {/* Left: Logo */}
        <div className="flex items-center justify-between w-full md:w-1/4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">StockFlow</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">Workspace</p>
          </div>
          
          {/* Mobile menu toggle */}
          <button onClick={toggleSidebar} className="md:hidden text-gray-300 hover:text-white p-2">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Center: Navigation Links */}
        <div className={`
          flex-col md:flex-row md:flex items-center justify-center w-full md:w-2/4 mt-4 md:mt-0
          ${isSidebarOpen ? 'flex' : 'hidden'}
        `}>
          <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.05)] text-white font-medium' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Sign Out */}
        <div className={`
          flex-col md:flex-row md:flex items-center justify-end w-full md:w-1/4 mt-4 md:mt-0
          ${isSidebarOpen ? 'flex' : 'hidden'}
        `}>
          <div className="h-px w-full md:h-8 md:w-px bg-white/10 my-4 md:my-0 md:mx-4 md:hidden" />
          <button 
            onClick={logout}
            className="flex items-center justify-center md:justify-end space-x-2 px-4 py-2.5 w-full md:w-auto text-gray-400 hover:text-red-400 transition-colors duration-200"
          >
            <LogOut size={18} />
            <span className="md:hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-32 md:pt-32 min-h-screen max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
