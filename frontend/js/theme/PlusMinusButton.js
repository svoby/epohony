export default function PlusMinusButton() {

    // Button
    $(document).on('click', '[data-js="plusminus"] button', function (e) {
        var el = $(this).parent().find('input');
        var num = parseInt(el.val());
        num = $(this).hasClass('js-plus') ? num + 1 : num - 1;
        if (num <= 1) num = 1;
        el.val(num);
        el.trigger('change');
        e.preventDefault();
    });

    // Inputs
    $(document).on('input', '[data-js="plusminus"] input', function () {
        var num = $(this).val().replace(/[^0-9]/g, '');
        if (num.length > 2) num = num.substr(0, 2);
        if (num == 0) num = 1;
        $(this).val(num);
        $(this).trigger('change');
    });

};