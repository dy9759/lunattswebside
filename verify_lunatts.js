const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function verifyLunaTTSDisplay() {
    console.log('🚀 开始验证 LunaTTS 文字显示...');

    let browser;
    try {
        // 启动浏览器
        browser = await chromium.launch({
            headless: false,  // 设置为 false 以便调试
            slowMo: 1000      // 减慢操作速度以便观察
        });

        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        const page = await context.newPage();

        // 1. 导航到页面并等待加载完成
        console.log('📍 正在导航到 http://localhost:3000...');
        const response = await page.goto('http://localhost:3000', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        if (response.status() !== 200) {
            console.log(`❌ 页面加载失败，状态码: ${response.status()}`);
            return false;
        }

        console.log('✅ 页面加载成功');

        // 等待页面完全加载
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000); // 额外等待确保所有组件渲染完成

        // 2. 截取完整页面截图
        console.log('📸 正在截取完整页面截图...');
        await page.screenshot({
            path: 'lunatts_full_page.png',
            fullPage: true
        });
        console.log('✅ 完整页面截图已保存: lunatts_full_page.png');

        // 3. 查找包含 "LunaTTS" 文字的元素
        console.log('🔍 正在查找 LunaTTS 文字元素...');

        // 首先尝试直接查找文本
        let lunattsElements = [];

        // 方法1: 直接文本选择器
        try {
            const textElements = await page.locator('text=LunaTTS').all();
            for (const element of textElements) {
                const text = await element.textContent();
                const isVisible = await element.isVisible();
                lunattsElements.push({
                    element: element,
                    text: text,
                    selector: 'text=LunaTTS',
                    visible: isVisible
                });
                console.log(`✅ 找到 LunaTTS 元素 (文本选择器): '${text}' - 可见: ${isVisible}`);
            }
        } catch (e) {
            console.log('⚠️ 文本选择器未找到元素');
        }

        // 方法2: 如果直接查找失败，尝试更广泛的搜索
        if (lunattsElements.length === 0) {
            console.log('🔍 执行广泛搜索...');

            // 获取页面中所有包含 "LunaTTS" 的元素
            const allElements = await page.evaluate(() => {
                const elements = [];
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_ELEMENT,
                    null,
                    false
                );

                let element;
                while (element = walker.nextNode()) {
                    const text = element.textContent || '';
                    if (text.includes('LunaTTS')) {
                        const computed = window.getComputedStyle(element);
                        elements.push({
                            tagName: element.tagName,
                            text: element.textContent,
                            innerHTML: element.innerHTML,
                            className: element.className,
                            id: element.id,
                            visible: computed.display !== 'none' &&
                                    computed.visibility !== 'hidden' &&
                                    computed.opacity !== '0',
                            styles: {
                                display: computed.display,
                                visibility: computed.visibility,
                                opacity: computed.opacity,
                                fontSize: computed.fontSize,
                                fontFamily: computed.fontFamily,
                                fontWeight: computed.fontWeight,
                                color: computed.color,
                                background: computed.background,
                                backgroundImage: computed.backgroundImage,
                                WebkitTextFillColor: computed.WebkitTextFillColor,
                                textShadow: computed.textShadow,
                                position: computed.position
                            },
                            rect: element.getBoundingClientRect()
                        });
                    }
                }
                return elements;
            });

            console.log(`📝 找到 ${allElements.length} 个包含 'LunaTTS' 的元素`);

            allElements.forEach((el, index) => {
                console.log(`元素 ${index + 1}:`);
                console.log(`  标签: ${el.tagName}`);
                console.log(`  文本: '${el.text}'`);
                console.log(`  类名: ${el.className}`);
                console.log(`  ID: ${el.id}`);
                console.log(`  可见: ${el.visible}`);
                console.log(`  位置: x=${el.rect.x}, y=${el.rect.y}, width=${el.rect.width}, height=${el.rect.height}`);
                console.log(`  样式: ${JSON.stringify(el.styles, null, 2)}`);
                console.log('---');
            });

            lunattsElements = allElements.map((el, index) => ({
                ...el,
                index: index,
                selector: `${el.tagName}${el.className ? '.' + el.className.split(' ').join('.') : ''}${el.id ? '#' + el.id : ''}`
            }));
        }

        if (lunattsElements.length === 0) {
            console.log('❌ 未找到任何包含 "LunaTTS" 的元素');

            // 最后的调试尝试：获取页面中所有文本
            const pageText = await page.evaluate(() => {
                return document.body.innerText;
            });

            console.log('🔍 页面全文内容:');
            console.log(pageText);

            return false;
        }

        // 4. 验证文字是否可见并具有正确的样式
        console.log('🎨 正在验证 LunaTTS 文字的样式和可见性...');

        const verificationResults = [];

        for (let i = 0; i < lunattsElements.length; i++) {
            const elementInfo = lunattsElements[i];

            console.log(`\n📊 元素 ${i + 1} 详细验证:`);
            console.log(`   文本: '${elementInfo.text}'`);
            console.log(`   选择器: ${elementInfo.selector}`);
            console.log(`   可见: ${elementInfo.visible}`);

            if (elementInfo.rect) {
                console.log(`   位置: x=${elementInfo.rect.x}, y=${elementInfo.rect.y}`);
                console.log(`   尺寸: width=${elementInfo.rect.width}, height=${elementInfo.rect.height}`);
            }

            if (elementInfo.styles) {
                console.log(`   字体: ${elementInfo.styles.fontFamily}`);
                console.log(`   字体大小: ${elementInfo.styles.fontSize}`);
                console.log(`   字体粗细: ${elementInfo.styles.fontWeight}`);
                console.log(`   颜色: ${elementInfo.styles.color}`);
                console.log(`   背景: ${elementInfo.styles.background}`);
                console.log(`   背景图片: ${elementInfo.styles.backgroundImage}`);
                console.log(`   文字阴影: ${elementInfo.styles.textShadow}`);

                // 检查渐变效果
                const hasGradient = elementInfo.styles.backgroundImage &&
                                  elementInfo.styles.backgroundImage.includes('gradient');
                const hasWebkitFill = elementInfo.styles.WebkitTextFillColor &&
                                    elementInfo.styles.WebkitTextFillColor !== elementInfo.styles.color;

                console.log(`   渐变效果: ${hasGradient ? '✅ 是' : '❌ 否'}`);
                console.log(`   Webkit文字填充: ${hasWebkitFill ? '✅ 是' : '❌ 否'}`);

                // 检查是否在 header 区域
                const inHeader = elementInfo.rect && elementInfo.rect.y < 200; // 假设在顶部200px内
                console.log(`   在Header区域: ${inHeader ? '✅ 是' : '❌ 否'}`);

                verificationResults.push({
                    index: i,
                    text: elementInfo.text,
                    visible: elementInfo.visible,
                    inHeader: inHeader,
                    hasGradient: hasGradient,
                    hasWebkitFill: hasWebkitFill,
                    styles: elementInfo.styles,
                    rect: elementInfo.rect
                });
            }

            // 如果有实际的 Playwright 元素对象，为它截图
            if (elementInfo.element && typeof elementInfo.element.screenshot === 'function') {
                try {
                    await elementInfo.element.screenshot({ path: `lunatts_element_${i + 1}.png` });
                    console.log(`   ✅ 元素截图已保存: lunatts_element_${i + 1}.png`);
                } catch (e) {
                    console.log(`   ⚠️ 元素截图失败: ${e.message}`);
                }
            }
        }

        // 5. 检查文字的位置是否在 logo 图标旁边
        console.log('🎯 正在检查 LunaTTS 文字与 logo 的位置关系...');

        // 查找可能的 logo 元素
        const logoElements = await page.evaluate(() => {
            const logos = [];
            const selectors = [
                'img[alt*="logo" i]',
                'img[src*="logo" i]',
                '.logo img',
                '[class*="logo"] img',
                '.icon',
                '[class*="icon"]',
                'svg',
                'img'
            ];

            selectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        const rect = element.getBoundingClientRect();
                        const computed = window.getComputedStyle(element);
                        if (rect.width > 0 && rect.height > 0 &&
                            computed.display !== 'none' &&
                            computed.visibility !== 'hidden') {
                            logos.push({
                                selector: selector,
                                tagName: element.tagName,
                                className: element.className,
                                rect: rect,
                                alt: element.alt || '',
                                src: element.src || ''
                            });
                        }
                    });
                } catch (e) {
                    // 忽略选择器错误
                }
            });

            return logos;
        });

        console.log(`📝 找到 ${logoElements.length} 个可能的 logo 元素`);

        const positionAnalysis = [];

        verificationResults.forEach(lunatts => {
            if (lunatts.rect) {
                logoElements.forEach(logo => {
                    const horizontalDistance = Math.abs(lunatts.rect.x - logo.rect.x);
                    const verticalDistance = Math.abs(lunatts.rect.y - logo.rect.y);
                    const sameRow = verticalDistance < 50;
                    const adjacent = horizontalDistance < 200;

                    positionAnalysis.push({
                        lunattsText: lunatts.text,
                        logoSelector: logo.selector,
                        logoAlt: logo.alt,
                        horizontalDistance,
                        verticalDistance,
                        sameRow,
                        adjacent
                    });

                    console.log(`📍 位置分析 - LunaTTS 与 ${logo.tagName} (${logo.selector}):`);
                    console.log(`   水平距离: ${horizontalDistance}px`);
                    console.log(`   垂直距离: ${verticalDistance}px`);
                    console.log(`   同一行: ${sameRow ? '✅ 是' : '❌ 否'}`);
                    console.log(`   相邻位置: ${adjacent ? '✅ 是' : '❌ 否'}`);
                });
            }
        });

        // 6. 生成综合验证报告
        console.log('\n' + '='.repeat(60));
        console.log('📋 LunaTTS 文字显示验证报告');
        console.log('='.repeat(60));

        const totalElements = verificationResults.length;
        const visibleElements = verificationResults.filter(r => r.visible).length;
        const headerElements = verificationResults.filter(r => r.inHeader).length;
        const gradientElements = verificationResults.filter(r => r.hasGradient || r.hasWebkitFill).length;

        console.log(`📊 统计信息:`);
        console.log(`   找到 LunaTTS 元素: ${totalElements} 个`);
        console.log(`   可见元素: ${visibleElements} 个`);
        console.log(`   Header 中元素: ${headerElements} 个`);
        console.log(`   具有渐变效果: ${gradientElements} 个`);

        if (verificationResults.length > 0) {
            console.log(`\n🎯 主要发现:`);
            const mainElement = verificationResults[0];

            console.log(`   主要元素文本: '${mainElement.text}'`);
            console.log(`   可见性: ${mainElement.visible ? '✅ 可见' : '❌ 不可见'}`);
            console.log(`   Header 位置: ${mainElement.inHeader ? '✅ 在 Header 中' : '❌ 不在 Header 中'}`);
            console.log(`   渐变效果: ${(mainElement.hasGradient || mainElement.hasWebkitFill) ? '✅ 有渐变效果' : '⚠️ 无渐变效果'}`);
            console.log(`   字体大小: ${mainElement.styles.fontSize}`);
            console.log(`   字体粗细: ${mainElement.styles.fontWeight}`);
            console.log(`   字体颜色: ${mainElement.styles.color}`);

            if (mainElement.styles.backgroundImage && mainElement.styles.backgroundImage.includes('gradient')) {
                console.log(`   ✅ 背景渐变: ${mainElement.styles.backgroundImage}`);
            }

            if (mainElement.styles.textShadow) {
                console.log(`   ✅ 文字阴影: ${mainElement.styles.textShadow}`);
            }
        }

        if (positionAnalysis.length > 0) {
            console.log(`\n📍 位置关系:`);
            positionAnalysis.forEach(analysis => {
                if (analysis.sameRow && analysis.adjacent) {
                    console.log(`   ✅ '${analysis.lunattsText}' 与 Logo 位置合适 (相邻且同行)`);
                } else if (analysis.sameRow) {
                    console.log(`   ⚠️ '${analysis.lunattsText}' 与 Logo 同行但距离较远`);
                } else {
                    console.log(`   ❌ '${analysis.lunattsText}' 与 Logo 位置不合适`);
                }
            });
        }

        // 最终结论
        console.log(`\n🏆 验证结论:`);

        const successCriteria = [
            { condition: totalElements > 0, description: '找到 LunaTTS 文字' },
            { condition: visibleElements > 0, description: '文字可见' },
            { condition: headerElements > 0, description: '文字在 Header 中' },
            { condition: gradientElements > 0, description: '文字有渐变效果' }
        ];

        let passedCriteria = 0;
        successCriteria.forEach(({ condition, description }) => {
            const status = condition ? '✅' : '❌';
            console.log(`   ${status} ${description}`);
            if (condition) passedCriteria++;
        });

        const overallSuccess = passedCriteria >= 3;
        console.log(`\n🎯 总体结果: ${overallSuccess ? '✅ 验证通过' : '❌ 验证失败'}`);
        console.log(`   通过标准: ${passedCriteria}/${successCriteria.length}`);

        // 创建详细的验证报告文件
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalElements,
                visibleElements,
                headerElements,
                gradientElements,
                overallSuccess
            },
            elements: verificationResults,
            positionAnalysis,
            successCriteria: successCriteria.map(c => ({
                ...c,
                passed: c.condition
            }))
        };

        fs.writeFileSync('lunatts_verification_report.json', JSON.stringify(report, null, 2));
        console.log(`\n📄 详细报告已保存: lunatts_verification_report.json`);

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
verifyLunaTTSDisplay().then(result => {
    console.log(`\n🎉 验证完成! 结果: ${result ? '通过' : '失败'}`);
    process.exit(result ? 0 : 1);
}).catch(error => {
    console.error('❌ 验证脚本执行失败:', error);
    process.exit(1);
});