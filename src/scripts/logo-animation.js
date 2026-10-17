import { n as e, r as t } from "./media.js";
var n = [
    `sleeping`,
    `waking`,
    `idle`,
    `angry`,
    `drowsy`,
    `listening`,
    `thinking`,
    `searching`,
    `working`,
    `excited`,
    `surprised`,
    `suspicious`,
    `happy`,
    `curious`,
    `confused`,
    `bored`,
    `proud`,
    `shy`,
    `sad`,
    `laughing`,
    `scared`,
    `playful`,
    `celebrate`,
    `heat`,
    `drift`,
  ],
  r = `expression-rest`,
  i = {
    id: r,
    name: r,
    headX: 0,
    headY: 0,
    headZ: 0,
    spacing: 35,
    left: { width: 20, height: 50, x: 0, y: -7, angle: 0 },
    right: { width: 20, height: 50, x: 0, y: -7, angle: 0 },
    eyeMotion: `none`,
    bodyMotion: `none`,
  },
  a = [
    {
      id: `expression-00`,
      name: `00`,
      headX: 7.3,
      headY: 27.8,
      headZ: -16.1,
      spacing: 54.3,
      left: { width: 22.501171874999997, height: 42.377734374999996, x: 0, y: -20.5, angle: 0 },
      right: { width: 22.501171874999997, height: 42.377734374999996, x: 0, y: -20.5, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-01`,
      name: `01`,
      headX: -15.057812500000004,
      headY: 0.14296874999999964,
      headZ: -14.549218750000001,
      spacing: 57.7,
      left: { width: 22.401171875, height: 54.5703125, x: 0, y: 0, angle: 0 },
      right: { width: 22.401171875, height: 54.5703125, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-05`,
      name: `05`,
      headX: -16.528515625,
      headY: -3.7679687499999996,
      headZ: -13.7296875,
      spacing: 56.3,
      left: { width: 23.090625, height: 57.6796875, x: 0, y: 0, angle: 0 },
      right: { width: 49.924609375, height: 12.431640625, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-07`,
      name: `07`,
      headX: 8.063671874999999,
      headY: 17.626562500000002,
      headZ: -11.116796874999999,
      spacing: 52.059765625,
      left: { width: 20.908203124999996, height: 40.40078125, x: 0, y: 0, angle: -30.865625 },
      right: { width: 20.908203124999996, height: 40.40078125, x: 0, y: 0, angle: 28.781640625 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-04`,
      name: `04`,
      headX: 3.4,
      headY: 13.22578125,
      headZ: 8.976953125,
      spacing: 63.872265625,
      left: { width: 51.775, height: 13.02734375, x: 0, y: 0, angle: 0 },
      right: { width: 51.775, height: 13.02734375, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-12`,
      name: `12`,
      headX: -19.20859375,
      headY: 15.2,
      headZ: 11.8,
      spacing: 69.5,
      left: { width: 52.084765625, height: 51.467159708498066, x: 0, y: 0, angle: 0 },
      right: { width: 53.11410881916995, height: 52.187699944416956, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-03`,
      name: `03`,
      headX: 2.9468749999999986,
      headY: -16.051171875,
      headZ: -20.916015625,
      spacing: 70.9,
      left: { width: 51.68336723153048, height: 51.74054108796297, x: 0, y: 0, angle: 0 },
      right: { width: 51.68336723153048, height: 51.74054108796297, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-08`,
      name: `08`,
      headX: -12.303515625,
      headY: -17.601171875,
      headZ: 5.9109375,
      spacing: 54.9,
      left: {
        width: 20.605859374999994,
        height: 47.769921874999994,
        x: 0,
        y: 0,
        angle: 23.523046875000002,
      },
      right: {
        width: 20.605859374999994,
        height: 47.769921874999994,
        x: 0,
        y: 0,
        angle: -24.042578125000002,
      },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-09`,
      name: `09`,
      headX: -20.058203125,
      headY: 12.607421875,
      headZ: -12.7,
      spacing: 61.7,
      left: { width: 42.5, height: 41.8, x: 0, y: 0, angle: 0 },
      right: { width: 22.1, height: 22.2, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-10`,
      name: `10`,
      headX: 1.43359375,
      headY: 6.194140624999999,
      headZ: 10.56015625,
      spacing: 56.8,
      left: { width: 23.836718749999996, height: 58.130078125, x: 0, y: 0, angle: 0 },
      right: { width: 23.836718749999996, height: 58.130078125, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-11`,
      name: `11`,
      headX: -2.092968750000001,
      headY: -15.899609374999999,
      headZ: -14.469921875,
      spacing: 59.414453125,
      left: { width: 34.20086765973213, height: 85.330859375, x: 0, y: 0, angle: 0 },
      right: { width: 34.20086765973213, height: 83.17775668160692, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-13`,
      name: `13`,
      headX: -8.752343750000001,
      headY: -8.743359375,
      headZ: -10.773828125000001,
      spacing: 69.276171875,
      left: { width: 56.133984375, height: 15.5, x: 0, y: 0, angle: 0 },
      right: { width: 56.133984375, height: 15.15546875, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-02`,
      name: `02`,
      headX: -15.287109375000002,
      headY: 15.006640625,
      headZ: 12.787890625,
      spacing: 68.7,
      left: { width: 31.253906249999996, height: 76.720703125, x: 0, y: 0, angle: 0 },
      right: { width: 31.253906249999996, height: 76.720703125, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-14`,
      name: `14`,
      headX: 3.5292968750000004,
      headY: -7.0765625,
      headZ: 9.830078125,
      spacing: 62.218359375,
      left: { width: 24.306250000000002, height: 59.281640624999994, x: 0, y: 0, angle: 0 },
      right: { width: 48.92421875000001, height: 13.408203124999996, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-15`,
      name: `15`,
      headX: 0.31914062500000184,
      headY: 35.307421874999996,
      headZ: -10.904296875,
      spacing: 53.9,
      left: { width: 22.4609375, height: 39.820703125, x: 0, y: 0, angle: 0 },
      right: { width: 22.4609375, height: 39.820703125, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-16`,
      name: `16`,
      headX: -14.750781250000001,
      headY: -19.350000000000005,
      headZ: 5.631640624999998,
      spacing: 55.1,
      left: { width: 19.602343750000003, height: 48.63984375, x: 0, y: 0, angle: -27.606640625 },
      right: { width: 19.602343750000003, height: 48.63984375, x: 0, y: 0, angle: 26.1484375 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-17`,
      name: `17`,
      headX: -4.3953125,
      headY: 14.07265625,
      headZ: -16.126171874999997,
      spacing: 51.731249999999996,
      left: { width: 19.045145681988206, height: 43.370703125, x: 0, y: 0, angle: 26.2921875 },
      right: {
        width: 19.045145681988206,
        height: 43.370703125,
        x: 0,
        y: 0,
        angle: -20.249218750000004,
      },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-18`,
      name: `18`,
      headX: 6.585546875,
      headY: 4.737109375000001,
      headZ: 12.840234374999998,
      spacing: 60.4,
      left: { width: 42.1, height: 41.7, x: 0, y: 0, angle: 0 },
      right: { width: 22.2, height: 22.1, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-19`,
      name: `19`,
      headX: -6.077734375000001,
      headY: -11.03515625,
      headZ: -13.965625000000001,
      spacing: 56.2,
      left: { width: 23.045703125, height: 58.68515625, x: 0, y: 0, angle: 0 },
      right: { width: 23.045703125, height: 58.68515625, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-20`,
      name: `20`,
      headX: -17.127734375000003,
      headY: 18.070703124999998,
      headZ: 13.891796875,
      spacing: 70.8,
      left: { width: 35.452734375, height: 79.104296875, x: 0, y: 0, angle: 0 },
      right: { width: 35.452734375, height: 79.104296875, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-21`,
      name: `21`,
      headX: -5.428125,
      headY: -11.71328125,
      headZ: -13.472265625000002,
      spacing: 69,
      left: { width: 51.4, height: 50.1, x: 0, y: 0, angle: 0 },
      right: { width: 50.5, height: 49.4, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-22`,
      name: `22`,
      headX: 10.292578125,
      headY: 3.39921875,
      headZ: 7.583203125,
      spacing: 68.416796875,
      left: { width: 55.672265625, height: 14.616015625, x: 0, y: 0, angle: 0 },
      right: { width: 55.672265625, height: 14.616015625, x: 0, y: 0, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-23`,
      name: `23`,
      headX: -17.8,
      headY: 10,
      headZ: -10.894921875,
      spacing: 59.94375,
      left: { width: 23.969921875, height: 55.89296875, x: 0, y: -9.8, angle: 0 },
      right: { width: 53.56328125, height: 13.333593750000002, x: 0, y: -9.8, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-24`,
      name: `24`,
      headX: 7.131640624999998,
      headY: 7.7828124999999995,
      headZ: 3.935546874999999,
      spacing: 51.2,
      left: { width: 21.5, height: 32, x: 0, y: 40, angle: 0 },
      right: { width: 23.2, height: 33.5, x: 0, y: 40, angle: 0 },
      eyeMotion: `none`,
      bodyMotion: `none`,
    },
    {
      id: `expression-heat`,
      name: `Heat`,
      headX: 10.473974503042374,
      headY: 5.087293619785961,
      headZ: 4.698252132317348,
      spacing: 68.7,
      left: {
        width: 27.126562499999995,
        height: 63.028125,
        x: 0,
        y: 0,
        angle: -36.244531249999994,
      },
      right: {
        width: 27.126562499999995,
        height: 63.028125,
        x: 0,
        y: 0,
        angle: 27.730078125000002,
      },
      eyeMotion: `none`,
      bodyMotion: `shake`,
      bodyColor: `#ba3636`,
      eyeColor: `#610000`,
    },
    {
      id: `expression-drift`,
      name: `Drift`,
      headX: -12.303515625,
      headY: -17.601171875,
      headZ: 5.9109375,
      spacing: 54.9,
      left: {
        width: 20.605859374999994,
        height: 47.769921874999994,
        x: 0,
        y: 0,
        angle: 23.523046875000002,
      },
      right: {
        width: 20.605859374999994,
        height: 47.769921874999994,
        x: 0,
        y: 0,
        angle: -24.042578125000002,
      },
      eyeMotion: `shake`,
      bodyMotion: `slowDrift`,
      bodyColor: `#adc3ff`,
    },
  ],
  o = [r, ...a.map((e) => e.id)],
  s = Object.fromEntries([[r, i], ...a.map((e) => [e.id, e])]),
  ALL_EXPRESSIONS = o.filter((e) => e !== r);
function shuffle(arr) {
  let res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = res[i];
    res[i] = res[j];
    res[j] = temp;
  }
  return res;
}
function c(e, t = e.id) {
  return { ...e, id: t, left: { ...e.left }, right: { ...e.right } };
}
var l = {
    widthLeft: 20,
    widthRight: 20,
    heightLeft: 50,
    heightRight: 50,
    spacing: 35,
    positionXLeft: 0,
    positionXRight: 0,
    positionYLeft: -7,
    positionYRight: -7,
    leftAngle: 0,
    rightAngle: 0,
  },
  u = {
    id: `q`,
    name: `Q`,
    colors: { body: `#000000`, eyes: `#ffffff` },
    body: { width: 191, height: 191, depth: 172, roundness: 0.73 },
    face: { ...l },
  };
function d(e, t, n) {
  return e + (t - e) * n;
}
function f(e) {
  return e <= 0 ? 0 : e >= 1 ? 1 : e;
}
function p(e) {
  return e * e * (3 - 2 * e);
}
function m(e, t = 1) {
  return {
    headX: e.headX,
    headY: e.headY,
    headZ: e.headZ,
    spacing: e.spacing,
    left: { ...e.left },
    right: { ...e.right },
    blink: t,
    bob: 0,
  };
}
function h(e, t, n) {
  let r = f(n);
  return r === 0
    ? e
    : r === 1
      ? t
      : {
          id: t.id,
          name: t.name,
          headX: d(e.headX, t.headX, r),
          headY: d(e.headY, t.headY, r),
          headZ: d(e.headZ, t.headZ, r),
          spacing: d(e.spacing, t.spacing, r),
          left: _(e.left, t.left, r),
          right: _(e.right, t.right, r),
          eyeMotion: t.eyeMotion,
          bodyMotion: t.bodyMotion,
          ...(t.bodyColor === void 0 ? {} : { bodyColor: t.bodyColor }),
          ...(t.eyeColor === void 0 ? {} : { eyeColor: t.eyeColor }),
        };
}
function g(e, t) {
  return {
    ...e,
    spacing: e.spacing + t.spacing - l.spacing,
    left: {
      width: v(e.left.width + t.widthLeft - l.widthLeft),
      height: v(e.left.height + t.heightLeft - l.heightLeft),
      x: e.left.x + t.positionXLeft - l.positionXLeft,
      y: e.left.y + t.positionYLeft - l.positionYLeft,
      angle: e.left.angle + t.leftAngle - l.leftAngle,
    },
    right: {
      width: v(e.right.width + t.widthRight - l.widthRight),
      height: v(e.right.height + t.heightRight - l.heightRight),
      x: e.right.x + t.positionXRight - l.positionXRight,
      y: e.right.y + t.positionYRight - l.positionYRight,
      angle: e.right.angle + t.rightAngle - l.rightAngle,
    },
  };
}
function _(e, t, n) {
  return {
    width: d(e.width, t.width, n),
    height: d(e.height, t.height, n),
    x: d(e.x, t.x, n),
    y: d(e.y, t.y, n),
    angle: d(e.angle, t.angle, n),
  };
}
function v(e) {
  return e < 10 ? 10 : e > 110 ? 110 : e;
}
var ee = { yaw: 0, pitch: 0, panX: 0, panY: 0 },
  y = 620,
  b = 620;
function x(e, t, n, r) {
  let i = (t * Math.PI) / 180,
    a = (n * Math.PI) / 180,
    o = (r * Math.PI) / 180,
    s = Math.cos(i),
    c = Math.sin(i),
    l = [s * e[0] + c * e[2], e[1], -c * e[0] + s * e[2]],
    u = Math.cos(a),
    d = Math.sin(a),
    f = [l[0], u * l[1] - d * l[2], d * l[1] + u * l[2]],
    p = Math.cos(o),
    m = Math.sin(o);
  return [p * f[0] - m * f[1], m * f[0] + p * f[1], f[2]];
}
function S(e, t, n) {
  return x(x(e, t.headY, t.headX, t.headZ), n.yaw, n.pitch, 0);
}
function C(e, t) {
  let n = b / (y - e[2]);
  return { x: e[0] * n + t.panX, y: -e[1] * n + t.panY };
}
function te(e) {
  let t = 0,
    n = 0,
    r = 0,
    i = e.length === 0 ? 1 : e.length;
  for (let i of e) ((t += i[0]), (n += i[1]), (r += i[2]));
  return [t / i, n / i, r / i];
}
function ne(e) {
  let t = se(e);
  if (t.length <= 2) return t;
  let n = [];
  for (let e of t) {
    for (; n.length >= 2 && ce(n[n.length - 2], n[n.length - 1], e) <= 0;) n.pop();
    n.push(e);
  }
  let r = [];
  for (let e = t.length - 1; e >= 0; --e) {
    let n = t[e];
    for (; r.length >= 2 && ce(r[r.length - 2], r[r.length - 1], n) <= 0;) r.pop();
    r.push(n);
  }
  return (n.pop(), r.pop(), n.concat(r));
}
function re(e) {
  return w(e);
}
function w(e) {
  if (e.length === 0) return ``;
  if (e.length === 1) {
    let t = e[0];
    return `M${E(t.x)} ${E(t.y)}Z`;
  }
  if (e.length === 2) {
    let t = e[0],
      n = e[1];
    return `M${E(t.x)} ${E(t.y)}L${E(n.x)} ${E(n.y)}Z`;
  }
  return oe(T(e, 7));
}
function ie(e, t) {
  if (t.length < 3) return !1;
  let n = 0;
  for (let r = 0; r < t.length; r += 1) {
    let i = t[r],
      a = t[(r + 1) % t.length],
      o = (a.x - i.x) * (e.y - i.y) - (a.y - i.y) * (e.x - i.x);
    if (o === 0) continue;
    let s = o > 0 ? 1 : -1;
    if (n === 0) n = s;
    else if (s !== n) return !1;
  }
  return !0;
}
function ae(e, t) {
  return ne(e.map((e) => C(e, t)));
}
function T(e, t) {
  let n = [];
  for (let r = 0; r < e.length; r += 1) {
    let i = e[r],
      a = e[(r + 1) % e.length],
      o = Math.hypot(a.x - i.x, a.y - i.y),
      s = Math.max(1, Math.ceil(o / t));
    for (let e = 0; e < s; e += 1) {
      let t = e / s;
      n.push({ x: i.x + (a.x - i.x) * t, y: i.y + (a.y - i.y) * t });
    }
  }
  return n;
}
function oe(e) {
  let t = e.length,
    n = [`M${E(e[0].x)} ${E(e[0].y)}`];
  for (let r = 0; r < t; r += 1) {
    let i = e[(r - 1 + t) % t],
      a = e[r],
      o = e[(r + 1) % t],
      s = e[(r + 2) % t];
    n.push(
      `C${E(a.x + (o.x - i.x) / 6)} ${E(a.y + (o.y - i.y) / 6)} ${E(o.x - (s.x - a.x) / 6)} ${E(o.y - (s.y - a.y) / 6)} ${E(o.x)} ${E(o.y)}`,
    );
  }
  return (n.push(`Z`), n.join(``));
}
function se(e) {
  let t = [...e].sort((e, t) => e.x - t.x || e.y - t.y),
    n = [];
  for (let e of t) {
    let t = n[n.length - 1];
    (!t || t.x !== e.x || t.y !== e.y) && n.push(e);
  }
  return n;
}
function ce(e, t, n) {
  return (t.x - e.x) * (n.y - e.y) - (t.y - e.y) * (n.x - e.x);
}
function E(e) {
  let t = Math.round(e * 1e4) / 1e4;
  return t === 0 ? `0` : String(t);
}
var le = 72,
  ue = 33;
function de(e) {
  return e <= 0.73 ? 8 + (e / 0.73) * -3 : 5 + -3 * ((e - 0.73) / 0.27);
}
function D(e, t) {
  return e === 0 ? 0 : Math.sign(e) * Math.abs(e) ** t;
}
function fe(e, t, n, r, i, a) {
  let o = 2 / r,
    s = Math.cos(a),
    c = Math.sin(a),
    l = Math.cos(i),
    u = Math.sin(i);
  return [(e / 2) * D(s, o) * D(l, o), (t / 2) * D(c, o), (n / 2) * D(s, o) * D(u, o)];
}
function pe(e, t, n, r) {
  let i = [];
  for (let a = 0; a < ue; a += 1) {
    let o = -Math.PI / 2 + (a / 32) * Math.PI;
    for (let a = 0; a < le; a += 1) {
      let s = (a / le) * Math.PI * 2;
      i.push(fe(e, t, n, r, s, o));
    }
  }
  for (let a = 0; a < 4; a += 1) {
    let o = Math.PI / 4 + (a * Math.PI) / 2;
    (i.push(fe(e, t, n, r, o, Math.PI / 4)), i.push(fe(e, t, n, r, o, -Math.PI / 4)));
  }
  return i;
}
function me(e, t, n) {
  return he(e.width, e.height, e.depth, de(e.roundness), t, n);
}
function he(e, t, n, r, i, a) {
  let o = e / 2 || 1,
    s = t / 2 || 1,
    c = n / 2 || 1,
    l = ge(a / s, 1),
    u = Math.max(0, 1 - O(l, r)) ** (1 / r),
    d = ge(i / o, u),
    f = Math.max(0, 1 - O(d, r) - O(l, r)) ** (1 / r),
    p = [d * o, l * s, f * c];
  return {
    point: p,
    normal: _e([
      (r * Math.sign(p[0]) * O(p[0], r - 1)) / o ** r,
      (r * Math.sign(p[1]) * O(p[1], r - 1)) / s ** r,
      (r * Math.sign(p[2] || 1) * O(p[2] || c * 1e-6, r - 1)) / c ** r,
    ]),
  };
}
function O(e, t) {
  return Math.abs(e) ** t;
}
function ge(e, t) {
  return e > t ? t : e < -t ? -t : e;
}
function _e(e) {
  let t = Math.hypot(e[0], e[1], e[2]) || 1;
  return [e[0] / t, e[1] / t, e[2] / t];
}
function ve(e) {
  return pe(e.width, e.height, e.depth, de(e.roundness));
}
var ye = `-150 -150 300 300`,
  be = 14,
  xe = 1.5,
  k = 120;
function Se(e, t, n = ee) {
  let r = { headX: t.headX, headY: t.headY, headZ: t.headZ },
    i = ve(e.body).map((e) => S(e, r, n)),
    a = ae(i, n),
    o = x(x([0, 0, 1], t.headY, t.headX, t.headZ), n.yaw, n.pitch, 0)[2] > 0;
  return {
    viewBox: ye,
    body: Ce(i, a, e.colors.body, n),
    leftEye: we(e, t, n, -1, o, a),
    rightEye: we(e, t, n, 1, o, a),
  };
}
function Ce(e, t, n, r) {
  let i = C(te(e), r);
  return { d: re(t), fill: n, cx: i.x, cy: i.y };
}
function we(e, t, n, r, i, a) {
  let { body: o, colors: s } = e,
    c = r < 0 ? t.left : t.right,
    l = t.blink,
    u = 5 + (c.height - 5) * l,
    d = (r * t.spacing) / 2 + c.x,
    f = c.y,
    p = [],
    m = 0;
  for (let [e, r] of Ee(d, f, c.width / 2, u / 2, c)) {
    let [i, a] = Te(e, r),
      s = me(o, i, -a),
      c = S(s.point, t, n);
    p.push(C(c, n));
    let l = x(x(s.normal, t.headY, t.headX, t.headZ), n.yaw, n.pitch, 0);
    m += l[2];
  }
  let h = Oe(p),
    g = i && m > 0 && ie(h.center, a);
  return { d: w(p), cx: h.center.x, cy: h.center.y, rx: h.rx, ry: h.ry, fill: s.eyes, visible: g };
}
function Te(e, t) {
  let n = e / k,
    r = t / k;
  return [k * Math.cos(r) * Math.sin(n), k * Math.sin(r)];
}
function Ee(e, t, n, r, i) {
  let a = (i.angle * Math.PI) / 180,
    o = Math.cos(a),
    s = Math.sin(a);
  return De(0, 0, n, r).map(([n, r]) => [e + n * o - r * s, t + n * s + r * o]);
}
function De(e, t, n, r) {
  let i = Math.min(n, r),
    a = [];
  if (r >= n) {
    let n = t + r - i,
      o = t - r + i;
    return (
      A(a, e, n, i, 0, Math.PI),
      j(a, e - i, n, e - i, o),
      A(a, e, o, i, Math.PI, Math.PI),
      j(a, e + i, o, e + i, n),
      a
    );
  }
  let o = e + n - i,
    s = e - n + i;
  return (
    A(a, o, t, i, -Math.PI / 2, Math.PI),
    j(a, o, t + i, s, t + i),
    A(a, s, t, i, Math.PI / 2, Math.PI),
    j(a, s, t - i, o, t - i),
    a
  );
}
function A(e, t, n, r, i, a) {
  let o = Math.max(be, Math.round((28 * Math.abs(a)) / Math.PI));
  for (let s = 0; s < o; s += 1) {
    let c = i + (s / o) * a;
    e.push([t + Math.cos(c) * r, n + Math.sin(c) * r]);
  }
}
function j(e, t, n, r, i) {
  let a = Math.hypot(r - t, i - n);
  if (a < 1e-6) return;
  let o = Math.max(1, Math.ceil(a / xe));
  for (let a = 0; a < o; a += 1) {
    let s = a / o;
    e.push([t + (r - t) * s, n + (i - n) * s]);
  }
}
function Oe(e) {
  if (e.length === 0) return { center: { x: 0, y: 0 }, rx: 0, ry: 0 };
  let t = 1 / 0,
    n = 1 / 0,
    r = -1 / 0,
    i = -1 / 0,
    a = 0,
    o = 0;
  for (let s of e)
    (s.x < t && (t = s.x),
      s.y < n && (n = s.y),
      s.x > r && (r = s.x),
      s.y > i && (i = s.y),
      (a += s.x),
      (o += s.y));
  return { center: { x: a / e.length, y: o / e.length }, rx: (r - t) / 2, ry: (i - n) / 2 };
}
var ke = [`none`, `microSaccades`, `shake`],
  Ae = [`none`, `slowDrift`, `shake`],
  je = new Set(ke),
  Me = new Set(Ae);
function Ne(e) {
  return typeof e == `string` && je.has(e);
}
function Pe(e) {
  return typeof e == `string` && Me.has(e);
}
function Fe(e) {
  return e.eyeMotion !== `none` || e.bodyMotion !== `none`;
}
function Ie(e, t, n = 1) {
  let r = Le(e, t, n),
    i = Re(r, t, n);
  return i.x === 0 && i.y === 0
    ? r
    : {
        ...r,
        left: { ...r.left, x: r.left.x + i.x, y: r.left.y + i.y },
        right: { ...r.right, x: r.right.x + i.x, y: r.right.y + i.y },
      };
}
function Le(e, t, n) {
  let r = ze(e);
  if (e.bodyMotion === `slowDrift`)
    return {
      ...e,
      headX: e.headX + Be(t, 0, r, 2600) * 0.8 * n,
      headY: e.headY + Be(t, 1, r, 3300) * 1.15 * n,
      headZ: e.headZ + Be(t, 2, r, 4100) * 0.45 * n,
    };
  if (e.bodyMotion === `shake`) {
    let r = t / 1e3;
    return {
      ...e,
      headX: e.headX + (Math.sin(r * 31) + Math.sin(r * 53) * 0.45) * 1.15 * n,
      headY: e.headY + (Math.sin(r * 37) + Math.sin(r * 61) * 0.4) * 1.35 * n,
      headZ: e.headZ + Math.sin(r * 43) * 0.7 * n,
    };
  }
  return e;
}
function Re(e, t, n) {
  if (e.eyeMotion === `microSaccades`) return { x: Ve(t, 0) * 1.5 * n, y: Ve(t, 1) * 0.9 * n };
  if (e.eyeMotion === `shake`) {
    let e = t / 1e3;
    return {
      x: (Math.sin(e * 47) + Math.sin(e * 71) * 0.45) * 1.2 * n,
      y: (Math.sin(e * 59) + Math.sin(e * 83) * 0.4) * 0.8 * n,
    };
  }
  return { x: 0, y: 0 };
}
function ze(e) {
  return e.headX * 0.71 + e.headY * 1.13 + e.headZ * 1.37;
}
function Be(e, t, n, r) {
  let i = e / r,
    a = Math.floor(i),
    o = He(i - a),
    s = M(a * 3 + t + n);
  return s + (M((a + 1) * 3 + t + n) - s) * o;
}
function Ve(e, t) {
  let n = 1100;
  if (e <= 0) return 0;
  let r = Math.floor(e / n),
    i = (e - r * n) / 140,
    a = He(Math.min(i, 1)),
    o = r === 0 ? 0 : M((r - 1) * 2 + t + 17.29);
  return o + (M(r * 2 + t + 17.29) - o) * a;
}
function He(e) {
  return e * e * (3 - 2 * e);
}
function M(e) {
  let t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
  return (t - Math.floor(t)) * 2 - 1;
}
var Ue = {
    sleeping: [`expression-13`, `expression-22`, `expression-04`],
    waking: [`expression-13`],
    idle: [`expression-00`, `expression-08`],
    listening: [`expression-10`, `expression-01`, `expression-19`],
    thinking: [`expression-08`, `expression-16`, `expression-14`, `expression-17`, `expression-05`],
    searching: [
      `expression-15`,
      `expression-09`,
      `expression-03`,
      `expression-20`,
      `expression-12`,
      `expression-18`,
    ],
    working: [`expression-07`, `expression-16`, `expression-11`, `expression-10`],
    excited: [`expression-02`, `expression-17`, `expression-21`, `expression-03`, `expression-11`],
    surprised: [`expression-03`, `expression-21`],
    suspicious: [`expression-14`, `expression-05`, `expression-23`],
    angry: [`expression-07`, `expression-16`],
    drowsy: [`expression-04`, `expression-22`, `expression-13`],
    happy: [`expression-02`, `expression-11`, `expression-17`, `expression-19`],
    curious: [`expression-03`, `expression-21`, `expression-00`, `expression-15`],
    confused: [`expression-14`, `expression-05`, `expression-08`],
    bored: [`expression-04`, `expression-22`, `expression-00`],
    proud: [`expression-15`, `expression-08`, `expression-02`],
    shy: [`expression-00`, `expression-24`, `expression-13`],
    sad: [`expression-04`, `expression-13`, `expression-22`],
    laughing: [`expression-02`, `expression-11`, `expression-17`],
    scared: [`expression-03`, `expression-21`],
    playful: [`expression-02`, `expression-17`, `expression-11`, `expression-08`],
    celebrate: [`expression-02`, `expression-08`, `expression-17`],
    heat: [`expression-heat`],
    drift: [`expression-drift`],
  },
  N = {
    natural: { initialDelayMs: 2600, minIntervalMs: 3400, maxIntervalMs: 6200, durationMs: 280 },
    calm: { initialDelayMs: 4800, minIntervalMs: 6500, maxIntervalMs: 9500, durationMs: 420 },
    attentive: { initialDelayMs: 3200, minIntervalMs: 4800, maxIntervalMs: 7200, durationMs: 240 },
    active: { initialDelayMs: 2100, minIntervalMs: 2800, maxIntervalMs: 5e3, durationMs: 260 },
    reactive: { initialDelayMs: 1200, minIntervalMs: 1800, maxIntervalMs: 3600, durationMs: 220 },
  },
  We = new Set([`sleeping`, `drowsy`, `bored`, `sad`]),
  Ge = new Set([`listening`]),
  Ke = new Set([`waking`, `excited`, `surprised`, `laughing`, `scared`, `celebrate`, `heat`]);
function qe(e) {
  let t =
    e === `idle`
      ? N.natural
      : We.has(e)
        ? N.calm
        : Ge.has(e)
          ? N.attentive
          : Ke.has(e)
            ? N.reactive
            : N.active;
  return { holdMs: e === `idle` ? 5200 : We.has(e) ? 3600 : 2300, blink: t };
}
function Je() {
  let e = Object.create(null);
  for (let t of n) e[t] = Ye(t);
  return e;
}
function Ye(e) {
  let t = qe(e);
  return {
    id: e,
    name: Ze(e),
    playbackMode: `loop`,
    steps: Ue[e].map((n, r) => ({
      id: `${e}-step-${r}`,
      expressionId: n,
      holdMs: t.holdMs,
      transitionMs: 500,
      transition: `smooth`,
    })),
    blink: { enabled: !0, ...t.blink },
  };
}
function Xe(e) {
  return e.steps[0].expressionId;
}
function Ze(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
var P = {
    name: { minLength: 1, maxLength: 64 },
    payloadBytes: { max: 1048576 },
    expressions: { min: 1, max: 64 },
    sequences: { min: 1 },
    head: { min: -90, max: 90 },
    spacing: { min: 10, max: 120 },
    eyeSize: { min: 10, max: 110 },
    eyeOffset: { min: -80, max: 80 },
    angle: { min: -180, max: 180 },
    holdMs: { min: 100, max: 6e4 },
    transitionMs: { min: 0, max: 5e3 },
    blink: {
      initialDelayMs: { min: 0, max: 2e4 },
      minIntervalMs: { min: 100, max: 2e4 },
      maxIntervalMs: { min: 100, max: 3e4 },
      durationMs: { min: 40, max: 2e3 },
    },
    surface: { size: { min: 20, max: 400 }, roundness: { min: 0, max: 1 } },
  },
  Qe = P.expressions.max,
  $e = P.payloadBytes.max,
  F = /^[a-z0-9-]{1,64}$/,
  et = /^#[0-9a-fA-F]{6}$/;
function tt(e) {
  return e.length >= P.name.minLength && e.length <= P.name.maxLength && !bt(e);
}
function nt() {
  let e = Object.create(null);
  for (let t of o) e[t] = c(s[t]);
  return {
    version: 1,
    pet: {
      id: u.id,
      name: u.name,
      colors: { ...u.colors },
      body: { ...u.body },
      face: { ...u.face },
    },
    expressions: e,
    sequences: Je(),
  };
}
function rt(e) {
  if (_t(e) > $e) throw Error(`q payload too large`);
  let t = typeof e == `string` ? yt(e) : e;
  if (!L(t)) throw Error(`Invalid q payload`);
  if (t.version !== 1) throw Error(`Unknown q payload version`);
  let n = ot(t.expressions);
  return { version: 1, pet: it(t.pet), expressions: n, sequences: lt(t.sequences, n) };
}
function it(e) {
  if (!L(e) || typeof e.id != `string` || !F.test(e.id)) throw Error(`Invalid pet id`);
  return {
    id: e.id,
    name: gt(e.name, `Invalid pet name`),
    colors: pt(e.colors),
    body: ht(e.body),
    face: at(e.face),
  };
}
function at(e) {
  if (!L(e)) throw Error(`Out of range: widthLeft`);
  return {
    widthLeft: I(e.widthLeft, `widthLeft`, P.eyeSize.min, P.eyeSize.max),
    widthRight: I(e.widthRight, `widthRight`, P.eyeSize.min, P.eyeSize.max),
    heightLeft: I(e.heightLeft, `heightLeft`, P.eyeSize.min, P.eyeSize.max),
    heightRight: I(e.heightRight, `heightRight`, P.eyeSize.min, P.eyeSize.max),
    spacing: I(e.spacing, `spacing`, P.spacing.min, P.spacing.max),
    positionXLeft: I(e.positionXLeft, `positionXLeft`, P.eyeOffset.min, P.eyeOffset.max),
    positionXRight: I(e.positionXRight, `positionXRight`, P.eyeOffset.min, P.eyeOffset.max),
    positionYLeft: I(e.positionYLeft, `positionYLeft`, P.eyeOffset.min, P.eyeOffset.max),
    positionYRight: I(e.positionYRight, `positionYRight`, P.eyeOffset.min, P.eyeOffset.max),
    leftAngle: I(e.leftAngle, `leftAngle`, P.angle.min, P.angle.max),
    rightAngle: I(e.rightAngle, `rightAngle`, P.angle.min, P.angle.max),
  };
}
function ot(e) {
  if (!L(e)) throw Error(`Invalid expressions`);
  let t = Object.keys(e);
  if (t.length < 1 || t.length > Qe) throw Error(`Invalid expressions`);
  let n = Object.create(null);
  for (let r of t) {
    if (!F.test(r)) throw Error(`Invalid expression id`);
    let t = e[r];
    if (!L(t)) throw Error(`Invalid expressions`);
    if (t.id !== r || typeof t.id != `string` || !F.test(t.id))
      throw Error(`Invalid expression id`);
    n[r] = st(t);
  }
  return n;
}
function st(e) {
  return {
    id: e.id,
    name: gt(e.name, `Invalid expression name`),
    headX: I(e.headX, `headX`, P.head.min, P.head.max),
    headY: I(e.headY, `headY`, P.head.min, P.head.max),
    headZ: I(e.headZ, `headZ`, P.head.min, P.head.max),
    spacing: I(e.spacing, `spacing`, P.spacing.min, P.spacing.max),
    left: ct(e.left, `left`),
    right: ct(e.right, `right`),
    eyeMotion: Ne(e.eyeMotion) ? e.eyeMotion : `none`,
    bodyMotion: Pe(e.bodyMotion) ? e.bodyMotion : `none`,
    ...(typeof e.bodyColor == `string` && et.test(e.bodyColor)
      ? { bodyColor: e.bodyColor.toLowerCase() }
      : {}),
    ...(typeof e.eyeColor == `string` && et.test(e.eyeColor)
      ? { eyeColor: e.eyeColor.toLowerCase() }
      : {}),
  };
}
function ct(e, t) {
  if (!L(e)) throw Error(`Out of range: ${t}.width`);
  return {
    width: I(e.width, `${t}.width`, P.eyeSize.min, P.eyeSize.max),
    height: I(e.height, `${t}.height`, P.eyeSize.min, P.eyeSize.max),
    x: I(e.x, `${t}.x`, P.eyeOffset.min, P.eyeOffset.max),
    y: I(e.y, `${t}.y`, P.eyeOffset.min, P.eyeOffset.max),
    angle: I(e.angle, `${t}.angle`, P.angle.min, P.angle.max),
  };
}
function lt(e, t) {
  if (!L(e)) throw Error(`Invalid sequences`);
  let n = Object.keys(e);
  if (n.length < 1) throw Error(`Invalid sequences`);
  let r = Object.create(null);
  for (let i of n) {
    if (!F.test(i)) throw Error(`Invalid sequence id`);
    let n = e[i];
    if (!L(n)) throw Error(`Invalid sequences`);
    if (n.id !== i || typeof n.id != `string` || !F.test(n.id)) throw Error(`Invalid sequence id`);
    r[i] = ut(n, t);
  }
  return r;
}
function ut(e, t) {
  if (!Array.isArray(e.steps) || e.steps.length < 1) throw Error(`Invalid sequence steps`);
  return {
    id: e.id,
    name: gt(e.name, `Invalid sequence name`),
    playbackMode:
      e.playbackMode === `once` || e.playbackMode === `pingPong` ? e.playbackMode : `loop`,
    steps: e.steps.map((n, r) => dt(n, t, `${String(e.id)}-step-${r}`)),
    blink: ft(e.blink),
  };
}
function dt(e, t, n) {
  if (!L(e)) throw Error(`Invalid sequence steps`);
  let r = e.expressionId;
  if (typeof r != `string` || !Object.hasOwn(t, r)) throw Error(`Invalid sequence steps`);
  return {
    id: typeof e.id == `string` && F.test(e.id) ? e.id : n,
    expressionId: r,
    holdMs: I(e.holdMs, `holdMs`, P.holdMs.min, P.holdMs.max),
    transitionMs: I(e.transitionMs, `transitionMs`, P.transitionMs.min, P.transitionMs.max),
    transition: `smooth`,
  };
}
function ft(e) {
  if (!L(e)) throw Error(`Invalid blink`);
  return {
    enabled: e.enabled !== !1,
    initialDelayMs: I(
      e.initialDelayMs,
      `initialDelayMs`,
      P.blink.initialDelayMs.min,
      P.blink.initialDelayMs.max,
    ),
    minIntervalMs: I(
      e.minIntervalMs,
      `minIntervalMs`,
      P.blink.minIntervalMs.min,
      P.blink.minIntervalMs.max,
    ),
    maxIntervalMs: I(
      e.maxIntervalMs,
      `maxIntervalMs`,
      P.blink.maxIntervalMs.min,
      P.blink.maxIntervalMs.max,
    ),
    durationMs: I(e.durationMs, `durationMs`, P.blink.durationMs.min, P.blink.durationMs.max),
  };
}
function pt(e) {
  if (!L(e)) throw Error(`Invalid color`);
  return { body: mt(e.body), eyes: mt(e.eyes) };
}
function mt(e) {
  if (typeof e != `string` || !et.test(e)) throw Error(`Invalid color`);
  return e;
}
function ht(e) {
  if (!L(e)) throw Error(`Invalid surface`);
  return {
    width: I(e.width, `width`, P.surface.size.min, P.surface.size.max),
    height: I(e.height, `height`, P.surface.size.min, P.surface.size.max),
    depth: I(e.depth, `depth`, P.surface.size.min, P.surface.size.max),
    roundness: I(e.roundness, `roundness`, P.surface.roundness.min, P.surface.roundness.max),
  };
}
function gt(e, t) {
  if (typeof e != `string` || !tt(e)) throw Error(t);
  return e;
}
function I(e, t, n, r) {
  if (typeof e != `number` || !Number.isFinite(e) || e < n || e > r)
    throw Error(`Out of range: ${t}`);
  return e;
}
function _t(e) {
  let t = typeof e == `string` ? e : vt(e);
  return new TextEncoder().encode(t).length;
}
function vt(e) {
  try {
    return JSON.stringify(e) ?? ``;
  } catch {
    throw Error(`Invalid q payload`);
  }
}
function yt(e) {
  try {
    return JSON.parse(e);
  } catch {
    throw Error(`Invalid q payload`);
  }
}
function L(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
function bt(e) {
  for (let t = 0; t < e.length; t += 1) {
    let n = e.charCodeAt(t);
    if (n <= 31 || n === 127) return !0;
  }
  return !1;
}
function xt(e = {}) {
  let t = e.now ?? Et,
    n = e.random ?? Math.random,
    r = e.payload === void 0 ? nt() : rt(e.payload),
    i = e.reduceMotion === !0,
    a = wt(r, e.mood),
    o = z(r, Tt(r, a)),
    s = St(r, a, o, t(), !0),
    c = B(t(), n, R(r, a), !0),
    l = null,
    u = (e) => {
      let u = wt(r, e);
      if (u === a && s.sequence !== null) return;
      let d = t();
      ((a = u),
        (s = St(r, u, v(d), d, i)),
        (l = null),
        (c = B(d, n, s.sequence, !0)),
        i && (o = s.to));
    },
    d = (e, n = ee) => {
      let s = e ?? t(),
        c = v(s);
      o = c;
      let l = g(c, r.pet.face),
        u = m(!i && Fe(l) ? Ie(l, s) : l, _(s)),
        d = { body: c.bodyColor ?? r.pet.colors.body, eyes: c.eyeColor ?? r.pet.colors.eyes };
      return {
        timeMs: s,
        mood: a,
        pose: u,
        marks: Se({ ...r.pet, colors: d }, u, n),
        colors: d,
        name: r.pet.name,
      };
    },
    _ = (e) => {
      let t = 1,
        r = s.sequence;
      if (!i && r?.blink.enabled && (l === null && e >= c && (l = e), l !== null)) {
        let i = f((e - l) / r.blink.durationMs);
        ((t = 1 - (i < 0.5 ? i * 2 : (1 - i) * 2)), i >= 1 && ((l = null), (c = B(e, n, r, !1))));
      }
      return t;
    },
    v = (e) => {
      if (i) return s.to;
      let t = s.sequence?.steps[s.cursor.index];
      if (!t) {
        if (s.holding) return s.to;
        let t = f((e - s.startedAt) / 500),
          n = h(s.from, s.to, p(t));
        return t < 1 ? n : ((s.holding = !0), (s.from = s.to), s.to);
      }
      if ((s.holding && e - s.startedAt >= t.holdMs && y(e), !s.holding)) {
        let n = Math.max(t.transitionMs, 0),
          r = n === 0 ? 1 : f((e - s.startedAt) / n),
          i = h(s.from, s.to, p(r));
        return r < 1 ? i : ((s.holding = !0), (s.startedAt = e), (s.from = s.to), s.to);
      }
      return s.to;
    },
    y = (e) => {
      let t = s.sequence;
      if (!t || t.steps.length === 0) return;
      let { index: n, direction: i } = s.cursor;
      if (t.playbackMode === `once` && n >= t.steps.length - 1) { s.finished = !0; return; }
      t.playbackMode === `pingPong`
        ? ((n += i),
          (n >= t.steps.length || n < 0) &&
            ((i = i === 1 ? -1 : 1), (n = Math.min(Math.max(n + i * 2, 0), t.steps.length - 1))))
        : (n = (n + 1) % t.steps.length);
      let a = t.steps[n].expressionId;
      ((s.cursor = { index: n, direction: i }),
        (s.from = s.to),
        (s.to = z(r, a)),
        (s.startedAt = e),
        (s.holding = !1));
    };
  return {
    get mood() {
      return a;
    },
    get payload() {
      return r;
    },
    get isFinished() {
      return Boolean(s.finished);
    },
    play: u,
    evaluate: d,
    update: (e) => {
      let i = rt(e),
        u = s.cursor.index,
        d = s.cursor.direction,
        f = s.holding,
        p = s.startedAt;
      ((r = i), (a = Object.hasOwn(i.sequences, a) || Object.hasOwn(i.expressions, a) ? a : Ct(i)));
      let m = R(i, a),
        h = m?.steps[u];
      if (m && h) {
        let e = z(i, h.expressionId);
        ((o = e),
          (s = {
            sequence: m,
            from: e,
            to: e,
            startedAt: p,
            cursor: { index: u, direction: d },
            holding: f,
          }));
      } else ((o = z(i, Tt(i, a))), (s = St(i, a, o, t(), !0)));
      ((l = null), (c = B(t(), n, s.sequence, !0)));
    },
    setReduceMotion: (e) => {
      ((i = e), e && ((o = s.to), (s.holding = !0), (l = null)));
    },
  };
}
function St(e, t, n, r, i) {
  let a = R(e, t),
    o = z(e, Tt(e, t));
  return {
    sequence: a,
    from: i ? o : n,
    to: o,
    startedAt: r,
    cursor: { index: 0, direction: 1 },
    holding: i,
  };
}
function Ct(e) {
  if (Object.hasOwn(e.sequences, `idle`)) return `idle`;
  let t = Object.keys(e.sequences);
  if (t.length > 0) return t[0];
  let n = Object.keys(e.expressions);
  if (n.length === 0) throw Error(`Unknown expression: empty`);
  return n[0];
}
function wt(e, t) {
  let n = t ?? Ct(e);
  if (Object.hasOwn(e.sequences, n) || Object.hasOwn(e.expressions, n)) return n;
  throw Error(`Unknown expression: ${n}`);
}
function Tt(e, t) {
  let n = R(e, t);
  return n ? Xe(n) : t;
}
function R(e, t) {
  return Object.hasOwn(e.sequences, t) ? e.sequences[t] : null;
}
function z(e, t) {
  let n = Object.hasOwn(e.expressions, t) ? e.expressions[t] : void 0;
  if (!n) throw Error(`Unknown expression: ${t}`);
  return n;
}
function B(e, t, n, r) {
  if (!n?.blink.enabled) return e + 0xe8d4a51000;
  if (r) return e + n.blink.initialDelayMs;
  let i = Math.max(n.blink.maxIntervalMs - n.blink.minIntervalMs, 0);
  return e + n.blink.minIntervalMs + t() * i;
}
function Et() {
  return globalThis.performance?.now() ?? Date.now();
}
var Dt = `http://www.w3.org/2000/svg`;
function Ot(e, t) {
  (e.setAttribute(`viewBox`, t.marks.viewBox),
    e.setAttribute(`role`, `img`),
    e.setAttribute(`aria-label`, t.name),
    e.setAttribute(`shape-rendering`, `geometricPrecision`));
  let n = kt(e);
  n.setAttribute(`transform`, `translate(0, ${t.pose.bob * -8})`);
  let r,
    i,
    a,
    o = [];
  for (let e of n.children)
    if (Mt(e, `path`)) {
      let t = e.getAttribute(`data-q-eye`);
      t === `left` && i === void 0
        ? (i = e)
        : t === `right` && a === void 0
          ? (a = e)
          : e.getAttribute(`data-q-id`) === `body` && r === void 0
            ? (r = e)
            : o.push(e);
    } else o.push(e);
  for (let e of o) e.remove();
  (r === void 0 && ((r = jt(`path`)), r.setAttribute(`data-q-id`, `body`)),
    r.setAttribute(`d`, t.marks.body.d),
    r.setAttribute(`fill`, t.marks.body.fill),
    r.removeAttribute(`cx`),
    r.removeAttribute(`cy`),
    n.appendChild(r),
    At(n, i, `left`, t.marks.leftEye),
    At(n, a, `right`, t.marks.rightEye));
}
function kt(e) {
  let t = [];
  for (let n of e.children) Mt(n, `g`) && n.getAttribute(`data-q-root`) === `true` && t.push(n);
  let n = t[0];
  n === void 0 && ((n = jt(`g`)), n.setAttribute(`data-q-root`, `true`), e.appendChild(n));
  for (let e of t.slice(1)) e.remove();
  return n;
}
function At(e, t, n, r) {
  let i = t ?? jt(`path`);
  (t === void 0 && i.setAttribute(`data-q-eye`, n),
    i.setAttribute(`d`, r.d),
    i.setAttribute(`fill`, r.fill),
    r.visible ? i.removeAttribute(`display`) : i.setAttribute(`display`, `none`),
    e.appendChild(i));
}
function jt(e) {
  return document.createElementNS(Dt, e);
}
function Mt(e, t) {
  return e.namespaceURI === Dt && e.localName === t;
}
var Nt = 86,
  Pt = 340,
  Ft = -150,
  It = 300,
  Lt = 0.03,
  Rt = 0.02,
  zt = 0.5,
  Bt = `M179.2,102.4L332.8,102.4A76.8,76.8 0 0 1 409.6,179.2L409.6,332.8A76.8,76.8 0 0 0 332.8,409.6L179.2,409.6A76.8,76.8 0 0 1 102.4,332.8L102.4,179.2A76.8,76.8 0 0 1 179.2,102.4Z M204.8,204.8L307.2,204.8L307.2,307.2L204.8,307.2Z`,
  V = rn(),
  Vt = sn(),
  Ht = dn(V.outer) / dn(Vt.outer),
  H = cn(Vt, Ht),
  Ut = on(Bt);
function Wt(e, t, n) {
  if ((n <= 0 && Kt(e)) || (n >= 1 && Kt(t))) return Gt();
  let r = qt(e, t, n);
  return {
    bodyD: r.hole ? `${G(r.outer)}${G(r.hole)}` : G(r.outer),
    fillRule: r.hole ? `evenodd` : `nonzero`,
    left: nn(r.left),
    right: nn(r.right),
  };
}
function Gt() {
  return {
    bodyD: Ut,
    fillRule: `evenodd`,
    left: { d: `M0 0Z`, visible: !1 },
    right: { d: `M0 0Z`, visible: !1 },
  };
}
function Kt(e) {
  return e.hole !== null && e.left === null && e.right === null;
}
function qt(e, t, n) {
  let r = Z(n);
  return {
    outer: Qt(e.outer, t.outer, r),
    hole: en(e.hole, t.hole, r),
    left: tn(e.left, t.left, r),
    right: tn(e.right, t.right, r),
  };
}
function Jt(e) {
  return cn(
    { outer: W(U(e.body.d)), hole: null, left: W(U(e.leftEye.d)), right: W(U(e.rightEye.d)) },
    Ht,
  );
}
function U(e) {
  return Yt(e)[0] ?? [];
}
function Yt(e) {
  let t = [],
    n = [];
  for (let r of e.matchAll(/([MLCZmlcz])([^MLCZmlcz]*)/g)) {
    let e = r[1];
    if (e === void 0) continue;
    let i = fn(r[2] ?? ``);
    if (e === `M`) {
      n.length > 0 && t.push(n);
      let e = i[0],
        r = i[1];
      n = e === void 0 || r === void 0 ? [] : [{ x: e, y: r }];
      continue;
    }
    if (e === `L`) {
      let e = i[0],
        t = i[1];
      e !== void 0 && t !== void 0 && n.push({ x: e, y: t });
      continue;
    }
    if (e === `C`)
      for (let e = 0; e + 5 < i.length; e += 6) {
        let t = i[e + 4],
          r = i[e + 5];
        t !== void 0 && r !== void 0 && n.push({ x: t, y: r });
      }
  }
  return (n.length > 0 && t.push(n), t.map(Xt));
}
function Xt(e) {
  if (e.length < 2) return e;
  let t = e[0],
    n = e[e.length - 1];
  return !t || !n || Math.abs(t.x - n.x) > 0.001 || Math.abs(t.y - n.y) > 0.001
    ? e
    : e.slice(0, -1);
}
function W(e) {
  return e.length === 0 ? [] : $t(ln(un(e)), 96);
}
function G(e) {
  if (e.length === 0) return ``;
  let t = e[0];
  if (!t) return ``;
  if (e.length === 1) return `M${Q(t.x)} ${Q(t.y)}Z`;
  let n = e.length,
    r = [`M${Q(t.x)} ${Q(t.y)}`];
  for (let t = 0; t < n; t += 1) {
    let i = e[(t - 1 + n) % n],
      a = e[t],
      o = e[(t + 1) % n],
      s = e[(t + 2) % n];
    !i ||
      !a ||
      !o ||
      !s ||
      r.push(
        `C${Q(a.x + (o.x - i.x) / 6)} ${Q(a.y + (o.y - i.y) / 6)} ${Q(o.x - (s.x - a.x) / 6)} ${Q(o.y - (s.y - a.y) / 6)} ${Q(o.x)} ${Q(o.y)}`,
      );
  }
  return (r.push(`Z`), r.join(``));
}
function K(e) {
  return { x: ((e.x - Nt) / Pt) * It + Ft, y: ((e.y - Nt) / Pt) * It + Ft };
}
function Zt(e, t, n, r, i) {
  let a = Math.min(i, n / 2, r / 2),
    o = [];
  return a <= 0
    ? (J(o, e, t, e + n, t),
      J(o, e + n, t, e + n, t + r),
      J(o, e + n, t + r, e, t + r),
      J(o, e, t + r, e, t),
      o)
    : (J(o, e + a, t, e + n - a, t),
      q(o, e + n - a, t + a, a, -Math.PI / 2, Math.PI / 2),
      J(o, e + n, t + a, e + n, t + r - a),
      q(o, e + n - a, t + r - a, a, 0, Math.PI / 2),
      J(o, e + n - a, t + r, e + a, t + r),
      q(o, e + a, t + r - a, a, Math.PI / 2, Math.PI / 2),
      J(o, e, t + r - a, e, t + a),
      q(o, e + a, t + a, a, Math.PI, Math.PI / 2),
      o);
}
function Qt(e, t, n) {
  let r = Math.min(e.length, t.length),
    i = [];
  for (let a = 0; a < r; a += 1) {
    let r = e[a],
      o = t[a];
    !r || !o || i.push({ x: r.x + (o.x - r.x) * n, y: r.y + (o.y - r.y) * n });
  }
  return i;
}
function $t(e, t) {
  if (e.length === 0 || t <= 0) return [];
  let n = e[0];
  if (!n) return [];
  let r = [0],
    i = 0;
  for (let t = 0; t < e.length; t += 1) {
    let n = e[t],
      a = e[(t + 1) % e.length];
    !n || !a || ((i += Math.hypot(a.x - n.x, a.y - n.y)), r.push(i));
  }
  if (i === 0) return Array.from({ length: t }, () => ({ x: n.x, y: n.y }));
  let a = [];
  for (let n = 0; n < t; n += 1) {
    let o = (n / t) * i,
      s = 0;
    for (; s + 1 < r.length && (r[s + 1] ?? 0) < o;) s += 1;
    let c = e[s % e.length],
      l = e[(s + 1) % e.length],
      u = r[s] ?? 0,
      d = r[s + 1] ?? u;
    if (!c || !l) continue;
    let f = d === u ? 0 : (o - u) / (d - u);
    a.push({ x: c.x + (l.x - c.x) * f, y: c.y + (l.y - c.y) * f });
  }
  return a;
}
function en(e, t, n) {
  if (e && t) return Qt(e, t, n);
  if (e && !t) {
    let t = 1 - Z(n / 0.55);
    return t < Lt ? null : Y(e, X(e), t);
  }
  if (!e && t) {
    let e = Z((n - 0.45) / 0.55);
    return e < Lt ? null : Y(t, X(t), e);
  }
  return null;
}
function tn(e, t, n) {
  if (e && t) return Qt(e, t, n);
  if (t && !e) {
    let e = Z((n - zt) / 0.5);
    return e < Rt ? null : Y(t, X(t), e);
  }
  if (e && !t) {
    let t = 1 - n;
    return t < Rt ? null : Y(e, X(e), t);
  }
  return null;
}
function nn(e) {
  return e ? { d: G(e), visible: !0 } : { d: `M0 0Z`, visible: !1 };
}
function rn() {
  return {
    outer: W(an().map(K)),
    hole: W(Zt(204.8, 204.8, 102.4, 102.4, 0).map(K)),
    left: null,
    right: null,
  };
}
function an() {
  let e = [];
  return (
    J(e, 179.2, 102.4, 332.8, 102.4),
    q(e, 332.8, 179.2, 76.8, -Math.PI / 2, Math.PI / 2),
    J(e, 409.6, 179.2, 409.6, 332.8),
    q(e, 409.6, 409.6, 76.8, -Math.PI / 2, -Math.PI / 2),
    J(e, 332.8, 409.6, 179.2, 409.6),
    q(e, 179.2, 332.8, 76.8, Math.PI / 2, Math.PI / 2),
    J(e, 102.4, 332.8, 102.4, 179.2),
    q(e, 179.2, 179.2, 76.8, Math.PI, Math.PI / 2),
    e
  );
}
function on(e) {
  let t = It / Pt,
    n = ``;
  for (let r of e.matchAll(/([MLAZ])([^MLAZ]*)/g)) {
    let e = r[1];
    if (e === void 0) continue;
    if (e === `Z`) {
      n += `Z`;
      continue;
    }
    let i = fn(r[2] ?? ``);
    if (e === `M` || e === `L`) {
      let t = i[0],
        r = i[1];
      if (t === void 0 || r === void 0) continue;
      let a = K({ x: t, y: r });
      n += `${e}${Q(a.x)} ${Q(a.y)}`;
      continue;
    }
    let a = i[0],
      o = i[1],
      s = i[2],
      c = i[3],
      l = i[4],
      u = i[5],
      d = i[6];
    if (
      a === void 0 ||
      o === void 0 ||
      s === void 0 ||
      c === void 0 ||
      l === void 0 ||
      u === void 0 ||
      d === void 0
    )
      continue;
    let f = K({ x: u, y: d });
    n += `A${Q(a * t)} ${Q(o * t)} ${s} ${c} ${l} ${Q(f.x)} ${Q(f.y)}`;
  }
  return n;
}
function q(e, t, n, r, i, a) {
  let o = Math.max(4, Math.round((32 * Math.abs(a)) / Math.PI));
  for (let s = 0; s < o; s += 1) {
    let c = i + (s / o) * a;
    e.push({ x: t + Math.cos(c) * r, y: n + Math.sin(c) * r });
  }
}
function J(e, t, n, r, i) {
  let a = Math.max(1, Math.ceil(Math.hypot(r - t, i - n) / 4));
  for (let o = 0; o < a; o += 1) {
    let s = o / a;
    e.push({ x: t + (r - t) * s, y: n + (i - n) * s });
  }
}
function sn() {
  let e = Se(u, m(i));
  return { outer: W(U(e.body.d)), hole: null, left: W(U(e.leftEye.d)), right: W(U(e.rightEye.d)) };
}
function cn(e, t) {
  let n = { x: 0, y: 0 };
  return {
    outer: Y(e.outer, n, t),
    hole: e.hole ? Y(e.hole, n, t) : null,
    left: e.left ? Y(e.left, n, t) : null,
    right: e.right ? Y(e.right, n, t) : null,
  };
}
function Y(e, t, n) {
  return e.map((e) => ({ x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n }));
}
function X(e) {
  if (e.length === 0) return { x: 0, y: 0 };
  let t = 0,
    n = 0;
  for (let r of e) ((t += r.x), (n += r.y));
  return { x: t / e.length, y: n / e.length };
}
function ln(e) {
  let t = 0,
    n = 1 / 0,
    r = 1 / 0;
  for (let i = 0; i < e.length; i += 1) {
    let a = e[i];
    a &&
      (a.x < n - 1e-6 || (Math.abs(a.x - n) <= 1e-6 && a.y < r)) &&
      ((t = i), (n = a.x), (r = a.y));
  }
  return e.slice(t).concat(e.slice(0, t));
}
function un(e) {
  let t = 0;
  for (let n = 0; n < e.length; n += 1) {
    let r = e[n],
      i = e[(n + 1) % e.length];
    !r || !i || (t += r.x * i.y - i.x * r.y);
  }
  return t >= 0 ? [...e] : e.toReversed();
}
function dn(e) {
  let t = 0;
  for (let n of e) t = Math.max(t, Math.abs(n.x), Math.abs(n.y));
  return t === 0 ? 1 : t;
}
function fn(e) {
  return e.trim() === ``
    ? []
    : e
        .trim()
        .split(/[\s,]+/)
        .map(Number)
        .filter((e) => Number.isFinite(e));
}
function Z(e) {
  return e <= 0 ? 0 : e >= 1 ? 1 : e;
}
function Q(e) {
  let t = Math.round(e * 1e4) / 1e4;
  return t === 0 ? `0` : String(t);
}
var $ = `catalog`, pn = 1800, mn = 500;
function hn(n) {
  if (n.dataset.brandReady === `true`) return { destroy() {} };
  n.dataset.brandReady = `true`;
  let r = n.closest(`a`) ?? n,
    i = document.getElementById(`site-header`),
    a = window.matchMedia(t),
    o = window.matchMedia(e),
    s = `logo`,
    c = 0,
    l = V,
    u = H,
    d = 0,
    MORPH_DURATION = 550,
    f = MORPH_DURATION,
    p = 0,
    m = null,
    h = !1,
    playlist = shuffle(ALL_EXPRESSIONS),
    totalCount = playlist.length,
    catalogOffset = 0,
    userInteracting = !1,
    autoPlaying = !1,
    autoTimer = null,
    INITIAL_DELAY = 3000,
    REST_DELAY = 3500,
    BATCH_SIZE = 3,
    clearAutoTimer = () => {
      autoTimer !== null && (clearTimeout(autoTimer), (autoTimer = null));
    },
    scheduleNextPlay = (delay) => {
      clearAutoTimer();
      if (a.matches || v() || catalogOffset >= totalCount) return;
      autoTimer = setTimeout(startAutoCycle, delay);
    },
    startAutoCycle = () => {
      clearAutoTimer();
      if (a.matches || v() || catalogOffset >= totalCount) return;
      if (r.matches(`:hover`) || r.matches(`:focus-visible`)) {
        userInteracting = !0;
      }
      autoPlaying = !0;
      applyState();
    },
    stopAutoCycle = () => {
      clearAutoTimer();
      autoPlaying = !1;
      catalogOffset += BATCH_SIZE;
      applyState();
    },
    applyState = () => {
      let target = userInteracting || autoPlaying;
      S(target);
    },
    g = (e) => {
      let t = n.querySelector(`[data-q-id="body"]`),
        r = n.querySelector(`[data-q-eye="left"]`),
        i = n.querySelector(`[data-q-eye="right"]`);
      if (
        !(t instanceof SVGPathElement) ||
        !(r instanceof SVGPathElement) ||
        !(i instanceof SVGPathElement)
      )
        return;
      let a = n.querySelector(`[data-q-root="true"]`);
      (a instanceof SVGGElement && a.removeAttribute(`transform`),
        t.setAttribute(`d`, e.bodyD),
        t.setAttribute(`fill-rule`, e.fillRule),
        t.setAttribute(`fill`, `currentColor`),
        yn(r, e.left.d, e.left.visible),
        yn(i, e.right.d, e.right.visible),
        bn(n));
    },
    _ = (e) => {
      m && vn(n, m.evaluate(e));
    },
    v = () => document.hidden || i?.inert === !0,
    ee = () => {
      p !== 0 && (cancelAnimationFrame(p), (p = 0));
    },
    y = (e) => {
      if (((p = 0), !v())) {
        if (s === `in` || s === `out`) {
          if (((c = Math.min(1, (e - d) / f)), g(Wt(l, u, c)), c < 1)) {
            p = requestAnimationFrame(y);
            return;
          }
          if (s === `in`) {
            s = `live`;
            let isAuto = autoPlaying && !userInteracting;
            let batchSteps = isAuto
              ? playlist.slice(catalogOffset, catalogOffset + BATCH_SIZE)
              : ALL_EXPRESSIONS;
            m = _n(a.matches, batchSteps, isAuto);
            m.play($);
            _(e);
            p = requestAnimationFrame(y);
            return;
          }
          // Morph-out completed fully!
          s = `logo`;
          c = 0;
          m = null;
          g(Wt(V, V, 0));
          // If we haven't finished the full round yet, pause for REST_DELAY, then start next batch
          if (!userInteracting && catalogOffset < totalCount) {
            scheduleNextPlay(REST_DELAY);
          }
          return;
        }
        if (s === `live`) {
          _(e);
          // When the last expression of the current batch completes its full hold:
          if (autoPlaying && !userInteracting && m?.isFinished) {
            stopAutoCycle();
            return;
          }
          p = requestAnimationFrame(y);
        }
      }
    },
    b = () => {
      p !== 0 || v() || (p = requestAnimationFrame(y));
    },
    x = (e) => {
      if ((ee(), e)) {
        s = `live`;
        c = 1;
        m = _n(!0, ALL_EXPRESSIONS, !1);
        m.play($);
        _(performance.now());
        return;
      }
      s = `logo`;
      c = 0;
      m = null;
      g(Wt(V, V, 0));
    },
    S = (e) => {
      if (e !== h) {
        if (((h = e), a.matches)) {
          x(e);
          return;
        }
        if (e) {
          if (s === `live` || s === `in`) return;
          s === `out`
            ? C(H, MORPH_DURATION)
            : ((l = V),
              (u = H),
              (c = 0),
              (d = performance.now()),
              (f = MORPH_DURATION),
              (s = `in`)),
            b();
          return;
        }
        s !== `logo` &&
          s !== `out` &&
          (s === `live` && m
            ? ((l = Jt(m.evaluate(performance.now()).marks)),
              (u = V),
              (c = 0),
              (d = performance.now()),
              (f = MORPH_DURATION),
              (s = `out`),
              (m = null))
            : C(V, MORPH_DURATION),
          b());
      }
    },
    C = (e, t) => {
      ((l = qt(l, u, c)),
        (u = e),
        (c = 0),
        (d = performance.now()),
        (f = t),
        (s = e === H ? `in` : `out`));
    },
    te = () => {
      if (o.matches) {
        userInteracting = !0;
        clearAutoTimer();
        autoPlaying = !1;
        if (s === `live`) {
          m = _n(a.matches, ALL_EXPRESSIONS, !1);
          m.play($);
        }
        applyState();
      }
    },
    ne = () => {
      if (o.matches && !r.matches(`:focus-visible`)) {
        userInteracting = !1;
        clearAutoTimer();
        autoPlaying = !1;
        applyState();
      }
    },
    re = () => {
      if (r.matches(`:focus-visible`)) {
        userInteracting = !0;
        clearAutoTimer();
        autoPlaying = !1;
        if (s === `live`) {
          m = _n(a.matches, ALL_EXPRESSIONS, !1);
          m.play($);
        }
        applyState();
      }
    },
    w = () => {
      if (!o.matches || !r.matches(`:hover`)) {
        userInteracting = !1;
        clearAutoTimer();
        autoPlaying = !1;
        applyState();
      }
    },
    ie = () => {
      if (v()) {
        clearAutoTimer();
        if (autoPlaying && !userInteracting) {
          autoPlaying = !1;
          applyState();
        }
      } else {
        b();
        if (!userInteracting && !autoPlaying && s === `logo` && catalogOffset < totalCount) {
          scheduleNextPlay(INITIAL_DELAY);
        }
      }
    },
    ae = () => {
      if (a.matches) {
        clearAutoTimer();
        autoPlaying = !1;
        h && x(!0);
        !h && x(!1);
      } else {
        if (!userInteracting && !autoPlaying && s === `logo` && catalogOffset < totalCount) {
          scheduleNextPlay(INITIAL_DELAY);
        }
      }
    };

  (r.addEventListener(`pointerenter`, te),
    r.addEventListener(`pointerleave`, ne),
    r.addEventListener(`focusin`, re),
    r.addEventListener(`focusout`, w),
    document.addEventListener(`visibilitychange`, ie),
    a.addEventListener(`change`, ae));

  let T =
    i === null
      ? null
      : new MutationObserver(() => {
          v() || b();
        });
  i && T && T.observe(i, { attributes: !0, attributeFilter: [`inert`, `data-hidden`] });

  scheduleNextPlay(INITIAL_DELAY);

  return {
    destroy() {
      (clearAutoTimer(),
        ee(),
        T?.disconnect(),
        r.removeEventListener(`pointerenter`, te),
        r.removeEventListener(`pointerleave`, ne),
        r.removeEventListener(`focusin`, re),
        r.removeEventListener(`focusout`, w),
        document.removeEventListener(`visibilitychange`, ie),
        a.removeEventListener(`change`, ae),
        delete n.dataset.brandReady);
    },
  };
}

function gn(e = nt(), stepsList = ALL_EXPRESSIONS, isOnce = false) {
  let t = qe(`idle`).blink;
  return {
    ...e,
    sequences: {
      ...e.sequences,
      [$]: {
        id: $,
        name: `Catalog`,
        playbackMode: isOnce ? `once` : `loop`,
        steps: stepsList.map((id, idx) => ({
          id: `${$}-${idx}`,
          expressionId: id,
          holdMs: pn,
          transitionMs: mn,
          transition: `smooth`,
        })),
        blink: { enabled: !0, ...t },
      },
    },
  };
}

function _n(reduceMotion, stepsList = ALL_EXPRESSIONS, isOnce = false) {
  return xt({ mood: `expression-rest`, reduceMotion, payload: gn(undefined, stepsList, isOnce) });
}

function vn(e, t) {
  Ot(e, t);
  let n = e.querySelector(`[data-q-root="true"]`);
  n instanceof SVGGElement &&
    n.setAttribute(`transform`, `translate(0, ${t.pose.bob * -8}) scale(${Ht})`);
  let r = e.querySelector(`[data-q-id="body"]`);
  (r instanceof SVGPathElement && r.setAttribute(`fill-rule`, `nonzero`), bn(e));
}

function yn(e, t, n) {
  (e.setAttribute(`d`, t),
    e.setAttribute(`fill`, `#ffffff`),
    n ? e.removeAttribute(`display`) : e.setAttribute(`display`, `none`));
}

function bn(e) {
  e.setAttribute(`viewBox`, ye);
  e.setAttribute(`aria-hidden`, `true`);
  e.removeAttribute(`role`);
  e.removeAttribute(`aria-label`);
}

for (let e of document.querySelectorAll(`[data-brand-mark]`)) hn(e);
