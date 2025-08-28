// import Background from "./background.js";
    
// export default class WebGPU {

//     static async init() {
//         if (!navigator.gpu) {
//             throw new Error("WebGPU is not supported by this browser.");
//         }
//         const adapter = await navigator.gpu.requestAdapter();
//         if (!adapter) throw new Error("Unable to get a GPU adapter.");
//         const device = await adapter.requestDevice();
//         return new WebGPU(device);
//     }

//     constructor(device) {
//         this.device = device;
//         this.format = navigator.gpu.getPreferredCanvasFormat();
//     }

//     createContext(canvas, alphaMode) {
//         const ctx = canvas.getContext('webgpu');
//         ctx.configure({
//             device: this.device,
//             format: this.format,
//             alphaMode
//         });
//         return ctx;
//     }

//     async createCubeTexture(facePaths, format) {
//         const bitmaps = await Promise.all(facePaths.map(this.createSquareBitmap));
//         const size = bitmaps[0].width; // assume square faces
//         const texture = this.device.createTexture({
//             size: [size, size, 6],
//             format,
//             usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
//         });
//         for (let i = 0; i < 6; ++i) {
//             this.device.queue.copyExternalImageToTexture(
//                 { source: bitmaps[i] },
//                 { texture, origin: [0, 0, i] },
//                 [size, size]
//             );
//         }
//         return texture;
//     }

//     async createSquareBitmap(path) {
//         const image = new Image();
//         image.src = path;
//         await image.decode();
//         const size = Math.min(image.width, image.height);
//         return createImageBitmap(image, 0, 0, size, size);
//     }

//     async createTexture(path, format) {
//         const image = new Image();
//         image.src = path;
//         await image.decode();
//         const source = await createImageBitmap(image);
//         const texture = this.device.createTexture({
//             size: [source.width, source.height, 1],
//             format,
//             usage: GPUTextureUsage.TEXTURE_BINDING |
//             GPUTextureUsage.COPY_DST |
//             GPUTextureUsage.RENDER_ATTACHMENT            
//         });
//         this.device.queue.copyExternalImageToTexture(
//             {source}, 
//             {texture},
//             [source.width, source.height]
//         )
//         return texture;
//     }

//     createUniformBuffer(size, mappedAtCreation=false) {
//         return this.device.createBuffer({
//             size,
//             mappedAtCreation,
//             usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
//         })
//     }

//     createStorageBuffer(size, mappedAtCreation = false) {
//         return this.device.createBuffer({
//             size,
//             mappedAtCreation,
//             usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
//         })
//     }

//     createCopyBuffer(size, mappedAtCreation = false) {
//         return this.device.createBuffer({
//             size,
//             mappedAtCreation,
//             usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
//         })
//     }

//     createVertexBuffer(size) {
//         return this.device.createBuffer({
//             size,
//             usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
//             mappedAtCreation: true
//         });
//     }

//     createSampler() {
//         return this.device.createSampler({
//             magFilter: "linear",
//             minFilter: "linear"
//         })
//     }

//     async createShader(path) {
//         const response = await fetch(path);
//         const code = await response.text();
//         return this.device.createShaderModule({ code, label: path });
//     }

//     createRenderPipeline(vModule, vEntry, fModule, fEntry, cullMode="none") {
//         return this.device.createRenderPipeline({
//             layout: "auto",
//             vertex: {
//                 module: vModule,
//                 entryPoint: vEntry,
//                 buffers: [
//                     {
//                         arrayStride: 12, // 3 * 4 bytes (vec3<f32>)
//                         attributes: [
//                             {
//                                 shaderLocation: 0,
//                                 offset: 0,
//                                 format: "float32x3"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             fragment: {
//                 module: fModule,
//                 entryPoint: fEntry,
//                 targets: [{ format: this.format }]
//             },
//             primitive: {
//                 topology: "triangle-list",
//                 cullMode
//             }
//         });        
//     }

//     createComputePipeline(module, entryPoint) {
//         return this.device.createComputePipeline({
//             layout: 'auto',
//             compute: {
//                 module,
//                 entryPoint,
//             },
//         });        
//     }

//     createBindGroup(...args) { 
//         return this.device.createBindGroup(...args);
//     }


//     async createBackground({ image, shader, projectionMatrixBuffer }) {
//         return Background.fromPaths(this, { image, shader, projectionMatrixBuffer });
//     }

//     writeBuffer(...args) {
//         this.device.queue.writeBuffer(...args);
//     }


//     compute(computeCallback, encoderCallback) {
//         const encoder = this.device.createCommandEncoder();
//         const computePass = encoder.beginComputePass();
//         computeCallback(computePass);
//         computePass.end();
//         encoderCallback(encoder);
//         this.device.queue.submit([encoder.finish()]);
//     }

//     render(view, callback) {
//         const encoder = this.device.createCommandEncoder();
//         const renderPass = encoder.beginRenderPass({
//             colorAttachments: [{
//                 view,
//                 clearValue: [1, 1, 0, 1],
//                 loadOp: "clear",
//                 storeOp: "store"
//             }]
//         });
//         callback(renderPass);
//         renderPass.end();        
//         this.device.queue.submit([encoder.finish()]);
//     }



// }


export default class WebGPU {

    static async init() {
        if (!navigator.gpu) {
            throw new Error("WebGPU is not supported by this browser.");
        }
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) throw new Error("Unable to get a GPU adapter.");
        const device = await adapter.requestDevice();
        return new WebGPU(device);
    }

    constructor(device) {
        this.device = device;
        this.format = navigator.gpu.getPreferredCanvasFormat();
    }

    createContext(canvas, alphaMode) {
        const ctx = canvas.getContext('webgpu');
        ctx.configure({
            device: this.device,
            format: this.format,
            alphaMode
        });
        return ctx;
    }

    // ------------------- Buffers -------------------
    createUniformBuffer(size, mappedAtCreation=false) {
        return this.device.createBuffer({
            size,
            mappedAtCreation,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    createStorageBuffer(size, mappedAtCreation = false) {
        return this.device.createBuffer({
            size,
            mappedAtCreation,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
    }

    createCopyBuffer(size, mappedAtCreation = false) {
        return this.device.createBuffer({
            size,
            mappedAtCreation,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        });
    }

    createVertexBuffer(size) {
        return this.device.createBuffer({
            size,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
    }

    createSampler() {
        return this.device.createSampler({
            magFilter: "linear",
            minFilter: "linear"
        });
    }

    // ------------------- Shaders & Pipelines -------------------
    async createShader(path) {
        const response = await fetch(path);
        const code = await response.text();
        return this.device.createShaderModule({ code, label: path });
    }

    createRenderPipeline(vModule, vEntry, fModule, fEntry, cullMode="none") {
        return this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: vModule,
                entryPoint: vEntry,
                buffers: [
                    {
                        arrayStride: 12,
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: "float32x3" }
                        ]
                    }
                ]
            },
            fragment: {
                module: fModule,
                entryPoint: fEntry,
                targets: [{ format: this.format }]
            },
            primitive: { topology: "triangle-list", cullMode }
        });
    }

    async createRenderPipelineBackground(shader) {
        const module = await this.createShader(shader);
        return this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module,
                entryPoint: "vsMain",
                buffers: [{
                    arrayStride: 5 * 4,
                    attributes: [
                        { shaderLocation: 0, offset: 0, format: "float32x3" },
                        { shaderLocation: 1, offset: 3*4, format: "float32x2" }
                    ]
                }]
            },
            fragment: {
                module,
                entryPoint: "fsMain",
                targets: [{ format: this.format }]
            },
            primitive: { topology: "triangle-list", cullMode: "none" }
        });
    }

    createComputePipeline(module, entryPoint) {
        return this.device.createComputePipeline({
            layout: 'auto',
            compute: { module, entryPoint }
        });
    }

    createBindGroup(...args) {
        return this.device.createBindGroup(...args);
    }

    // ------------------- Textures -------------------
    async createTexture(path) {
        const image = new Image();
        image.src = path;
        await image.decode();
        const source = await createImageBitmap(image);
        const texture = this.device.createTexture({
            size: [source.width, source.height, 1],
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.device.queue.copyExternalImageToTexture({ source }, { texture }, [source.width, source.height]);
        return texture;
    }

    async createCubeTexture(facePaths, format) {
        const bitmaps = await Promise.all(facePaths.map(this.createSquareBitmap));
        const size = bitmaps[0].width;
        const texture = this.device.createTexture({
            size: [size, size, 6],
            format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });
        for (let i = 0; i < 6; i++) {
            this.device.queue.copyExternalImageToTexture({ source: bitmaps[i] }, { texture, origin: [0,0,i] }, [size,size]);
        }
        return texture;
    }

    async createSquareBitmap(path) {
        const image = new Image();
        image.src = path;
        await image.decode();
        const size = Math.min(image.width, image.height);
        return createImageBitmap(image, 0, 0, size, size);
    }

    // ------------------- Sphere -------------------
    createSphere(rad = 1, latSeg = 64, longSeg = 128) {
        const vertices = [], indices = [];
        for (let y = 0; y <= latSeg; y++) {
            const teta = y * Math.PI / latSeg;
            const sinTeta = Math.sin(teta), cosTeta = Math.cos(teta);
            for (let x = 0; x <= longSeg; x++) {
                const phi = x * 2*Math.PI / longSeg;
                const sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);
                const vx = rad*sinTeta*cosPhi, vy = rad*cosTeta, vz = rad*sinTeta*sinPhi;
                const u = x / longSeg, v = y / latSeg;
                vertices.push(vx,vy,vz,u,v);
                const i1 = y*(longSeg+1)+x;
                const i2 = i1+longSeg+1;
                indices.push(i1,i2,i1+1,i1+1,i2,i2+1);
            }
        }
        return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
    }

    createIndexVertexBuffer(verticesAndIndices) {
        const vertexBuff = this.device.createBuffer({
            size: verticesAndIndices.vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        this.device.queue.writeBuffer(vertexBuff, 0, verticesAndIndices.vertices);
        const indexBuffer = this.device.createBuffer({
            size: verticesAndIndices.indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        });
        this.device.queue.writeBuffer(indexBuffer, 0, verticesAndIndices.indices);
        return { vertexBuff, indexBuffer, indexCount: verticesAndIndices.indices.length };
    }

    // ------------------- Compute & Render -------------------
    writeBuffer(...args) {
        this.device.queue.writeBuffer(...args);
    }

    compute(computeCallback, encoderCallback) {
        const encoder = this.device.createCommandEncoder();
        const computePass = encoder.beginComputePass();
        computeCallback(computePass);
        computePass.end();
        encoderCallback(encoder);
        this.device.queue.submit([encoder.finish()]);
    }

    render(view, callback) {
        const encoder = this.device.createCommandEncoder();
        const renderPass = encoder.beginRenderPass({
            colorAttachments: [{
                view,
                clearValue: [1,1,0,1],
                loadOp: "clear",
                storeOp: "store"
            }]
        });
        callback(renderPass);
        renderPass.end();
        this.device.queue.submit([encoder.finish()]);
    }

    // ------------------- Background -------------------
    async createBackground({ image, shader, projectionMatrixBuffer, mvpBuffer, backgroundType="cubique" }) {
        if(backgroundType === "cubique") {
            // Cube map
            const BackgroundModule = await import("./background.js");
            return BackgroundModule.default.fromPaths(this, { image, shader, projectionMatrixBuffer });
        } else {
            // Sphere
            const texture = await this.createTexture(image);
            const sampler = this.createSampler();
            const pipeline = await this.createRenderPipelineBackground(shader);
            const bindGroup = this.device.createBindGroup({
                layout: pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: { buffer: mvpBuffer } },
                    { binding: 1, resource: sampler },
                    { binding: 2, resource: texture.createView() }
                ]
            });
            const buffers = this.createIndexVertexBuffer(this.createSphere());
            return new Background(pipeline, bindGroup, buffers);
        }
    }

}

// ------------------- Background class for sphere -------------------
class Background {
    constructor(pipeline, bindGroup, buffers) {
        this.pipeline = pipeline;
        this.bindGroup = bindGroup;
        this.vertexBuffer = buffers.vertexBuff;
        this.indexBuffer = buffers.indexBuffer;
        this.indexBufferCount = buffers.indexCount;
    }

    draw(pass) {
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.setIndexBuffer(this.indexBuffer, "uint16");
        pass.drawIndexed(this.indexBufferCount, 1, 0, 0, 0);
    }
}
