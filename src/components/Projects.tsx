import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate, stagger, timeline } from 'motion';
import { For, Show, createEffect, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import ProjectCard, { ANIMATION_CONFIG, type GridSize } from './ProjectCard';
import TagButton from './TagButton';

type FilterOption = 'all' | 'featured' | 'frontend' | 'backend' | 'product design';

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

const GRID_TEMPLATE = [
    { row: 1, col: 1, size: 'medium' },
    { row: 1, col: 3, size: 'medium' },
    { row: 1, col: 5, size: 'medium' },
    { row: 2, col: 1, size: 'wide' },
    { row: 2, col: 5, size: 'medium' },
    { row: 3, col: 1, size: 'medium' },
    { row: 3, col: 3, size: 'medium' },
    { row: 3, col: 5, size: 'medium' },
    { row: 4, col: 1, size: 'medium' },
    { row: 4, col: 3, size: 'wide' },
    { row: 5, col: 1, size: 'medium' },
    { row: 5, col: 3, size: 'medium' },
    { row: 5, col: 5, size: 'medium' },
] as const;

const createBalancedGrid = (projects: Project[]): Project[] => {
    const sortedProjects = [...projects].sort((a, b) => {
        if (a.data.featured && !b.data.featured) return -1;
        if (!a.data.featured && b.data.featured) return 1;
        return b.data.year - a.data.year;
    });

    return sortedProjects.map((project, index) => {
        if (project.data.gridSize) return project;

        if (project.data.featured && index === 0) {
            return { ...project, data: { ...project.data, gridSize: 'wide' } };
        }

        const templatePos = index % GRID_TEMPLATE.length;
        const size = GRID_TEMPLATE[templatePos].size as GridSize;
        return { ...project, data: { ...project.data, gridSize: size } };
    });
};

// Main component
const Projects: Component<{ allProducts: Project[] }> = ({ allProducts }) => {
    const [projects, setProjects] = createSignal<Project[]>([]);
    const [filter, setFilter] = createSignal<FilterOption>('featured');
    const [isAnimating, setIsAnimating] = createSignal(false);
    const [headerVisible, setHeaderVisible] = createSignal(false);
    const [filtersVisible, setFiltersVisible] = createSignal(false);
    const [gridHeight, setGridHeight] = createSignal<number | null>(null);
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
                animateHeader();
            }
            return entry.isIntersecting;
        }),
    );

    createEffect(() => {
        if (projectsContainer && !gridHeight()) {
            setGridHeight(projectsContainer.offsetHeight);
        }
    });

    const animateHeader = () => {
        if (!preHeader || !header) return;

        preHeader.style.cssText = 'opacity: 0; transform: translateY(20px);';
        header.style.cssText = 'opacity: 0; transform: translateY(20px);';

        requestAnimationFrame(() => {
            headerAnimation = timeline([
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
            ]);

            headerAnimation.finished.then(() => {
                setHeaderAnimationComplete(true);
            });

            setFiltersVisible(true);
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

    const applyFilter = (option: FilterOption) => {
        const productsWithGridSize = createBalancedGrid(allProducts);
        let filteredProducts: Project[] = [];

        switch (option) {
            case 'all':
                filteredProducts = productsWithGridSize;
                break;
            case 'featured':
                filteredProducts = productsWithGridSize.filter((p) => p.data.featured);
                break;
            case 'frontend':
                filteredProducts = productsWithGridSize.filter((p) => p.data.tasks.includes('Frontend'));
                break;
            case 'backend':
                filteredProducts = productsWithGridSize.filter((p) => p.data.tasks.includes('Backend'));
                break;
            case 'product design':
                filteredProducts = productsWithGridSize.filter((p) => p.data.tasks.includes('Produktdesign'));
                break;
        }

        if (filteredProducts.length === 0) filteredProducts = productsWithGridSize;
        setProjects(filteredProducts);

        setTimeout(() => {
            if (projectsContainer) {
                projectsContainer.style.height = 'auto';
                projectsContainer.style.minHeight = '0';
                setGridHeight(projectsContainer.offsetHeight);
            }
            setIsAnimating(false);
        }, 300);
    };

    const handleFilterChange = (option: FilterOption) => {
        if (isAnimating() || filter() === option) return;

        setIsAnimating(true);
        setFilter(option);

        if (projectsContainer && gridHeight()) {
            projectsContainer.style.height = `${gridHeight()}px`;
            projectsContainer.style.minHeight = `${gridHeight()}px`;
        }

        const projectCards = document.querySelectorAll('.h-full.w-full.perspective-2000');
        if (projectCards.length === 0) {
            applyFilter(option);
            return;
        }

        projectCards.forEach((card) => {
            (card as HTMLElement).style.pointerEvents = 'none';
            (card as HTMLElement).style.willChange = 'transform, opacity, filter';
        });

        const exitAnimation = animate(
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
        );

        exitAnimation.finished.then(() => applyFilter(option)).catch(() => applyFilter(option));
    };

    onMount(() => {
        allProducts.sort((a, b) => b.data.year - a.data.year);
        const productsWithGridSize = createBalancedGrid(allProducts);
        const featuredProducts = productsWithGridSize
            .filter((p) => p.data.featured)
            .sort((a, b) => b.data.year - a.data.year);

        setProjects(featuredProducts.length > 0 ? featuredProducts : productsWithGridSize);

        if (preHeader) {
            preHeader.style.cssText = 'opacity: 0; transform: translateY(20px);';
            useHeaderVisibilityObserver(() => preHeader);
        }
    });

    onCleanup(() => {
        headerAnimation?.stop();
    });

    // Filter options configuration
    const filterOptions: { value: FilterOption; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'featured', label: 'Featured' },
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'product design', label: 'Product Design' },
    ];

    return (
        <section class="relative z-3 overflow-hidden py-24" id="portfolio">
            <div class="absolute -top-[100px] -right-[200px] z-[-1] h-[500px] w-[500px] rounded-full bg-blue-500/8 opacity-80 blur-[120px] transition-all duration-800 ease-out"></div>
            <div class="absolute -bottom-[50px] -left-[150px] z-[-1] h-[400px] w-[400px] rounded-full bg-orange-500/8 opacity-80 blur-[100px] transition-all duration-800 ease-out"></div>

            <div class="mx-auto w-full max-w-7xl px-6">
                {/* Header */}
                <div class="mb-16 w-full max-w-7xl text-left">
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
                <div
                    class={`mb-12 flex w-full max-w-7xl flex-wrap gap-4 transition-opacity duration-500 ${filtersVisible() ? 'opacity-100' : 'opacity-0'}`}
                >
                    {filterOptions.map((option, index) => (
                        <TagButton
                            ref={(el) => (filterButtons[index] = el)}
                            label={option.label}
                            isActive={filter() === option.value}
                            onClick={() => handleFilterChange(option.value)}
                        />
                    ))}
                </div>

                {/* Projects grid with transition */}
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
