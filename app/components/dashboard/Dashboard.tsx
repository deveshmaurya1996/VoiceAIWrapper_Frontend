import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATION_STATS, GET_PROJECTS } from '@/app/lib/graphql/queries';
import { OrganizationStats, Project } from '@/app/types';
import StatsCard from './StatsCard';
import ProjectCard from '../projects/ProjectCard';
import Button from '../ui/Button';
import { 
  Plus, 
  FolderOpen, 
  Settings, 
  Rocket, 
  BarChart3, 
  FolderPlus,
  TrendingUp,
  Zap
} from 'lucide-react';

interface DashboardProps {
  organizationSlug: string;
  onViewProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onCreateProject: () => void;
  onDeleteProject?: (projectId: string) => void;
  onViewAllProjects: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  organizationSlug,
  onViewProject,
  onEditProject,
  onCreateProject,
  onDeleteProject,
  onViewAllProjects,
}) => {
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useQuery<{ organization_stats: OrganizationStats }>(GET_ORGANIZATION_STATS, {
    variables: { organizationSlug },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery<{ projects: Project[] }>(GET_PROJECTS, {
    variables: { organizationSlug },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if ((statsLoading && !statsData) || (projectsLoading && !projectsData)) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (statsError || projectsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">
          Error loading dashboard data. Please try again later.
        </p>
      </div>
    );
  }

  const stats = statsData?.organization_stats;
  const projects = projectsData?.projects || [];

  return (
    <div className="space-y-8 relative">
      {/* Loading Indicators */}
      {(statsLoading || projectsLoading) && (statsData || projectsData) && (
        <div className="absolute top-4 right-4 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 bg-white p-1 rounded-full"></div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">Welcome back! 👋</h1>
            <p className="text-blue-100 text-lg">
              Here&apos;s what&apos;s happening with your projects today
            </p>
          </div>
          <Button 
            onClick={onCreateProject} 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Project
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
            <Zap className="text-white h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onCreateProject}
            className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <Plus className="text-white h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-blue-900">New Project</p>
              <p className="text-sm text-blue-600">Start a new project</p>
            </div>
          </button>
          
          <button
            onClick={onViewAllProjects}
            className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <FolderOpen className="text-white h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-green-900">View All</p>
              <p className="text-sm text-green-600">Browse all projects</p>
            </div>
          </button>
          
          <button
            onClick={onViewAllProjects}
            className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <Settings className="text-white h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-purple-900">Manage</p>
              <p className="text-sm text-purple-600">Organize projects</p>
            </div>
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
              <BarChart3 className="text-white h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Organization Overview</h2>
          </div>
          <StatsCard stats={stats} />
        </div>
      )}

      {/* Recent Projects */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <Rocket className="text-white h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
              <p className="text-gray-600 text-sm">Your latest active projects</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onViewAllProjects}
            className="border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
          >
            View All Projects
            <TrendingUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderPlus className="text-gray-400 h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No projects yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building amazing things! Create your first project to get started with project management.
            </p>
            <Button 
              onClick={onCreateProject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEditProject}
                onViewTasks={() => onViewProject(project)}
                onDelete={onDeleteProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
