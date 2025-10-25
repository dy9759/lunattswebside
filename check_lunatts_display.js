const puppeteer = require('puppeteer');
const path = require('path');

async function checkLunaTTSDisplay() {
  let browser;

  try {
    console.log('启动浏览器...');
    browser = await puppeteer.launch({
      headless: false,  // 设置为 false 以查看浏览器操作
      defaultViewport: { width: 1200, height: 800 }
    });

    const page = await browser.newPage();

    console.log('导航到 http://localhost:3000...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 等待页面完全加载
    await page.waitForTimeout(3000);

    console.log('截取完整页面截图...');
    const screenshotPath = path.join(__dirname, 'lunatts_page_screenshot.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`✅ 截图已保存: ${screenshotPath}`);

    // 检查 LunaTTS 文字元素
    console.log('\n检查 LunaTTS 文字元素...');

    // 方法1: 查找包含 LunaTTS 文本的元素
    const lunattsElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .filter(el => el.textContent && el.textContent.includes('LunaTTS'))
        .map(el => ({
          tagName: el.tagName,
          className: el.className,
          textContent: el.textContent.trim(),
          isVisible: window.getComputedStyle(el).display !== 'none' &&
                    window.getComputedStyle(el).visibility !== 'hidden' &&
                    window.getComputedStyle(el).opacity !== '0',
          styles: {
            display: window.getComputedStyle(el).display,
            visibility: window.getComputedStyle(el).visibility,
            opacity: window.getComputedStyle(el).opacity,
            fontSize: window.getComputedStyle(el).fontSize,
            color: window.getComputedStyle(el).color,
            fontFamily: window.getComputedStyle(el).fontFamily
          },
          bounds: el.getBoundingClientRect()
        }));
    });

    console.log(`找到 ${lunattsElements.length} 个包含 'LunaTTS' 的元素:`);

    if (lunattsElements.length > 0) {
      lunattsElements.forEach((element, index) => {
        console.log(`\n--- 元素 ${index + 1} ---`);
        console.log(`标签: ${element.tagName}`);
        console.log(`类名: ${element.className}`);
        console.log(`文本内容: "${element.textContent}"`);
        console.log(`可见性: ${element.isVisible ? '✅ 可见' : '❌ 不可见'}`);
        console.log(`位置和大小: x=${element.bounds.x.toFixed(2)}, y=${element.bounds.y.toFixed(2)}, width=${element.bounds.width.toFixed(2)}, height=${element.bounds.height.toFixed(2)}`);

        console.log('CSS 样式:');
        Object.entries(element.styles).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      });
    } else {
      console.log('❌ 未找到包含 "LunaTTS" 的元素');

      // 检查变体
      const variants = ['Luna', 'TTS', 'luna', 'tts', 'LUNATTS'];
      for (const variant of variants) {
        const variantElements = await page.evaluate((text) => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements
            .filter(el => el.textContent && el.textContent.toLowerCase().includes(text.toLowerCase()))
            .map(el => ({
              tagName: el.tagName,
              className: el.className,
              textContent: el.textContent.trim()
            }));
        }, variant);

        if (variantElements.length > 0) {
          console.log(`找到包含 "${variant}" 的元素: ${variantElements.length} 个`);
          variantElements.slice(0, 3).forEach((elem, i) => {
            console.log(`  元素 ${i+1}: <${elem.tagName}> "${elem.textContent}"`);
          });
        }
      }
    }

    // 检查 Header 组件
    console.log('\n--- Header 组件检查 ---');
    const headerInfo = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return null;

      return {
        tagName: header.tagName,
        className: header.className,
        innerHTML: header.innerHTML.substring(0, 500),
        textContent: header.textContent.trim(),
        isVisible: window.getComputedStyle(header).display !== 'none',
        bounds: header.getBoundingClientRect()
      };
    });

    if (headerInfo) {
      console.log(`Header 元素信息:`);
      console.log(`  标签: ${headerInfo.tagName}`);
      console.log(`  类名: ${headerInfo.className}`);
      console.log(`  可见性: ${headerInfo.isVisible ? '✅ 可见' : '❌ 不可见'}`);
      console.log(`  文本内容: "${headerInfo.textContent}"`);
      console.log(`  HTML 片段: ${headerInfo.innerHTML}...`);
    } else {
      console.log('❌ 未找到 header 元素');
    }

    // 检查页面整体文本内容
    console.log('\n--- 页面整体内容检查 ---');
    const pageText = await page.evaluate(() => document.body.textContent);
    console.log(`页面包含 "LunaTTS": ${pageText.includes('LunaTTS') ? '✅ 是' : '❌ 否'}`);
    console.log(`页面包含 "Luna": ${pageText.includes('Luna') ? '✅ 是' : '❌ 否'}`);
    console.log(`页面包含 "TTS": ${pageText.includes('TTS') ? '✅ 是' : '❌ 否'}`);

    // 检查是否有 typeless-icon-text 类的元素
    console.log('\n--- typeless-icon-text 类检查 ---');
    const typelessElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.typeless-icon-text'));
      return elements.map(el => ({
        tagName: el.tagName,
        textContent: el.textContent.trim(),
        styles: {
          display: window.getComputedStyle(el).display,
          visibility: window.getComputedStyle(el).visibility,
          opacity: window.getComputedStyle(el).opacity,
          fontSize: window.getComputedStyle(el).fontSize,
          lineHeight: window.getComputedStyle(el).lineHeight
        }
      }));
    });

    console.log(`找到 ${typelessElements.length} 个 .typeless-icon-text 元素:`);
    typelessElements.forEach((element, index) => {
      console.log(`\n元素 ${index + 1}:`);
      console.log(`  标签: ${element.tagName}`);
      console.log(`  文本: "${element.textContent}"`);
      console.log(`  样式:`);
      Object.entries(element.styles).forEach(([key, value]) => {
        console.log(`    ${key}: ${value}`);
      });
    });

    // 截取 Header 区域的特写截图
    const headerBounds = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? header.getBoundingClientRect() : null;
    });

    if (headerBounds && headerBounds.height > 0) {
      console.log('\n截取 Header 区域特写...');
      const headerScreenshotPath = path.join(__dirname, 'lunatts_header_screenshot.png');
      await page.screenshot({
        path: headerScreenshotPath,
        clip: {
          x: headerBounds.x,
          y: headerBounds.y,
          width: headerBounds.width,
          height: Math.min(headerBounds.height, 200) // 限制高度以避免过大图片
        }
      });
      console.log(`✅ Header 截图已保存: ${headerScreenshotPath}`);
    }

  } catch (error) {
    console.error('❌ 发生错误:', error);
  } finally {
    if (browser) {
      console.log('\n关闭浏览器...');
      await browser.close();
    }
  }
}

// 运行检查
checkLunaTTSDisplay();