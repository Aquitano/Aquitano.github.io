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
            class={`relative flex h-12 items-center rounded-xl px-5 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg ${
                props.isActive
                    ? 'bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white/60 text-stone-700 shadow-sm backdrop-blur-sm hover:bg-white/80'
            }`}
            onClick={props.onClick}
        >
            {props.label}
        </button>
    );
};

export default TagButton;
