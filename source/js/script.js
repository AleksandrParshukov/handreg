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

    $cases_slider.on('click', '.swiper-slide-prev', function (evt) {
      evt.preventDefault();
      slider.slidePrev();
    });

    $cases_slider.on('click', '.swiper-slide-next', function (evt) {
      evt.preventDefault();
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
  const map_center = [30.335683, 59.987996];

  map = new YMap($map[0], {
    location: {
      center: map_center,
      zoom: 16,
    },
    theme,
  });
  map.addChild(new YMapDefaultSchemeLayer());

  map.addChild(new YMapDefaultFeaturesLayer());

  const marker_element = document.createElement('div');

  marker_element.className = 'contacts__marker';
  marker_element.innerHTML = `
  <div>
    <svg width="165" height="48" viewBox="0 0 165 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M53.0771 34.1777H47.9593L44.6586 27.9374C44.5961 27.8215 44.5337 27.6567 44.4715 27.4429C44.4091 27.2291 44.3424 26.9663 44.2709 26.6544H44.2175C44.182 26.797 44.1285 26.9819 44.0571 27.209C43.9859 27.4363 43.8923 27.6969 43.7766 27.9909L40.4627 34.1777H35.3179L41.4248 24.5965L35.8391 15.0155H41.0906L43.8301 20.7615C43.937 20.9843 44.0373 21.2314 44.1307 21.5032C44.2243 21.7749 44.3156 22.0666 44.4046 22.3783H44.458C44.5115 22.1912 44.5895 21.9575 44.6919 21.6768C44.7943 21.3963 44.9168 21.0734 45.0595 20.708L48.1062 15.0155H52.9168L47.1708 24.5163L53.0771 34.1777Z" fill="currentColor" />
            <path d="M55.0542 33.122L56.4839 29.9951C57.0721 30.307 57.7088 30.5476 58.3949 30.7167C59.0808 30.886 59.8069 30.9705 60.5729 30.9705C62.1854 30.9705 63.446 30.5875 64.3547 29.8213C65.2634 29.0552 65.8201 27.906 66.0252 26.3739H58.6354V22.9528H66.0519C65.7756 21.376 65.1832 20.1934 64.2745 19.4051C63.3659 18.6166 62.141 18.2224 60.5997 18.2224C59.9582 18.2224 59.3348 18.2715 58.7289 18.3695C58.1232 18.4676 57.4415 18.6679 56.6845 18.9707L55.3482 15.7102C56.3548 15.2915 57.3079 15.0177 58.2078 14.8885C59.1075 14.7594 60.0519 14.6946 61.0407 14.6946C64.0785 14.6946 66.4528 15.5699 68.1632 17.3205C69.8736 19.071 70.7289 21.5143 70.7289 24.65C70.7289 27.6165 69.8779 30.0017 68.1765 31.8058C66.4748 33.6097 64.0295 34.5117 60.8402 34.5117C60.0831 34.5117 59.1877 34.4181 58.1544 34.231C57.1208 34.0439 56.0875 33.6745 55.0542 33.122Z" fill="currentColor" />
            <path d="M91.1897 34.1309H87.087V26.327H79.5652V34.1309H75.4751V14.9686H79.5652V22.6121H87.087V14.9686H91.1897V34.1309Z" fill="currentColor" />
            <path d="M101.101 30.6752H107.635V18.6534H102.787V20.6007C102.787 22.548 102.641 24.3938 102.349 26.1382C102.058 27.8825 101.641 29.3951 101.101 30.6752ZM95.2085 38.4775V30.6752H96.92C97.5734 29.1426 98.072 27.4657 98.4162 25.6448C98.7604 23.8238 98.9366 21.9936 98.9454 20.1545V15.0159H111.816V30.6752H114.495V38.4775H110.653V34.4073H99.0499V38.4775H95.2085Z" fill="currentColor" />
            <path d="M122.14 18.2826V24.5764H123.76C124.857 24.5764 125.679 24.3115 126.228 23.7814C126.776 23.2514 127.05 22.4563 127.05 21.3962C127.05 20.3539 126.776 19.5744 126.228 19.0576C125.679 18.5411 124.857 18.2826 123.76 18.2826H122.14ZM122.14 27.8503V34.1309H118.02V14.9686H124.474C126.778 14.9686 128.506 15.4897 129.659 16.532C130.811 17.5743 131.387 19.1423 131.387 21.2359C131.387 23.2134 130.726 24.8103 129.404 26.0264C128.081 27.2423 126.315 27.8503 124.104 27.8503H122.14Z" fill="currentColor" />
            <path d="M148.919 34.2041H136.3V15.0419H148.435V18.5562H141.039V22.819H147.921V26.3201H141.039V30.7031H148.919V34.2041Z" fill="currentColor" />
            <path d="M164.789 18.5231H157.68V34.1309H153.363V14.9686H164.789V18.5231Z" fill="currentColor" />
            <path d="M20.4251 36.0986C18.6877 36.0986 17.0485 35.6862 15.5968 34.9586L12.2661 38.7301V42.2269C12.2661 42.2981 12.2732 42.3676 12.277 42.4379C12.2787 42.4713 12.2796 42.5044 12.2821 42.5373C12.2877 42.6053 12.2952 42.672 12.3042 42.7387C12.3095 42.7777 12.3159 42.8164 12.3226 42.8551C12.404 43.3483 12.5791 43.8101 12.831 44.224C12.8601 44.2726 12.8904 44.3207 12.9214 44.3686C12.9362 44.3904 12.9494 44.4135 12.9646 44.4349C14.1517 46.209 16.737 47.4395 19.7375 47.4395C22.8946 47.4395 25.5921 46.0769 26.6845 44.1522C26.7026 44.1208 26.721 44.0891 26.7383 44.0573C26.779 43.9814 26.8166 43.9048 26.8521 43.8272C26.8792 43.7686 26.9038 43.709 26.928 43.6487C26.9515 43.5897 26.9739 43.5307 26.9947 43.4708C27.009 43.4293 27.0236 43.3879 27.0364 43.3455C27.0695 43.2384 27.0986 43.13 27.1221 43.0205C27.1228 43.0175 27.1232 43.015 27.1238 43.012C27.1488 42.8935 27.1668 42.7736 27.1801 42.6526C27.1818 42.638 27.1835 42.6233 27.185 42.6085C27.1965 42.4899 27.2046 42.3701 27.2046 42.2493C27.2046 42.2449 27.2042 42.2406 27.2042 42.2361C27.2042 42.2329 27.2046 42.2301 27.2046 42.2269V38.4774L29.3241 35.2118C30.2358 33.8066 30.7196 32.1791 30.7196 30.5175V28.4359C29.4227 32.8623 25.3063 36.0986 20.4251 36.0986Z" fill="#F18533" />
            <path d="M20.4251 36.0986C18.6877 36.0986 17.0485 35.6862 15.5968 34.9586L12.2661 38.7301V42.2269C12.2661 42.2981 12.2732 42.3676 12.277 42.4379C12.2787 42.4713 12.2796 42.5044 12.2821 42.5373C12.2877 42.6053 12.2952 42.672 12.3042 42.7387C12.3095 42.7777 12.3159 42.8164 12.3226 42.8551C12.404 43.3483 12.5791 43.8101 12.831 44.224C12.8601 44.2726 12.8904 44.3207 12.9214 44.3686C12.9362 44.3904 12.9494 44.4135 12.9646 44.4349C14.1517 46.209 16.737 47.4395 19.7375 47.4395C22.8946 47.4395 25.5921 46.0769 26.6845 44.1522C26.7026 44.1208 26.721 44.0891 26.7383 44.0573C26.779 43.9814 26.8166 43.9048 26.8521 43.8272C26.8792 43.7686 26.9038 43.709 26.928 43.6487C26.9515 43.5897 26.9739 43.5307 26.9947 43.4708C27.009 43.4293 27.0236 43.3879 27.0364 43.3455C27.0695 43.2384 27.0986 43.13 27.1221 43.0205C27.1228 43.0175 27.1232 43.015 27.1238 43.012C27.1488 42.8935 27.1668 42.7736 27.1801 42.6526C27.1818 42.638 27.1835 42.6233 27.185 42.6085C27.1965 42.4899 27.2046 42.3701 27.2046 42.2493C27.2046 42.2449 27.2042 42.2406 27.2042 42.2361C27.2042 42.2329 27.2046 42.2301 27.2046 42.2269V38.4774L29.3241 35.2118C30.2358 33.8066 30.7196 32.1791 30.7196 30.5175V28.4359C29.4227 32.8623 25.3063 36.0986 20.4251 36.0986Z" stroke="#F18533" stroke-width="0.213805" stroke-miterlimit="10" />
            <path d="M12.0601 32.1132C10.5861 30.2916 9.70249 27.9802 9.70249 25.4629C9.70249 25.121 9.72024 24.7832 9.7521 24.4496L5.37466 19.7782C4.24684 18.5747 2.32987 18.4894 1.09386 19.5877C-0.0737231 20.6251 -0.22531 22.3618 0.746004 23.576L9.70634 34.7783L12.0601 32.1132Z" fill="#F18533" />
            <path d="M12.0601 32.1132C10.5861 30.2916 9.70249 27.9802 9.70249 25.4629C9.70249 25.121 9.72024 24.7832 9.7521 24.4496L5.37466 19.7782C4.24684 18.5747 2.32987 18.4894 1.09386 19.5877C-0.0737231 20.6251 -0.22531 22.3618 0.746004 23.576L9.70634 34.7783L12.0601 32.1132Z" stroke="#F18533" stroke-width="0.213805" stroke-miterlimit="10" />
            <path d="M20.5406 31.1689C22.7392 31.1689 24.6466 29.9263 25.6018 28.106C25.4911 26.1529 23.5863 24.2034 20.8787 23.4664C18.4913 22.8165 16.1639 23.2954 14.9024 24.5331C14.8537 24.8335 14.8271 25.1416 14.8271 25.4557C14.8271 28.611 17.3853 31.1689 20.5406 31.1689Z" fill="#F18533" />
            <path d="M16.8306 21.8536C17.0559 21.6186 18.2823 20.3867 20.2514 20.357C22.3668 20.3249 23.6836 21.7052 23.8861 21.9248" stroke="#F18533" stroke-width="1.49663" stroke-miterlimit="10" stroke-linecap="round" />
            <path d="M28.7294 25.6204C28.6379 30.1426 24.8978 33.7345 20.3757 33.6428C15.8535 33.5513 12.2618 29.8112 12.3533 25.289C12.4448 20.7669 16.1849 17.1752 20.707 17.2667C25.2292 17.3582 28.8209 21.0983 28.7294 25.6204Z" stroke="#F18533" stroke-width="2.56566" stroke-miterlimit="10" />
            <path d="M7.49121 40.4346L14.7554 32.4019" stroke="#F18533" stroke-width="2.56566" stroke-miterlimit="10" />
            <path d="M20.9722 14.8442C22.6469 14.928 24.2194 15.3928 25.6047 16.1533V11.9503L25.566 11.9326V4.85503C25.566 3.45332 24.4296 2.31695 23.0277 2.31695C22.181 2.31695 21.4333 2.73302 20.9722 3.37015V14.8442Z" fill="#F18533" />
            <path d="M20.9722 14.8442C22.6469 14.928 24.2194 15.3928 25.6047 16.1533V11.9503L25.566 11.9326V4.85503C25.566 3.45332 24.4296 2.31695 23.0277 2.31695C22.181 2.31695 21.4333 2.73302 20.9722 3.37015V14.8442Z" stroke="#F18533" stroke-width="0.213805" stroke-miterlimit="10" />
            <path d="M15.5874 15.9717C16.9945 15.2646 18.5796 14.8567 20.259 14.8315V1.59374C19.859 0.71736 18.9771 0.106732 17.9506 0.106732C16.8741 0.106732 15.9564 0.77808 15.5874 1.72374V15.9717Z" fill="#F18533" />
            <path d="M15.5874 15.9717C16.9945 15.2646 18.5796 14.8567 20.259 14.8315V1.59374C19.859 0.717359 18.9771 0.106733 17.9506 0.106733C16.8741 0.106733 15.9564 0.77808 15.5874 1.72374V15.9717Z" stroke="#F18533" stroke-width="0.213805" stroke-miterlimit="10" />
            <path d="M28.1809 7.11331C27.4433 7.11331 26.7811 7.42996 26.3174 7.9324V16.5806C28.4165 17.9545 30.0008 20.0395 30.7192 22.4912V14.3177V9.6516C30.7192 8.24968 29.5828 7.11331 28.1809 7.11331Z" fill="#F18533" />
            <path d="M28.1809 7.11331C27.4433 7.11331 26.7811 7.42996 26.3174 7.9324V16.5806C28.4165 17.9545 30.0008 20.0395 30.7192 22.4912V14.3177V9.6516C30.7192 8.24968 29.5828 7.11331 28.1809 7.11331Z" stroke="#F18533" stroke-width="0.213805" stroke-miterlimit="10" />
            <path d="M14.8744 16.3639V3.83832C14.4158 3.38249 13.7853 3.09963 13.0876 3.09963C11.9004 3.09963 10.8089 3.87082 10.5316 4.97191L10.5117 21.4043C11.3894 19.2981 12.9298 17.5338 14.8744 16.3639Z" fill="#F18533" />
            <path d="M14.8744 16.3639V3.83832C14.4158 3.38249 13.7853 3.09963 13.0876 3.09963C11.9004 3.09963 10.8089 3.87082 10.5316 4.97191L10.5117 21.4043C11.3894 19.2981 12.9298 17.5338 14.8744 16.3639Z" stroke="#F18533" stroke-width="0.213805" stroke-miterlimit="10" />
          </svg>
  </div>
`;

  const marker = new ymaps3.YMapMarker(
    {
      coordinates: map_center,
    },
    marker_element,
  );

  map.addChild(marker);

  /* map.addChild(
    new YMapDefaultMarker({
      coordinates: map_center,
      title: 'Хэндрег',
      subtitle: 'Веб-студия',
    }),
  ); */
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
