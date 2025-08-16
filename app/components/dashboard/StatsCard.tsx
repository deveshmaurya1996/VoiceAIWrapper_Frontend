import React from 'react';
import { OrganizationStats } from '@/app/types';
import { 
  FolderOpen, 
  Rocket, 
  CheckCircle, 
  ClipboardList, 
  Target, 
  TrendingUp 
} from 'lucide-react';

interface StatsCardProps {
  stats: OrganizationStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      color: 'bg-blue-500',
      icon: <FolderOpen className="h-6 w-6 text-white" />,
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      color: 'bg-green-500',
      icon: <Rocket className="h-6 w-6 text-white" />,
    },
    {
      label: 'Completed Projects',
      value: stats.completedProjects,
      color: 'bg-purple-500',
      icon: <CheckCircle className="h-6 w-6 text-white" />,
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      color: 'bg-orange-500',
      icon: <ClipboardList className="h-6 w-6 text-white" />,
    },
    {
      label: 'Completed Tasks',
      value: stats.completedTasks,
      color: 'bg-teal-500',
      icon: <Target className="h-6 w-6 text-white" />,
    },
    {
      label: 'Avg Completion Rate',
      value: `${stats.avgCompletionRate}%`,
      color: 'bg-indigo-500',
      icon: <TrendingUp className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">{item.label}</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                {item.value}
              </p>
            </div>
            <div className={`${item.color} rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
