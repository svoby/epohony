const carousel = document.querySelector('.js-owl-teaser-carousel');
const progressBoxesElms = document.querySelectorAll(".js-owl-carousel-teaser-bottom [class^=col]");
const progressBarsElms = [];
let options = {};
let slidesCount = 0;
let actualSlideIndex = 0;

// Timers
let nextSlideTimer = null;
let nextSlideDelay = 2000;
let progressBarTimer = null;
let progressBarTime = 0;
const progressBarTick = 500; // ms

export default function TeaserCarousel() {

    if (!carousel)
        return;

    options = JSON.parse(carousel.getAttribute('data-options')) || {};
    nextSlideDelay = options.speed || nextSlideDelay;

    $(carousel).owlCarousel({
        onInitialized: onInitialized,
        onDrag: onDrag,
        onChanged: onChanged,
        ...options,
    });
}

/** Swipe manualy */
function nextSlide() {

    progressBarTime = 0;
    actualSlideIndex++;

    if (actualSlideIndex >= slidesCount) {
        actualSlideIndex = 0;
        $(carousel).trigger('to.owl.carousel', [0]);
    } else {
        $(carousel).trigger('next.owl.carousel');
    }
}

/** Progress bar tick process */
function nextTick() {
    progressBarTime += nextSlideDelay / progressBarTick;

    if (progressBarTime >= nextSlideDelay) {
        setProgressBarWidth(0);
        nextSlide();
    } else {
        const width = progressBarTime / nextSlideDelay * 100;
        setProgressBarWidth(width);
    }
}

/** Set progress bar visual indicator width */
function setProgressBarWidth(width, index = actualSlideIndex) {

    if (progressBarsElms[index] == undefined)
        return;

    progressBarsElms[index].style.width = width + "%";
}

const onInitialized = (e) => {

    // Set first progress tick
    slidesCount = e.item.count;
    progressBarTimer = setInterval(nextTick, nextSlideDelay / progressBarTick);

    // Get prograss bar indicators
    progressBoxesElms.forEach(pb => {
        let bar = pb.querySelector('.teaser__indicator__in');
        progressBarsElms.push(bar);
    });

    // Set first progressbox visible
    progressBoxesElms[actualSlideIndex].classList.remove('d-none');
};

/** Stop timers on drag event */
const onDrag = (e) => {
    clearInterval(nextSlideTimer);
    clearInterval(progressBarTimer);
};

/** Slide changes event  */
const onChanged = (e) => {

    if (e.item.index === null)
        return;

    actualSlideIndex = e.item.index;

    // Reset progress boxes
    progressBoxesElms.forEach((elm, index) => {
        elm.classList.remove("text-primary");
        elm.classList.add("d-none");
        setProgressBarWidth(0, index);
    });

    // Set active progess box
    progressBoxesElms[actualSlideIndex].classList.add("text-primary");
    progressBoxesElms[actualSlideIndex].classList.remove('d-none');
    setProgressBarWidth(100);
};