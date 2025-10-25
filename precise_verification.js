const { chromium } = require('playwright');

async function preciseVerification() {
    console.log('🎯 LunaTTS 文字显示精确验证');
    console.log('='.repeat(50));

    let browser;
    try {
        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();

        // 访问页面
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        await page.waitForTimeout(5000); // 等待更长时间确保渲染完成

        // 截图
        await page.screenshot({
            path: 'lunatts_precise_verification.png',
            fullPage: true
        });

        console.log('\n🔍 精确查找 LunaTTS 元素...');

        // 多种方法查找 LunaTTS 元素
        const searchResults = await page.evaluate(() => {
            const results = [];

            // 方法1: 直接查找包含精确 "LunaTTS" 文本的元素
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                const text = element.textContent || '';
                const innerHTML = element.innerHTML || '';

                // 查找包含 "LunaTTS" 的元素，但要排除样式表和脚本
                if (text.includes('LunaTTS') &&
                    !element.tagName.includes('STYLE') &&
                    !element.tagName.includes('SCRIPT') &&
                    text.trim().length < 100) { // 避免包含大量其他文本的元素

                    const computed = window.getComputedStyle(element);
                    const rect = element.getBoundingClientRect();

                    // 检查是否真正可见
                    const isVisible = rect.width > 0 &&
                                    rect.height > 0 &&
                                    computed.display !== 'none' &&
                                    computed.visibility !== 'hidden' &&
                                    computed.opacity !== '0' &&
                                    rect.top >= 0 &&
                                    rect.left >= 0;

                    results.push({
                        tagName: element.tagName,
                        className: element.className,
                        id: element.id,
                        text: text.trim(),
                        innerHTML: innerHTML.substring(0, 200),
                        visible: isVisible,
                        rect: {
                            x: Math.round(rect.x),
                            y: Math.round(rect.y),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        },
                        styles: {
                            fontSize: computed.fontSize,
                            fontWeight: computed.fontWeight,
                            color: computed.color,
                            fontFamily: computed.fontFamily,
                            background: computed.background,
                            backgroundImage: computed.backgroundImage,
                            WebkitBackgroundClip: computed.WebkitBackgroundClip,
                            WebkitTextFillColor: computed.WebkitTextFillColor,
                            textShadow: computed.textShadow,
                            display: computed.display,
                            position: computed.position
                        },
                        hasGradient: computed.backgroundImage && computed.backgroundImage.includes('gradient'),
                        hasWebkitFill: computed.WebkitTextFillColor &&
                                      computed.WebkitTextFillColor !== computed.color
                    });
                }
            }

            return results;
        });

        console.log(`📊 找到 ${searchResults.length} 个包含 "LunaTTS" 的候选元素:`);

        if (searchResults.length === 0) {
            console.log('❌ 未找到任何包含 "LunaTTS" 的元素');

            // 调试信息：页面标题和主要内容
            const debugInfo = await page.evaluate(() => {
                return {
                    title: document.title,
                    bodyText: document.body.innerText.substring(0, 500),
                    allHeadings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
                        .map(h => ({ tag: h.tagName, text: h.textContent.trim() }))
                };
            });

            console.log('🔍 调试信息:');
            console.log(`   页面标题: ${debugInfo.title}`);
            console.log(`   页面开头文本: ${debugInfo.bodyText.substring(0, 200)}...`);
            console.log(`   页面标题元素:`, debugInfo.allHeadings);

            return false;
        }

        // 分析每个找到的元素
        let mainElement = null;
        searchResults.forEach((element, index) => {
            console.log(`\n元素 ${index + 1}:`);
            console.log(`  标签: ${element.tagName}`);
            console.log(`  类名: ${element.className}`);
            console.log(`  ID: ${element.id}`);
            console.log(`  文本: "${element.text}"`);
            console.log(`  可见: ${element.visible ? '✅ 是' : '❌ 否'}`);
            console.log(`  位置: (${element.rect.x}, ${element.rect.y})`);
            console.log(`  尺寸: ${element.rect.width} x ${element.rect.height}`);
            console.log(`  字体: ${element.styles.fontFamily} ${element.styles.fontSize}`);
            console.log(`  颜色: ${element.styles.color}`);
            console.log(`  渐变: ${element.hasGradient ? '✅ 是' : '❌ 否'}`);
            console.log(`  Webkit填充: ${element.hasWebkitFill ? '✅ 是' : '❌ 否'}`);

            // 选择主要的可见元素
            if (element.visible && !mainElement) {
                mainElement = element;
            }
        });

        if (!mainElement) {
            console.log('\n❌ 没有找到可见的 LunaTTS 元素');
            return false;
        }

        console.log('\n🎯 主要元素分析:');
        console.log(`✅ 选择元素: ${mainElement.tagName}.${mainElement.className}`);
        console.log(`📍 位置: (${mainElement.rect.x}, ${mainElement.rect.y})`);
        console.log(`📏 尺寸: ${mainElement.rect.width} x ${mainElement.rect.height}`);

        // 检查是否在 Header 区域（页面顶部200px内）
        const inHeader = mainElement.rect.y < 200;
        console.log(`🏠 Header位置: ${inHeader ? '✅ 是' : '❌ 否'}`);

        // 检查样式效果
        console.log('\n🎨 样式效果检查:');
        console.log(`   字体粗细: ${mainElement.styles.fontWeight}`);
        console.log(`   字体大小: ${mainElement.styles.fontSize}`);
        console.log(`   背景图片: ${mainElement.styles.backgroundImage}`);
        console.log(`   Webkit背景裁剪: ${mainElement.styles.WebkitBackgroundClip}`);
        console.log(`   Webkit文字填充: ${mainElement.styles.WebkitTextFillColor}`);
        console.log(`   文字阴影: ${mainElement.styles.textShadow}`);

        const hasGradientEffect = mainElement.hasGradient || mainElement.hasWebkitFill;
        console.log(`   渐变效果: ${hasGradientEffect ? '✅ 是' : '❌ 否'}`);

        // 查找相邻的 logo 元素
        console.log('\n🔗 查找相邻的 logo 元素...');
        const nearbyElements = await page.evaluate((mainElementRect) => {
            const nearby = [];
            const allElements = document.querySelectorAll('*');

            for (const element of allElements) {
                const rect = element.getBoundingClientRect();
                const computed = window.getComputedStyle(element);

                // 查找在水平方向上相对接近的元素（可能是logo）
                const horizontalDistance = Math.abs(rect.x - mainElementRect.x);
                const verticalDistance = Math.abs(rect.y - mainElementRect.y);

                if (horizontalDistance < 300 && verticalDistance < 100 &&
                    rect.width > 0 && rect.height > 0 &&
                    computed.display !== 'none' &&
                    element.tagName !== 'STYLE' && element.tagName !== 'SCRIPT') {

                    const isLogo = element.tagName === 'IMG' ||
                                  element.tagName === 'svg' ||
                                  element.querySelector('img') ||
                                  element.querySelector('svg') ||
                                  element.alt?.toLowerCase().includes('logo') ||
                                  element.className?.toLowerCase().includes('logo') ||
                                  element.src?.toLowerCase().includes('icon');

                    if (isLogo) {
                        nearby.push({
                            tagName: element.tagName,
                            className: element.className,
                            src: element.src || '',
                            alt: element.alt || '',
                            distance: horizontalDistance,
                            sameRow: verticalDistance < 50,
                            rect: {
                                x: Math.round(rect.x),
                                y: Math.round(rect.y),
                                width: Math.round(rect.width),
                                height: Math.round(rect.height)
                            }
                        });
                    }
                }
            }

            return nearby;
        }, mainElement.rect);

        if (nearbyElements.length > 0) {
            console.log(`✅ 找到 ${nearbyElements.length} 个相邻的 logo 元素:`);
            nearbyElements.forEach((el, i) => {
                console.log(`   ${i+1}. ${el.tagName} - 距离: ${el.distance}px, 同行: ${el.sameRow ? '是' : '否'}`);
                if (el.src) console.log(`      图片: ${el.src}`);
                if (el.alt) console.log(`      Alt: ${el.alt}`);
            });
        } else {
            console.log('⚠️ 未找到理想的相邻 logo 元素');
        }

        // 生成最终评估
        console.log('\n🏆 最终评估:');

        const criteria = [
            { name: '文字可见', passed: mainElement.visible },
            { name: 'Header位置', passed: inHeader },
            { name: '渐变效果', passed: hasGradientEffect }
        ];

        let passedCount = 0;
        criteria.forEach(criterion => {
            const status = criterion.passed ? '✅' : '❌';
            console.log(`   ${status} ${criterion.name}`);
            if (criterion.passed) passedCount++;
        });

        const totalScore = passedCount;
        const maxScore = criteria.length;

        console.log(`\n📊 总分: ${totalScore}/${maxScore}`);

        let finalResult;
        if (totalScore >= 2) {
            finalResult = '✅ 验证通过';
            console.log(`\n🎉 ${finalResult}! LunaTTS 文字已正确显示`);
        } else {
            finalResult = '❌ 需要改进';
            console.log(`\n⚠️ ${finalResult}! LunaTTS 文字显示需要优化`);
        }

        // 为主要元素截图
        if (mainElement.visible) {
            try {
                // 尝试截取元素区域
                await page.screenshot({
                    path: 'lunatts_main_element.png',
                    clip: {
                        x: Math.max(0, mainElement.rect.x - 10),
                        y: Math.max(0, mainElement.rect.y - 10),
                        width: mainElement.rect.width + 20,
                        height: mainElement.rect.height + 20
                    }
                });
                console.log(`\n📸 主要元素截图已保存: lunatts_main_element.png`);
            } catch (e) {
                console.log(`\n⚠️ 元素截图失败: ${e.message}`);
            }
        }

        return totalScore >= 2;

    } catch (error) {
        console.error('❌ 验证过程中发生错误:', error.message);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 运行精确验证
preciseVerification().then(success => {
    console.log(`\n✨ 验证完成! ${success ? '成功' : '失败'}`);
    process.exit(success ? 0 : 1);
});