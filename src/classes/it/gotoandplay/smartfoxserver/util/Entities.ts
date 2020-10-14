export class Entities {
  private static ascTab: any[] = [];

  private static ascTabRev: any[] = [];

  private static hexTable: any[] = new Array<any>();

  public constructor() {}

  public static __cctor() {
    Entities.ascTab[">"] = "&gt;";
    Entities.ascTab["<"] = "&lt;";
    Entities.ascTab["&"] = "&amp;";
    Entities.ascTab["'"] = "&apos;";
    Entities.ascTab['"'] = "&quot;";
    Entities.ascTabRev["&gt;"] = ">";
    Entities.ascTabRev["&lt;"] = "<";
    Entities.ascTabRev["&amp;"] = "&";
    Entities.ascTabRev["&apos;"] = "'";
    Entities.ascTabRev["&quot;"] = '"';
    Entities.hexTable["0"] = 0;
    Entities.hexTable["1"] = 1;
    Entities.hexTable["2"] = 2;
    Entities.hexTable["3"] = 3;
    Entities.hexTable["4"] = 4;
    Entities.hexTable["5"] = 5;
    Entities.hexTable["6"] = 6;
    Entities.hexTable["7"] = 7;
    Entities.hexTable["8"] = 8;
    Entities.hexTable["9"] = 9;
    Entities.hexTable["A"] = 10;
    Entities.hexTable["B"] = 11;
    Entities.hexTable["C"] = 12;
    Entities.hexTable["D"] = 13;
    Entities.hexTable["E"] = 14;
    Entities.hexTable["F"] = 15;
  }

  public static decodeEntities(st: string): string {
    var strbuff: any = null;
    var ch: any = null;
    var ent: any = null;
    var chi: any = null;
    var item: any = null;
    var i: number = 0;
    strbuff = "";
    while (i < st.length) {
      ch = st.charAt(i);
      if (ch == "&") {
        ent = ch;
        do {
          i++;
          chi = st.charAt(i);
          ent = ent + chi;
        } while (chi != ";" && i < st.length);
        item = Entities.ascTabRev[ent];
        if (item != null) {
          strbuff = strbuff + item;
        } else {
          strbuff = strbuff + String.fromCharCode(Entities.getCharCode(ent));
        }
      } else {
        strbuff = strbuff + ch;
      }
      i++;
    }
    return strbuff;
  }

  public static encodeEntities(st: string): string {
    var ch: any = null;
    var cod: number = 0;
    var strbuff: string = "";
    for (var i: number = 0; i < st.length; i++) {
      ch = st.charAt(i);
      cod = st.charCodeAt(i);
      if (cod == 9 || cod == 10 || cod == 13) {
        strbuff = strbuff + ch;
      } else if (cod >= 32 && cod <= 126) {
        if (Entities.ascTab[ch] != null) {
          strbuff = strbuff + Entities.ascTab[ch];
        } else {
          strbuff = strbuff + ch;
        }
      } else {
        strbuff = strbuff + ch;
      }
    }
    return strbuff;
  }

  public static getCharCode(ent: string): number {
    var hex: string = ent.substr(3, ent.length);
    hex = hex.substr(0, hex.length - 1);
    return Number("0x" + hex);
  }
}
