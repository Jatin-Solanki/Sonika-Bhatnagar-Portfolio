
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { Calendar } from 'lucide-react';

const Events: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Events</h1>
          
          <SectionTitle title="Upcoming Events" icon={<Calendar className="w-5 h-5" />} />
          
          <div className="text-center py-8 text-gray-500">
            <p>Events functionality has been removed from this site.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
