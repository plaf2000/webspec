import { DrawablePXBox } from "./Box.js";
import { xUnit } from "./Units.js";
export class Ax extends DrawablePXBox {
    constructor(ctx, tl, br, ax, unit, deltas = [1, 1 / 2, 1 / 4, 1 / 8]) {
        super(ctx, tl, br);
        this.first = 0;
        this.delta = 0;
        this.ctx = ctx;
        this.unit = unit;
        this.ax = ax;
        this.deltas = deltas.sort().reverse();
        this.multiples = this.deltas.map((delta, k, deltas) => {
            let set = new Set().add(1);
            for (let m = 2; m < Math.ceil(1 / delta); m++) {
                let ok = true;
                for (let i = 0; i < k; i++) {
                    if ((delta * m) % deltas[i] == 0) {
                        ok = false;
                        break;
                    }
                }
                if (ok)
                    set.add(m);
            }
            return set;
        });
    }
    get start() {
        return Math.min(+this.tl[this.ax][this.unit], +this.br[this.ax][this.unit]);
    }
    get end() {
        return Math.max(+this.tl[this.ax][this.unit], +this.br[this.ax][this.unit]);
    }
    drawOnCanvas() {
        let dec = Math.floor(Math.log10(this.end - this.start));
        let u = Math.pow(10, dec);
        let s = Math.floor(this.start / u) * u;
        let e = Math.ceil(this.end / u) * u;
        // console.log(s,e);
        this.ctx.strokeStyle = "black";
        while (s <= e) {
            // this.drawTick(s,1);
            for (let k of this.deltas.keys()) {
                const delta = this.deltas[k];
                for (const m of this.multiples[k]) {
                    const val = s + +m * delta * u;
                    if (val > this.end)
                        break;
                    this.drawTick(val, delta);
                }
            }
            s += u;
        }
        this.ctx.stroke();
    }
}
export class xAx extends Ax {
    constructor(ctx, tl, br, unit, deltas) {
        super(ctx, tl, br, "x", unit, deltas);
        this.len = 15;
        this.txt_top_margin = 2;
    }
    drawTick(val, size) {
        let l = this.len * size;
        const x = new xUnit(val, this.unit);
        this.ctx.moveTo(x.px, this.t.px);
        this.ctx.lineTo(x.px, this.t.px + l);
        if ((size == this.deltas[0])) {
            let label;
            if (this.unit == "date") {
                label = x["date"].toTimeString();
            }
            else {
                label = x[this.unit].toString();
            }
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "top";
            this.ctx.strokeText(label, x.px, this.t.px + l + this.txt_top_margin);
        }
    }
}
