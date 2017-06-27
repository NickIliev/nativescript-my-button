---
title: Properties
description: What is a property in NativeScript, what types of properties are available, and how to use them.
position: 80
slug: properties
publish: false
previous_url: /properties
environment: nativescript
---

# Properties


This article contents:

* [Overview](#overview)
* [Dependency properties](#dependency-properties)
    * [Introduction](#intro1)
    * [Declaring a dependency property](#declaring)
    * [Adding a changed callback](#changedCallback)
    * [Adding a validation callback](#validationCallback)
    * [Creating an inheritable dependency property](#inheritable)
* [Style properties](#style-properties)
    * [Introduction](#intro2)
    * [Setting a style property](#setting)

## Overview

Being a TypeScript framework, NativeScript uses TypeScript properties. After transpilation, these result in ECMAScript v.5 compliant JavaScript with setter and getter methods to support working with class members, thus ensuring readable and manageable code. The code in __Example 1__ demonstrates how the TypeScript is transformed to JavaScript.

> **Important:** The techniques described in this article are applicable for NativeScript versions 2.5.x and below.  

### Example 1: How TypeScript is transformed to JavaScript.
``` JavaScript
var MyClass = (function () {
  function MyClass() {
  }
  Object.defineProperty(MyClass.prototype, "myProperty", {
    get: function () {
      return this._myProperty;
    },
    set: function (value) {
      this._myProperty = value;
    },
    enumerable: true,
    configurable: true
  });
  return MyClass;
})();
exports.MyClass = MyClass;
```
``` TypeScript
export class MyClass {
  private _myProperty: number;
  public get myProperty(): number {
    return this._myProperty;
  }

  public set myProperty(value: number) {
    this._myProperty = value;
  }
}
```

The TypeScript transpiler is run by a grunt script.

NativeScript features two types of properties: **dependency properties** and **style properties**. Each type is described in the next sections.


## Dependency properties

This sections includes these topics:

###<a id = "intro1"></a>Introduction

Dependency properties provide valuable features that simplify the creation of a rich User Interface (UI), including: 

* Memory optimization: The creation of a rich custom UI control is bound to creating a huge number of properties, most of which are used with default values. With the traditional approach you end up with a **private field** for every property. With dependency properties, you only store the instance properties that you modified. The default values are stored within the dependency property. Additionally, dependency properties are declared statically outside the class, which further helps optimize the memory footprint.
* Value validation: Dependency properties offer business logic validation. It is implemented as a dedicated validation callback function that takes `newValue` as parameter and returns true or false if the value is valid or not, respectively.
* Change notification: Another callback function is called when the property value changes. It is called with an [EventData](http://docs.nativescript.org/api-reference/interfaces/_data_observable_.eventdata.html) as parameter.
* Inheritance: One of the most important features of dependency properties is inheritance. It is implemented through a dedicated UI element that allows it to get its property from a parent element in the visual tree. For example, a button can inherit its style (or theme) property value from the parent Window, Layout, or another container. This gives you the option to dramatically change the look of your entire application by only changing a single setting (Window.theme).

###<a id = declaring></a>Declaring a dependency property

Only classes that derive from [DependencyObservable](http://docs.nativescript.org/api-reference/classes/_ui_core_dependency_observable_.dependencyobservable.html) can have a dependency property. This class has built-in methods that support the entire infrastructure of dependency properties.

The code in __Example 2__ creates a bare-bones property that adds a static part compared to a standard property implementation.

### Example 2: How to create property that adds a static part compared to a standard property.
``` JavaScript
var dependencyObservable = require("ui/core/dependency-observable");
exports.myPropertyProperty = new dependencyObservable.Property("myProperty",
          "MyClass",
          new dependencyObservable.PropertyMetadata("", dependencyObservable.PropertyMetadataSettings.None));
var MyClass = (function (_super) {
  __extends(MyClass, _super);
  function MyClass() {
    _super.apply(this, arguments);
  }
  Object.defineProperty(MyClass.prototype, "myProperty", {
    get: function () {
      return this._getValue(exports.myPropertyProperty);
    },
    set: function (value) {
      this._setValue(exports.myPropertyProperty, value);
    },
    enumerable: true,
    configurable: true
  });
  return MyClass;
})(dependencyObservable.DependencyObservable);
exports.MyClass = MyClass;
```
``` TypeScript
import dependencyObservable = require("ui/core/dependency-observable");

export var myPropertyProperty = new dependencyObservable.Property(
  "myProperty",
  "MyClass",
  new dependencyObservable.PropertyMetadata("", dependencyObservable.PropertyMetadataSettings.None)
);

export class MyClass extends dependencyObservable.DependencyObservable {
  public get myProperty(): number {
    return this._getValue(myPropertyProperty);
  }

  public set myProperty(value: number) {
    this._setValue(myPropertyProperty, value);
  }
}
```
###<a id = "changedCallback"></a>Adding a changed callback

__Example 3__ demonstrates how to implement the functionality of changing a notification. It adds a callback function, `onMyPropertyChanged`, that prints a message about a change in a property.

### Example 3: How to handle onPropertyChange event.
``` JavaScript
var dependencyObservable = require("ui/core/dependency-observable");
function onMyPropertyChanged(eventData) {
  var myClassInstance = eventData.object;
  var value = eventData.newValue;
  console.log("myProperty of the object " + myClassInstance.toString() + " changed with " + value);
}
exports.myPropertyProperty = new dependencyObservable.Property("myProperty",
      "MyClass",
      new dependencyObservable.PropertyMetadata("",
                  dependencyObservable.PropertyMetadataSettings.None,
                  onMyPropertyChanged));
var MyClass = (function (_super) {
  __extends(MyClass, _super);
  function MyClass() {
    _super.apply(this, arguments);
  }
  Object.defineProperty(MyClass.prototype, "myProperty", {
    get: function () {
      return this._getValue(exports.myPropertyProperty);
    },
    set: function (value) {
      this._setValue(exports.myPropertyProperty, value);
    },
    enumerable: true,
    configurable: true
  });
  return MyClass;
})(dependencyObservable.DependencyObservable);
exports.MyClass = MyClass;
```
``` TypeScript
import dependencyObservable = require("ui/core/dependency-observable");

function onMyPropertyChanged(eventData: dependencyObservable.PropertyChangeData) {
  var myClassInstance = <MyClass>eventData.object;
  var value = eventData.newValue;

  console.log("myProperty of the object " + myClassInstance.toString() + " changed with " + value);
}

export var myPropertyProperty = new dependencyObservable.Property(
  "myProperty",
  "MyClass",
  new dependencyObservable.PropertyMetadata("",
  dependencyObservable.PropertyMetadataSettings.None,
  onMyPropertyChanged)
);

export class MyClass extends dependencyObservable.DependencyObservable {
  public get myProperty(): number {
    return this._getValue(myPropertyProperty);
  }

  public set myProperty(value: number) {
    this._setValue(myPropertyProperty, value);
  }
}
```

###<a id = "validationCallback"></a>Adding a validation callback

__Example 4__ demonstrates how to implement value validation. It adds a callback function, `validateMyProperty`, that takes the new property value and validates it using a simple rule.

### Example 4: How to implement value validation.

``` JavaScript
var dependencyObservable = require("ui/core/dependency-observable");
function validateMyProperty(value) {
  if (value > 0) {
    return true;
  }
  return false;
}
exports.myPropertyProperty = new dependencyObservable.Property("myProperty", "MyClass",
    new dependencyObservable.PropertyMetadata("",
        dependencyObservable.PropertyMetadataSettings.None, null, validateMyProperty));
var MyClass = (function (_super) {
...
```
``` TypeScript
import dependencyObservable = require("ui/core/dependency-observable");

function validateMyProperty(value) {
  if (value > 0) {
    return true;
  }
  return false;
}

export var myPropertyProperty = new dependencyObservable.Property(
  "myProperty",
  "MyClass",
  new dependencyObservable.PropertyMetadata("",
  dependencyObservable.PropertyMetadataSettings.None,
  null,
  validateMyProperty)
  );

  export class MyClass extends dependencyObservable.DependencyObservable {
...
```

###<a id = "inheritable"></a>Creating an inheritable dependency property

__Example 5__ demonstrates how to create an inheritable dependency property:

### Example 5: How to create inheritable dependency property.
``` JavaScript
var dependencyObservable = require("ui/core/dependency-observable");
exports.myPropertyProperty = new dependencyObservable.Property("myProperty", "MyClass",
    new dependencyObservable.PropertyMetadata("",
      dependencyObservable.PropertyMetadataSettings.Inheritable));
var MyClass = (function (_super) {
  __extends(MyClass, _super);
  function MyClass() {
    _super.apply(this, arguments);
  }
  Object.defineProperty(MyClass.prototype, "myProperty", {
    get: function () {
      return this._getValue(exports.myPropertyProperty);
    },
    set: function (value) {
      this._setValue(exports.myPropertyProperty, value);
    },
    enumerable: true,
    configurable: true
  });
  return MyClass;
})(dependencyObservable.DependencyObservable);
exports.MyClass = MyClass;
```
``` TypeScript
import dependencyObservable = require("ui/core/dependency-observable");

export var myPropertyProperty = new dependencyObservable.Property(
    "myProperty",
    "MyClass",
    new dependencyObservable.PropertyMetadata("",
        dependencyObservable.PropertyMetadataSettings.Inheritable)
);

export class MyClass extends dependencyObservable.DependencyObservable {
  public get myProperty(): number {
    return this._getValue(myPropertyProperty);
  }

  public set myProperty(value: number) {
    this._setValue(myPropertyProperty, value);
  }
}
```

> Creating an inheritable property is relatively simple (as seen in __Example 5__). However, keep in mind that inheritance only occurs down the visual tree. Setting a property to a non-visual element does not allow for inheritance.

## Style properties

###<a id = "intro2"></a>Introduction

Probably the best use case for inheritable properties is applying different styles and themes to UI components. You only need to set a property (theme or style) to the base-most container and every single UI component inherits it through the visual tree.

###<a id = "setting"></a>Setting a style property

Setting a style property is similar to setting a regular property but you use the nested `style` object (that is a property of the View class, which means that every UI component has style).

#### Setting in code

To set a style property in your code:

``` JavaScript
var color = require("color");
someButton.style.backgroundColor = new color.Color("red");
```
``` TypeScript
import color = require("color");
someButton.style.backgroundColor = new color.Color("red");
```

#### Setting in CSS

To set a style property in your CSS:

``` JavaScript
someButton.id = "someButton";
someButton.css = "#someButtton {background-color: red}";
```
``` TypeScript
someButton.id = "someButton";
someButton.css = "#someButtton {background-color: red}";
```
