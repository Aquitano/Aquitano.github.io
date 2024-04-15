import { createVisibilityObserver, withOccurrence } from '@solid-primitives/intersection-observer';
import { For, Show, createSignal, onMount, type Component } from 'solid-js';
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
    animation: 'fly-in-right' | 'fly-in-left';
    observable: any;
}

function Item(props: Readonly<ItemProps>) {
    const newClass = props.isNew ? 'new' : '';

    let ref: HTMLDivElement | undefined;
    props.observable(() => ref);

    return (
        <div class={`list-item-portfolio i-v will-change ${props.animation}`} ref={ref}>
            <a href={props.url} class={newClass} rel="prefetch">
                <Show when={props.isNew}>
                    <div>
                        <i class="new dark-bg">new</i>
                        <svg viewBox="0 0 100 100" class="circle">
                            <circle cx="50" cy="50" r="47" stroke-width="6" />
                        </svg>
                    </div>
                </Show>
                <div>
                    <img
                        alt="BetterGaming - Designed by rawpixel.com / Freepik"
                        width="703px"
                        height="838px"
                        src={`images/${props.name}.jpg`}
                        loading="lazy"
                    />
                </div>
                <strong class="regular white-bg">
                    <span class="h5">{props.year}</span>
                    <span class="h2 with-badge font-extrabold">{props.title}</span>
                    <span class="more with-icon">
                        <p>
                            Mehr erfahren!
                            <span class="icon icon-arrow-link-thin icon--on-right">
                                <svg>
                                    <use href="#icon_arrow_link--thin"></use>
                                </svg>
                            </span>
                        </p>
                    </span>
                </strong>
                <strong class="action">
                    <span class="h5">{props.year}</span>
                    <span class="h2 with-badge font-extrabold">{props.title}</span>
                    <span class="more with-icon">
                        <p>
                            Mehr erfahren!
                            <span class="icon icon-arrow-link-thin icon--on-right">
                                <svg>
                                    {' '}
                                    <use href="#icon_arrow_link--thin"></use>
                                </svg>
                            </span>
                        </p>
                    </span>
                </strong>
            </a>
        </div>
    );
}

type FilterOption = 'all' | 'featured' | 'frontend' | 'backend' | 'product design';

const Projects: Component<{ allProducts: Project[] }> = ({ allProducts }) => {
    const [products, setProducts] = createSignal<Project[]>([]);
    const [filter, setFilter] = createSignal<FilterOption>('featured');
    const currentYear = new Date().getFullYear();

    let preHeader: HTMLParagraphElement | undefined;
    let header: HTMLHeadingElement | undefined;

    let filterButtons: HTMLButtonElement[] = [];

    const useVisibilityObserver = createVisibilityObserver(
        { threshold: 0.1 },
        withOccurrence((entry, { occurrence }) => {
            if (occurrence === 'Entering') {
                entry?.target.classList.add('is-visible');
                entry?.target.classList.remove('will-change');
            }
            return entry.isIntersecting;
        }),
    );
    useVisibilityObserver(() => preHeader);
    useVisibilityObserver(() => header);

    onMount(() => {
        (async () => {
            const allFeaturedProducts = allProducts.filter((product) => product.data.featured === true);

            setProducts(allFeaturedProducts);
        })();
        filterButtons.forEach((button) => {
            useVisibilityObserver(() => button);
        });
    });

    const handleFilterChange = (option: FilterOption) => {
        setFilter(option);
        setProducts([]);

        switch (option) {
            case 'all':
                setProducts(allProducts);
                break;
            case 'featured':
                setProducts(allProducts.filter((product) => product.data.featured === true));
                break;
            case 'frontend':
                setProducts(allProducts.filter((product) => product.data.tasks.includes('Frontend')));
                break;
            case 'backend':
                setProducts(allProducts.filter((product) => product.data.tasks.includes('Backend')));
                break;
            case 'product design':
                setProducts(allProducts.filter((product) => product.data.tasks.includes('Produktdesign')));
                break;
        }

        filterButtons.forEach((button) => {
            button.classList.add('is-visible');
        });
    };

    return (
        <section class="home-portfolio" id="portfolio">
            <div class="wrapper">
                <div class="fly-in-up">
                    <p class="pre-header fly-in-up i-v font-semibold" ref={preHeader}>
                        Meine
                    </p>
                    <h1 class="large fly-in-up i-v" ref={header}>
                        Projekte
                    </h1>
                </div>
                <div class="mb-4 mt-[2rem] flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`filterOption i-v fly-in-up w-full rounded-lg px-4 py-2 shadow-md transition-all duration-500 ease-out md:w-auto ${
                            filter() === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-400'
                        } hover:shadow-lg`}
                        onClick={() => handleFilterChange('all')}
                    >
                        All
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`filterOption i-v fly-in-up w-full transform rounded-lg px-4 py-2 shadow-md transition-all duration-500 ease-out md:w-auto ${
                            filter() === 'featured' ? ' bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-400'
                        } hover:shadow-lg`}
                        onClick={() => handleFilterChange('featured')}
                    >
                        Featured
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`filterOption i-v fly-in-up w-full transform rounded-lg px-4 py-2 shadow-md transition-all duration-500 ease-out md:w-auto ${
                            filter() === 'frontend' ? ' bg-blue-500 text-white' : 'bg-gray-200  hover:bg-gray-400'
                        } hover:shadow-lg`}
                        onClick={() => handleFilterChange('frontend')}
                    >
                        Frontend
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`filterOption i-v fly-in-up w-full transform rounded-lg px-4 py-2 shadow-md transition-all duration-500 ease-out md:w-auto ${
                            filter() === 'backend' ? ' bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-400'
                        } hover:shadow-lg`}
                        onClick={() => handleFilterChange('backend')}
                    >
                        Backend
                    </button>
                    <button
                        ref={(el) => filterButtons.push(el)}
                        class={`filterOption i-v fly-in-up w-full transform rounded-lg px-4 py-2 shadow-md transition-all duration-500 ease-out md:w-auto ${
                            filter() === 'product design' ? ' bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-400'
                        } hover:shadow-lg`}
                        onClick={() => handleFilterChange('product design')}
                    >
                        Product Design
                    </button>
                </div>

                <div class="list">
                    <For each={products()} fallback={<div>Loading...</div>}>
                        {(product, index) => (
                            <Item
                                title={product.data.title}
                                name={product.data.name}
                                year={product.data.year}
                                isNew={product.data.year === currentYear}
                                url={`project/${product.slug}`}
                                animation={Number(index()) % 2 === 1 ? 'fly-in-right' : 'fly-in-left'}
                                observable={useVisibilityObserver}
                            />
                        )}
                    </For>
                </div>
            </div>
        </section>
    );
};

export default Projects;
