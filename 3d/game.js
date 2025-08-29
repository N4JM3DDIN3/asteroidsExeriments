import { mat4 } from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.min.js';
import Asteroids from './asteroid.js';
import Camera from './camera.js';
import Ship from './ship.js';
import Controls from "./controls.js";

function _createCanvas() {
    const canvas = document.createElement('canvas');
    document.body.append(canvas);
    document.body.style.display = "grid";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100dvh";
    canvas.style.backgroundColor = "black";
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    return canvas;
}

export default class AsteroidsGame {
    constructor(gpu, backgroundType = "cubique") { 
        this.gpu = gpu;
        this.backgroundType = backgroundType;

        this.canvas = _createCanvas();
        this.ctx = this.gpu.createContext(this.canvas, 'opaque');

        this.camera = new Camera(this.canvas);
        this.ship = new Ship(this.camera);
        this.controls = new Controls();

        this.frameBuffer = gpu.createUniformBuffer(4);
        this.projectionBuffer = gpu.createUniformBuffer(144); 
        this.mvpBuffer = gpu.createUniformBuffer(64); 
    }

    resize() {
        this.canvas.height = document.body.clientHeight;
        this.canvas.width = document.body.clientWidth;
        this.camera.resize(this.canvas);
    }

    async reset(nAsteroids, noise) {
        if (this.backgroundType === "cubique") {
            this.starBackground = await this.gpu.createBackground({
                image: '3d/images/stars.jpg',
                shader: '3d/shaders/cubeMap.wgsl',
                projectionMatrixBuffer: this.projectionBuffer,
                backgroundType: "cubique"
            });
        } else {
            this.starBackground = await this.gpu.createBackground({
                image: '3d/images/test.jpg',
                shader: '3d/shaders/background.wgsl',
                mvpBuffer: this.mvpBuffer,
                backgroundType: "spherique"
            });

        }

        this.asteroids = await Asteroids.withModule(this.gpu, {
            frameBuffer: this.frameBuffer,
            projectionBuffer: this.backgroundType === "cubique" ? this.projectionBuffer : this.mvpBuffer,
            nAsteroids,
            noise
        });
    }

    get projectionMatrix() {
        return mat4.multiply(this.camera.perspective, this.ship.location);
    }

    update(elapsed) {
        if(this.controls.fov) {
            this.camera.fov += this.controls.fov * elapsed;
        }
        this.ship.x = this.controls.x * elapsed ** 2;
        this.ship.y = this.controls.y * elapsed ** 2;
        this.ship.z = this.controls.z * elapsed ** 2;
        this.ship.update(elapsed);

        this.gpu.writeBuffer(this.frameBuffer, 0, new Float32Array([elapsed]));
        
        this.gpu.compute(pass => this.asteroids.compute(pass), encoder => this.asteroids.copy(encoder));
    }

    draw() {
        const pm = this.projectionMatrix;
        const buffer = this.backgroundType === "cubique" ? this.projectionBuffer : this.mvpBuffer;
        this.gpu.writeBuffer(buffer, 0, pm.buffer, pm.byteOffset, 64);

        this.gpu.render(this.ctx.getCurrentTexture().createView(), pass => {
            this.starBackground.draw(pass);
            this.asteroids.draw(pass);
        });
    }
}
