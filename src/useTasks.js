import { useReducer, useEffect } from 'react';



const tasksMock={tasks:[
  {id:'1',state:'TASK_PINNED',title:'task1'},
  {id:'2',state:'TASK_INBOX',title:'task2'},
]};

async function getTasks(options) {
  return fetch('/tasks', options).then((res) => res.json());
  // return Promise.resolve( tasksMock);
}

function updateTask(tasks, id, updatedTask) {
  return tasks.map((task) =>
    task.id === id ? { ...task, ...updatedTask } : task
  );
}



export const reducer = (tasks, action) => {
  switch (action.type) {
    case 'UPDATE_TASKS':
      return action.tasks;
    case 'ARCHIVE_TASK':
      return updateTask(tasks, action.id, { state: 'TASK_ARCHIVED' });
    case 'PIN_TASK':
      return updateTask(tasks, action.id, { state: 'TASK_PINNED' });
    case 'INBOX_TASK':
      return updateTask(tasks, action.id, { state: 'TASK_INBOX' });
    case 'EDIT_TITLE':
      return updateTask(tasks, action.id, { title: action.title });
    default:
      return tasks;
  }
};

export function useTasks() {
  const [tasks, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getTasks({ signal })
      .then(({ tasks }) => {
        dispatch({ type: 'UPDATE_TASKS', tasks });
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          console.log(error);
        }
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return [tasks, dispatch];
}
