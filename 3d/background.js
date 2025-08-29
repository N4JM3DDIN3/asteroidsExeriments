import { cubeVertices } from "./cube.js";

export default class Background {
    static async fromPaths(gpu, { image, shader, projectionMatrixBuffer }, geometry) {
        // !!problem in the creation of the texture !!
        const texture = await gpu.createCubeTexture([image, image, image, image, image, image]);
        const module = await gpu.createShader(shader);
        return new Background(gpu, { texture, module, projectionMatrixBuffer }, geometry)
        
    }

    constructor(gpu, { texture, module, projectionMatrixBuffer }) {
        this.gpu = gpu;
        this.texture = texture;
        this.projectionMatrixBuffer = projectionMatrixBuffer;
        this.sampler = gpu.createSampler();
        this.pipeline = gpu.createRenderPipeline(module, "vsMain", module, "fsMain");
        this.vertexBuffer = gpu.createVertexBuffer(cubeVertices.byteLength)
        this.gpu.device.queue.writeBuffer(this.vertexBuffer, 0, cubeVertices);

        this.bindGroup = gpu.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.projectionMatrixBuffer } },
                { binding: 1, resource: this.sampler },
                { binding: 2, resource: this.texture.createView({ dimension: "cube" }) }
            ]
        });
    }

    get queue() {
        return this.gpu.device.queue;
    }

    draw(pass) {        
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.draw(36, 1, 0, 0);
    }


}