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

});