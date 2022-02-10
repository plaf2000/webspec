import { DrawablePXBox } from "./Box.js";
import { convertDist, DateTime, xUnit, } from "./Units.js";
export class Ax extends DrawablePXBox {
    constructor(ctx, tl, br, ax, unit, deltas_ticks = {
        dec: [1, 1 / 2, 1 / 4, 1 / 8],
        ses: [1, 1 / 2, 1 / 3, 1 / 4, 1 / 6, 1 / 12, 1 / 30],
    }) {
        super(ctx, tl, br);
        this.first = 0;
        this.delta = 0;
        this.offset = 0;
        this.system = "dec";
        this.font_size = 11;
        this.ctx = ctx;
        this.unit = unit;
        this.ax = ax;
        this.deltas_ticks = {
            dec: deltas_ticks.dec.sort().reverse(),
            ses: deltas_ticks.ses.sort().reverse(),
        };
        this.deltas_unit = this.deltas_ticks;
        // Compute all the multiples so that ticks don't get overwritten
        // Example: deltas_ticks.dec = [1,1/2,1/4,1/8] => multiples = [{1},{1},{1,3 (not 2!)}, {1,3,5,7}]
        this.multiples = this.deltas_ticks.dec.map((delta, k, deltas_ticks) => {
            let set = new Set().add(1); // Assume al deltas_ticks.dec are different
            for (let m = 2; m < Math.ceil(1 / delta); m++) {
                let ok = true;
                // Check that this delta multiplied by m is not a multiple of any larger delta
                for (let i = 0; i < k; i++) {
                    // Assumes this.deltas_ticks.dec is sorted!
                    if ((delta * m) % this.deltas_ticks.dec[i] == 0) {
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
    get label_dist() {
        return convertDist(this.label_dist_px, this.ax, "px", this.unit);
    }
    get start() {
        return Math.min(+this.tl[this.ax][this.unit], +this.br[this.ax][this.unit]);
    }
    get end() {
        return Math.max(+this.tl[this.ax][this.unit], +this.br[this.ax][this.unit]);
    }
    getUnit() {
        // Compute the base-ten order to express a single unit, while keeping the specified distance
        let dec = Math.floor(Math.log10(this.end - this.start));
        let u_1 = Math.pow(10, dec);
        while (u_1 < this.label_dist)
            u_1 = Math.pow(10, ++dec);
        // If distance is too large, use delta values to shrink it
        let u = u_1;
        let k = 0;
        let du = this.deltas_unit[this.system];
        while (u_1 * du[k] > this.label_dist && k < du.length)
            u = u_1 * du[k++];
        return u;
    }
    drawOnCanvas() {
        let u = this.getUnit();
        let mid = Math.floor((this.start + this.end) / 2 / u / this.deltas_unit[this.system][0]) *
            u *
            this.deltas_unit[this.system][0] + this.offset;
        let pos = mid;
        this.ctx.strokeStyle = "black";
        this.ctx.font = `${this.font_size}px Arial`;
        // Draw all the ticks between one unit and the other
        // Ex: interval: (1,2), deltas: [1,.5,.25] => draws 1.25,1.5,1.75,2
        let draw = (pt, u) => {
            for (let k of this.deltas_ticks.dec.keys()) {
                const delta = this.deltas_ticks.dec[k];
                for (const m of this.multiples[k]) {
                    const val = pt + m * delta * u;
                    if (val > this.end || val < this.start)
                        break;
                    this.drawTick(val, delta);
                }
            }
        };
        // Starts drawing the tick on the midpoint (because of floor)
        this.drawTick(mid, this.deltas_ticks.dec[0]);
        // Fills with ticks on the left
        while (pos >= this.start) {
            draw(pos, -u);
            pos -= u;
        }
        pos = mid;
        // Fills with ticks on the right
        while (pos <= this.end) {
            draw(pos, u);
            pos += u;
        }
        this.ctx.stroke();
    }
}
export class xAx extends Ax {
    constructor(ctx, tl, br, unit, deltas) {
        super(ctx, tl, br, "x", unit, deltas);
        this.len = 5;
        this.dyn_len = 12;
        this.txt_top_margin = 2;
        this.label_dist_px = 100;
        this.date_written = false;
        this.system = unit == "s" || unit == "date" ? "ses" : "dec";
        // this.offset = (unit=="date")? new Date().getTimezoneOffset()*1000 : 0;
        this.offset = 0;
    }
    getUnit() {
        // Compute the base-ten order to express a single unit, while keeping the specified distance
        let dist = this.end - this.start;
        let dec = Math.floor(Math.log10(dist));
        let u_1 = Math.pow(10, dec);
        while (u_1 < this.label_dist)
            u_1 = Math.pow(10, ++dec);
        let system = "dec";
        console.log("a", u_1);
        // console.log(this.system);
        let factor = 1;
        if (this.unit == "date")
            factor = 1000;
        if (this.system == "ses" && u_1 > 1 * factor) {
            let ses = Math.floor(Math.log(dist) / factor / Math.log(60));
            u_1 = factor * Math.pow(60, ses);
            while (u_1 < this.label_dist)
                u_1 = factor * Math.pow(60, ++ses);
            if (this.unit == "date" && u_1 > 3600 * factor) {
                u_1 = 86400 * factor;
            }
            else {
                system = "ses";
            }
        }
        console.log(system, u_1);
        // If distance is too large, use delta values to shrink it
        let u = u_1;
        let k = 0;
        let du = this.deltas_unit[system];
        while (u_1 * du[k] > this.label_dist && k < du.length)
            u = u_1 * du[k++];
        return u;
    }
    drawTick(val, size) {
        let l = this.len + this.dyn_len * size;
        const x = new xUnit(val, this.unit);
        this.ctx.moveTo(x.px, this.t.px);
        this.ctx.lineTo(x.px, this.t.px + l);
        if (size == this.deltas_ticks.dec[0]) {
            let label;
            if (this.unit == "date") {
                let date_time = x["date"];
                label = date_time.toTimeString();
            }
            else {
                label = x[this.unit].toString();
            }
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "top";
            label
                .split("\n")
                .map((txt, i) => this.ctx.strokeText(txt, x.px, this.t.px + l + this.txt_top_margin + (this.font_size + 2) * i));
        }
    }
    drawOnCanvas() {
        this.date_written = false;
        super.drawOnCanvas();
        if (this.unit == "date") {
            let l = this.br.x.date;
            let midnight = new Date(l.getFullYear(), l.getMonth(), l.getDate());
            let s_dt = new DateTime(this.start);
            let e_dt = new DateTime(this.end);
            let sm = +s_dt.midnight;
            let em = +e_dt.midnight;
            let day = 86400000;
            let k = 1;
            for (; day * k < this.label_dist; k++)
                ;
            day = day * k;
            let bar_margin = 6;
            let date_pos = 25 + this.t.px + this.len + this.dyn_len + this.txt_top_margin;
            let bar_len = 31;
            let bar_pos = date_pos - 10;
            if (sm < em) {
                sm += day;
                this.ctx.textAlign = "right";
                this.ctx.textBaseline = "top";
                let midnight = new xUnit(sm, "date");
                this.ctx.strokeText(s_dt.toDateString(), midnight.px - bar_margin, date_pos);
                while (sm <= em) {
                    this.ctx.textAlign = "left";
                    this.ctx.textBaseline = "top";
                    let midnight = new xUnit(sm, "date");
                    this.ctx.moveTo(midnight.px, bar_pos);
                    this.ctx.lineTo(midnight.px, bar_pos + bar_len);
                    this.ctx.stroke();
                    this.ctx.strokeText(midnight.date.toDateString(), midnight.px + bar_margin, date_pos);
                    sm += day;
                }
            }
            else {
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "top";
                this.ctx.strokeText(s_dt.toDateString(), (this.l.px + this.r.px) / 2, date_pos);
            }
        }
    }
}
