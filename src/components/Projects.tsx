import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate, stagger, timeline } from 'motion';
import { For, Show, createEffect, createSignal, onMount, type Component } from 'solid-js';
import ProjectCard, { ANIMATION_CONFIG, type GridSize } from './ProjectCard';
import TagButton from './TagButton';

type FilterOption = 'all' | 'featured' | 'frontend' | 'backend' | 'product design';
const FILTER_OPTIONS = [
    { value: 'all' as const, label: 'All' },
    { value: 'featured' as const, label: 'Featured' },
    { value: 'frontend' as const, label: 'Frontend' },
    { value: 'backend' as const, label: 'Backend' },
    { value: 'product design' as const, label: 'Product Design' },
];

const TESTERS: Record<FilterOption, (p: Project) => boolean> = {
    all: () => true,
    featured: (p) => p.data.featured,
    frontend: (p) => p.data.tasks.includes('Frontend'),
    backend: (p) => p.data.tasks.includes('Backend'),
    'product design': (p) => p.data.tasks.includes('Product Design'),
};

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
        return b.data.year - a.data.year;
    });
};

const Projects: Component<{ allProjects: Project[] }> = ({ allProjects }) => {
    const [projects, setProjects] = createSignal<Project[]>([]);
    const [filter, setFilter] = createSignal<FilterOption>('featured');
    const [isAnimating, setIsAnimating] = createSignal(false);
    const [headerVisible, setHeaderVisible] = createSignal(false);
    const [headerAnimationComplete, setHeaderAnimationComplete] = createSignal(false);

    const currentYear = new Date().getFullYear();

    let preHeader: HTMLParagraphElement | undefined;
    let header: HTMLHeadingElement | undefined;
    let projectsContainer: HTMLDivElement | undefined;
    let filterButtons: HTMLButtonElement[] = [];
    let headerAnimation: any = null;

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
        preHeader.style.cssText = 'opacity: 0; transform: translateY(20px);';
        header.style.cssText = 'opacity: 0; transform: translateY(20px);';

        requestAnimationFrame(() => {
            timeline([
                [
                    preHeader,
                    { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0)'] },
                    { duration: 0.8, easing: ANIMATION_CONFIG.entrance.easing },
                ],
                [
                    header,
                    { opacity: [0, 1], transform: ['translateY(25px)', 'translateY(0)'] },
                    { duration: 0.8, at: '-0.4', easing: ANIMATION_CONFIG.entrance.easing },
                ],
            ]).finished.then(() => {
                setHeaderAnimationComplete(true);
            });

            if (filterButtons.length) {
                filterButtons.forEach((button) => {
                    button.style.cssText = 'opacity: 0; transform: translateY(15px);';
                });

                animate(
                    filterButtons,
                    { opacity: [0, 1], transform: ['translateY(15px)', 'translateY(0)'] },
                    { duration: 0.6, delay: stagger(0.08, { start: 0.5 }), easing: ANIMATION_CONFIG.entrance.easing },
                );
            }
        });
    };

    const handleFilterChange = (option: FilterOption) => {
        if (isAnimating() || filter() === option) return;
        setIsAnimating(true);
        setFilter(option);

        const projectCards = document.querySelectorAll('.perspective-2000');
        if (projectCards.length === 0) {
            applyFilter(option);
            return;
        }

        animate(
            projectCards,
            {
                opacity: [null, 0],
                transform: [null, 'translateY(-15px) scale(0.95)'],
                filter: [null, 'blur(4px)'],
            },
            {
                duration: ANIMATION_CONFIG.exit.duration,
                easing: ANIMATION_CONFIG.exit.easing,
                delay: stagger(0.04),
            },
        ).finished.then(() => applyFilter(option));
    };

    const filterProjects = (projects: Project[], option: FilterOption) => {
        const sorted = sortProjects(projects);
        const baseProjects = assignGridSizes(sorted);
        return baseProjects.filter(TESTERS[option]);
    };

    const applyFilter = (option: FilterOption) => {
        const filteredProjects = filterProjects(allProjects, option);
        setProjects(filteredProjects);
        setIsAnimating(false);
    };

    onMount(() => {
        const initialProjects = filterProjects(allProjects, 'featured');
        setProjects(initialProjects.length > 0 ? initialProjects : filterProjects(allProjects, 'all'));

        if (preHeader) {
            preHeader.style.cssText = 'opacity: 0; transform: translateY(20px);';
            useHeaderVisibilityObserver(() => preHeader);
        }
    });

    return (
        <section class="relative z-3 overflow-hidden py-24" id="portfolio">
            <div class="mx-auto w-full max-w-7xl px-6">
                {/* Header */}
                <div class="mb-16 text-left">
                    <p ref={preHeader} class="text-sm font-semibold tracking-[0.4em] text-gray-400 uppercase">
                        Meine
                    </p>
                    <h1
                        ref={header}
                        class="mt-2 font-['Syne_Variable',sans-serif] text-6xl leading-tight font-extrabold text-stone-700"
                    >
                        Projekte
                    </h1>
                </div>

                {/* Filter buttons */}
                <div class="mb-12 flex flex-wrap gap-4">
                    <For each={FILTER_OPTIONS}>
                        {(option, index) => (
                            <TagButton
                                ref={(el) => (filterButtons[index()] = el)}
                                label={option.label}
                                isActive={filter() === option.value}
                                onClick={() => handleFilterChange(option.value)}
                            />
                        )}
                    </For>
                </div>

                <div
                    ref={projectsContainer}
                    class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 transition-all duration-500 sm:grid-cols-2 md:grid-cols-6 md:gap-8 lg:gap-6"
                >
                    <Show
                        when={projects().length > 0}
                        fallback={<div class="col-span-full py-8 text-center text-gray-400">No projects found</div>}
                    >
                        <For each={projects()}>
                            {(project, index) => (
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
                                />
                            )}
                        </For>
                    </Show>
                </div>
            </div>
        </section>
    );
};

export default Projects;
