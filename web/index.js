import lib from "swf-lib";
import * as game from "../src/index";

window.onload = async () => {
    const library = await game.__library();

    const props = game.__properties;
    const stage = new lib.flash.display.Stage(props);
    document.getElementById("root").appendChild(stage.__canvas.container);

    stage.addChild(library.instantiateCharacter(0));
};
