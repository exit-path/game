import React, { useState } from "react";
import { AppGame } from "./AppGame";
import { AppRecorder } from "./AppRecorder";
import { GameController } from "./controller";

export const App: React.FC = () => {
  const [controller] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return new GameController(!!params.get("recorder"));
  });

  return controller.isRecorderMode ? (
    <AppRecorder controller={controller} />
  ) : (
    <AppGame controller={controller} />
  );
};
