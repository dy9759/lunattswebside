const { chromium } = require('playwright');
const fs = require('fs');

async function verifyLunaTTSSimple() {
    console.log('🚀 开始简单验证 LunaTTS 文字显示...');

    let browser;
    try {
        browser = await chromium.launch({
            headless: false
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        // 导航到页面
        console.log('📍 正在导航到 http://localhost:3000...');
        await page.goto('http://localhost:3000', {
            waitUntil: 'networkidle'
        });

        console.log('✅ 页面加载成功');
        await page.waitForTimeout(3000);

        // 截取完整页面截图
        await page.screenshot({
            path: 'lunatts_full_page_simple.png',
            fullPage: true
        });
        console.log('✅ 页面截图已保存: lunatts_full_page_simple.png');

        // 查找 LunaTTS 文字并获取详细信息
        const results = await page.evaluate(() => {
            const elements = [];

            // 方法1: 直接查找包含 LunaTTS 文本的元素
            const allElements = document.querySelectorAll('*');

            for (const element of allElements) {
                const text = element.textContent || '';
                if (text.includes('LunaTTS')) {
                    const computed = window.getComputedStyle(element);
                    const rect = element.getBoundingClientRect();

                    // 检查元素是否真正可见
                    const isVisible = rect.width > 0 &&
                                   rect.height > 0 &&
                                   computed.display !== 'none' &&
                                   computed.visibility !== 'hidden' &&
                                   computed.opacity !== '0';

                    elements.push({
                        tagName: element.tagName,
                        className: element.className,
                        id: element.id,
                        text: text.trim(),
                        innerHTML: element.innerHTML,
                        visible: isVisible,
                        rect: {
                            x: Math.round(rect.x),
                            y: Math.round(rect.y),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        },
                        styles: {
                            fontSize: computed.fontSize,
                            fontFamily: computed.fontFamily,
                            fontWeight: computed.fontWeight,
                            color: computed.color,
                            background: computed.background,
                            backgroundImage: computed.backgroundImage,
                            backgroundClip: computed.backgroundClip,
                            WebkitBackgroundClip: computed.WebkitBackgroundClip,
                            WebkitTextFillColor: computed.WebkitTextFillColor,
                            textShadow: computed.textShadow,
                            letterSpacing: computed.letterSpacing,
                            display: computed.display,
                            position: computed.position
                        }
                    });
                }
            }

            return elements;
        });

        console.log(`📝 找到 ${results.length} 个包含 'LunaTTS' 的元素`);

        if (results.length === 0) {
            console.log('❌ 未找到任何包含 "LunaTTS" 的元素');

            // 获取页面中所有文本进行调试
            const allText = await page.evaluate(() => {
                return document.body.innerText;
            });

            console.log('🔍 页面中的文本内容:');
            console.log(allText);
            return false;
        }

        // 分析找到的元素
        let hasVisible = false;
        let hasInHeader = false;
        let hasGradient = false;
        let mainElement = null;

        console.log('\n📊 元素详细分析:');

        results.forEach((element, index) => {
            console.log(`\n元素 ${index + 1}:`);
            console.log(`  标签: ${element.tagName}`);
            console.log(`  类名: ${element.className}`);
            console.log(`  ID: ${element.id}`);
            console.log(`  文本: '${element.text}'`);
            console.log(`  可见: ${element.visible ? '✅ 是' : '❌ 否'}`);
            console.log(`  位置: (${element.rect.x}, ${element.rect.y})`);
            console.log(`  尺寸: ${element.rect.width} x ${element.rect.height}`);
            console.log(`  字体: ${element.styles.fontFamily}`);
            console.log(`  字体大小: ${element.styles.fontSize}`);
            console.log(`  字体粗细: ${element.styles.fontWeight}`);
            console.log(`  颜色: ${element.styles.color}`);

            // 检查渐变效果
            const bgGradient = element.styles.backgroundImage && element.styles.backgroundImage.includes('gradient');
            const webkitFill = element.styles.WebkitTextFillColor &&
                             element.styles.WebkitTextFillColor !== element.styles.color;
            const hasGradientEffect = bgGradient || webkitFill;

            console.log(`  背景图片: ${element.styles.backgroundImage}`);
            console.log(`  Webkit文字填充: ${element.styles.WebkitTextFillColor}`);
            console.log(`  渐变效果: ${hasGradientEffect ? '✅ 是' : '❌ 否'}`);

            if (element.styles.textShadow) {
                console.log(`  文字阴影: ${element.styles.textShadow}`);
            }

            // 检查是否在 header 区域（页面顶部200px内）
            const inHeader = element.rect.y < 200;
            console.log(`  在Header区域: ${inHeader ? '✅ 是' : '❌ 否'}`);

            // 更新统计
            if (element.visible && !mainElement) {
                mainElement = element;
            }
            if (element.visible) hasVisible = true;
            if (inHeader) hasInHeader = true;
            if (hasGradientEffect) hasGradient = true;

            // 为主要可见元素截图
            if (element.visible && index === 0) {
                page.locator(`text=${element.text}`).first().screenshot({
                    path: `lunatts_element_detailed.png`
                });
                console.log(`  ✅ 元素截图已保存: lunatts_element_detailed.png`);
            }
        });

        // 查找相关的 logo 或图标元素
        console.log('\n🎯 查找相邻的 logo/图标元素...');

        const nearbyElements = await page.evaluate(() => {
            const lunattsElement = Array.from(document.querySelectorAll('*')).find(el =>
                el.textContent && el.textContent.includes('LunaTTS') &&
                el.getBoundingClientRect().width > 0
            );

            if (!lunattsElement) return [];

            const lunattsRect = lunattsElement.getBoundingClientRect();
            const nearby = [];

            // 查找附近的所有元素
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                const rect = element.getBoundingClientRect();
                const horizontalDistance = Math.abs(rect.x - lunattsRect.x);
                const verticalDistance = Math.abs(rect.y - lunattsRect.y);

                // 寻找在水平方向上相对接近的元素（可能是logo）
                if (horizontalDistance < 300 && verticalDistance < 100 &&
                    rect.width > 0 && rect.height > 0 &&
                    element !== lunattsElement) {

                    const computed = window.getComputedStyle(element);
                    const isVisible = computed.display !== 'none' &&
                                    computed.visibility !== 'hidden';

                    if (isVisible) {
                        nearby.push({
                            tagName: element.tagName,
                            className: element.className,
                            src: element.src || '',
                            alt: element.alt || '',
                            rect: {
                                x: Math.round(rect.x),
                                y: Math.round(rect.y),
                                width: Math.round(rect.width),
                                height: Math.round(rect.height)
                            },
                            distance: horizontalDistance,
                            sameRow: verticalDistance < 50
                        });
                    }
                }
            }

            return nearby;
        });

        console.log(`📍 找到 ${nearbyElements.length} 个相邻元素:`);
        nearbyElements.forEach((element, index) => {
            console.log(`  ${index + 1}. ${element.tagName} - 距离: ${element.distance}px, 同行: ${element.sameRow ? '是' : '否'}`);
            if (element.src) console.log(`     图片: ${element.src}`);
            if (element.alt) console.log(`     Alt: ${element.alt}`);
        });

        // 生成最终验证报告
        console.log('\n' + '='.repeat(60));
        console.log('📋 LunaTTS 文字显示验证报告');
        console.log('='.repeat(60));

        console.log(`📊 验证结果:`);
        console.log(`   找到 LunaTTS 文字: ✅ 是 (${results.length} 个)`);
        console.log(`   文字可见: ${hasVisible ? '✅ 是' : '❌ 否'}`);
        console.log(`   在 Header 中: ${hasInHeader ? '✅ 是' : '❌ 否'}`);
        console.log(`   渐变效果: ${hasGradient ? '✅ 是' : '❌ 否'}`);

        if (mainElement) {
            console.log(`\n🎯 主要元素详情:`);
            console.log(`   文本: '${mainElement.text}'`);
            console.log(`   标签: ${mainElement.tagName}`);
            console.log(`   类名: ${mainElement.className}`);
            console.log(`   位置: (${mainElement.rect.x}, ${mainElement.rect.y})`);
            console.log(`   尺寸: ${mainElement.rect.width} x ${mainElement.rect.height}`);
            console.log(`   字体: ${mainElement.styles.fontFamily} ${mainElement.styles.fontSize}`);
            console.log(`   颜色: ${mainElement.styles.color}`);

            if (mainElement.styles.backgroundImage && mainElement.styles.backgroundImage.includes('gradient')) {
                console.log(`   ✅ 背景渐变效果`);
            }
            if (mainElement.styles.WebkitTextFillColor && mainElement.styles.WebkitTextFillColor !== mainElement.styles.color) {
                console.log(`   ✅ Webkit文字填充效果`);
            }
            if (mainElement.styles.textShadow) {
                console.log(`   ✅ 文字阴影效果: ${mainElement.styles.textShadow}`);
            }
        }

        if (nearbyElements.length > 0) {
            console.log(`\n📍 位置关系:`);
            const adjacentElements = nearbyElements.filter(el => el.sameRow && el.distance < 200);
            if (adjacentElements.length > 0) {
                console.log(`   ✅ 找到相邻的 logo/图标元素 (${adjacentElements.length} 个)`);
            } else {
                console.log(`   ⚠️ 未找到理想的相邻 logo/图标元素`);
            }
        }

        // 计算总体成功率
        const criteria = [
            hasVisible,
            hasInHeader,
            hasGradient
        ];
        const passedCriteria = criteria.filter(Boolean).length;
        const overallSuccess = passedCriteria >= 2; // 至少满足2个条件

        console.log(`\n🏆 最终结论:`);
        console.log(`   通过标准: ${passedCriteria}/3`);
        console.log(`   验证结果: ${overallSuccess ? '✅ 通过' : '❌ 失败'}`);

        // 保存详细报告
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalElements: results.length,
                hasVisible,
                hasInHeader,
                hasGradient,
                overallSuccess
            },
            mainElement,
            nearbyElements,
            allElements: results
        };

        fs.writeFileSync('lunatts_verification_simple.json', JSON.stringify(report, null, 2));
        console.log(`\n📄 详细报告已保存: lunatts_verification_simple.json`);

        return overallSuccess;

    } catch (error) {
        console.error('❌ 验证过程中发生错误:', error);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 运行验证
verifyLunaTTSSimple().then(result => {
    console.log(`\n🎉 验证完成! 结果: ${result ? '通过' : '失败'}`);
    process.exit(result ? 0 : 1);
}).catch(error => {
    console.error('❌ 验证脚本执行失败:', error);
    process.exit(1);
});