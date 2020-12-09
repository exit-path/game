import flash.external.ExternalInterface;
import flash.events.Event;
import flash.events.KeyboardEvent;
import flash.ui.Keyboard;
import exit_fla.MainTimeline;
import john.Relay;
import john.Key;

@:native("flash.Boot")
class Main extends exit_fla.MainTimeline {
    static var mt: exit_fla.MainTimeline;
    static var mode: String = null;
    static var doReplay = false;
    static var replayIndex: Int = 0;
    static var replayRecording: Array<Int> = [];

    function start() {
        mt = this;
        init();
    }

    function init() {
    }

    override function loadGame(): Dynamic {
        this.newGame();
        haxe.Timer.delay(() -> {
            mt.removeChild(mt.agIntro);
            mt.dispatchEvent(new Relay(Relay.GOTO, "endIntro", " "));
            mt.dispatchEvent(new Relay(Relay.GOTO, "MainMenu", "SinglePlayer"));
        }, 100);
        return null;
    }

    static function main() {
        mt.stage.addEventListener(Event.ENTER_FRAME, onExitFrame);
        mt.gotoAndStop(3);

        ExternalInterface.addCallback("startSPGame", startSPGame);
        ExternalInterface.addCallback("setMode", setMode);
        ExternalInterface.addCallback("setReplay", setReplay);
        ExternalInterface.addCallback("stopReplay", stopReplay);
    }

    static function startSPGame(level: Int) {
        if (mt.multiplayer != null && mt.multiplayer.game != null && mt.multiplayer.game.singlePlayer) {
            mt.dispatchEvent(new Relay(Relay.GOTO, "Game", "SinglePlayerMenu"));
        }

        mt.playerObj.gameLevel = level;
        mt.playerObj.gameTime = 0;
        mt.dispatchEvent(new Relay(Relay.GOTO, "SinglePlayerMenu", "StartGame"));
        doReplay = true;
    }

    static function setMode(value: String) {
        mode = value;
    }

    static function setReplay(value: Array<Int>) {
        replayIndex = 0;
        replayRecording = value;
        doReplay = false;
    }

    static function stopReplay() {
        mode = null;
        mt.stage.dispatchEvent(new Event(Event.DEACTIVATE));
    }

    static function onExitFrame(e: Event) {
        switch (mode) {
        case "recording":
            var shift = Key.isDown(Keyboard.SPACE) || Key.isDown(Keyboard.SHIFT);
            var left = Key.isDown(Key.LEFT);
            var right = Key.isDown(Key.RIGHT);
            var up = Key.isDown(Key.UP);
            var down = Key.isDown(Key.DOWN);

            var keys = 0;
            if (shift) {
                keys |= 1;
            }
            if (left) {
                keys |= 2;
            }
            if (right) {
                keys |= 4;
            }
            if (up) {
                keys |= 8;
            }
            if (down) {
                keys |= 16;
            }
            
            ExternalInterface.call("swf.onFrameKeys", keys);

        case "replaying":
            if (!doReplay) {
                return;
            }
            if (replayIndex >= replayRecording.length) {
                mt.stage.dispatchEvent(new Event(Event.DEACTIVATE));
                mode = null;
                ExternalInterface.call("swf.onReplayFinished");
                return;
            }

            var keys = replayRecording[replayIndex++];
            mt.stage.dispatchEvent(new Event(Event.DEACTIVATE));
            var e = new KeyboardEvent(KeyboardEvent.KEY_DOWN);
            if ((keys & 1) != 0) {
                e.keyCode = Keyboard.SPACE;
                mt.stage.dispatchEvent(e);
            }
            if ((keys & 2) != 0) {
                e.keyCode = Keyboard.LEFT;
                mt.stage.dispatchEvent(e);
            }
            if ((keys & 4) != 0) {
                e.keyCode = Keyboard.RIGHT;
                mt.stage.dispatchEvent(e);
            }
            if ((keys & 8) != 0) {
                e.keyCode = Keyboard.UP;
                mt.stage.dispatchEvent(e);
            }
            if ((keys & 16) != 0) {
                e.keyCode = Keyboard.DOWN;
                mt.stage.dispatchEvent(e);
            }
            
            var playerX = mt.multiplayer.game.player.x;
            var playerY = mt.multiplayer.game.player.y;
            var otherX = 0;
            var otherY = 0;
            var a = 0;
            var b = 0;
            ExternalInterface.call("swf.onReplayRecord", playerX, playerY, otherX, otherY, a, b);
        }
    }
}
