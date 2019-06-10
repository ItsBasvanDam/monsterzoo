import FieldModel from "./FieldModel";
import RegionModel from "./RegionModel";
import MonsterModel from "./MonsterModel";

export default class BoardModel {
    constructor() {
        this.regions = new Array();
        this.monsters = new Array();

        this.configuratorField = new FieldModel(-1, -1, true);
    }

    getDataSource() {
        if (localStorage.getItem("isSavePresent") != null) {
            // Load from localStorage.
            return "localStorage";
        } else {
            // Load from the API.
            return "api";
        }
    }

    initializeBoard(boardData) {
        this.regions = new Array();
        // Cycle through the data and initialize Regions.
        for (let i in boardData) {
            this.regions.push(new RegionModel(boardData[i]));
        }
    }

    /**
     * Initializes monsters based on data loaded from localStorage.
     *
     * @param Array monsterData
     */
    initializeMonsters(monsterData) {
        this.monsters = new Array();
        // Cycle through the data and initialize Monsters.
        for (let i in monsterData) {
            this.monsters.push(new MonsterModel(monsterData[i]));
        }
    }

    getRegion(regionName) {
        for (let i in this.regions) {
            if (this.regions[i].name == regionName) {
                return this.regions[i];
            }
        }
        return null;
    }

    getField(regionName, x, y) {
        if (x == -1 && y == -1) {
            // The new Field is in the configurator.
            return this.configuratorField;
        } else {
            let region = this.getRegion(regionName);
            if (region != null) {
                return region.getField(x, y);
            }
            return null;
        }
    }

    getConfiguratorField() {
        return this.configuratorField;
    }

    saveDataToLocalStorage() {
        // TODO save this.regions & this.monsters

    }
}
