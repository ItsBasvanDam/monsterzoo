export default class MonsterView extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });

        this.image = document.createElement("img");
        this.image.src = "img/loading.gif";
        this.image.width = 60;
        this.image.height = 60;
        this.root.append(this.image);
        this.draggable = true;

        this.addEventListener("dragstart", this.handleDragStart);
    }

    setData(data) {
        Object.assign(this, data);
        this.image.src = this.imageSrc;
    }

    handleDragStart(event) {
        event.dataTransfer.setData("x", this.x);
        event.dataTransfer.setData("y", this.y);
        event.dataTransfer.setData("regionName", this.regionName);
        event.dataTransfer.setData("id", this.id);
    }
}

customElements.define("monster-view", MonsterView);
