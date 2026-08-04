function init_theme_toggle() {
  const $theme_toggle = $('.js_theme_toggle');

  if (!$theme_toggle.length) return;

  if (localStorage.getItem('theme') === 'light') {
    $('html').removeClass('dark-theme');
    $theme_toggle.removeClass('dark');
  } else {
    $('html').addClass('dark-theme');
    $theme_toggle.addClass('dark');
  }

  $theme_toggle.on('click', function (evt) {
    evt.preventDefault();
    $('html').toggleClass('dark-theme');
    localStorage.setItem('theme', $('html').hasClass('dark-theme') ? 'dark' : '');
    $theme_toggle.toggleClass('dark');
  });
}

function init_header() {
  function toggleHeaderClass() {
    if ($(window).scrollTop() > 50) {
      $('header').addClass('is-scrolled');
    } else {
      $('header').removeClass('is-scrolled');
    }
  }

  toggleHeaderClass();
  $(window).on('scroll', toggleHeaderClass);
}

function init_menu() {
  const $menu_open = $('.js_menu_open'),
    $menu_close = $('.js_menu_close'),
    $main_nav = $('.main-nav');

  $menu_open.on('click', function (evt) {
    evt.preventDefault();

    if ($main_nav.is('.open')) {
      $main_nav.removeClass('open');
      // $('html').removeClass('modal-open');
    } else {
      $main_nav.addClass('open');
      // $('html').addClass('modal-open');
    }

    $main_nav.on('click', main_nav_click_handler);
  });

  $menu_close.on('click', function (evt) {
    evt.preventDefault();

    $main_nav.removeClass('open');
    // $('html').removeClass('modal-open');
    $main_nav.off('click', main_nav_click_handler);
  });

  function main_nav_click_handler(evt) {
    if (!$(evt.target).is('.main-nav__content') && !$(evt.target).closest('.main-nav__content').length) {
      $main_nav.removeClass('open');
      $('html').removeClass('modal-open');
      $main_nav.off('click', main_nav_click_handler);
    }
  }
}

function init_modals() {
  $.fn.modal = function (action) {
    return this.each(function () {
      var $modal = $(this);

      function show_modal() {
        $modal.fadeIn(0, function () {
          $modal.addClass('show');
        });
        $('body').addClass('modal_open'); // можно потом использовать для блокировки скролла
      }

      function hide_modal() {
        $modal.removeClass('show');
        setTimeout(function () {
          $modal.fadeOut(0);
          $('body').removeClass('modal_open');
        }, 300);
      }

      if (action === 'show') {
        show_modal();
      } else if (action === 'hide') {
        hide_modal();
      }

      // Поддержка кликов на кнопки и фон
      if (!$modal.data('modal_initialized')) {
        $modal.on('click', function (e) {
          if ($(e.target).is('.modal')) hide_modal();
        });
        $modal.on('click', '[data-dismiss="modal"]', hide_modal);
        $modal.data('modal_initialized', true);
      }
    });
  };

  $(document).on('click', '[data-dismiss="modal"]', function () {
    var $modal = $(this).closest('.modal');
    $modal.modal('hide');
  });

  // Открытие через data-атрибуты (bootstrap-стиль)
  $(document).on('click', '[data-toggle="modal"]', function (evt) {
    evt.preventDefault();
    var target = $(this).data('target');
    $(target).modal('show');
  });

  // Закрытие по Esc
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.modal.show').each(function () {
        $(this).modal('hide');
      });
    }
  });
}

function init_custom_select() {
  const $selects = $('.js_custom_select');

  if (!$selects.length) {
    return false;
  }

  $selects.each(function () {
    const $select = $(this);

    $select.hide();

    const $wrapper = $('<div class="custom-select"></div>'),
      $current = $('<div class="custom-select__current"></div>'),
      $list = $('<ul class="custom-select__list"></ul>');

    function toggle_placeholder(value) {
      $current.toggleClass('placeholder', value === '');
    }

    $select.find('option').each(function () {
      const $option = $(this),
        $item = $('<li class="custom_select__item"></li>');

      $item.text($option.text()).attr('data_value', $option.val());

      if ($option.is(':selected')) {
        $current.text($option.text());
        toggle_placeholder($option.val());
      }

      $list.append($item);
    });

    $wrapper.append($current).append($list);
    $select.before($wrapper);

    // открыть/закрыть
    $current.on('click', function () {
      $('.custom-select').not($wrapper).removeClass('open');
      $wrapper.toggleClass('open');
    });

    // выбор
    $list.on('click', '.custom_select__item', function () {
      const value = $(this).attr('data_value'),
        text = $(this).text();

      $current.text(text);
      toggle_placeholder(value);
      $wrapper.removeClass('open');

      $select.val(value).trigger('change');
    });

    // синхронизация если меняют оригинальный select
    $select.on('change', function () {
      const value = $select.val(),
        $item = $list.find('[data_value="' + value + '"]');

      if ($item.length) {
        $current.text($item.text());
      }

      toggle_placeholder(value);
    });

    // закрытие при клике вне
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.custom-select').length) {
        $('.custom-select').removeClass('open');
      }
    });
  });
}

function init_form() {
  $('.js_phone_input').on('keydown', function (evt) {
    $(this).mask('+7 (000) 000-00-00');
  });
}

function init_popups() {
  const $popup_toggle = $('.js_popup_toggle'),
    $popup = $('.js_popup'),
    $popup_close = $('.js_popup_close');

  if (!$popup_toggle.length || !$popup.length) {
    return false;
  }

  $popup_toggle.on('click', function (evt) {
    evt.preventDefault();
    $popup.not($(this).next($popup)).removeClass('show');
    $(this).next($popup).toggleClass('show');

    $(document).on('click', function doc_click_handler(e) {
      if (!$(e.target).closest($popup).length && !$(e.target).closest($popup_toggle).length) {
        $popup.removeClass('show');
        $(document).off('click', doc_click_handler);
      }
    });
  });

  if ($popup_close.length) {
    $popup_close.on('click', function (evt) {
      evt.preventDefault();
      $(this).closest($popup).removeClass('show');
    });
  }
}

function init_cookie() {
  const $cookie = $('.js_cookie');

  if (!$cookie.length) {
    return false;
  }

  $cookie.find('.js_apply_cookie').on('click', function (evt) {
    evt.preventDefault();

    $cookie.remove();
  });
}

function init_sliders() {
  const $cases_slider = $('.js_cases_slider');

  if (!$cases_slider.length) {
    return false;
  }

  const slider = new Swiper($cases_slider[0], {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: true,
    loopedSlides: 3,
    speed: 1000,

    effect: 'coverflow',
    grabCursor: true,

    coverflowEffect: {
      rotate: 0,
      stretch: -85,
      depth: 210,
      modifier: 3,
      slideShadows: false,
    },

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  });

  $cases_slider.on('click', '.swiper-slide-prev', function () {
    slider.slidePrev();
  });

  $cases_slider.on('click', '.swiper-slide-next', function () {
    slider.slideNext();
  });
}

function init_cursor_fill() {
  const $btn = $('.js_cursor_fill');

  $btn.mouseover(function (e) {
    // положение элемента
    var pos = $(this).offset();
    var elem_left = pos.left;
    var elem_top = pos.top;
    // положение курсора внутри элемента
    var Xinner = e.pageX - elem_left;
    var Yinner = e.pageY - elem_top;
    $(this).css({
      '--x': Xinner + 'px',
      '--y': Yinner + 'px',
    });
  });
}

$(document).ready(function () {
  init_header();
  init_menu();
  init_form();
  init_modals();
  init_popups();
  init_custom_select();
  init_cookie();
  init_sliders();
  init_theme_toggle();
  init_cursor_fill();
});
