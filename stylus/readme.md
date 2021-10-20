# CORE STYLESHEET

Stylus collection to maintain an application ready set of stylesheets which the rules enable a clear directory structure and which follow the premises of a component based archiecture, whom are contained in a responsive manner by the application containers FIRST.



## Theme

Theme variables: **sizing** & **colours**

_rulesets_

```
_paragraph = 'custom-font-name' 	// _ for widths | strings | paddings
_mBottom = 1.5em 					// _m for margin : Bottom for target
```

_mixins_

```
padding-s() => padding .5em 1em 	// padding-{x} : s | m | l
```

------



## Type

### Core

Basic font config and sizes

_rulesets_

Single **margin-bottom** as spacing break for both `p` and `h` tags

---

### Styles

_classes_

```
.tx-{name} 							// weight | color | custom
.tx-highlight--red
```

------

### Fonts

Custom @fontface

_ruleset_

```
_fontsource && _fontname required
```

_mixins_

```
fontace(_fontname)					// declares font availablillity
fluid()								// [WIP] responsive fluid text
```

------



## Core

Essential Media Query setup.

### Media

Media Query settings

_ruleset_

max-width for smaller screens <= **Laptop first approach** => min-width for larger screens

```
_mq-{device|screen}
```

---

### Input

Stripped back input for clean and consistant methods to build forms upon.

---

### HTML

Core HTML page settings to handle the most basic device variances to responsive behaviours.

---



## Common

Resources to setup behaviours and focusing on more stylistic choices

### Icons

Using FontAwesome SVGs

_ruleset_

```
.fa--{type}							// declares the :before content '\number'
```

---

### Forms

General encasing best practices

_ruleset_

```
// HTML
.form-fields
  .field-input.has-state-ok
	label
	input(type="text")
	.fa--done
```

---

### Layouts

CSS3 Layout practice model using either **Grids** or **Flexbox**

_ruleset_

```
element
  .layout-{type}
  	.cell-{id} | .box-{id}			// grid : cell | flex : box
```

_example_

```
block
  .layout-flex-column
    .box-action 	| head
    .box-logo		| body
    .box-title		| side
```

---

### Mixins

* `maxWidth(max)` : responsive max width
* `pos(x, y)` : set top | left attributes
* `wh(w, h)` : set dimensions
* `fullscreen(position)` : auto fit to screen settings
* `bg-img(size, attachment)` : image settings ( - `background-image: url(/target/.type)`)
* `before()` : nest block forstyles to apply

---



##Motion

Reusable CSS **Animations** and Vue **Transitions** respectively



##UI 

Give anything an interactable quality with this model, from _anchors_ to _buttons_

### Core

Enable common basics CSS for an intractable: cursor

_rulset_

```
.ui									// enables the basic CSS
```

### Behaviour

Definitions of custom effects

_ruleset_

```
.ui--pop							// type of on:hover interaction
```

### Type

The type of interactable you want to define the element as

_rulset_

```
.is-link | .is-button
```

_example_

```
.fa--logo.is-button.ui--spin		// standard button with fx
a.is-link.ui						// link
```

---



## Elements

Definitions for large static core app elements such as 

```
Modals | Headers | Navigation | Footer | Articles | Cards
```

... before they become neccessary as Components

_includes_ **Parallax**

```
// normal fullscreen

.camera.has-parallax	// set perspective
  .viewport-window    	// optional for camera control
    .parallax-layer		// view window
      .layer--fore		// 3d heirachy
      .layer--base			
	  .layer--back
	  
// alternative sandboxed camera

.el-with-perspective
  .viewport-window.has-parallax
	.parallax-layer
	
-- camera is now contained fullscreen within its own window which can be transformed
```

---



## Components

Vue Components where upon Javascript powered `inline styles | classes` 

### State

```
.is-active | .has-state-x 
```

### Component-name

As does `.vue` files expect, you can define each component in a single file, but taking the convince from the rest of this simple library

_rulset_

```
.my-component.layout-grid
  .cell-title
  	span {{ model.title }}
  craft-collection
  .cell-side
  	.fa--logo
```

