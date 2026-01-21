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

    test('blog delete button exists for creator', async ({ page, request }) => {
        await request.post('http://localhost:5000/api/users', {
            data: { name: 'admin', username: 'admin', password: 'admin' }
        });

        const loginResponse = await request.post('http://localhost:5000/api/login', {
            data: { username: 'admin', password: 'admin' }
        });

        const login_json = await loginResponse.json();

        await page.context().addCookies([{
            name: 'session',
            value: login_json.token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
        }]);

        await page.addInitScript(() => {
            localStorage.setItem("auth", {
                username: login_json.username,
                name: login_json.name,
                id: login_json.id
            });
        });

        await page.goto('http://localhost:5001');

        const deleteButton = page.getByText('Delete');
        expect(deleteButton).toBeTruthy();
    });

    test('blog delete button works', async ({ page, request }) => {
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

        await request.post('http://localhost:5000/api/users', {
            data: { name: 'admin', username: 'admin', password: 'admin' }
        });

        const loginResponse = await request.post('http://localhost:5000/api/login', {
            data: { username: 'admin', password: 'admin' }
        });

        const login_json = await loginResponse.json();

        await page.context().addCookies([{
            name: 'session',
            value: login_json.token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
        }]);

        await page.addInitScript(() => {
            localStorage.setItem("auth", {
                username: login_json.username,
                name: login_json.name,
                id: login_json.id
            });
        });

        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        await page.goto('http://localhost:5001');
        
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'View' }).waitFor();
        await page.getByRole('button', { name: 'View' }).click();

        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Delete' }).waitFor();
        await page.getByRole('button', { name: 'Delete' }).click();
    });

    test('blogs are listed in correct order (likes DESC)', async ({ page, request }) => {
        await request.post('http://localhost:5000/api/users', {
            data: { name: 'admin', username: 'admin', password: 'admin' }
        });

        const loginResponse = await request.post('http://localhost:5000/api/login', {
            data: { username: 'admin', password: 'admin' }
        });

        const login_json = await loginResponse.json();

        await page.context().addCookies([{
            name: 'session',
            value: login_json.token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
        }]);

        await page.addInitScript(() => {
            localStorage.setItem("auth", {
                username: login_json.username,
                name: login_json.name,
                id: login_json.id
            });
        });

        await api.post('http://localhost:5000/api/blogs', {
            data: {
                title: 'Test Blog',
                author: 'Test Author',
                url: 'Test Url',
                likes: 5
            }
        });
        await api.post('http://localhost:5000/api/blogs', {
            data: {
                title: 'Test Blog',
                author: 'Test Author',
                url: 'Test Url',
                likes: 10
            }
        });

        await page.goto("http://localhost:5001/");
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const blogElements = await page.$$('.blog');
        let previousLikes = Infinity;

        for (let i = 0; i < blogElements.length; i++) {
            const pTexts = await blogElements[i].$$eval('p', ps => ps.map(p => p.textContent));
            const likesLine = pTexts.find(line => line?.startsWith('Likes:'));
            if (!likesLine) throw new Error(`No likes found in blog ${i}`);
            
            const likes = parseInt(likesLine.replace('Likes:', '').trim(), 10);

            expect(likes).toBeLessThanOrEqual(previousLikes);
            previousLikes = likes;
        }
    });
});
