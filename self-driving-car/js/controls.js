class Controls {
    constructor(controlType) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch (controlType) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward= true;
                break;
        }
        
    }

    #addKeyboardListeners() {
        document.onkeydown = (e) => this.#handleKeyDown(e);

        document.onkeyup = (e) => this.#handleKeyUp(e);
    }

    #handleKeyDown(e) {
        switch (e.key) {
            case "ArrowLeft":
            case "A":
            case "a":
                this.left = true;
                break;
            case "ArrowRight":
            case "D":
            case "d":
                this.right = true;
                break;
            case "ArrowUp":
            case "W":
            case "w":
                this.forward = true
                break;
            case "ArrowDown":
            case "S":
            case "s":
                this.reverse = true;
                break;
        }
    }

    #handleKeyUp(e) {
        switch (e.key) {
            case "ArrowLeft":
            case "A":
            case "a":
                this.left = false;
                break;
            case "ArrowRight":
            case "D":
            case "d":
                this.right = false;
                break;
            case "ArrowUp":
            case "W":
            case "w":
                this.forward = false
                break;
            case "ArrowDown":
            case "S":
            case "s":
                this.reverse = false;
                break;
        }

    }
}