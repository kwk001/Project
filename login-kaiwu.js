const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // 显示窗口便于调试
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    // 1. 打开开物平台
    console.log('正在打开开物平台...');
    await page.goto('https://app.kaiwu.cloud/', { waitUntil: 'networkidle' });

    // 等待页面加载
    await page.waitForTimeout(2000);

    // 截图：登录页面
    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/step1-login-page.png', fullPage: true });
    console.log('已截图：登录页面');

    // 2. 输入账号密码
    console.log('正在输入登录信息...');

    // 查找用户名输入框（常见选择器）
    const usernameSelectors = [
      'input[name="username"]',
      'input[name="loginName"]',
      'input[name="account"]',
      'input[name="email"]',
      'input[type="text"]',
      '.ant-input',
      '[placeholder*="用户名"]',
      '[placeholder*="账号"]'
    ];

    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '.ant-input[type="password"]'
    ];

    // 尝试找到用户名输入框
    let usernameFound = false;
    for (const selector of usernameSelectors) {
      try {
        if (await page.locator(selector).first().isVisible({ timeout: 1000 })) {
          await page.locator(selector).first().fill('admin');
          console.log(`找到用户名输入框: ${selector}`);
          usernameFound = true;
          break;
        }
      } catch (e) {}
    }

    // 尝试找到密码输入框
    let passwordFound = false;
    for (const selector of passwordSelectors) {
      try {
        if (await page.locator(selector).first().isVisible({ timeout: 1000 })) {
          await page.locator(selector).first().fill('abc@123');
          console.log(`找到密码输入框: ${selector}`);
          passwordFound = true;
          break;
        }
      } catch (e) {}
    }

    if (!usernameFound || !passwordFound) {
      console.log('未找到标准登录表单，尝试获取页面HTML分析...');
      const html = await page.content();
      console.log('页面HTML片段（前2000字符）:', html.substring(0, 2000));

      // 保存HTML用于分析
      const fs = require('fs');
      fs.writeFileSync('/Users/apple/Desktop/文件/kaiwu-project/page-source.html', html);
    }

    // 截图：填写登录信息后
    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/step2-login-filled.png', fullPage: true });

    // 3. 点击登录按钮
    const loginBtnSelectors = [
      'button[type="submit"]',
      '.ant-btn-primary',
      'button:has-text("登录")',
      'button:has-text("Login")',
      '.login-btn',
      '[class*="login"] button'
    ];

    for (const selector of loginBtnSelectors) {
      try {
        if (await page.locator(selector).first().isVisible({ timeout: 1000 })) {
          await page.locator(selector).first().click();
          console.log(`点击登录按钮: ${selector}`);
          break;
        }
      } catch (e) {}
    }

    // 等待登录完成
    await page.waitForTimeout(3000);

    // 截图：登录后
    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/step3-logged-in.png', fullPage: true });
    console.log('已截图：登录后页面');

    // 4. 导航到商品档案页面
    // 应用ID: 8458f839b9260c7487315662282d1818
    const appUrl = `https://app.kaiwu.cloud/app/8458f839b9260c7487315662282d1818`;
    console.log(`正在导航到应用: ${appUrl}`);
    await page.goto(appUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // 截图：商品档案页面
    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/step4-goods-page.png', fullPage: true });
    console.log('已截图：商品档案页面');

    console.log('预览完成！截图已保存。');

  } catch (error) {
    console.error('发生错误:', error);
    await page.screenshot({ path: '/Users/apple/Desktop/文件/kaiwu-project/error-screenshot.png', fullPage: true });
  } finally {
    // 保持浏览器打开以便查看
    console.log('浏览器保持打开状态，按 Ctrl+C 关闭');
    // await browser.close();
  }
})();
