(() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const elPreview = $("#preview");
  const elTitle = document.querySelector(".header h1");
  const elSub = document.querySelector(".header .sub");

  // 固定テキスト（ここを書き換えてください）
  const YUME_TEXT = `かわいいものがすきで

はーとにショットガン撃たれたくらいショックをうけてしまって、ああ、

でもいっぽうで　とってもつらいのでさよならしてほしい、

すきすぎでわ？　でもほかのひともそうなのかも
かれぴつくってといっておきながらひどいむじゅん

プレゼントもーだるでえらべます、

じつはとーてもたのしみだったのだけど
パソコンつくるのすしだし　喜んでもらえたらいいなって

いっそ嫌いと言われれば　クッソーなんだったんだーと思うかもだけど、この妄想は終わるんだと思います

幸せになったのに不幸なフリずっとされるとか　くらいかなぁ

友達になれるくらいの人で2人きりで苦手なお酒飲んでもいいくらいってもうけっこー好きじゃん！
きゃー！

自己矛盾におちいっています。うそぶいている

好きです付き合ってといえる自信がないだけなんですね本当は　実際全く器ではないのでそれでいんだけど　

それって、好きってことじゃん！`;
  const VAPOR_TEXT = `ネオンの海で、うかぶ心。

グリッドの地平線に、ゆっくり流れる告白。
夜風はピンクとシアンを混ぜて、あなたの名前を照らす。

ぼくはまだ上手に言えないけど、
この光が消えないうちに、好きって言う。`;

  const YUME_TITLE = "Love Letter";
  const YUME_SUB = "iをこわしてね";
  const VAPOR_TITLE = "A letter with hidden feelings";
  const VAPOR_SUB = "iをつかまえてね";

  let TEXT = YUME_TEXT;
  // 表現モード: 'outline'（フォント輪郭描画） / 'stroke'（テンプレ字画） / 'svg'（リビール） / 'type'
  const MODE = "svg";
  // スピード倍率（UI削除に伴い固定値）
  let SPEED = 0.5;
  const elBgFile = document.getElementById("bgImage");
  const elBgOpacity = document.getElementById("bgOpacity");
  const elBgClear = document.getElementById("bgClear");
  const elBgLayer = document.getElementById("bg-img-layer");
  const elHearts = document.getElementById("hearts");
  // テーマカラー（ゆめかわピンク）
  const COLOR = "#ff66b3";
  // アウトライン用フォントファイル候補（存在するものを順に使用）
  const OUTLINE_FONT_CANDIDATES = [
    // "assets/fonts/YuseiMagic-Regular.ttf",
    "assets/fonts/Yomogi-Regular.ttf",
    "assets/fonts/Yomogi.woff2",
  ];
  // Stroke templates toggle (disable to ensure readability)
  const USE_TEMPLATES = false;

  // Update theme color
  const setColor = (hex) => {
    document.documentElement.style.setProperty("--pink", hex);
    const deep = tint(hex, -0.12);
    document.documentElement.style.setProperty("--pink-deep", deep);
  };
  setColor(COLOR);

  // Theme: programmatic switch (default to yume on load)
  const setTheme = (name) => {
    document.body.classList.remove("theme-vapor", "theme-yume");
    const cls = name === "yume" ? "theme-yume" : "theme-vapor";
    document.body.classList.add(cls);
    // apply theme-specific content
    if (name === "yume") {
      TEXT = YUME_TEXT;
      if (elTitle) elTitle.textContent = YUME_TITLE;
      if (elSub) elSub.textContent = YUME_SUB;
    } else {
      TEXT = VAPOR_TEXT;
      if (elTitle) elTitle.textContent = VAPOR_TITLE;
      if (elSub) elSub.textContent = VAPOR_SUB;
    }
  };
  setTheme("yume");

  // 再生ディスパッチ
  function playNow() {
    clearPreview();
    if (MODE === "type") playTypewriter(TEXT, SPEED);
    else if (MODE === "stroke") playStrokeWrite(TEXT, SPEED, COLOR);
    else if (MODE === "outline") playOutlineWrite(TEXT, SPEED, COLOR);
    else playSvgWrite(TEXT, SPEED, COLOR);
  }

  // Win2k caption buttons behavior
  (function initWindowButtons() {
    const card = document.querySelector("main.card");
    const bodyPanel = document.querySelector(".win2k-body");
    const tb = document.querySelector(".win2k-window .titlebar");
    if (!card || !tb) return;
    const minBtn = tb.querySelector(".caption-buttons .min");
    const maxBtn = tb.querySelector(".caption-buttons .max");
    const closeBtn = tb.querySelector(".caption-buttons .close");
    minBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const nowMin = card.classList.toggle("minimized");
      if (nowMin) {
        bodyPanel?.classList.add("collapsed");
        card.classList.remove("maximized");
      } else {
        bodyPanel?.classList.remove("collapsed");
      }
    });
    maxBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      card.classList.toggle("maximized");
      if (card.classList.contains("maximized")) {
        card.classList.remove("minimized");
        bodyPanel?.classList.remove("collapsed");
      }
    });
    closeBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      // Hide the entire window; no restore
      card.style.display = "none";
    });
  })();

  // (drag-to-move removed by request)

  // 初回自動再生（PUSH START の一時表示は廃止）
  requestAnimationFrame(() => {
    playNow();
  });
  // リプレイ/スピードのUI・イベントは削除

  // Yume heart click -> transition to vapor theme
  const yumeHeartCore = document.querySelector("#yume-heart .core");
  const themeFx = document.getElementById("theme-fx");
  if (yumeHeartCore) {
    let breaking = false;
    yumeHeartCore.addEventListener("click", () => {
      if (breaking) return;
      breaking = true;
      // start transition overlay
      document.body.classList.add("theme-switching");
      // add breaking class to animate the heart pieces
      yumeHeartCore.classList.add('breaking');
      // add a temporary crack overlay inside the heart
      const crack = document.createElement('div');
      crack.className = 'crack';
      // simple SVG crack graphic inline
      const crackSvg = encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
          "<path d='M42 22 L52 36 L46 44 L58 56 L50 70 L62 82' stroke='rgba(255,255,255,0.9)' stroke-width='3' fill='none'/>" +
        "</svg>"
      );
      crack.style.backgroundImage = `url("data:image/svg+xml;utf8,${crackSvg}")`;
      yumeHeartCore.appendChild(crack);

      // after the break animation, switch theme
      setTimeout(() => {
        setTheme("vapor");
        // clean up
        crack.remove();
        yumeHeartCore.classList.remove('breaking');
        // remove switching after fade completes
        setTimeout(() => document.body.classList.remove("theme-switching"), 600);
        // replay with new content
        playNow();
        // allow future clicks when returning to yume mode
        breaking = false;
      }, 720);
    });

    // Make heart wander across the screen while in yume theme
    const wander = () => {
      if (!document.body.classList.contains("theme-yume")) return; // stop after switch
      const marginVh = 18; // vertical safe margins
      const topVh = Math.round(marginVh + Math.random() * (70 - marginVh));
      const leftVw = Math.round(15 + Math.random() * 70); // keep inside horizontally
      yumeHeartCore.style.top = topVh + "vh";
      yumeHeartCore.style.left = leftVw + "vw";
    };
    // Seed and then move periodically
    setTimeout(wander, 400);
    const wanderId = setInterval(wander, 2400);
    // Clear interval on theme switch
    document.addEventListener("transitionend", () => {
      if (!document.body.classList.contains("theme-yume"))
        clearInterval(wanderId);
    });
  }

  // 背景画像: ローカルファイル → dataURL で安全に適用
  if (elBgFile && elBgLayer) {
    elBgFile.addEventListener("change", () => {
      const file = elBgFile.files && elBgFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        elBgLayer.style.backgroundImage = `url(${dataUrl})`;
      };
      reader.readAsDataURL(file);
    });
  }
  if (elBgOpacity) {
    const setOpacity = () =>
      document.documentElement.style.setProperty(
        "--bgimg-opacity",
        String(parseFloat(elBgOpacity.value))
      );
    elBgOpacity.addEventListener("input", setOpacity);
    setOpacity();
  }
  if (elBgClear && elBgLayer) {
    elBgClear.addEventListener("click", () => {
      elBgLayer.style.backgroundImage = "";
      if (elBgOpacity) {
        elBgOpacity.value = "0.0";
        document.documentElement.style.setProperty("--bgimg-opacity", "0");
      }
      if (elBgFile) elBgFile.value = "";
    });
  }

  // Spawn cute floating hearts (lightweight)
  if (elHearts) {
    const colors = [
      getComputedStyle(document.documentElement)
        .getPropertyValue("--pink")
        .trim() || "#ff66b3",
      "#b19eff",
      "#38e8dd",
    ];
    const occultGlyphs = [
      "✦",
      "✧",
      "✶",
      "✷",
      "✺",
      "✹",
      "☽",
      "☾",
      "☉",
      "☥",
      "✡",
      "⌘",
    ]; // safe mystical set
    const spawn = () => {
      const inVapor = document.body.classList.contains("theme-vapor");
      const node = document.createElement("div");
      if (inVapor) {
        node.className = "occult";
        const fs = Math.round(14 + Math.random() * 22);
        const left = Math.round(Math.random() * 100);
        const dur = (12 + Math.random() * 12) / Math.max(0.2, SPEED);
        const col = colors[Math.floor(Math.random() * colors.length)];
        node.textContent =
          occultGlyphs[Math.floor(Math.random() * occultGlyphs.length)];
        node.style.fontSize = fs + "px";
        node.style.left = left + "vw";
        node.style.top = 100 + Math.random() * 20 + "vh";
        node.style.setProperty("--t", dur + "s");
        node.style.setProperty("--occ", col);
        node.style.setProperty(
          "--r",
          (Math.random() * 30 - 15).toFixed(1) + "deg"
        );
      } else {
        node.className = "heart";
        const size = Math.round(10 + Math.random() * 18);
        const left = Math.round(Math.random() * 100);
        const dur = (10 + Math.random() * 10) / Math.max(0.2, SPEED);
        const col = colors[Math.floor(Math.random() * colors.length)];
        node.style.setProperty("--s", size + "px");
        node.style.left = left + "vw";
        node.style.top = 100 + Math.random() * 20 + "vh";
        node.style.setProperty("--t", dur + "s");
        node.style.background = col;
      }
      elHearts.appendChild(node);
      node.addEventListener("animationend", () => node.remove());
    };
    // Seed a few
    for (let i = 0; i < 14; i++) setTimeout(spawn, i * 200);
    // Continuous spawn
    setInterval(spawn, 600);
  }

  // Wander the heart glint inside the triangle
  const elThirdEye = document.getElementById("third-eye");
  if (elThirdEye) {
    const glint = elThirdEye.querySelector(".heart-glint");
    if (glint) {
      const A = { x: 50, y: 0 },
        B = { x: 0, y: 100 },
        C = { x: 100, y: 100 };
      const randBarycentricPoint = () => {
        let u = Math.random(),
          v = Math.random();
        if (u + v > 1) {
          u = 1 - u;
          v = 1 - v;
        }
        const x = A.x * (1 - u - v) + B.x * u + C.x * v;
        const y = A.y * (1 - u - v) + B.y * u + C.y * v;
        return {
          x: Math.max(8, Math.min(92, x)),
          y: Math.max(18, Math.min(90, y)),
        };
      };
      const move = () => {
        const p = randBarycentricPoint();
        glint.style.left = p.x + "%";
        glint.style.top = p.y + "%";
      };
      setInterval(move, 2600);
      // Clicking moving heart in vapor → switch back to yume
      glint.addEventListener("click", (e) => {
        e.preventDefault();
        if (document.body.classList.contains("theme-vapor")) {
          setTheme("yume");
          playNow();
        }
      });
    }

    // Move the SVG pupil to chase the heart-glint inside the triangle
    const pupil = elThirdEye.querySelector(".eye-pupil");
    if (pupil) {
      let rafId;
      const centerX = 50;
      const minX = 44; // keep comfortably inside outline (cx range)
      const maxX = 56;
      const centerY = 47;
      const minY = 43;
      const maxY = 51;
      const easeInOut = (t) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const animateTo = (from, to, durMs, attr = "cx") => {
        const start = performance.now();
        const end = start + durMs;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / durMs);
          const e = easeInOut(t);
          const x = from + (to - from) * e;
          pupil.setAttribute(attr, x.toFixed(2));
          if (now < end) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      };

      const chase = () => {
        if (!glint) return;
        // glint left/top are percentages in the same 0..100 space as the SVG viewBox
        const lx = parseFloat(glint.style.left) || 50; // 0..100
        const ly = parseFloat(glint.style.top) || 50;
        // map to limited pupil range around center with compression
        const targetCx = Math.max(
          minX,
          Math.min(maxX, centerX + (lx - 50) * (6 / 50))
        );
        const targetCy = Math.max(
          minY,
          Math.min(maxY, centerY + (ly - 50) * (5 / 50))
        );

        const curCx = parseFloat(pupil.getAttribute("cx")) || centerX;
        const curCy = parseFloat(pupil.getAttribute("cy")) || centerY;
        const dist = Math.hypot(targetCx - curCx, targetCy - curCy);
        const baseDur = 800; // ms for unit step
        const dur = (baseDur + dist * 40) / Math.max(0.2, SPEED);
        animateTo(curCx, targetCx, dur * 0.9, "cx");
        animateTo(curCy, targetCy, dur, "cy");
      };

      // chase periodically; also on glint moves (same timer cadence)
      setInterval(chase, 300);
      setTimeout(chase, 200);
    }
  }

  function clearPreview() {
    elPreview.innerHTML = "";
  }

  // Typing mode: per-character reveal with slight wobble
  function playTypewriter(text, speedMul) {
    const lines = text.split("\n");
    let t = 0;
    const base = 55; // ms per char base

    lines.forEach((line, li) => {
      const lineEl = document.createElement("div");
      lineEl.className = "typing-line";
      elPreview.appendChild(lineEl);

      const caret = document.createElement("span");
      caret.className = "caret";
      lineEl.appendChild(caret);

      [...line].forEach((ch, i) => {
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = ch;
        span.style.setProperty(
          "--rot",
          `${(Math.random() * 2 - 1.2).toFixed(2)}deg`
        );
        lineEl.insertBefore(span, caret);

        const jitter = Math.random() * 60;
        t += (base + jitter) / speedMul;
        setTimeout(() => {
          span.classList.add("show");
        }, t);
      });

      // Move caret to next line after finishing
      t += 200 / speedMul;
      setTimeout(() => {
        caret.remove();
        if (li < lines.length - 1) {
          const br = document.createElement("div");
          br.style.height = "8px";
          elPreview.appendChild(br);
        }
      }, t);
    });
  }

  // SVG handwriting-like reveal using a moving mask per line
  function playSvgWrite(text, speedMul, color) {
    const lines = text.split("\n");
    const wrap = document.createElement("div");
    wrap.className = "svg-wrap";
    const svg = createSvg();
    wrap.appendChild(svg);
    elPreview.appendChild(wrap);

    const padX = 18;
    const padY = 32;
    const vw = Math.max(320, elPreview.clientWidth - padX * 2);
    const fontSize = Math.max(22, Math.min(36, vw / 15));
    const lineGap = Math.round(fontSize * 1.5);

    const totalHeight =
      padY * 2 + lineGap * (lines.length - 1) + Math.ceil(fontSize * 2);
    svg.setAttribute("viewBox", `0 0 ${vw + padX * 2} ${totalHeight}`);
    svg.setAttribute("width", String(vw + padX * 2));

    // Prepare filters for slightly fluffy brush edge
    const defs = el("defs");
    const flt = el("filter", {
      id: "edge",
      x: "-2%",
      y: "-2%",
      width: "104%",
      height: "104%",
    });
    flt.appendChild(
      el("feTurbulence", {
        type: "fractalNoise",
        baseFrequency: "0.9",
        numOctaves: "1",
        seed: "3",
        result: "noise",
      })
    );
    flt.appendChild(
      el("feDisplacementMap", {
        in: "SourceGraphic",
        in2: "noise",
        scale: "1.2",
        xChannelSelector: "R",
        yChannelSelector: "G",
      })
    );
    defs.appendChild(flt);
    svg.appendChild(defs);

    let totalDelay = 0; // ms
    const perChar = 80; // ms per char baseline

    const inVapor = document.body.classList.contains('theme-vapor');
    const strokeColor = inVapor ? '#ffb3e1' : color; // neon-like outline for vapor

    lines.forEach((line, i) => {
      const y = padY + lineGap * (i + 1);

      // line group and mask
      const maskId = `reveal${i}`;
      const mask = el("mask", {
        id: maskId,
        maskUnits: "userSpaceOnUse",
        maskContentUnits: "userSpaceOnUse",
      });
      const maskRect = el("rect", {
        x: String(padX),
        y: String(Math.round(y - fontSize * 1.25)),
        width: "0",
        height: String(Math.round(fontSize * 2.6)),
        fill: "#fff",
      });
      mask.appendChild(maskRect);
      defs.appendChild(mask);

      const g = el("g", { mask: `url(#${maskId})` });
      const textEl = el("text", {
        x: String(padX),
        y: String(y),
        style: `font-size:${fontSize}px; font-family: inherit;`,
      });
      textEl.textContent = line || " ";
      // Two layers: stroke (pen outline) and fill (ink)
      const textStroke = textEl.cloneNode(true);
      textStroke.setAttribute('class', 'pen-stroke');
      g.appendChild(textStroke);
      const textFill = textEl.cloneNode(true);
      textFill.setAttribute('class', 'pen-fill');
      if (inVapor) {
        // Glows behind core
        const makeGlow = (w, col, opacity) => {
          const gl = textEl.cloneNode(true);
          gl.setAttribute('fill', 'none');
          gl.setAttribute('stroke', col);
          gl.setAttribute('stroke-opacity', String(opacity));
          gl.setAttribute('stroke-width', String(w));
          gl.setAttribute('stroke-linecap', 'round');
          gl.setAttribute('stroke-linejoin', 'round');
          return gl;
        };
        const glowPink = makeGlow(8, 'rgba(255, 102, 179, 0.40)', 1);
        const glowCyan = makeGlow(4, 'rgba(56, 232, 221, 0.35)', 1);
        g.insertBefore(glowPink, textStroke);
        g.insertBefore(glowCyan, textStroke);

        // Per-line diagonal gradient fill beneath stroke
        const gradId = `vaporFillGrad${i}`;
        const grad = el('linearGradient', { id: gradId, x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
        grad.appendChild(el('stop', { offset: '0%',  'stop-color': '#ff66b3' }));
        grad.appendChild(el('stop', { offset: '50%', 'stop-color': '#b19eff' }));
        grad.appendChild(el('stop', { offset: '100%','stop-color': '#38e8dd' }));
        defs.appendChild(grad);
        textFill.style.fill = `url(#${gradId})`;
        textFill.style.fillOpacity = '1';
        // place fill just beneath stroke (above glows)
        g.insertBefore(textFill, textStroke);
        // vivid core stroke
        textStroke.setAttribute('stroke', '#ff66b3');
        textStroke.setAttribute('stroke-width', '3.2');
      } else {
        // yume: cute solid fill, will fade near reveal end
        textFill.style.fill = color;
        g.appendChild(textFill);
      }
      svg.appendChild(g);

      // Measure text width to know reveal distance
      // Need it in DOM first
      const measureWidth = () => textStroke.getBBox().width || 1;
      // compute duration by characters or width
      const charCount = Math.max(3, line.length);
      const dur = (charCount * perChar) / speedMul; // ms

      // Animate mask rect width over time
      animateRectWidth(maskRect, () => measureWidth() + 8, dur, totalDelay);

      // After reveal, fade in fill slightly for ink look
      if (textFill) {
        setTimeout(() => {
          textFill.style.fillOpacity = "1.0";
        }, totalDelay + dur - 120);
      }

      totalDelay += dur + 280 / speedMul; // little pause between lines
    });

    // set stroke color (used by pen-stroke CSS var)
    svg.style.setProperty('--pink', strokeColor);
  }

  // Outline-based handwriting using opentype.js (graceful fallback)
  function playOutlineWrite(text, speedMul, color) {
    if (!window.opentype) {
      console.warn("opentype.js not found. Falling back to SVG reveal.");
      return playSvgWrite(text, speedMul, color);
    }
    const lines = text.split("\n");
    const wrap = document.createElement("div");
    wrap.className = "svg-wrap";
    const svg = createSvg();
    wrap.appendChild(svg);
    elPreview.appendChild(wrap);

    const padX = 18;
    const padY = 28;
    const vw = Math.max(320, elPreview.clientWidth - padX * 2);
    const fontSize = Math.max(22, Math.min(36, vw / 15));
    const lineGap = Math.round(fontSize * 1.8);
    const totalHeight =
      padY * 2 + lineGap * (lines.length - 1) + Math.ceil(fontSize * 2);
    svg.setAttribute("viewBox", `0 0 ${vw + padX * 2} ${totalHeight}`);
    svg.setAttribute("width", String(vw + padX * 2));
    svg.style.setProperty("--pink", color);

    const defs = el("defs");
    svg.appendChild(defs);

    const penWidth = Math.max(2, fontSize * 0.085);
    const speedBase = 0.55; // lower -> faster

    const tryLoad = (urls, onOk, onFail) => {
      if (!urls.length) return onFail(new Error("No font URL available"));
      const url = urls[0];
      window.opentype.load(url, (err, font) => {
        if (err || !font) {
          console.warn("Font load failed for", url, err);
          return tryLoad(urls.slice(1), onOk, onFail);
        }
        onOk(font);
      });
    };

    tryLoad(
      OUTLINE_FONT_CANDIDATES,
      (font) => {
        let delay = 0;
        const scale = fontSize / font.unitsPerEm;

        for (let li = 0; li < lines.length; li++) {
          const line = lines[li];
          const yBase = padY + Math.round(fontSize * 0.9) + lineGap * li;
          let x = padX;

          for (const ch of line) {
            const glyph = font.charToGlyph(ch);
            const adv = (glyph.advanceWidth || font.unitsPerEm * 0.5) * scale;
            const path = glyph.getPath(x, yBase, fontSize);
            const d = pathToD(path);

            if (d && d.length > 0) {
              const p = el("path", { d, class: "outline-path" });
              p.setAttribute("stroke-width", String(penWidth));
              p.setAttribute("fill", "none");
              svg.appendChild(p);

              const len = safePathLength(p);
              p.style.strokeDasharray = String(len);
              p.style.strokeDashoffset = String(len);
              const dur = Math.max(200, (len * speedBase) / speedMul);
              animateDash(p, len, dur, delay);
              delay += dur * 0.92; // slight overlap
            }
            x += adv;
          }
        }
      },
      (err) => {
        console.warn("All font loads failed:", err);
        playSvgWrite(text, speedMul, color);
      }
    );
  }

  function pathToD(path) {
    // Convert opentype.js Path commands to SVG d string
    const cmds = path && path.commands ? path.commands : [];
    let d = "";
    for (const c of cmds) {
      if (c.type === "M") d += `M ${c.x} ${c.y}`;
      else if (c.type === "L") d += ` L ${c.x} ${c.y}`;
      else if (c.type === "C")
        d += ` C ${c.x1} ${c.y1} ${c.x2} ${c.y2} ${c.x} ${c.y}`;
      else if (c.type === "Q") d += ` Q ${c.x1} ${c.y1} ${c.x} ${c.y}`;
      else if (c.type === "Z") d += " Z";
    }
    return d;
  }

  function safePathLength(p) {
    try {
      return p.getTotalLength();
    } catch {
      return 200;
    }
  }

  // Stroke-by-stroke renderer (hiragana templates) with per-char fallback
  async function playStrokeWrite(text, speedMul, color) {
    // Wait for fonts to settle (for fallbacks measuring)
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {}
    }

    const lines = text.split("\n");
    const wrap = document.createElement("div");
    wrap.className = "svg-wrap";
    const svg = createSvg();
    wrap.appendChild(svg);
    elPreview.appendChild(wrap);

    const padX = 18;
    const padY = 28;
    const vw = Math.max(320, elPreview.clientWidth - padX * 2);
    const fontSize = Math.max(22, Math.min(36, vw / 15));
    const lineGap = Math.round(fontSize * 1.8);
    const totalHeight =
      padY * 2 + lineGap * (lines.length - 1) + Math.ceil(fontSize * 2);
    svg.setAttribute("viewBox", `0 0 ${vw + padX * 2} ${totalHeight}`);
    svg.setAttribute("width", String(vw + padX * 2));

    const defs = el("defs");
    const flt = el("filter", {
      id: "edge",
      x: "-3%",
      y: "-3%",
      width: "106%",
      height: "106%",
    });
    flt.appendChild(
      el("feTurbulence", {
        type: "fractalNoise",
        baseFrequency: "1.0",
        numOctaves: "1",
        seed: "7",
        result: "noise",
      })
    );
    flt.appendChild(
      el("feDisplacementMap", {
        in: "SourceGraphic",
        in2: "noise",
        scale: "1.2",
      })
    );
    defs.appendChild(flt);
    svg.appendChild(defs);

    const penWidth = Math.max(2, fontSize * 0.1);
    svg.style.setProperty("--pink", color);

    let delay = 0;
    const perUnit = 12; // ms per unit length baseline

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      const yBase = padY + Math.round(fontSize * 0.9) + lineGap * li;
      let x = padX;

      for (let idx = 0; idx < line.length; idx++) {
        const ch = line[idx];
        let tpl = null;
        let hasDakuten = false;
        let hasHandakuten = false;
        if (USE_TEMPLATES && typeof getKanaTemplate === "function") {
          tpl = getKanaTemplate(ch);
          if (!tpl && ch.normalize) {
            const nfd = ch.normalize("NFD");
            if (nfd.length > 1) {
              const base = nfd[0];
              tpl = getKanaTemplate(base);
              hasDakuten = nfd.includes("\u3099");
              hasHandakuten = nfd.includes("\u309A");
            }
          }
        }
        if (tpl) {
          const scale = fontSize / 100;
          const g = el("g", {
            transform: `translate(${x}, ${yBase - 80 * scale})`,
          }); // align 100-box baseline (~y=80)
          let charLength = 0;
          tpl.strokes.forEach((pts) => {
            const d = pathFromPoints(
              pts.map(([px, py]) => [px * scale, py * scale])
            );
            const p = el("path", { d, class: "stroke-path" });
            p.setAttribute("stroke-width", String(penWidth));
            g.appendChild(p);
          });
          // Dakuten / Handakuten marks placed near top-right of glyph box
          if (hasDakuten || hasHandakuten) {
            const adv = (tpl.advance || 80) * scale;
            const ox = Math.max(12 * scale, adv - 28 * scale);
            const oy = 18 * scale;
            if (hasDakuten) {
              const d1 = pathFromPoints([
                [ox, oy],
                [ox + 8 * scale, oy - 4 * scale],
              ]);
              const d2 = pathFromPoints([
                [ox + 14 * scale, oy],
                [ox + 22 * scale, oy - 4 * scale],
              ]);
              [d1, d2].forEach((d) => {
                const p = el("path", { d, class: "stroke-path" });
                p.setAttribute("stroke-width", String(penWidth));
                g.appendChild(p);
              });
            }
            if (hasHandakuten) {
              const c = el("circle", {
                cx: String(ox + 16 * scale),
                cy: String(oy - 2 * scale),
                r: String(6 * scale),
              });
              c.setAttribute("fill", "none");
              c.setAttribute("class", "stroke-path");
              c.setAttribute("stroke-width", String(penWidth));
              g.appendChild(c);
            }
          }
          svg.appendChild(g);
          // animate each stroke sequentially
          const strokes = Array.from(g.querySelectorAll("path"));
          strokes.forEach((p) => {
            const len = p.getTotalLength();
            charLength += len;
            p.style.strokeDasharray = String(len);
            p.style.strokeDashoffset = String(len);
          });
          let tAccum = delay;
          strokes.forEach((p) => {
            const len = p.getTotalLength();
            const dur = Math.max(150, (len * perUnit) / speedMul);
            animateDash(p, len, dur, tAccum);
            tAccum += dur * 0.9; // slight overlap for organic feel
          });
          delay = tAccum + 40 / speedMul;
          const adv = (tpl.advance || 80) * scale;
          x += adv;
        } else {
          // Fallback: draw single-character text with its own reveal mask
          const maskId = `mk_ch_${li}_${idx}`;
          const mask = el("mask", {
            id: maskId,
            maskUnits: "userSpaceOnUse",
            maskContentUnits: "userSpaceOnUse",
          });
          const maskRect = el("rect", {
            x: String(x),
            y: String(yBase - fontSize * 1.2),
            width: "0",
            height: String(fontSize * 2.4),
            fill: "#fff",
          });
          mask.appendChild(maskRect);
          defs.appendChild(mask);

          const t = el("text", {
            x: String(x),
            y: String(yBase),
            style: `font-size:${fontSize}px; font-family: inherit; fill:${color}; stroke:${color}; stroke-width:${(
              penWidth * 0.9
            ).toFixed(2)}; paint-order: stroke fill;`,
            mask: `url(#${maskId})`,
          });
          t.textContent = ch;
          svg.appendChild(t);

          // Measure width and animate
          const getW = () => t.getBBox().width || 0;
          let w = getW();
          if (!w || /\s/.test(ch) || ch === "\u3000") {
            w = fontSize; // whitespace fallback width (~1em)
          }
          const dur = Math.max(200, (w * 35) / speedMul);
          animateRectWidth(maskRect, () => getW() + 6, dur, delay);
          delay += dur * 0.95;
          x += Math.max(w, fontSize * 0.5);
        }
      }
    }
  }

  function pathFromPoints(points) {
    if (!points.length) return "";
    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
    }
    return d;
  }

  function animateDash(path, length, duration, delay) {
    const start = performance.now() + delay;
    const end = start + duration;
    const step = (now) => {
      if (now < start) return requestAnimationFrame(step);
      const t = Math.min(1, (now - start) / duration);
      const ease = cubicOut(t);
      path.style.strokeDashoffset = String(length * (1 - ease));
      if (now < end) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function createSvg() {
    return elNS("svg", { xmlns: "http://www.w3.org/2000/svg" });
  }

  function el(tag, attrs = {}) {
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  const SVG_NS = "http://www.w3.org/2000/svg";
  function elNS(tag, attrs = {}) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function animateRectWidth(rect, measure, duration, delay) {
    const startTime = performance.now() + delay;
    const endTime = startTime + duration;
    const maxWidth = () => Math.ceil(measure());
    let rafId;

    const tick = (now) => {
      if (now < startTime) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const wMax = maxWidth();
      const t = Math.min(1, (now - startTime) / duration);
      const ease = cubicOut(t);
      rect.setAttribute("width", String(wMax * ease));
      if (now < endTime) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }

  function cubicOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Color helper: simple tint/shade
  function tint(hex, amt) {
    const [r, g, b] = hexToRgb(hex || "#ff66b3");
    const mix = (c) => Math.round(c + (amt < 0 ? c : 255 - c) * amt);
    return rgbToHex(mix(r), mix(g), mix(b));
  }
  function hexToRgb(hex) {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
    if (!m) return [255, 102, 179];
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
})();
