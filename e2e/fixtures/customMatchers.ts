import { test } from '@playwright/test';

export const customMatchers = {
    toBeUpperCase(this: any, actual: string) {
        test.info().annotations.push({ type: 'actual', description: actual });
        
        const pass = actual.split(' ').every((letter) => letter === letter.toUpperCase());
        return {
            pass,
            message: () =>
                pass
                    ? `Expected all letters are uppercase`
                    : `Expected all letters are uppercase, but it doesn't.`,
        };
    },
};