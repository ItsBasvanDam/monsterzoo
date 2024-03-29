import ViewBase from "./ViewBase";

export default class BoardView extends ViewBase {
    constructor() {
        super();
        this.regionViews = new Array();
        document.querySelector("#board").append(this);
    }

    add(element) {
        this.append(element);
    }

    addRegionView(regionName, view) {
        this.regionViews[regionName] = view;
    }

    getRegionView(regionName) {
        return this.regionViews[regionName];
    }

    setCurrentRegion(regionView) {
        if (!this.region) {
            this.addRegion();
        }
        this.region.innerHTML = "";
        this.region.append(regionView);
    }

    addRegion() {
        this.region = document.createElement("div");
        this.append(this.region);
    }

    getFieldView(x, y, regionName) {
        return document.querySelector(
            `td[data-x="${x}"][data-y="${y}"][data-region-name="${regionName}"]`
        );
    }
}

customElements.define("board-view", BoardView);
