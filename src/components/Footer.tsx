
import React from 'react';
import { useData } from '@/context/DataContext';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const { profile, isLoading } = useData();

  if (isLoading || !profile) {
    return (
      <footer className="bg-university-dark text-white pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-university-dark text-white pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <a href={`mailto:${profile.email}`} className="hover:underline">
                {profile.email}
              </a>
            </div>
            {profile.websiteUrl && (
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                <a 
                  href={profile.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Personal Website
                </a>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-3">
              {profile.university ? profile.university.split(',')[0] : 'University'}
            </h3>
            <p>Department of Engineering</p>
            <p>New Delhi, India</p>
          </div>
          
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
            <ul>
              <li className="mb-1">
                <a href="/" className="hover:underline">Home</a>
              </li>
              <li className="mb-1">
                <a href="/publications" className="hover:underline">Publications</a>
              </li>
              <li className="mb-1">
                <a href="/lab" className="hover:underline">Laboratory</a>
              </li>
              <li>
                <a href="/about" className="hover:underline">About</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-6 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} - {profile.name}. All rights reserved.</p>
          <p className="mt-1">
            Built with React, TailwindCSS, and shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
