const { chromium } = require('playwright');

async function finalOverflowTest() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log("🌐 Navigating to http://localhost:8081...");
        await page.goto("http://localhost:8081", { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Get detailed analysis of overflow issues
        console.log("\n📊 DETAILED OVERFLOW ANALYSIS:");
        console.log("=".repeat(60));

        // 1. TEXTAREA ISSUES
        console.log("\n1️⃣ TEXTAREA ISSUES:");
        console.log("-".repeat(30));

        const textareaInfo = await page.evaluate(() => {
            const textarea = document.querySelector('textarea');
            if (!textarea) return null;

            const style = window.getComputedStyle(textarea);
            const rect = textarea.getBoundingClientRect();

            return {
                // Dimensions
                height: textarea.offsetHeight,
                scrollHeight: textarea.scrollHeight,
                clientHeight: textarea.clientHeight,

                // CSS properties
                cssHeight: style.height,
                cssMinHeight: style.minHeight,
                cssMaxHeight: style.maxHeight,
                cssOverflow: style.overflow,
                cssResize: style.resize,

                // Position
                top: rect.top,
                bottom: rect.bottom,
                isClipped: rect.bottom > window.innerHeight
            };
        });

        if (textareaInfo) {
            console.log(`❌ ABNORMAL HEIGHT: ${textareaInfo.height}px (should be much smaller)`);
            console.log(`❌ OVERFLOW HIDDEN: ${textareaInfo.cssOverflow} (content may be clipped)`);
            console.log(`❌ CSS HEIGHT: ${textareaInfo.cssHeight} (explicitly set)`);
            console.log(`❌ MIN-HEIGHT: ${textareaInfo.cssMinHeight} (forcing minimum size)`);
            console.log(`❌ POSITION: top=${textareaInfo.top.toFixed(0)}px, bottom=${textareaInfo.bottom.toFixed(0)}px`);
            console.log(`❌ CLIPPED: ${textareaInfo.isClipped} (extends beyond viewport)`);
        }

        // 2. PAGE LAYOUT ISSUES
        console.log("\n2️⃣ PAGE LAYOUT ISSUES:");
        console.log("-".repeat(30));

        const layoutInfo = await page.evaluate(() => {
            const viewportHeight = window.innerHeight;
            const pageHeight = document.body.scrollHeight;

            // Find the tallest containers
            const containers = [];
            document.querySelectorAll('div').forEach(el => {
                if (el.offsetHeight > 200) {
                    containers.push({
                        className: el.className,
                        height: el.offsetHeight,
                        overflow: window.getComputedStyle(el).overflow,
                        overflowY: window.getComputedStyle(el).overflowY
                    });
                }
            });

            return {
                viewportHeight,
                pageHeight,
                needsPageScroll: pageHeight > viewportHeight,
                tallContainers: containers.sort((a, b) => b.height - a.height).slice(0, 5)
            };
        });

        console.log(`❌ PAGE HEIGHT: ${layoutInfo.pageHeight}px`);
        console.log(`❌ VIEWPORT: ${layoutInfo.viewportHeight}px`);
        console.log(`❌ NEEDS SCROLL: ${layoutInfo.needsPageScroll}`);

        console.log("\n📋 TALLEST CONTAINERS:");
        layoutInfo.tallContainers.forEach((container, i) => {
            console.log(`${i + 1}. Height: ${container.height}px, Overflow: ${container.overflow}/${container.overflowY}`);
            console.log(`   Class: ${container.className.substring(0, 60)}`);
        });

        // 3. VOICE ELEMENTS SEARCH
        console.log("\n3️⃣ VOICE ELEMENTS SEARCH:");
        console.log("-".repeat(30));

        const voiceElements = await page.evaluate(() => {
            const elements = [];

            // Search by common voice-related patterns
            const selectors = [
                '[class*="voice"]',
                '[class*="Voice"]',
                '[class*="speaker"]',
                '[class*="audio"]',
                '[id*="voice"]',
                '[id*="Voice"]'
            ];

            selectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.height > 0) {
                            elements.push({
                                selector,
                                tag: el.tagName,
                                className: el.className,
                                height: rect.height,
                                children: el.children.length
                            });
                        }
                    });
                } catch (e) {
                    // Skip invalid selectors
                }
            });

            // Also search by text content
            document.querySelectorAll('*').forEach(el => {
                const text = el.textContent || '';
                if (text.toLowerCase().includes('voice') ||
                    text.toLowerCase().includes('speaker') ||
                    text.toLowerCase().includes('audio')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.height > 20 && rect.height < 500) { // Reasonable size
                        elements.push({
                            foundBy: 'text',
                            tag: el.tagName,
                            className: el.className,
                            text: text.substring(0, 50),
                            height: rect.height
                        });
                    }
                }
            });

            return elements.slice(0, 10);
        });

        if (voiceElements.length > 0) {
            console.log(`✅ FOUND ${voiceElements.length} VOICE-RELATED ELEMENTS:`);
            voiceElements.forEach((el, i) => {
                console.log(`${i + 1}. ${el.tag} - ${el.foundBy || el.selector}`);
                console.log(`   ${el.text || el.className}`);
                console.log(`   Height: ${el.height}px`);
            });
        } else {
            console.log("❌ NO VOICE ELEMENTS FOUND");
        }

        // 4. SCROLLABLE CONTAINERS ANALYSIS
        console.log("\n4️⃣ SCROLLABLE CONTAINERS ANALYSIS:");
        console.log("-".repeat(30));

        const scrollableContainers = await page.evaluate(() => {
            const containers = [];

            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                const hasScrollableStyle = style.overflow === 'auto' ||
                                         style.overflow === 'scroll' ||
                                         style.overflowY === 'auto' ||
                                         style.overflowY === 'scroll';

                if (hasScrollableStyle && el.offsetHeight > 100) {
                    containers.push({
                        tag: el.tagName,
                        className: el.className.substring(0, 60),
                        height: el.offsetHeight,
                        scrollHeight: el.scrollHeight,
                        clientHeight: el.clientHeight,
                        overflow: style.overflow,
                        overflowY: style.overflowY,
                        needsScroll: el.scrollHeight > el.clientHeight,
                        hasScrollbar: el.offsetWidth > el.clientWidth
                    });
                }
            });

            return containers;
        });

        if (scrollableContainers.length > 0) {
            console.log(`✅ FOUND ${scrollableContainers.length} SCROLLABLE CONTAINERS:`);
            scrollableContainers.forEach((container, i) => {
                console.log(`${i + 1}. ${container.tag}`);
                console.log(`   ${container.className}`);
                console.log(`   Height: ${container.height}px, Scroll: ${container.scrollHeight}px`);
                console.log(`   Overflow: ${container.overflow}/${container.overflowY}`);
                console.log(`   Needs scroll: ${container.needsScroll}, Has scrollbar: ${container.hasScrollbar}`);
            });
        } else {
            console.log("❌ NO SCROLLABLE CONTAINERS FOUND");
        }

        // 5. ELEMENTS OUTSIDE VIEWPORT
        console.log("\n5️⃣ ELEMENTS OUTSIDE VIEWPORT:");
        console.log("-".repeat(30));

        const outsideElements = await page.evaluate(() => {
            const viewportHeight = window.innerHeight;
            const elements = [];

            document.querySelectorAll('*').forEach(el => {
                if (el.offsetHeight > 20) { // Skip tiny elements
                    const rect = el.getBoundingClientRect();
                    if (rect.bottom > viewportHeight) {
                        elements.push({
                            tag: el.tagName,
                            className: el.className.substring(0, 60),
                            overflowAmount: rect.bottom - viewportHeight,
                            elementHeight: rect.height,
                            bottom: rect.bottom
                        });
                    }
                }
            });

            return elements.sort((a, b) => b.overflowAmount - a.overflowAmount).slice(0, 8);
        });

        console.log(`❌ ${outsideElements.length} ELEMENTS EXTEND BEYOND VIEWPORT:`);
        outsideElements.forEach((el, i) => {
            console.log(`${i + 1}. ${el.tag}`);
            console.log(`   ${el.className}`);
            console.log(`   Extends ${el.overflowAmount.toFixed(0)}px beyond viewport`);
            console.log(`   Element height: ${el.elementHeight}px, Bottom: ${el.bottom.toFixed(0)}px`);
        });

        // 6. FINAL SCREENSHOTS
        console.log("\n6️⃣ CAPTURING VISUAL EVIDENCE:");
        console.log("-".repeat(30));

        await page.screenshot({
            path: 'final_viewport.png',
            fullPage: false,
            quality: 90
        });

        await page.screenshot({
            path: 'final_full_page.png',
            fullPage: true,
            quality: 90
        });

        console.log("✅ Viewport screenshot: final_viewport.png");
        console.log("✅ Full page screenshot: final_full_page.png");

        // 7. SUMMARY
        console.log("\n📋 OVERFLOW ISSUES SUMMARY:");
        console.log("=".repeat(60));

        const issues = [];

        // Check textarea issues
        if (textareaInfo) {
            if (textareaInfo.height > 400) {
                issues.push("❌ TEXTAREA: Abnormal height (514px) - should be smaller");
            }
            if (textareaInfo.cssOverflow === 'hidden') {
                issues.push("❌ TEXTAREA: Overflow hidden - content may be clipped");
            }
            if (textareaInfo.isClipped) {
                issues.push("❌ TEXTAREA: Extends beyond viewport");
            }
        }

        // Check page layout issues
        if (layoutInfo.needsPageScroll) {
            issues.push("❌ LAYOUT: Page height exceeds viewport - needs page-level scrolling");
        }

        // Check for VoiceList
        if (voiceElements.length === 0) {
            issues.push("❌ VOICE LIST: No voice-related elements found");
        }

        // Check scrollable containers
        if (scrollableContainers.length === 0) {
            issues.push("❌ SCROLLING: No scrollable containers found - VoiceList might need scrolling");
        }

        // Check elements outside viewport
        if (outsideElements.length > 0) {
            issues.push(`❌ OVERFLOW: ${outsideElements.length} elements extend beyond viewport`);
        }

        if (issues.length > 0) {
            console.log("🚨 CRITICAL ISSUES FOUND:");
            issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));
        } else {
            console.log("✅ No critical overflow issues detected");
        }

        console.log("\n💡 RECOMMENDATIONS:");
        console.log("-".repeat(30));
        console.log("1. Fix textarea height by setting a reasonable max-height");
        console.log("2. Change textarea overflow from 'hidden' to 'auto'");
        console.log("3. Implement proper scrolling for VoiceList container");
        console.log("4. Ensure overall page fits within viewport");
        console.log("5. Test responsive behavior on different screen sizes");

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        await browser.close();
    }
}

finalOverflowTest().catch(console.error);