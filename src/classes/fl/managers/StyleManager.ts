import lib from "swf-lib";
import { UIComponent } from "../core/UIComponent";

export class StyleManager {
  private declare static _instance: StyleManager;

  private declare classToDefaultStylesDict: lib.flash.utils.Dictionary;

  private declare classToInstancesDict: lib.flash.utils.Dictionary;

  private declare classToStylesDict: lib.flash.utils.Dictionary;

  private declare globalStyles: any;

  private declare styleToClassesHash: any;

  public constructor() {
    this.styleToClassesHash = {};
    this.classToInstancesDict = new lib.flash.utils.Dictionary(true);
    this.classToStylesDict = new lib.flash.utils.Dictionary(true);
    this.classToDefaultStylesDict = new lib.flash.utils.Dictionary(true);
    this.globalStyles = UIComponent.getStyleDefinition();
  }

  public static clearComponentStyle(param1: any, param2: string): void {
    var _loc3_: lib.__internal.avm2.Class = StyleManager.getClassDef(param1);
    var _loc4_: any = StyleManager.getInstance().classToStylesDict[_loc3_];
    if (_loc4_ != null && _loc4_[param2] != null) {
      delete _loc4_[param2];
      StyleManager.invalidateComponentStyle(_loc3_, param2);
    }
  }

  public static clearStyle(param1: string): void {
    StyleManager.setStyle(param1, null);
  }

  private static getClassDef(param1: any): lib.__internal.avm2.Class {
    var component: any = param1;
    if (component instanceof lib.__internal.avm2.Class) {
      return component as lib.__internal.avm2.Class;
    }
    try {
      return lib.flash.utils.getDefinitionByName(
        lib.flash.utils.getQualifiedClassName(component)
      ) as lib.__internal.avm2.Class;
    } catch (e) {
      if (component instanceof UIComponent) {
        try {
          return component.loaderInfo.applicationDomain.getDefinition(
            lib.flash.utils.getQualifiedClassName(component)
          ) as lib.__internal.avm2.Class;
        } catch (e) {}
      }
    }
    return null;
  }

  public static getComponentStyle(param1: any, param2: string): any {
    var _loc3_: lib.__internal.avm2.Class = StyleManager.getClassDef(param1);
    var _loc4_: any = StyleManager.getInstance().classToStylesDict[_loc3_];
    return _loc4_ == null ? null : _loc4_[param2];
  }

  private static getInstance(): any {
    if (StyleManager._instance == null) {
      StyleManager._instance = new StyleManager();
    }
    return StyleManager._instance;
  }

  private static getSharedStyle(param1: UIComponent, param2: string): any {
    var _loc3_: lib.__internal.avm2.Class = StyleManager.getClassDef(param1);
    var _loc4_: StyleManager = StyleManager.getInstance();
    var _loc5_: any = _loc4_.classToStylesDict[_loc3_][param2];
    if (_loc5_ != null) {
      return _loc5_;
    }
    _loc5_ = _loc4_.globalStyles[param2];
    if (_loc5_ != null) {
      return _loc5_;
    }
    return _loc4_.classToDefaultStylesDict[_loc3_][param2];
  }

  public static getStyle(param1: string): any {
    return StyleManager.getInstance().globalStyles[param1];
  }

  private static invalidateComponentStyle(
    param1: lib.__internal.avm2.Class,
    param2: string
  ): void {
    var _loc4_: any = null;
    var _loc5_: any = null;
    var _loc3_: lib.flash.utils.Dictionary = StyleManager.getInstance()
      .classToInstancesDict[param1];
    if (_loc3_ == null) {
      return;
    }
    for (_loc4_ in _loc3_) {
      _loc5_ = _loc4_ as UIComponent;
      if (_loc5_ != null) {
        _loc5_.setSharedStyle(
          param2,
          StyleManager.getSharedStyle(_loc5_, param2)
        );
      }
    }
  }

  private static invalidateStyle(param1: string): void {
    var _loc3_: any = null;
    var _loc2_: lib.flash.utils.Dictionary = StyleManager.getInstance()
      .styleToClassesHash[param1];
    if (_loc2_ == null) {
      return;
    }
    for (_loc3_ in _loc2_) {
      StyleManager.invalidateComponentStyle(
        _loc3_ as lib.__internal.avm2.Class,
        param1
      );
    }
  }

  public static registerInstance(param1: UIComponent): void {
    var target: lib.__internal.avm2.Class = null;
    var defaultStyles: any = null;
    var styleToClasses: any = null;
    var n: string = null;
    var instance: UIComponent = param1;
    var inst: StyleManager = StyleManager.getInstance();
    var classDef: lib.__internal.avm2.Class = StyleManager.getClassDef(
      instance
    );
    if (classDef == null) {
      return;
    }
    if (inst.classToInstancesDict[classDef] == null) {
      inst.classToInstancesDict[classDef] = new lib.flash.utils.Dictionary(
        true
      );
      target = classDef;
      while (defaultStyles == null) {
        if (target["getStyleDefinition"] != null) {
          defaultStyles = target["getStyleDefinition"]();
          break;
        }
        try {
          target = instance.loaderInfo.applicationDomain.getDefinition(
            lib.flash.utils.getQualifiedSuperclassName(target)
          ) as lib.__internal.avm2.Class;
        } catch (err) {
          try {
            target = lib.flash.utils.getDefinitionByName(
              lib.flash.utils.getQualifiedSuperclassName(target)
            ) as lib.__internal.avm2.Class;
          } catch (e) {
            defaultStyles = UIComponent.getStyleDefinition();
            break;
          }
          continue;
        }
      }
      styleToClasses = inst.styleToClassesHash;
      for (n in defaultStyles) {
        if (styleToClasses[n] == null) {
          styleToClasses[n] = new lib.flash.utils.Dictionary(true);
        }
        styleToClasses[n][classDef] = true;
      }
      inst.classToDefaultStylesDict[classDef] = defaultStyles;
      if (inst.classToStylesDict[classDef] == null) {
        inst.classToStylesDict[classDef] = {};
      }
    }
    inst.classToInstancesDict[classDef][instance] = true;
    StyleManager.setSharedStyles(instance);
  }

  public static setComponentStyle(
    param1: any,
    param2: string,
    param3: any
  ): void {
    var _loc4_: lib.__internal.avm2.Class = StyleManager.getClassDef(param1);
    var _loc5_: any = StyleManager.getInstance().classToStylesDict[_loc4_];
    if (_loc5_ == null) {
      _loc5_ = StyleManager.getInstance().classToStylesDict[_loc4_] = {};
    }
    if (_loc5_ == param3) {
      return;
    }
    _loc5_[param2] = param3;
    StyleManager.invalidateComponentStyle(_loc4_, param2);
  }

  private static setSharedStyles(param1: UIComponent): void {
    var _loc5_: any = null;
    var _loc2_: StyleManager = StyleManager.getInstance();
    var _loc3_: lib.__internal.avm2.Class = StyleManager.getClassDef(param1);
    var _loc4_: any = _loc2_.classToDefaultStylesDict[_loc3_];
    for (_loc5_ in _loc4_) {
      param1.setSharedStyle(
        _loc5_,
        StyleManager.getSharedStyle(param1, _loc5_)
      );
    }
  }

  public static setStyle(param1: string, param2: any): void {
    var _loc3_: any = StyleManager.getInstance().globalStyles;
    if (
      _loc3_[param1] === param2 &&
      !(param2 instanceof lib.flash.text.TextFormat)
    ) {
      return;
    }
    _loc3_[param1] = param2;
    StyleManager.invalidateStyle(param1);
  }
}
