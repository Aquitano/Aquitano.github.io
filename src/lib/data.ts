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

export const manifesto =
    'I build software end to end, from an analytics pipeline that handles 100M events a second to Java services rewritten from legacy COBOL and web interfaces I design myself.';

export const experience = [
    {
        company: 'Cloudflare',
        role: 'Software Engineer',
        type: 'Intern · Analytics & Alerts',
        period: 'Jul - Sep 2026',
        highlights: [
            'Shipped a compaction path for an analytics pipeline at 100M events/s that merges aggregates during downstream outages, raising retention from 51% to 77% in controlled outage tests',
            'Built a reproducible fault-injection harness for the full pipeline in Docker that compares retention, CPU, memory, and throughput with compaction on and off before rollout',
            "Wrote a Cloudflare Workers reference integration and Grafana dashboard for the pipeline, now the team's canonical implementation and onboarding example",
        ],
    },
    {
        company: 'itestra',
        role: 'Software Engineer',
        type: 'Intern → Working Student',
        period: 'Mar - Jul 2025 · Oct 2025 - Jun 2026',
        highlights: [
            'Rewrote ~31K LOC of legacy COBOL health-insurance logic in Java/Quarkus, moving batch flows to chunk-oriented Jakarta Batch and cutting code size by 40%',
            'Built an annotation-driven Java library that maps binary COBOL copybook records to typed Java objects, replacing hand-written parsing code across the codebase',
            'Designed an ID allocation scheme that reserves blocks from database sequences, so parallel batch workers never contend on per-record sequence access',
        ],
    },
    {
        company: 'CHECK24',
        role: 'Software Engineer',
        type: 'Intern',
        period: 'Aug - Sep 2025',
        highlights: [
            'Moved non-critical provider calls off the request path onto ActiveMQ/JMS, cutting production P95 initial response latency by 50% to ~150ms in a system handling 1.5M events/day',
            'Added Prometheus metrics and Grafana dashboards for async latency, failures, and per-provider performance',
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

const yearsSince = (year: number) => new Date().getFullYear() - year;

export const stats = [
    { value: yearsSince(2020), suffix: '+', label: 'Years writing JavaScript' },
    { value: yearsSince(2021), suffix: '+', label: 'Years shipping Java' },
    { value: experience.length, suffix: '', label: 'Professional roles' },
];

export const stack = [
    {
        label: 'Backend',
        items: ['Go', 'Java', 'Kotlin', 'Quarkus', 'Spring Boot', 'Jakarta Batch', 'ActiveMQ / JMS', 'SQL'],
    },
    {
        label: 'Frontend',
        items: ['TypeScript', 'React', 'Next.js', 'SolidJS', 'Astro', 'Tailwind'],
    },
    {
        label: 'Infrastructure',
        items: [
            'Docker',
            'Linux',
            'GitHub Actions',
            'Cloudflare Workers',
            'PostgreSQL',
            'ClickHouse',
            'Prometheus',
            'Grafana',
        ],
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
