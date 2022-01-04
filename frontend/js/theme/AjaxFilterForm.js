import axios from "axios";

// Note: BrowserSync POST error, https://github.com/BrowserSync/browser-sync/issues/1458

function encodeGetData(data) {
    return data.map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`).join('&');
}

export function redrawSnippets(snippets) {
    for (var key in snippets) {
        const snippetId = document.querySelector(`#${key}`);
        snippetId.innerHTML = snippets[key];
    }
}

export function scrollTo(selector) {
    const target = document.querySelector(selector);

    if (target)
        target.scrollIntoView({ behavior: "smooth" });
}

export function changeHistory(url) {
    window.history.pushState({}, '', url);
}

export default function AjaxFilterForm() {
    const forms = document.querySelectorAll(".js-ajax-filter-form");

    forms.forEach((form) => {

        let action = form.getAttribute("action") || "?";
        const method = form.getAttribute("method") || "post";
        const submitButton = form.querySelector('button[type=submit], input[type=submit]');

        form.addEventListener('submit', (e) => {

            const formData = new FormData(form);
            const getParams = encodeGetData([...formData.entries()]);

            // Disable submit button
            submitButton.setAttribute("disabled", true);

            axios({
                method: method,
                url: `${action}?${getParams}`
            }).then(response => {

                // Redraw snippets
                redrawSnippets(response.data.snippets);

                // Trigger history change
                changeHistory(response.data.url);

                // Scroll to elemen
                scrollTo(response.data.scrollTo)

                // Enable submit button
                submitButton.removeAttribute("disabled");
            });;

            e.preventDefault();
        });
    });
}