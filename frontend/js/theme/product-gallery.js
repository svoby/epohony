'use strict';

import spUtils from './Utils';

spUtils.$document.ready(() => {

    let gallery = document.querySelectorAll('.product-detail');
    if (gallery.length) {

        for (let i = 0; i < gallery.length; i++) {

            let thumbnails = gallery[i].querySelectorAll('.product-gallery-thumblist-item'),
                previews = gallery[i].querySelectorAll('.product-gallery-preview-item');


            for (let n = 0; n < thumbnails.length; n++) {
                thumbnails[n].addEventListener('click', changePreview);
            }

            // Changer preview function
            function changePreview(e) {
                e.preventDefault();
                for (let i = 0; i < thumbnails.length; i++) {
                    previews[i].classList.remove('active');
                    thumbnails[i].classList.remove('active');
                }
                this.classList.add('active');
                gallery[i].querySelector(this.getAttribute('href')).classList.add('active');
            }
        }
    }
});