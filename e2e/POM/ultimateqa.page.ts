import { Locator, Page } from "playwright";
import { BasePage } from "./BasePage.page";
import { FilterOptionsByNumericValue, FilterOptionsByTextValue, RowValue } from "../types";
import { TextFormatter } from "../utils/textFormatter.util";

export class UltimateQAPage extends BasePage {

    private tableLocator = `//*[contains(h2, "%s")]//tbody`;
    private nameInputLocator = `#et_pb_contact_name_0`;
    private emailInputLocator = `#et_pb_contact_email_0`;
    private submitButtonLocator = `button[name="et_builder_submit_button"]`;
    private successMessageLocator = `.et-pb-contact-message`;

    constructor(page: Page) {
        super(page);
    }

    private async getSuccessMessageLocator() {
        return this.getElement(this.successMessageLocator);
    }

    private async getNameInput() {
        return this.getElement(this.nameInputLocator);
    }

    private async getEmailInput() {
        return this.getElement(this.emailInputLocator);
    }

    private async getSubmitButton() {
        return this.getElement(this.submitButtonLocator);
    }

    public async getSuccessMessage() {
        const successMessageElm = await this.getSuccessMessageLocator();
        //wait for text to be displayed
        const messElm = await this.waitUntilTextDisplay(successMessageElm);
        const message = await messElm.textContent();
        return message;
    }

    public async submitEmail(name: string, email: string) {
        const nameInputElm = await this.getNameInput();
        const emailInputElm = await this.getEmailInput();
        const submitButtonElm = await this.getSubmitButton();

        await this.clickElement(nameInputElm);
        await this.enterText(nameInputElm, name, { clearText: true, delay: 1000 });

        await this.clickElement(emailInputElm);
        await this.enterText(emailInputElm, email, { clearText: true, delay: 1000 });

        await this.clickElement(submitButtonElm, { force: true, delay: 1000 });
    }

    private async getTable(tableName: string): Promise<Locator> {
        const tableCompleteLocator = this.tableLocator.replace("%s", tableName);
        return this.getElement(tableCompleteLocator);
    }

    private async getFirstRowData(tableName: string): Promise<string[]> {
        (await this.getTable(tableName)).scrollIntoViewIfNeeded();
        const table = await this.getTable(tableName);
        const rows = await this.getElements(table.locator("tr"));
        const firstRows = await this.getElements(rows[0].locator("th"));
        let firstRowData: string[] = [];
        for (let row of firstRows) {
            const rowLocator = await this.waitUntilTextDisplay(row)
            const text = await rowLocator.textContent();
            firstRowData.push(text ? text : "");
        }
        return firstRowData;
    }

    private async getContentRowData(tableName: string): Promise<any> {
        let contenRowData: any[] = [];
        
        (await this.getTable(tableName)).scrollIntoViewIfNeeded();
        const table = await this.getTable(tableName);
        const rows = await this.getElements(table.locator("tr"));
        for (let i = 0; i < rows.length; i++) {
            const columns = await rows[i].locator("td").all();
            const contenRow: string[] = [];
            for (let j = 0; j < columns.length; j++) {
                const colLocator = await this.waitUntilTextDisplay(columns[j]);
                const text = await colLocator.textContent();
                contenRow.push(text ? text : "");
            }
            contenRowData.push(contenRow);
        }   
        return contenRowData;
    }

    public async getTableData(tableName: string): Promise<RowValue[]> {
        const firstRow = await this.getFirstRowData(tableName);
        const contentRows = await this.getContentRowData(tableName);
        let tableData: RowValue[] = [];

        // NOTE: i starts from 1 because the first row is the header
        for (let i = 1; i < contentRows.length; i++) {
            let rowData: RowValue = {};
            for (let j = 0; j < firstRow.length; j++) {
                rowData[firstRow[j]] = contentRows[i][j];
            }
            tableData.push(rowData);
        }
        console.log("Table data: ", tableData);
        return tableData;
    }

    public getColumnsData(colName: string, tableData: RowValue[]): string[] {
        return tableData.map(item => item[colName] ? item[colName] : "");
    }

    public filterRowsByNumericValue(tableData: RowValue[], filterOption?: FilterOptionsByNumericValue): RowValue[] {
        const colName = filterOption?.columnName || "";
        const matchValue = filterOption?.condition?.matchValue || "";
        const greaterThan = filterOption?.condition?.greaterThan || false;
        const lessThan = filterOption?.condition?.lessThan || false;

        if (lessThan && !greaterThan) {
            return tableData.filter(item => TextFormatter.getNumericValue(item[colName]) < TextFormatter.getNumericValue(lessThan));
        }
        
        if (greaterThan && !lessThan) {
            return tableData.filter(item => TextFormatter.getNumericValue(item[colName]) >= TextFormatter.getNumericValue(greaterThan));
        }
        if (lessThan && greaterThan) {
            return tableData.filter((item) => {
                const lowBoundary = TextFormatter.getNumericValue(greaterThan);
                const highBoundary = TextFormatter.getNumericValue(lessThan);
                return (
                    TextFormatter.getNumericValue(item[colName]) >= lowBoundary && TextFormatter.getNumericValue(item[colName]) <= highBoundary
                );
            });
        }

        return tableData.filter(item => TextFormatter.getNumericValue(item[colName]) === TextFormatter.getNumericValue(matchValue));
    }

    public filterRowsByTextValue(tableData: RowValue[], filterOption?: FilterOptionsByTextValue): RowValue[] {
        const colName = filterOption?.columnName || "";
        const matchValue = filterOption?.condition?.matchValue || "";
        const contains = filterOption?.condition?.contains || false;
        const notContains = filterOption?.condition?.notContains || false;

        if (notContains && !contains) {
            return tableData.filter(item => !item[colName]?.includes(notContains));
        }

        if (contains && !notContains) {
            return tableData.filter(item => item[colName]?.includes(contains));
        }

        if (notContains && contains) {
            return tableData.filter(item => item[colName]?.includes(contains) && !item[colName]?.includes(notContains));
        }

        return tableData.filter(item => item[colName] === matchValue);
    }

}