export default class MonsterView extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
            <style>
                .info-card {
                    background: white;
                    border: 4px solid darkgray;
                    border-radius: 5px;
                    padding: .5rem;
                    box-shadow: 0 0 5px 0 black;
                    text-align: left;
                    text-wrap: wrap;
                    width: 200px;
                    z-index: 1000;
                }
            </style>
        `;
        this.draggable = true;
        this.style.display = "block";
        this.style.position = "relative";

        this.image = document.createElement("img");
        this.image.src = "img/loading.gif";
        this.image.width = 60;
        this.image.height = 60;
        this.card = this.createHoverDisplay();
        this.alertBalloon = this.createAlertBalloon();

        this.root.append(this.image, this.card, this.alertBalloon);
    }

    createAlertBalloon() {
        let balloon = new Image(50);
        balloon.style.position = "absolute";
        balloon.style.visibility = "hidden";
        balloon.style.right = "-35px";
        balloon.style.top = "-25px";
        balloon.style.zIndex = 500;
        return balloon;
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

    displayInfo(data) {
        let infoString = "";
        for (let key in data) {
            if (key != "id" && key != "image" && key != "imageData") {
                infoString += `${key.prep()}: <strong>${
                    data[key]
                }</strong><br>`;
            }
        }
        this.card.style.borderColor = data["color"];
        this.card.innerHTML = infoString;
        this.card.style.visibility = "visible";
    }

    hideInfo() {
        this.card.style.visibility = "hidden";
    }

    animateReaction(monsterType) {
        let animation = "heartBeat";
        switch (monsterType) {
            case "water":
                animation = "jello";
                break;
            case "fire":
                animation = "wobble";
                break;
            case "earth":
                animation = "bounce";
                break;
            case "air":
                animation = "flash";
                break;
        }
        this.addEventListener("animationend", function(event) {
            this.classList.remove("animated", animation);
        });
        this.classList.add("animated", animation);
        let audio = new Audio(`sound/${monsterType}.mp3`);
        audio.play();
    }

    showAlert() {
        this.alertBalloon.style.visibility = "visible";
        this.alertBalloon.src = "img/alert-balloon.gif";
        this.hideAlert = this.hideAlert.bind(this);
        setTimeout(this.hideAlert, 1500);
    }

    hideAlert() {
        this.alertBalloon.style.visibility = "hidden";
    }
}

customElements.define("monster-view", MonsterView);
