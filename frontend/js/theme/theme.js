'use strict';

import spUtils from './Utils';

spUtils.$document.ready(() => {

    // Headroom (sticky header)
    if (typeof (Headroom) != "undefined") {
        const headroomOptions = { offset: 100 };
        var header = document.querySelector(".header.com.--sticky");
        var headroom = new Headroom(header, headroomOptions);

        headroom.init();
    }

    // Plus - minus
    $(document).on('click', '[data-js="plusminus"] button', function (e) {
        var el = $(this).parent().find('input');
        var num = parseInt(el.val());
        num = $(this).hasClass('js-plus') ? num + 1 : num - 1;
        if (num <= 1) num = 1;
        el.val(num);
        el.trigger('change');
        e.preventDefault();
    });

    $(document).on('input', '[data-js="plusminus"] input', function () {
        var num = $(this).val().replace(/[^0-9]/g, '');
        if (num.length > 2) num = num.substr(0, 2);
        if (num == 0) num = 1;
        $(this).val(num);
        $(this).trigger('change');
    });

    // Offcanvas
    const hamburgers = Array.from(document.querySelectorAll(".js-offcanvas"));
    hamburgers.map((button) => {

        button.addEventListener("click", (e) => {
            const targetId = e.currentTarget.getAttribute("data-target-id");
            const targetElm = document.querySelector(targetId);
            const overlay = document.querySelector(".mobile-nav-overlay");

            function HideAll() {
                targetElm.classList.remove("show");
                overlay && overlay.removeEventListener("click", HideAll, false);
                document.body.classList.remove("mobile-nav-open");
            }

            if (targetElm) {
                targetElm.classList.toggle("show");
                overlay && overlay.addEventListener("click", HideAll);
                document.body.classList.toggle("mobile-nav-open");
            }

            e.preventDefault();
        });

    });
});