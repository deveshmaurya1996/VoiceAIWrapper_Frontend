import React from 'react';
import { Task } from '@/app/types';
import { formatDate } from '@/app/lib/utils';
import StatusBadge from '@/app/components/ui/StatusBadge';
import Button from '@/app/components/ui/Button';
import { 
  User, 
  Calendar, 
  MessageSquare, 
  Edit3, 
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddComment: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onAddComment,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-100';
      case 'HIGH':
        return 'text-orange-600 bg-orange-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'LOW':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <AlertCircle className="h-3 w-3" />;
      case 'HIGH':
        return <AlertCircle className="h-3 w-3" />;
      case 'MEDIUM':
        return <Clock className="h-3 w-3" />;
      case 'LOW':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 min-w-0">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {task.description || 'No description'}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2 ml-4">
            <StatusBadge type="status" value={task.status} />
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              <span className="ml-1">{task.priority}</span>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-3">
          {/* Assignee */}
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-blue-500" />
            <span className="block mb-1">Assignee:</span>
            <p className="truncate ml-2 font-medium text-gray-900" title={task.assigneeEmail}>
              {task.assigneeEmail || 'Unassigned'}
            </p>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span className="block mb-1">Due Date:</span>
              <span className="ml-2 font-medium text-gray-900">
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddComment(task)}
            className="flex-1"
          >
            <MessageSquare className="mr-1 h-3 w-3" />
            Comment
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
          >
            <Edit3 className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
