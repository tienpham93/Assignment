
## Test cases
### UI Requirements:
- Go to https://ultimateqa.com/simple-html-elements-for-automation/
- On the HTML Table with no id table:
    - The first letter of each word in the title is in upper case excluding the preposition.
    - All roles have at least $100k .
    - Thereʼs no Manual work.
- Email me! ⇒ with 10 accounts
### Breakdown:
- Based on the second bullet point which 3 subpoints:

TC01 - Verify that the first letter of each word in the title is in upper case excluding prepositions

    - Accesses to https://ultimateqa.com/simple-html-elements-for-automation/
    - At HTML Table with no id table, get all of value from Title columns
    - Get first letters of each word in the entire titles and exclude prepositions
    - Assert first letters of each word in the entire titles, to see if they are upper case or not

TC02 - Verify that filter function works correctly when get all roles that have salary at least 100k

    - Accesses to https://ultimateqa.com/simple-html-elements-for-automation/
    - At HTML Table with no id table, get all rows that have at least 100k
    - Assert all of retrieved rows to see if they are displaying correct data specifically in salary (should > 100k)

TC03 - Verify that filter function works correctly when get all roles that have NO manual work

    - User accesses to https://ultimateqa.com/simple-html-elements-for-automation/
    - At HTML Table with no id table, get all rows that have at their work is not Manual
    - Assert all of retrieved rows to see if they are displaying correct data specifically in Work (should not be Manual)

- Based on the last bullet point:

TC04 - Verify that send email function by sending 10 email accounts

    - Prepare random dataset that contains 10 pairs of name and email
    - Accesses to https://ultimateqa.com/simple-html-elements-for-automation/
    - At email me section, enter name
    - At email me section, enter email
    - Click submit button
    - Assert the success message is displaying correctly

### Automation approach:
- Automation tool: Playwright
- Language: Typescript + nodejs
- Browser: chrome
- Structure: 
```
e2e/
├── API/
├── fixtures/
├── POM/
├── spec/
├── utils/
├── playwright-report/
```
- UI test files: e2e/spec/auto-ui/UI_tests.spec.ts
- POM(Page Object Model): where store page class
    - BasePage.page.ts: this page is the parent page that store all of basic functions such as getElement, clickElement, visitPage, waitUntilTextDisplay,...etc these functions will share to child page class
    - ultimateqa.page.ts: is the child page class where store page object and all relevant functions to action in that page
- fixtures: folder helps organize and manage reusable data and setup logic, making your tests cleaner and more maintainable.
- spec: the folder that store all test files
- utils: the folder that store utils files that will help to format, convert, transfer data...etc
- playwright-report: where store detail html report after all tests run, screenshot of failure also is include to the report playwright-report/index.html
- Strategies for TC01, TC02 and TC03: After landing on the page, I create a function to get all of data in the target table and store them as below format:

```
[
  {
    Title: 'Software Development Engineer in Test',
    Work: 'Automation',
    Salary: '$150,000+'
  },
  {
    Title: 'Automation Testing Architect',
    Work: 'Automation',
    Salary: '$120,000+'
  },
  {
    Title: 'Quality Assurance Engineer',
    Work: 'Manual',
    Salary: '$50,000+'
  }
]
```
- So that I can easily create other filter function based on column name Or filter functions based on a certain condition, for example:
```
const actualRoles = qaPage.filterRowsByNumericValue(tableData, {
    columnName: "Salary",
    condition: {
        greaterThan: "100000"
    }
});
```

- Strategies for TC04: Create randomHelper.util.ts to store some of functions that help generate the dataset (10 pairs of name and email)
- The generate data function will be run at globalSetup.ts file, so that it could init testdata before TC04 run

### API Requirements:
- POST api to create user 
- GET api to get user by userId

### Breakdown:
- Based on GET api schema:

TC01: Happy case - Verify that GET user profile successfully when valid userId

    - Send GET request to /v1/profile/{validUserId}
    - Validate response status code equals 200
    - Validate response body should be aligned with the schema
        - Should contains all fields as schema requirement
        - Should return correct fields type (valid type) as schema requirement

TC02: Unhappy case - Verify that GET user profile unsuccessfully when invalid userId

    1. Send GET request to /v1/profile/{invalidUserId}
    - Validate response status code equals 404
    - Validate response body should show correct error message

- Based on POST api schema:

TC01: Happy case - Verify that POST user profile successfully when input valid data to all fields

    - Send POST request to /v1/profile with valid payload
        - Payload contains all of fields as as schema requirement
        - Payload value of each field must be in valid type as schema requirement
    - Validate response status code equals 200
    - Validate response body should be aligned with the schema
        - Should return correct message

TC02: Unhappy case - Verify that POST user profile unsuccessfully when payload missing username

    - Send POST request to /v1/profile with invalid payload
        - Payload missing username
    - Validate response status code equals 400
    - Validate response body should return correct error message that missing username

TC03: Unhappy case - Verify that POST user profile unsuccessfully when payload missing dataOfbirth

        - Send POST request to /v1/profile with invalid payload
            - Payload missing dataOfbirth
        - Validate response status code equals 400
        - Validate response body should return correct error message that missing dataOfbirth

TC04: Unhappy case - Verify that POST user profile unsuccessfully when payload has invalid gender value

    - Send POST request to /v1/profile with invalid payload
        - Payload has invalid gender value out of ["MALE", "FELMALE", "OTHER"]
    - Validate response status code equals 400
    - Validate response body should return correct error message that invalid gender

TC05: Unhappy case - Verify that POST user profile unsuccessfully when payload has invalid subscribedMarketing value

    - Send POST request to /v1/profile with invalid payload
        - Payload has invalid subscribedMarketing is not boolean 
    - Validate response status code equals 400
    - Validate response body should return correct error message that invalid subscribedMarketing

TC06: Unhappy case - Verify that POST user profile unsuccessfully when payload has invalid dateOfBirth value

    - Send POST request to /v1/profile with invalid payload
        - Payload has invalid dateOfBirth is not this format "YYYY-MM-DDT00:00:00Z"
    - Validate response status code equals 400
    - Validate response body should return correct error message that invalid dateOfBirth

### Automation approach:
- Automation tool: Playwright
- Stub/mock tool: Mountebank
- Language: Typescript + nodejs
- Structure: 
```
e2e/
├── API/
├── fixtures/
├── POM/
├── spec/
├── utils/
├── playwright-report/
├── mocks/

```

- API test files: e2e/spec/auto-api/API_tests.spec.ts
- mocks: to store mock config and response template
- Strategies: 
    - I create mock server with above breakdown cases, will start sever on port http://localhost:3000
    - I create class ApiFixture in e2e/API/BaseApi.api.ts in order to store main functions to call those 2 api
    - I config ApiFixture in e2e/fixtures/fixtureConfig.ts so that I can retrieve that class as fixture in each playwright test
    - As soon as mock server is up and running, We can start playwright test to point to that server

## Automation app
### Installation
1. Install application dependencies

```
yarn install
```

- Install playwright browser
```
npx playwright install chromium
```

### Run tests
1. Run UI test
```
yarn test:ui
```

- Run API test
- Should start mock server in advance
```
yarn mock:start
```

- Open another ternimal and run API tests
```
yarn test:api
```

- Run tests with docker compose
- Should have docker installed already in your machine
```
docker-compose up
```

- After tests run complete, try this command to view the report
```
yarn test:html
```

- Stop and remove docker container
```
docker-compose down
```