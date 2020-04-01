import React, { useReducer, useContext } from "react";
import { Alert } from "react-native";
import { TodoContext } from "./todoContext.js";
import { todoReducer } from "./todoReducer.js";
import {
  ADD_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_ERROR,
  CLEAR_ERROR,
  FETCH_TODOS
} from "../types.js";
import { ScreenContext } from "../screen/screenContext.js";
import { Http } from "../../http";

const initialState = {
  todos: [],
  loading: false,
  error: null
};

export const TodoState = ({ children }) => {
  const { changeScreen } = useContext(ScreenContext);
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = async () => {
    showLoader();
    clearError();
    try {
      const data = Http.get(
        "https://rn-todo-app-fbf44.firebaseio.com/todos.json"
      );
      const todos = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));

      dispatch({ type: FETCH_TODOS, todos });
      hideLoader();
    } catch (e) {
      console.error(e);
      showError("Что-то пошло не так...");
    } finally {
      hideLoader();
    }
  };

  const addTodo = async title => {
    clearError();
    try {
      const data = await Http.post(
        "https://rn-todo-app-fbf44.firebaseio.com/todos.json",
        { title }
      );
      dispatch({ type: ADD_TODO, title, id: data.name });
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Добавление элемента",
        `Вы уверены, что хотите добавить "${title}" без сохранения на сервере?`,
        [
          {
            text: "Отмена",
            style: "cancel"
          },
          {
            text: "Добавить",
            style: "destructive",
            onPress: () =>
              dispatch({ type: ADD_TODO, title, id: Date.now().toString() })
          }
        ],
        { cancelable: false }
      );
    }
  };

  const removeTodo = id => {
    const todo = state.todos.find(t => t.id === id);

    Alert.alert(
      "Удаление элемента",
      `Вы уверены, что хотите удалить "${todo.title}"?`,
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            changeScreen(null);
            await Http.delete(
              `https://rn-todo-app-fbf44.firebaseio.com/todos/${id}.json`
            );
            dispatch({ type: REMOVE_TODO, id });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const updateTodo = async (id, title) => {
    clearError();
    try {
      await Http.patch(
        `https://rn-todo-app-fbf44.firebaseio.com/todos/${id}.json`,
        { title }
      );
      dispatch({ type: UPDATE_TODO, id, title });
    } catch (e) {
      showError("Что-то пошло не так...");
      console.log(e);
    }
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  const hideLoader = () => dispatch({ type: HIDE_LOADER });

  const showError = error => dispatch({ type: SHOW_ERROR, error });

  const clearError = () => dispatch({ type: CLEAR_ERROR });

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        addTodo,
        removeTodo,
        updateTodo,
        fetchTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
