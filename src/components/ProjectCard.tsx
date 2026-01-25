import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate, type Easing } from 'motion';
import { For, Show, createEffect, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import { getMotionPreference, getReducedMotionMQL } from '../utils/cliAnimations';

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

export const GRID_SIZE_CLASSES: Record<GridSize, string> = {
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
    const [motionOK, setMotionOK] = createSignal(getMotionPreference());

    let cardRef: HTMLDivElement | undefined;
    let contentRef: HTMLDivElement | undefined;
    let animationController: ReturnType<typeof animate> | null = null;
    const [hasAnimated, setHasAnimated] = createSignal(false);

    const [isHovered, setIsHovered] = createSignal(false);
    const [spotlightPosition, setSpotlightPosition] = createSignal({ x: 0, y: 0 });

    onMount(() => {
        const mq = getReducedMotionMQL();
        if (!mq) return;

        setMotionOK(!mq.matches);

        const handler = (e: MediaQueryListEvent) => setMotionOK(!e.matches);
        mq.addEventListener('change', handler);
        onCleanup(() => mq.removeEventListener('change', handler));
    });

    const handleMouseMove = (e: MouseEvent) => {
        if (!cardRef || !motionOK()) return;
        const rect = cardRef.getBoundingClientRect();
        setSpotlightPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

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
        if (!cardRef || hasAnimated()) return;

        if (!motionOK()) {
            cardRef.style.opacity = '1';
            cardRef.style.transform = 'none';
            cardRef.style.filter = 'none';
            return;
        }

        cardRef.style.opacity = '0';
        cardRef.style.transform = 'translateY(30px) scale(0.95)';
        cardRef.style.filter = 'blur(4px)';
        cardRef.style.willChange = 'transform, opacity, filter';

        requestAnimationFrame(() => {
            if (!cardRef) return;

            const seq = [
                [
                    cardRef,
                    {
                        opacity: [0, 1],
                        transform: ['translateY(30px) scale(0.95)', 'translateY(0) scale(1)'],
                        filter: ['blur(4px)', 'blur(0px)'],
                    },
                    {
                        duration: ANIMATION_CONFIG.entrance.duration,
                        at: (props.index % 6) * ANIMATION_CONFIG.staggerDelay,
                    },
                ],
            ];
            animationController = animate(seq as any);

            animationController.finished.then(() => {
                if (cardRef) {
                    cardRef.style.opacity = '1';
                    cardRef.style.transform = 'translateY(0) scale(1)';
                    cardRef.style.filter = 'blur(0px)';
                    cardRef.style.willChange = 'auto';
                }
            });
        });

        if (contentRef && props.tags?.length && props.headerAnimationComplete && motionOK()) {
            const tagElements = contentRef.querySelectorAll('.project-tag');
            const tagsSeq = Array.from(tagElements).map(
                (el, i) =>
                    [
                        el,
                        {
                            opacity: [0.7, 1],
                            transform: ['translateY(8px)', 'translateY(0)'],
                        },
                        {
                            duration: 0.5,
                            ease: 'easeOut',
                            at: i * 0.03,
                        },
                    ] as const,
            );
            animate(tagsSeq as any);
        }
    };

    onMount(() => {
        if (cardRef) {
            if (motionOK()) {
                cardRef.style.opacity = '0';
                cardRef.style.transform = 'translateY(30px) scale(0.95)';
                cardRef.style.filter = 'blur(4px)';
            }
            useVisibilityObserver(() => cardRef);
        }
    });

    onCleanup(() => {
        if (animationController) animationController.stop();
    });

    const wrapperClass = props.wrapperClassOverride ?? `relative ${GRID_SIZE_CLASSES[gridSize]}`;

    return (
        <article class={wrapperClass}>
            <div
                ref={(el) => (cardRef = el)}
                class="perspective-2000 h-full w-full transform-gpu overflow-hidden rounded-xl"
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--bg-card-border)',
                    transition: 'border-color 150ms ease-out',
                    'border-color': isHovered() ? 'var(--bg-card-border-hover)' : 'var(--bg-card-border)',
                }}
            >
                <a
                    href={props.url}
                    class="group relative block h-full w-full overflow-hidden no-underline"
                    data-astro-prefetch
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onFocus={handleMouseEnter}
                    onBlur={handleMouseLeave}
                    aria-label={`${props.title} - ${props.year}. ${props.tags?.join(', ') || ''}`}
                >
                    {/* ASCII pattern decoration */}
                    <div
                        class="pointer-events-none absolute top-3 right-4 font-mono text-xs tracking-tight select-none"
                        style={{ color: 'rgba(255, 255, 255, 0.15)', 'letter-spacing': '0.05em' }}
                        aria-hidden="true"
                    >
                        /////
                    </div>

                    {/* Subtle gradient overlay */}
                    <div
                        class="absolute inset-0 z-0 transition-opacity duration-200"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                            opacity: isHovered() ? 0.9 : 1,
                        }}
                        aria-hidden="true"
                    />

                    {/* Spotlight effect */}
                    <Show when={motionOK()}>
                        <div
                            class="pointer-events-none absolute inset-0 z-1 transition-opacity duration-500 ease-in-out"
                            style={{
                                opacity: isHovered() ? 0.5 : 0,
                                background: `radial-gradient(circle at ${spotlightPosition().x}px ${spotlightPosition().y}px, rgba(224, 122, 58, 0.15), transparent 60%)`,
                            }}
                            aria-hidden="true"
                        />
                    </Show>

                    {/* New badge */}
                    <Show when={props.isNew}>
                        <div class="absolute top-4 left-4 z-10" aria-label="New project">
                            <div
                                class="rounded px-2 py-1 font-mono text-xs font-bold tracking-wider uppercase"
                                style={{
                                    background: 'var(--color-accent)',
                                    color: '#fff',
                                }}
                            >
                                NEW
                            </div>
                        </div>
                    </Show>

                    {/* Content */}
                    <div
                        ref={(el) => (contentRef = el)}
                        class="absolute bottom-0 left-0 z-10 w-full p-6"
                        style={{
                            transform: isHovered() ? 'translateY(0)' : 'translateY(4px)',
                            transition: 'transform 300ms ease-out',
                        }}
                    >
                        {/* Year label */}
                        <span
                            class="mb-2 block font-mono text-xs tracking-wider uppercase"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            {props.year}
                        </span>

                        {/* Title */}
                        <h2
                            class="mb-4 text-xl font-bold md:text-2xl"
                            style={{
                                color: '#fafaf9',
                                'line-height': '1.25',
                            }}
                        >
                            {props.title}
                        </h2>

                        {/* Tags */}
                        <ul class="mb-4 flex list-none flex-wrap gap-2 p-0" aria-label="Project tags">
                            <For each={props.tags}>
                                {(tag) => (
                                    <li
                                        class="project-tag rounded px-2 py-1 font-mono text-xs"
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            background: 'transparent',
                                            border: '1px solid rgba(255, 255, 255, 0.15)',
                                        }}
                                    >
                                        {tag}
                                    </li>
                                )}
                            </For>
                        </ul>

                        {/* View link */}
                        <div
                            class="flex items-center font-mono text-sm font-medium"
                            style={{
                                color: 'var(--color-accent)',
                                opacity: isHovered() ? 1 : 0.7,
                                transform: isHovered() ? 'translateY(0)' : 'translateY(4px)',
                                transition: 'opacity 200ms ease-out, transform 200ms ease-out',
                            }}
                        >
                            <span>View Project</span>
                            <span
                                class="ml-2"
                                style={{
                                    transform: isHovered() ? 'translateX(4px)' : 'translateX(0)',
                                    transition: 'transform 200ms ease-out',
                                }}
                            >
                                &rarr;
                            </span>
                        </div>
                    </div>

                    {/* Bottom halftone decoration */}
                    <div
                        class="pointer-events-none absolute right-0 bottom-0 left-0 h-px"
                        style={{
                            background:
                                'repeating-linear-gradient(90deg, rgba(224, 122, 58, 0.3) 0, rgba(224, 122, 58, 0.3) 2px, transparent 2px, transparent 6px)',
                        }}
                        aria-hidden="true"
                    />
                </a>
            </div>
        </article>
    );
};

export default ProjectCard;
