import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate } from 'motion';
import { For, Show, createEffect, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import { defaultLang, ui, type Lang } from '../i18n/ui';
import { animateCliTyping, getMotionPreference, resetCliTyping } from '../utils/cliAnimations';
import ProjectCard, { ANIMATION_CONFIG, type GridSize } from './ProjectCard';
import TagButton from './TagButton';

type FilterOption = 'all' | 'featured' | 'frontend' | 'backend' | 'productdesign';

function t(lang: Lang, key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
}

const getFilters = (
    lang: Lang,
): {
    value: FilterOption;
    label: string;
    tester: (p: Project) => boolean;
}[] => [
    { value: 'all', label: t(lang, 'portfolio.all'), tester: () => true },
    { value: 'featured', label: t(lang, 'portfolio.featured'), tester: (p) => p.data.featured },
    { value: 'frontend', label: 'Frontend', tester: (p) => p.data.tasks.includes('Frontend') },
    { value: 'backend', label: 'Backend', tester: (p) => p.data.tasks.includes('Backend') },
    {
        value: 'productdesign',
        label: t(lang, 'portfolio.productDesign'),
        tester: (p) => p.data.tasks.includes('Produktdesign') || p.data.tasks.includes('Product Design'),
    },
];

type Project = {
    id: string;
    body?: string;
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

const filterProjects = (projects: Project[], option: FilterOption, lang: Lang) => {
    const filters = getFilters(lang);
    const testers = Object.fromEntries(filters.map(({ value, tester }) => [value, tester])) as Record<
        FilterOption,
        (p: Project) => boolean
    >;
    const sorted = sortProjects(projects);
    const baseProjects = assignGridSizes(sorted);
    return baseProjects.filter(testers[option]);
};

const Projects: Component<{ allProjects: Project[]; lang?: string }> = (props) => {
    const lang = (props.lang ?? defaultLang) as Lang;
    const filters = getFilters(lang);
    const FILTER_OPTIONS = filters.map(({ value, label }) => ({ value, label }));

    const computeInitial = () => {
        const featured = filterProjects(allProjects, 'featured', lang);
        return featured.length > 0 ? featured : filterProjects(allProjects, 'all', lang);
    };
    const allProjects = props.allProjects;
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
    const filterButtons: HTMLButtonElement[] = [];

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
        preHeader.style.cssText = 'opacity: 0; transform: translateY(16px);';
        header.style.cssText = 'opacity: 0; transform: translateY(20px);';

        requestAnimationFrame(() => {
            const sequence = [
                ...(cliHeader
                    ? [
                          [
                              cliHeader,
                              { opacity: [0, 1], x: [-8, 0] },
                              { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                          ] as const,
                      ]
                    : []),
                [
                    preHeader,
                    { opacity: [0, 1], y: [16, 0] },
                    { duration: 0.8, at: '-0.3', ease: [0.16, 1, 0.3, 1] },
                ] as const,
                [
                    header,
                    { opacity: [0, 1], y: [20, 0] },
                    { duration: 0.8, at: '-0.4', ease: [0.16, 1, 0.3, 1] },
                ] as const,
            ];

            animateCliTyping(cliSelector, 500, 40);
            headerAnimController = animate(sequence as any);
            headerAnimController.finished.then(() => {
                setHeaderAnimationComplete(true);
            });

            if (filterButtons.length) {
                filterButtons.forEach((button) => {
                    button.style.cssText = 'opacity: 0; transform: translateY(12px)';
                });

                const buttonsSequence = filterButtons.map(
                    (btn, i) =>
                        [
                            btn,
                            { opacity: [0, 1], y: [12, 0] },
                            { duration: 0.6, at: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
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
                        y: -12,
                        scale: 0.97,
                    },
                    { duration: ANIMATION_CONFIG.exit.duration, at: i * 0.04, ease: [0.4, 0, 1, 1] },
                ] as const,
        );
        exitAnimController = animate(exitSequence as any);
        exitAnimController.finished.then(() => applyFilter(option));
    };

    const applyFilter = (option: FilterOption) => {
        const filteredProjects = filterProjects(allProjects, option, lang);
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
            class="relative z-3 overflow-hidden pt-14 pb-section md:pt-16 lg:pt-20"
            id="portfolio"
            aria-labelledby="portfolio-heading"
        >
            <div class="mx-auto w-full max-w-7xl px-gutter">
                <div class="mb-10 text-left">
                    {/* CLI header */}
                    <div
                        ref={(el) => (cliHeader = el)}
                        class="mb-4 flex items-center gap-3 font-mono text-sm text-text-secondary"
                        style={{ opacity: motionOK ? '0' : '1' }}
                    >
                        <span class="font-bold text-accent-ui">$</span>
                        <span>cd ~/portfolio && ls</span>
                    </div>

                    <p
                        ref={(el) => (preHeader = el)}
                        class="text-sm font-semibold tracking-caps text-text-tertiary uppercase"
                        style={{ opacity: motionOK ? '0' : '1' }}
                    >
                        {t(lang, 'portfolio.my')}
                    </p>
                    <h1
                        ref={(el) => (header = el)}
                        id="portfolio-heading"
                        class="mt-1.5 font-display text-5xl leading-tight font-extrabold text-text-primary"
                        style={{ opacity: motionOK ? '0' : '1' }}
                    >
                        {t(lang, 'portfolio.projects')}
                    </h1>
                </div>

                {/* Filter buttons */}
                <nav class="mb-8" aria-label={t(lang, 'portfolio.filter')}>
                    <ul class="flex list-none flex-wrap gap-3 p-0">
                        <For each={FILTER_OPTIONS}>
                            {(option, index) => (
                                <li>
                                    <TagButton
                                        ref={(el) => {
                                            filterButtons[index()] = el;
                                            if (motionOK) el.style.opacity = '0';
                                        }}
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
                    {projects().length} {t(lang, 'portfolio.found')}
                </output>

                <menu
                    class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 transition-all duration-500 sm:grid-cols-2 md:grid-cols-6 md:gap-5"
                    aria-label={t(lang, 'portfolio.list')}
                >
                    <Show
                        when={projects().length > 0}
                        fallback={
                            <div class="col-span-full py-8 text-center text-text-tertiary">
                                {t(lang, 'portfolio.notFound')}
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

                                const langPrefix = lang === 'de' ? '' : `/${lang}`;
                                const projectSlug = project.id.replace(/^en\//, '').replace(/\.md$/, '');

                                return (
                                    <ProjectCard
                                        title={project.data.title}
                                        name={project.data.name}
                                        year={project.data.year}
                                        isNew={project.data.year === currentYear}
                                        url={`${langPrefix}/project/${projectSlug}`}
                                        tags={project.data.tags}
                                        index={index()}
                                        gridSize={project.data.gridSize}
                                        headerAnimationComplete={headerAnimationComplete()}
                                        wrapperClassOverride={wrapperClassOverride}
                                        lang={lang}
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
