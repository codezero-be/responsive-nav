(function ($, window, document, undefined) {

    var Navigation = {

        init: function (options, caller) {
            var self = this;

            self.options = $.extend({}, $.fn.nav.options, options);

            self.$body = $('body');
            self.$nav = $(caller);
            self.$menuButton = $(self.options.navButton);
            self.$subMenu = $(self.options.subMenu);
            self.subMenu = self.options.subMenu;
            self.mobileMode = self.isCurrentlyMobile(self);
            self.mouseOver = self.options.mouseOver;

            $('html').removeClass('nav-no-js');
            self.collapseSubMenus(self);
            self.bindEvents(self);
        },

        bindEvents: function (self) {
            // Click menu button (mobile)
            self.$menuButton.on('click', function (event) {
                self.toggleNav(self);
                event.preventDefault();
            });

            // Click sub menu link
            self.$nav.on('click', self.subMenu + ' > a', function (event) {
                self.toggleSubMenu(self, $(this).parent());
                event.preventDefault();
            });

            if (self.mouseOver) {
                // Mouse enter sub menu
                self.$nav.on('mouseenter', self.subMenu, function () {
                    if (self.mobileMode === false) {
                        // Don't use mouse enter in mobile mode
                        self.openSubMenu(self, $(this));
                    }
                });

                // Mouse leave sub menu
                self.$nav.on('mouseleave', self.subMenu, function () {
                    if (self.mobileMode === false) {
                        // Don't use mouse leave in mobile mode
                        self.closeSubMenu(self, $(this));
                    }
                });
            }

            // Window Resize Event
            $(window).on('resize', function () {
                self.resetNav(self);
            });
        },

        // Show or hide the navigation (mobile)
        toggleNav: function (self) {
            if (self.$nav.is(':visible')) {
                // If we're closing the nav,
                // then also collapse sub menu's
                self.collapseSubMenus(self);
            }

            self.$nav.stop().clearQueue().slideToggle();
            self.$body.toggleClass('nav-lock-scroll');
        },

        toggleSubMenu: function (self, li) {
            li.hasClass('nav-active')
                ? self.closeSubMenu(self, li)
                : self.openSubMenu(self, li);
        },

        openSubMenu: function (self, li) {
            // Activate clicked menu
            li.addClass('nav-active')
                // And open it
                .children('ul').stop().clearQueue().slideDown();

            // Deactivate all siblings
            li.siblings(self.subMenu).removeClass('nav-active')
                // Close all sibling sub menu's
                .children('ul').slideUp()
                // Then deactivate their sub menu's
                .find('.nav-active').removeClass('nav-active')
                // And close them
                .children('ul').slideUp();

        },

        closeSubMenu: function (self, li) {
            // Deactivate clicked sub menu
            li.removeClass('nav-active')
                // And close it
                .children('ul').stop().clearQueue().slideUp()
                // Deactivate sub menu's of the clicked sub menu
                .find('.nav-active').removeClass('nav-active')
                // And close them
                .children('ul').slideUp();
        },

        // Reset nav when we switch from mobile
        // to desktop mode and vice versa
        resetNav: function (self) {
            var currentMobileMode = self.isCurrentlyMobile(self);

            if (self.mobileMode !== currentMobileMode) {
                // Remove inline styling
                self.$nav.removeAttr('style')
                    .find('ul').removeAttr('style');

                // Unlock scrolling
                self.$body.removeClass('nav-lock-scroll');

                self.collapseSubMenus(self);
                self.mobileMode = currentMobileMode;
            }
        },

        collapseSubMenus: function (self) {
            self.$subMenu.removeClass('nav-active')
                .children('ul').hide();
        },

        // If .nav-button is visible then
        // we're in mobile mode!
        isCurrentlyMobile: function (self) {
            return self.$menuButton.is(':visible');
        }
    };

    $.fn.nav = function (options) {
        return this.each(function () {
            var nav = Object.create(Navigation);
            nav.init(options, this);
        });
    };

    $.fn.nav.options = {
        // Mobile menu button selector
        navButton: '.nav-button',
        // Sub menu selector (<li>)
        subMenu: '.nav-submenu',
        // Open sub menu's on mouse over
        // when not in mobile mode
        mouseOver: true
    };

}(jQuery, window, document));