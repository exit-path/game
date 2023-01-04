import lib from "swf-lib";

export class SoundBox {
  public static muted: boolean = false;

  public constructor() {}

  public static handleMute(): any {
    SoundBox.muted = !SoundBox.muted;
    var s: lib.flash.media.SoundTransform =
      new lib.flash.media.SoundTransform();
    if (SoundBox.muted) {
      s.volume = 0;
    } else {
      s.volume = 1;
    }
    lib.flash.media.SoundMixer.soundTransform = s;
  }

  public static killAll(): any {
    lib.flash.media.SoundMixer.stopAll();
  }

  public static loopSound(str: string): any {
    var TempClass: any = lib.flash.utils.getDefinitionByName(
      str
    ) as lib.__internal.avm2.Class;
    var mySound: any = new TempClass() as lib.flash.media.Sound;
    mySound.play(0, 999999);
  }

  public static playSound(str: string): any {
    var TempClass: any = lib.flash.utils.getDefinitionByName(
      str
    ) as lib.__internal.avm2.Class;
    var mySound: any = new TempClass() as lib.flash.media.Sound;
    mySound.play(0, 1);
  }

  public static stopAllSounds(): any {
    lib.flash.media.SoundMixer.stopAll();
  }

  public stopSound(num: number = 0): any {}
}
