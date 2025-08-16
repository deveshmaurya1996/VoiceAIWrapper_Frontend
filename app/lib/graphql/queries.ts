import { gql } from '@apollo/client';

export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!) {
    projects(organizationSlug: $organizationSlug) {
      id
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      taskCount
      completedTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      taskCount
      completedTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID, $organizationSlug: String) {
    tasks(projectId: $projectId, organizationSlug: $organizationSlug) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
      updatedAt
      task {
        id
        title
      }
    }
  }
`;

export const GET_ORGANIZATION_STATS = gql`
  query GetOrganizationStats($organizationSlug: String!) {
    organizationStats(organizationSlug: $organizationSlug)
  }
`;
