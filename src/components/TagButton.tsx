import { type Component } from 'solid-js';

export interface TagButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    ref?: (el: HTMLButtonElement) => void;
}

const TagButton: Component<TagButtonProps> = (props) => {
    return (
        <button
            ref={props.ref}
            class={`relative flex h-10 items-center rounded-lg px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-200 ease-out ${
                props.isActive
                    ? 'bg-neutral-900 text-white shadow-sm ring-1 ring-black/10'
                    : 'bg-white/70 text-stone-700 ring-1 ring-black/5 hover:bg-white/90 hover:text-stone-900 hover:ring-black/10'
            }`}
            onClick={props.onClick}
            aria-pressed={props.isActive}
            type="button"
            style={{
                transform: props.isActive ? 'scale(1)' : undefined,
            }}
            onMouseEnter={(e) => {
                if (!props.isActive) {
                    e.currentTarget.style.transform = 'translate3d(0, -2px, 0)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
            }}
        >
            {props.label}
            <span
                class="pointer-events-none absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300 ease-out"
                style={{
                    width: props.isActive ? '60%' : '0%',
                    background: 'var(--color-accent)',
                    opacity: props.isActive ? 1 : 0,
                }}
            />
        </button>
    );
};

export default TagButton;
