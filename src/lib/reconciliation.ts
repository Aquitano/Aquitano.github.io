export const reconciliationRules = [
    {
        id: 'steps',
        label: 'Steps',
        result: 'Keep unique intervals. Resolve the overlaps.',
        policy: 'Google Health wins where intervals overlap. Withings still contributes intervals outside that overlap.',
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
        result: 'Keep the night and the nap from Withings.',
        policy: 'For each UTC start date, keep every session from the best-ranked provider. A shorter nap is not discarded.',
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
        result: 'The preferred source changes with context.',
        policy: 'Within a 30-second bin, metric, context, and segment, keep the best-ranked provider’s samples. Sleep context uses the sleep ranking.',
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
