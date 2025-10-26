#!/usr/bin/env python3
"""
专门针对 Marcus 头像显示问题的详细分析脚本
"""

import asyncio
from playwright.async_api import async_playwright
import json
from datetime import datetime

async def analyze_marcus_avatar():
    """专门分析 Marcus 头像的显示问题"""

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=1000)
        context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = await context.new_page()

        try:
            print("🎯 开始 Marcus 头像专项分析...")
            print(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

            # 导航到页面
            print("\n📍 步骤1: 导航到页面")
            await page.goto("http://localhost:3000", wait_until="networkidle")
            await page.wait_for_timeout(5000)  # 等待页面完全加载

            # 查找 Marcus 相关的头像
            print("\n🔍 步骤2: 查找 Marcus 头像")

            marcus_selectors = [
                'img[alt*="Marcus"]',
                'img[alt*="marcus"]',
                '*:has-text("Marcus") img',
                '[data-testid*="marcus"] img',
                '[data-testid*="Marcus"] img'
            ]

            marcus_avatars = []
            for selector in marcus_selectors:
                try:
                    avatars = await page.query_selector_all(selector)
                    if avatars:
                        marcus_avatars.extend(avatars)
                        print(f"📊 选择器 '{selector}' 找到 {len(avatars)} 个 Marcus 头像")
                except:
                    continue

            if not marcus_avatars:
                print("❌ 未找到 Marcus 头像，尝试查找 VoiceCard 中的头像...")

                # 查找第一个 VoiceCard 中的头像（假设 Marcus 是第一个）
                voice_cards = await page.query_selector_all('[class*="MuiBox-root"]:has(img)')
                for card in voice_cards:
                    # 检查卡片是否包含 Marcus 文本
                    card_text = await card.text_content()
                    if card_text and 'marcus' in card_text.lower():
                        avatar = await card.query_selector('img')
                        if avatar:
                            marcus_avatars.append(avatar)
                            print(f"📊 在包含 Marcus 的卡片中找到头像")
                            break

            if not marcus_avatars:
                print("❌ 仍然未找到 Marcus 头像，分析所有头像中的第一个...")
                all_avatars = await page.query_selector_all('img[src*="https"]')
                if all_avatars:
                    marcus_avatars = [all_avatars[0]]  # 使用第一个头像作为 Marcus
                    print(f"📊 使用第一个头像作为 Marcus 的代表")

            if not marcus_avatars:
                print("❌ 完全未找到头像，退出分析")
                return None

            # 分析 Marcus 头像
            print(f"\n🔬 步骤3: 深度分析 Marcus 头像")

            marcus_avatar = marcus_avatars[0]  # 使用第一个找到的头像
            detailed_analysis = await perform_comprehensive_avatar_analysis(page, marcus_avatar)

            if detailed_analysis:
                # 截图分析
                print("\n📸 步骤4: 截图分析")

                # 获取头像的边界框
                bbox = detailed_analysis['basic_info']['bounding_box']

                # 截取头像区域
                await page.screenshot(
                    path='marcus_avatar_closeup.png',
                    clip={
                        'x': bbox['x'] - 10,
                        'y': bbox['y'] - 10,
                        'width': bbox['width'] + 20,
                        'height': bbox['height'] + 20
                    }
                )
                print("📸 已保存 Marcus 头像特写: marcus_avatar_closeup.png")

                # 截取整个 VoiceCard
                if detailed_analysis.get('layout_analysis') and detailed_analysis['layout_analysis'].get('found'):
                    card_bbox = detailed_analysis['layout_analysis']['bounding_box']
                    await page.screenshot(
                        path='marcus_voice_card.png',
                        clip={
                            'x': card_bbox['x'],
                            'y': card_bbox['y'],
                            'width': card_bbox['width'],
                            'height': card_bbox['height']
                        }
                    )
                    print("📸 已保存 Marcus VoiceCard: marcus_voice_card.png")

                # 生成综合报告
                print(f"\n📋 步骤5: 生成 Marcus 头像分析报告")

                report = generate_marcus_specific_report(detailed_analysis)

                # 保存详细分析结果
                diagnostic_data = {
                    'timestamp': datetime.now().isoformat(),
                    'marcus_avatar_analysis': detailed_analysis,
                    'report': report,
                    'analysis_context': {
                        'page_url': page.url,
                        'page_title': await page.title(),
                        'viewport': {'width': 1920, 'height': 1080}
                    }
                }

                with open('marcus_avatar_detailed_analysis.json', 'w', encoding='utf-8') as f:
                    json.dump(diagnostic_data, f, indent=2, ensure_ascii=False)

                print("💾 详细分析已保存到: marcus_avatar_detailed_analysis.json")

                # 打印综合报告
                print_marcus_analysis_report(report)

                return diagnostic_data

        except Exception as e:
            print(f"❌ Marcus 头像分析失败: {str(e)}")
            import traceback
            traceback.print_exc()
            return None

        finally:
            print("\n🏁 分析完成，将在3秒后关闭浏览器...")
            await page.wait_for_timeout(3000)
            await browser.close()

async def perform_comprehensive_avatar_analysis(page, avatar):
    """对头像进行全面的综合分析"""

    try:
        print("🔍 执行全面分析...")

        # 基础信息分析
        basic_info = await get_basic_avatar_info(page, avatar)

        # 父容器分析
        parent_analysis = await analyze_parent_containers(page, avatar)

        # 布局分析
        layout_analysis = await analyze_layout_context(page, avatar)

        # 渲染性能分析
        render_analysis = await analyze_render_performance(page, avatar)

        # 约束条件分析
        constraints_analysis = await analyze_detailed_constraints(page, avatar)

        # 视觉效果分析
        visual_analysis = await analyze_visual_properties(page, avatar)

        # 组装所有分析结果
        comprehensive_analysis = {
            'basic_info': basic_info,
            'parent_analysis': parent_analysis,
            'layout_analysis': layout_analysis,
            'render_analysis': render_analysis,
            'constraints_analysis': constraints_analysis,
            'visual_analysis': visual_analysis,
            'analysis_timestamp': datetime.now().isoformat()
        }

        # 打印关键发现
        print("📊 关键发现:")
        print(f"  📏 头像尺寸: {basic_info['display_width']} x {basic_info['display_height']} px")
        print(f"  🖼️ 原图尺寸: {basic_info['image_attributes']['naturalWidth']} x {basic_info['image_attributes']['naturalHeight']} px")
        print(f"  ⚖️ 缩放比例: {basic_info['scale_x']:.3f}x")
        print(f"  🎯 object-fit: {basic_info['computed_styles']['objectFit']}")
        print(f"  📦 父容器数量: {len(parent_analysis['containers'])} 层")
        print(f"  🔒 约束容器: {len(constraints_analysis['constraining_containers'])} 个")
        print(f"  ✂️ 是否被裁剪: {'⚠️ 是' if basic_info['is_clipped'] else '✅ 否'}")

        if basic_info['is_clipped']:
            clipping = basic_info['clipping_details']
            overlap_desc = []
            for direction, amount in clipping.items():
                if amount > 0:
                    overlap_desc.append(f"{direction} {amount:.1f}px")
            print(f"    裁剪详情: {', '.join(overlap_desc)}")

        return comprehensive_analysis

    except Exception as e:
        print(f"❌ 全面分析失败: {e}")
        return None

async def get_basic_avatar_info(page, avatar):
    """获取头像的基础信息"""

    bbox = await avatar.bounding_box()

    # 获取图片属性
    img_attrs = await page.evaluate('''
        el => ({
            src: el.src,
            currentSrc: el.currentSrc,
            alt: el.alt || '',
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            width: el.width,
            height: el.height,
            complete: el.complete,
            loading: el.loading,
            decoding: el.decoding
        })
    ''', avatar)

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
                objectFit: style.objectFit,
                objectPosition: style.objectPosition,
                display: style.display,
                position: style.position,
                overflow: style.overflow,
                visibility: style.visibility,
                opacity: style.opacity,
                transform: style.transform,
                borderRadius: style.borderRadius
            };
        }
    ''', avatar)

    # 计算缩放比例
    scale_x = bbox['width'] / img_attrs['naturalWidth'] if img_attrs['naturalWidth'] > 0 else 1
    scale_y = bbox['height'] / img_attrs['naturalHeight'] if img_attrs['naturalHeight'] > 0 else 1

    # 检查裁剪
    clipping_info = await check_avatar_clipping(page, avatar)

    return {
        'bounding_box': bbox,
        'display_width': bbox['width'],
        'display_height': bbox['height'],
        'image_attributes': img_attrs,
        'computed_styles': computed_styles,
        'scale_x': scale_x,
        'scale_y': scale_y,
        'aspect_ratio_preserved': abs(scale_x - scale_y) < 0.1,
        'is_clipped': clipping_info['is_clipped'],
        'clipping_details': clipping_info['details'],
        'image_loaded': img_attrs['complete']
    }

async def analyze_parent_containers(page, avatar):
    """分析所有父容器"""

    containers_info = await page.evaluate('''
        img => {
            const containers = [];
            let current = img.parentElement;
            let level = 0;

            while (current && current !== document.body && level < 10) {
                const rect = current.getBoundingClientRect();
                const imgRect = img.getBoundingClientRect();
                const style = getComputedStyle(current);

                const container = {
                    level: level,
                    tagName: current.tagName,
                    className: current.className,
                    id: current.id,
                    rect: {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    },
                    styles: {
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
                        flexDirection: style.flexDirection,
                        alignItems: style.alignItems,
                        justifyContent: style.justifyContent,
                        padding: style.padding,
                        margin: style.margin,
                        borderRadius: style.borderRadius,
                        backgroundColor: style.backgroundColor
                    },
                    imagePosition: {
                        x: imgRect.x - rect.x,
                        y: imgRect.y - rect.y,
                        width: imgRect.width,
                        height: imgRect.height
                    },
                    clipsImage: false,
                    clippingAmount: {
                        right: 0,
                        left: 0,
                        bottom: 0,
                        top: 0
                    }
                };

                // 检查是否裁剪图片
                if (style.overflow !== 'visible') {
                    const overlap = {
                        right: Math.max(0, imgRect.right - rect.right),
                        left: Math.max(0, rect.left - imgRect.left),
                        bottom: Math.max(0, imgRect.bottom - rect.bottom),
                        top: Math.max(0, rect.top - imgRect.top)
                    };

                    const totalOverlap = overlap.right + overlap.left + overlap.bottom + overlap.top;
                    container.clipsImage = totalOverlap > 0;
                    container.clippingAmount = overlap;
                }

                containers.push(container);
                current = current.parentElement;
                level++;
            }

            return {
                containers: containers,
                total_levels: level,
                clipping_containers: containers.filter(c => c.clipsImage)
            };
        }
    ''', avatar)

    return containers_info

async def analyze_layout_context(page, avatar):
    """分析布局上下文"""

    layout_info = await page.evaluate('''
        img => {
            // 查找包含该头像的 VoiceCard
            let voiceCard = img.closest('[class*="MuiBox-root"], [class*="MuiCard-root"]');

            if (!voiceCard) {
                voiceCard = img.parentElement;
                while (voiceCard && voiceCard !== document.body) {
                    const style = getComputedStyle(voiceCard);
                    if (style.display === 'flex' || style.display === 'grid') {
                        break;
                    }
                    voiceCard = voiceCard.parentElement;
                }
            }

            if (!voiceCard) {
                return { found: false };
            }

            const cardRect = voiceCard.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();
            const cardStyle = getComputedStyle(voiceCard);

            return {
                found: true,
                bounding_box: {
                    x: cardRect.x,
                    y: cardRect.y,
                    width: cardRect.width,
                    height: cardRect.height
                },
                styles: {
                    display: cardStyle.display,
                    flexDirection: cardStyle.flexDirection,
                    alignItems: cardStyle.alignItems,
                    justifyContent: cardStyle.justifyContent,
                    gap: cardStyle.gap,
                    padding: cardStyle.padding,
                    position: cardStyle.position
                },
                avatar_position: {
                    x: imgRect.x - cardRect.x,
                    y: imgRect.y - cardRect.y,
                    width: imgRect.width,
                    height: imgRect.height
                },
                position_ratio: {
                    x: (imgRect.x - cardRect.x) / cardRect.width,
                    y: (imgRect.y - cardRect.y) / cardRect.height,
                    width: imgRect.width / cardRect.width,
                    height: imgRect.height / cardRect.height
                }
            };
        }
    ''', avatar)

    return layout_info

async def analyze_render_performance(page, avatar):
    """分析渲染性能"""

    performance_info = await page.evaluate('''
        img => {
            const start = performance.now();

            // 强制重绘
            const rect = img.getBoundingClientRect();
            img.style.display = 'none';
            img.offsetHeight; // 强制重排
            img.style.display = '';

            const end = performance.now();

            return {
                forced_reflow_time: end - start,
                image_composite: getComputedStyle(img).willChange,
                has_transform: getComputedStyle(img).transform !== 'none',
                has_opacity_change: getComputedStyle(img).opacity !== '1',
                is_accelerated: getComputedStyle(img).transform !== 'none' ||
                               getComputedStyle(img).opacity !== '1'
            };
        }
    ''', avatar)

    return performance_info

async def analyze_detailed_constraints(page, avatar):
    """分析详细的约束条件"""

    constraints_info = await page.evaluate('''
        img => {
            const constraints = [];
            let current = img.parentElement;

            while (current && current !== document.body) {
                const style = getComputedStyle(current);
                const constraint = {
                    tagName: current.tagName,
                    className: current.className,
                    level: constraints.length + 1,
                    size_constraints: {},
                    overflow_constraints: {},
                    layout_constraints: {},
                    visual_constraints: {}
                };

                // 尺寸约束
                const sizeProps = ['width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight'];
                for (const prop of sizeProps) {
                    const value = style[prop];
                    if (value && value !== 'auto' && value !== 'none') {
                        constraint.size_constraints[prop] = value;
                    }
                }

                // 溢出约束
                const overflowProps = ['overflow', 'overflowX', 'overflowY'];
                for (const prop of overflowProps) {
                    const value = style[prop];
                    if (value && value !== 'visible') {
                        constraint.overflow_constraints[prop] = value;
                    }
                }

                // 布局约束
                const layoutProps = ['display', 'position', 'flexDirection', 'alignItems', 'justifyContent'];
                for (const prop of layoutProps) {
                    const value = style[prop];
                    if (value) {
                        constraint.layout_constraints[prop] = value;
                    }
                }

                // 视觉约束
                const visualProps = ['borderRadius', 'boxShadow', 'backgroundColor', 'zIndex'];
                for (const prop of visualProps) {
                    const value = style[prop];
                    if (value && value !== 'initial' && value !== 'none' && value !== 'transparent') {
                        constraint.visual_constraints[prop] = value;
                    }
                }

                // 如果有任何约束，添加到列表
                if (Object.keys(constraint.size_constraints).length > 0 ||
                    Object.keys(constraint.overflow_constraints).length > 0 ||
                    Object.keys(constraint.layout_constraints).length > 0 ||
                    Object.keys(constraint.visual_constraints).length > 0) {
                    constraints.push(constraint);
                }

                current = current.parentElement;
            }

            return {
                constraining_containers: constraints,
                total_constraints: constraints.length,
                has_strong_constraints: constraints.some(c =>
                    Object.keys(c.size_constraints).length > 2 ||
                    Object.keys(c.overflow_constraints).length > 0
                )
            };
        }
    ''', avatar)

    return constraints_info

async def analyze_visual_properties(page, avatar):
    """分析视觉属性"""

    visual_info = await page.evaluate('''
        img => {
            const style = getComputedStyle(img);
            const rect = img.getBoundingClientRect();

            return {
                border_radius: style.borderRadius,
                box_shadow: style.boxShadow,
                opacity: style.opacity,
                visibility: style.visibility,
                backdrop_filter: style.backdropFilter,
                filter: style.filter,
                mix_blend_mode: style.mixBlendMode,
                isolation: style.isolation,
                actual_border_radius: {
                    top_left: parseFloat(style.borderTopLeftRadius) || 0,
                    top_right: parseFloat(style.borderTopRightRadius) || 0,
                    bottom_left: parseFloat(style.borderBottomLeftRadius) || 0,
                    bottom_right: parseFloat(style.borderBottomRightRadius) || 0
                },
                is_circular: style.borderRadius === '50%' ||
                           (parseFloat(style.borderRadius) > 0 &&
                            Math.abs(rect.width - rect.height) < 1)
            };
        }
    ''', avatar)

    return visual_info

async def check_avatar_clipping(page, avatar):
    """检查头像是否被裁剪"""

    clipping_info = await page.evaluate('''
        img => {
            const imgRect = img.getBoundingClientRect();
            let current = img.parentElement;
            let maxClipping = { right: 0, left: 0, bottom: 0, top: 0 };
            let isClipped = false;

            while (current && current !== document.body) {
                const currentRect = current.getBoundingClientRect();
                const style = getComputedStyle(current);

                if (style.overflow !== 'visible') {
                    const clipping = {
                        right: Math.max(0, imgRect.right - currentRect.right),
                        left: Math.max(0, currentRect.left - imgRect.left),
                        bottom: Math.max(0, imgRect.bottom - currentRect.bottom),
                        top: Math.max(0, currentRect.top - imgRect.top)
                    };

                    const totalClipping = clipping.right + clipping.left + clipping.bottom + clipping.top;
                    if (totalClipping > 0) {
                        isClipped = true;
                        // 保留最大裁剪量
                        maxClipping.right = Math.max(maxClipping.right, clipping.right);
                        maxClipping.left = Math.max(maxClipping.left, clipping.left);
                        maxClipping.bottom = Math.max(maxClipping.bottom, clipping.bottom);
                        maxClipping.top = Math.max(maxClipping.top, clipping.top);
                    }
                }

                current = current.parentElement;
            }

            return {
                is_clipped: isClipped,
                details: maxClipping,
                total_clipping: maxClipping.right + maxClipping.left + maxClipping.bottom + maxClipping.top
            };
        }
    ''', avatar)

    return clipping_info

def generate_marcus_specific_report(analysis):
    """生成 Marcus 特定的分析报告"""

    if not analysis:
        return {
            'status': 'failed',
            'message': '分析数据不完整',
            'recommendations': []
        }

    basic = analysis['basic_info']
    parent = analysis['parent_analysis']
    layout = analysis['layout_analysis']
    constraints = analysis['constraints_analysis']

    # 评估问题
    issues = []

    if basic['is_clipped']:
        issues.append({
            'type': 'clipping',
            'severity': 'high',
            'description': 'Marcus 头像被裁剪',
            'details': basic['clipping_details']
        })

    if not basic['aspect_ratio_preserved']:
        issues.append({
            'type': 'aspect_ratio',
            'severity': 'medium',
            'description': '头像宽高比不正确',
            'details': f'缩放比例: X={basic["scale_x"]:.3f}, Y={basic["scale_y"]:.3f}'
        })

    if constraints['has_strong_constraints']:
        issues.append({
            'type': 'constraints',
            'severity': 'medium',
            'description': '头像受到多层强约束',
            'details': f'共 {len(constraints["constraining_containers"])} 个约束容器'
        })

    # 生成建议
    recommendations = []

    if basic['is_clipped']:
        recommendations.append({
            'priority': 'high',
            'category': 'fix_clipping',
            'title': '修复 Marcus 头像裁剪问题',
            'steps': [
                '检查父容器的 overflow 属性，考虑改为 visible 或调整尺寸',
                '增加包含头像的容器尺寸',
                '调整 object-position 属性重新定位图片',
                '检查是否有不必要的 max-width/max-height 约束'
            ]
        })

    recommendations.append({
        'priority': 'medium',
        'category': 'optimize_display',
        'title': '优化 Marcus 头像显示效果',
        'steps': [
            '确保 object-fit: cover 或 contain 设置正确',
            '验证父容器的尺寸设置合理',
            '考虑使用 CSS 变量统一头像尺寸',
            '添加头像加载状态指示器'
        ]
    })

    recommendations.append({
        'priority': 'low',
        'category': 'enhance_performance',
        'title': '增强渲染性能',
        'steps': [
            '考虑使用 CSS will-change 属性优化动画',
            '确保图片使用适当的格式和尺寸',
            '实现图片懒加载（如果适用）',
            '添加图片缓存策略'
        ]
    })

    return {
        'status': 'completed',
        'summary': {
            'avatar_size': f"{basic['display_width']} x {basic['display_height']} px",
            'original_size': f"{basic['image_attributes']['naturalWidth']} x {basic['image_attributes']['naturalHeight']} px",
            'scale_factor': f"{basic['scale_x']:.3f}x",
            'object_fit': basic['computed_styles']['objectFit'],
            'is_clipped': basic['is_clipped'],
            'aspect_ratio_preserved': basic['aspect_ratio_preserved'],
            'image_loaded': basic['image_loaded'],
            'parent_containers': parent['total_levels'],
            'clipping_containers': len(parent['clipping_containers']),
            'constraint_containers': len(constraints['constraining_containers'])
        },
        'issues_found': issues,
        'recommendations': recommendations,
        'technical_details': analysis
    }

def print_marcus_analysis_report(report):
    """打印 Marcus 分析报告"""

    print("\n" + "="*80)
    print("📋 MARCUS 头像专项分析报告")
    print("="*80)

    print(f"📅 分析时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 状态: {report['status']}")

    if report['status'] == 'failed':
        print(f"❌ 原因: {report['message']}")
        return

    # 摘要信息
    summary = report['summary']
    print(f"\n📊 Marcus 头像摘要:")
    print(f"  • 显示尺寸: {summary['avatar_size']}")
    print(f"  • 原图尺寸: {summary['original_size']}")
    print(f"  • 缩放比例: {summary['scale_factor']}")
    print(f"  • object-fit: {summary['object_fit']}")
    print(f"  • 宽高比保持: {'✅ 是' if summary['aspect_ratio_preserved'] else '❌ 否'}")
    print(f"  • 裁剪状态: {'⚠️ 是' if summary['is_clipped'] else '✅ 否'}")
    print(f"  • 图片加载: {'✅ 完成' if summary['image_loaded'] else '⏳ 进行中'}")
    print(f"  • 父容器层级: {summary['parent_containers']} 层")
    print(f"  • 裁剪容器: {summary['clipping_containers']} 个")
    print(f"  • 约束容器: {summary['constraint_containers']} 个")

    # 发现的问题
    if report['issues_found']:
        print(f"\n⚠️ 发现的问题:")
        for issue in report['issues_found']:
            severity_icon = "🔴" if issue['severity'] == 'high' else "🟡" if issue['severity'] == 'medium' else "🟢"
            print(f"  • {severity_icon} {issue['description']}")
            if issue.get('details'):
                print(f"    详情: {issue['details']}")
    else:
        print(f"\n✅ 未发现明显问题")

    # 修复建议
    print(f"\n💡 修复建议:")
    for i, rec in enumerate(report['recommendations'], 1):
        priority_icon = "🔴" if rec['priority'] == 'high' else "🟡" if rec['priority'] == 'medium' else "🟢"
        print(f"  {i}. {priority_icon} {rec['title']}")
        for step in rec['steps']:
            print(f"     • {step}")

    print("\n" + "="*80)

async def main():
    """主函数"""
    try:
        result = await analyze_marcus_avatar()
        if result:
            print("\n✅ Marcus 头像分析成功完成!")
            print("📁 生成的文件:")
            print("  • marcus_avatar_detailed_analysis.json - 详细分析数据")
            print("  • marcus_avatar_closeup.png - 头像特写截图")
            print("  • marcus_voice_card.png - VoiceCard 完整截图")
        else:
            print("\n❌ Marcus 头像分析失败")
    except KeyboardInterrupt:
        print("\n⚠️ 分析被用户中断")
    except Exception as e:
        print(f"\n❌ 发生未预期的错误: {e}")

if __name__ == "__main__":
    asyncio.run(main())