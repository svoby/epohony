import noUiSlider from 'nouislider';

const elements = document.querySelectorAll('.js-range-slider');

export default function RangeSlider() {

    elements.forEach(function (element) {
        const options = JSON.parse(element.dataset.range);
        const selectionMin = element.querySelector('.range-min');
        const selectionMax = element.querySelector('.range-max');
        const inputMin = element.querySelector('.range-min-input');
        const inputMax = element.querySelector('.range-max-input');

        options.format = {
            to: (v) => v | 0,
            from: (v) => v | 0
        }

        noUiSlider.create(element, options);

        element.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                selectionMax.innerHTML = values[handle];
                inputMax.value = values[handle];
            } else {
                selectionMin.innerHTML = values[handle];
                inputMin.value = values[handle];
            }
        });
    });

}