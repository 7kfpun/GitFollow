export function login(user) {
  return {
    type: 'LOGIN',
    user,
  };
}

export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text,
  };
}

export function removeTodo(todo) {
  return {
    type: 'REMOVE_TODO',
    todo,
  };
}

export function selectOrganization(organization) {
  return {
    type: 'SELECT_ORGANIZATION',
    organization,
  };
}

export function selectRepo(repo) {
  return {
    type: 'SELECT_REPO',
    repo,
  };
}

export function addOrganization(organization) {
  return {
    type: 'ADD_ORGANIZATION',
    organization,
  };
}
