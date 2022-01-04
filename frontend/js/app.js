import AjaxButton from "./theme/AjaxButton";
import AjaxFilterForm from "./theme/AjaxFilterForm";
import Autocomplete from "./theme/Autocomplete";
import Carousel from "./theme/Carousel";
import TeaserCarousel from "./theme/TeaserCarousel";
import FancyTabs from "./theme/Fancytabs";
import Offcanvas from "./theme/Offcanvas";
import PlusMinusButton from "./theme/PlusMinusButton";
import ProductGallery from "./theme/ProductGallery";
import RangeSlider from "./theme/RangeSlider";

window.addEventListener('DOMContentLoaded', () => {
    Autocomplete();
    Carousel();
    TeaserCarousel();
    FancyTabs();
    Offcanvas();
    ProductGallery();
    PlusMinusButton();
    RangeSlider();
    AjaxFilterForm();
    AjaxButton();
});