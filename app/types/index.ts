export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  organization: Organization;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedTasksCount: number;
  completionRate: number;
}

export interface Task {
  id: string;
  project: Project;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  task: Task;
  content: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  avgCompletionRate: number;
}

export interface CreateProjectInput {
  organizationSlug: string;
  name: string;
  description?: string;
  status?: string;
  dueDate?: string;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  status?: string;
  dueDate?: string;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeEmail?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeEmail?: string;
  dueDate?: string;
}

export interface CreateTaskCommentInput {
  taskId: string;
  content: string;
  authorEmail: string;
}
