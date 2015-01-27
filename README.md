# Responsive Navigation #

**CSS only - jQuery plugin coming soon!**

This project is an attempt to create an easy to implement navigation system that even works with CSS only. This functions as a decent fallback if for some reason our jQuery plugin is not available. 

#### Tested in: ####

- IE 8 (needs [extra effort](#ie-8-fixes))
- IE 9 and above
- Firefox & Chrome
- Android 4.3 and above
- ... 

## Website Setup ##

### Add `.nav-no-js` Class to `<html>` ###

This class will let CSS handle the `:hover`  effects for opening and closing the menu. If our jQuery plugin is loaded, it will remove this class and take over for some nicer effects!

    <!DOCTYPE html>
    <html lang="en" class="nav-no-js">

### Add Meta Tags ###

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

### Include CSS and Scripts ###

It is highly recommended that you include [normalize.css](https://github.com/necolas/normalize.css/)!

#### Defaults ####

Include some defaults in your CSS (or use our `defaults.css`). This will prevent mobiles to "zoom out" on your website and fix box-sizing issues with padding and borders. The `html` font-size is the "root" font-size. Any `rem` unit will **always** be relative to this. With 62.5%, `1.6rem` = `16px`. Our CSS uses `rem` units, so you'll need this!

    @viewport { width: device-width; }
    @-ms-viewport { width: device-width; }
    
    * {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
    
    html {
      font-size: 62.5%;
    }
    
    body {
      font-size: 1.4rem;
      line-height: 2.4rem;
    }

#### REM Unit for Old Browsers ####

Because we use [REM units](http://snook.ca/archives/html_and_css/font-size-with-rem) in CSS, you should include the [REM unit polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill) for some older [browsers](http://caniuse.com/#feat=rem). Or you can edit the CSS and use another unit.

#### IE 8 Fixes ####

Because IE 8 doesn't support HTML5, you should include [html5shiv](https://github.com/aFarkas/html5shiv).

IE 8 doesn't support media queries, so you should also inlude our `ie8.css` **after the normal stylesheet**. (it contains all "desktop" styles without media queries. IE 8 won't jump to the mobile menu on resize. 

#### CSS and Scripts: All Together ####

    <link rel="stylesheet" href="css/normalize.min.css">
    <link rel="stylesheet" href="css/defaults.min.css">
    <link rel="stylesheet" href="css/navigation.min.css">

    <!--[if lt IE 9]>
    <link rel="stylesheet" href="css/ie8.min.css">
    <script src="js/html5shiv.min.js"></script>
    <![endif]-->

    <script src="js/rem.min.js"></script>

## Navigation Usage & Restrictions ##

### Basic HTML Structure ###

For CSS-only functionality, it is important to place `.nav-button` right before `<nav>` and `.nav-close` right after `<nav>`. The buttons can be positioned anywhere using `absolute` positioning.

    <div class="nav-button"></div>

    <nav>
      <ul>
        <li><a href="/link/to/page">Link</a></li>
      </ul>
    </nav>

    <div class="nav-close"></div>

The `.nav-close` button will only show up if our jQuery plugin is not available.

> **TIP:** You could also create an extra `.nav-button` anywhere in the DOM that will only be shown if our jQuery plugin is loaded. The original one can then be hidden. Just add your own class and write the CSS to show/hide when appropriate. 

### Sub Menu's ###

Each "link" should be wrapped in an `<a>` tag for styling purposes. If you don't want an actual link (sub menu), just write a `#` in the `href` attribute:

    <nav>
      <ul>
        <li><a href="/link/to/page">Link</a></li>
        <li class="submenu"><a href="#">Sub Menu</a>
          <ul>
            <li><a href="/link/to/sub/page">Link</a></li>
          </ul>
        </li>
      </ul>
    </nav>

> **IMPORTANT:** We experienced issues where newer smartphones (Samsung S4) "think" we want to touch links rather than a `<span>` etc. Because of this, every menu item (including sub menu's) should be in a `<a>` tag with  `href` attribute. When not using javascript, a `#` link won't  trigger a page reload, which is essential if you want to navigate into a sub menu with touch. It's not perfect, but it works.

### Nav Wrappers? ###

The navigation is tested when placed in the `body`, but you should be able to wrap other div's around it if needed. As long as you don't experience issues with the `fixed` placement of `<nav>` on mobiles.

### Header ###

The `<header>` used in the example is not needed for the navigation to work. But most sites will probably have some sort of header, so I just included it to show how it can blend in with the navigation.

## Customizing SASS ##

The SCSS files are split to make editting them a bit easier:

- `_config.scss` : Some vars for colors, line-heights etc.
- `_core-*.scss` : Essential CSS to make the navigation work
- `_layout-*.scss` : Change colors, paddings etc. in these files

### Icon Font ###

The included web font is generated by a Gulp plugin with the [included Gulpfile](https://github.com/codezero-be/gulp-workflow), and contains the `.svg` icons in `assets/icon-font/`. You can also use another icon font. Just remove the reference in `navigation.scss` and edit/remove the icon styles in the `_layout-*.scss` files.

> Example icons downloaded from [Flaticon](http://www.flaticon.com/).

## Known Issues ##

### Close button not always showing on <= Android 4.3 (no-js) ###

- Android 4.3 browser and lower

This issue is only relevant when using no javascript. (CSS navigation only)

Android 4.3 browser and lower have issues when combining pseudo classes with adjacent or general sibling selectors. Therefor the "close menu" button is not shown when you press the menu button. It does show when you use the menu.

### Fixed header width glitch on <= Android 4.3 ###

- Android 4.3

When you zoom in, the header scales to fit in the browser window, but  when you zoom out again, it doesn't seem to "resize" to full width immediately. 
