import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate, stagger, type Easing } from 'motion';
import { Show, createEffect, createSignal, onCleanup, onMount, type Component } from 'solid-js';

export type GridSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';

export interface ProjectCardProps {
    title: string;
    name: string;
    url: string;
    isNew?: boolean;
    year: number;
    tags?: string[];
    index: number;
    gridSize?: GridSize;
    headerAnimationComplete?: boolean;
    wrapperClassOverride?: string;
}

const CARD_BG_CLASS = 'bg-neutral-600';

export const GRID_SIZE_CLASSES = {
    small: 'md:col-span-2 h-[320px]',
    medium: 'md:col-span-2 h-[360px]',
    large: 'md:col-span-2 h-[400px]',
    wide: 'md:col-span-4 h-[360px]',
    tall: 'md:col-span-2 h-[460px]',
};

export const ANIMATION_CONFIG = {
    entrance: { duration: 0.8, easing: [0.25, 0.1, 0.25, 1] as Easing },
    exit: { duration: 0.4, easing: [0.4, 0.0, 0.2, 1] as Easing },
    staggerDelay: 0.15,
    viewportThreshold: 0.15,
};

const ProjectCard: Component<ProjectCardProps> = (props) => {
    const gridSize = props.gridSize ?? 'medium';

    let cardRef: HTMLDivElement | undefined;
    let contentRef: HTMLDivElement | undefined;
    let animationController: ReturnType<typeof animate> | null = null;
    const [hasAnimated, setHasAnimated] = createSignal(false);

    // Spotlight hover/focus effect
    const [isSpotlightFocused, setIsSpotlightFocused] = createSignal(false);
    const [spotlightOpacity, setSpotlightOpacity] = createSignal(0);
    const [spotlightPosition, setSpotlightPosition] = createSignal({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent) => {
        if (!cardRef || isSpotlightFocused()) return;
        const rect = cardRef.getBoundingClientRect();
        setSpotlightPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsSpotlightFocused(true);
        setSpotlightOpacity(0.6);
    };

    const handleBlur = () => {
        setIsSpotlightFocused(false);
        setSpotlightOpacity(0);
    };

    const handleMouseEnter = () => setSpotlightOpacity(0.6);
    const handleMouseLeave = () => setSpotlightOpacity(0);

    const useVisibilityObserver = createVisibilityObserver(
        { threshold: ANIMATION_CONFIG.viewportThreshold },
        withOccurrence((entry, { occurrence }) => {
            if (occurrence === 'Entering' && !hasAnimated() && props.headerAnimationComplete) {
                animateIn();
                setHasAnimated(true);
            }
            return entry.isIntersecting;
        }),
    );

    createEffect(() => {
        if (props.headerAnimationComplete && !hasAnimated() && cardRef) {
            const rect = cardRef.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInViewport) {
                animateIn();
                setHasAnimated(true);
            }
        }
    });

    const animateIn = () => {
        if (cardRef && !hasAnimated()) {
            cardRef.style.opacity = '0';
            cardRef.style.transform = 'translateY(30px) scale(0.95)';
            cardRef.style.filter = 'blur(4px)';
            cardRef.style.willChange = 'transform, opacity, filter';

            requestAnimationFrame(() => {
                if (cardRef) {
                    animationController = animate(
                        cardRef,
                        {
                            opacity: [0, 1],
                            transform: ['translateY(30px) scale(0.95)', 'translateY(0) scale(1)'],
                            filter: ['blur(4px)', 'blur(0px)'],
                        },
                        {
                            duration: ANIMATION_CONFIG.entrance.duration,
                            delay: (props.index % 6) * ANIMATION_CONFIG.staggerDelay,
                            easing: ANIMATION_CONFIG.entrance.easing,
                        },
                    );

                    animationController.finished.then(() => {
                        if (cardRef) {
                            cardRef.style.opacity = '1';
                            cardRef.style.transform = 'translateY(0) scale(1)';
                            cardRef.style.filter = 'blur(0px)';
                            cardRef.style.willChange = 'auto';
                        }
                    });
                }
            });

            if (contentRef && props.tags?.length && props.headerAnimationComplete) {
                const tagElements = contentRef.querySelectorAll('.project-tag');
                animate(
                    tagElements,
                    {
                        opacity: [0.7, 1],
                        transform: ['translateY(8px)', 'translateY(0)'],
                    },
                    {
                        delay: stagger(0.03),
                        duration: 0.5,
                        easing: 'ease-out',
                    },
                );
            }
        }
    };

    onMount(() => {
        if (cardRef) {
            cardRef.style.opacity = '0';
            cardRef.style.transform = 'translateY(30px) scale(0.95)';
            cardRef.style.filter = 'blur(4px)';

            useVisibilityObserver(() => cardRef);
        }
    });

    onCleanup(() => {
        if (animationController) animationController.stop();
    });

    const wrapperClass = props.wrapperClassOverride ?? `relative ${GRID_SIZE_CLASSES[gridSize]}`;

    return (
        <div class={wrapperClass}>
            <div
                ref={cardRef}
                class="perspective-2000 h-full w-full transform-gpu overflow-hidden rounded-xl shadow-none ring-1 ring-white/10 transition-all duration-300 hover:ring-white/20"
            >
                <a
                    href={props.url}
                    class="decoration-none group relative block h-full w-full overflow-hidden text-white interactive-card"
                    rel="prefetch"
                    onMouseMove={handleMouseMove}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div class={`absolute inset-0 ${CARD_BG_CLASS}`}></div>
                    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.10),transparent_70%)] mix-blend-overlay"></div>

                    <div class="absolute inset-0 z-0 bg-linear-to-b from-black/10 via-transparent to-black/60 transition-opacity duration-200 group-hover:opacity-90"></div>

                    {/* Spotlight overlay */}
                    <div
                        class="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 ease-in-out"
                        style={{
                            opacity: spotlightOpacity(),
                            background: `radial-gradient(circle at ${spotlightPosition().x}px ${spotlightPosition().y}px, rgba(255,255,255,0.25), transparent 80%)`,
                        }}
                    />

                    {/* New badge */}
                    <Show when={props.isNew}>
                        <div class="absolute top-5 right-5 z-10">
                            <div class="relative">
                                <div class="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white text-xs font-bold tracking-wider text-stone-800 uppercase shadow-md">
                                    new
                                </div>
                                <svg viewBox="0 0 100 100" class="absolute top-0 left-0 h-[50px] w-[50px] -rotate-90">
                                    <circle cx="50" cy="50" r="47" stroke-width="6" class="fill-none stroke-white/30" />
                                </svg>
                            </div>
                        </div>
                    </Show>

                    {/* Content */}
                    <div
                        ref={contentRef}
                        class="absolute bottom-0 left-0 z-10 w-full translate-y-2 transform p-8 transition-transform duration-500 ease-out group-hover:translate-y-0"
                    >
                        <span class="mb-2 block text-sm font-medium text-white/85 opacity-80 transition-opacity duration-400 group-hover:opacity-95">
                            {props.year}
                        </span>

                        <h2 class="mb-4 text-xl font-bold text-white transition-transform duration-200 ease-out group-hover:-translate-y-0.5 md:text-2xl">
                            {props.title}
                        </h2>

                        <div class="mb-6 flex flex-wrap gap-2">
                            {props.tags?.map((tag) => (
                                <span class="project-tag translate-y-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur-md transition-all duration-400">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div class="flex translate-y-3 transform items-center font-medium opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                            <span>View Project</span>
                            <span class="ml-2 text-xl transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};

if (typeof window !== 'undefined') {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
        document.documentElement.classList.add('prm');
    }
}

export default ProjectCard;
