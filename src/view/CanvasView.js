export default class CanvasView {
    constructor() {
        this.size = 150;
        this.createView();
    }

    createView() {
        let container = document.createElement("div");
        container.classList.add("form-group");

        let label = document.createElement("label");
        label.innerText = "Draw your monster";
        let breaker = document.createElement("br");

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.size;
        this.canvas.height = this.size;

        this.slider = document.createElement("input");
        this.slider.type = "range";
        this.slider.classList.add("custom-range");
        this.slider.setAttribute("orientation", "vertical");
        this.slider.max = 10;
        this.slider.min = 1;

        this.clearButton = document.createElement("button");
        this.clearButton.classList.add("btn", "btn-danger");
        this.clearButton.innerText = "Clear Drawing";
        this.clearButton.type = "button";

        container.append(
            label,
            breaker,
            this.canvas,
            this.slider,
            this.clearButton
        );

        this.element = container;
    }

    getElement() {
        return this.element;
    }

    getDataURL() {
        return this.canvas.toDataURL();
    }

    setButtonListener(callback) {
        this.clearButton.addEventListener("click", callback);
    }

    setCanvasListener(type, callback) {
        this.canvas.addEventListener(type, callback);
    }

    setSliderListener(callback) {
        this.slider.addEventListener("change", callback);
    }

    setBrushSize(size) {
        this.slider.value = size;
    }

    getCanvas2dContext() {
        return this.canvas.getContext("2d");
    }
}
