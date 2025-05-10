import { faker } from '@faker-js/faker';
import fs from 'fs';
import * as path from 'path';

export class RandomHelper {
    public static getRandomName(): string {
        return faker.person.fullName();
    }
    
    public static getRandomEmail(): string {
        return faker.internet.email();
    }

    public static async generateDataset(size: number) {
        const dataset: any = [];
        for(let i = 0; i < size; i++) {
            const randomName = this.getRandomName();
            const randomEmail = this.getRandomEmail();

            const data = {
                name: randomName,
                email: randomEmail,
            };
            dataset.push(data);
        }
        
        return dataset;
    }

    public static saveDatasetToFixture(dataset: any, fileName: string): void {
        const fixturePath = path.resolve(__dirname, '../fixtures', fileName);
    
        fs.writeFileSync(fixturePath, JSON.stringify(dataset, null, 2), 'utf-8');
        console.log(`Dataset written to ${fixturePath}`);
    }

    public static loadDatasetFromFixture(fileName: string): any {
        const fixturePath = path.resolve(__dirname, '../fixtures', fileName);
    
        if (!fs.existsSync(fixturePath)) {
            throw new Error(`Fixture file not found: ${fixturePath}`);
        }
    
        const data = fs.readFileSync(fixturePath, 'utf-8');
        return JSON.parse(data);
    }
}