const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:5000/api/testing/reset');
        await request.post('http://localhost:5000/api/users', {
            data: {
                name: 'admin',
                username: 'admin',
                password: 'admin'
            }
        });
        await page.goto('http://localhost:5001');
    });

    test('Login form is shown', async ({ page }) => {
        expect(page.getByText("Login")).toBeTruthy();
    });

    describe('Login', () => {
        test('fails with wrong credentials', async ({ page, request }) => {
            const response = await request.post("http://localhost:5000/api/login", {
                data: {
                    username: "fake_username",
                    password: "fake_password"
                }
            });
            expect(response.status()).toBe(401);
        });
        
        test('succeeds with correct credentials', async ({ page, request }) => {
            const response = await request.post("http://localhost:5000/api/login", {
                data: {
                    username: "admin",
                    password: "admin"
                }
            });
            expect(response.ok()).toBeTruthy();
            
            const response_json = await response.json();
            expect(
                response_json && response_json.token
                ? response_json.token
                : false
            ).toBeTruthy();
        });
    });
});
