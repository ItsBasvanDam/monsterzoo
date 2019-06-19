import CanvasView from "../view/CanvasView";

export default class CanvasController {
    initializeCanvas() {
        this.brushSize = 5;
        this.isPainting = false;
        this.color = "#444";
        this.clicks = new Array();

        this.onBrushSizeChange = this.onBrushSizeChange.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClearPress = this.onClearPress.bind(this);

        this.view = new CanvasView();
        this.view.setSliderListener(this.onBrushSizeChange);
        this.view.setBrushSize(this.brushSize);

        this.view.setCanvasListener("mousedown", this.onMouseDown);
        this.view.setCanvasListener("mouseup", this.onMouseUp);
        this.view.setCanvasListener("mousemove", this.onMouseMove);
        this.view.setCanvasListener("mouseleave", this.onMouseLeave);

        this.view.setButtonListener(this.onClearPress);

        this.context = this.view.getCanvas2dContext();
    }

    getElement() {
        return this.view.getElement();
    }

    hasDrawing() {
        return this.clicks.length > 0;
    }

    getDrawingData() {
        return this.clicks;
    }

    setDrawing(drawingData) {
        this.clicks = drawingData;
        this.redraw();
    }

    setColor(color) {
        this.color = color;
        this.redraw();
    }

    getDataURL() {
        return this.view.getDataURL();
    }

    addClick(x, y, isDragging) {
        this.clicks.push({
            x: x,
            y: y,
            isDragging,
            isDragging,
            size: this.brushSize
        });
    }

    redraw() {
        // Clear the canvas
        this.context.clearRect(
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );

        this.context.strokeStyle = this.color;
        this.context.lineJoin = "round";

        // Redraw every point
        this.clicks.forEach(click => {
            let previousIndex = this.clicks.indexOf(click) - 1;
            this.context.lineWidth = click.size;
            this.context.beginPath();
            if (click.isDragging) {
                this.context.moveTo(
                    this.clicks[previousIndex].x,
                    this.clicks[previousIndex].y
                );
            } else {
                this.context.moveTo(click.x - 1, click.y);
            }
            this.context.lineTo(click.x, click.y);
            this.context.closePath();
            this.context.stroke();
        });
    }

    onBrushSizeChange(event) {
        this.brushSize = event.target.value;
    }

    onMouseDown(event) {
        let canvas = this.view.canvas;
        let mouseX = event.pageX - canvas.getBoundingClientRect().left;
        let mouseY = event.pageY - canvas.getBoundingClientRect().top;

        this.isPainting = true;
        this.addClick(mouseX, mouseY);
        this.redraw();
    }

    onMouseMove(event) {
        if (this.isPainting) {
            let canvas = this.view.canvas;
            let mouseX = event.pageX - canvas.getBoundingClientRect().left;
            let mouseY = event.pageY - canvas.getBoundingClientRect().top;

            this.addClick(mouseX, mouseY, true);
            this.redraw();
        }
    }

    onMouseUp(event) {
        this.isPainting = false;
    }

    onMouseLeave(event) {
        this.isPainting = false;
    }

    onClearPress(event) {
        this.clicks = new Array();
        this.redraw();
    }
}
