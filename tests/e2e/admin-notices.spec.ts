import { test, expect } from '@playwright/test';

test.describe('Admin Notice Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');
  });

  test('should load admin dashboard', async ({ page }) => {
    // Check if admin page loads
    await expect(page).toHaveTitle(/Naranhi/);
    
    // Check for admin navigation or content
    const adminContent = page.locator('body');
    await expect(adminContent).toBeVisible();
  });

  test('should navigate to notices page', async ({ page }) => {
    // Navigate to notices page
    await page.goto('/admin/notices');
    
    // Check if notices page loads
    await expect(page.locator('h2')).toContainText('공지사항 관리');
    
    // Check for create button
    const createButton = page.locator('button', { hasText: '공지사항 작성' });
    await expect(createButton).toBeVisible();
  });

  test('should access notice creation page', async ({ page }) => {
    // Navigate to create notice page
    await page.goto('/admin/notices/create');
    
    // Check if create page loads
    await expect(page.locator('input[placeholder*="제목"]')).toBeVisible();
    
    // Check if Tiptap editor is present
    const editor = page.locator('.ProseMirror');
    await expect(editor).toBeVisible();
  });

  test('should create a new notice with text', async ({ page }) => {
    await page.goto('/admin/notices/create');
    
    // Fill in notice details
    await page.fill('input[placeholder*="제목"]', 'E2E 테스트 공지사항');
    
    // Wait for editor to be ready and add content
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.fill('이것은 E2E 테스트로 생성된 공지사항입니다.');
    
    // Select category if available
    const categorySelect = page.locator('button[role="combobox"]').first();
    if (await categorySelect.isVisible()) {
      await categorySelect.click();
      const firstOption = page.locator('[role="option"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
    }
    
    // Save as draft
    const saveButton = page.locator('button', { hasText: '임시저장' });
    if (await saveButton.isVisible()) {
      await saveButton.click();
    } else {
      // Try alternative save buttons
      const alternativeButtons = [
        page.locator('button', { hasText: '저장' }),
        page.locator('button', { hasText: '발행' }),
        page.locator('button[type="submit"]')
      ];
      
      for (const button of alternativeButtons) {
        if (await button.isVisible()) {
          await button.click();
          break;
        }
      }
    }
    
    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Check if redirected to notices list or success message appears
    const currentUrl = page.url();
    const isOnNoticesList = currentUrl.includes('/admin/notices') && !currentUrl.includes('/create');
    const hasSuccessMessage = await page.locator('.toast, [role="alert"], .success').isVisible();
    
    expect(isOnNoticesList || hasSuccessMessage).toBe(true);
  });

  test('should test image upload functionality', async ({ page }) => {
    await page.goto('/admin/notices/create');
    
    // Wait for editor to load
    const editor = page.locator('.ProseMirror');
    await editor.waitFor();
    
    // Look for image upload button in toolbar
    const imageButton = page.locator('button[title*="이미지"], button[aria-label*="이미지"], button[data-testid*="image"]');
    
    if (await imageButton.isVisible()) {
      await imageButton.click();
      
      // Check if image upload dialog opens
      const dialog = page.locator('[role="dialog"], .modal, .image-upload');
      await expect(dialog).toBeVisible({ timeout: 10000 });
      
      // Check for file input or drag zone
      const fileInput = page.locator('input[type="file"], input[accept*="image"]');
      const dragZone = page.locator('.drag-zone, [data-testid="drop-zone"]');
      
      const hasUploadInterface = await fileInput.isVisible() || await dragZone.isVisible();
      expect(hasUploadInterface).toBe(true);
    }
  });

  test('should validate notice form requirements', async ({ page }) => {
    await page.goto('/admin/notices/create');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /저장|발행|임시저장/ });
    
    if (await submitButton.first().isVisible()) {
      await submitButton.first().click();
      
      // Check for validation errors
      await page.waitForTimeout(1000);
      
      const hasErrors = await page.locator('.error, [role="alert"], .text-red').isVisible();
      const titleInput = page.locator('input[placeholder*="제목"]');
      const isRequired = await titleInput.getAttribute('required') !== null;
      
      // Either should show validation errors or have required attributes
      expect(hasErrors || isRequired).toBe(true);
    }
  });

  test('should test API endpoints', async ({ page }) => {
    // Test notice categories API
    const categoriesResponse = await page.request.get('/api/admin/notice-categories');
    expect(categoriesResponse.status()).toBeLessThan(500); // Should not be server error
    
    // Test notices API
    const noticesResponse = await page.request.get('/api/admin/notices');
    expect(noticesResponse.status()).toBeLessThan(500); // Should not be server error
    
    // Test image upload API endpoint exists
    const uploadResponse = await page.request.post('/api/admin/upload-image', {
      data: { test: true }
    });
    expect(uploadResponse.status()).not.toBe(404); // Endpoint should exist
  });

  test('should handle responsive design', async ({ page }) => {
    await page.goto('/admin/notices');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Check if page is still accessible on mobile
    const content = page.locator('body');
    await expect(content).toBeVisible();
    
    // Check if navigation is accessible (might be collapsed)
    const navigation = page.locator('nav, .nav, .sidebar, [role="navigation"]');
    const hasNavigation = await navigation.isVisible();
    
    // Either navigation is visible or there's a mobile menu trigger
    const mobileMenuTrigger = page.locator('button[aria-expanded], .menu-trigger, .hamburger');
    const hasMobileMenu = await mobileMenuTrigger.isVisible();
    
    expect(hasNavigation || hasMobileMenu).toBe(true);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    // Check if desktop layout works
    await expect(content).toBeVisible();
  });

  test('should test editor functionality', async ({ page }) => {
    await page.goto('/admin/notices/create');
    
    // Wait for Tiptap editor to load
    const editor = page.locator('.ProseMirror');
    await editor.waitFor();
    
    // Test text input
    await editor.click();
    await editor.fill('테스트 텍스트 입력');
    
    // Check if text appears in editor
    await expect(editor).toContainText('테스트 텍스트 입력');
    
    // Test toolbar buttons if available
    const toolbar = page.locator('.toolbar, .editor-toolbar, [role="toolbar"]');
    if (await toolbar.isVisible()) {
      const buttons = toolbar.locator('button');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
    }
  });
});

test.describe('Public Pages', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if homepage loads
    await expect(page).toHaveTitle(/Naranhi/);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should load notice public pages', async ({ page }) => {
    await page.goto('/notice');
    
    // Should load public notice page or redirect
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check if it's not a 404 page
    const notFoundIndicators = page.locator('h1, h2').filter({ hasText: /404|Not Found|페이지를 찾을 수 없습니다/ });
    const isNotFound = await notFoundIndicators.count() > 0;
    expect(isNotFound).toBe(false);
  });
});

test.describe('Error Handling', () => {
  test('should handle non-existent admin pages gracefully', async ({ page }) => {
    // Test non-existent admin page
    const response = await page.goto('/admin/non-existent-page');
    
    // Should either redirect or show 404
    expect(response?.status()).toBeLessThan(500); // No server errors
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/admin/notices/create');
    
    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait for page interactions
    await page.waitForTimeout(3000);
    
    // Check for critical console errors
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('ReferenceError') || 
      error.includes('SyntaxError')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});