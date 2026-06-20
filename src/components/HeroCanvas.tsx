import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Domain-warped fbm flow field, kept dim so display type stays readable.
const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;

  float t = u_time * 0.045;
  vec2 m = (u_mouse - 0.5) * 0.35;

  vec2 q = vec2(
    fbm(p + t + m),
    fbm(p + vec2(5.2, 1.3) - t)
  );
  vec2 r = vec2(
    fbm(p + 2.6 * q + vec2(1.7, 9.2) + t * 0.7),
    fbm(p + 2.6 * q + vec2(8.3, 2.8) - t * 0.4)
  );
  float f = fbm(p + 2.4 * r);

  vec3 bg = vec3(0.039, 0.039, 0.043);
  vec3 acid = vec3(0.843, 1.0, 0.247);
  vec3 violet = vec3(0.36, 0.33, 0.62);

  vec3 col = bg;
  col = mix(col, violet * 0.34, smoothstep(0.25, 0.95, f) * 0.55);
  col = mix(col, acid * 0.30, smoothstep(0.55, 1.0, length(q) * f) * 0.45);

  float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5, 0.42)));
  col = mix(bg, col, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl', {
            antialias: false,
            depth: false,
            stencil: false,
            powerPreference: 'low-power',
        });
        if (!gl) return;

        const vs = compile(gl, gl.VERTEX_SHADER, VERT);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, 'a_pos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, 'u_res');
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uMouse = gl.getUniformLocation(program, 'u_mouse');

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Phones and touch devices render a single static frame; no GPU runs continuously there.
        const staticOnly =
            reducedMotion || window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

        let raf = 0;
        let visible = true;
        let mouseX = 0.5;
        let mouseY = 0.5;
        let smoothX = 0.5;
        let smoothY = 0.5;
        const start = performance.now();

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const w = Math.round(canvas.clientWidth * dpr);
            const h = Math.round(canvas.clientHeight * dpr);
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        };

        const draw = (time: number) => {
            resize();
            smoothX += (mouseX - smoothX) * 0.04;
            smoothY += (mouseY - smoothY) * 0.04;
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, time);
            gl.uniform2f(uMouse, smoothX, smoothY);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        // Cap to ~30fps. The field drifts slowly, so frames beyond this were pure
        // GPU cost on the full-screen shader (worst on high-refresh displays).
        const FRAME_MS = 1000 / 30;
        let lastDraw = 0;
        const loop = (now: number) => {
            if (!visible) return;
            raf = requestAnimationFrame(loop);
            if (now - lastDraw < FRAME_MS) return;
            lastDraw = now;
            draw((performance.now() - start) / 1000);
        };

        if (staticOnly) {
            draw(14);
            let resizeTimer = 0;
            const onResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(() => draw(14), 200);
            };
            window.addEventListener('resize', onResize, { passive: true });
            return () => {
                clearTimeout(resizeTimer);
                window.removeEventListener('resize', onResize);
                gl.getExtension('WEBGL_lose_context')?.loseContext();
            };
        }

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting && !document.hidden;
            cancelAnimationFrame(raf);
            if (visible) raf = requestAnimationFrame(loop);
        });
        io.observe(canvas);

        const onVisibility = () => {
            visible = !document.hidden;
            cancelAnimationFrame(raf);
            if (visible) raf = requestAnimationFrame(loop);
        };
        document.addEventListener('visibilitychange', onVisibility);

        const onPointer = (e: PointerEvent) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = 1 - e.clientY / window.innerHeight;
        };
        window.addEventListener('pointermove', onPointer, { passive: true });

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pointermove', onPointer);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
