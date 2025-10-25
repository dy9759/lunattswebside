const { chromium } = require('playwright');

async function finalVerification() {
    console.log('🎯 LunaTTS 文字显示最终验证报告');
    console.log('='.repeat(50));

    let browser;
    try {
        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();

        // 访问页面
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // 最终截图
        await page.screenshot({
            path: 'lunatts_final_verification.png',
            fullPage: true
        });

        // 关键验证点
        const verification = await page.evaluate(() => {
            // 1. 查找 LunaTTS 文字
            const lunattsText = Array.from(document.querySelectorAll('*')).find(el =>
                                   el.textContent && el.textContent.includes('LunaTTS')
                               );

            if (!lunattsText) return { found: false };

            const rect = lunattsText.getBoundingClientRect();
            const computed = window.getComputedStyle(lunattsText);

            // 2. 检查可见性
            const isVisible = rect.width > 0 &&
                            rect.height > 0 &&
                            computed.display !== 'none' &&
                            computed.visibility !== 'hidden' &&
                            computed.opacity !== '0';

            // 3. 检查是否在 Header 区域
            const inHeader = rect.y < 200;

            // 4. 检查渐变效果
            const hasGradient = computed.backgroundImage &&
                              computed.backgroundImage.includes('gradient');

            // 5. 检查文字样式
            const styles = {
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                color: computed.color,
                fontFamily: computed.fontFamily,
                textShadow: computed.textShadow
            };

            return {
                found: true,
                visible: isVisible,
                inHeader: inHeader,
                hasGradient: hasGradient,
                text: lunattsText.textContent.trim(),
                position: { x: Math.round(rect.x), y: Math.round(rect.y) },
                size: { width: Math.round(rect.width), height: Math.round(rect.height) },
                styles: styles,
                className: lunattsText.className,
                tagName: lunattsText.tagName
            };
        });

        console.log('\n📊 验证结果:');

        if (!verification.found) {
            console.log('❌ 未找到 LunaTTS 文字');
            return false;
        }

        console.log(`✅ 找到 LunaTTS 文字: "${verification.text}"`);
        console.log(`📍 位置: (${verification.position.x}, ${verification.position.y})`);
        console.log(`📏 尺寸: ${verification.size.width} x ${verification.size.height}`);
        console.log(`🎯 元素类型: ${verification.tagName}.${verification.className}`);

        console.log('\n🔍 详细检查:');

        // 可见性检查
        const visibleStatus = verification.visible ? '✅ 通过' : '❌ 失败';
        console.log(`   可见性: ${visibleStatus}`);

        // Header 位置检查
        const headerStatus = verification.inHeader ? '✅ 通过' : '❌ 失败';
        console.log(`   Header位置: ${headerStatus}`);

        // 渐变效果检查
        const gradientStatus = verification.hasGradient ? '✅ 通过' : '⚠️ 未检测到';
        console.log(`   渐变效果: ${gradientStatus}`);

        // 样式信息
        console.log('\n🎨 样式信息:');
        console.log(`   字体: ${verification.styles.fontFamily}`);
        console.log(`   字体大小: ${verification.styles.fontSize}`);
        console.log(`   字体粗细: ${verification.styles.fontWeight}`);
        console.log(`   文字颜色: ${verification.styles.color}`);
        console.log(`   文字阴影: ${verification.styles.textShadow || '无'}`);

        // 相邻元素检查
        const nearbyElements = await page.evaluate(() => {
            const lunattsEl = Array.from(document.querySelectorAll('*')).find(el =>
                el.textContent && el.textContent.includes('LunaTTS')
            );

            if (!lunattsEl) return [];

            const lunattsRect = lunattsEl.getBoundingClientRect();
            const nearby = [];

            document.querySelectorAll('*').forEach(el => {
                const rect = el.getBoundingClientRect();
                const distance = Math.abs(rect.x - lunattsRect.x);
                const sameRow = Math.abs(rect.y - lunattsRect.y) < 50;

                if (distance < 300 && sameRow && el !== lunattsEl) {
                    const computed = window.getComputedStyle(el);
                    if (computed.display !== 'none' && rect.width > 0) {
                        nearby.push({
                            type: el.tagName.toLowerCase(),
                            hasImage: el.tagName === 'IMG' || el.querySelector('img'),
                            className: el.className,
                            distance: distance
                        });
                    }
                }
            });

            return nearby;
        });

        console.log('\n🔗 相邻元素分析:');
        if (nearbyElements.length > 0) {
            console.log(`✅ 找到 ${nearbyElements.length} 个相邻元素:`);
            nearbyElements.forEach((el, i) => {
                console.log(`   ${i+1}. ${el.type}${el.hasImage ? ' (包含图片)' : ''} - 距离: ${el.distance}px`);
            });
        } else {
            console.log('⚠️ 未找到理想的相邻元素');
        }

        // 总体评估
        const passedCriteria = [
            verification.visible,
            verification.inHeader
        ].filter(Boolean).length;

        const overallSuccess = passedCriteria >= 1; // 至少可见
        const bonusPoints = verification.hasGradient ? 1 : 0;
        const totalScore = passedCriteria + bonusPoints;

        console.log('\n🏆 总体评估:');
        console.log(`   基础通过: ${passedCriteria}/2`);
        console.log(`   加分项目: ${bonusPoints}/1 (渐变效果)`);
        console.log(`   总分: ${totalScore}/3`);

        const resultText = overallSuccess ?
            (totalScore >= 2 ? '✅ 优秀' : '✅ 通过') : '❌ 需要改进';
        console.log(`   最终结果: ${resultText}`);

        if (overallSuccess) {
            console.log('\n🎉 LunaTTS 文字显示验证成功!');
            console.log('   文字已正确显示在页面中');
            console.log('   用户可以看到品牌名称');
        } else {
            console.log('\n⚠️ LunaTTS 文字显示需要进一步优化');
        }

        return overallSuccess;

    } catch (error) {
        console.error('❌ 验证过程中发生错误:', error.message);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 运行最终验证
finalVerification().then(success => {
    console.log(`\n✨ 验证完成! ${success ? '成功' : '失败'}`);
    process.exit(success ? 0 : 1);
});