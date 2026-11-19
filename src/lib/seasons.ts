export type EffectRun = {
    /** False when the visitor switches the season back on, so the effect skips the delays that wait out the hero intro. */
    onLoad: boolean;
    /** Shows the toggle of a `surprise` season, once the surprise is out. */
    reveal: () => void;
};

export type SeasonalEffect = {
    icon: string;
    /** Runs until the signal aborts, then leaves the page as it found it. */
    start: (signal: AbortSignal, run: EffectRun) => void;
};

export type SeasonConfig = {
    label: string;
    awayTitle: string;
    /** Hero effects have nothing to decorate on pages without the home page hero. */
    scope: 'hero' | 'site';
    /** Only a mouse can trigger the effect, so touch screens skip it. */
    mouseOnly?: boolean;
    /** The toggle would give the joke away, so it waits for the effect to call `reveal`. */
    surprise?: boolean;
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
        label: 'Prank',
        awayTitle: '[ totally shipping ] — TB',
        scope: 'hero',
        mouseOnly: true,
        surprise: true,
        loadEffect: () => import('./seasonal/aprilFools'),
    },
    'programmers-day': {
        label: 'Day 0x100',
        awayTitle: '[ day 0x100 ] — TB',
        scope: 'hero',
        loadEffect: () => import('./seasonal/programmersDay'),
    },
    birthday: {
        label: 'Birthday',
        awayTitle: '[ a year older ] — TB',
        scope: 'hero',
        loadEffect: () => import('./seasonal/birthday'),
    },
    easter: {
        label: 'Egg',
        awayTitle: '[ hiding eggs ] — TB',
        scope: 'hero',
        loadEffect: () => import('./seasonal/easter'),
    },
    halloween: {
        label: 'Spider',
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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const midnight = new Date(year, month - 1, day);

    if ((month === 12 && day === 31) || (month === 1 && day === 1)) return 'new-year';

    if (month === 4 && day === 1) return 'april-fools';

    if (month === 10 && day === 4) return 'birthday';

    if (month === 10 && day >= 24) return 'halloween';

    if (month === 12) return 'christmas';

    // January 256 rolls over to the year's 256th day: 13 September, or the 12th in leap years.
    if (midnight.getTime() === new Date(year, 0, 256).getTime()) return 'programmers-day';

    const daysFromEaster = Math.round((midnight.getTime() - easterSunday(year).getTime()) / DAY_MS);

    // Good Friday to Easter Monday, both public holidays in Germany.
    if (daysFromEaster >= -2 && daysFromEaster <= 1) return 'easter';

    return undefined;
}

const previewed = () => {
    const preview = new URLSearchParams(location.search).get('season');

    return isSeason(preview) ? preview : undefined;
};

/** A preview always starts on, and switching it off is not remembered for the real day. */
export const isPreview = () => previewed() !== undefined;

/** The season whose effect can run on this page and device; `?season=christmas` previews one on any day. */
export function seasonForThisPage() {
    const season = previewed() ?? seasonOn(new Date());

    if (!season) return undefined;

    const { scope, mouseOnly }: SeasonConfig = seasons[season];
    const hasHero = document.querySelector('[data-hero]') !== null;
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    return (scope === 'site' || hasHero) && (!mouseOnly || hasMouse) ? season : undefined;
}

// Holds the one season the visitor switched off, so the other seasons still play.
const OFF_KEY = 'seasonal-effects-off';

export function isSwitchedOff(season: Season) {
    try {
        return localStorage.getItem(OFF_KEY) === season;
    } catch {
        return false;
    }
}

export function rememberSwitch(season: Season, on: boolean) {
    try {
        if (on) localStorage.removeItem(OFF_KEY);
        else localStorage.setItem(OFF_KEY, season);
    } catch {
        /* storage blocked */
    }
}
