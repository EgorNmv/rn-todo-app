import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Navbar } from "./src/components/Navbar";
import { MainScreen } from "./src/screens/MainScreen";
import { TodoScreen } from "./src/screens/TodoScreen";

export default function App() {
  const [todoId, setTodoId] = useState(null);
  const [todos, setTodos] = useState([
    { id: "1", title: "Todo something" },
    { id: "2", title: "Todo something v 2.0" }
  ]);

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
    setTodos(prev => prev.filter(todo => todo.id !== id));
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
        goBack={() => {
          setTodoId(null);
        }}
        todo={selectedTodo}
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
    paddingHorizontal: 30,
    paddingVertical: 20
  }
});
