"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var my_button_base_1 = require("./my-button-base");
var clickListener;
function initializeClickListener() {
    if (clickListener) {
        return;
    }
    var ClickListener = (function (_super) {
        __extends(ClickListener, _super);
        function ClickListener() {
            var _this = _super.call(this) || this;
            return global.__native(_this);
        }
        ClickListener.prototype.onClick = function (v) {
            var owner = v.owner;
            if (owner) {
                owner.notify({ eventName: my_button_base_1.MyButtonBase.tapEvent, object: owner });
            }
        };
        return ClickListener;
    }(java.lang.Object));
    ClickListener = __decorate([
        Interfaces([android.view.View.OnClickListener])
    ], ClickListener);
    clickListener = new ClickListener();
}
var MyButton = (function (_super) {
    __extends(MyButton, _super);
    function MyButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyButton.prototype.createNativeView = function () {
        initializeClickListener();
        var button = new android.widget.Button(this._context);
        button.setOnClickListener(clickListener);
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
        this.nativeView.setText(value);
    };
    MyButton.prototype[my_button_base_1.myOpacityProperty.getDefault] = function () {
        return this.nativeView.getAlpha();
    };
    MyButton.prototype[my_button_base_1.myOpacityProperty.setNative] = function (value) {
        return this.nativeView.setAlpha(value);
    };
    return MyButton;
}(my_button_base_1.MyButtonBase));
exports.MyButton = MyButton;
