import axios from "axios";
import { changeHistory, redrawSnippets, scrollTo } from "./AjaxFilterForm";

export default function AjaxButton() {

    document.addEventListener("click", (e) => {

        const target = e.target;

        if (!target.classList.contains('js-ajax-button'))
            return;

        const url = target.getAttribute("href");
        target.setAttribute("disabled", true);

        axios({
            method: "get",
            url: url
        }).then(response => {
            redrawSnippets(response.data.snippets);
            changeHistory(response.data.url);
            scrollTo(response.data.scrollTo);
            target.removeAttribute("disabled");
        });

        e.preventDefault();
        e.stopPropagation();
    });
}