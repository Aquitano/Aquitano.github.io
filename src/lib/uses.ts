export const usesUpdated = 'July 2026';

export const uses = [
    {
        label: 'Homelab',
        items: [
            { name: 'Proxmox', detail: 'Hypervisor running the whole lab as VMs and containers' },
            { name: 'NixOS', detail: 'Declarative machine configs — every host reproducible from one repo' },
            { name: 'Traefik', detail: 'Reverse proxy and automatic TLS for every internal service' },
            { name: 'WireGuard', detail: 'Private mesh between servers and devices, nothing exposed publicly' },
            { name: 'Ansible', detail: 'Provisioning and one-off orchestration where Nix does not reach' },
            { name: 'Grafana', detail: 'Dashboards and alerting for everything that produces metrics' },
        ],
    },
    {
        label: 'Development',
        items: [
            { name: 'Bun', detail: 'Default JavaScript runtime and package manager' },
            { name: 'Docker', detail: 'Local containers and CI images' },
            { name: 'Kubernetes', detail: 'Orchestration once a project outgrows a single Compose file' },
            { name: 'Terraform', detail: 'Infrastructure as code for anything living in a cloud' },
            { name: 'GitHub Actions', detail: 'CI/CD for every repository, including this site' },
            { name: 'PostgreSQL', detail: 'Default database unless there is a good reason not to' },
        ],
    },
    {
        label: 'This Site',
        items: [
            { name: 'Astro 7', detail: 'Static output, no framework runtime shipped to the browser' },
            { name: 'Tailwind CSS 4', detail: 'Utility styling on top of a small set of custom primitives' },
            { name: 'GSAP', detail: 'Scroll-driven reveals, the sticky project cascade and hero intro' },
            { name: 'Archivo & Geist Mono', detail: 'Variable fonts, self-hosted via Fontsource' },
            { name: 'Netlify', detail: 'Builds and hosting, deployed on every push to main' },
        ],
    },
];
