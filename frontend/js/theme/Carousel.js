// Generic carousel
export default function Carousel() {

  const $carousel = $('.js-owl-carousel');

  if ($carousel.length) {

    $carousel.each((index, value) => {
      const $this = $(value);
      const options = $this.data('options') || {};
      options.navText || (options.navText = ['<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 15L1 8M1 8L8 1M1 8L19 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', '<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L19 8M19 8L12 15M19 8H1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>']);
      options.touchDrag = true;

      $this.owlCarousel($.extend(options, {}));
    });
  }
};