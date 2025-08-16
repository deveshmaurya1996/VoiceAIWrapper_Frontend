import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  CREATE_PROJECT, 
  UPDATE_PROJECT, 
  DELETE_PROJECT,
  CREATE_TASK, 
  UPDATE_TASK, 
  DELETE_TASK,
  CREATE_TASK_COMMENT 
} from '@/app/lib/graphql/mutations';
import { GET_ORGANIZATION, GET_PROJECTS, GET_ORGANIZATION_STATS, GET_TASKS } from '@/app/lib/graphql/queries';
import { 
  Project, 
  Task, 
  CreateProjectInput, 
  UpdateProjectInput, 
  CreateTaskInput, 
  UpdateTaskInput, 
  CreateTaskCommentInput 
} from '@/app/types';
import Dashboard from './dashboard/Dashboard';
import ProjectsList from './projects/ProjectsList';
import TasksList from './tasks/TasksList';
import ProjectForm from './projects/ProjectForm';
import TaskForm from './tasks/TaskForm';
import CommentsDisplay from './tasks/CommentsDisplay';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Toast from './ui/Toast';

type View = 'dashboard' | 'projects' | 'tasks' | 'project-form' | 'task-form' | 'comments';

interface AppProps {
  organizationSlug: string;
}

const App: React.FC<AppProps> = ({ organizationSlug }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Queries
  const { data: orgData } = useQuery(GET_ORGANIZATION, {
    variables: { slug: organizationSlug },
  });

  // Mutations
  const [createProject, { loading: creatingProject }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [
      { query: GET_PROJECTS, variables: { organizationSlug } },
      { query: GET_ORGANIZATION_STATS, variables: { organizationSlug } }
    ]
  });

  const [updateProject, { loading: updatingProject }] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [
      { query: GET_PROJECTS, variables: { organizationSlug } }
    ]
  });

  const [createTask, { loading: creatingTask }] = useMutation(CREATE_TASK, {
    refetchQueries: [
      { query: GET_PROJECTS, variables: { organizationSlug } },
      { query: GET_ORGANIZATION_STATS, variables: { organizationSlug } }
    ]
  });

  const [updateTask, { loading: updatingTask }] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      { query: GET_PROJECTS, variables: { organizationSlug } },
      { query: GET_TASKS, variables: { projectId: selectedProject?.id, organizationSlug } },
      { query: GET_ORGANIZATION_STATS, variables: { organizationSlug } }
    ]
  });

  const [createComment, { loading: creatingComment }] = useMutation(CREATE_TASK_COMMENT, {
    refetchQueries: [
      { query: GET_TASKS, variables: { projectId: selectedProject?.id, organizationSlug } },
      { query: GET_PROJECTS, variables: { organizationSlug } },
      { query: GET_ORGANIZATION_STATS, variables: { organizationSlug } }
    ]
  });

  const [deleteProject, { loading: deletingProject }] = useMutation(DELETE_PROJECT, {
    refetchQueries: [
      { query: GET_PROJECTS, variables: { organizationSlug } },
      { query: GET_ORGANIZATION_STATS, variables: { organizationSlug } }
    ]
  });

  const [deleteTask, { loading: deletingTask }] = useMutation(DELETE_TASK, {
    refetchQueries: [
      { query: GET_TASKS, variables: { projectId: selectedProject?.id, organizationSlug } },
      { query: GET_PROJECTS, variables: { organizationSlug } },
      { query: GET_ORGANIZATION_STATS, variables: { organizationSlug } }
    ]
  });

  const organization = orgData?.organization;

  // Toast helpers
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Navigation handlers
  const handleViewDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProject(null);
    setSelectedTask(null);
  };

  const handleViewProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
    setSelectedTask(null);
  };

  const handleViewTasks = (project?: Project) => {
    setCurrentView('tasks');
    setSelectedProject(project || null);
    setSelectedTask(null);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setCurrentView('project-form');
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setCurrentView('project-form');
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setCurrentView('task-form');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentView('task-form');
  };

  const handleViewComments = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('comments');
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
  };

  // Form submission handlers
  const handleProjectSubmit = async (data: CreateProjectInput | UpdateProjectInput) => {
    try {
      if (editingProject) {
        const result = await updateProject({ variables: { input: data } });
        if (result.data?.updateProject?.success) {
          showToast('Project updated successfully!', 'success');
          setCurrentView('projects');
          setEditingProject(null);
        } else if (result.data?.updateProject?.errors) {
          showToast(result.data.updateProject.errors.join(', '), 'error');
        }
      } else {
        const result = await createProject({ variables: { input: data } });
        if (result.data?.createProject?.success) {
          showToast('Project created successfully!', 'success');
          setCurrentView('projects');
          setEditingProject(null);
        } else if (result.data?.createProject?.errors) {
          showToast(result.data.createProject.errors.join(', '), 'error');
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('Failed to save project. Please try again.', 'error');
    }
  };

  const handleTaskSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      if (editingTask) {
        const result = await updateTask({ variables: { input: data } });
        if (result.data?.updateTask?.success) {
          showToast('Task updated successfully!', 'success');
          setCurrentView('tasks');
          setEditingTask(null);
        } else if (result.data?.updateTask?.errors) {
          showToast(result.data.updateTask.errors.join(', '), 'error');
        }
      } else {
        const result = await createTask({ variables: { input: data } });
        if (result.data?.createTask?.success) {
          showToast('Task created successfully!', 'success');
          setCurrentView('tasks');
          setEditingTask(null);
        } else if (result.data?.createTask?.errors) {
          showToast(result.data.createTask.errors.join(', '), 'error');
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
      showToast('Failed to save task. Please try again.', 'error');
    }
  };

  const handleCommentSubmit = async (data: CreateTaskCommentInput) => {
    try {
      const result = await createComment({ variables: { input: data } });
      if (result.data?.createTaskComment?.success) {
        showToast('Comment added successfully!', 'success');
        setCurrentView('tasks');
        setSelectedTask(null);
      } else if (result.data?.createTaskComment?.errors) {
        showToast(result.data.createTaskComment.errors.join(', '), 'error');
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      showToast('Failed to add comment. Please try again.', 'error');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all tasks associated with it.')) {
      try {
        const result = await deleteProject({ variables: { id: projectId } });
        if (result.data?.deleteProject?.success) {
          showToast('Project deleted successfully!', 'success');
          if (currentView === 'tasks' && selectedProject?.id === projectId) {
            setCurrentView('projects');
            setSelectedProject(null);
          }
        } else if (result.data?.deleteProject?.errors) {
          showToast(result.data.deleteProject.errors.join(', '), 'error');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        showToast('Failed to delete project. Please try again.', 'error');
      }
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const result = await deleteTask({ variables: { id: task.id } });
        if (result.data?.deleteTask?.success) {
          showToast('Task deleted successfully!', 'success');
          if (selectedTask?.id === task.id) {
            setSelectedTask(null);
          }
        } else if (result.data?.deleteTask?.errors) {
          showToast(result.data.deleteTask.errors.join(', '), 'error');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task. Please try again.', 'error');
      }
    }
  };

  const handleCancel = () => {
    if (currentView === 'project-form') {
      setCurrentView('projects');
      setEditingProject(null);
    } else if (currentView === 'task-form') {
      setCurrentView('tasks');
      setEditingTask(null);
    } else if (currentView === 'comments') {
      setCurrentView('tasks');
      setSelectedTask(null);
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {organization.name} Project Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={currentView === 'dashboard' ? 'primary' : 'ghost'}
                onClick={handleViewDashboard}
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === 'projects' ? 'primary' : 'ghost'}
                onClick={handleViewProjects}
              >
                Projects
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            organizationSlug={organizationSlug}
            onViewProject={handleViewTasks}
            onEditProject={handleEditProject}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onViewAllProjects={handleViewProjects}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsList
            organizationSlug={organizationSlug}
            onViewProject={handleViewTasks}
            onEditProject={handleEditProject}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onBackToDashboard={handleViewDashboard}
          />
        )}

        {currentView === 'tasks' && (
          <TasksList
            project={selectedProject ? { id: selectedProject.id, name: selectedProject.name } : undefined}
            organizationSlug={organizationSlug}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAddComment={handleViewComments}
            onCreateTask={handleCreateTask}
            onBackToProjects={handleBackToProjects}
          />
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={currentView === 'project-form'}
        onClose={handleCancel}
        size="lg"
      >
        <ProjectForm
          project={editingProject || undefined}
          organizationSlug={organizationSlug}
          onSubmit={handleProjectSubmit}
          onCancel={handleCancel}
          loading={creatingProject || updatingProject || deletingProject}
        />
      </Modal>

      <Modal
        isOpen={currentView === 'task-form'}
        onClose={handleCancel}
        size="lg"
      >
        <TaskForm
          task={editingTask || undefined}
          projectId={selectedProject?.id || ''}
          onSubmit={handleTaskSubmit}
          onCancel={handleCancel}
          loading={creatingTask || updatingTask || deletingTask}
        />
      </Modal>

      <Modal
        isOpen={currentView === 'comments'}
        onClose={handleCancel}
        size="lg"
      >
        <CommentsDisplay
          taskId={selectedTask?.id || ''}
          taskTitle={selectedTask?.title || ''}
          onSubmit={handleCommentSubmit}
          onCancel={handleCancel}
          loading={creatingComment}
        />
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default App;
