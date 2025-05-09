import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, Menu, X, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {state.isAuthenticated && (
        <>
          {/* Mobile Header */}
          <header className="bg-white shadow-sm md:hidden">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <span className="font-bold text-emerald-600 text-xl">Dietrium</span>
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Mobile Menu */}
            {menuOpen && (
              <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/chat"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Chat Assistant
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </header>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4 mb-5">
                  <span className="font-bold text-emerald-600 text-xl">Dietrium</span>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  <Link
                    to="/dashboard"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  >
                    <Home className="mr-3 h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  >
                    <User className="mr-3 h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
                    Profile
                  </Link>
                  <Link
                    to="/chat"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  >
                    <MessageCircle className="mr-3 h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
                    Chat Assistant
                  </Link>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 w-full group block"
                >
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-600 group-hover:text-red-700">
                        Logout
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:pl-64">
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8">
              {children}
            </main>
          </div>
        </>
      )}

      {!state.isAuthenticated && <main>{children}</main>}
    </div>
  );
};

export default Layout;