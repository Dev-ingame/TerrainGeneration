class PerlinNoise {
    constructor() {
        this.permutation = [];
        this.gradP = [];
        this.seed(Math.random());
    }

    seed(seed) {
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }

        for (let i = 255; i > 0; i--) {
            const r = Math.floor(seed * (i + 1));
            [p[i], p[r]] = [p[r], p[i]];
        }

        this.permutation = [];
        for (let i = 0; i < 512; i++) {
            this.permutation[i] = p[i & 255];
        }

        this.gradP = [];
        for (let i = 0; i < 512; i++) {
            this.gradP[i] = this.grad3[this.permutation[i] % 4];
        }
    }

    grad3 = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
    ];

    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    noise(x, y) {
        // Scale input to increase frequency
        x *= 0.1;
        y *= 0.1;

        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;

        let s = (x + y) * F2;
        let i = Math.floor(x + s);
        let j = Math.floor(y + s);

        let t = (i + j) * G2;
        let X0 = i - t;
        let Y0 = j - t;
        let x0 = x - X0;
        let y0 = y - Y0;

        let i1, j1;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }

        let x1 = x0 - i1 + G2;
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1.0 + 2.0 * G2;
        let y2 = y0 - 1.0 + 2.0 * G2;

        let ii = i & 255;
        let jj = j & 255;

        let gi0 = this.gradP[ii + this.permutation[jj]];
        let gi1 = this.gradP[ii + i1 + this.permutation[jj + j1]];
        let gi2 = this.gradP[ii + 1 + this.permutation[jj + 1]];

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        let n0 = t0 < 0 ? 0 : Math.pow(t0, 4) * this.dot(gi0, x0, y0);

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        let n1 = t1 < 0 ? 0 : Math.pow(t1, 4) * this.dot(gi1, x1, y1);

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        let n2 = t2 < 0 ? 0 : Math.pow(t2, 4) * this.dot(gi2, x2, y2);

        return 40.0 * (n0 + n1 + n2);
    }
}

const Perlin = new PerlinNoise();
