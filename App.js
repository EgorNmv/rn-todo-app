import React, { useState } from "react";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { MainLayout } from "./src/MainLayout";
import { TodoState } from "./src/context/todo/todoState";
import { ScreenState } from "./src/context/screen/ScreenState";

async function loadApplication() {
  await Font.loadAsync({
    "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf")
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  if (!appIsReady) {
    return (
      <AppLoading
        startAsync={loadApplication}
        onError={error => console.log("error", error)}
        onFinish={() => setAppIsReady(true)}
      />
    );
  }

  return (
    <ScreenState>
      <TodoState>
        <MainLayout />
      </TodoState>
    </ScreenState>
  );
}
