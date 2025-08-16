import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASK_COMMENTS } from '@/app/lib/graphql/queries';
import { TaskComment, CreateTaskCommentInput } from '@/app/types';

import { MessageCircle, Send, User, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface CommentsDisplayProps {
  taskId: string;
  taskTitle: string;
  onSubmit: (input: CreateTaskCommentInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CommentsDisplay: React.FC<CommentsDisplayProps> = ({
  taskId,
  taskTitle,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    authorEmail: '',
  });

  const { data, loading: commentsLoading, refetch } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId },
    fetchPolicy: 'network-only',
  });

  const comments = data?.taskComments || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.content.trim() && formData.authorEmail.trim()) {
      onSubmit({
        taskId,
        content: formData.content.trim(),
        authorEmail: formData.authorEmail.trim(),
      });
      setFormData({ content: '', authorEmail: '' });
      // Refetch comments to show the new one
      setTimeout(() => refetch(), 100);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-lg self-center">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
            <p className="text-sm text-gray-600">Task: {taskTitle}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </Button>
      </div>

      <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-gray-50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Your Email"
              type="email"
              placeholder="Enter your email"
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              required
            />
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={loading || !formData.content.trim() || !formData.authorEmail.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
          <div>
            <Textarea
              label="Comment"
              placeholder="Write your comment here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={2}
              required
            />
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {commentsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment: TaskComment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.authorEmail}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
          <Button
            variant="ghost"
            onClick={() => refetch()}
            className="text-blue-600 hover:text-blue-700"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentsDisplay;
