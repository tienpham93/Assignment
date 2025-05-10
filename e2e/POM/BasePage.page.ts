import { Locator, Page } from "playwright";
import { ClickOptions, EnterTextOptions, GetElementOptions } from "../types";

export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected getPage() {
        return this.page;
    }

    public async visitPage(url: string) {
        await this.getPage().goto(url);
    }

    protected async getElement(locator: string, getElementOptions?: GetElementOptions): Promise<Locator> {
        const timeout = getElementOptions?.timeout || 10000;
        const maxRetry = getElementOptions?.retry?.maxRetry || 1;
        const interval = getElementOptions?.retry?.interval || 1000;
        try {
            for (let i = 0; i < maxRetry; i++) {
                await this.getPage().waitForSelector(locator, { state: "attached", timeout: timeout });
                const element = this.getPage().locator(locator);
                if (await element.isVisible()) {
                    return element;
                }
                await this.getPage().waitForTimeout(interval);
            }
        } catch (error) {
            console.error(`Error while getting element: ${error}`);
        }
        return this.getPage().locator(locator);
    }

    protected async getElements(locator: string | Locator, getElementOptions?: GetElementOptions): Promise<Locator[]> {
        const timeout = getElementOptions?.timeout || 10000;
        const maxRetry = getElementOptions?.retry?.maxRetry || 1;
        const interval = getElementOptions?.retry?.interval || 1000;
        if (typeof locator === "string") {
            try {
                for (let i = 0; i < maxRetry; i++) {
                    await this.getPage().waitForSelector(locator, { state: "attached", timeout: timeout });
                    const elements = await this.getPage().locator(locator).all();
                    if (elements.length > 0) {
                        return elements;
                    }
                    await this.getPage().waitForTimeout(interval);
                }
            } catch (error) {
                console.error(`Error while getting elements: ${error}`);
            }
        } else {
            return await locator.all();
        }
        return [];
    }

    protected async waitUntilTextDisplay(locator: Locator): Promise<Locator> {
        await locator.waitFor({ state: "visible" });
        return locator;
    }

    protected async enterText(locator: Locator, text: string, enterTextOptions?: EnterTextOptions) {
        const timeout = enterTextOptions?.timeout || 10000;
        const force = enterTextOptions?.force || false;
        const clearText = enterTextOptions?.clearText || false;
        const delay = enterTextOptions?.delay || 0;
        
        await locator.waitFor({ state: "visible", timeout: timeout });
        if (delay > 0) {
            await this.getPage().waitForTimeout(delay);
        }
        if (clearText) {
            await locator.clear();
            await locator.fill(text, { force: force });
        }
        await this.getPage().waitForTimeout(delay);
    }

    protected async clickElement(locator: Locator, clickOptions?: ClickOptions) {
        const timeout = clickOptions?.timeout || 10000;
        const force = clickOptions?.force || false;
        const delay = clickOptions?.delay || 0;

        await locator.waitFor({ state: "attached", timeout: timeout });
        await locator.waitFor({ state: "visible", timeout: timeout });

        if (delay > 0) {
            await this.getPage().waitForTimeout(delay);
        }
        await locator.click({ force: force });
    }

}