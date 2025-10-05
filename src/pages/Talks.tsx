
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { Mic, Calendar, MapPin } from 'lucide-react';

const Talks: React.FC = () => {
  const { talks } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Invited Talks</h1>
          
          <SectionTitle title="Conference & Seminar Presentations" icon={<Mic className="w-5 h-5" />} />
          
          <div className="space-y-8 mt-6">
            {talks.map((talk) => (
              <div key={talk.id} className="border-l-4 border-university-red pl-6 py-2">
                <h3 className="text-xl font-semibold">{talk.title}</h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mt-2 space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{talk.venue}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {new Date(talk.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                {talk.description && (
                  <p className="mt-3 text-gray-700">{talk.description}</p>
                )}
              </div>
            ))}
          </div>
          
          {talks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No invited talks available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Talks;
