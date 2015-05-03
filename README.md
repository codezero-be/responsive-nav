# Responsive Navigation #

**Works with CSS only - [jQuery plugin](#enable-jquery-plugin) available too!**

### Functional CSS-only navigation ###

This project is an attempt to create a navigation system that provides basic functionality even without javascript, with CSS only. This gives us a decent fallback if our [jQuery plugin](#enable-jquery-plugin) is not available for some reason.

The first goal was to see how far we could go with CSS alone. Every site should be usable without javascript (and also without CSS for that matter). We tried to make it as "advanced" as we possibly could, but we are however limited by the CSS selectors. Drop down effects with CSS provide basic functionality, but it's not ideal.

### jQuery for some awesomeness ###

Our [jQuery plugin](#enable-jquery-plugin) adds some sugar to the navigation, making it more user friendly and a bit more awesome... :)

With our jQuery plugin you can traverse the sub menu's by **touch** or **clicking** and optionally by **moving your mouse** over it. If you're a **keyboard** fan, then you can spam your `tab` key to the menu and hit `enter` to open or close a sub menu (or open a link of course).

### Should work on... ###

- IE 8 (needs [extra effort](#ie-8-fixes))
- IE 9 and above
- Firefox
- Chrome
- Android 4.3 and above
- ...

## Website Setup ##

### Add `.nav-no-js` Class to `<html>` ###

This class will let CSS handle the `:hover`  effects for opening and closing the menu. If our [jQuery plugin](#enable-jquery-plugin) is loaded, it will remove this class and take over for some nicer effects!

    <!DOCTYPE html>
    <html lang="en" class="nav-no-js">

### Add Meta Tags ###

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

### Include CSS and Scripts ###

It is highly recommended that you include [normalize.css](https://github.com/necolas/normalize.css/)!

#### Defaults ####

Include some defaults in your CSS (or use our `defaults.css`). This will allow mobiles to load the correct media queries on your website and fix box-sizing issues with padding and borders. The `html` font-size is the "root" font-size. Any `rem` unit will **always** be relative to this. With 62.5%, `1.6rem` = `16px`. Our CSS uses `rem` units, so you'll need this!

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

Ideally you would concatenate all CSS files into one file, but for clarity I'll add them separately. You could easily replace/modify the `*-layout.css` files with your custom styles.

    <link rel="stylesheet" href="css/normalize.min.css">
    <link rel="stylesheet" href="css/defaults.min.css">
    <link rel="stylesheet" href="css/nav-core.min.css">
    <link rel="stylesheet" href="css/nav-layout.min.css">

    <!--[if lt IE 9]>
    <link rel="stylesheet" href="css/ie8-core.min.css">
    <link rel="stylesheet" href="css/ie8-layout.min.css">
    <script src="js/html5shiv.min.js"></script>
    <![endif]-->

    <script src="js/rem.min.js"></script>

> In the `public/css` folder, you will find `*-core.css`, `*-layout.css` and `*-full.css` files. The latter combines the first two, so you can choose what files you want to use. A minified version is also included. The original [SASS files](#customizing-sass) are in the `assets/sass` folder.

### Enable jQuery Plugin ###

To enable our jQuery plugin, you will need to include jQuery and our plugin script and then run `.nav()` on your `<nav>`. Too increase page loading speed you might want to add this right before your closing `</body>` tag.

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="js/nav.jquery.min.js"></script>
    <script>
        $('.nav').nav();
    </script>

You can set some options when calling `.nav()`:

    $('.nav').nav({
        // Mobile menu button selector
        navButton: '.nav-button',
        // Sub menu selector (<li>)
        subMenu: '.nav-submenu',
        // Open sub menu's on mouse over
        // when not in mobile mode
        mouseOver: true,
        // When clicking/touching a sub menu link, it will open the sub menu...
        // Not disabling the links will make sub menu's unreachable on touch devices!
        // A link with [href="#"] will always be disabled, regardless of this setting.
        // Disable the actual link in a particular mode:
        //   always|never|mobile|desktop
        disableSubMenuLink: 'always',
        // How fast should a sub menu open/close? (ms)
        slideSpeed: 500
    });

## Navigation Usage & Restrictions ##

### Basic HTML Structure ###

For CSS-only functionality, it is important to place `.nav-button` link right before `<nav>` and `.nav-close` right after `<nav>`. These need to be links, because that works better for mobile touch. The links can be positioned anywhere using `absolute` positioning. The `.nav-close` button will only show up if our [jQuery plugin](#enable-jquery-plugin) is not available.

The `<nav>` tag should also have a `.nav` class, as there might be other nav areas that shouldn't be styled.

    <a href="#" class="nav-button">Menu</a>

    <nav class="nav">
      <ul>
        <li><a href="/link/to/page">Link</a></li>
      </ul>
    </nav>

    <a href="#" class="nav-close">Close Menu</a>

> **IMPORTANT:** We experienced issues where some smartphones (Samsung S4) "think" we want to touch links rather than a `<span>` etc. Because of this, every "touchable" item (including sub menu's) should be an `<a>` tag with  `href` attribute.

> **TIP:** You could create an extra `.nav-button` anywhere in the DOM that would only be shown if our jQuery plugin is loaded. The original one can then be hidden. Just add your own classes and write the CSS to show/hide when appropriate.

### Sub Menu's ###

Each "link" should be wrapped in an `<a>` tag. If you don't want an actual link (sub menu), just write a `#` in the `href` attribute. It is recommended to use a `#` for sub menu's to allow for touch navigation! Dont forget to add the `.nav-submenu` class to the `<li>` containing the sub menu.

    <nav class="nav">
      <ul>
        <li><a href="/link/to/page">Link</a></li>
        <li class="nav-submenu"><a href="#">Sub Menu</a>
          <ul>
            <li><a href="/link/to/sub/page">Link</a></li>
          </ul>
        </li>
      </ul>
    </nav>

#### Why sub menu's are not collapsed on mobiles without JS... ####

There was one more issue when not using javascript on mobiles (at least on the Samsung S4). If you would open a sub menu in the top level and then touch the next sub menu in the top level, that sub menu would open and the previous one would close. (Duh!)

Unfortunately, there is some kind of delay. When the previous menu closes, the one you touched moves upwards. However, the phone seems to remember the touch position on the screen and actually activates the link that ends up under your finger.

So we decided not to collapse the sub menu's on mobiles if you don't use our jQuery plugin.

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

The included web font is generated by a [Gulp plugin](https://www.npmjs.com/package/gulp-iconfont) with the [included Gulpfile](https://github.com/codezero-be/gulp-workflow), and contains the `.svg` icons in `assets/icon-font`. You can also use another icon font. Just remove the references in the `nav-*.scss` files and edit/remove the icon styles in the `_layout-*.scss` files.

> Example icons downloaded from [Flaticon](http://www.flaticon.com/).

## Known Issues ##

### No keyboard navigation without javascript ###

Regretably there is no CSS way to enable navigating through the drop down menu's with the `tab` key. The `tab` key triggers the `:focus` selector on the links, but not `:hover` on the parent `<li>`. So there is no way to keep the parent menu's open when tabbing into a sub menu... This does work when you use our jQuery plugin.

### Close button not always showing on <= Android 4.3 (no-js) ###

- Android 4.3 browser and lower

This issue is only relevant when using no javascript. (CSS navigation only)

Android 4.3 browser and lower have issues when combining pseudo classes with adjacent or general sibling selectors. Therefor the "close menu" button is not shown when you press the menu button. It does show when you use the menu.

### Fixed header width glitch on <= Android 4.3 ###

- Android 4.3

When you zoom in, the header scales to fit in the browser window, but  when you zoom out again, it doesn't seem to "resize" to full width immediately.

---
[![Analytics](https://ga-beacon.appspot.com/UA-58876018-1/codezero-be/responsive-nav)](https://github.com/igrigorik/ga-beacon)