import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { Navbar } from "./src/components/Navbar";
import { MainScreen } from "./src/screens/MainScreen";
import { TodoScreen } from "./src/screens/TodoScreen";
import { THEME } from "./src/theme";

async function loadApplication() {
  await Font.loadAsync({
    "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf")
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [todos, setTodos] = useState([
    { id: "1", title: "Todo something" },
    { id: "2", title: "Todo something v 2.0" }
  ]);

  if (!appIsReady) {
    return (
      <AppLoading
        startAsync={loadApplication}
        onError={error => console.log("error", error)}
        onFinish={() => setAppIsReady(true)}
      />
    );
  }

  const addTodo = title => {
    setTodos(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title
      }
    ]);
  };

  const removeTodo = id => {
    const todo = todos.find(_todo => _todo.id === id);
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
          onPress: () => {
            setTodoId(null);
            setTodos(prev => prev.filter(todo => todo.id !== id));
          }
        }
      ],
      { cancelable: false }
    );
  };

  const updateTodo = (id, title) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === id) {
          todo.title = title;
        }
        return todo;
      })
    );
  };

  let content = (
    <MainScreen
      todos={todos}
      addTodo={addTodo}
      removeTodo={removeTodo}
      openTodo={setTodoId}
      // openTodo={id => {
      //   setTodoId(id);
      // }}
    />
  );

  if (todoId) {
    const selectedTodo = todos.find(todo => todo.id === todoId);
    content = (
      <TodoScreen
        // либо байндить с null в TodoScreen на onPress вместо стрелочной функции goBack={setTodoId}
        onRemove={removeTodo}
        goBack={() => {
          setTodoId(null);
        }}
        todo={selectedTodo}
        onSave={updateTodo}
      />
    );
  }

  return (
    <View>
      <Navbar title="Todo App" />
      <View style={styles.container}></View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.PADDING_HORIZONTAL,
    paddingVertical: THEME.PADDING_VERTICAL
  }
});
