import { test } from '../../fixtures/fixtureConfig';
import { expect } from '../../fixtures/fixtureConfig';

test.describe('API tests - GET user profile', () => {
    test('Verify that GET user profile successfully when valid userId', async ({ apiFixture }) => {
        const response = await apiFixture.getUserById('12345');

        const body = await response.json()
        expect(response.status()).toBe(200);    
        expect(body).toStrictEqual({
            "userId": 12345,
            "username": "JohnDoe",
            "dateOfBirth": "1990-01-01T00:00:00Z",
            "gender": "MALE",
            "subscribedMarketing": true,
            "hasSetupPreference": false
        });
    });

    test('Verify that GET user profile failed when invalid userId', async ({ apiFixture }) => {
        const response = await apiFixture.getUserById('404');
        const body = await response.json()

        expect(response.status()).toBe(404);    
        expect(body).toStrictEqual({
            "error": "Not Found"
        });
    });
});

test.describe('API tests - POST user profile', () => {
    test('Verify that POST user profile successfully when input all valid data', async ({ apiFixture }) => {
        const payload = {
            "username": "JohnDoe",
            "dateOfBirth": "1990-01-01T00:00:00Z",
            "gender": "MALE",
            "subscribedMarketing": true
        };

        const response = await apiFixture.postUserProfile(payload);
        const body = await response.json()

        expect(response.status()).toBe(200);    
        expect(body).toStrictEqual({
            "userId": 12345
        });
    });

    test('Verify that POST user profile unsuccessfully - missing username', async ({ apiFixture }) => {
        const payload = {
            "dateOfBirth": "1990-01-01T00:00:00Z",
            "gender": "MALE",
            "subscribedMarketing": true
        };

        const response = await apiFixture.postUserProfile(payload);
        const body = await response.json()

        expect(response.status()).toBe(400);    
        expect(body).toStrictEqual({
            "error": "Missing required fields: username"
        });
    });

    test('Verify that POST user profile unsuccessfully - missing Date of Birth', async ({ apiFixture }) => {
        const payload = {
            "username": "JohnDoe",
            "gender": "MALE",
            "subscribedMarketing": true
        };

        
        const response = await apiFixture.postUserProfile(payload);
        const body = await response.json()

        expect(response.status()).toBe(400);    
        expect(body).toStrictEqual({
            "error": "Missing required fields: dateOfBirth"
        });
    });

    test('Verify that POST user profile unsuccessfully - invalid gender', async ({ apiFixture }) => {
        const payload = {
            "username": "JohnDoe",
            "dateOfBirth": "1990-01-01T00:00:00Z",
            "gender": "EXIEADFA",
            "subscribedMarketing": true
        };

        const response = await apiFixture.postUserProfile(payload);
        const body = await response.json()

        expect(response.status()).toBe(400);    
        expect(body).toStrictEqual({
            "error": "Invalid value for field: gender"
        });
    });

    test('Verify that POST user profile unsuccessfully - invalid subscribedMarketing', async ({ apiFixture }) => {
        const payload = {
            "username": "JohnDoe",
            "dateOfBirth": "1990-01-01T00:00:00Z",
            "gender": "OTHER",
            "subscribedMarketing": 123342
        };

        const response = await apiFixture.postUserProfile(payload);
        const body = await response.json()

        expect(response.status()).toBe(400);    
        expect(body).toStrictEqual({
            "error": "Invalid value for field: subscribedMarketing"
        });
    });

    test('Verify that POST user profile unsuccessfully - invalid Date of Birth', async ({ apiFixture }) => {
        const payload = {
            "username": "JohnDoe",
            "dateOfBirth": "error",
            "gender": "OTHER",
            "subscribedMarketing": false
        };

        const response = await apiFixture.postUserProfile(payload);
        const body = await response.json()

        expect(response.status()).toBe(400);    
        expect(body).toStrictEqual({
            "error": "Invalid value for field: dateOfBirth"
        });
    });
});
