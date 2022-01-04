
export default function Autocomplete() {
    const input = document.querySelector(".js-autocomplete-input");
    const config = JSON.parse(input.getAttribute("data-autocomplete-config"));
    const categorySelect = document.querySelector(".js-autocomplete-category-select");
    const placeholder = document.querySelector(".js-autocomplete");
    const backdrop = document.querySelector(".js-backdrop");
    let fetchTimeout = null;
    const charLenghtIsOk = () => input.value.length >= config.minChars;

    // Source input and Handlebars are required
    if (input == null || typeof (Handlebars) == "undefined")
        return;

    // Bind events
    input.addEventListener("keyup", OnKeyUp);
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape')
            Hide();
    });

    categorySelect.addEventListener("change", fetchData);

    // On input keyup
    function OnKeyUp(e) {

        if (e.key === 'Escape' || !charLenghtIsOk()) {
            Hide();
            return;
        }

        clearTimeout(fetchTimeout);
        fetchTimeout = setTimeout(fetchData, config.fetchDelay);
    }

    // Get autocomplete data
    function fetchData() {
        const finalUrl = `${config.url}${categorySelect.name}=${categorySelect.value}`;

        if (!charLenghtIsOk())
            return;

        fetch(finalUrl)
            .then(response => response.json())
            .then(data => {
                const source = document.getElementById("autocomplete-template").innerHTML;
                const template = Handlebars.compile(source);
                const html = template(data);
                const content = document.getElementById("autocomplete-content");

                content.innerHTML = html;
                placeholder.classList.add("show");
                backdrop && backdrop.classList.add("show");
                backdrop && backdrop.addEventListener("click", Hide);
            })
    }

    // Hide autocomplete panel
    function Hide() {
        placeholder.classList.remove("show");
        backdrop && backdrop.classList.remove("show");
        backdrop && backdrop.removeEventListener("click", Hide);
    }
};