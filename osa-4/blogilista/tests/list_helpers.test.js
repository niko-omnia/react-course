const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  let blogList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ];

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(blogList);
    assert.strictEqual(result, 5);
  });
  test('when list has nothing', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
  test('when list has multiple blogs', () => {
    blogList.push({
      _id: '5a422aa71b54a676234d17f9',
      title: 'Something',
      author: 'Someone',
      url: 'http://google.com',
      likes: 8,
      __v: 0
    });
    const result = listHelper.totalLikes(blogList);
    assert.strictEqual(result, 13);
  });
});

describe('favourite blog', () => {
  test('receives empty list', () => {
    const result = listHelper.favouriteBlog([]);
    assert.deepStrictEqual(result, null);
  });

  test('picks blog out of list with one blog', () => {
    const blogList = [{
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }];

    const result = listHelper.favouriteBlog(blogList);
    assert.deepStrictEqual(result, blogList[0]);
  });

  test('picks correct blog out of multiple', () => {
    const blogList = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Something',
        author: 'Someone',
        url: 'http://google.com',
        likes: 8,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f7',
        title: 'Something else',
        author: 'Someone else',
        url: 'http://github.com',
        likes: 8,
        __v: 0
      }
    ];
    const result = listHelper.favouriteBlog(blogList);
    assert.deepStrictEqual(result, blogList[1]);
  });
});
