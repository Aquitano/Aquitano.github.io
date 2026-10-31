export type SeasonalEffect = {
    icon: string;
    /** Runs until the signal aborts, then leaves the page as it found it. */
    start: (signal: AbortSignal) => void;
};

type SeasonConfig = {
    label: string;
    awayTitle: string;
    /** Hero effects have nothing to decorate on pages without the home page hero. */
    scope: 'hero' | 'site';
    loadEffect: () => Promise<SeasonalEffect>;
};

export const seasons = {
    'new-year': {
        label: 'Fireworks',
        awayTitle: '[ new year, new commits ] — TB',
        scope: 'hero',
        loadEffect: () => import('./seasonal/fireworks'),
    },
    'april-fools': {
        label: 'April Fools prank',
        awayTitle: '[ totally shipping ] — TB',
        scope: 'hero',
        loadEffect: () => import('./seasonal/aprilFools'),
    },
    easter: {
        label: 'Easter egg',
        awayTitle: '[ hiding eggs ] — TB',
        scope: 'hero',
        loadEffect: () => import('./seasonal/easter'),
    },
    halloween: {
        label: 'Halloween effects',
        awayTitle: '[ still haunting ] — TB',
        scope: 'hero',
        loadEffect: () => import('./seasonal/halloween'),
    },
    christmas: {
        label: 'Snow',
        awayTitle: '[ shipping gifts ] — TB',
        scope: 'site',
        loadEffect: () => import('./seasonal/snow'),
    },
} satisfies Record<string, SeasonConfig>;

export type Season = keyof typeof seasons;

const isSeason = (value: string | null): value is Season => value !== null && Object.hasOwn(seasons, value);

const DAY_MS = 86_400_000;

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher); the letters follow its published form.
const easterSunday = (year: number) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n = h + l - 7 * m + 114;

    return new Date(year, Math.floor(n / 31) - 1, (n % 31) + 1);
};

export function seasonOn(date: Date): Season | undefined {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 12 && day === 31) || (month === 1 && day === 1)) return 'new-year';

    if (month === 4 && day === 1) return 'april-fools';

    if (month === 10 && day >= 24) return 'halloween';

    if (month === 12) return 'christmas';

    const midnight = new Date(date.getFullYear(), date.getMonth(), day);
    const daysFromEaster = Math.round((midnight.getTime() - easterSunday(date.getFullYear()).getTime()) / DAY_MS);

    // Good Friday to Easter Monday, both public holidays in Germany.
    if (daysFromEaster >= -2 && daysFromEaster <= 1) return 'easter';

    return undefined;
}

/** `?season=christmas` previews a season on any day. */
export function currentSeason() {
    const preview = new URLSearchParams(location.search).get('season');

    return isSeason(preview) ? preview : seasonOn(new Date());
}
