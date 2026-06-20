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

const yearsSince = (year: number) => new Date().getFullYear() - year;

export const stats = [
    { value: yearsSince(2020), suffix: '+', label: 'Years writing JavaScript' },
    { value: yearsSince(2021), suffix: '+', label: 'Years shipping Java' },
    { value: 3, suffix: '', label: 'Professional roles' },
];

export const manifesto =
    'I build software end to end: migrating decades-old COBOL into modern Java services, designing event pipelines that move millions of messages a day, and crafting interfaces that people actually enjoy using.';

export const experience = [
    {
        company: 'itestra',
        role: 'Software Developer',
        type: 'Intern → Working Student',
        period: 'Mar - Jul 2025 · Oct 2025 - Present',
        highlights: [
            'Reengineered ~21K LOC of legacy COBOL health-insurance logic in Java/Quarkus, migrating batch flows to chunk-oriented Jakarta Batch/JBeret and reducing code size by 40%',
            'Built an annotation-driven Java library that turns binary COBOL copybook data into typed objects, eliminating repetitive parsing across the codebase',
        ],
    },
    {
        company: 'CHECK24',
        role: 'Software Engineer',
        type: 'Intern',
        period: 'Aug - Sep 2025',
        highlights: [
            'Designed an ActiveMQ/JMS pipeline deferring non-critical provider calls off the initial request path, improving response time and downstream load',
            'Cut production P95 latency by 50% to ~150ms across 1.5M daily events, instrumented with Micrometer/Prometheus and Grafana SLO dashboards',
        ],
    },
    {
        company: '4process',
        role: 'Software Developer',
        type: 'Intern',
        period: 'Jul - Aug 2024',
        highlights: [
            'Built an internal idea database with SAP Fiori Elements to streamline proposal and workflow management',
            'Developed a Java tool for SAP Sales Cloud exporting HTML records to Excel, validating >5K bulk edits per second before applying',
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
