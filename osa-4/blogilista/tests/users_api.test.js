const { test, describe, beforeEach, after } = require('node:test');
const supertest = require('supertest');
const assert = require('node:assert');
const mongoose = require('mongoose');

const app = require('../app');
const User = require('../models/user');
const config = require('../utils/config');

const api = supertest(app);

async function createUser(data) {
    return await api.post("/api/users").send(data);
}

describe('API tests - Users', () => {
    beforeEach(async () => {
        await mongoose.connect(config.MONGODB_URI);
    });

    test('user creation', async () => {
        const response = await createUser({
            username: "test123",
            name: "test tester",
            password: "s3cur3_p4ssw0rd"
        });
        assert.strictEqual(response.status, 201, `Failed to create new user! (status: ${response.status}) (error: ${response.body.error})`);

        const addedUser = await User.findOne({ id: response.body._id });
        assert.ok(addedUser, 'user was not created');
        
        await User.deleteOne({ username: "test123" });
    });
    test('invalid user creation fails', async () => {
        const response = await createUser({
            username: "1",
            name: "test tester",
            password: ""
        });
        assert.strictEqual(response.status, 400);
    });

    after(async () => {
        await mongoose.connection.close();
    });
});
