import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '@/app/lib/graphql/queries';
import { Task } from '@/app/types';
import TaskCard from './TaskCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

interface TasksListProps {
  project?: { id: string; name: string };
  organizationSlug: string;
  onBackToProjects: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onAddComment: (task: Task) => void;
  onCreateTask: () => void;
}

const TasksList: React.FC<TasksListProps> = ({
  project,
  organizationSlug,
  onBackToProjects,
  onEditTask,
  onDeleteTask,
  onAddComment,
  onCreateTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<{ tasks: Task[] }>(GET_TASKS, {
    variables: { 
      projectId: project?.id, 
      organizationSlug 
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (project?.id) {
      refetch();
    }
  }, [project?.id, refetch]);

  const tasks = useMemo(() => data?.tasks || [], [data?.tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.assigneeEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'DONE', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">
          Error loading tasks. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        {loading && data && (
          <div className="absolute top-4 right-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBackToProjects}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project ? `${project.name} Tasks` : 'All Tasks'}
            </h1>
            <p className="text-gray-600 mt-2">
              {project 
                ? `Manage tasks for ${project.name}` 
                : 'Manage all tasks across your organization'
              }
            </p>
          </div>
        </div>
        <Button onClick={onCreateTask} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              label="Search Tasks"
              placeholder="Search by title, description, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div>
            <Select
              label="Filter by Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              icon={<Filter className="h-4 w-4" />}
            />
          </div>
          <div>
            <Select
              label="Filter by Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={priorityOptions}
              icon={<Filter className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' ? (
            <>
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400 h-10 w-10" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="text-gray-400 h-10 w-10" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first task
              </p>
              <Button onClick={onCreateTask}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredTasks.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
};

export default TasksList;
