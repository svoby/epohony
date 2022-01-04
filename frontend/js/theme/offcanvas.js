export default function Offcanvas() {

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
};