export default class Controls {
    constructor() {
        this.keys = { 
            'a': false, 
            's': false, 
            'd': false, 
            'w': false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            " ": false
        };
        window.addEventListener('keydown', ev => this.keys[ev.key] = true);
        window.addEventListener('keyup', ev => this.keys[ev.key] = false);
    }

    updateCamera(camera, ship, delta = 0.5) {
        if (this.keys.w) ship.moveLocal(delta, 0, 0);
        if (this.keys.s) ship.moveLocal(-delta, 0, 0);
        if (this.keys.a) ship.moveLocal(0, -delta, 0);
        if (this.keys.d) ship.moveLocal(0, delta, 0);
        if (this.keys.ArrowLeft) camera.turnLeft(0.05);
        if (this.keys.ArrowRight) camera.turnRight(0.05);
    }

    get x() {
        return this.keys.d - this.keys.a;
    }
    get y() {
        return this.keys.s - this.keys.w;
    }
    get z() {
        return this.keys.ArrowRight - this.keys.ArrowLeft
    }
    get fov() {
        return this.keys[" "];
    }
    get thrust() { 
        return this.keys.ArrowUp - this.keys.ArrowDown
    }
}