
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { Award, Calendar } from 'lucide-react';

const Awards: React.FC = () => {
  const { awards, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SectionTitle title="Awards Received" icon={<Award className="w-6 h-6" />} />
        
        {awards.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Awards Yet</h3>
            <p className="text-gray-600">Awards and recognitions will be displayed here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {awards.map((award) => (
              <div key={award.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{award.title}</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{award.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Awards;
