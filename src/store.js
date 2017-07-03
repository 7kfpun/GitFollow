import { createStore } from 'redux';

const ACTIONS = {
  LOGIN: ({ todos, ...state }, { user }) => ({
    ...state,
    user,
  }),

  LOGOUT: ({ todos, ...state }) => ({
    ...state,
    user: {},
  }),

  ADD_TODO: ({ todos, ...state }, { text }) => ({
    todos: [...todos, {
      id: Math.random().toString(36).substring(2),
      text,
    }],
    ...state,
  }),

  REMOVE_TODO: ({ todos, ...state }, { todo }) => ({
    todos: todos.filter(i => i !== todo),
    ...state,
  }),

  SELECT_ORGANIZATION: ({ todos, ...state }, { organization }) => ({
    ...state,
    selectedOrganization: organization,
  }),

  SELECT_REPO: ({ todos, ...state }, { repo }) => ({
    ...state,
    selectedRepo: repo,
  }),

  ADD_ORGANIZATION: ({ todos, ...state }, { organization }) => ({
    ...state,
    addOrganization: organization,
  }),
};

const INITIAL = {
  todos: [],
};

export default createStore((state, action) => (
  action && ACTIONS[action.type] ? ACTIONS[action.type](state, action) : state
), INITIAL, window.devToolsExtension && window.devToolsExtension());
