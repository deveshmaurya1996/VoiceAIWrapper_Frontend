import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      success
      errors
      project {
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
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      success
      errors
      project {
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
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      success
      errors
      task {
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
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      success
      errors
      task {
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
  }
`;

export const CREATE_TASK_COMMENT = gql`
  mutation CreateTaskComment($input: CreateTaskCommentInput!) {
    createTaskComment(input: $input) {
      success
      errors
      comment {
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
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      errors
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      errors
    }
  }
`;
