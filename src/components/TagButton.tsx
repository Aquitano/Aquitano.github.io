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
            class={`relative flex h-10 items-center rounded-lg px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-transform duration-200 ease-out will-change-transform ${
                props.isActive
                    ? 'bg-neutral-900 text-white shadow-sm ring-1 ring-black/10'
                    : 'bg-white/70 text-stone-700 ring-1 ring-black/5 hover:bg-white/90 hover:ring-black/10'
            }`}
            onClick={props.onClick}
            aria-pressed={props.isActive}
            type="button"
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {props.label}
        </button>
    );
};

export default TagButton;
