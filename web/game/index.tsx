import React, { useEffect, useState } from "react";
import lib from "swf-lib";
import { Game } from "./Game";
import { loadLibrary } from "./library";

const GameLoader: React.FC = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [library, setLibrary] = useState<lib.__internal.AssetLibrary>();

  useEffect(() => {
    loadLibrary((progress) => setProgress(progress))
      .then((lib) => setLibrary(lib))
      .catch((err) => setError(String(err)));
  }, []);

  if (error) {
    return <pre>{error}</pre>;
  }
  if (library) {
    return <Game library={library} />;
  }
  return (
    <pre>Loading... {progress != null ? `${progress.toFixed(0)}%` : ""}</pre>
  );
};

export default GameLoader;
