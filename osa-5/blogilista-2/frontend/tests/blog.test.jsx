import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import Blog from '../src/components/Blog';

afterEach(() => {
    cleanup();
});

const blogData = {
    id: "1",
    title: "Test Blog",
    author: "Some Author",
    url: "https://google.com",
    likes: 5,
    user: {
        name: "admin",
        username: "admin",
        id: "696e88273e8f53465062b08b"
    }
};


test('renders blog title and author', () => {
    render(<Blog blog={blogData} updateLikes={() => {}} />);
    
    const expectedText = `${blogData.title} - ${blogData.author}`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
});

test('shows url, likes, creator only when view button is pressed', async () => {
    render(<Blog blog={blogData} updateLikes={() => {}} />);

    const expectedTexts = [
        `Likes: ${blogData.likes}`,
        `Url: ${blogData.url}`,
        `Added by: ${blogData.user.name}`
    ];

    for (const expectedText of expectedTexts) {
        const element = screen.getByText(expectedText);
        expect(element).not.toBeVisible();
    }

    const user = userEvent.setup();
    const button = screen.getByText('View');
    await user.click(button);

    for (const expectedText of expectedTexts) {
        const element = screen.getByText(expectedText);
        expect(element).toBeVisible();
    }
});

test('like button functions properly', async () => {
    const mockHandler = vi.fn();

    render(<Blog blog={blogData} updateLikes={mockHandler} />);
    
    const user = userEvent.setup();
    const button = screen.getByText('Like');
    
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
});
