import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react'

import Blog from '../src/components/Blog';

afterEach(() => {
    cleanup();
});

test('renders blog title and author', () => {
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

    render(<Blog blog={blogData} />);
    
    const expectedText = `${blogData.title} - ${blogData.author}`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
});
