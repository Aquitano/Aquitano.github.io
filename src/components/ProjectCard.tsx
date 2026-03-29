import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate, type Easing } from 'motion';
import { For, Show, createEffect, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import { defaultLang, ui, type Lang } from '../i18n/ui';
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
    lang?: string;
}

export const GRID_SIZE_CLASSES: Record<GridSize, string> = {
    small: 'md:col-span-2 h-[340px]',
    medium: 'md:col-span-2 h-[380px]',
    large: 'md:col-span-2 h-[420px]',
    wide: 'md:col-span-4 h-[380px]',
    tall: 'md:col-span-2 h-[480px]',
};

export const ANIMATION_CONFIG = {
    entrance: { duration: 0.8, easing: [0.25, 0.1, 0.25, 1] as Easing },
    exit: { duration: 0.4, easing: [0.4, 0.0, 0.2, 1] as Easing },
    staggerDelay: 0.15,
    viewportThreshold: 0.15,
};

const ProjectCard: Component<ProjectCardProps> = (props) => {
    const gridSize = props.gridSize ?? 'medium';
    const lang = (props.lang ?? defaultLang) as Lang;
    const viewLabel = ui[lang]?.['project.viewProject'] ?? ui[defaultLang]['project.viewProject'];
    const newLabel = ui[lang]?.['project.new'] ?? ui[defaultLang]['project.new'];
    const newAriaLabel = ui[lang]?.['project.newLabel'] ?? ui[defaultLang]['project.newLabel'];
    const tagsLabel = ui[lang]?.['project.tags'] ?? ui[defaultLang]['project.tags'];
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
            return;
        }

        cardRef.style.opacity = '0';
        cardRef.style.transform = 'translate3d(0, 24px, 0) scale(0.97)';
        cardRef.style.willChange = 'transform, opacity';

        requestAnimationFrame(() => {
            if (!cardRef) return;

            const seq = [
                [
                    cardRef,
                    {
                        opacity: [0, 1],
                        y: [24, 0],
                        scale: [0.97, 1],
                    },
                    {
                        duration: ANIMATION_CONFIG.entrance.duration,
                        at: (props.index % 6) * ANIMATION_CONFIG.staggerDelay,
                        ease: [0.16, 1, 0.3, 1],
                    },
                ],
            ];
            animationController = animate(seq as any);

            animationController.finished.then(() => {
                if (cardRef) {
                    cardRef.style.opacity = '1';
                    cardRef.style.transform = '';
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
                            y: [6, 0],
                        },
                        {
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
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
                cardRef.style.transform = 'translate3d(0, 24px, 0) scale(0.97)';
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
                        {'/////'}
                    </div>

                    {/* Subtle gradient overlay */}
                    <div
                        class="absolute inset-0 z-0 transition-opacity duration-200"
                        style={{
                            background:
                                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)',
                            opacity: isHovered() ? 0.95 : 1,
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
                        <div class="absolute top-5 left-5 z-10" aria-label={newAriaLabel}>
                            <div
                                class="rounded-md px-3 py-1.5 font-mono text-xs font-bold tracking-wider uppercase shadow-lg"
                                style={{
                                    background: 'var(--color-accent)',
                                    color: '#fff',
                                    'box-shadow': '0 4px 12px rgba(224, 122, 58, 0.4)',
                                }}
                            >
                                {newLabel}
                            </div>
                        </div>
                    </Show>

                    {/* Content */}
                    <div
                        ref={(el) => (contentRef = el)}
                        class="absolute bottom-0 left-0 z-10 w-full min-w-0 p-7 md:p-8"
                        style={{
                            transform: isHovered() ? 'translateY(0)' : 'translateY(2px)',
                            transition: 'transform 300ms ease-out',
                        }}
                    >
                        {/* Year label */}
                        <span
                            class="mb-2 block font-mono text-sm font-semibold tracking-wider uppercase"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            {props.year}
                        </span>

                        {/* Title */}
                        <h2
                            class="mb-4 text-2xl font-bold md:text-3xl"
                            style={{
                                color: '#fafaf9',
                                'line-height': '1.35',
                                'letter-spacing': '-0.01em',
                                'overflow-wrap': 'anywhere',
                                'text-wrap': 'balance',
                            }}
                        >
                            {props.title}
                        </h2>

                        {/* Tags */}
                        <ul class="mb-4 flex list-none flex-wrap gap-2 p-0" aria-label={tagsLabel}>
                            <For each={props.tags}>
                                {(tag) => (
                                    <li
                                        class="project-tag rounded px-2.5 py-1.5 font-mono text-xs font-medium"
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.85)',
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            border: '1px solid rgba(255, 255, 255, 0.15)',
                                            'letter-spacing': '0.01em',
                                        }}
                                    >
                                        {tag}
                                    </li>
                                )}
                            </For>
                        </ul>

                        {/* View link */}
                        <div
                            class="flex items-center font-mono text-base font-semibold"
                            style={{
                                color: 'var(--color-accent)',
                                opacity: isHovered() ? 1 : 0.8,
                                transform: isHovered() ? 'translateY(0)' : 'translateY(2px)',
                                transition: 'opacity 200ms ease-out, transform 200ms ease-out',
                            }}
                        >
                            <span>{viewLabel}</span>
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
                </a>
            </div>
        </article>
    );
};

export default ProjectCard;
