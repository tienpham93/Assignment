
import { test } from '../../fixtures/fixtureConfig';
import { expect } from '../../fixtures/fixtureConfig';
import { UltimateQAPage } from '../../POM/ultimateqa.page';
import { RandomHelper } from '../../utils/randomHelper.util';
import { TextFormatter } from '../../utils/textFormatter.util';

const qaPageUrl = 'https://ultimateqa.com/simple-html-elements-for-automation/';
let qaPage: UltimateQAPage;

test.describe('UI Tests - HTML Table with no id', () => {
    test.beforeEach(async ({ page }) => {
        qaPage = new UltimateQAPage(page);
        await qaPage.visitPage(qaPageUrl);
    });
    test('Verify that the first letter of each word in the title is in upper case excluding prepositions', async ({ customExpect }) => {
        const tableData = await qaPage.getTableData("HTML Table with no id");

        const titles = qaPage.getColumnsData("Title", tableData);
        titles.forEach((title) => {
            const rawWords = TextFormatter.removePrepositionInSentence(title);
            const firstLetters = TextFormatter.getFirstLetterOfEachWord(rawWords);

            customExpect(firstLetters).toBeUpperCase();
        });
    });

    test('Verify that filter function works correctly when get all roles that have salary at least 100k', async ({ customExpect }) => {
        const tableData = await qaPage.getTableData("HTML Table with no id");

        const actualRoles = qaPage.filterRowsByNumericValue(tableData, {
            columnName: "Salary",
            condition: {
                greaterThan: "100000"
            }
        });

        const expectRoles = [
            {
                Title: 'Software Development Engineer in Test',
                Work: 'Automation',
                Salary: '$150,000+'
            },
            {
                Title: 'Automation Testing Architect',
                Work: 'Automation',
                Salary: '$120,000+'
            }
        ];

        expect(actualRoles).toStrictEqual(expectRoles);
    });

    test('Verify that filter function works correctly when get all roles that have NO manual work', async ({ customExpect }) => {
        const tableData = await qaPage.getTableData("HTML Table with no id");

        const actualRoles = qaPage.filterRowsByTextValue(tableData, {
            columnName: "Work",
            condition: {
                notContains: "Manual",
            }
        });

        const expectRoles = [
            {
                Title: 'Software Development Engineer in Test',
                Work: 'Automation',
                Salary: '$150,000+'
            },
            {
                Title: 'Automation Testing Architect',
                Work: 'Automation',
                Salary: '$120,000+'
            }
        ];

        expect(actualRoles).toStrictEqual(expectRoles);
    });
});

const dataset = RandomHelper.loadDatasetFromFixture('dataset.json') as any;

test.describe('UI Tests - Email me 10 accounts', () => {
    dataset.forEach((data) => {
        test(`Verify that sent ${data.email} successfully`, async ({ page }) => {
            qaPage = new UltimateQAPage(page);
            await qaPage.visitPage(qaPageUrl);

            await qaPage.submitEmail(data.name, data.email);
            const successMessage = await qaPage.getSuccessMessage();

            expect(successMessage).toBe("Thanks for contacting us");
        });
    });
});



