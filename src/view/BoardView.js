import ViewBase from "./ViewBase";
import MonsterView from "./MonsterView";
import eventDispatcher from "../util/EventDispatcher";

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

    displayMonster(monsterData) {
        let x = monsterData.currentField.x;
        let y = monsterData.currentField.y;
        let regionName = monsterData.currentField.regionName;
        this.setCurrentRegion(this.getRegionView(regionName));
        let field = document.querySelector(
            `td[data-x="${x}"][data-y="${y}"][data-region-name="${regionName}"]`
        );

        field.innerHTML = "";
        let newMonsterView = new MonsterView();
        newMonsterView.setData({
            x: x,
            y: y,
            regionName: regionName,
            id: monsterData.getAttribute("id"),
            imageSrc: monsterData.getAttribute("image")
        });
        // Link the model and the view.
        newMonsterView.setData = newMonsterView.setData.bind(
            newMonsterView
        );
        eventDispatcher.addListener(
            `monster${monsterData.getAttribute("id")}`,
            newMonsterView.setData
        );
        field.append(newMonsterView);
    }
}

customElements.define("board-view", BoardView);
