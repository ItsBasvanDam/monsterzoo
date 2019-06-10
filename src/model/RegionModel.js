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
            for (let x in this.grid[y]) {
                let canHaveOccupant = this.grid[y][x] != "1";
                this.fields.push(new FieldModel(x, y, canHaveOccupant));
            }
        }

        // Finally, clean up the old grid.
        delete this.grid;
    }

    getField(x, y) {
        if (this.fields) {
            for (let i in this.fields) {
                let field = this.fields[i];
                if (field.x == x && field.y == y) {
                    return field;
                }
            }
        } else {
            throw new Error("Field has not yet been initialized");
        }
        return false;
    }
}
