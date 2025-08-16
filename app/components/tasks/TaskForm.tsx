import React, { useState, useEffect } from 'react';
import { Task } from '@/app/types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { 
  Save, 
  X, 
  ClipboardList, 
  Calendar, 
  User,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  projectId: string;
  onSubmit: (input: TaskFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeEmail: string;
  dueDate: string;
  projectId: string;
  id?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  projectId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeEmail: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigneeEmail: task.assigneeEmail || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }

    if (formData.title.trim().length > 200) {
      newErrors.title = 'Task title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.assigneeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.assigneeEmail)) {
      newErrors.assigneeEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const input: TaskFormData = {
        ...formData,
        projectId,
      };
      
      if (task) {
        input.id = task.id;
      }
      
      onSubmit(input);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'DONE', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <ClipboardList className="text-white h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
        </div>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <div>
          <Input
            label="Task Title"
            placeholder="Enter task title..."
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={errors.title}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Textarea
            label="Description"
            placeholder="Enter task description..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            rows={4}
          />
        </div>

        {/* Status and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Status"
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              options={statusOptions}
            />
          </div>
          <div>
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
              options={priorityOptions}
            />
          </div>
        </div>

        {/* Assignee and Due Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Assignee Email"
              type="email"
              placeholder="assignee@example.com"
              value={formData.assigneeEmail}
              onChange={(e) => handleChange('assigneeEmail', e.target.value)}
              error={errors.assigneeEmail}
            />
          </div>
          <div>
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {task ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                {task ? 'Update Task' : 'Create Task'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;