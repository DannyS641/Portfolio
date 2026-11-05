/**
 * The hero's particle field.
 *
 * Plain DOM/canvas, deliberately kept outside React: it runs its own
 * requestAnimationFrame loop and owns its pointer listeners. The hero component
 * creates one on mount and calls `destroy()` on unmount.
 *
 * Shapes are produced by drawing text (or a path) to an offscreen canvas and
 * sampling the opaque pixels on a grid — each sample becomes one particle target.
 */

const SHAPES = ['name', 'code', 'pulse']

export function createParticleField(canvas, { lines = ['Your', 'Name'] } = {}) {
  const cx = canvas.getContext('2d')

  let W = 0
  let H = 0
  let dpr = 1
  let parts = []
  let targets = {}
  let mode = 'name'
  let running = false
  let alertAt = 0
  let rafId = 0
  let resizeTimer = 0

  const mouse = { x: -9999, y: -9999, on: false }
  const cols = {}

  // Time of the last real pointer/touch event. After IDLE_AFTER with nothing
  // happening, an invisible pointer drifts through the field so the effect is
  // visible without anyone having to discover it.
  const IDLE_AFTER = 2200
  let lastInput = 0

  function readCols() {
    const cs = getComputedStyle(document.documentElement)
    cols.sig = cs.getPropertyValue('--signal').trim() || '#2F6BFF'
    cols.ok = cs.getPropertyValue('--ok').trim() || '#1E9E5A'
    cols.warn = cs.getPropertyValue('--warn').trim() || '#E0A100'
    cols.ink = cs.getPropertyValue('--ink').trim() || '#0E1B3D'
  }

  function sample(draw, step) {
    const off = document.createElement('canvas')
    off.width = W
    off.height = H
    const c = off.getContext('2d')
    draw(c)
    const data = c.getImageData(0, 0, W, H).data
    const pts = []
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        // alpha channel: anything mostly opaque is part of the shape
        if (data[(y * W + x) * 4 + 3] > 128) {
          pts.push([x + (Math.random() - .5) * step * .6, y + (Math.random() - .5) * step * .6])
        }
      }
    }
    return pts
  }

  const font = (px) => `700 ${px}px "IBM Plex Sans Condensed", "Arial Narrow", Arial, sans-serif`

  function buildShapes() {
    const small = W < 700
    const step = small ? 5 : 6
    const cyc = H * .47
    const [top, bottom] = lines
    const longest = (top || '').length >= (bottom || '').length ? top : bottom

    targets.name = sample((c) => {
      c.font = font(100)
      // measure at 100px, then scale so the longest line fills 88% of the width
      const fit = 100 * (W * .88) / c.measureText(longest).width
      const fs = Math.min(fit, H * .27)
      c.fillStyle = '#000'
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.font = font(fs)
      c.fillText(top, W / 2, cyc - fs * .5)
      c.fillText(bottom, W / 2, cyc + fs * .48)
    }, step)

    targets.code = sample((c) => {
      const fs = Math.min(W * (small ? .5 : .36), H * .55)
      c.fillStyle = '#000'
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.font = font(fs)
      c.fillText('</>', W / 2, cyc)
    }, step)

    targets.pulse = sample((c) => {
      const y = cyc
      const w = W * (small ? .9 : .78)
      const x0 = (W - w) / 2
      const amp = Math.min(H, W * .7)
      c.strokeStyle = '#000'
      c.lineWidth = Math.max(10, amp * .03)
      c.lineJoin = 'round'
      c.lineCap = 'round'
      c.beginPath()
      c.moveTo(x0, y)
      const seg = [
        [.28, 0], [.33, -.05], [.37, .06], [.42, -.32], [.47, .3], [.52, -.08],
        [.56, 0], [.72, 0], [.75, -.04], [.78, .04], [.81, 0], [1, 0],
      ]
      seg.forEach((s) => c.lineTo(x0 + w * s[0], y + amp * s[1]))
      c.stroke()
      c.beginPath()
      c.arc(x0 + w, y, Math.max(10, H * .025), 0, Math.PI * 2)
      c.fillStyle = '#000'
      c.fill()
    }, step - 1)
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = canvas.clientWidth
    H = canvas.clientHeight
    if (!W || !H) return
    canvas.width = W * dpr
    canvas.height = H * dpr
    cx.setTransform(dpr, 0, 0, dpr, 0, 0)
    buildShapes()

    // Enough particles to fill the busiest shape, or the outlines come out
    // patchy — a long name samples to far more points than a short one.
    const small = W < 700
    const needed = Math.max(targets.name.length, targets.code.length, targets.pulse.length)
    const N = Math.min(Math.max(small ? 1100 : 2400, needed), small ? 2200 : 6000)

    while (parts.length < N) {
      parts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
        s: Math.random() < .15 ? 2.6 : 1.8,
        c: Math.random() < .12 ? 'ok' : 'sig',
        a: 0, // timestamp until which this particle is drawn as "alerting"
      })
    }
    parts.length = N
    assign(mode, false)
  }

  function assign(next, kick) {
    mode = next
    const pts = targets[next]
    if (!pts || !pts.length) return
    for (let i = 0; i < parts.length; i++) {
      // stride by a prime so neighbouring particles don't land on neighbouring points
      const q = pts[(i * 7919) % pts.length]
      parts[i].tx = q[0]
      parts[i].ty = q[1]
      if (kick) {
        parts[i].vx += (Math.random() - .5) * 18
        parts[i].vy += (Math.random() - .5) * 18
      }
    }
  }

  function burst(x, y, power) {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      const dx = p.x - x
      const dy = p.y - y
      const d = Math.sqrt(dx * dx + dy * dy) + 1
      const f = power * Math.max(0, 1 - d / (Math.max(W, H) * .6))
      p.vx += dx / d * f * (.6 + Math.random())
      p.vy += dy / d * f * (.6 + Math.random())
    }
  }

  function frame(t) {
    if (!running) return
    cx.clearRect(0, 0, W, H)

    // every few seconds a random patch flickers amber, like a cluster going unhealthy
    if (t > alertAt) {
      alertAt = t + 3200 + Math.random() * 2500
      const k = Math.floor(Math.random() * parts.length)
      const kx = parts[k].tx
      const ky = parts[k].ty
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        if (Math.abs(p.tx - kx) < 36 && Math.abs(p.ty - ky) < 36) p.a = t + 1400
      }
    }

    const R = W < 700 ? 70 : 120

    // Either the real pointer, or the drifting one when nobody is interacting.
    let px = mouse.x
    let py = mouse.y
    let repelling = mouse.on
    if (!repelling && t - lastInput > IDLE_AFTER) {
      px = W * (.5 + .34 * Math.sin(t / 2600))
      py = H * (.47 + .24 * Math.sin(t / 1700 + 1.1))
      repelling = true
    }

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      let ax = (p.tx - p.x) * .055
      let ay = (p.ty - p.y) * .055

      if (repelling) {
        const dx = p.x - px
        const dy = p.y - py
        const d2 = dx * dx + dy * dy
        if (d2 < R * R) {
          const d = Math.sqrt(d2) + .01
          const f = (1 - d / R) * 7
          ax += dx / d * f
          ay += dy / d * f
        }
      }

      p.vx = (p.vx + ax) * .84
      p.vy = (p.vy + ay) * .84
      p.x += p.vx
      p.y += p.vy

      const sp = Math.abs(p.vx) + Math.abs(p.vy)
      cx.fillStyle = p.a > t ? cols.warn : (sp > 6 ? cols.ink : cols[p.c])
      const z = p.s + (sp > 4 ? Math.min(2, sp * .08) : 0)
      cx.fillRect(p.x - z / 2, p.y - z / 2, z, z)
    }

    rafId = requestAnimationFrame(frame)
  }

  function start() {
    if (running) return
    running = true
    rafId = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  /** Snap every particle onto its target and paint once — the reduced-motion view. */
  function drawStatic() {
    readCols()
    cx.clearRect(0, 0, W, H)
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      p.x = p.tx
      p.y = p.ty
      cx.fillStyle = cols[p.c]
      cx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s)
    }
  }

  function scatter() {
    for (let i = 0; i < parts.length; i++) {
      parts[i].x = Math.random() * W
      parts[i].y = Math.random() * H * 1.2 - H * .1
    }
  }

  function track(clientX, clientY) {
    const r = canvas.getBoundingClientRect()
    mouse.x = clientX - r.left
    mouse.y = clientY - r.top
    mouse.on = true
    lastInput = performance.now()
  }

  const onPointerMove = (e) => track(e.clientX, e.clientY)
  const onPointerLeave = () => { mouse.on = false; lastInput = performance.now() }
  const onPointerDown = (e) => {
    const r = canvas.getBoundingClientRect()
    burst(e.clientX - r.left, e.clientY - r.top, W < 700 ? 40 : 60)
    lastInput = performance.now()
  }

  // Touch needs its own listeners: once a drag turns into a page scroll the
  // browser fires pointercancel and the pointer stream stops, so on a phone the
  // field would freeze the moment you actually moved. touchmove keeps coming,
  // and passive:true means we never hold up the scroll.
  const onTouchMove = (e) => {
    const touch = e.touches[0]
    if (touch) track(touch.clientX, touch.clientY)
  }
  const onTouchStart = (e) => {
    const touch = e.touches[0]
    if (touch) track(touch.clientX, touch.clientY)
  }
  const onTouchEnd = () => { mouse.on = false; lastInput = performance.now() }
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      size()
      if (!running) drawStatic()
    }, 180)
  }

  const scheme = window.matchMedia('(prefers-color-scheme: dark)')

  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('touchstart', onTouchStart, { passive: true })
  canvas.addEventListener('touchmove', onTouchMove, { passive: true })
  canvas.addEventListener('touchend', onTouchEnd, { passive: true })
  canvas.addEventListener('touchcancel', onTouchEnd, { passive: true })
  window.addEventListener('resize', onResize)
  scheme.addEventListener('change', readCols)

  readCols()
  size()

  return {
    shapes: SHAPES,
    assign,
    burst,
    start,
    stop,
    scatter,
    drawStatic,
    center: () => [W / 2, H * .47],
    destroy() {
      stop()
      clearTimeout(resizeTimer)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('resize', onResize)
      scheme.removeEventListener('change', readCols)
      parts = []
      targets = {}
    },
  }
}
