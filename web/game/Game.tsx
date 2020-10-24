import React, { useEffect, useRef, useState } from "react";
import lib from "swf-lib";
import { MainTimeline } from "../../game/classes/Exit_fla/MainTimeline";

interface GameProps {
  className?: string;
  library: lib.__internal.AssetLibrary;
}

export const Game: React.FC<GameProps> = (props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<lib.flash.display.Stage | null>(null);

  useEffect(() => {
    const stage = new lib.flash.display.Stage(props.library.properties);
    setStage(stage);

    const game: MainTimeline = props.library.instantiateCharacter(0);
    stage.addChild(game);
  }, [props.library]);

  useEffect(() => {
    if (stage && container.current) {
      const elem = stage.__canvas.container;
      container.current?.appendChild(elem);
      return () => elem.remove();
    }
  }, [stage, container]);

  return <div className={props.className} ref={container} />;
};
