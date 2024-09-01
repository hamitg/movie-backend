export const SWAGGER_CONFIG = {
  title: 'Your API',
  description: 'API description',
  version: '1.0',
  tag: 'api',
};

export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_NAME = 'API';
export const SWAGGER_API_DESCRIPTION = 'API Description';

export const AUTH = {
  LOGIN: {
    summary: 'User login',
    description: 'Authenticate user and get JWT token.',
  },
  REGISTER: {
    summary: 'Register new user',
    description: 'Create a new user account.',
  },
};

export const MOVIES = {
  CREATE: {
    summary: 'Create a new movie',
    description: 'Create a new movie entry. Only accessible by managers.',
  },
  FIND_ALL: {
    summary: 'Get all movies',
    description:
      'Retrieve a list of all movies with optional pagination, filtering, and sorting.',
  },
  FIND_ONE: {
    summary: 'Get a specific movie',
    description: 'Retrieve details of a specific movie by its ID.',
  },
  UPDATE: {
    summary: 'Update a movie',
    description:
      'Update details of a specific movie. Only accessible by managers.',
  },
  REMOVE: {
    summary: 'Delete a movie',
    description:
      'Remove a specific movie from the database. Only accessible by managers.',
  },
  BULK_CREATE: {
    summary: 'Create multiple movies',
    description:
      'Create multiple movie entries at once. Only accessible by managers.',
  },
  BULK_REMOVE: {
    summary: 'Delete multiple movies',
    description:
      'Remove multiple movies from the database. Only accessible by managers.',
  },
  ADD_SESSION: {
    summary: 'Add session to a movie',
    description:
      'Add one or more screening sessions to a specific movie. Only accessible by managers.',
  },
  GET_MOVIE_SESSIONS: {
    summary: 'Get movie sessions',
    description: 'Retrieve all screening sessions for a specific movie.',
  },
};

export const USERS = {
  ATTEND_SESSION: {
    summary: 'Attend a movie session',
    description: 'Mark a user as attending a specific movie session.',
  },
  GET_WATCH_HISTORY: {
    summary: 'Get user watch history',
    description: 'Retrieve the watch history for a specific user.',
  },
  BUY_TICKET: {
    summary: 'Buy a ticket',
    description: 'Purchase a ticket for a specific movie session.',
  },
  GET_USER: {
    summary: 'Get user details',
    description: 'Retrieve details of a specific user by their ID.',
  },
  CREATE_USER: {
    summary: 'Create a new user',
    description: 'Create a new user account. Only accessible by managers.',
  },
  DELETE_USER: {
    summary: 'Delete a user',
    description: 'Remove a specific user from the database.',
  },
  UPDATE_USER: {
    summary: 'Update a user',
    description:
      'Update details of a specific user. Only accessible by managers.',
  },
};
