export const site = {
    name: 'Thomas Breindl',
    role: 'Software Developer & Designer',
    status: 'CS Student',
    location: 'Passau, Germany',
    email: 'contact@thomasbreindl.me',
    url: 'https://thomasbreindl.me',
};

export const socials = [
    { label: 'GitHub', handle: '@Aquitano', href: 'https://github.com/Aquitano' },
    {
        label: 'LinkedIn',
        handle: 'thomas-breindl',
        href: 'https://www.linkedin.com/in/thomas-breindl/',
    },
    {
        label: 'X / Twitter',
        handle: '@breindlthomas',
        href: 'https://x.com/breindlthomas',
    },
];

export const stats = [
    { value: 12, suffix: 'K', label: 'Lines of COBOL migrated to Java' },
    { value: 40, suffix: '%', label: 'Codebase reduction on that migration' },
    { value: 3, suffix: '', label: 'Engineering teams shipped with' },
];

export const manifesto =
    'I build software end to end: migrating decades-old COBOL into modern Java services, designing event pipelines that move millions of messages a day, and crafting interfaces that people actually enjoy using.';

export const experience = [
    {
        company: 'itestra GmbH',
        role: 'Software Developer',
        type: 'Intern → Working Student',
        period: 'Mar 2025 - Present',
        highlights: [
            'Migrated ~12K LOC of COBOL contract logic to Java/Quarkus, reducing the codebase by 40%',
            'Validated multi-stage batch workflows (JBeret, Panache, Hibernate) for consistent outputs',
        ],
    },
    {
        company: 'CHECK24',
        role: 'Software Engineer',
        type: 'Intern',
        period: 'Aug - Sep 2025',
        highlights: [
            'Designed an async ActiveMQ pipeline decoupling critical provider responses',
            'Cut P95 latency to ~150ms at 1.5M events/day with new Grafana metrics',
        ],
    },
    {
        company: '4process AG',
        role: 'Software Developer',
        type: 'Intern',
        period: 'Jul - Aug 2024',
        highlights: [
            'Built an internal idea portal with SAP Fiori Elements for structured proposals',
            'Implemented a Java tool for SAP Sales Cloud with >5K validated Excel updates/sec',
        ],
    },
];

export const stack = [
    {
        label: 'Backend',
        items: ['Java', 'Spring Boot', 'Quarkus', 'JPA / Hibernate', 'Node.js', 'Python', 'SQL'],
    },
    {
        label: 'Frontend',
        items: ['TypeScript', 'React', 'Next.js', 'SolidJS', 'Astro', 'Tailwind'],
    },
    {
        label: 'Infrastructure',
        items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Grafana', 'PostgreSQL'],
    },
    {
        label: 'Self-Hosted',
        items: ['NixOS', 'Proxmox', 'Traefik', 'WireGuard', 'Ansible'],
    },
];

export const languages = [
    { label: 'German', level: 'Native' },
    { label: 'English', level: 'C1' },
    { label: 'Latin', level: 'Latinum' },
];

export const focusAreas = [
    'Software Engineering',
    'Interface Design',
    'Distributed Systems',
    'Legacy Modernization',
    'Self-Hosted Infrastructure',
    'Data Visualization',
];
