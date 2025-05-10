
import { type APIRequestContext, APIResponse } from '@playwright/test';
import { Payload } from '../types';

export class ApiFixture {
    private BaseUrl: string = 'http://localhost:3000';
    private userProfileEndpoint: string = '/v1/profile';

    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;

    }

    public async getUserById(userId: string): Promise<any> {
        const uri = this.BaseUrl + this.userProfileEndpoint + `/${userId}`;
        const response = await this.request.get(uri);

        return response;
    }

    public async postUserProfile(payload: Payload) {
        const uri = this.BaseUrl + this.userProfileEndpoint;
        const response = await this.request.post(uri, {
            headers: {
                'content-type': 'application/json',
            },
            data: {
                username: payload.username,
                dateOfBirth: payload.dateOfBirth,
                gender: payload.gender,
                subscribedMarketing: payload.subscribedMarketing,
            }
        });
        return response;
    }

}