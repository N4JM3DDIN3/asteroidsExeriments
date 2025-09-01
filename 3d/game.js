// import { mat4 } from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.min.js';
// import Asteroids from './asteroid.js';
// import Camera from './camera.js';
// import Ship from './ship.js';
// import Controls from "./controls.js";

// function _createCanvas() {
//     const canvas = document.createElement('canvas');
//     document.body.append(canvas);
//     document.body.style.display = "grid";
//     document.body.style.margin = "0";
//     document.body.style.minHeight = "100dvh";
//     canvas.style.backgroundColor = "black";
//     canvas.height = document.body.clientHeight;
//     canvas.width = document.body.clientWidth;
//     return canvas;
// }

// export default class AsteroidsGame {
//     constructor(gpu, backgroundType = "cubique") { 
//         this.gpu = gpu;
//         this.backgroundType = backgroundType;

//         this.canvas = _createCanvas();
//         this.ctx = this.gpu.createContext(this.canvas, 'opaque');

//         this.camera = new Camera(this.canvas);
//         this.ship = new Ship(this.camera);
//         this.controls = new Controls();

//         this.frameBuffer = gpu.createUniformBuffer(4);
//         this.projectionBuffer = gpu.createUniformBuffer(144); 
//         this.mvpBuffer = gpu.createUniformBuffer(64); 
//     }

//     resize() {
//         this.canvas.height = document.body.clientHeight;
//         this.canvas.width = document.body.clientWidth;
//         this.camera.resize(this.canvas);
//     }

//     async reset(nAsteroids, noise) {
//         if (this.backgroundType === "cubique") {
//             this.starBackground = await this.gpu.createBackground({
//                 image: '3d/images/stars.jpg',
//                 shader: '3d/shaders/backgroundMap.wgsl',
//                 projectionMatrixBuffer: this.projectionBuffer,
//                 backgroundType: "cubique"
//             });
//         } else {
//             this.starBackground = await this.gpu.createBackground({
//                 image: '3d/images/test.jpg',
//                 shader: '3d/shaders/background.wgsl',
//                 mvpBuffer: this.mvpBuffer,
//                 backgroundType: "spherique"
//             });

//         }

//         this.asteroids = await Asteroids.withModule(this.gpu, {
//             frameBuffer: this.frameBuffer,
//             projectionBuffer: this.backgroundType === "cubique" ? this.projectionBuffer : this.mvpBuffer,
//             nAsteroids,
//             noise
//         });
//     }

//     get projectionMatrix() {
//         return mat4.multiply(this.camera.perspective, this.ship.transformationMatrix);
//     }

//     updateProjectionMatrixBuffer() {
//         const pm = this.projectionMatrix;
//         this.gpu.writeBuffer(this.projectionMatrixBuffer, 0, pm.buffer, pm.byteOffset, 64);
//     }

//     updateFrameBuffer(elapsed) {
//         this.gpu.writeBuffer(this.frameBuffer, 0, new Float32Array([elapsed]));
//     }

//     update(elapsed) {

//         this.updateFrameBuffer(elapsed);

//         if (this.controls.fov) {
//             this.camera.fov += this.controls.fov * elapsed;
//         }

//         // if (this.controls.fov) {
//         //     this.camera.fov = Math.min(Math.max(this.camera.fov + 1 * elapsed, 30 * Math.PI / 180), 120 * Math.PI / 180);
//         // }


//         this.ship.pitchInput = this.controls.y; // w/s for pitch (w = negative pitch?)
//         this.ship.yawInput = this.controls.z; // ArrowLeft/Right for yaw
//         this.ship.rollInput = this.controls.x; // a/d for roll
//         this.ship.thrustInput = this.controls.thrust;
//         this.ship.update(elapsed);

        
//         this.gpu.compute(pass => this.asteroids.compute(pass), encoder => this.asteroids.copy(encoder));
//     }

//     draw() {
//         const pm = this.projectionMatrix;
//         const buffer = this.backgroundType === "cubique" ? this.projectionBuffer : this.mvpBuffer;
//         this.gpu.writeBuffer(buffer, 0, pm.buffer, pm.byteOffset, 64);

//         this.gpu.render(this.ctx.getCurrentTexture().createView(), pass => {
//             this.starBackground.draw(pass);
//             this.asteroids.draw(pass);
//         });
//     }
// }


// import { mat4 } from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.min.js';
// import Asteroids from './asteroid.js';
// import Camera from './camera.js';
// import Ship from './ship.js';
// import Controls from "./controls.js";

// function _createCanvas() {
//     const canvas = document.createElement('canvas');
//     document.body.append(canvas);
//     document.body.style.display = "grid";
//     document.body.style.margin = "0";
//     document.body.style.minHeight = "100dvh";
//     canvas.style.backgroundColor = "black";
//     canvas.height = document.body.clientHeight;
//     canvas.width = document.body.clientWidth;
//     return canvas;
// }

// export default class AsteroidsGame {
//     constructor(gpu, backgroundType = "cubique") { 
//         this.gpu = gpu;
//         this.backgroundType = backgroundType;

//         this.canvas = _createCanvas();
//         this.ctx = this.gpu.createContext(this.canvas, 'opaque');

//         this.camera = new Camera(this.canvas);
//         this.ship = new Ship();
//         this.controls = new Controls();

//         this.frameBuffer = gpu.createUniformBuffer(4);
//         this.projectionBuffer = gpu.createUniformBuffer(144); 
//         this.mvpBuffer = gpu.createUniformBuffer(64); 
//     }

//     resize() {
//         this.canvas.height = document.body.clientHeight;
//         this.canvas.width = document.body.clientWidth;
//         this.camera.resize(this.canvas);
//     }

//     async reset(nAsteroids, noise) {
//         if (this.backgroundType === "cubique") {
//             this.starBackground = await this.gpu.createBackground({
//                 image: '3d/images/stars.jpg',
//                 shader: '3d/shaders/backgroundMap.wgsl',
//                 projectionMatrixBuffer: this.projectionBuffer,
//                 backgroundType: "cubique"
//             });
//         } else {
//             this.starBackground = await this.gpu.createBackground({
//                 image: '3d/images/test.jpg',
//                 shader: '3d/shaders/background.wgsl',
//                 mvpBuffer: this.mvpBuffer,
//                 backgroundType: "spherique"
//             });
//         }

//         this.asteroids = await Asteroids.withModule(this.gpu, {
//             frameBuffer: this.frameBuffer,
//             projectionBuffer: this.backgroundType === "cubique" ? this.projectionBuffer : this.mvpBuffer,
//             nAsteroids,
//             noise
//         });
//     }

//     // --- matrices séparées ---
//     get projectionMatrix() {
//         return this.camera.perspective; // pour le background (collé)
//     }

//     get viewMatrix() {
//         return this.ship.transformationMatrix; // pour objets (vaisseau + astéroïdes)
//     }

//     get viewProjectionMatrix() {
//         return mat4.multiply(this.camera.perspective, this.ship.transformationMatrix);
//     }

//     updateProjectionMatrixBuffer() {
//         const pm = this.projectionMatrix;
//         this.gpu.writeBuffer(this.projectionBuffer, 0, pm.buffer, pm.byteOffset, 64);
//     }

//     updateFrameBuffer(elapsed) {
//         this.gpu.writeBuffer(this.frameBuffer, 0, new Float32Array([elapsed]));
//     }

//     update(elapsed) {
//         this.updateFrameBuffer(elapsed);

//         // Zoom avec espace
//         if (this.controls.fov) {
//             this.camera.fov = Math.min(Math.max(this.camera.fov + 1 * elapsed, 30 * Math.PI / 180), 120 * Math.PI / 180);
//         }

//         // Inputs → ship
//         this.ship.pitchInput  = this.controls.y;      // w/s
//         this.ship.yawInput    = this.controls.z;      // ← →
//         this.ship.rollInput   = this.controls.x;      // a/d
//         this.ship.thrustInput = this.controls.thrust; // ↑ ↓

//         this.ship.update(elapsed);

//         this.gpu.compute(pass => this.asteroids.compute(pass), encoder => this.asteroids.copy(encoder));
//     }

//     draw() {
//         const vp = this.viewProjectionMatrix;
//         const buffer = this.backgroundType === "cubique" ? this.projectionBuffer : this.mvpBuffer;

//         // --- Background : caméra * orientation du vaisseau (pas la position) ---
//         const bgMatrix = mat4.multiply(this.camera.perspective, this.ship.orientationMatrix);
//         this.gpu.writeBuffer(this.projectionBuffer, 0, bgMatrix.buffer, bgMatrix.byteOffset, 64);

//         // --- Astéroïdes : caméra * orientation + translation du vaisseau ---
//         this.gpu.writeBuffer(this.mvpBuffer, 0, vp.buffer, vp.byteOffset, 64);

//         this.gpu.render(this.ctx.getCurrentTexture().createView(), pass => {
//             this.starBackground.draw(pass);  // collé + tourne avec toi
//             this.asteroids.draw(pass);       // bouge dans l’espace
//         });
//     }


    // draw() {
    //     const vp = this.viewProjectionMatrix;
    //     const buffer = this.backgroundType === "cubique" ? this.projectionBuffer : this.mvpBuffer;

    //     // Background : caméra seule
    //     this.gpu.writeBuffer(this.projectionBuffer, 0, this.camera.perspective.buffer, this.camera.perspective.byteOffset, 64);

    //     // Astéroïdes : VP (camera * ship)
    //     this.gpu.writeBuffer(this.mvpBuffer, 0, vp.buffer, vp.byteOffset, 64);

    //     this.gpu.render(this.ctx.getCurrentTexture().createView(), pass => {
    //         this.starBackground.draw(pass);  // reste collé
    //         this.asteroids.draw(pass);       // bouge avec vaisseau
    //     });
    // }
// }

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
        this.ship = new Ship();
        this.controls = new Controls();

        // Deux buffers séparés : un pour le SKYBOX, un pour le MONDE
        this.skyBuffer = gpu.createUniformBuffer(64);  // P * V_rot
        this.worldBuffer = gpu.createUniformBuffer(64); // P * V

        this.frameBuffer = gpu.createUniformBuffer(4);
    }

    resize() {
        this.canvas.height = document.body.clientHeight;
        this.canvas.width = document.body.clientWidth;
        this.camera.resize(this.canvas);
    }

    async reset(nAsteroids, noise) {
        // SKYBOX
        if (this.backgroundType === "cubique") {
            this.starBackground = await this.gpu.createBackground({
                image: '3d/images/stars.jpg',
                shader: '3d/shaders/backgroundMap.wgsl',
                projectionMatrixBuffer: this.skyBuffer, // <= buffer dédié au skybox
                backgroundType: "cubique"
            });
        } else {
            this.starBackground = await this.gpu.createBackground({
                image: '3d/images/test.jpg',
                shader: '3d/shaders/background.wgsl',
                mvpBuffer: this.skyBuffer, // <= buffer dédié au skybox
                backgroundType: "spherique"
            });
        }

        // ASTEROÏDES (toujours sur worldBuffer pour éviter tout conflit)
        this.asteroids = await Asteroids.withModule(this.gpu, {
            frameBuffer: this.frameBuffer,
            projectionBuffer: this.worldBuffer, // <= buffer monde (P*V)
            nAsteroids,
            noise
        });
    }

    // Matrices utiles
    get projection() { return this.camera.perspective; }

    // V = inverse(M)  (caméra montée sur le vaisseau)
    get viewMatrix() {
        return mat4.inverse(this.ship.transformationMatrix);
    }

    // V_rot = inverse(R) (rotation de vue SANS translation)
    get skyViewMatrix() {
        return mat4.inverse(this.ship.orientation);
    }

    // P*V pour le monde
    get worldVP() {
        return mat4.multiply(this.projection, this.viewMatrix);
    }

    // P*V_rot pour le skybox (collé, pas de translation)
    get skyVP() {
        return mat4.multiply(this.projection, this.skyViewMatrix);
    }

    updateFrameBuffer(elapsed) {
        this.gpu.writeBuffer(this.frameBuffer, 0, new Float32Array([elapsed]));
    }

    update(elapsed) {
        this.updateFrameBuffer(elapsed);

        // Zoom FOV (espace) avec clamp (évite le "disparaît")
        if (this.controls.fov) {
            const minFov = 30 * Math.PI / 180;
            const maxFov = 120 * Math.PI / 180;
            this.camera.fov = Math.min(Math.max(this.camera.fov + 1 * elapsed, minFov), maxFov);
        }

        // Mapping des contrôles (repère local)
        this.ship.pitchInput  = this.controls.y;      // w/s
        this.ship.yawInput    = this.controls.z;      // ←/→
        this.ship.rollInput   = this.controls.x;      // a/d
        this.ship.thrustInput = this.controls.thrust; // ↑/↓

        this.ship.update(elapsed);
        
        this.gpu.compute(pass => this.asteroids.compute(pass), encoder => this.asteroids.copy(encoder));
    }

    draw() {
        // Ecrit les deux matrices dans des buffers séparés
        const sky = this.skyVP;       // P * V_rot (skybox collé)
        const vp  = this.worldVP;     // P * V     (monde : astéroïdes, etc.)

        this.gpu.writeBuffer(this.skyBuffer,   0, sky.buffer,  sky.byteOffset,  64);
        this.gpu.writeBuffer(this.worldBuffer, 0, vp.buffer,   vp.byteOffset,   64);

        this.gpu.render(this.ctx.getCurrentTexture().createView(), pass => {
            this.starBackground.draw(pass); // lit skyBuffer → collé, pas de translation
            this.asteroids.draw(pass);      // lit worldBuffer → bouge correctement
        });
    }
}

