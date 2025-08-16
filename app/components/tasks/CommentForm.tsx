import React, { useState } from 'react';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import { 
  Send, 
  X, 
  MessageSquare, 
} from 'lucide-react';

interface CommentFormProps {
  taskId: string;
  onSubmit: (input: CommentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface CommentFormData {
  content: string;
  authorEmail: string;
  taskId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  taskId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    authorEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Comment content is required';
    }

    if (formData.content.trim().length < 3) {
      newErrors.content = 'Comment must be at least 3 characters';
    }

    if (formData.content.trim().length > 500) {
      newErrors.content = 'Comment must be less than 500 characters';
    }

    if (!formData.authorEmail.trim()) {
      newErrors.authorEmail = 'Author email is required';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.authorEmail.trim())) {
      newErrors.authorEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const input: CommentFormData = {
        content: formData.content.trim(),
        authorEmail: formData.authorEmail.trim(),
        taskId,
      };
      
      onSubmit(input);
      
      // Reset form after successful submission
      setFormData({ content: '', authorEmail: '' });
      setErrors({});
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <MessageSquare className="text-white h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Add Comment</h2>
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
        {/* Comment Content */}
        <div>
          <Textarea
            label="Comment"
            placeholder="Write your comment here..."
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            error={errors.content}
            rows={4}
            required
          />
        </div>

        {/* Author Email */}
        <div>
          <Input
            label="Your Email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.authorEmail}
            onChange={(e) => handleChange('authorEmail', e.target.value)}
            error={errors.authorEmail}
            required
          />
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
                Posting...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
