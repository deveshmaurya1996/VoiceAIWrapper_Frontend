import React, { useState, useEffect } from 'react';
import { Project } from '@/app/types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { 
  Save, 
  X, 
  FolderOpen, 
  Calendar, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
  organizationSlug: string;
  onSubmit: (input: ProjectFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  dueDate: string;
  organizationSlug: string;
  id?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  organizationSlug,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [project]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    if (formData.name.trim().length > 200) {
      newErrors.name = 'Project name must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const input: ProjectFormData = {
        ...formData,
        organizationSlug,
      };
      
      if (project) {
        input.id = project.id;
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
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <FolderOpen className="text-white h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Create New Project'}
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
        {/* Project Name */}
        <div>
          <Input
            label="Project Name"
            placeholder="Enter project name..."
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Textarea
            label="Description"
            placeholder="Enter project description..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            rows={4}
          />
        </div>

        {/* Status and Due Date Row */}
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {project ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                {project ? 'Update Project' : 'Create Project'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
