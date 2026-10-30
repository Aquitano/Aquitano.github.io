import { PUBLIC_POSTHOG_KEY } from 'astro:env/client';
import type { PostHog } from 'posthog-js';

type AnalyticsEvents = {
    section_viewed: { section: string };
    email_copied: undefined;
    keyboard_shortcuts_toggled: { enabled: boolean };
};

const afterPageLoad = () =>
    new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
    });

const whenIdle = () =>
    new Promise<void>((resolve) => {
        if ('requestIdleCallback' in window) requestIdleCallback(() => resolve(), { timeout: 2000 });
        else setTimeout(resolve, 1000);
    });

const load = async (key: string): Promise<PostHog> => {
    await afterPageLoad();
    await whenIdle();
    const { posthog } = await import('posthog-js');

    // Cookieless and EU-hosted so the site needs no consent banner; /ingest is proxied in vercel.json.
    posthog.init(key, {
        api_host: '/ingest',
        ui_host: 'https://eu.posthog.com',
        defaults: '2026-08-30',
        cookieless_mode: 'always',
        person_profiles: 'never',
        advanced_disable_flags: true,
        disable_session_recording: true,
        disable_surveys: true,
        capture_heatmaps: false,
        capture_dead_clicks: false,
        capture_exceptions: true,
        capture_performance: { web_vitals: true, network_timing: false },
    });

    return posthog;
};

let client: Promise<PostHog> | undefined;

export function initAnalytics() {
    if (PUBLIC_POSTHOG_KEY) client ??= load(PUBLIC_POSTHOG_KEY);
}

export function track<E extends keyof AnalyticsEvents>(
    event: E,
    ...[properties]: AnalyticsEvents[E] extends undefined ? [] : [AnalyticsEvents[E]]
) {
    void client?.then((posthog) => posthog.capture(event, properties));
}

export function trackSectionViews() {
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) continue;
                observer.unobserve(entry.target);
                track('section_viewed', { section: entry.target.dataset.minimap ?? 'unknown' });
            }
        },
        { rootMargin: '0px 0px -50% 0px' },
    );

    for (const section of document.querySelectorAll('[data-minimap]')) observer.observe(section);
}
