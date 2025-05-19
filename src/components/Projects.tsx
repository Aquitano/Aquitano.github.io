import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { animate, spring, stagger, timeline, type Easing } from 'motion';
import { For, Show, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import './Projects.scss';

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
    };
};
export interface ItemProps {
    title: string;
    name: string;
    url: string;
    isNew?: boolean;
    year: number;
    classes?: string;
    tags?: string[];
    index: number;
}

// Array of gradient backgrounds for cards
const cardBackgrounds = [
    'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(135deg, #007adf 0%, #00ecbc 100%)',
    'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
    'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

// Animation options to maintain consistency
const animationConfig = {
    entrance: {
        duration: 0.6,
        easing: [0.25, 0.1, 0.25, 1] as Easing,
    },
    exit: {
        duration: 0.4,
        easing: [0.4, 0.0, 0.2, 1] as Easing,
    },
    staggerDelay: 0.05,
};

function Item(props: Readonly<ItemProps>) {
    const newClass = props.isNew ? 'project-new' : '';
    const backgroundIndex = props.index % cardBackgrounds.length;

    let ref: HTMLDivElement | undefined;
    let cardRef: HTMLAnchorElement | undefined;
    let animationController: ReturnType<typeof animate> | null = null;

    onMount(() => {
        if (ref) {
            // Set initial state
            ref.style.opacity = '0';
            ref.style.transform = 'translateY(20px)';
            ref.style.willChange = 'transform, opacity';

            // Use timeline for precise animation control
            requestAnimationFrame(() => {
                if (ref) {
                    animationController = animate(
                        ref,
                        {
                            opacity: [0, 1],
                            transform: ['translateY(20px)', 'translateY(0)'],
                        },
                        {
                            duration: animationConfig.entrance.duration,
                            delay: props.index * animationConfig.staggerDelay,
                            easing: animationConfig.entrance.easing,
                        },
                    );

                    animationController.finished.then(() => {
                        if (ref) {
                            ref.style.opacity = '1';
                            ref.style.transform = 'translateY(0)';

                            // Remove will-change after animation completes
                            setTimeout(() => {
                                if (ref) ref.style.willChange = 'auto';
                            }, 200);
                        }
                    });
                }
            });
        }

        onCleanup(() => {
            if (animationController) animationController.stop();
        });
    });

    return (
        <div class="project-card-container" classList={{ wide: props.classes?.includes('wide') }}>
            <div class="project-card" ref={ref}>
                <a
                    ref={cardRef}
                    href={props.url}
                    class={`${newClass} project-link`}
                    rel="prefetch"
                    style={{
                        background: cardBackgrounds[backgroundIndex],
                        // Add hardware acceleration hints
                        'transform-style': 'preserve-3d',
                        transform: 'translateZ(0)',
                    }}
                >
                    <Show when={props.isNew}>
                        <div class="project-new-badge-container">
                            <i class="project-new">new</i>
                            <svg viewBox="0 0 100 100" class="project-circle">
                                <circle cx="50" cy="50" r="47" stroke-width="6" />
                            </svg>
                        </div>
                    </Show>
                    <div class="project-image-overlay"></div>
                    <div class="project-content">
                        <span class="project-year">{props.year}</span>
                        <h2 class="project-title">{props.title}</h2>
                        <div class="project-tags">
                            {props.tags?.map((tag) => <span class="project-tag">{tag}</span>)}
                        </div>
                        <div class="project-more-info">
                            <span>View Project</span>
                            <span class="project-arrow-icon">→</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

type FilterOption = 'all' | 'featured' | 'frontend' | 'backend' | 'product design';

const Projects: Component<{ allProducts: Project[] }> = ({ allProducts }) => {
    const [products, setProducts] = createSignal<Project[]>([]);
    const [filter, setFilter] = createSignal<FilterOption>('featured');
    const currentYear = new Date().getFullYear();
    const [isAnimating, setIsAnimating] = createSignal(false);

    let preHeader: HTMLParagraphElement | undefined;
    let header: HTMLHeadingElement | undefined;
    let filterContainer: HTMLDivElement | undefined;
    let projectsContainer: HTMLDivElement | undefined;
    let filterButtons: HTMLButtonElement[] = [];

    // Animation controllers for cleanup
    let headerAnimation: any = null;
    let cardsAnimation: any = null;

    // Use Intersection Observer for progressive loading
    const useVisibilityObserver = createVisibilityObserver(
        { threshold: 0.1 },
        withOccurrence((entry, { occurrence }) => {
            if (occurrence === 'Entering') {
                entry?.target.classList.add('is-visible');
            }
            return entry.isIntersecting;
        }),
    );

    useVisibilityObserver(() => preHeader);
    useVisibilityObserver(() => header);
    useVisibilityObserver(() => filterContainer);
    useVisibilityObserver(() => projectsContainer);

    onCleanup(() => {
        if (headerAnimation) headerAnimation.stop();
        if (cardsAnimation) cardsAnimation.stop();
    });

    onMount(() => {
        // Sort all products by year
        allProducts.sort((a, b) => b.data.year - a.data.year);

        // Set featured products initially
        const allFeaturedProducts = allProducts
            .filter((product) => product.data.featured === true)
            .sort((a, b) => b.data.year - a.data.year);

        // Set products immediately to prevent empty state
        setProducts(allFeaturedProducts.length > 0 ? allFeaturedProducts : allProducts);

        // Initialize elements with proper styles
        if (preHeader) {
            preHeader.style.opacity = '0';
            preHeader.style.transform = 'translateY(15px)';
        }

        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(15px)';
        }

        filterButtons.forEach((button) => {
            if (button) {
                button.style.opacity = '0';
                button.style.transform = 'translateY(10px)';
            }
        });

        if (projectsContainer) {
            projectsContainer.style.opacity = '0';
        }

        // Animate header elements with timeline for precise sequencing
        requestAnimationFrame(() => {
            if (preHeader && header && projectsContainer) {
                headerAnimation = timeline([
                    [
                        preHeader,
                        { opacity: [0, 1], transform: ['translateY(15px)', 'translateY(0)'] },
                        { duration: 0.6, easing: animationConfig.entrance.easing },
                    ],
                    [
                        header,
                        { opacity: [0, 1], transform: ['translateY(15px)', 'translateY(0)'] },
                        { duration: 0.6, at: '-0.3' },
                    ],
                    [
                        filterButtons,
                        { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0)'] },
                        { duration: 0.5, at: '-0.1', delay: stagger(0.05) },
                    ],
                    [projectsContainer, { opacity: [0, 1] }, { duration: 0.6, at: '-0.2' }],
                ]);
            }
        });
    });

    const handleFilterChange = (option: FilterOption) => {
        // Don't do anything if already filtering or option is the same
        if (isAnimating() || filter() === option) return;

        // Set animating state to prevent multiple filter clicks
        setIsAnimating(true);
        setFilter(option);

        // Get current cards
        const projectCards = document.querySelectorAll('.project-card');

        // Skip animation if no cards exist
        if (projectCards.length === 0) {
            applyFilter(option);
            return;
        }

        // Prepare all cards for exit animation
        projectCards.forEach((card) => {
            (card as HTMLElement).style.pointerEvents = 'none';
            (card as HTMLElement).style.willChange = 'transform, opacity';
        });

        // Create a unified exit animation for all cards
        const exitAnimation = animate(
            projectCards,
            {
                opacity: [null, 0],
                transform: [null, 'translateY(-10px)'],
                filter: [null, 'blur(2px)'],
            },
            {
                duration: animationConfig.exit.duration,
                easing: animationConfig.exit.easing,
                delay: stagger(0.03),
            },
        );

        // When exit animation completes, update the filtered content
        exitAnimation.finished
            .then(() => {
                applyFilter(option);
            })
            .catch(() => {
                // Fallback in case animation fails
                applyFilter(option);
            });
    };

    const applyFilter = (option: FilterOption) => {
        let filteredProducts: Project[] = [];

        switch (option) {
            case 'all':
                filteredProducts = allProducts;
                break;
            case 'featured':
                filteredProducts = allProducts.filter((product) => product.data.featured === true);
                break;
            case 'frontend':
                filteredProducts = allProducts.filter((product) => product.data.tasks.includes('Frontend'));
                break;
            case 'backend':
                filteredProducts = allProducts.filter((product) => product.data.tasks.includes('Backend'));
                break;
            case 'product design':
                filteredProducts = allProducts.filter((product) => product.data.tasks.includes('Produktdesign'));
                break;
        }

        // If no products match the filter, show all products
        if (filteredProducts.length === 0) {
            filteredProducts = allProducts;
        }

        // Update the product list
        setProducts(filteredProducts);

        // Ensure DOM has time to update with new content
        requestAnimationFrame(() => {
            // Allow browser to paint the new DOM
            setTimeout(() => {
                const newCards = document.querySelectorAll('.project-card');

                if (newCards.length === 0) {
                    setIsAnimating(false);
                    return;
                }

                // Prepare new cards for animation
                newCards.forEach((card) => {
                    (card as HTMLElement).style.opacity = '0';
                    (card as HTMLElement).style.transform = 'translateY(20px)';
                    (card as HTMLElement).style.filter = 'blur(2px)';
                    (card as HTMLElement).style.willChange = 'transform, opacity, filter';
                    (card as HTMLElement).style.pointerEvents = '';
                });

                // Create staggered entrance animation for all new cards
                cardsAnimation = animate(
                    newCards,
                    {
                        opacity: [0, 1],
                        transform: ['translateY(20px)', 'translateY(0)'],
                        filter: ['blur(2px)', 'blur(0)'],
                    },
                    {
                        duration: animationConfig.entrance.duration,
                        easing: animationConfig.entrance.easing,
                        delay: stagger(animationConfig.staggerDelay),
                    },
                );

                cardsAnimation.finished
                    .then(() => {
                        // Cleanup after animation completes
                        newCards.forEach((card) => {
                            (card as HTMLElement).style.willChange = 'auto';
                            (card as HTMLElement).style.transform = 'translateY(0)';
                            (card as HTMLElement).style.opacity = '1';
                            (card as HTMLElement).style.filter = 'blur(0)';
                        });
                        setIsAnimating(false);
                    })
                    .catch(() => {
                        // Ensure we reset state even if animation fails
                        newCards.forEach((card) => {
                            (card as HTMLElement).style.willChange = 'auto';
                            (card as HTMLElement).style.transform = 'translateY(0)';
                            (card as HTMLElement).style.opacity = '1';
                            (card as HTMLElement).style.filter = 'blur(0)';
                        });
                        setIsAnimating(false);
                    });
            }, 10); // Small delay for DOM updates
        });
    };

    return (
        <section class="projects-section" id="portfolio">
            <div class="projects-container">
                <div class="projects-header">
                    <p class="projects-pre-header" ref={preHeader}>
                        Meine
                    </p>
                    <h1 class="projects-title" ref={header}>
                        Projekte
                    </h1>
                </div>

                <div class="projects-filter-container" ref={filterContainer}>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`projects-filter-btn ${filter() === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        All
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`projects-filter-btn ${filter() === 'featured' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('featured')}
                    >
                        Featured
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`projects-filter-btn ${filter() === 'frontend' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('frontend')}
                    >
                        Frontend
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`projects-filter-btn ${filter() === 'backend' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('backend')}
                    >
                        Backend
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`projects-filter-btn ${filter() === 'product design' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('product design')}
                    >
                        Product Design
                    </button>
                </div>

                <div class="projects-grid" ref={projectsContainer}>
                    {products().length > 0 ? (
                        <For each={products()} fallback={<div class="projects-loading">Loading...</div>}>
                            {(product, index) => (
                                <Item
                                    title={product.data.title}
                                    name={product.data.name}
                                    year={product.data.year}
                                    isNew={product.data.year === currentYear}
                                    url={`project/${product.slug}`}
                                    classes={Number(index()) % 2 === 1 ? 'wide' : 'normal'}
                                    tags={product.data.tags}
                                    index={index()}
                                />
                            )}
                        </For>
                    ) : (
                        <div class="projects-loading">No projects found</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Projects;
