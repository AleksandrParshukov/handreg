import { gsap } from 'gsap';

function init_animations() {
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

$(document).ready(function () {
  init_animations();
  init_magnetic_buttons();
  init_banner_img_parallax();
});
