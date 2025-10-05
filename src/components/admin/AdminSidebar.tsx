
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  BookOpen, 
  GraduationCap, 
  Briefcase,
  FileText, 
  Mic, 
  Users, 
  Award, 
  DollarSign, 
  Beaker
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
    { icon: BookOpen, label: 'Research Interests', path: '/admin/research' },
    { icon: GraduationCap, label: 'Teaching Interests', path: '/admin/teaching' },
    { icon: Briefcase, label: 'Experience', path: '/admin/experience' },
    { icon: FileText, label: 'Publications', path: '/admin/publications' },
    { icon: Mic, label: 'Talks', path: '/admin/talks' },
    { icon: Users, label: 'Activities', path: '/admin/activities' },
    { icon: Award, label: 'Awards', path: '/admin/awards' },
    { icon: DollarSign, label: 'Financial Support', path: '/admin/financial-support' },
    { icon: Beaker, label: 'Lab', path: '/admin/lab' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full min-h-screen flex flex-col">
      <div className="p-6 border-b flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-university-red text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
