const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('blog app login', async () => {
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

    let auth_token = "";

    describe('Login', () => {
        test('fails with wrong credentials', async ({ request }) => {
            const response = await request.post("http://localhost:5000/api/login", {
                data: {
                    username: "fake_username",
                    password: "fake_password"
                }
            });
            expect(response.status()).toBe(401);
        });

        test('succeeds with correct credentials', async ({ request }) => {
            const response = await request.post("http://localhost:5000/api/login", {
                data: {
                    username: "admin",
                    password: "admin"
                }
            });
            expect(response.ok()).toBeTruthy();

            const response_json = await response.json();
            auth_token = response_json && response_json.token
                ? response_json.token
                : false
            expect(auth_token).toBeTruthy();
        });
    });
});

describe('blog app logged in', () => {
    let api = null;
    
    beforeEach(async ({ playwright, request }) => {
        await request.post('http://localhost:5000/api/testing/reset');
        await request.post('http://localhost:5000/api/users', {
            data: {
                name: 'admin',
                username: 'admin',
                password: 'admin',
            }
        });

        const loginResponse = await request.post('http://localhost:5000/api/login', {
            data: {
                username: 'admin',
                password: 'admin',
            }
        });

        const { token } = await loginResponse.json();
        api = await playwright.request.newContext({
            extraHTTPHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    });

    test('a new blog can be created', async () => {
        const response = await api.post('http://localhost:5000/api/blogs', {
            data: {
                title: 'Test Blog',
                author: 'Test Author',
                url: 'Test Url'
            }
        });

        expect(response.status()).toBe(201);

        const response_json = await response.json();
        expect(response_json.id).toBeTruthy();
    });

    test('blog liking works', async () => {
        const response = await api.post('http://localhost:5000/api/blogs', {
            data: {
                title: 'Test Blog',
                author: 'Test Author',
                url: 'Test Url'
            }
        });

        expect(response.status()).toBe(201);

        const response_json = await response.json();
        const newBlogId = response_json && response_json.id ? response_json.id : null;
        
        expect(newBlogId).toBeTruthy();

        const response2 = await api.patch(`http://localhost:5000/api/blogs/${newBlogId}`, {
            data: {
                likes: 10
            }
        });
        expect(response2.status()).toBe(200);

        const response2_json = await response2.json();
        expect(response2_json.likes).toBe(10);
    });
});
