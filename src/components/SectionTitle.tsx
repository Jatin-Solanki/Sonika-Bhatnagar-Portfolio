
import React from 'react';

interface SectionTitleProps {
  title: string;
  icon?: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
      {icon && <span className="mr-2">{icon}</span>}
      <h2 className="text-2xl font-bold text-university-dark">{title}</h2>
    </div>
  );
};

export default SectionTitle;
