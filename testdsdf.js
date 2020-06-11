'use strict';
(function(klass, sr) {
  /**
   * @param {!Function} func
   * @param {number} threshold
   * @param {?} execAsap
   * @return {?}
   */
  var debounce = function(func, threshold, execAsap) {
    var _takingTooLongTimeout;
    return function() {
      var tmpthis = this;
      /** @type {!Arguments} */
      var arg = arguments;
      if (_takingTooLongTimeout) {
        clearTimeout(_takingTooLongTimeout);
      } else {
        if (execAsap) {
          func.apply(tmpthis, arg);
        }
      }
      /** @type {number} */
      _takingTooLongTimeout = setTimeout(function() {
        if (!execAsap) {
          func.apply(tmpthis, arg);
        }
        /** @type {null} */
        _takingTooLongTimeout = null;
      }, threshold || 500);
    };
  };
  /**
   * @param {!Function} fn
   * @return {?}
   */
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind("resize", debounce(fn)) : this.trigger(sr);
  };
})(jQuery, "smartresize");
(function(self, $, canCreateDiscussions) {
  var that = {
    wrapper : $("body"),
    navigation : $(".navigation"),
    secondaryLinks : $(".level_2_list .level_2_list_item_link"),
    cookieBanner : $("div.cookie_banner"),
    headerPromo : $("div.header_promo_slot"),
    mobileMyAccount : $(".mobile_my_account"),
    window : $(window),
    levelOneItems : $(".level_1_list a.level_1_list_item_link:not(.non_expandable)")
  };
  self.responsive = {
    mobileLayoutWidth : 800,
    viewports : {
      XXXLARGE : 7,
      XXLARGE : 6,
      XLARGE : 5,
      LARGE : 4,
      MEDIUM : 3,
      SMALL : 2,
      XSMALL : 1
    },
    getViewport : function() {
      /** @type {number} */
      var viewport = parseInt(that.viewportState.css("z-index"), 10);
      if (self.responsive.currentViewport !== viewport) {
        var d = window.opera ? window.getComputedStyle(document.body, ":after").getPropertyValue("content") : that.viewportState.css("font-family");
        d = d.replace(/'|"/g, "");
        self.responsive.previousViewportString = self.responsive.viewportString || "";
        /** @type {number} */
        self.responsive.currentViewport = viewport;
        self.responsive.viewportString = d;
        $("html").removeClass("bp-" + self.responsive.previousViewportString.toLowerCase()).addClass("bp-" + d.toLowerCase());
        $(document).trigger("viewportchange");
      }
      return self.responsive.currentViewport;
    },
    init : function() {
      /** @type {!Element} */
      that.viewportState = document.createElement("div");
      /** @type {string} */
      that.viewportState.id = "viewport-state";
      document.body.appendChild(that.viewportState);
      that.viewportState = $(that.viewportState);
      self.responsive.getViewport();
      /** @type {number} */
      var G = 0;
      /** @type {number} */
      var a = 0;
      /** @type {number} */
      var z = 0;
      /** @type {number} */
      var notifyheight = 0;
      that.navigation.find(".navigation_header").click(function(target) {
        var $sharepreview = $(this);
        if ($(target.target).hasClass("navigation_header")) {
          target = $sharepreview.find(".mob-menu__list");
          target.toggleClass(target.data("toggler"));
        }
        target = $(".js_modalpopup_sticker");
        a = that.mobileMyAccount.outerHeight();
        G = that.cookieBanner.height();
        z = that.window.height();
        notifyheight = that.headerPromo.height();
        js_modal_stickyHeight = target.outerHeight();
        if (null === G || that.cookieBanner.is(":hidden")) {
          /** @type {number} */
          G = 0;
        }
        if (null === notifyheight || that.headerPromo.is(":hidden")) {
          /** @type {number} */
          notifyheight = 0;
        }
        if (null === js_modal_stickyHeight || target.is(":hidden")) {
          /** @type {number} */
          js_modal_stickyHeight = 0;
        }
        /** @type {number} */
        target = z - a - G - js_modal_stickyHeight;
        that.navigation.find(".level_1_list").css({
          "max-height" : target,
          top : a
        });
        if (!(that.navigation.hasClass("js_sticky") || that.navigation.hasClass("loyalty-navigation"))) {
          that.navigation.css("top", "-" + notifyheight + "px");
        }
      });
      that.navigation.find(".close_responsive_menu").on("click", function() {
        self.responsive.closeMobileNavigation();
        that.navigation.css("top", "");
      });
      that.secondaryLinks.each(function() {
        var currTD = $(this);
        if (0 >= currTD.siblings(".level_3_list").length) {
          currTD.addClass("non_expandable");
          currTD.siblings(".level_2_list_link_wrapper").remove();
        }
      });
      if (that.wrapper.width() <= this.mobileLayoutWidth) {
        self.responsive.enableMobileNav();
      }
      that.navigation.on("click", ".nav-item-mobile, .level_2_list_item", function(b) {
        if (b.target === this) {
          $(this).toggleClass("mob-menu__item--expanded");
        }
      });
      that.navigation.on("click", ".mobile-close-account-popup", function() {
        var target = $(this).closest(".mob-menu__list");
        target.toggleClass(target.data("toggler"));
      });
      that.navigation.on("click", ".nav-item-mobile-back", function() {
        $(this).closest(".nav-item-mobile").removeClass("mob-menu__item--expanded");
      });
    },
    enableMobileNav : function() {
      if (that.navigation) {
        that.levelOneItems.on("click", this.expandLevelOneItem);
        $(".level_2_list a.level_2_list_item_link:not(.non_expandable)").on("click", this.expandLevelTwoItem);
        $(document).on("touchmove touchstart click", "#nav_overlay", self.responsive.closeMobileNavigation);
      }
    },
    scrollMobileMenu : function($position) {
      $(".level_1_list").animate({
        scrollTop : $position
      }, 500);
    },
    expandLevelOneItem : function(raw) {
      if (that.wrapper.width() <= self.responsive.mobileLayoutWidth) {
        var d = $(this);
        raw.preventDefault();
        if (d.siblings().is(":visible")) {
          d.parent("li").removeClass("hover");
          $(".level_2_list .expanded").removeClass("expanded");
        } else {
          $(".level_1_list .level_1_list_item").removeClass("hover");
          d.parent("li").addClass("hover");
          raw = d.parent("li").index();
          d = d.outerHeight();
          if ($(".level_1_list .account_list_wrapper")[0]) {
            raw = raw + 1;
          }
          /** @type {number} */
          scrollToTop = Math.floor(raw / 2) * d;
          self.responsive.scrollMobileMenu(scrollToTop);
        }
      }
    },
    expandLevelTwoItem : function(a) {
      if (that.wrapper.width() <= self.responsive.mobileLayoutWidth) {
        var d = $(this);
        a.preventDefault();
        if (0 < d.siblings().length && !d.siblings(".level_3_list").is(":visible")) {
          $(".level_2_list .expanded").removeClass("expanded");
          d.addClass("expanded");
          $(".level_3_list").hide();
          $(".level_2_list_link_wrapper").hide();
          d.siblings(".level_3_list").show();
          /** @type {number} */
          a = $(this).parents("li.level_1_list_item").index() / 2 + 1;
          d = $(this).parents("li.level_1_list_item").find("a.level_1_list_item_link").outerHeight();
          var scale = $(this).parent("li").index();
          var f = $(this).outerHeight();
          /** @type {number} */
          var e = parseInt($(this).parent("li").css("padding-top"), 10);
          f = f + 2 * e;
          var c = $(this).parents("li.level_1_list_item").find(".header_menu_info:visible").outerHeight();
          scrollToTop = Math.round(a) * d + c + scale * f + e;
          self.responsive.scrollMobileMenu(scrollToTop);
        } else {
          d.removeClass("expanded");
          d.siblings(".level_2_list_link_wrapper").hide();
          d.siblings(".level_3_list").hide();
        }
      }
    },
    closeMobileNavigation : function() {
      if (that.wrapper.width() <= self.responsive.mobileLayoutWidth) {
        that.navigation.find(".navigation_header").removeClass("expanded");
        $("body").removeClass("menu_expanded");
        $("#nav_overlay").hide();
        $(".level_1_list").hide("300");
        $(".level_1_list_item").removeClass("hover");
        $(".level_2_list .expanded").removeClass("expanded");
        $(".level_3_list").hide();
        $(".level_2_list_link_wrapper").hide();
      }
    },
    disableMobileNav : function() {
      that.navigation.find(".level_1_list").removeAttr("style");
      that.navigation.find(".navigation_dropdown").removeAttr("style");
      that.navigation.find(".subnavigation_close").remove();
    },
    addCustomTitle : function(title) {
      title.attr("data-text", title.text()).addClass("toplink").prepend('<span class="customtitle before">' + self.resources.CUSTOMTITLE_BEFORE + "</span> ").append(' <span class="customtitle after">' + self.resources.CUSTOMTITLE_AFTER + "</span>");
    },
    cleanCustomTitle : function() {
      $.each($(".level_1_list_item_link.toplink, .level_2_list_item_link.toplink"), function() {
        if (!$(this).parent().hasClass("expanded")) {
          $(this).removeClass("toplink").text($(this).attr("data-text"));
        }
      });
    },
    toggleGridWideTileView : function() {
      if (0 == jQuery(".toggle_grid").length) {
        jQuery(".results_hits").prepend('<a class="toggle_grid" href="' + location.href + '"># &equiv;</a>');
        jQuery(".toggle_grid").click(function() {
          jQuery(".search_result_content").toggleClass("wide_tiles");
          return false;
        });
      }
    }
  };
  $(document).ready(function() {
    self.responsive.init();
    if (767 < screen.width) {
      that.window.smartresize(function() {
        if (jQuery("body").width() <= self.responsive.mobileLayoutWidth) {
          self.responsive.enableMobileNav();
        } else {
          self.responsive.disableMobileNav();
        }
      });
    }
  });
})(window.app = window.app || {}, jQuery);
