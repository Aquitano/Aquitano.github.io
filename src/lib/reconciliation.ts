export const reconciliationRules = [
    {
        id: 'steps',
        label: 'Steps',
        result: 'Keep unique intervals.',
        policy: 'Google Health wins overlaps. Keep the remaining Withings intervals.',
        axis: ['Earlier interval', 'Later interval'],
        tracks: [
            { provider: 'Google Health', segments: [{ start: 1, span: 8, kept: true }] },
            {
                provider: 'Withings',
                segments: [
                    { start: 4, span: 5, kept: false },
                    { start: 10, span: 3, kept: true },
                ],
            },
        ],
    },
    {
        id: 'sleep',
        label: 'Sleep',
        result: 'Keep the night and nap.',
        policy: 'Withings ranks first. Keep all its sessions for the same UTC start date.',
        axis: ['Night session', 'Nap · same UTC start date'],
        tracks: [
            { provider: 'Google Health', segments: [{ start: 1, span: 7, kept: false }] },
            {
                provider: 'Withings',
                segments: [
                    { start: 1, span: 7, kept: true },
                    { start: 10, span: 3, kept: true },
                ],
            },
        ],
    },
    {
        id: 'heart',
        label: 'Heart rate',
        result: 'Rank by context.',
        policy: 'Google Health normally ranks first. Withings ranks first during sleep.',
        axis: ['Normal context', 'Sleep context'],
        tracks: [
            {
                provider: 'Google Health',
                segments: [
                    { start: 1, span: 5, kept: true },
                    { start: 8, span: 5, kept: false },
                ],
            },
            {
                provider: 'Withings',
                segments: [
                    { start: 1, span: 5, kept: false },
                    { start: 8, span: 5, kept: true },
                ],
            },
        ],
    },
];
