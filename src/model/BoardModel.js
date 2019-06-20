import FieldModel from "./FieldModel";
import RegionModel from "./RegionModel";
import MonsterModel from "./MonsterModel";

export default class BoardModel {
    constructor() {
        this.regions = new Array();
        this.monsters = new Array();

        this.configuratorField = null;
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
            let newMonster = new MonsterModel(monsterData[i]);
            this.monsters.push(newMonster);
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

    addMonster(monsterModel) {
        this.monsters.push(monsterModel);
        // Return a unique ID for the new monster.
        return new Date().valueOf();
    }

    getMonster(regionName, x, y) {
        let field = this.getField(regionName, x, y);
        for (let index in this.monsters) {
            let compareField = this.monsters[index].getCurrentField();
            if (
                compareField.x == field.x &&
                compareField.y == field.y &&
                compareField.regionName == field.regionName
            ) {
                return this.monsters[index];
            }
        }
        return false;
    }

    getMonsterById(id) {
        for (let index in this.monsters) {
            if (this.monsters[index].getAttribute("id") == id) {
                return this.monsters[index];
            }
        }
        return false;
    }

    removeMonster(id) {
        let monster = this.getMonsterById(id);
        if (monster) {
            this.monsters.splice(this.monsters.indexOf(monster), 1);
        }
        // Save the deletion.
        this.saveDataToLocalStorage();
    }

    getAdjacentMonsters(centerField) {
        let monsters = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let monster = this.getMonster(
                    centerField.regionName,
                    parseInt(centerField.x) + x,
                    parseInt(centerField.y) + y
                );
                // Only return other monsters, not the one on the centerField.
                if (monster && !(x == 0 && y == 0)) {
                    monsters.push(monster);
                }
            }
        }
        return monsters;
    }

    createConfiguratorField() {
        this.configuratorField = new FieldModel(-1, -1, "configurator", true);
    }

    getConfiguratorField() {
        if (!this.configuratorField) {
            this.createConfiguratorField();
        }
        return this.configuratorField;
    }

    getConfiguratorMonster() {
        for (let index in this.monsters) {
            if (
                this.monsters[index].getCurrentField() == this.configuratorField
            ) {
                return this.monsters[index];
            }
        }
        return null;
    }

    getRegionNames() {
        let names = new Array();
        this.regions.forEach(region => {
            names.push({ key: region.name, value: region.name });
        });
        return names;
    }

    isFieldOccupied(field) {
        for (let index in this.monsters) {
            if (this.monsters[index].getCurrentField() == field) {
                return true;
            }
        }
        return !field.isHabitable();
    }

    saveDataToLocalStorage() {
        localStorage.clear();
        localStorage.setItem("isSavePresent", true);
        localStorage.setItem("boardData", JSON.stringify(this.regions));
        localStorage.setItem("monsterData", JSON.stringify(this.monsters));
    }
}
