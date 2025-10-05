
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  UserCircle, 
  BookOpen, 
  Bookmark, 
  Mic, 
  HeartHandshake,
  Beaker,
  LayoutDashboard,
  LogOut,
  Home
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';

const AdminMobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useData();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/profile', label: 'Profile', icon: <UserCircle className="w-5 h-5" /> },
    { path: '/admin/research', label: 'Research Interests', icon: <Bookmark className="w-5 h-5" /> },
    { path: '/admin/teaching', label: 'Teaching Interests', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/admin/publications', label: 'Publications', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/admin/talks', label: 'Invited Talks', icon: <Mic className="w-5 h-5" /> },
    { path: '/admin/activities', label: 'Volunteer Activities', icon: <HeartHandshake className="w-5 h-5" /> },
    { path: '/admin/lab', label: 'Lab Information', icon: <Beaker className="w-5 h-5" /> },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button onClick={toggleMenu} className="text-white">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 pt-16">
          <div className="px-4 py-2">
            <nav>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={closeMenu}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/"
                    className="flex items-center px-4 py-3 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={closeMenu}
                  >
                    <span className="mr-3"><Home className="w-5 h-5" /></span>
                    <span>View Public Site</span>
                  </Link>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-4 py-3 rounded-md transition-colors text-red-400 hover:bg-gray-700 hover:text-red-300"
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                  >
                    <span className="mr-3"><LogOut className="w-5 h-5" /></span>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMobileNav;
