// Synthesized sounds (no asset files). Audio starts only after a user gesture.
let ctx, timer, muted = false;
const ac = () => ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)());
export function tone(f, d = .15, type = 'sine', v = .12, when = 0) {
  if (muted) return;
  try { const c = ac(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime + when;
    o.type = type; o.frequency.value = f; o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); o.stop(t + d); } catch {}
}
export const sfx = {
  click: () => tone(660, .1, 'triangle'),
  pop: () => tone(880, .12, 'square', .05),
  ghost: () => { tone(420, .35, 'sine', .1); tone(300, .45, 'sine', .08, .12); },
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .45, 'triangle', .14, i * .11)),
};
export function startMusic() {
  try { ac().resume(); } catch {}
  if (timer) return; let i = 0; const m = [220, 262, 330, 262, 247, 294, 370, 294];
  timer = setInterval(() => { tone(m[i % 8], .9, 'sine', .035); if (i % 4 === 0) tone(m[i % 8] / 2, 1.5, 'triangle', .045); i++; }, 450);
}
export const setMuted = (m) => { muted = m; };
