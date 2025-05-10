import { FullConfig } from '@playwright/test';
import { RandomHelper } from './utils/randomHelper.util';

async function globalSetup(config: FullConfig) {
    const dataset = await RandomHelper.generateDataset(10);
    RandomHelper.saveDatasetToFixture(dataset, 'dataset.json');
}

export default globalSetup;