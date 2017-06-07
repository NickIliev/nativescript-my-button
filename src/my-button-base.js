"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
exports.textProperty = new view_1.Property({ name: "text", defaultValue: "", affectsLayout: view_1.isIOS });
exports.myOpacityProperty = new view_1.CssProperty({
    name: "myOpacity", cssName: "my-opacity", defaultValue: 1, valueConverter: function (v) {
        var x = parseFloat(v);
        if (x < 0 || x > 1) {
            throw new Error("opacity accepts values in the range [0, 1]. Value: " + v);
        }
        return x;
    }
});
var MyButtonBase = (function (_super) {
    __extends(MyButtonBase, _super);
    function MyButtonBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MyButtonBase.prototype, "myOpacity", {
        get: function () {
            return this.style.myOpacity;
        },
        set: function (value) {
            this.style.myOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    return MyButtonBase;
}(view_1.View));
MyButtonBase.tapEvent = "tap";
exports.MyButtonBase = MyButtonBase;
exports.textProperty.register(MyButtonBase);
exports.myOpacityProperty.register(view_1.Style);
MyButtonBase.prototype.recycleNativeView = false;
