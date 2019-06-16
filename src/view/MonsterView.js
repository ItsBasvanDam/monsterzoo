export default class MonsterView extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });

        let image = document.createElement("img");
        image.src = "img/loading.gif";
        image.width = 60;
        image.height = 60;
        this.root.append(image);
        this.draggable = true;

        this.addEventListener("dragstart", this.handleDragStart);
    }

    setData(data) {
        Object.assign(this, data);
    }

    handleDragStart(event) {
        event.dataTransfer.setData("x", this.x);
        event.dataTransfer.setData("y", this.y);
        event.dataTransfer.setData("regionName", this.regionName);
        event.dataTransfer.setData("id", this.id);
    }
}

customElements.define("monster-view", MonsterView);
