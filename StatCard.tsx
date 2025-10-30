
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  colorClass?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, colorClass = 'text-brand-text-primary', description }) => {
  return (
    <div className="bg-brand-surface p-5 rounded-lg border border-brand-border shadow-md flex flex-col justify-between">
      <div>
        <p className="text-sm font-medium text-brand-text-secondary">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
      </div>
      {description && <p className="text-xs text-brand-text-secondary mt-2">{description}</p>}
    </div>
  );
};

export default StatCard;