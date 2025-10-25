const { chromium } = require('playwright');

async function checkOverflowIssues() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log("🌐 Navigating to http://localhost:8081...");
        await page.goto("http://localhost:8081", { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000); // Wait for any animations

        console.log("✅ Page loaded successfully");

        // Get viewport and page dimensions
        const viewportHeight = page.viewportSize().height;
        const pageHeight = await page.evaluate(() => document.body.scrollHeight);
        console.log(`📏 Viewport height: ${viewportHeight}px`);
        console.log(`📏 Page height: ${pageHeight}px`);
        console.log(`📏 Page needs scrolling: ${pageHeight > viewportHeight}`);

        // 1. Check TextInputCard textarea
        console.log("\n🔍 Checking TextInputCard textarea...");

        const textarea = await page.locator('textarea').first();
        const textareaCount = await page.locator('textarea').count();

        if (textareaCount > 0) {
            const textareaHeight = await textarea.evaluate(el => el.offsetHeight);
            const textareaScrollHeight = await textarea.evaluate(el => el.scrollHeight);
            const textareaOverflow = await textarea.evaluate(el => window.getComputedStyle(el).overflow);
            const textareaMaxHeight = await textarea.evaluate(el => window.getComputedStyle(el).maxHeight);
            const textareaDisplay = await textarea.evaluate(el => window.getComputedStyle(el).display);

            console.log(`📝 Textarea height: ${textareaHeight}px`);
            console.log(`📝 Textarea scroll height: ${textareaScrollHeight}px`);
            console.log(`📝 Textarea overflow: ${textareaOverflow}`);
            console.log(`📝 Textarea max-height: ${textareaMaxHeight}`);
            console.log(`📝 Textarea display: ${textareaDisplay}`);

            // Check if textarea is clipped
            const isClipped = await textarea.evaluate(el => {
                const rect = el.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                return rect.bottom > viewportHeight || rect.top < 0;
            });
            console.log(`📝 Textarea clipped: ${isClipped}`);

            // Check for abnormal height
            if (textareaHeight > 400) {
                console.log(`⚠️ WARNING: Textarea height (${textareaHeight}px) seems abnormally large!`);
            } else {
                console.log(`✅ Textarea height looks reasonable`);
            }

            // Check if content is fully visible
            const contentFullyVisible = textareaHeight >= textareaScrollHeight || textareaOverflow !== 'hidden';
            console.log(`📝 Content fully visible: ${contentFullyVisible}`);
        } else {
            console.log("❌ No textarea found");
        }

        // 2. Check VoiceList
        console.log("\n🔍 Checking VoiceList...");

        // Try multiple selectors to find VoiceList
        const voiceListSelectors = [
            '[class*="voice"][class*="list"]',
            '[class*="VoiceList"]',
            '[data-testid*="voice"]',
            '.voice-container',
            '#voice-list',
            '[class*="voice"]'
        ];

        let voiceList = null;
        let foundSelector = null;

        for (const selector of voiceListSelectors) {
            try {
                const element = await page.locator(selector).first();
                const count = await page.locator(selector).count();
                if (count > 0) {
                    voiceList = element;
                    foundSelector = selector;
                    console.log(`📋 Found VoiceList with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }

        // If no specific selector found, look for containers with multiple children
        if (!voiceList) {
            console.log("📋 Searching for containers with multiple elements...");
            const containers = await page.locator('div').all();
            for (let i = 0; i < Math.min(containers.length, 50); i++) {
                const container = containers[i];
                const className = await container.evaluate(el => el.className || '');
                const childCount = await container.locator('*').count();

                if ((className.toLowerCase().includes('voice') || className.toLowerCase().includes('list')) && childCount > 2) {
                    voiceList = container;
                    foundSelector = `div.${className}`;
                    console.log(`📋 Found potential VoiceList: ${foundSelector}`);
                    break;
                }
            }
        }

        if (voiceList) {
            const voiceListHeight = await voiceList.evaluate(el => el.offsetHeight);
            const voiceListScrollHeight = await voiceList.evaluate(el => el.scrollHeight);
            const voiceListOverflowY = await voiceList.evaluate(el => window.getComputedStyle(el).overflowY);
            const voiceListOverflow = await voiceList.evaluate(el => window.getComputedStyle(el).overflow);

            console.log(`📋 VoiceList height: ${voiceListHeight}px`);
            console.log(`📋 VoiceList scroll height: ${voiceListScrollHeight}px`);
            console.log(`📋 VoiceList overflow-y: ${voiceListOverflowY}`);
            console.log(`📋 VoiceList overflow: ${voiceListOverflow}`);

            // Check if it needs scrolling
            const needsScroll = voiceListScrollHeight > voiceListHeight;
            console.log(`📋 VoiceList needs scrolling: ${needsScroll}`);

            // Count child elements
            const childElements = await voiceList.locator('*').count();
            console.log(`📋 Child elements in VoiceList: ${childElements}`);

            // Check for scrollbar
            const scrollbarWidth = await voiceList.evaluate(el => el.offsetWidth - el.clientWidth);
            const hasVisibleScrollbar = scrollbarWidth > 0;
            console.log(`📋 Has visible scrollbar: ${hasVisibleScrollbar} (width: ${scrollbarWidth}px)`);

            // Test scrolling functionality
            if (needsScroll) {
                console.log("📋 Testing scroll functionality...");
                await voiceList.evaluate(el => el.scrollTop = 0);
                await page.waitForTimeout(500);
                const scrollTopBefore = await voiceList.evaluate(el => el.scrollTop);

                await voiceList.evaluate(el => el.scrollTop = 100);
                await page.waitForTimeout(500);
                const scrollTopAfter = await voiceList.evaluate(el => el.scrollTop);

                const scrollWorks = scrollTopAfter > scrollTopBefore;
                console.log(`📋 Scroll functionality: ${scrollWorks ? '✅ Working' : '❌ Not working'}`);

                // Scroll back to top
                await voiceList.evaluate(el => el.scrollTop = 0);
            }
        } else {
            console.log("❌ No VoiceList container found");
        }

        // 3. Check overall page overflow
        console.log("\n🔍 Checking overall page overflow...");

        const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
        const htmlOverflow = await page.evaluate(() => window.getComputedStyle(document.documentElement).overflow);

        console.log(`🌐 Body overflow: ${bodyOverflow}`);
        console.log(`🌐 HTML overflow: ${htmlOverflow}`);

        // Check for elements outside viewport
        const outOfViewportCount = await page.evaluate(() => {
            const allElements = document.querySelectorAll('*');
            const viewportHeight = window.innerHeight;
            let count = 0;

            allElements.forEach(el => {
                if (el.offsetHeight > 0 && el.offsetWidth > 0) {
                    const rect = el.getBoundingClientRect();
                    if (rect.bottom > viewportHeight || rect.top < 0) {
                        count++;
                    }
                }
            });

            return count;
        });

        console.log(`🌐 Elements outside viewport: ${outOfViewportCount}`);

        // 4. Take screenshots
        console.log("\n📸 Taking screenshots...");

        await page.screenshot({ path: 'full_page.png', fullPage: true });
        console.log("📸 Full page screenshot saved as 'full_page.png'");

        await page.screenshot({ path: 'viewport.png', fullPage: false });
        console.log("📸 Viewport screenshot saved as 'viewport.png'");

        // Summary
        console.log("\n📊 SUMMARY:");
        console.log("=".repeat(50));

        const issues = [];

        // Check for specific issues
        if (textareaCount > 0) {
            const textareaHeight = await textarea.evaluate(el => el.offsetHeight);
            const textareaOverflow = await textarea.evaluate(el => window.getComputedStyle(el).overflow);

            if (textareaHeight > 400) {
                issues.push(`⚠️ Textarea has abnormal height: ${textareaHeight}px`);
            }
            if (textareaOverflow === 'hidden') {
                issues.push("⚠️ Textarea has overflow: hidden - content might be clipped");
            }
        }

        if (voiceList) {
            const voiceListHeight = await voiceList.evaluate(el => el.offsetHeight);
            const voiceListScrollHeight = await voiceList.evaluate(el => el.scrollHeight);
            const voiceListOverflowY = await voiceList.evaluate(el => window.getComputedStyle(el).overflowY);

            if (voiceListScrollHeight > voiceListHeight && voiceListOverflowY === 'visible') {
                issues.push("⚠️ VoiceList needs scrolling but overflow-y is 'visible'");
            }
        }

        if (pageHeight > viewportHeight) {
            issues.push(`⚠️ Page height (${pageHeight}px) exceeds viewport (${viewportHeight}px)`);
        }

        if (outOfViewportCount > 0) {
            issues.push(`⚠️ ${outOfViewportCount} elements are outside viewport`);
        }

        if (issues.length > 0) {
            console.log("❌ ISSUES FOUND:");
            issues.forEach(issue => console.log(`   ${issue}`));
        } else {
            console.log("✅ No overflow issues detected");
        }

    } catch (error) {
        console.error(`❌ Error during testing: ${error.message}`);
    } finally {
        await browser.close();
    }
}

// Run the test
checkOverflowIssues().catch(console.error);