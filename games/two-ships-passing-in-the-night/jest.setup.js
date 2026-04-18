// Mock canvas and WebGL
global.canvas = {
  getContext: (context) => {
    if (context === 'webgl2') {
      return {
        clearColor: () => {},
        enable: () => {},
        depthFunc: () => {},
        cullFace: () => {},
        viewport: () => {},
        getParameter: () => {},
        createBuffer: () => ({ bindBuffer: () => {}, bufferData: () => {} }),
        bindBuffer: () => {},
        bufferData: () => {},
        createShader: () => ({}),
        shaderSource: () => {},
        compileShader: () => {},
        createProgram: () => ({}),
        attachShader: () => {},
        linkProgram: () => {},
        useProgram: () => {},
        getUniformLocation: () => ({}),
        getAttribLocation: () => 0,
        vertexAttribPointer: () => {},
        enableVertexAttribArray: () => {},
        drawArrays: () => {},
        clear: () => {}
      };
    }
    return null;
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  width: 800,
  height: 600
};

// Mock Web Audio API
class AudioNode {
  constructor(context, options = {}) {
    this.context = context;
    this.gain = options.gain || 1;
  }
  connect(destination) {
    return destination;
  }
  disconnect() {}
}

class GainNode extends AudioNode {
  constructor(context, options = {}) {
    super(context, options);
    this.gain = { value: options.gain || 1 };
  }
  connect(destination) {
    return destination;
  }
}

class ConvolverNode extends AudioNode {
  constructor(context, options = {}) {
    super(context, options);
  }
  connect(destination) {
    return destination;
  }
}

class AudioContext {
  constructor() {
    this.sampleRate = 44100;
    this.destination = new GainNode(this);
  }
  createBuffer() {
    return { getChannelData: () => new Float32Array(100) };
  }
  decodeAudioData() {
    return Promise.resolve({});
  }
  close() {
    return Promise.resolve();
  }
  resume() {
    return Promise.resolve();
  }
}

global.AudioContext = AudioContext;
global.GainNode = GainNode;
global.ConvolverNode = ConvolverNode;
global.webkitAudioContext = AudioContext;

// Global event listeners
global.addEventListener = (event, callback, options) => {};
global.removeEventListener = (event, callback) => {};

global.window = global;
global.document = {
  createElement: () => ({ style: {}, addEventListener: () => {} }),
  addEventListener: () => {},
  removeEventListener: () => {},
  body: { appendChild: () => {}, removeChild: () => {} }
};

global.HTMLCanvasElement = class HTMLCanvasElement {
  getContext() {
    return global.canvas.getContext('webgl2');
  }
};

global.WebGLRenderingContext = {
  DEPTH_TEST: 0,
  CULL_FACE: 0,
  LEQUAL: 0,
  COLOR_BUFFER_BIT: 0,
  DEPTH_BUFFER_BIT: 0
};
