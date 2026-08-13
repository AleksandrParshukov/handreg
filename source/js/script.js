function init_theme_toggle() {
  const $theme_toggle = $('.js_theme_toggle');

  if (!$theme_toggle.length) {
    return;
  }

  const saved_theme = localStorage.getItem('theme');
  const theme = saved_theme === 'light' ? 'light' : 'dark';

  set_theme(theme);

  $theme_toggle.on('click', function (evt) {
    evt.preventDefault();

    const current_theme = $('html').hasClass('light-theme') ? 'light' : 'dark';

    set_theme(current_theme === 'light' ? 'dark' : 'light');
  });
}

function set_theme(theme) {
  const is_light = theme === 'light';

  $('html').toggleClass('light-theme', is_light);
  $('.js_theme_toggle').toggleClass('dark', !is_light);

  localStorage.setItem('theme', theme);

  set_map_theme(theme);
}

function set_map_theme(theme) {
  if (!map) {
    return;
  }

  map.update({
    theme,
  });
}

function init_menu() {
  const $menu_open = $('.js_menu_open'),
    $menu_close = $('.js_menu_close'),
    $menu = $('.header__menu');
  $main_nav = $('.main-nav');

  $menu_open.on('click', function (evt) {
    evt.preventDefault();

    if ($menu.is('.open')) {
      $menu.removeClass('open');
    } else {
      $menu.addClass('open');
    }

    $menu.on('click', menu_click_handler);
  });

  $menu_close.on('click', function (evt) {
    evt.preventDefault();

    $menu.removeClass('open');
    // $('html').removeClass('modal-open');
    $menu.off('click', main_nav_click_handler);
  });

  function menu_click_handler(evt) {
    if (
      !$(evt.target).is($main_nav) &&
      !$(evt.target).closest($main_nav).length &&
      !$(evt.target).is($menu_open) &&
      !$(evt.target).closest($menu_open).length
    ) {
      $menu.removeClass('open');
      $menu.off('click', main_nav_click_handler);
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

  $('.floating-label input').on('focus', function () {
    $(this).closest('.floating-label').addClass('focused');
  });

  $('.floating-label input').on('blur', function () {
    if (!$(this).val()) {
      $(this).closest('.floating-label').removeClass('focused');
    }
  });

  $('.floating-label input').each(function () {
    if ($(this).val()) {
      $(this).closest('.floating-label').addClass('focused');
    }
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

  if ($cases_slider.length) {
    const slider = new Swiper($cases_slider[0], {
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      loopedSlides: 3,
      speed: 1000,

      effect: 'coverflow',
      grabCursor: true,

      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      breakpoints: {
        576: {
          coverflowEffect: {
            rotate: 0,
            stretch: -25,
            depth: 180,
            modifier: 3,
            slideShadows: false,
          },
        },
        992: {
          coverflowEffect: {
            rotate: 0,
            stretch: -85,
            depth: 210,
            modifier: 3,
            slideShadows: false,
          },
        },
      },
    });

    $cases_slider.on('click', '.swiper-slide-prev', function () {
      slider.slidePrev();
    });

    $cases_slider.on('click', '.swiper-slide-next', function () {
      slider.slideNext();
    });
  }

  const $stack_slider = $('.js_stack_slider');

  if ($stack_slider.length) {
    const $wrapper = $stack_slider.find('.swiper-wrapper');

    // Дублируем слайды
    $wrapper.append($wrapper.html());

    const swiper = new Swiper($stack_slider[0], {
      slidesPerView: 'auto',
      spaceBetween: 80,
      freeMode: {
        enabled: true,
        momentum: false,
      },
      allowTouchMove: true,
      watchSlidesProgress: true,
    });

    let animation_id = null;
    const speed = 0.5;

    const first_half_width = swiper.slides
      .slice(0, swiper.slides.length / 2)
      .reduce((sum, slide) => sum + slide.offsetWidth + swiper.params.spaceBetween, 0);

    function animate() {
      if (!swiper.destroyed && !swiper.isTouched) {
        let translate = swiper.getTranslate() - speed;

        if (Math.abs(translate) >= first_half_width) {
          translate += first_half_width;
        }

        swiper.setTranslate(translate);
        swiper.updateProgress(translate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      animation_id = requestAnimationFrame(animate);
    }

    swiper.on('touchStart', () => {
      cancelAnimationFrame(animation_id);
    });

    swiper.on('touchEnd', () => {
      wait_for_swiper();
    });

    animate();

    let last_translate = null;
    let stable_frames = 0;

    function wait_for_swiper() {
      const current_translate = swiper.getTranslate();

      const epsilon = 0.1;

      if (Math.abs(current_translate - last_translate) < epsilon) {
        stable_frames++;

        if (stable_frames >= 3) {
          last_time = performance.now();
          animation_id = requestAnimationFrame(animate);
          return;
        }
      } else {
        stable_frames = 0;
        last_translate = current_translate;
      }

      requestAnimationFrame(wait_for_swiper);
    }
  }
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

let map;

async function init_map() {
  const $map = $('.js_map');

  if (!$map.length) {
    return;
  }

  await ymaps3.ready;

  ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', ['@yandex/ymaps3-default-ui-theme@0.0']);

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3,
    theme = $('html').hasClass('light-theme') ? 'light' : 'dark';

  const { YMapDefaultMarker } = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
  const map_center = [30.334391, 59.987753];

  map = new YMap($map[0], {
    location: {
      center: map_center,
      zoom: 16,
    },
    theme,
  });
  map.addChild(new YMapDefaultSchemeLayer());

  map.addChild(new YMapDefaultFeaturesLayer());

  map.addChild(
    new YMapDefaultMarker({
      coordinates: map_center,
      title: 'Хэндрег',
      subtitle: 'Веб-студия',
    }),
  );
}

$(document).ready(function () {
  init_menu();
  init_form();
  init_modals();
  init_popups();
  init_custom_select();
  init_cookie();
  init_sliders();
  init_theme_toggle();
  init_cursor_fill();
  init_map();
});
