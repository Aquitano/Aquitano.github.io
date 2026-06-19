import { useEffect, useRef, useState } from 'react';

type Block = {
    label: string;
    top: number;
    height: number;
    el: HTMLElement;
};

type Bar = {
    x: number;
    y: number;
    w: number;
    h: number;
    section: number;
    kind: 'bright' | 'dim' | 'acid';
};

type Box = { x: number; y: number; w: number; h: number };

/** Text-bearing elements mirrored into the minimap; outermost match wins */
const CONTENT_SELECTOR = 'h1,h2,h3,h4,p,li,a,button,.kw,.meta';

/** Computed color of var(--acid), for tinting acid text in the miniature */
const ACID_COLOR = 'rgb(215, 255, 63)';

export function Minimap() {
    const trackRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const blocksRef = useRef<Block[]>([]);
    const dragRef = useRef({ active: false, moved: false, startY: 0 });

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [docHeight, setDocHeight] = useState(1);
    const [trackHeight, setTrackHeight] = useState(0);
    const [active, setActive] = useState(0);

    useEffect(() => {
        let raf = 0;
        let bars: Bar[] = [];
        let boxes: Box[] = [];
        let pageWidth = 1;
        let pageHeight = 1;
        let activeIdx = -1;

        const draw = () => {
            const track = trackRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!track || !canvas || !ctx) return;

            const dpr = window.devicePixelRatio || 1;
            const cw = track.clientWidth;
            const ch = track.clientHeight;
            canvas.width = cw * dpr;
            canvas.height = ch * dpr;
            ctx.scale(dpr, dpr);

            const sx = (cw - 6) / pageWidth; // 3px inset each side
            const sy = ch / pageHeight;

            for (const box of boxes) {
                const x = 3 + box.x * sx;
                const y = box.y * sy;
                ctx.fillStyle = 'rgba(233, 233, 228, 0.04)';
                ctx.fillRect(x, y, box.w * sx, box.h * sy);
                ctx.strokeStyle = 'rgba(233, 233, 228, 0.14)';
                ctx.lineWidth = 0.75;
                ctx.strokeRect(x, y, box.w * sx, box.h * sy);
            }

            for (const bar of bars) {
                const isActive = bar.section === activeIdx;
                ctx.fillStyle =
                    bar.kind === 'acid'
                        ? `rgba(215, 255, 63, ${isActive ? 0.9 : 0.55})`
                        : bar.kind === 'bright'
                          ? `rgba(233, 233, 228, ${isActive ? 0.55 : 0.32})`
                          : `rgba(233, 233, 228, ${isActive ? 0.2 : 0.12})`;
                // shave a sliver off each line box so paragraphs read as lines, not slabs
                const h = Math.max(0.75, bar.h * sy - 1);
                ctx.fillRect(3 + bar.x * sx, bar.y * sy, bar.w * sx, h);
            }
        };

        const sync = () => {
            const track = trackRef.current;
            const indicator = indicatorRef.current;
            if (!track || !indicator) return;
            const scale = track.clientHeight / document.documentElement.scrollHeight;
            indicator.style.height = `${window.innerHeight * scale}px`;
            indicator.style.transform = `translateY(${window.scrollY * scale}px)`;

            const center = window.scrollY + window.innerHeight / 2;
            let idx = 0;
            for (const [i, b] of blocksRef.current.entries()) {
                if (b.top <= center) idx = i;
            }
            if (idx !== activeIdx) {
                activeIdx = idx;
                setActive(idx);
                draw();
            }
        };

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(sync);
        };

        const measure = () => {
            const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-minimap]'));
            const scrollY = window.scrollY;
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.scrollHeight;

            const nextBlocks: Block[] = [];
            const nextBars: Bar[] = [];
            const nextBoxes: Box[] = [];

            sections.forEach((sectionEl, i) => {
                const rect = sectionEl.getBoundingClientRect();
                nextBlocks.push({
                    label: sectionEl.dataset.minimap ?? '',
                    top: rect.top + scrollY,
                    height: rect.height,
                    el: sectionEl,
                });

                // card containers get an outlined box, like the real thing
                for (const card of sectionEl.querySelectorAll<HTMLElement>('[data-card]')) {
                    const r = card.getBoundingClientRect();
                    nextBoxes.push({
                        x: Math.max(0, r.left),
                        y: r.top + scrollY,
                        w: r.width,
                        h: r.height,
                    });
                }

                for (const el of sectionEl.querySelectorAll<HTMLElement>(CONTENT_SELECTOR)) {
                    // outermost matching element only — its line boxes cover descendants
                    const ancestor = el.parentElement?.closest(CONTENT_SELECTOR);
                    if (ancestor && sectionEl.contains(ancestor)) continue;
                    if (!(el.checkVisibility?.() ?? true)) continue;

                    const isAcid = getComputedStyle(el).color === ACID_COLOR;
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    for (const r of range.getClientRects()) {
                        // skip sr-only slivers and collapsed boxes
                        if (r.width < 12 || r.height < 8) continue;
                        const x = Math.max(0, r.left);
                        nextBars.push({
                            x,
                            y: r.top + scrollY,
                            w: Math.min(r.width, pageWidth - x),
                            h: r.height,
                            section: i,
                            kind: isAcid ? 'acid' : r.height >= 40 ? 'bright' : 'dim',
                        });
                    }
                }
            });

            blocksRef.current = nextBlocks;
            bars = nextBars;
            boxes = nextBoxes;
            setBlocks(nextBlocks);
            setDocHeight(pageHeight);
            setTrackHeight(trackRef.current?.clientHeight ?? 0);
            draw();
            sync();
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(document.body);
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const scrollToPointer = (clientY: number, behavior: ScrollBehavior) => {
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const scale = rect.height / document.documentElement.scrollHeight;
        const target = (clientY - rect.top) / scale - window.innerHeight / 2;
        window.scrollTo({ top: Math.max(0, target), behavior });
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = { active: true, moved: false, startY: e.clientY };
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag.active) return;
        if (!drag.moved && Math.abs(e.clientY - drag.startY) < 3) return;
        drag.moved = true;
        scrollToPointer(e.clientY, 'instant');
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag.active) return;
        // plain click: jump there, deferring to CSS scroll-behavior (smooth /
        // instant under prefers-reduced-motion)
        if (!drag.moved) scrollToPointer(e.clientY, 'auto');
        dragRef.current = { active: false, moved: false, startY: 0 };
    };

    const scale = trackHeight > 0 ? trackHeight / docHeight : 0;

    return (
        <div className="group fixed top-1/2 right-4 z-40 hidden w-14 -translate-y-1/2 xl:block">
            {/* section labels — revealed on hover, active one always on */}
            {scale > 0 &&
                blocks.map((block, i) => (
                    <button
                        key={block.label}
                        type="button"
                        onClick={() => block.el.scrollIntoView({ behavior: 'auto' })}
                        aria-label={`Scroll to ${block.label}`}
                        className={`absolute right-[calc(100%+0.625rem)] font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase transition-[opacity,color] duration-200 group-hover:opacity-100 focus-visible:opacity-100 ${
                            active === i ? 'text-acid opacity-100' : 'text-muted hover:text-fg opacity-0'
                        }`}
                        style={{ top: block.top * scale }}
                    >
                        {block.label}
                    </button>
                ))}

            <div
                ref={trackRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="border-line/70 bg-bg-raise/50 relative h-[min(55vh,30rem)] w-full cursor-pointer touch-none overflow-hidden rounded-[3px] border backdrop-blur-sm"
            >
                {/* compressed render of the real page content */}
                <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

                {/* viewport window — positioned imperatively on scroll */}
                <div
                    ref={indicatorRef}
                    className="border-fg/25 bg-fg/10 absolute inset-x-0 top-0 rounded-[2px] border"
                />
            </div>
        </div>
    );
}
