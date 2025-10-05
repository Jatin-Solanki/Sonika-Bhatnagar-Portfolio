
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { DollarSign, Clock } from 'lucide-react';

const FinancialSupport: React.FC = () => {
  const { financialSupports, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
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
        <SectionTitle title="Financial Support Received" icon={<DollarSign className="w-6 h-6" />} />
        
        {financialSupports.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Financial Support Records</h3>
            <p className="text-gray-600">Financial support and grants will be displayed here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {financialSupports.map((support) => (
              <div key={support.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{support.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Fund Received: </span>
                    <span className="ml-1">{support.fundReceived}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">Duration: </span>
                    <span className="ml-1">{support.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialSupport;
