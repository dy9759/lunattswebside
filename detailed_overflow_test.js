const { chromium } = require('playwright');

async function detailedOverflowTest() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log("🌐 Navigating to http://localhost:8081...");
        await page.goto("http://localhost:8081", { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        console.log("✅ Page loaded successfully");

        // Examine page structure
        console.log("\n🔍 Examining page structure...");

        const pageStructure = await page.evaluate(() => {
            const elements = [];
            document.querySelectorAll('*').forEach(el => {
                if (el.offsetHeight > 0 && el.offsetWidth > 0) {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);

                    if (rect.height > 100 || el.children.length > 2) { // Focus on significant elements
                        elements.push({
                            tag: el.tagName,
                            className: el.className,
                            id: el.id,
                            height: rect.height,
                            width: rect.width,
                            top: rect.top,
                            bottom: rect.bottom,
                            overflow: style.overflow,
                            overflowY: style.overflowY,
                            children: el.children.length,
                            hasScrollbar: el.offsetWidth > el.clientWidth
                        });
                    }
                }
            });

            return elements.sort((a, b) => b.height - a.height).slice(0, 15);
        });

        console.log("📋 Largest elements on page:");
        pageStructure.forEach((el, i) => {
            console.log(`${i + 1}. ${el.tag} (${el.className ? el.className.substring(0, 50) : 'no class'})`);
            console.log(`   Height: ${el.height}px, Children: ${el.children}, Overflow: ${el.overflow}/${el.overflowY}`);
            console.log(`   Position: top=${el.top.toFixed(0)}px, bottom=${el.bottom.toFixed(0)}px`);
            console.log(`   Has scrollbar: ${el.hasScrollbar}`);
        });

        // Focus on textarea details
        console.log("\n🔍 Detailed textarea analysis...");
        const textarea = await page.locator('textarea').first();
        const textareaCount = await page.locator('textarea').count();

        if (textareaCount > 0) {
            const textareaDetails = await textarea.evaluate(el => {
                const style = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                const parent = el.parentElement;
                const parentStyle = parent ? window.getComputedStyle(parent) : null;

                return {
                    height: el.offsetHeight,
                    scrollHeight: el.scrollHeight,
                    clientHeight: el.clientHeight,
                    offsetHeight: el.offsetHeight,
                    style: {
                        height: style.height,
                        minHeight: style.minHeight,
                        maxHeight: style.maxHeight,
                        overflow: style.overflow,
                        overflowY: style.overflowY,
                        resize: style.resize,
                        rows: style.rows,
                        display: style.display,
                        position: style.position
                    },
                    position: {
                        top: rect.top,
                        bottom: rect.bottom,
                        left: rect.left,
                        right: rect.right
                    },
                    parent: {
                        tag: parent?.tagName,
                        className: parent?.className,
                        height: parent?.offsetHeight,
                        overflow: parentStyle?.overflow,
                        overflowY: parentStyle?.overflowY
                    }
                };
            });

            console.log("📝 Textarea details:");
            console.log(`   Height: ${textareaDetails.height}px (scroll: ${textareaDetails.scrollHeight}px)`);
            console.log(`   CSS height: ${textareaDetails.style.height}`);
            console.log(`   Min-height: ${textareaDetails.style.minHeight}`);
            console.log(`   Max-height: ${textareaDetails.style.maxHeight}`);
            console.log(`   Overflow: ${textareaDetails.style.overflow}/${textareaDetails.style.overflowY}`);
            console.log(`   Resize: ${textareaDetails.style.resize}`);
            console.log(`   Display: ${textareaDetails.style.display}`);
            console.log(`   Position: ${textareaDetails.style.position}`);
            console.log(`   Screen position: top=${textareaDetails.position.top.toFixed(0)}px, bottom=${textareaDetails.position.bottom.toFixed(0)}px`);

            if (textareaDetails.parent) {
                console.log(`   Parent: ${textareaDetails.parent.tag} (${textareaDetails.parent.className?.substring(0, 50) || 'no class'})`);
                console.log(`   Parent height: ${textareaDetails.parent.height}px`);
                console.log(`   Parent overflow: ${textareaDetails.parent.overflow}/${textareaDetails.parent.overflowY}`);
            }
        }

        // Look for voice-related elements
        console.log("\n🔍 Searching for voice-related elements...");
        const voiceElements = await page.evaluate(() => {
            const voiceRelated = [];
            document.querySelectorAll('*').forEach(el => {
                const className = (el.className || '').toLowerCase();
                const id = (el.id || '').toLowerCase();
                const textContent = (el.textContent || '').toLowerCase();

                if (className.includes('voice') || id.includes('voice') ||
                    textContent.includes('voice') || textContent.includes('speaker') ||
                    textContent.includes('audio') || textContent.includes('sound')) {

                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);

                    if (rect.height > 0 && rect.width > 0) {
                        voiceRelated.push({
                            tag: el.tagName,
                            className: el.className,
                            id: el.id,
                            textContent: el.textContent?.substring(0, 50),
                            height: rect.height,
                            children: el.children.length,
                            overflow: style.overflow,
                            overflowY: style.overflowY,
                            position: { top: rect.top, bottom: rect.bottom }
                        });
                    }
                }
            });

            return voiceRelated;
        });

        console.log(`🎤 Found ${voiceElements.length} voice-related elements:`);
        voiceElements.forEach((el, i) => {
            console.log(`${i + 1}. ${el.tag} - ${el.className || el.id || 'text: ' + el.textContent}`);
            console.log(`   Height: ${el.height}px, Children: ${el.children}`);
            console.log(`   Position: top=${el.position.top.toFixed(0)}px, bottom=${el.position.bottom.toFixed(0)}px`);
        });

        // Check if there's a container that should have scrolling
        console.log("\n🔍 Looking for scrollable containers...");
        const scrollableContainers = await page.evaluate(() => {
            const containers = [];
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                const hasOverflow = style.overflow === 'auto' || style.overflow === 'scroll' ||
                                  style.overflowY === 'auto' || style.overflowY === 'scroll';

                if (hasOverflow && el.offsetHeight > 100) {
                    const rect = el.getBoundingClientRect();
                    containers.push({
                        tag: el.tagName,
                        className: el.className,
                        id: el.id,
                        height: el.offsetHeight,
                        scrollHeight: el.scrollHeight,
                        clientHeight: el.clientHeight,
                        overflow: style.overflow,
                        overflowY: style.overflowY,
                        hasScrollbar: el.offsetWidth > el.clientWidth,
                        needsScroll: el.scrollHeight > el.clientHeight,
                        position: { top: rect.top, bottom: rect.bottom }
                    });
                }
            });

            return containers.sort((a, b) => b.height - a.height);
        });

        console.log(`📜 Found ${scrollableContainers.length} scrollable containers:`);
        scrollableContainers.forEach((container, i) => {
            console.log(`${i + 1}. ${container.tag} (${container.className?.substring(0, 50) || 'no class'})`);
            console.log(`   Height: ${container.height}px, Scroll: ${container.scrollHeight}px`);
            console.log(`   Overflow: ${container.overflow}/${container.overflowY}`);
            console.log(`   Has scrollbar: ${container.hasScrollbar}, Needs scroll: ${container.needsScroll}`);
        });

        // Check what's outside viewport
        console.log("\n🔍 Analyzing elements outside viewport...");
        const outsideElements = await page.evaluate(() => {
            const viewportHeight = window.innerHeight;
            const elements = [];

            document.querySelectorAll('*').forEach(el => {
                if (el.offsetHeight > 10 && el.offsetWidth > 10) { // Skip tiny elements
                    const rect = el.getBoundingClientRect();
                    if (rect.bottom > viewportHeight) {
                        const style = window.getComputedStyle(el);
                        elements.push({
                            tag: el.tagName,
                            className: el.className,
                            id: el.id,
                            overflowAmount: rect.bottom - viewportHeight,
                            overflow: style.overflow,
                            height: rect.height,
                            bottom: rect.bottom
                        });
                    }
                }
            });

            return elements.sort((a, b) => b.overflowAmount - a.overflowAmount).slice(0, 10);
        });

        console.log(`📏 ${outsideElements.length} elements extend beyond viewport:`);
        outsideElements.forEach((el, i) => {
            console.log(`${i + 1}. ${el.tag} (${el.className?.substring(0, 50) || 'no class'})`);
            console.log(`   Extends ${el.overflowAmount.toFixed(0)}px beyond viewport`);
            console.log(`   Element height: ${el.height}px, Bottom: ${el.bottom.toFixed(0)}px`);
        });

        // Take specific screenshots
        await page.screenshot({ path: 'detailed_viewport.png', fullPage: false });
        await page.screenshot({ path: 'detailed_full_page.png', fullPage: true });

        console.log("\n📸 Screenshots saved as 'detailed_viewport.png' and 'detailed_full_page.png'");

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        await browser.close();
    }
}

detailedOverflowTest().catch(console.error);