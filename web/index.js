import lib from "swf-lib";

window.onload = async () => {
    const game = await import("../src/index");
    const library = await game.__library();

    const props = game.__properties;
    const stage = new lib.flash.display.Stage(props);
    document.getElementById("root").appendChild(stage.__canvas.element);

    stage.addChild(library.instantiateCharacter(0));
};
