(function($, window, document, undefined) {

    var Navigation = {

        init: function(options, caller)
        {
            var self = this;

            self.options = $.extend({}, $.fn.nav.options, options);

            self.$body = $('body');
            self.$nav = $(caller);
            self.$menuButton = $(self.options.navButton);
            self.$subMenu = $(self.options.subMenu);
            self.subMenu = self.options.subMenu;
            self.mobileMode = self.isCurrentlyMobile(self);

            $('html').removeClass('nav-no-js');
            self.collapseSubMenus(self);
            self.bindEvents(self);
        },

        bindEvents: function(self)
        {
            // Click menu button (mobile)
            self.$menuButton.on('click', function(event){
                self.toggleNav(self, event);
            });

            // Click sub menu link
            self.$nav.on('click', self.subMenu + ' > a', function(event){
                self.toggleSubMenu(self, event, $(this).parent());
            });

            // Window Resize Event
            $(window).on('resize', function(){
                self.resetNav(self);
            });
        },

        // Show or hide the navigation (mobile)
        toggleNav: function(self, event)
        {
            self.$nav.stop().slideToggle();
            self.collapseSubMenus(self);
            self.$body.toggleClass('nav-lock-scroll');
            event.preventDefault();
        },

        // Show or hide a sub menu
        toggleSubMenu: function(self, event, li)
        {
            if (li.not('.nav-active'))
            {
                // Deactivate all siblings
                li.siblings(self.subMenu).removeClass('nav-active')
                    // Hide all sibling sub menu's
                    .children('ul').slideUp()
                    // Then deactivate sub menu's of sibling sub menu's
                    .find(self.subMenu).removeClass('nav-active')
                    // And hide them
                    .children('ul').slideUp();

                // Also deactivate sub menu's of the clicked sub menu
                li.find(self.subMenu).removeClass('nav-active')
                    // And hide them
                    .children('ul').slideUp();
            }

            // Add class to parent <li>
            li.toggleClass('nav-active')
                .children('ul').stop().slideToggle();

            event.preventDefault();
        },

        // Reset nav when we switch from mobile
        // to desktop mode and vice versa
        resetNav: function(self)
        {
            var currentMobileMode = self.isCurrentlyMobile(self);

            if (self.mobileMode !== currentMobileMode)
            {
                // Remove inline styling
                self.$nav.removeAttr('style')
                    .find('ul').removeAttr('style');

                // Unlock scrolling
                self.$body.removeClass('nav-lock-scroll');

                self.collapseSubMenus(self);
                self.mobileMode = currentMobileMode;
            }
        },

        collapseSubMenus: function(self)
        {
            self.$subMenu.removeClass('nav-active')
                .children('ul').hide();
        },

        // If .nav-button is visible then
        // we're in mobile mode!
        isCurrentlyMobile: function(self){
            return self.$menuButton.is(':visible');
        }
    };

    $.fn.nav = function(options) {
        return this.each(function() {
            var nav = Object.create(Navigation);
            nav.init(options, this);
        });
    };

    $.fn.nav.options = {
        navButton: '.nav-button',
        subMenu: '.nav-submenu'
    };

}(jQuery, window, document));