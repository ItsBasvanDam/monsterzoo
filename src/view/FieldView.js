export default class FieldView {
    constructor(x, y, regionName, isDisabled) {
        this.createView(x, y, regionName, isDisabled);
    }

    createView(x, y, regionName, isDisabled) {
        let element = document.createElement("td");
        element.classList.add("field");

        element.setAttribute("data-x", x);
        element.setAttribute("data-y", y);
        element.setAttribute("data-region-name", regionName);

        if (isDisabled) {
            element.classList.add("uninabitable");
        }

        this.element = element;
    }

    getElement() {
        return this.element;
    }

    addListener(eventName, callback) {
        this.element.addEventListener(eventName, callback);
    }
}
