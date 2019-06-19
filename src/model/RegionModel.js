import FieldModel from "./FieldModel";

export default class RegionModel {
    constructor(regionData) {
        // Set properties.
        Object.assign(this, regionData);

        if (this.grid) {
            this.createGrid();
        }
    }

    createGrid() {
        this.fields = new Array();
        for (let y in this.grid) {
            this.fields[y] = [];
            for (let x in this.grid[y]) {
                let canHaveOccupant = this.grid[y][x] != "1";
                this.fields[y][x] = new FieldModel(x, y, this.name, canHaveOccupant);
            }
        }
    }

    getField(x, y) {
        if (this.fields) {
            for (let yPos in this.fields) {
                for (let xPos in this.fields[yPos]) {
                    let field = this.fields[yPos][xPos];
                    if (field.x == x && field.y == y) {
                        return field;
                    }
                }
            }
        } else {
            throw new Error("Field has not yet been initialized");
        }
        return false;
    }
}
