import lib from "swf-lib";
import { IFocusManager } from "./IFocusManager";
import type { Button } from "../controls/Button";
import { IFocusManagerComponent } from "./IFocusManagerComponent";
import { IFocusManagerGroup } from "./IFocusManagerGroup";
import { UIComponent } from "../core/UIComponent";

export class FocusManager implements IFocusManager {
  static readonly [IFocusManager.__IMPL] = true;
  private declare _defaultButton: Button;

  private declare _defaultButtonEnabled: boolean;

  private declare _form: lib.flash.display.DisplayObjectContainer;

  private declare _showFocusIndicator: boolean;

  private declare activated: boolean;

  private declare calculateCandidates: boolean;

  private declare defButton: Button;

  private declare focusableCandidates: any[];

  private declare focusableObjects: lib.flash.utils.Dictionary;

  private declare lastAction: string;

  private declare lastFocus: lib.flash.display.InteractiveObject;

  public constructor(param1: lib.flash.display.DisplayObjectContainer) {
    this._showFocusIndicator = true;
    this._defaultButtonEnabled = true;
    this.activated = false;
    this.calculateCandidates = true;
    this.focusableObjects = new lib.flash.utils.Dictionary(true);
    if (param1 != null) {
      this._form = param1;
      this.addFocusables(param1 as lib.flash.display.DisplayObject);
      param1.addEventListener(lib.flash.events.Event.ADDED, this.addedHandler);
      param1.addEventListener(
        lib.flash.events.Event.REMOVED,
        this.removedHandler
      );
      this.activate();
    }
  }

  public activate(): void {
    if (this.activated) {
      return;
    }
    this.form.stage.addEventListener(
      lib.flash.events.FocusEvent.MOUSE_FOCUS_CHANGE,
      this.mouseFocusChangeHandler,
      false,
      0,
      true
    );
    this.form.stage.addEventListener(
      lib.flash.events.FocusEvent.KEY_FOCUS_CHANGE,
      this.keyFocusChangeHandler,
      false,
      0,
      true
    );
    this.form.addEventListener(
      lib.flash.events.FocusEvent.FOCUS_IN,
      this.focusInHandler,
      true
    );
    this.form.addEventListener(
      lib.flash.events.FocusEvent.FOCUS_OUT,
      this.focusOutHandler,
      true
    );
    this.form.stage.addEventListener(
      lib.flash.events.Event.ACTIVATE,
      this.activateHandler,
      false,
      0,
      true
    );
    this.form.stage.addEventListener(
      lib.flash.events.Event.DEACTIVATE,
      this.deactivateHandler,
      false,
      0,
      true
    );
    this.form.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_DOWN,
      this.mouseDownHandler
    );
    this.form.addEventListener(
      lib.flash.events.KeyboardEvent.KEY_DOWN,
      this.keyDownHandler,
      true
    );
    this.activated = true;
    if (this.lastFocus) {
      this.setFocus(this.lastFocus);
    }
  }

  private activateHandler(param1: lib.flash.events.Event): void {
    var _loc2_: lib.flash.display.InteractiveObject = param1.target as lib.flash.display.InteractiveObject;
    if (this.lastFocus) {
      if (
        lib.__internal.avm2.Runtime.isInterface(
          this.lastFocus,
          IFocusManagerComponent
        )
      ) {
        (this.lastFocus as IFocusManagerComponent).setFocus();
      } else {
        this.form.stage.focus = this.lastFocus;
      }
    }
    this.lastAction = "ACTIVATE";
  }

  private addedHandler(param1: lib.flash.events.Event): void {
    var _loc2_: lib.flash.display.DisplayObject = param1.target as lib.flash.display.DisplayObject;
    if (_loc2_.stage) {
      this.addFocusables(param1.target as lib.flash.display.DisplayObject);
    }
  }

  private addFocusables(
    param1: lib.flash.display.DisplayObject,
    param2: boolean = false
  ): void {
    var focusable: IFocusManagerComponent = null;
    var io: lib.flash.display.InteractiveObject = null;
    var doc: lib.flash.display.DisplayObjectContainer = null;
    var i: number = 0;
    var child: lib.flash.display.DisplayObject = null;
    var o: lib.flash.display.DisplayObject = param1;
    var skipTopLevel: boolean = param2;
    if (!skipTopLevel) {
      if (lib.__internal.avm2.Runtime.isInterface(o, IFocusManagerComponent)) {
        focusable = o as IFocusManagerComponent;
        if (focusable.focusEnabled) {
          if (focusable.tabEnabled && this.isTabVisible(o)) {
            this.focusableObjects[o] = true;
            this.calculateCandidates = true;
          }
          o.addEventListener(
            lib.flash.events.Event.TAB_ENABLED_CHANGE,
            this.tabEnabledChangeHandler
          );
          o.addEventListener(
            lib.flash.events.Event.TAB_INDEX_CHANGE,
            this.tabIndexChangeHandler
          );
        }
      } else if (o instanceof lib.flash.display.InteractiveObject) {
        io = o as lib.flash.display.InteractiveObject;
        if (io && io.tabEnabled && this.findFocusManagerComponent(io) == io) {
          this.focusableObjects[io] = true;
          this.calculateCandidates = true;
        }
        io.addEventListener(
          lib.flash.events.Event.TAB_ENABLED_CHANGE,
          this.tabEnabledChangeHandler
        );
        io.addEventListener(
          lib.flash.events.Event.TAB_INDEX_CHANGE,
          this.tabIndexChangeHandler
        );
      }
    }
    if (o instanceof lib.flash.display.DisplayObjectContainer) {
      doc = o as lib.flash.display.DisplayObjectContainer;
      o.addEventListener(
        lib.flash.events.Event.TAB_CHILDREN_CHANGE,
        this.tabChildrenChangeHandler
      );
      if (
        doc instanceof lib.flash.display.Stage ||
        doc.parent instanceof lib.flash.display.Stage ||
        doc.tabChildren
      ) {
        i = 0;
        while (i < doc.numChildren) {
          try {
            child = doc.getChildAt(i);
            if (child != null) {
              this.addFocusables(doc.getChildAt(i));
            }
          } catch (error) {}
          i++;
        }
      }
    }
  }

  public deactivate(): void {
    this.form.stage.removeEventListener(
      lib.flash.events.FocusEvent.MOUSE_FOCUS_CHANGE,
      this.mouseFocusChangeHandler
    );
    this.form.stage.removeEventListener(
      lib.flash.events.FocusEvent.KEY_FOCUS_CHANGE,
      this.keyFocusChangeHandler
    );
    this.form.removeEventListener(
      lib.flash.events.FocusEvent.FOCUS_IN,
      this.focusInHandler,
      true
    );
    this.form.removeEventListener(
      lib.flash.events.FocusEvent.FOCUS_OUT,
      this.focusOutHandler,
      true
    );
    this.form.stage.removeEventListener(
      lib.flash.events.Event.ACTIVATE,
      this.activateHandler
    );
    this.form.stage.removeEventListener(
      lib.flash.events.Event.DEACTIVATE,
      this.deactivateHandler
    );
    this.form.removeEventListener(
      lib.flash.events.MouseEvent.MOUSE_DOWN,
      this.mouseDownHandler
    );
    this.form.removeEventListener(
      lib.flash.events.KeyboardEvent.KEY_DOWN,
      this.keyDownHandler,
      true
    );
    this.activated = false;
  }

  private deactivateHandler(param1: lib.flash.events.Event): void {
    var _loc2_: lib.flash.display.InteractiveObject = param1.target as lib.flash.display.InteractiveObject;
  }

  public get defaultButton(): Button {
    return this._defaultButton;
  }

  public set defaultButton(param1: Button) {
    var _loc2_: Button = !!param1 ? (param1 as Button) : null;
    if (_loc2_ != this._defaultButton) {
      if (this._defaultButton) {
        this._defaultButton.emphasized = false;
      }
      if (this.defButton) {
        this.defButton.emphasized = false;
      }
      this._defaultButton = _loc2_;
      this.defButton = _loc2_;
      if (_loc2_) {
        _loc2_.emphasized = true;
      }
    }
  }

  public get defaultButtonEnabled(): boolean {
    return this._defaultButtonEnabled;
  }

  public set defaultButtonEnabled(param1: boolean) {
    this._defaultButtonEnabled = param1;
  }

  public findFocusManagerComponent(
    param1: lib.flash.display.InteractiveObject
  ): lib.flash.display.InteractiveObject {
    var _loc2_: lib.flash.display.InteractiveObject = param1;
    while (param1) {
      if (
        lib.__internal.avm2.Runtime.isInterface(
          param1,
          IFocusManagerComponent
        ) &&
        (param1 as IFocusManagerComponent).focusEnabled
      ) {
        return param1;
      }
      param1 = param1.parent;
    }
    return _loc2_;
  }

  private focusInHandler(param1: lib.flash.events.FocusEvent): void {
    var _loc3_: any = null;
    var _loc2_: lib.flash.display.InteractiveObject = param1.target as lib.flash.display.InteractiveObject;
    if (this.form.contains(_loc2_)) {
      this.lastFocus = this.findFocusManagerComponent(
        _loc2_ as lib.flash.display.InteractiveObject
      );
      if (this.lastFocus instanceof Button) {
        _loc3_ = this.lastFocus as Button;
        if (this.defButton) {
          this.defButton.emphasized = false;
          this.defButton = _loc3_;
          _loc3_.emphasized = true;
        }
      } else if (this.defButton && this.defButton != this._defaultButton) {
        this.defButton.emphasized = false;
        this.defButton = this._defaultButton;
        this._defaultButton.emphasized = true;
      }
    }
  }

  private focusOutHandler(param1: lib.flash.events.FocusEvent): void {
    var _loc2_: lib.flash.display.InteractiveObject = param1.target as lib.flash.display.InteractiveObject;
  }

  public get form(): lib.flash.display.DisplayObjectContainer {
    return this._form;
  }

  public set form(param1: lib.flash.display.DisplayObjectContainer) {
    this._form = param1;
  }

  private getChildIndex(
    param1: lib.flash.display.DisplayObjectContainer,
    param2: lib.flash.display.DisplayObject
  ): number {
    return param1.getChildIndex(param2);
  }

  public getFocus(): lib.flash.display.InteractiveObject {
    var _loc1_: lib.flash.display.InteractiveObject = this.form.stage.focus;
    return this.findFocusManagerComponent(_loc1_);
  }

  private getIndexOfFocusedObject(
    param1: lib.flash.display.DisplayObject
  ): number {
    var _loc2_: number = this.focusableCandidates.length;
    var _loc3_: number = 0;
    _loc3_ = 0;
    while (_loc3_ < _loc2_) {
      if (this.focusableCandidates[_loc3_] == param1) {
        return _loc3_;
      }
      _loc3_++;
    }
    return -1;
  }

  private getIndexOfNextObject(
    param1: number,
    param2: boolean,
    param3: boolean,
    param4: string
  ): number {
    var _loc7_: any = null;
    var _loc8_: any = null;
    var _loc9_: number = 0;
    var _loc10_: any = null;
    var _loc11_: any = null;
    var _loc5_: number = this.focusableCandidates.length;
    var _loc6_: number = param1;
    while (true) {
      if (param2) {
        param1--;
      } else {
        param1++;
      }
      if (param3) {
        if (param2 && param1 < 0) {
          break;
        }
        if (!param2 && param1 == _loc5_) {
          break;
        }
      } else {
        param1 = (param1 + _loc5_) % _loc5_;
        if (_loc6_ == param1) {
          break;
        }
      }
      if (
        this.isValidFocusCandidate(this.focusableCandidates[param1], param4)
      ) {
        _loc7_ = this.findFocusManagerComponent(
          this.focusableCandidates[param1]
        ) as lib.flash.display.DisplayObject;
        if (
          lib.__internal.avm2.Runtime.isInterface(_loc7_, IFocusManagerGroup)
        ) {
          _loc8_ = _loc7_ as IFocusManagerGroup;
          _loc9_ = 0;
          while (_loc9_ < this.focusableCandidates.length) {
            _loc10_ = this.focusableCandidates[_loc9_];
            if (
              lib.__internal.avm2.Runtime.isInterface(
                _loc10_,
                IFocusManagerGroup
              )
            ) {
              _loc11_ = _loc10_ as IFocusManagerGroup;
              if (_loc11_.groupName == _loc8_.groupName && _loc11_.selected) {
                param1 = _loc9_;
                break;
              }
            }
            _loc9_++;
          }
        }
        return param1;
      }
    }
    return param1;
  }

  public getNextFocusManagerComponent(
    param1: boolean = false
  ): lib.flash.display.InteractiveObject {
    var _loc8_: any = null;
    if (!this.hasFocusableObjects()) {
      return null;
    }
    if (this.calculateCandidates) {
      this.sortFocusableObjects();
      this.calculateCandidates = false;
    }
    var _loc2_: lib.flash.display.DisplayObject = this.form.stage.focus;
    _loc2_ = this.findFocusManagerComponent(
      _loc2_ as lib.flash.display.InteractiveObject
    ) as lib.flash.display.DisplayObject;
    var _loc3_: string = "";
    if (lib.__internal.avm2.Runtime.isInterface(_loc2_, IFocusManagerGroup)) {
      _loc8_ = _loc2_ as IFocusManagerGroup;
      _loc3_ = _loc8_.groupName;
    }
    var _loc4_: number = this.getIndexOfFocusedObject(_loc2_);
    var _loc5_: boolean = false;
    var _loc6_: number = _loc4_;
    if (_loc4_ == -1) {
      if (param1) {
        _loc4_ = this.focusableCandidates.length;
      }
      _loc5_ = true;
    }
    var _loc7_: number = this.getIndexOfNextObject(
      _loc4_,
      param1,
      _loc5_,
      _loc3_
    );
    return this.findFocusManagerComponent(this.focusableCandidates[_loc7_]);
  }

  private getTopLevelFocusTarget(
    param1: lib.flash.display.InteractiveObject
  ): lib.flash.display.InteractiveObject {
    while (true) {
      if (param1 != (this.form as lib.flash.display.InteractiveObject)) {
        if (
          lib.__internal.avm2.Runtime.isInterface(
            param1,
            IFocusManagerComponent
          ) &&
          (param1 as IFocusManagerComponent).focusEnabled &&
          (param1 as IFocusManagerComponent).mouseFocusEnabled &&
          (param1 as UIComponent).enabled
        ) {
          break;
        }
        param1 = param1.parent;
        if (param1 != null) {
          continue;
        }
      }
      return null;
    }
    return param1;
  }

  private hasFocusableObjects(): boolean {
    var _loc1_: any = null;
    for (_loc1_ in this.focusableObjects) {
      return true;
    }
    return false;
  }

  public hideFocus(): void {}

  private isEnabledAndVisible(
    param1: lib.flash.display.DisplayObject
  ): boolean {
    var _loc3_: any = null;
    var _loc4_: any = null;
    var _loc2_: lib.flash.display.DisplayObjectContainer = (this
      .form as lib.flash.display.DisplayObject).parent;
    while (param1 != _loc2_) {
      if (param1 instanceof UIComponent) {
        if (!(param1 as UIComponent).enabled) {
          return false;
        }
      } else if (param1 instanceof lib.flash.text.TextField) {
        _loc3_ = param1 as lib.flash.text.TextField;
        if (
          _loc3_.type == lib.flash.text.TextFieldType.DYNAMIC ||
          !_loc3_.selectable
        ) {
          return false;
        }
      } else if (param1 instanceof lib.flash.display.SimpleButton) {
        _loc4_ = param1 as lib.flash.display.SimpleButton;
        if (!_loc4_.enabled) {
          return false;
        }
      }
      if (!param1.visible) {
        return false;
      }
      param1 = param1.parent;
    }
    return true;
  }

  private isTabVisible(param1: lib.flash.display.DisplayObject): boolean {
    var _loc2_: lib.flash.display.DisplayObjectContainer = param1.parent;
    while (
      _loc2_ &&
      !(_loc2_ instanceof lib.flash.display.Stage) &&
      !(_loc2_.parent && _loc2_.parent instanceof lib.flash.display.Stage)
    ) {
      if (!_loc2_.tabChildren) {
        return false;
      }
      _loc2_ = _loc2_.parent;
    }
    return true;
  }

  private isValidFocusCandidate(
    param1: lib.flash.display.DisplayObject,
    param2: string
  ): boolean {
    var _loc3_: any = null;
    if (!this.isEnabledAndVisible(param1)) {
      return false;
    }
    if (lib.__internal.avm2.Runtime.isInterface(param1, IFocusManagerGroup)) {
      _loc3_ = param1 as IFocusManagerGroup;
      if (param2 == _loc3_.groupName) {
        return false;
      }
    }
    return true;
  }

  private keyDownHandler(param1: lib.flash.events.KeyboardEvent): void {
    if (param1.keyCode == lib.flash.ui.Keyboard.TAB) {
      this.lastAction = "KEY";
      if (this.calculateCandidates) {
        this.sortFocusableObjects();
        this.calculateCandidates = false;
      }
    }
    if (
      this.defaultButtonEnabled &&
      param1.keyCode == lib.flash.ui.Keyboard.ENTER &&
      this.defaultButton &&
      this.defButton.enabled
    ) {
      this.sendDefaultButtonEvent();
    }
  }

  private keyFocusChangeHandler(param1: lib.flash.events.FocusEvent): void {
    this.showFocusIndicator = true;
    if (
      (param1.keyCode == lib.flash.ui.Keyboard.TAB || param1.keyCode == 0) &&
      !param1.isDefaultPrevented()
    ) {
      this.setFocusToNextObject(param1);
      param1.preventDefault();
    }
  }

  private mouseDownHandler(param1: lib.flash.events.MouseEvent): void {
    if (param1.isDefaultPrevented()) {
      return;
    }
    var _loc2_: lib.flash.display.InteractiveObject = this.getTopLevelFocusTarget(
      param1.target as lib.flash.display.InteractiveObject
    );
    if (!_loc2_) {
      return;
    }
    this.showFocusIndicator = false;
    if (
      (_loc2_ != this.lastFocus || this.lastAction == "ACTIVATE") &&
      !(_loc2_ instanceof lib.flash.text.TextField)
    ) {
      this.setFocus(_loc2_);
    }
    this.lastAction = "MOUSEDOWN";
  }

  private mouseFocusChangeHandler(param1: lib.flash.events.FocusEvent): void {
    if (param1.relatedObject instanceof lib.flash.text.TextField) {
      return;
    }
    param1.preventDefault();
  }

  public get nextTabIndex(): number {
    return 0;
  }

  private removedHandler(param1: lib.flash.events.Event): void {
    var _loc4_: any = null;
    var _loc3_: lib.flash.display.DisplayObject = param1.target as lib.flash.display.DisplayObject;
    if (
      lib.__internal.avm2.Runtime.isInterface(_loc3_, IFocusManagerComponent) &&
      this.focusableObjects[_loc3_] == true
    ) {
      if (_loc3_ == this.lastFocus) {
        (this.lastFocus as IFocusManagerComponent).drawFocus(false);
        this.lastFocus = null;
      }
      _loc3_.removeEventListener(
        lib.flash.events.Event.TAB_ENABLED_CHANGE,
        this.tabEnabledChangeHandler
      );
      delete this.focusableObjects[_loc3_];
      this.calculateCandidates = true;
    } else if (
      _loc3_ instanceof lib.flash.display.InteractiveObject &&
      this.focusableObjects[_loc3_] == true
    ) {
      _loc4_ = _loc3_ as lib.flash.display.InteractiveObject;
      if (_loc4_) {
        if (_loc4_ == this.lastFocus) {
          this.lastFocus = null;
        }
        delete this.focusableObjects[_loc4_];
        this.calculateCandidates = true;
      }
      _loc3_.addEventListener(
        lib.flash.events.Event.TAB_ENABLED_CHANGE,
        this.tabEnabledChangeHandler
      );
    }
    this.removeFocusables(_loc3_);
  }

  private removeFocusables(param1: lib.flash.display.DisplayObject): void {
    var _loc2_: any = null;
    var _loc3_: any = null;
    if (param1 instanceof lib.flash.display.DisplayObjectContainer) {
      param1.removeEventListener(
        lib.flash.events.Event.TAB_CHILDREN_CHANGE,
        this.tabChildrenChangeHandler
      );
      param1.removeEventListener(
        lib.flash.events.Event.TAB_INDEX_CHANGE,
        this.tabIndexChangeHandler
      );
      for (_loc2_ in this.focusableObjects) {
        _loc3_ = _loc2_ as lib.flash.display.DisplayObject;
        if (
          (param1 as lib.flash.display.DisplayObjectContainer).contains(_loc3_)
        ) {
          if (_loc3_ == this.lastFocus) {
            this.lastFocus = null;
          }
          _loc3_.removeEventListener(
            lib.flash.events.Event.TAB_ENABLED_CHANGE,
            this.tabEnabledChangeHandler
          );
          delete this.focusableObjects[_loc2_];
          this.calculateCandidates = true;
        }
      }
    }
  }

  public sendDefaultButtonEvent(): void {
    this.defButton.dispatchEvent(
      new lib.flash.events.MouseEvent(lib.flash.events.MouseEvent.CLICK)
    );
  }

  public setFocus(param1: lib.flash.display.InteractiveObject): void {
    if (
      lib.__internal.avm2.Runtime.isInterface(param1, IFocusManagerComponent)
    ) {
      (param1 as IFocusManagerComponent).setFocus();
    } else {
      this.form.stage.focus = param1;
    }
  }

  private setFocusToNextObject(param1: lib.flash.events.FocusEvent): void {
    if (!this.hasFocusableObjects()) {
      return;
    }
    var _loc2_: lib.flash.display.InteractiveObject = this.getNextFocusManagerComponent(
      param1.shiftKey
    );
    if (_loc2_) {
      this.setFocus(_loc2_);
    }
  }

  public showFocus(): void {}

  public get showFocusIndicator(): boolean {
    return this._showFocusIndicator;
  }

  public set showFocusIndicator(param1: boolean) {
    this._showFocusIndicator = param1;
  }

  private sortByDepth(
    param1: lib.flash.display.InteractiveObject,
    param2: lib.flash.display.InteractiveObject
  ): number {
    var _loc5_: number = 0;
    var _loc6_: any = null;
    var _loc7_: any = null;
    var _loc3_: string = "";
    var _loc4_: string = "";
    var _loc9_: lib.flash.display.DisplayObject = param1 as lib.flash.display.DisplayObject;
    var _loc10_: lib.flash.display.DisplayObject = param2 as lib.flash.display.DisplayObject;
    while (
      _loc9_ != (this.form as lib.flash.display.DisplayObject) &&
      _loc9_.parent
    ) {
      _loc5_ = this.getChildIndex(_loc9_.parent, _loc9_);
      _loc6_ = _loc5_.toString(16);
      if (_loc6_.length < 4) {
        _loc7_ = "0000".substring(0, 4 - _loc6_.length) + _loc6_;
      }
      _loc3_ = _loc7_ + _loc3_;
      _loc9_ = _loc9_.parent;
    }
    while (
      _loc10_ != (this.form as lib.flash.display.DisplayObject) &&
      _loc10_.parent
    ) {
      _loc5_ = this.getChildIndex(_loc10_.parent, _loc10_);
      _loc6_ = _loc5_.toString(16);
      if (_loc6_.length < 4) {
        _loc7_ = "0000".substring(0, 4 - _loc6_.length) + _loc6_;
      }
      _loc4_ = _loc7_ + _loc4_;
      _loc10_ = _loc10_.parent;
    }
    return (_loc3_ > _loc4_ ? 1 : _loc3_ < _loc4_) ? -1 : Number(0);
  }

  private sortByTabIndex(
    param1: lib.flash.display.InteractiveObject,
    param2: lib.flash.display.InteractiveObject
  ): number {
    return (
      param1.tabIndex > param2.tabIndex ? 1 : param1.tabIndex < param2.tabIndex
    )
      ? -1
      : lib.__internal.avm2.Runtime.int(this.sortByDepth(param1, param2));
  }

  private sortFocusableObjects(): void {
    var _loc1_: any = null;
    var _loc2_: any = null;
    this.focusableCandidates = [];
    for (_loc1_ in this.focusableObjects) {
      _loc2_ = _loc1_ as lib.flash.display.InteractiveObject;
      if (
        _loc2_.tabIndex &&
        !isNaN(Number(_loc2_.tabIndex)) &&
        _loc2_.tabIndex > 0
      ) {
        this.sortFocusableObjectsTabIndex();
        return;
      }
      this.focusableCandidates.push(_loc2_);
    }
    this.focusableCandidates.sort(this.sortByDepth);
  }

  private sortFocusableObjectsTabIndex(): void {
    var _loc1_: any = null;
    var _loc2_: any = null;
    this.focusableCandidates = [];
    for (_loc1_ in this.focusableObjects) {
      _loc2_ = _loc1_ as lib.flash.display.InteractiveObject;
      if (_loc2_.tabIndex && !isNaN(Number(_loc2_.tabIndex))) {
        this.focusableCandidates.push(_loc2_);
      }
    }
    this.focusableCandidates.sort(this.sortByTabIndex);
  }

  private tabChildrenChangeHandler(param1: lib.flash.events.Event): void {
    if (param1.target != param1.currentTarget) {
      return;
    }
    this.calculateCandidates = true;
    var _loc2_: lib.flash.display.DisplayObjectContainer = param1.target as lib.flash.display.DisplayObjectContainer;
    if (_loc2_.tabChildren) {
      this.addFocusables(_loc2_, true);
    } else {
      this.removeFocusables(_loc2_);
    }
  }

  private tabEnabledChangeHandler(param1: lib.flash.events.Event): void {
    this.calculateCandidates = true;
    var _loc2_: lib.flash.display.InteractiveObject = param1.target as lib.flash.display.InteractiveObject;
    var _loc3_: any = this.focusableObjects[_loc2_] == true;
    if (_loc2_.tabEnabled) {
      if (!_loc3_ && this.isTabVisible(_loc2_)) {
        if (
          !lib.__internal.avm2.Runtime.isInterface(
            _loc2_,
            IFocusManagerComponent
          )
        ) {
          _loc2_.focusRect = false;
        }
        this.focusableObjects[_loc2_] = true;
      }
    } else if (_loc3_) {
      delete this.focusableObjects[_loc2_];
    }
  }

  private tabIndexChangeHandler(param1: lib.flash.events.Event): void {
    this.calculateCandidates = true;
  }
}
