import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useData();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="\NSUT-University.png" 
              alt="University Logo" 
              className="h-16 w-16 mr-3"
            />
            <h1 className="text-xl md:text-2xl font-bold text-university-dark">
              Netaji Subhas University Of Technology
            </h1>
          </Link>
        </div>

        <nav className="flex flex-wrap justify-center md:justify-end space-x-1 py-4 w-full md:w-auto">
          <Link
            to="/"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/about') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            About me
          </Link>
          <Link
            to="/administrative-experience"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/administrative-experience') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Administrative Experience
          </Link>
          <Link
            to="/lab"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/lab') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Lab Page
          </Link>
          <Link
            to="/publications"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/publications') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Publication
          </Link>
          <Link
            to="/talks"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/talks') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Invited Talks
          </Link>
          <Link
            to="/activities"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/activities') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Academic Activities
          </Link>
          <Link
            to="/awards"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/awards') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Awards
          </Link>
          <Link
            to="/financial-support"
            className={`px-4 py-2 text-sm md:text-base ${
              isActive('/financial-support') ? 'text-university-red font-medium' : 'text-university-dark'
            }`}
          >
            Financial Support
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className={`px-4 py-2 text-sm md:text-base ${
                  location.pathname.startsWith('/admin') ? 'text-university-red font-medium' : 'text-university-dark'
                }`}
              >
                Admin
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="ml-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="ml-2">
                <LockKeyhole className="h-4 w-4 mr-1" />
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;