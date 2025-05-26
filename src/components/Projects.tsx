/*
 * Projects Component with Dynamic Grid and Viewport Animations
 *
 * New Features:
 * 1. Viewport-based animations - Cards and title only appear when scrolled into view
 * 2. Dynamic grid sizing - Cards can have different sizes for more interesting layouts
 *
 * Grid Size Options:
 * - 'small': 320px height, single column
 * - 'medium': 380px height, single column (default)
 * - 'large': 440px height, single column
 * - 'wide': spans 2 columns on larger screens
 * - 'tall': 480-500px height, single column
 *
 * Example usage in project data:
 * {
 *   data: {
 *     title: "My Project",
 *     gridSize: "wide", // Makes this card span 2 columns
 *     // ... other project data
 *   }
 * }
 */

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
        gridSize?: 'small' | 'medium' | 'large' | 'wide' | 'tall'; // New grid size option
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
    gridSize?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
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

// Grid size patterns for dynamic layouts - creating a more balanced layout
const gridSizePatterns: ('small' | 'medium' | 'large' | 'wide' | 'tall')[] = [
    'medium',
    'wide',
    'small', // First row: medium, wide (spans 2), small
    'tall',
    'medium',
    'medium', // Second row: tall, medium, medium
    'small',
    'large',
    'medium', // Third row: small, large, medium
    'wide',
    'small',
    'medium', // Fourth row: wide (spans 2), small, medium
    'medium',
    'tall',
    'small', // Fifth row: medium, tall, small
];

// Animation options to maintain consistency
const animationConfig = {
    entrance: {
        duration: 0.8,
        easing: [0.25, 0.1, 0.25, 1] as Easing,
    },
    exit: {
        duration: 0.4,
        easing: [0.4, 0.0, 0.2, 1] as Easing,
    },
    staggerDelay: 0.1,
    viewportThreshold: 0.15,
};

// Helper function to create a balanced grid layout
const assignGridSizes = (products: Project[]): Project[] => {
    // Sort by featured first, then by year
    const sortedProducts = [...products].sort((a, b) => {
        if (a.data.featured && !b.data.featured) return -1;
        if (!a.data.featured && b.data.featured) return 1;
        return b.data.year - a.data.year;
    });

    // Create a more balanced grid by strategically assigning sizes
    return sortedProducts.map((product, index) => {
        // If product already has a gridSize, keep it
        if (product.data.gridSize) {
            return product;
        }

        // Featured products get more prominent sizes
        if (product.data.featured) {
            // First featured item is wide, others alternate between medium and tall
            if (index === 0) {
                return {
                    ...product,
                    data: {
                        ...product.data,
                        gridSize: 'wide',
                    },
                };
            } else {
                // Alternate between medium and tall for other featured items
                const featuredSize: 'small' | 'medium' | 'large' | 'wide' | 'tall' =
                    index % 2 === 0 ? 'medium' : 'tall';
                return {
                    ...product,
                    data: {
                        ...product.data,
                        gridSize: featuredSize,
                    },
                };
            }
        }

        // For non-featured products, create a balanced pattern
        // We'll use a 6-item pattern that repeats and creates a visually balanced grid
        // This pattern ensures we don't have too many large items in sequence
        // and that the grid maintains a consistent rhythm
        const pattern: ('small' | 'medium' | 'large' | 'wide' | 'tall')[] = [
            'medium',
            'medium',
            'small', // First row: medium, medium, small (spans 2+2+2 columns)
            'medium',
            'small',
            'medium', // Second row: medium, small, medium (spans 2+2+2 columns)
            'wide',
            'small', // Third row: wide, small (spans 4+2 columns)
            'medium',
            'medium',
            'medium', // Fourth row: medium, medium, medium (spans 2+2+2 columns)
            'small',
            'tall',
            'small', // Fifth row: small, tall, small (spans 2+2+2 columns)
            'medium',
            'large',
            'small', // Sixth row: medium, large, small (spans 2+2+2 columns)
        ];

        const nonFeaturedIndex = index - sortedProducts.filter((p) => p.data.featured).length;
        const size = pattern[nonFeaturedIndex % pattern.length];

        return {
            ...product,
            data: {
                ...product.data,
                gridSize: size,
            },
        };
    });
};

function Item(props: Readonly<ItemProps>) {
    const newClass = props.isNew ? 'project-new' : '';
    const backgroundIndex = props.index % cardBackgrounds.length;
    const gridSize = props.gridSize || 'medium';

    let ref: HTMLDivElement | undefined;
    let cardRef: HTMLAnchorElement | undefined;
    let animationController: ReturnType<typeof animate> | null = null;
    const [hasAnimated, setHasAnimated] = createSignal(false);

    // Viewport-based animation using intersection observer
    const useVisibilityObserver = createVisibilityObserver(
        { threshold: animationConfig.viewportThreshold },
        withOccurrence((entry, { occurrence }) => {
            if (occurrence === 'Entering' && !hasAnimated()) {
                animateIn();
                setHasAnimated(true);
            }
            return entry.isIntersecting;
        }),
    );

    const animateIn = () => {
        if (ref && !hasAnimated()) {
            // Set initial state
            ref.style.opacity = '0';
            ref.style.transform = 'translateY(30px) scale(0.95)';
            ref.style.filter = 'blur(4px)';
            ref.style.willChange = 'transform, opacity, filter';

            // Create entrance animation
            requestAnimationFrame(() => {
                if (ref) {
                    animationController = animate(
                        ref,
                        {
                            opacity: [0, 1],
                            transform: ['translateY(30px) scale(0.95)', 'translateY(0) scale(1)'],
                            filter: ['blur(4px)', 'blur(0px)'],
                        },
                        {
                            duration: animationConfig.entrance.duration,
                            delay: (props.index % 6) * animationConfig.staggerDelay,
                            easing: animationConfig.entrance.easing,
                        },
                    );

                    animationController.finished.then(() => {
                        if (ref) {
                            ref.style.opacity = '1';
                            ref.style.transform = 'translateY(0) scale(1)';
                            ref.style.filter = 'blur(0px)';
                            ref.style.willChange = 'auto';
                        }
                    });
                }
            });
        }
    };

    onMount(() => {
        if (ref) {
            // Set initial hidden state
            ref.style.opacity = '0';
            ref.style.transform = 'translateY(30px) scale(0.95)';
            ref.style.filter = 'blur(4px)';

            // Attach intersection observer
            useVisibilityObserver(() => ref);
        }

        onCleanup(() => {
            if (animationController) animationController.stop();
        });
    });

    return (
        <div
            class="project-card-container"
            classList={{
                small: gridSize === 'small',
                medium: gridSize === 'medium',
                large: gridSize === 'large',
                wide: gridSize === 'wide',
                tall: gridSize === 'tall',
            }}
        >
            <div class="project-card" ref={ref}>
                <a
                    ref={cardRef}
                    href={props.url}
                    class={`${newClass} project-link`}
                    rel="prefetch"
                    style={{
                        background: cardBackgrounds[backgroundIndex],
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
    const [headerVisible, setHeaderVisible] = createSignal(false);

    let preHeader: HTMLParagraphElement | undefined;
    let header: HTMLHeadingElement | undefined;
    let filterContainer: HTMLDivElement | undefined;
    let projectsContainer: HTMLDivElement | undefined;
    let filterButtons: HTMLButtonElement[] = [];

    // Animation controllers for cleanup
    let headerAnimation: any = null;
    let cardsAnimation: any = null;

    // Header visibility observer
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

    const animateHeader = () => {
        if (preHeader && header && filterContainer) {
            // Set initial states
            preHeader.style.opacity = '0';
            preHeader.style.transform = 'translateY(20px)';
            header.style.opacity = '0';
            header.style.transform = 'translateY(25px)';

            filterButtons.forEach((button, index) => {
                if (button) {
                    button.style.opacity = '0';
                    button.style.transform = 'translateY(15px)';
                }
            });

            // Animate header elements with timeline
            requestAnimationFrame(() => {
                headerAnimation = timeline([
                    [
                        preHeader,
                        { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0)'] },
                        { duration: 0.8, easing: animationConfig.entrance.easing },
                    ],
                    [
                        header,
                        { opacity: [0, 1], transform: ['translateY(25px)', 'translateY(0)'] },
                        { duration: 0.8, at: '-0.4' },
                    ],
                    [
                        filterButtons,
                        { opacity: [0, 1], transform: ['translateY(15px)', 'translateY(0)'] },
                        { duration: 0.6, at: '-0.2', delay: stagger(0.08) },
                    ],
                ]);
            });
        }
    };

    onCleanup(() => {
        if (headerAnimation) headerAnimation.stop();
        if (cardsAnimation) cardsAnimation.stop();
    });

    onMount(() => {
        // Sort all products by year
        allProducts.sort((a, b) => b.data.year - a.data.year);

        // Assign dynamic grid sizes to products for more interesting layouts
        const productsWithGridSize: Project[] = assignGridSizes(allProducts);

        // Set featured products initially
        const allFeaturedProducts = productsWithGridSize
            .filter((product) => product.data.featured === true)
            .sort((a, b) => b.data.year - a.data.year);

        // Set products immediately to prevent empty state
        setProducts(allFeaturedProducts.length > 0 ? allFeaturedProducts : productsWithGridSize);

        // Initialize header elements with hidden state
        if (preHeader) {
            preHeader.style.opacity = '0';
            preHeader.style.transform = 'translateY(20px)';
            useHeaderVisibilityObserver(() => preHeader);
        }
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
            (card as HTMLElement).style.willChange = 'transform, opacity, filter';
        });

        // Create a unified exit animation for all cards
        const exitAnimation = animate(
            projectCards,
            {
                opacity: [null, 0],
                transform: [null, 'translateY(-15px) scale(0.95)'],
                filter: [null, 'blur(4px)'],
            },
            {
                duration: animationConfig.exit.duration,
                easing: animationConfig.exit.easing,
                delay: stagger(0.04),
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

        // Apply grid sizes to all products first
        const productsWithGridSize: Project[] = assignGridSizes(allProducts);

        switch (option) {
            case 'all':
                filteredProducts = productsWithGridSize;
                break;
            case 'featured':
                filteredProducts = productsWithGridSize.filter((product) => product.data.featured === true);
                break;
            case 'frontend':
                filteredProducts = productsWithGridSize.filter((product) => product.data.tasks.includes('Frontend'));
                break;
            case 'backend':
                filteredProducts = productsWithGridSize.filter((product) => product.data.tasks.includes('Backend'));
                break;
            case 'product design':
                filteredProducts = productsWithGridSize.filter((product) =>
                    product.data.tasks.includes('Produktdesign'),
                );
                break;
        }

        // If no products match the filter, show all products
        if (filteredProducts.length === 0) {
            filteredProducts = productsWithGridSize;
        }

        // Update the product list
        setProducts(filteredProducts);

        // Reset animation state for new cards
        setTimeout(() => {
            setIsAnimating(false);
        }, 100);
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
                                    classes={product.data.gridSize}
                                    tags={product.data.tags}
                                    index={index()}
                                    gridSize={product.data.gridSize}
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
