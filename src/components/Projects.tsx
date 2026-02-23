import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate } from 'motion';
import { For, Show, createEffect, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import { animateCliTyping, getMotionPreference, resetCliTyping } from '../utils/cliAnimations';
import ProjectCard, { ANIMATION_CONFIG, type GridSize } from './ProjectCard';
import TagButton from './TagButton';

type FilterOption = 'all' | 'featured' | 'frontend' | 'backend' | 'productdesign';

const FILTERS: {
    value: FilterOption;
    label: string;
    tester: (p: Project) => boolean;
}[] = [
    { value: 'all', label: 'Alle', tester: () => true },
    { value: 'featured', label: 'Featured', tester: (p) => p.data.featured },
    { value: 'frontend', label: 'Frontend', tester: (p) => p.data.tasks.includes('Frontend') },
    { value: 'backend', label: 'Backend', tester: (p) => p.data.tasks.includes('Backend') },
    { value: 'productdesign', label: 'Product Design', tester: (p) => p.data.tasks.includes('Produktdesign') },
];
const FILTER_OPTIONS = FILTERS.map(({ value, label }) => ({ value, label }));
const TESTERS = Object.fromEntries(FILTERS.map(({ value, tester }) => [value, tester])) as Record<
    FilterOption,
    (p: Project) => boolean
>;

type Project = {
    id: string;
    slug: string;
    body: string;
    collection: 'project';
    data: {
        featured: boolean;
        title: string;
        name: string;
        description: string;
        tags: string[];
        tasks: string[];
        year: number;
        gridSize?: GridSize;
    };
};

const GRID_SIZES: GridSize[] = [
    'medium',
    'medium',
    'medium',
    'wide',
    'medium',
    'medium',
    'medium',
    'medium',
    'medium',
    'wide',
    'medium',
    'medium',
    'medium',
];

const assignGridSizes = (projects: Project[]): Project[] => {
    return projects.map((project, index) => {
        if (project.data.gridSize) return project;

        if (project.data.featured && index === 0) {
            return { ...project, data: { ...project.data, gridSize: 'wide' } };
        }

        const size = GRID_SIZES[index % GRID_SIZES.length];
        return { ...project, data: { ...project.data, gridSize: size } };
    });
};

const sortProjects = (projects: Project[]): Project[] => {
    return [...projects].sort((a, b) => {
        if (a.data.featured && !b.data.featured) return -1;
        if (!a.data.featured && b.data.featured) return 1;

        // TODO(TB): Temporary fix for specific project ordering
        if (a.data.name === 'Griffin' && b.data.name === 'JustHTML') return 1;
        if (a.data.name === 'JustHTML' && b.data.name === 'Griffin') return -1;

        return b.data.year - a.data.year;
    });
};

const filterProjects = (projects: Project[], option: FilterOption) => {
    const sorted = sortProjects(projects);
    const baseProjects = assignGridSizes(sorted);
    return baseProjects.filter(TESTERS[option]);
};

const Projects: Component<{ allProjects: Project[] }> = ({ allProjects }) => {
    const computeInitial = () => {
        const featured = filterProjects(allProjects, 'featured');
        return featured.length > 0 ? featured : filterProjects(allProjects, 'all');
    };
    const [projects, setProjects] = createSignal<Project[]>(computeInitial());
    const [filter, setFilter] = createSignal<FilterOption>('featured');
    const [isAnimating, setIsAnimating] = createSignal(false);
    const [headerVisible, setHeaderVisible] = createSignal(false);
    const [headerAnimationComplete, setHeaderAnimationComplete] = createSignal(false);
    const motionOK = getMotionPreference();

    const currentYear = new Date().getFullYear();
    const cliSelector = '#portfolio .font-mono span:last-child';

    let headerAnimController: ReturnType<typeof animate> | null = null;
    let buttonsAnimController: ReturnType<typeof animate> | null = null;
    let exitAnimController: ReturnType<typeof animate> | null = null;

    const HEIGHT_CLASSES: Record<GridSize, string> = {
        small: 'h-[340px]',
        medium: 'h-[380px]',
        large: 'h-[420px]',
        wide: 'h-[380px]',
        tall: 'h-[480px]',
    };

    let cliHeader: HTMLDivElement | undefined;
    let preHeader: HTMLParagraphElement | undefined;
    let header: HTMLHeadingElement | undefined;
    let filterButtons: HTMLButtonElement[] = [];

    const useHeaderVisibilityObserver = createVisibilityObserver(
        { threshold: 0.2 },
        withOccurrence((entry, { occurrence }) => {
            if (occurrence === 'Entering' && !headerVisible()) {
                setHeaderVisible(true);
            }
            return entry.isIntersecting;
        }),
    );

    createEffect(() => {
        if (headerVisible() && !headerAnimationComplete()) animateHeader();
    });

    const animateHeader = () => {
        if (!preHeader || !header) return;

        // Skip animation if reduced motion is preferred
        if (!motionOK) {
            if (cliHeader) cliHeader.style.opacity = '1';
            if (preHeader) preHeader.style.opacity = '1';
            if (header) header.style.opacity = '1';
            filterButtons.forEach((btn) => {
                btn.style.opacity = '1';
            });
            setHeaderAnimationComplete(true);
            return;
        }

        if (cliHeader) cliHeader.style.cssText = 'opacity: 0; transform: translateX(-8px);';
        preHeader.style.cssText = 'opacity: 0; transform: translateY(20px);';
        header.style.cssText = 'opacity: 0; transform: translateY(20px);';

        requestAnimationFrame(() => {
            const sequence = [
                ...(cliHeader
                    ? [
                          [
                              cliHeader,
                              { opacity: [0, 1], transform: ['translateX(-8px)', 'translateX(0)'] },
                              { duration: 0.6 },
                          ] as const,
                      ]
                    : []),
                [
                    preHeader,
                    { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0)'] },
                    { duration: 0.8, at: '-0.3' },
                ] as const,
                [
                    header,
                    { opacity: [0, 1], transform: ['translateY(25px)', 'translateY(0)'] },
                    { duration: 0.8, at: '-0.4' },
                ] as const,
            ];

            animateCliTyping(cliSelector, 500, 40);
            headerAnimController = animate(sequence as any);
            headerAnimController.finished.then(() => {
                setHeaderAnimationComplete(true);
            });

            if (filterButtons.length) {
                filterButtons.forEach((button) => {
                    button.style.cssText = 'opacity: 0; transform: translateY(15px)';
                });

                const buttonsSequence = filterButtons.map(
                    (btn, i) =>
                        [
                            btn,
                            { opacity: [0, 1], transform: ['translateY(15px)', 'translateY(0)'] },
                            { duration: 0.6, at: 0.5 + i * 0.08 },
                        ] as const,
                );
                buttonsAnimController = animate(buttonsSequence as any);
            }
        });
    };

    const handleFilterChange = (option: FilterOption) => {
        if (isAnimating() || filter() === option) return;
        setIsAnimating(true);
        setFilter(option);

        // Skip animation if reduced motion is preferred
        if (!motionOK) {
            applyFilter(option);
            return;
        }

        const projectCards = document.querySelectorAll('.perspective-2000');
        if (projectCards.length === 0) {
            applyFilter(option);
            return;
        }

        const cards = Array.from(projectCards);
        const exitSequence = cards.map(
            (el, i) =>
                [
                    el,
                    {
                        opacity: 0,
                        transform: 'translateY(-15px) scale(0.95)',
                        filter: 'blur(4px)',
                    },
                    { duration: ANIMATION_CONFIG.exit.duration, at: i * 0.04 },
                ] as const,
        );
        exitAnimController = animate(exitSequence as any);
        exitAnimController.finished.then(() => applyFilter(option));
    };

    const applyFilter = (option: FilterOption) => {
        const filteredProjects = filterProjects(allProjects, option);
        setProjects(filteredProjects);
        setIsAnimating(false);
    };

    onMount(() => {
        if (preHeader) {
            if (!motionOK) {
                if (cliHeader) cliHeader.style.opacity = '1';
                preHeader.style.opacity = '1';
                if (header) header.style.opacity = '1';
                filterButtons.forEach((btn) => {
                    btn.style.opacity = '1';
                });
                setHeaderAnimationComplete(true);
            }
            useHeaderVisibilityObserver(() => preHeader);
        }
    });

    onCleanup(() => {
        headerAnimController?.stop();
        buttonsAnimController?.stop();
        exitAnimController?.stop();
        headerAnimController = null;
        buttonsAnimController = null;
        exitAnimController = null;
        if (typeof document !== 'undefined') {
            resetCliTyping(cliSelector);
        }
    });

    return (
        <section
            class="relative z-3 overflow-hidden py-(--space-section)"
            id="portfolio"
            aria-labelledby="portfolio-heading"
        >
            <div class="mx-auto w-full max-w-7xl px-(--gutter)">
                <div class="mb-16 text-left">
                    {/* CLI header */}
                    <div
                        ref={(el) => (cliHeader = el)}
                        class="mb-6 flex items-center gap-3 font-mono text-(length:--text-sm) text-(--text-secondary)"
                    >
                        <span class="font-bold text-(--color-accent)">$</span>
                        <span>cd ~/portfolio && ls</span>
                    </div>

                    <p
                        ref={(el) => (preHeader = el)}
                        class="text-(length:--text-sm) font-semibold tracking-(--tracking-caps) text-(--color-text-tertiary) uppercase"
                    >
                        Meine
                    </p>
                    <h1
                        ref={(el) => (header = el)}
                        id="portfolio-heading"
                        class="mt-2 font-(family-name:--font-display) text-(length:--text-5xl) leading-tight font-extrabold text-(--color-text-primary)"
                    >
                        Projekte
                    </h1>
                </div>

                {/* Filter buttons */}
                <nav class="mb-12" aria-label="Projektfilter">
                    <ul class="flex list-none flex-wrap gap-3 p-0">
                        <For each={FILTER_OPTIONS}>
                            {(option, index) => (
                                <li>
                                    <TagButton
                                        ref={(el) => (filterButtons[index()] = el)}
                                        label={option.label}
                                        isActive={filter() === option.value}
                                        onClick={() => handleFilterChange(option.value)}
                                    />
                                </li>
                            )}
                        </For>
                    </ul>
                </nav>

                {/* Status announcement for screen readers */}
                <output class="sr-only" aria-live="polite" aria-atomic="true">
                    {projects().length} Projekte gefunden
                </output>

                <menu
                    class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 transition-all duration-500 sm:grid-cols-2 md:grid-cols-6 md:gap-6 lg:gap-5"
                    aria-label="Projektliste"
                >
                    <Show
                        when={projects().length > 0}
                        fallback={
                            <div class="col-span-full py-8 text-center text-(--color-text-tertiary)">
                                Keine Projekte gefunden
                            </div>
                        }
                    >
                        <For each={projects()}>
                            {(project, index) => {
                                const size: GridSize = project.data.gridSize ?? 'medium';
                                const count = projects().length;
                                let wrapperClassOverride: string | undefined = undefined;

                                if (count === 1) {
                                    wrapperClassOverride = `relative md:col-span-4 md:col-start-2 ${HEIGHT_CLASSES[size]}`;
                                } else if (count === 2) {
                                    wrapperClassOverride = `relative md:col-span-3 ${HEIGHT_CLASSES[size]}`;
                                }

                                return (
                                    <ProjectCard
                                        title={project.data.title}
                                        name={project.data.name}
                                        year={project.data.year}
                                        isNew={project.data.year === currentYear}
                                        url={`project/${project.slug}`}
                                        tags={project.data.tags}
                                        index={index()}
                                        gridSize={project.data.gridSize}
                                        headerAnimationComplete={headerAnimationComplete()}
                                        wrapperClassOverride={wrapperClassOverride}
                                    />
                                );
                            }}
                        </For>
                    </Show>
                </menu>
            </div>
        </section>
    );
};

export default Projects;
