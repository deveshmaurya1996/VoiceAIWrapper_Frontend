import React from 'react';
import { Project } from '@/app/types';
import { formatDate } from '@/app/lib/utils';
import StatusBadge from '@/app/components/ui/StatusBadge';
import Button from '@/app/components/ui/Button';
import { 
  Eye, 
  Edit3, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onViewTasks: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onViewTasks,
  onDelete,
}) => {

    return (
    <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 h-full min-h-[220px] group">
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {project.description || 'No description'}
              </p>
            </div>
            <StatusBadge type="status" value={project.status} />
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Progress</span>
              <span className="text-gray-900 font-medium">
                {project.completionRate || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  (project.completionRate || 0) === 100 
                    ? 'bg-green-500' 
                    : (project.completionRate || 0) > 50 
                      ? 'bg-blue-500' 
                      : (project.completionRate || 0) > 25 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.max(0, Math.min(100, project.completionRate || 0))}%` 
                }}
              />
            </div>
            {project.taskCount === 0 && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                No tasks yet
              </div>
            )}
            {(project.taskCount || 0) > 0 && (
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span>{project.completedTasksCount || 0} completed</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-blue-500" />
                  <span>{project.taskCount - (project.completedTasksCount || 0)} remaining</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewTasks(project)}
              className="flex-1 group-hover:scale-105 transition-transform duration-200"
            >
              <Eye className="mr-1 h-3 w-3" />
              View Tasks
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(project)}
              className="group-hover:scale-105 transition-transform duration-200"
            >
              <Edit3 className="mr-1 h-3 w-3" />
              Edit
            </Button>
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(project.id)}
                className="group-hover:scale-105 transition-transform duration-200"
                title="Delete Project"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
