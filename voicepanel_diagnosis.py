#!/usr/bin/env python3
"""
VoicePanel 头像显示问题诊断脚本
使用 Playwright 进行详细的技术分析
"""

import asyncio
from playwright.async_api import async_playwright
import json
import base64
from datetime import datetime
import sys

async def diagnose_voicepanel():
    """对 VoicePanel 进行详细的技术诊断"""

    async with async_playwright() as p:
        # 启动浏览器（显示模式以便观察）
        browser = await p.chromium.launch(headless=False, slow_mo=1000)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            device_scale_factor=1
        )
        page = await context.new_page()

        try:
            print("🚀 开始 VoicePanel 技术诊断...")
            print(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

            # 1. 导航到页面
            print("\n📍 步骤1: 导航到 http://localhost:3000")
            await page.goto("http://localhost:3000", wait_until="networkidle")
            await page.wait_for_timeout(3000)  # 等待页面完全加载

            # 检查页面标题
            page_title = await page.title()
            print(f"📄 页面标题: {page_title}")

            # 2. 查找 VoicePanel 相关元素
            print("\n🔍 步骤2: 查找 VoicePanel 相关元素")

            # 尝试多种选择器找到语音面板
            voice_panel_selectors = [
                '[data-testid="voice-panel"]',
                '.voice-panel',
                '[class*="VoicePanel"]',
                '[class*="voice"][class*="panel"]',
                '.grid.grid-cols-1',  # Tailwind CSS 网格
                '.grid.grid-cols-2',
                '.grid.grid-cols-3',
                '.grid.grid-cols-4',
                '[class*="voice"]',
                '[class*="card"]'
            ]

            voice_panel = None
            used_selector = None

            for selector in voice_panel_selectors:
                try:
                    elements = await page.query_selector_all(selector)
                    if elements:
                        voice_panel = elements[0]  # 使用第一个匹配的元素
                        used_selector = selector
                        print(f"✅ 找到容器元素: {selector} (共 {len(elements)} 个)")
                        break
                except Exception as e:
                    continue

            if not voice_panel:
                print("❌ 未找到明确的 VoicePanel 容器")
                print("🔍 尝试查找页面上的所有卡片元素...")

                # 查找所有可能的卡片
                card_elements = await page.query_selector_all('[class*="card"], [class*="Card"], [class*="item"]')
                if card_elements:
                    voice_panel = card_elements[0]
                    used_selector = '[class*="card"]'
                    print(f"✅ 使用第一个卡片元素作为参考: {len(card_elements)} 个卡片")
                else:
                    print("❌ 无法找到任何相关元素，尝试查找图片...")
                    img_elements = await page.query_selector_all('img')
                    print(f"📊 页面上共有 {len(img_elements)} 个图片")

                    if img_elements:
                        # 使用第一个图片的父容器
                        first_img = img_elements[0]
                        parent = await page.evaluate('el => el.parentElement', first_img)
                        if parent:
                            voice_panel = parent
                            used_selector = 'img-parent'
                            print("✅ 使用第一个图片的父容器")

            if not voice_panel:
                print("❌ 完全无法找到相关元素，退出诊断")
                return None

            # 3. 截取截图
            print("\n📸 步骤3: 截取页面截图")

            # 整页截图
            await page.screenshot(path='voicepanel_full_page.png', full_page=False)
            print("📸 已保存完整页面截图: voicepanel_full_page.png")

            # VoicePanel 区域截图
            panel_bbox = await voice_panel.bounding_box()
            if panel_bbox:
                await page.screenshot(
                    path='voicepanel_panel.png',
                    clip=panel_bbox
                )
                print(f"📸 已保存 VoicePanel 截图: voicepanel_panel.png")
                print(f"📏 VoicePanel 尺寸: {panel_bbox['width']:.1f} x {panel_bbox['height']:.1f}")

            # 4. 查找所有语音卡片
            print("\n🔍 步骤4: 查找和分析语音卡片")

            card_selectors = [
                '[data-testid="voice-card"]',
                '.voice-card',
                '[class*="VoiceCard"]',
                '[class*="voice"][class*="card"]',
                '[class*="card"]',
                '[class*="item"]'
            ]

            all_cards = []
            for selector in card_selectors:
                try:
                    cards = await page.query_selector_all(selector)
                    if cards:
                        all_cards.extend(cards)
                        print(f"📊 选择器 '{selector}' 找到 {len(cards)} 个元素")
                except:
                    continue

            # 去重
            unique_cards = []
            seen_ids = set()
            for card in all_cards:
                card_id = await page.evaluate('el => el.outerHTML.substring(0, 100)', card)
                if card_id not in seen_ids:
                    unique_cards.append(card)
                    seen_ids.add(card_id)

            print(f"📊 总计找到 {len(unique_cards)} 个唯一卡片元素")

            # 如果没找到卡片，查找包含 Marcus 的元素
            if not unique_cards:
                print("🔍 查找包含 Marcus 的元素...")
                marcus_elements = await page.query_selector_all('*:has-text("Marcus"), *:has(img[alt*="Marcus"])')
                if marcus_elements:
                    print(f"📊 找到 {len(marcus_elements)} 个包含 Marcus 的元素")
                    unique_cards = marcus_elements[:3]  # 取前3个

            # 5. 详细分析每个卡片
            print("\n🔬 步骤5: 详细分析每个卡片")

            analysis_results = []

            for i, card in enumerate(unique_cards[:5]):  # 最多分析5个卡片
                print(f"\n--- 分析卡片 {i+1} ---")

                try:
                    card_info = await analyze_card_detailed(page, card, i)
                    if card_info:
                        analysis_results.append(card_info)

                        # 对第一个卡片（Marcus）进行额外分析
                        if i == 0:
                            print("🎯 对 Marcus 卡片进行深度分析...")
                            await perform_deep_analysis(page, card, i)
                except Exception as e:
                    print(f"❌ 分析卡片 {i+1} 时出错: {e}")
                    continue

            # 6. 生成综合诊断报告
            print("\n📋 步骤6: 生成诊断报告")

            report = generate_comprehensive_report(analysis_results)

            # 保存详细数据
            diagnostic_data = {
                'timestamp': datetime.now().isoformat(),
                'page_info': {
                    'title': page_title,
                    'url': page.url
                },
                'panel_info': {
                    'selector_used': used_selector,
                    'bounding_box': panel_bbox if panel_bbox else None
                },
                'analysis_results': analysis_results,
                'summary': report
            }

            with open('voicepanel_diagnostic_report.json', 'w', encoding='utf-8') as f:
                json.dump(diagnostic_data, f, indent=2, ensure_ascii=False)

            print("💾 详细数据已保存到: voicepanel_diagnostic_report.json")

            # 打印报告摘要
            print_report_summary(report)

            return diagnostic_data

        except Exception as e:
            print(f"❌ 诊断过程中发生错误: {str(e)}")
            import traceback
            traceback.print_exc()
            return None

        finally:
            print("\n🏁 诊断完成，将在5秒后关闭浏览器...")
            await page.wait_for_timeout(5000)
            await browser.close()

async def analyze_card_detailed(page, card, index):
    """详细分析单个卡片"""

    try:
        # 获取边界框
        bbox = await card.bounding_box()
        if not bbox:
            print(f"  ⚠️ 无法获取卡片 {index+1} 的边界信息")
            return None

        # 获取计算样式
        computed_styles = await page.evaluate('''
            el => {
                const style = getComputedStyle(el);
                return {
                    width: style.width,
                    height: style.height,
                    maxWidth: style.maxWidth,
                    maxHeight: style.maxHeight,
                    minWidth: style.minWidth,
                    minHeight: style.minHeight,
                    display: style.display,
                    position: style.position,
                    overflow: style.overflow,
                    overflowX: style.overflowX,
                    overflowY: style.overflowY,
                    textOverflow: style.textOverflow,
                    whiteSpace: style.whiteSpace,
                    flexDirection: style.flexDirection,
                    justifyContent: style.justifyContent,
                    alignItems: style.alignItems,
                    padding: style.padding,
                    margin: style.margin,
                    border: style.border,
                    borderRadius: style.borderRadius,
                    backgroundColor: style.backgroundColor,
                    zIndex: style.zIndex
                };
            }
        ''', card)

        # 获取文本内容
        text_content = await card.text_content()
        text_preview = text_content.strip()[:100] + "..." if text_content and len(text_content) > 100 else (text_content.strip() if text_content else "")

        # 查找头像元素
        avatar_info = await find_and_analyze_avatar(page, card)

        # 检查子元素裁剪情况
        clipping_analysis = await analyze_element_clipping(page, card)

        # 获取子元素信息
        children_info = await get_children_info(page, card)

        # 组装卡片信息
        card_info = {
            'index': index,
            'bounding_box': bbox,
            'computed_styles': computed_styles,
            'text_preview': text_preview,
            'avatar_info': avatar_info,
            'clipping_analysis': clipping_analysis,
            'children_info': children_info,
            'has_clipping': len(clipping_analysis['clipped_elements']) > 0,
            'has_avatar': avatar_info is not None
        }

        # 打印简要信息
        print(f"  📏 尺寸: {bbox['width']:.1f} x {bbox['height']:.1f} px")
        print(f"  🎨 显示: {computed_styles['display']}")
        print(f"  🌊 溢出: {computed_styles['overflow']}/{computed_styles['overflowX']}/{computed_styles['overflowY']}")
        print(f"  📱 头像: {'✅ 找到' if avatar_info else '❌ 未找到'}")
        print(f"  ✂️ 裁剪: {'⚠️ 是' if card_info['has_clipping'] else '✅ 否'} ({len(clipping_analysis['clipped_elements'])} 个元素)")
        print(f"  👥 子元素: {len(children_info)} 个")

        if avatar_info:
            print(f"    🖼️ 头像尺寸: {avatar_info['display_width']:.1f} x {avatar_info['display_height']:.1f} px")
            print(f"    🖼️ 原图尺寸: {avatar_info['natural_width']} x {avatar_info['natural_height']} px")

        if card_info['has_clipping']:
            for clipped in clipping_analysis['clipped_elements']:
                overlaps = clipped['overlap']
                overlap_desc = []
                if overlaps['right'] > 0: overlap_desc.append(f"右{overlaps['right']:.1f}px")
                if overlaps['left'] > 0: overlap_desc.append(f"左{overlaps['left']:.1f}px")
                if overlaps['bottom'] > 0: overlap_desc.append(f"下{overlaps['bottom']:.1f}px")
                if overlaps['top'] > 0: overlap_desc.append(f"上{overlaps['top']:.1f}px")

                print(f"    ⚠️ {clipped['tag_name']} 被裁剪: {', '.join(overlap_desc)}")

        return card_info

    except Exception as e:
        print(f"  ❌ 分析卡片时出错: {e}")
        return None

async def find_and_analyze_avatar(page, card):
    """查找并分析头像元素"""

    avatar_selectors = [
        'img[alt*="Marcus"]',
        'img[alt*="avatar"]',
        'img[alt*="profile"]',
        'img[src*="avatar"]',
        'img[src*="profile"]',
        'img[src*="marcus"]',
        '.avatar',
        '[class*="avatar"]',
        'img'  # 最后尝试任何图片
    ]

    for selector in avatar_selectors:
        try:
            avatar = await card.query_selector(selector)
            if avatar:
                return await analyze_avatar_element(page, avatar)
        except:
            continue

    return None

async def analyze_avatar_element(page, avatar):
    """分析头像元素"""

    try:
        # 获取边界框
        bbox = await avatar.bounding_box()
        if not bbox:
            return None

        # 获取计算样式
        styles = await page.evaluate('''
            el => {
                const style = getComputedStyle(el);
                return {
                    width: style.width,
                    height: style.height,
                    maxWidth: style.maxWidth,
                    maxHeight: style.maxHeight,
                    minWidth: style.minWidth,
                    minHeight: style.minHeight,
                    objectFit: style.objectFit,
                    borderRadius: style.borderRadius,
                    display: style.display,
                    position: style.position,
                    float: style.float,
                    verticalAlign: style.verticalAlign,
                    transform: style.transform,
                    opacity: style.opacity,
                    visibility: style.visibility
                };
            }
        ''', avatar)

        # 获取图片属性
        img_attrs = await page.evaluate('''
            el => ({
                src: el.src,
                currentSrc: el.currentSrc,
                alt: el.alt,
                title: el.title,
                naturalWidth: el.naturalWidth,
                naturalHeight: el.naturalHeight,
                width: el.width,
                height: el.height,
                loading: el.loading,
                decoding: el.decoding,
                complete: el.complete,
                loadingState: el.complete ? 'loaded' : 'loading'
            })
        ''', avatar)

        # 计算缩放比例
        scale_x = bbox['width'] / img_attrs['naturalWidth'] if img_attrs['naturalWidth'] > 0 else 1
        scale_y = bbox['height'] / img_attrs['naturalHeight'] if img_attrs['naturalHeight'] > 0 else 1

        avatar_info = {
            'selector_used': 'img',
            'bounding_box': bbox,
            'display_width': bbox['width'],
            'display_height': bbox['height'],
            'computed_styles': styles,
            'attributes': img_attrs,
            'scale_x': scale_x,
            'scale_y': scale_y,
            'aspect_ratio_preserved': abs(scale_x - scale_y) < 0.1,
            'is_scaled': scale_x != 1 or scale_y != 1
        }

        return avatar_info

    except Exception as e:
        print(f"    ❌ 分析头像元素时出错: {e}")
        return None

async def analyze_element_clipping(page, element):
    """分析元素的子元素裁剪情况"""

    try:
        clipping_info = await page.evaluate('''
            el => {
                const parentRect = el.getBoundingClientRect();
                const computedStyle = getComputedStyle(el);
                const children = Array.from(el.children);

                const clippedElements = [];
                const totalChildren = children.length;

                children.forEach((child, index) => {
                    const childRect = child.getBoundingClientRect();
                    const childStyle = getComputedStyle(child);

                    // 检查是否超出父容器边界（允许1px的误差）
                    const overlaps = {
                        right: Math.max(0, childRect.right - parentRect.right - 1),
                        left: Math.max(0, parentRect.left - childRect.left - 1),
                        bottom: Math.max(0, childRect.bottom - parentRect.bottom - 1),
                        top: Math.max(0, parentRect.top - childRect.top - 1)
                    };

                    const totalOverlap = overlaps.right + overlaps.left + overlaps.bottom + overlaps.top;
                    const isClipped = totalOverlap > 0;

                    if (isClipped) {
                        clippedElements.push({
                            index: index,
                            tag_name: child.tagName,
                            class_name: child.className,
                            id: child.id,
                            text_content: child.textContent ? child.textContent.substring(0, 50) : '',
                            rect: {
                                x: childRect.x - parentRect.x,
                                y: childRect.y - parentRect.y,
                                width: childRect.width,
                                height: childRect.height
                            },
                            style: {
                                position: childStyle.position,
                                display: childStyle.display,
                                overflow: childStyle.overflow,
                                zIndex: childStyle.zIndex,
                                transform: childStyle.transform
                            },
                            overlap: overlaps,
                            total_overlap: totalOverlap
                        });
                    }
                });

                return {
                    parent_rect: parentRect,
                    parent_style: {
                        overflow: computedStyle.overflow,
                        overflowX: computedStyle.overflowX,
                        overflowY: computedStyle.overflowY,
                        position: computedStyle.position,
                        display: computedStyle.display
                    },
                    total_children: totalChildren,
                    clipped_children: clippedElements.length,
                    clipped_elements: clippedElements
                };
            }
        ''', element)

        return clipping_info

    except Exception as e:
        print(f"    ❌ 分析裁剪情况时出错: {e}")
        return {
            'parent_rect': None,
            'parent_style': {},
            'total_children': 0,
            'clipped_children': 0,
            'clipped_elements': []
        }

async def get_children_info(page, element):
    """获取元素的子元素信息"""

    try:
        children_info = await page.evaluate('''
            el => {
                const children = Array.from(el.children);
                return children.map((child, index) => ({
                    index: index,
                    tag_name: child.tagName,
                    class_name: child.className,
                    id: child.id,
                    is_image: child.tagName === 'IMG',
                    has_text: child.textContent && child.textContent.trim().length > 0
                }));
            }
        ''', element)

        return children_info

    except Exception as e:
        print(f"    ❌ 获取子元素信息时出错: {e}")
        return []

async def perform_deep_analysis(page, card, index):
    """对 Marcus 卡片进行深度分析"""

    print("    🔬 深度分析 Marcus 卡片...")

    try:
        # 分析所有子元素的具体位置
        children_positions = await page.evaluate('''
            el => {
                const parentRect = el.getBoundingClientRect();
                const children = Array.from(el.children);

                return children.map((child, index) => {
                    const childRect = child.getBoundingClientRect();
                    const style = getComputedStyle(child);

                    return {
                        index: index,
                        tag_name: child.tagName,
                        class_name: child.className,
                        position_relative: {
                            x: childRect.x - parentRect.x,
                            y: childRect.y - parentRect.y,
                            width: childRect.width,
                            height: childRect.height
                        },
                        style: {
                            position: style.position,
                            display: style.display,
                            width: style.width,
                            height: style.height,
                            maxWidth: style.maxWidth,
                            maxHeight: style.maxHeight,
                            margin: style.margin,
                            padding: style.padding,
                            float: style.float,
                            clear: style.clear
                        },
                        is_out_of_bounds: (
                            childRect.right > parentRect.right + 1 ||
                            childRect.left < parentRect.left - 1 ||
                            childRect.bottom > parentRect.bottom + 1 ||
                            childRect.top < parentRect.top - 1
                        )
                    };
                });
            }
        ''', card)

        print(f"    📊 子元素位置分析:")
        for child in children_positions:
            pos = child['position_relative']
            print(f"      {child['tag_name']} {child['index']+1}: ({pos['x']:.1f}, {pos['y']:.1f}) {pos['width']:.1f}x{pos['height']:.1f}")
            if child['is_out_of_bounds']:
                print(f"        ⚠️ 超出边界!")

        # 特别分析头像的约束条件
        avatar_img = await card.query_selector('img')
        if avatar_img:
            avatar_constraints = await page.evaluate('''
                img => {
                    const constraints = [];
                    let current = img.parentElement;

                    while (current && current !== document.body) {
                        const style = getComputedStyle(current);
                        const rect = current.getBoundingClientRect();

                        if (style.overflow !== 'visible') {
                            constraints.push({
                                element: current.tagName + (current.className ? '.' + current.className.split(' ').join('.') : ''),
                                overflow: style.overflow,
                                width: style.width,
                                height: style.height,
                                maxWidth: style.maxWidth,
                                maxHeight: style.maxHeight,
                                rect: rect
                            });
                        }

                        current = current.parentElement;
                    }

                    return constraints;
                }
            ''', avatar_img)

            print(f"    🔒 头像约束条件:")
            for i, constraint in enumerate(avatar_constraints):
                print(f"      {i+1}. {constraint['element']}")
                print(f"         overflow: {constraint['overflow']}")
                print(f"         尺寸: {constraint['width']} x {constraint['height']}")
                if constraint['maxWidth'] != 'none':
                    print(f"         maxWidth: {constraint['maxWidth']}")
                if constraint['maxHeight'] != 'none':
                    print(f"         maxHeight: {constraint['maxHeight']}")

    except Exception as e:
        print(f"    ❌ 深度分析时出错: {e}")

def generate_comprehensive_report(analysis_results):
    """生成综合诊断报告"""

    if not analysis_results:
        return {
            'status': 'failed',
            'message': '无法完成诊断 - 未找到可分析的元素',
            'recommendations': ['检查页面是否正确加载', '确认选择器是否正确', '验证元素是否存在']
        }

    # 统计信息
    total_cards = len(analysis_results)
    cards_with_clipping = sum(1 for card in analysis_results if card['has_clipping'])
    cards_with_avatar = sum(1 for card in analysis_results if card['has_avatar'])
    total_clipped_elements = sum(len(card['clipping_analysis']['clipped_elements']) for card in analysis_results)

    # 分析问题类型
    clipping_types = {
        'horizontal': 0,
        'vertical': 0,
        'both': 0
    }

    avatar_issues = {
        'scaled_incorrectly': 0,
        'overflow_parent': 0,
        'constrained': 0
    }

    for card in analysis_results:
        # 分析裁剪类型
        for clipped in card['clipping_analysis']['clipped_elements']:
            overlaps = clipped['overlap']
            horizontal = overlaps['left'] > 0 or overlaps['right'] > 0
            vertical = overlaps['top'] > 0 or overlaps['bottom'] > 0

            if horizontal and vertical:
                clipping_types['both'] += 1
            elif horizontal:
                clipping_types['horizontal'] += 1
            else:
                clipping_types['vertical'] += 1

        # 分析头像问题
        if card['avatar_info']:
            avatar = card['avatar_info']
            if not avatar['aspect_ratio_preserved']:
                avatar_issues['scaled_incorrectly'] += 1
            if card['has_clipping']:
                # 检查头像是否在被裁剪的元素中
                for clipped in card['clipping_analysis']['clipped_elements']:
                    if clipped['tag_name'] == 'IMG':
                        avatar_issues['overflow_parent'] += 1
                        break

            # 检查头像是否被约束
            styles = avatar['computed_styles']
            if (styles['maxWidth'] != 'none' or styles['maxHeight'] != 'none' or
                styles['minWidth'] != 'auto' or styles['minHeight'] != 'auto'):
                avatar_issues['constrained'] += 1

    # 生成报告
    report = {
        'status': 'completed',
        'statistics': {
            'total_cards': total_cards,
            'cards_with_clipping': cards_with_clipping,
            'cards_with_avatar': cards_with_avatar,
            'total_clipped_elements': total_clipped_elements
        },
        'issues_identified': {
            'clipping_issues': cards_with_clipping > 0,
            'avatar_issues': avatar_issues['scaled_incorrectly'] > 0 or avatar_issues['overflow_parent'] > 0,
            'clipping_types': clipping_types,
            'avatar_issues_detail': avatar_issues
        },
        'recommendations': generate_recommendations(clipping_types, avatar_issues, analysis_results),
        'detailed_analysis': analysis_results
    }

    return report

def generate_recommendations(clipping_types, avatar_issues, analysis_results):
    """生成修复建议"""

    recommendations = []

    # 裁剪问题建议
    if clipping_types['horizontal'] > 0 or clipping_types['vertical'] > 0:
        recommendations.append({
            'priority': 'high',
            'category': 'clipping',
            'issue': f'发现 {clipping_types["horizontal"] + clipping_types["vertical"] + clipping_types["both"]} 个裁剪问题',
            'solutions': [
                '检查容器的 overflow 设置，考虑使用 overflow: visible',
                '调整容器的 width 和 height 属性',
                '检查子元素的定位属性 (position, float)',
                '确保容器有足够的空间容纳所有子元素'
            ]
        })

    # 头像问题建议
    if avatar_issues['scaled_incorrectly'] > 0:
        recommendations.append({
            'priority': 'high',
            'category': 'avatar_scaling',
            'issue': f'{avatar_issues["scaled_incorrectly"]} 个头像缩放比例不正确',
            'solutions': [
                '设置 width 和 height 属性保持相同的比例',
                '使用 object-fit: cover 或 object-fit: contain',
                '检查 max-width 和 max-height 约束',
                '考虑使用 aspect-ratio CSS 属性'
            ]
        })

    if avatar_issues['overflow_parent'] > 0:
        recommendations.append({
            'priority': 'high',
            'category': 'avatar_overflow',
            'issue': f'{avatar_issues["overflow_parent"]} 个头像超出父容器',
            'solutions': [
                '增加父容器的尺寸',
                '调整头像的 max-width 和 max-height',
                '修改父容器的 overflow 设置',
                '使用 flex 或 grid 布局更好地控制尺寸'
            ]
        })

    if avatar_issues['constrained'] > 0:
        recommendations.append({
            'priority': 'medium',
            'category': 'avatar_constraints',
            'issue': f'{avatar_issues["constrained"]} 个头像受到尺寸约束',
            'solutions': [
                '检查并调整 max-width/max-height 设置',
                '考虑移除不必要的尺寸约束',
                '使用相对单位 (%, rem, em) 替代固定像素',
                '确保约束不会导致图片变形'
            ]
        })

    # 通用建议
    recommendations.append({
        'priority': 'medium',
        'category': 'general',
        'issue': '布局优化建议',
        'solutions': [
            '使用现代 CSS Grid 或 Flexbox 布局',
            '设置合理的容器最小尺寸',
            '使用 CSS 变量统一尺寸管理',
            '添加响应式设计断点',
            '考虑使用 CSS contain 属性优化性能'
        ]
    })

    return recommendations

def print_report_summary(report):
    """打印报告摘要"""

    print("\n" + "="*80)
    print("📋 VOICEPANEL 技术诊断报告")
    print("="*80)

    # 基本信息
    print(f"📅 诊断时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 状态: {report['status']}")

    if report['status'] == 'failed':
        print(f"❌ 原因: {report['message']}")
        print("\n💡 建议:")
        for rec in report['recommendations']:
            print(f"  • {rec}")
        return

    # 统计信息
    stats = report['statistics']
    print(f"\n📊 统计信息:")
    print(f"  • 分析卡片总数: {stats['total_cards']}")
    print(f"  • 有裁剪问题的卡片: {stats['cards_with_clipping']}")
    print(f"  • 包含头像的卡片: {stats['cards_with_avatar']}")
    print(f"  • 被裁剪的子元素总数: {stats['total_clipped_elements']}")

    # 问题识别
    issues = report['issues_identified']
    print(f"\n⚠️ 问题识别:")

    if issues['clipping_issues']:
        clipping = issues['clipping_types']
        print(f"  • 裁剪问题: 是")
        print(f"    - 水平裁剪: {clipping['horizontal']} 个")
        print(f"    - 垂直裁剪: {clipping['vertical']} 个")
        print(f"    - 双向裁剪: {clipping['both']} 个")
    else:
        print(f"  • 裁剪问题: 否")

    if issues['avatar_issues']:
        avatar = issues['avatar_issues_detail']
        print(f"  • 头像问题: 是")
        if avatar['scaled_incorrectly'] > 0:
            print(f"    - 缩放不正确: {avatar['scaled_incorrectly']} 个")
        if avatar['overflow_parent'] > 0:
            print(f"    - 超出父容器: {avatar['overflow_parent']} 个")
        if avatar['constrained'] > 0:
            print(f"    - 受到约束: {avatar['constrained']} 个")
    else:
        print(f"  • 头像问题: 否")

    # 修复建议
    print(f"\n💡 修复建议:")
    for i, rec in enumerate(report['recommendations'], 1):
        priority_icon = "🔴" if rec['priority'] == 'high' else "🟡" if rec['priority'] == 'medium' else "🟢"
        print(f"  {i}. {priority_icon} {rec['issue']}")
        for solution in rec['solutions']:
            print(f"     • {solution}")

    print("\n" + "="*80)

async def main():
    """主函数"""
    try:
        result = await diagnose_voicepanel()
        if result:
            print("\n✅ 诊断成功完成!")
            print("📁 生成的文件:")
            print("  • voicepanel_full_page.png - 完整页面截图")
            print("  • voicepanel_panel.png - VoicePanel 区域截图")
            print("  • voicepanel_diagnostic_report.json - 详细诊断数据")
        else:
            print("\n❌ 诊断失败")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⚠️ 诊断被用户中断")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 发生未预期的错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())