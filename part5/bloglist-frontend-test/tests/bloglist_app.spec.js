const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'password'
      }
    })
    await page.goto('http://localhost:5173')
    
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    const loginForm = page.getByText('log in to application')
    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByRole('textbox', { name: 'username' }).fill('testuser')
      await page.getByRole('textbox', { name: 'password' }).fill('password')
      
     
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page).toHaveURL('http://localhost:5173/blogs')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByRole('textbox', { name: 'username' }).fill('testuser')
      await page.getByRole('textbox', { name: 'password' }).fill('wrongpassword')
      
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error') 
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('wrong credentials')

      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login')
        await page.getByRole('textbox', { name: 'username' }).fill('testuser')
        await page.getByRole('textbox', { name: 'password' }).fill('password')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page).toHaveURL('http://localhost:5173/blogs')
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('link', { name: 'new blog' }).click()
        await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
        await page.getByRole('textbox', { name: 'author' }).fill('Test Author')
        await page.getByRole('textbox', { name: 'url' }).fill('https://testBlog.com/')

        await page.getByRole('button', { name: 'create' }).click()

        await expect(page).toHaveURL('http://localhost:5173/blogs')
        await expect(page.getByRole('link', { name: "Test Blog by Test Author" })).toBeVisible()
    })

    describe('and a blog exists', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/create')
        await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
        await page.getByRole('textbox', { name: 'author' }).fill('Test Author')
        await page.getByRole('textbox', { name: 'url' }).fill('https://testBlog.com/')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page).toHaveURL('http://localhost:5173/blogs')
    })

    test('a blog can be liked', async ({ page }) => {
        
        await page.getByRole('link', { name: 'Test Blog by Test Author' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
        
        page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm')
            dialog.accept()
        })
        await page.getByRole('link', { name: 'Test Blog by Test Author' }).click()
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByRole('link', { name: 'Test Blog by Test Author' })).not.toBeVisible()
      })


        test('only the user who created the blog sees the delete button', async ({ page, request }) => {
        await page.getByRole('button', { name: 'logout' }).click()

        await page.goto('http://localhost:5173/blogs')
        await page.getByRole('link', { name: 'Test Blog by Test Author' }).click()

        await expect(page.getByText('Test Blog by Test Author')).toBeVisible()
        await expect(page.getByText('likes 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' })).not.toBeVisible()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
    })
/*
   test.only('blogs are arranged in order according to likes (most likes first)', async ({ page }) => {
    
    test.setTimeout(30000)
    await page.goto('http://localhost:5173/create')
      await page.getByRole('textbox', { name: 'title' }).fill('Blog with least likes')
      await page.getByRole('textbox', { name: 'author' }).fill('Author A')
      await page.getByRole('textbox', { name: 'url' }).fill('http://test1.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.goto('http://localhost:5173/create')
      await page.getByRole('textbox', { name: 'title' }).fill('Blog with most likes')
      await page.getByRole('textbox', { name: 'author' }).fill('Author B')
      await page.getByRole('textbox', { name: 'url' }).fill('http://test2.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.goto('http://localhost:5173/create')
      await page.getByRole('textbox', { name: 'title' }).fill('Blog with medium likes')
      await page.getByRole('textbox', { name: 'author' }).fill('Author C')
      await page.getByRole('textbox', { name: 'url' }).fill('http://test3.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.goto('http://localhost:5173/blogs')
      await page.getByRole('link', { name: 'Blog with most likes by Author B' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 2')).toBeVisible()

      await page.goto('http://localhost:5173/blogs')
      await expect(page).toHaveURL('http://localhost:5173/blogs')
      const allBlogs = page.locator('.blog-item')
      await expect(allBlogs.nth(0)).toContainText('Blog with most likes')

      await page.getByRole('link', { name: 'Blog with medium likes by Author C' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
      await page.getByRole('link', { name: 'blogs' }).click()
      await expect(page).toHaveURL('http://localhost:5173/blogs')

  

      await expect(allBlogs.nth(0)).toContainText('Blog with most likes')
      await expect(allBlogs.nth(1)).toContainText('Blog with medium likes')
      await expect(allBlogs.nth(2)).toContainText('Blog with least likes')
})*/    })
})