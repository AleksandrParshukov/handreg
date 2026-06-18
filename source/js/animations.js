import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function init_reveals() {
  const tl = gsap.timeline();

  tl.fromTo(
    '.bannerSlideUp',
    {
      y: 50,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.2,
    },
  )
    .from(
      '.banner__img',
      {
        opacity: 0,
        scale: 0.95,
        duration: 1.5,
        ease: 'power3.out',
      },
      '<',
    )
    .fromTo(
      '.banner__callback',
      {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.5',
    );

  $('.services__item').each(function () {
    var item = this;

    gsap.set(item, {
      x: 40,
      autoAlpha: 0,
    });

    gsap.to(item, {
      x: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.fromTo(
    '.aboutSlideUp',
    {
      y: 50,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.about',
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    },
  );

  /* var $panels = $('.section').not(':last');

  $panels.each(function (i, panel) {
    var $panel = $(panel);
    var $innerPanel = $panel.find('.section-inner').first();

    var panelHeight = $innerPanel.outerHeight();
    var windowHeight = $(window).height();
    var difference = panelHeight - windowHeight;

    var fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

    if (fakeScrollRatio) {
      $panel.css('margin-bottom', panelHeight * fakeScrollRatio + 'px');
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'bottom bottom',
        end: function () {
          return fakeScrollRatio ? '+=' + $innerPanel.outerHeight() : 'bottom top';
        },
        pinSpacing: false,
        pin: true,
        scrub: true,
      },
    });

    if (fakeScrollRatio) {
      tl.to($innerPanel[0], {
        yPercent: -100,
        y: window.innerHeight,
        duration: 1 / (1 - fakeScrollRatio) - 1,
        ease: 'none',
      });
    }

    tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(panel, {
      opacity: 0,
      duration: 0.1,
    });
  }); */
}

function init_magnetic_buttons() {
  const $magnetic = $('.magneticBtn');

  $magnetic.each(function () {
    const $button = $(this);
    const button = this;
    const label = button.querySelector('span');

    const MAGNETIC_STRENGTH = 0.35,
      TEXT_STRENGTH = 0.2,
      MAGNETIC_DURATION = 0.7,
      RESET_DURATION = 0.7;

    $button.on('mousemove', function (e) {
      const rect = button.getBoundingClientRect(),
        x = e.clientX - rect.left - rect.width / 2,
        y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * MAGNETIC_STRENGTH,
        y: y * MAGNETIC_STRENGTH,
        duration: MAGNETIC_DURATION,
        ease: 'power3.out',
      });

      gsap.to($button.find('span'), {
        x: x * TEXT_STRENGTH,
        y: y * TEXT_STRENGTH,
        duration: MAGNETIC_DURATION,
        ease: 'power3.out',
      });
    });

    $button.on('mouseleave', function (e) {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: RESET_DURATION,
        ease: 'elastic.out(1, 0.3)',
      });

      gsap.to($button.find('span'), {
        x: 0,
        y: 0,
        duration: RESET_DURATION,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  });
}

function init_banner_img_parallax() {
  const $wrap = $('.banner');
  const $img = $('.banner__img');

  if (!$wrap.length || !$img.length) return;

  const img = $img[0];
  let rect;

  const xTo = gsap.quickTo(img, 'x', {
    duration: 0.8,
    ease: 'power3.out',
  });

  const yTo = gsap.quickTo(img, 'y', {
    duration: 0.8,
    ease: 'power3.out',
  });

  const rotateXTo = gsap.quickTo(img, 'rotationX', {
    duration: 0.8,
    ease: 'power3.out',
  });

  const rotateYTo = gsap.quickTo(img, 'rotationY', {
    duration: 0.8,
    ease: 'power3.out',
  });

  $wrap.on('mouseenter', function () {
    rect = this.getBoundingClientRect();
  });

  $wrap.on('mousemove', function (e) {
    if (!rect) {
      rect = this.getBoundingClientRect();
    }

    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const x = ((relX - rect.width / 2) / rect.width) * 12;
    const y = ((relY - rect.height / 2) / rect.height) * 12;

    xTo(x);
    yTo(y);
    rotateYTo(x * 0.08);
    rotateXTo(y * -0.08);
  });

  $wrap.on('mouseleave', function () {
    rect = null;
    xTo(0);
    yTo(0);
    rotateXTo(0);
    rotateYTo(0);
  });
}

function init_services_accordion() {
  var $items = $('.services__item');

  $items.each(function () {
    var $item = $(this);
    var $btn = $item.find('.services__toggle');
    var $media = $item.find('.services__media');
    var $benefits = $item.find('.services__benefits');
    var $bottom = $item.find('.services__bottom');
    var $panel = $item.find('.services__panel');

    gsap.set($media, { autoAlpha: 0, x: -24 });
    gsap.set([$benefits[0], $bottom[0]], { autoAlpha: 0, y: 16 });

    $panel.hide();

    $btn.on('click', function (e) {
      e.preventDefault();

      var isOpen = $item.hasClass('is-open');

      $items.each(function () {
        var $otherItem = $(this);
        if (!$otherItem.is($item) && $otherItem.hasClass('is-open')) {
          close_service_item($otherItem);
        }
      });

      if (isOpen) {
        close_service_item($item);
      } else {
        open_service_item($item);
      }
    });
  });

  function open_service_item($item) {
    var $btn = $item.find('.services__toggle');
    var $media = $item.find('.services__media');
    var $benefits = $item.find('.services__benefits');
    var $bottom = $item.find('.services__bottom');
    var $panel = $item.find('.services__panel');

    $item.addClass('is-open');
    $btn.attr('aria-expanded', 'true');

    $panel.stop(true, true).slideDown(400);

    gsap
      .timeline({ delay: 0.08 })
      .to($media, {
        autoAlpha: 1,
        x: 0,
        duration: 0.35,
        ease: 'power2.out',
      })
      .to(
        $benefits,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        '-=0.12',
      )
      .to(
        $bottom,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        '-=0.12',
      );
  }

  function close_service_item($item) {
    var $btn = $item.find('.services__toggle');
    var $media = $item.find('.services__media');
    var $benefits = $item.find('.services__benefits');
    var $bottom = $item.find('.services__bottom');
    var $panel = $item.find('.services__panel');

    $btn.attr('aria-expanded', 'false');

    var panelHeight = $panel.outerHeight();

    gsap.set($panel, {
      height: panelHeight,
      overflow: 'hidden',
      display: 'block',
    });

    $item.removeClass('is-open');

    var tl = gsap.timeline({
      onComplete: function () {
        $panel.css({
          height: '',
          overflow: '',
          display: 'none',
        });
      },
    });

    tl.to(
      $bottom,
      {
        autoAlpha: 0,
        y: 16,
        duration: 0.2,
        ease: 'power2.in',
      },
      0,
    )
      .to(
        $benefits,
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.2,
          ease: 'power2.in',
        },
        0,
      )
      .to(
        $media,
        {
          autoAlpha: 0,
          x: -24,
          duration: 0.3,
          ease: 'power2.in',
        },
        0,
      )
      .to(
        $panel,
        {
          height: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        0,
      );
  }
}

$(window).on('load', function () {
  $('.page-loader').addClass('is-hidden');

  init_reveals();
  init_magnetic_buttons();
  init_banner_img_parallax();
  init_services_accordion();
});
