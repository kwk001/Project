const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. 打开开物平台
    console.log('正在打开开物平台...');
    await page.goto('https://app.kaiwu.cloud/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 截图：登录页面
    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/v2-step1-login.png', fullPage: true });
    console.log('已截图：登录页面');

    // 2. 点击"密码登录"标签（如果当前不是）
    const passwordTab = await page.locator('text=密码登录').first();
    if (await passwordTab.isVisible({ timeout: 3000 })) {
      await passwordTab.click();
      console.log('切换到密码登录');
      await page.waitForTimeout(500);
    }

    // 3. 输入账号密码
    console.log('正在输入登录信息...');
    await page.locator('input[type="text"]').first().fill('admin');
    await page.locator('input[name="password"]').first().fill('abc@123');

    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/v2-step2-filled.png', fullPage: true });
    console.log('已截图：填写信息后');

    // 4. 点击登录按钮
    await page.locator('button:has-text("登录")').first().click();
    console.log('点击登录按钮');

    // 5. 等待登录完成（等待跳转或特定元素出现）
    console.log('等待登录完成...');
    await page.waitForTimeout(5000);

    // 检查是否还在登录页
    const currentUrl = page.url();
    console.log('当前URL:', currentUrl);

    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/v2-step3-after-login.png', fullPage: true });
    console.log('已截图：登录后');

    // 6. 如果登录成功，导航到应用
    if (!currentUrl.includes('login')) {
      console.log('登录成功，准备导航到应用...');

      // 尝试访问应用
      const appUrl = 'https://app.kaiwu.cloud/app/8458f839b9260c7487315662282d1818';
      await page.goto(appUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(5000);

      await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/v2-step4-app.png', fullPage: true });
      console.log('已截图：应用页面');
    } else {
      console.log('可能仍在登录页，检查是否有错误信息...');

      // 尝试获取错误信息
      const errorMsg = await page.locator('.ant-form-item-explain-error, .error-message, [class*="error"]').first().textContent().catch(() => null);
      if (errorMsg) {
        console.log('错误信息:', errorMsg);
      }
    }

    console.log('预览完成！');

  } catch (error) {
    console.error('发生错误:', error);
    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/v2-error.png', fullPage: true });
  }

  // 保持浏览器打开
  console.log('浏览器保持打开，按 Ctrl+C 关闭');
})();
