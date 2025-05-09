import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
          {icon}
        </div>
      </div>
      <div className="flex items-end">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};

export default MetricCard;