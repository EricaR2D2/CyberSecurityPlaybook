import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-aw-deep-blue border border-aw-medium-blue rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode, icon?: React.ReactNode }> = ({ children, icon }) => (
    <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-aw-accent">{icon}</div>}
        <h2 className="text-xl font-semibold text-aw-text-primary">{children}</h2>
    </div>
);

// FIX: Added `className` prop to CardContent to allow for custom styling, which was causing a type error in ReportModal.tsx.
export const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`text-aw-text-secondary ${className}`}>
    {children}
  </div>
);


export default Card;