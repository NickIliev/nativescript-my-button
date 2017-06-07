"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var my_button_base_1 = require("./my-button-base");
var TapHandler = (function (_super) {
    __extends(TapHandler, _super);
    function TapHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TapHandler.prototype.tap = function (nativeButton, nativeEvent) {
        var owner = nativeButton.owner;
        if (owner) {
            owner.notify({ eventName: my_button_base_1.MyButtonBase.tapEvent, object: owner });
        }
    };
    return TapHandler;
}(NSObject));
TapHandler.ObjCExposedMethods = {
    "tap": { returns: interop.types.void, params: [interop.types.id, interop.types.id] }
};
var handler = TapHandler.new();
var MyButton = (function (_super) {
    __extends(MyButton, _super);
    function MyButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyButton.prototype.createNativeView = function () {
        var button = UIButton.buttonWithType(1);
        button.addTargetActionForControlEvents(handler, "tap", 64);
        return button;
    };
    MyButton.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    MyButton.prototype.disposeNativeView = function () {
        this.nativeView.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    MyButton.prototype[my_button_base_1.textProperty.setNative] = function (value) {
        this.nativeView.setTitleForState(value, 0);
    };
    MyButton.prototype[my_button_base_1.myOpacityProperty.getDefault] = function () {
        return this.nativeView.alpha;
    };
    MyButton.prototype[my_button_base_1.myOpacityProperty.setNative] = function (value) {
        return this.nativeView.alpha = value;
    };
    return MyButton;
}(my_button_base_1.MyButtonBase));
exports.MyButton = MyButton;
