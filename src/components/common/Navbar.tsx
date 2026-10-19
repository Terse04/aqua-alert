import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Droplet,
  Search,
  Calculator,
  BookOpen,
  Users,
  MessageSquare,
  Info,
  Shield,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react';
import { DemoBadge } from './DemoBadge';

interface NavItem {
  to: string;
  label: string;
  highlight?: boolean;
  icon: LucideIcon;
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks: NavItem[] = [
    { to: '/', label: 'Home', icon: Droplet },
    { to: '/report', label: 'Report Leak', highlight: true, icon: PlusCircle },
    { to: '/track', label: 'Track', icon: Search },
    { to: '/calculator', label: 'Calculator', icon: Calculator },
    { to: '/awareness', label: 'Awareness', icon: BookOpen },
    { to: '/community', label: 'Community', icon: Users },
    { to: '/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#13B8A6] via-[#087EBC] to-[#103B54] flex items-center justify-center shadow-md shadow-cyan-900/10 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5 text-white fill-white/80" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
                Aqua<span className="text-[#087EBC]">Alert</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#13B8A6] -mt-0.5">
                Wagholi CEP • Pune
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-[#087EBC] to-[#13B8A6] text-white hover:opacity-95 shadow-xs shadow-cyan-800/15'
                      : active
                      ? 'text-[#087EBC] bg-[#E9F8F7] font-semibold'
                      : 'text-[#263746] hover:text-[#087EBC] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Demo Badge + Admin Portal */}
          <div className="hidden md:flex items-center gap-3">
            <DemoBadge />
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-[#103B54] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#087EBC]" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <DemoBadge />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3">
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#087EBC] to-[#13B8A6] text-white rounded-xl font-semibold text-sm shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Report Leak
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 bg-[#E9F8F7] text-[#087EBC] rounded-xl font-semibold text-sm border border-[#13B8A6]/20"
            >
              <Search className="w-4 h-4" />
              Track Report
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks
              .filter((l) => !l.highlight)
              .map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      active
                        ? 'text-[#087EBC] bg-[#E9F8F7] font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-gray-500" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

            <div className="pt-2 border-t border-gray-100">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Shield className="w-4 h-4 text-[#087EBC]" />
                <span>Administrator Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
