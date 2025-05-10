import { test as baseTest, expect, Expect } from '@playwright/test';
import { ApiFixture } from '../API/BaseApi.api';
import { customMatchers } from './customMatchers';

interface CustomMatchers<R = void> {
    toBeUpperCase(): R;
}

interface ExtendedExpect extends Expect {
    <T = any>(value: T): CustomMatchers & Expect<T>;
}

type CustomFixtures = {
    apiFixture: ApiFixture;
    customExpect: ExtendedExpect;
}

export const test = baseTest.extend<CustomFixtures>({
    apiFixture: async ({ request }, use) => {
        const apiFixture = new ApiFixture(request);
        await use(apiFixture);
    },
    customExpect: async ({ }, use) => {
        const customExpect: ExtendedExpect = expect.extend(customMatchers) as unknown as ExtendedExpect;
        await use(customExpect);
    }
});

export { expect };
