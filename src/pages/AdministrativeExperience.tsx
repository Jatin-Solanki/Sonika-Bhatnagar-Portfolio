import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { Briefcase } from 'lucide-react';

const AdministrativeExperience: React.FC = () => {
  const { experiences, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 shadow-md animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-l-4 border-gray-300 pl-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-16 bg-gray-300 rounded w-full"></div>
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
        <div className="bg-white rounded-lg p-6 shadow-md">
          <SectionTitle title="Administrative Experience" icon={<Briefcase className="w-5 h-5" />} />
          <div className="space-y-6 mt-6">
            {experiences.map((experience) => (
              <div key={experience.id} className="border-l-4 border-university-red pl-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{experience.title}</h3>
                  <span className="text-sm text-gray-500">
                    {experience.startdate} - {experience.enddate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-1">{experience.company}</p>
                {experience.location && (
                  <p className="text-gray-600 text-sm mb-2">{experience.location}</p>
                )}
                {experience.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">{experience.description}</p>
                )}
              </div>
            ))}
            {experiences.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No administrative experience added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrativeExperience;