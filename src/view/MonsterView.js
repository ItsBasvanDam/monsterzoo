export default class MonsterView extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
            <style>
                .info-card {
                    background: white;
                    border: 1px solid darkgray;
                    border-radius: 5px;
                    padding: .5rem;
                    box-shadow: 0 0 5px 0 black;
                    text-align: left;
                }
            </style>
        `;
        this.draggable = true;

        this.image = document.createElement("img");
        this.image.src = "img/loading.gif";
        this.image.width = 60;
        this.image.height = 60;
        this.card = this.createHoverDisplay();

        this.root.append(this.image, this.card);
    }

    createHoverDisplay() {
        let card = document.createElement("div");
        card.classList.add("info-card");
        card.style.visibility = "hidden";
        card.style.position = "absolute";
        return card;
    }

    setData(data) {
        Object.assign(this, data);
        this.image.src = this.imageSrc;
    }

    displayInfo(monsterData) {
        let infoString = "";
        let data = monsterData.attributes;
        for (let key in monsterData.attributes) {
            if (key != "id" && key != "image" && key != "imageData") {
                infoString += `${key}: <strong>${data[key]}</strong><br>`;
            }
        }
        this.card.innerHTML = infoString;
        this.card.style.visibility = "visible";
    }

    hideInfo() {
        this.card.style.visibility = "hidden";
    }
}

customElements.define("monster-view", MonsterView);