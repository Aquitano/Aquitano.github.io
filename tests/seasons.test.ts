import { describe, expect, test } from 'bun:test';
import { seasonOn } from '../src/lib/seasons';

const on = (year: number, month: number, day: number) => seasonOn(new Date(year, month - 1, day, 12));

describe('season calendar', () => {
    test('fixed-date seasons start and end on their boundary days', () => {
        expect(on(2026, 10, 3)).toBeUndefined();
        expect(on(2026, 10, 4)).toBe('birthday');
        expect(on(2026, 10, 5)).toBeUndefined();
        expect(on(2026, 10, 23)).toBeUndefined();
        expect(on(2026, 10, 24)).toBe('halloween');
        expect(on(2026, 10, 31)).toBe('halloween');
        expect(on(2026, 11, 1)).toBeUndefined();
        expect(on(2026, 12, 1)).toBe('christmas');
        expect(on(2026, 12, 30)).toBe('christmas');
        expect(on(2026, 12, 31)).toBe('new-year');
        expect(on(2027, 1, 1)).toBe('new-year');
        expect(on(2027, 1, 2)).toBeUndefined();
    });

    test('Easter runs from Good Friday to Easter Monday of each year', () => {
        // Easter Sunday: 28 Mar 2027, 16 Apr 2028.
        expect(on(2027, 3, 25)).toBeUndefined();
        expect(on(2027, 3, 26)).toBe('easter');
        expect(on(2027, 3, 29)).toBe('easter');
        expect(on(2027, 3, 30)).toBeUndefined();
        expect(on(2028, 4, 14)).toBe('easter');
        expect(on(2028, 4, 17)).toBe('easter');
    });

    test("Programmer's Day is the 256th day, a day earlier in leap years", () => {
        expect(on(2027, 9, 12)).toBeUndefined();
        expect(on(2027, 9, 13)).toBe('programmers-day');
        expect(on(2028, 9, 12)).toBe('programmers-day');
        expect(on(2028, 9, 13)).toBeUndefined();
    });

    test('April Fools wins when Easter Sunday falls on 1 April', () => {
        expect(on(2029, 4, 1)).toBe('april-fools');
        expect(on(2029, 4, 2)).toBe('easter');
    });
});
