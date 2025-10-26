#!/usr/bin/env python3
"""
专门分析 VoiceCard 中头像显示问题的 Playwright 脚本
"""

import asyncio
from playwright.async_api import async_playwright
import json
from datetime import datetime

async def analyze_voicecard_avatars():
    """专门分析 VoiceCard 中的头像显示问题"""

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = await context.new_page()

        try:
            print("🚀 开始 VoiceCard 头像显示分析...")
            print(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

            # 导航到页面
            print("\n📍 步骤1: 导航到页面")
            await page.goto("http://localhost:3000", wait_until="networkidle")
            await page.wait_for_timeout(3000)

            # 查找头像元素
            print("\n🔍 步骤2: 查找所有头像元素")

            # 使用更具体的选择器
            avatar_selectors = [
                'img[alt*="Marcus"]',
                'img[alt*="marcus"]',
                'img[src*="marcus"]',
                'img[src*="avatar"]',
                '.MuiAvatar-root img',  # MUI Avatar 组件
                '.MuiAvatar-img',       # MUI Avatar 图片类
                '[class*="avatar"] img',
                'img[src*="https"]'     # 任何网络图片
            ]

            all_avatars = []
            for selector in avatar_selectors:
                try:
                    avatars = await page.query_selector_all(selector)
                    if avatars:
                        all_avatars.extend(avatars)
                        print(f"📊 选择器 '{selector}' 找到 {len(avatars)} 个头像")
                except:
                    continue

            # 去重
            unique_avatars = []
            seen_srcs = set()
            for avatar in all_avatars:
                src = await page.evaluate('el => el.src', avatar)
                if src and src not in seen_srcs:
                    unique_avatars.append(avatar)
                    seen_srcs.add(src)

            print(f"📊 总计找到 {len(unique_avatars)} 个唯一头像")

            if not unique_avatars:
                print("❌ 未找到头像，尝试查找 VoiceCard 组件...")

                # 查找 VoiceCard 容器
                voice_card_selectors = [
                    '[data-testid="voice-card"]',
                    '.voice-card',
                    '[class*="VoiceCard"]',
                    '[class*="MuiBox-root"]',
                    '[class*="MuiCard-root"]'
                ]

                voice_cards = []
                for selector in voice_card_selectors:
                    try:
                        cards = await page.query_selector_all(selector)
                        if cards:
                            voice_cards.extend(cards)
                            print(f"📊 选择器 '{selector}' 找到 {len(cards)} 个卡片")
                    except:
                        continue

                # 在卡片中查找头像
                for card in voice_cards:
                    try:
                        card_avatars = await card.query_selector_all('img')
                        for avatar in card_avatars:
                            src = await page.evaluate('el => el.src', avatar)
                            if src and 'http' in src:  # 确保是真实的图片
                                unique_avatars.append(avatar)
                                print(f"📊 在卡片中找到头像: {src}")
                    except:
                        continue

            if not unique_avatars:
                print("❌ 仍然未找到头像，退出分析")
                return None

            # 分析每个头像
            print(f"\n🔬 步骤3: 分析 {len(unique_avatars)} 个头像")

            analysis_results = []

            for i, avatar in enumerate(unique_avatars):
                print(f"\n--- 分析头像 {i+1} ---")

                try:
                    avatar_analysis = await analyze_single_avatar(page, avatar, i)
                    if avatar_analysis:
                        analysis_results.append(avatar_analysis)

                        # 检查头像是否被裁剪
                        if avatar_analysis['is_clipped']:
                            print(f"  ⚠️ 头像被裁剪!")
                            await analyze_clipping_details(page, avatar, avatar_analysis)

                except Exception as e:
                    print(f"  ❌ 分析头像 {i+1} 时出错: {e}")
                    continue

            # 生成详细报告
            print(f"\n📋 步骤4: 生成分析报告")

            report = generate_avatar_analysis_report(analysis_results)

            # 保存结果
            diagnostic_data = {
                'timestamp': datetime.now().isoformat(),
                'total_avatars': len(unique_avatars),
                'analysis_results': analysis_results,
                'report': report
            }

            with open('voicecard_avatar_analysis.json', 'w', encoding='utf-8') as f:
                json.dump(diagnostic_data, f, indent=2, ensure_ascii=False)

            print("💾 分析数据已保存到: voicecard_avatar_analysis.json")

            # 打印报告摘要
            print_avatar_analysis_summary(report)

            # 截取最终页面状态
            await page.screenshot(path='voicecard_avatar_analysis_final.png', full_page=False)
            print("📸 已保存最终页面截图: voicecard_avatar_analysis_final.png")

            return diagnostic_data

        except Exception as e:
            print(f"❌ 分析过程中发生错误: {str(e)}")
            import traceback
            traceback.print_exc()
            return None

        finally:
            print("\n🏁 分析完成，将在3秒后关闭浏览器...")
            await page.wait_for_timeout(3000)
            await browser.close()

async def analyze_single_avatar(page, avatar, index):
    """分析单个头像元素"""

    try:
        # 获取基本信息
        bbox = await avatar.bounding_box()
        if not bbox:
            print(f"  ⚠️ 无法获取头像 {index+1} 的边界信息")
            return None

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
                    borderRadius: style.borderRadius,
                    boxShadow: style.boxShadow,
                    backgroundColor: style.backgroundColor,
                    zIndex: style.zIndex
                };
            }
        ''', avatar)

        # 获取父容器信息
        parent_info = await page.evaluate('''
            img => {
                const parent = img.parentElement;
                if (!parent) return null;

                const parentStyle = getComputedStyle(parent);
                const parentRect = parent.getBoundingClientRect();
                const imgRect = img.getBoundingClientRect();

                return {
                    tagName: parent.tagName,
                    className: parent.className,
                    rect: {
                        x: parentRect.x,
                        y: parentRect.y,
                        width: parentRect.width,
                        height: parentRect.height
                    },
                    styles: {
                        width: parentStyle.width,
                        height: parentStyle.height,
                        maxWidth: parentStyle.maxWidth,
                        maxHeight: parentStyle.maxHeight,
                        minWidth: parentStyle.minWidth,
                        minHeight: parentStyle.minHeight,
                        display: parentStyle.display,
                        position: parentStyle.position,
                        overflow: parentStyle.overflow,
                        overflowX: parentStyle.overflowX,
                        overflowY: parentStyle.overflowY,
                        flexDirection: parentStyle.flexDirection,
                        alignItems: parentStyle.alignItems,
                        justifyContent: parentStyle.justifyContent,
                        padding: parentStyle.padding,
                        margin: parentStyle.margin,
                        borderRadius: parentStyle.borderRadius
                    },
                    imagePosition: {
                        x: imgRect.x - parentRect.x,
                        y: imgRect.y - parentRect.y,
                        width: imgRect.width,
                        height: imgRect.height
                    }
                };
            }
        ''', avatar)

        # 检查是否被裁剪
        is_clipped = False
        clipping_info = {}

        if parent_info:
            parent_rect = parent_info['rect']
            img_pos = parent_info['imagePosition']

            # 检查是否超出父容器边界（允许1px的误差）
            clipping_info = {
                'right': max(0, img_pos['x'] + img_pos['width'] - parent_rect['width'] - 1),
                'left': max(0, -img_pos['x'] - 1),
                'bottom': max(0, img_pos['y'] + img_pos['height'] - parent_rect['height'] - 1),
                'top': max(0, -img_pos['y'] - 1)
            }

            total_overlap = sum(clipping_info.values())
            is_clipped = total_overlap > 0

        # 计算缩放比例
        scale_x = bbox['width'] / img_attrs['naturalWidth'] if img_attrs['naturalWidth'] > 0 else 1
        scale_y = bbox['height'] / img_attrs['naturalHeight'] if img_attrs['naturalHeight'] > 0 else 1
        aspect_ratio_preserved = abs(scale_x - scale_y) < 0.1

        # 获取所有容器的约束
        container_constraints = await get_all_container_constraints(page, avatar)

        # 组装分析结果
        avatar_info = {
            'index': index,
            'bounding_box': bbox,
            'image_attributes': img_attrs,
            'computed_styles': computed_styles,
            'parent_info': parent_info,
            'is_clipped': is_clipped,
            'clipping_info': clipping_info,
            'scale_x': scale_x,
            'scale_y': scale_y,
            'aspect_ratio_preserved': aspect_ratio_preserved,
            'container_constraints': container_constraints,
            'has_constraints': len(container_constraints) > 0,
            'image_loaded': img_attrs['complete'],
            'has_natural_dimensions': img_attrs['naturalWidth'] > 0 and img_attrs['naturalHeight'] > 0
        }

        # 打印简要信息
        print(f"  📏 显示尺寸: {bbox['width']:.1f} x {bbox['height']:.1f} px")
        print(f"  🖼️ 原图尺寸: {img_attrs['naturalWidth']} x {img_attrs['naturalHeight']} px")
        print(f"  🎯 object-fit: {computed_styles['objectFit']}")
        print(f"  📦 父容器: {parent_info['tagName'] if parent_info else 'None'} ({parent_info['className'] if parent_info else ''})")

        if parent_info:
            print(f"  📦 父容器尺寸: {parent_info['rect']['width']:.1f} x {parent_info['rect']['height']:.1f} px")
            print(f"  📦 父容器 overflow: {parent_info['styles']['overflow']}")

        print(f"  ⚖️ 缩放比例: X={scale_x:.2f}, Y={scale_y:.2f}")
        print(f"  🎨 宽高比保持: {'✅ 是' if aspect_ratio_preserved else '❌ 否'}")
        print(f"  ✂️ 裁剪状态: {'⚠️ 是' if is_clipped else '✅ 否'}")
        print(f"  🔒 约束容器: {len(container_constraints)} 个")
        print(f"  📷 图片加载: {'✅ 完成' if img_attrs['complete'] else '⏳ 进行中'}")

        if is_clipped:
            overlap_desc = []
            for direction, amount in clipping_info.items():
                if amount > 0:
                    overlap_desc.append(f"{direction} {amount:.1f}px")
            print(f"    裁剪详情: {', '.join(overlap_desc)}")

        return avatar_info

    except Exception as e:
        print(f"    ❌ 分析头像详情时出错: {e}")
        return None

async def analyze_clipping_details(page, avatar, avatar_analysis):
    """分析裁剪的详细信息"""

    try:
        print("  🔍 详细裁剪分析:")

        clipping_details = await page.evaluate('''
            img => {
                const details = [];
                let current = img.parentElement;

                while (current && current !== document.body) {
                    const currentRect = current.getBoundingClientRect();
                    const imgRect = img.getBoundingClientRect();
                    const style = getComputedStyle(current);

                    // 检查当前容器是否裁剪了图片
                    const clipping = {
                        container: {
                            tagName: current.tagName,
                            className: current.className,
                            rect: currentRect,
                            overflow: style.overflow,
                            overflowX: style.overflowX,
                            overflowY: style.overflowY,
                            position: style.position,
                            display: style.display
                        },
                        isClipping: false,
                        overlap: {
                            right: 0,
                            left: 0,
                            bottom: 0,
                            top: 0
                        }
                    };

                    // 只有当 overflow 不是 visible 时才检查裁剪
                    if (style.overflow !== 'visible') {
                        const overlap = {
                            right: Math.max(0, imgRect.right - currentRect.right),
                            left: Math.max(0, currentRect.left - imgRect.left),
                            bottom: Math.max(0, imgRect.bottom - currentRect.bottom),
                            top: Math.max(0, currentRect.top - imgRect.top)
                        };

                        const totalOverlap = overlap.right + overlap.left + overlap.bottom + overlap.top;
                        clipping.isClipping = totalOverlap > 0;
                        clipping.overlap = overlap;
                    }

                    details.push(clipping);
                    current = current.parentElement;
                }

                return details;
            }
        ''', avatar)

        print(f"    检查了 {len(clipping_details)} 个容器层级:")

        for i, detail in enumerate(clipping_details):
            container = detail['container']
            print(f"      {i+1}. {container['tagName']} ({container['className'][:50]}{'...' if len(container['className']) > 50 else ''})")
            print(f"         overflow: {container['overflow']}/{container['overflowX']}/{container['overflowY']}")
            print(f"         position: {container['position']}, display: {container['display']}")

            if detail['isClipping']:
                overlaps = detail['overlap']
                overlap_desc = []
                for direction, amount in overlaps.items():
                    if amount > 0:
                        overlap_desc.append(f"{direction} {amount:.1f}px")
                print(f"         ⚠️ 此容器裁剪了图片: {', '.join(overlap_desc)}")
            else:
                print(f"         ✅ 此容器未裁剪图片")

    except Exception as e:
        print(f"    ❌ 裁剪详情分析失败: {e}")

async def get_all_container_constraints(page, avatar):
    """获取所有容器的约束条件"""

    try:
        constraints = await page.evaluate('''
            img => {
                const constraints = [];
                let current = img.parentElement;

                while (current && current !== document.body) {
                    const style = getComputedStyle(current);
                    const constraint = {
                        tagName: current.tagName,
                        className: current.className,
                        hasSizeConstraints: false,
                        hasOverflowConstraints: false,
                        sizeConstraints: {},
                        overflowConstraints: {}
                    };

                    // 检查尺寸约束
                    const sizeProps = ['width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight'];
                    for (const prop of sizeProps) {
                        const value = style[prop];
                        if (value && value !== 'auto' && value !== 'none') {
                            constraint.hasSizeConstraints = true;
                            constraint.sizeConstraints[prop] = value;
                        }
                    }

                    // 检查溢出约束
                    const overflowProps = ['overflow', 'overflowX', 'overflowY'];
                    for (const prop of overflowProps) {
                        const value = style[prop];
                        if (value && value !== 'visible') {
                            constraint.hasOverflowConstraints = true;
                            constraint.overflowConstraints[prop] = value;
                        }
                    }

                    if (constraint.hasSizeConstraints || constraint.hasOverflowConstraints) {
                        constraints.push(constraint);
                    }

                    current = current.parentElement;
                }

                return constraints;
            }
        ''', avatar)

        return constraints

    except Exception as e:
        print(f"    ❌ 获取容器约束失败: {e}")
        return []

def generate_avatar_analysis_report(analysis_results):
    """生成头像分析报告"""

    if not analysis_results:
        return {
            'status': 'failed',
            'message': '没有可分析的头像数据',
            'recommendations': []
        }

    # 统计信息
    total_avatars = len(analysis_results)
    clipped_avatars = sum(1 for avatar in analysis_results if avatar['is_clipped'])
    aspect_ratio_issues = sum(1 for avatar in analysis_results if not avatar['aspect_ratio_preserved'])
    with_constraints = sum(1 for avatar in analysis_results if avatar['has_constraints'])
    images_not_loaded = sum(1 for avatar in analysis_results if not avatar['image_loaded'])
    no_natural_dimensions = sum(1 for avatar in analysis_results if not avatar['has_natural_dimensions'])

    # 分析问题类型
    clipping_types = {
        'horizontal': 0,
        'vertical': 0,
        'both': 0
    }

    for avatar in analysis_results:
        if avatar['is_clipped']:
            clipping = avatar['clipping_info']
            horizontal = clipping['left'] > 0 or clipping['right'] > 0
            vertical = clipping['top'] > 0 or clipping['bottom'] > 0

            if horizontal and vertical:
                clipping_types['both'] += 1
            elif horizontal:
                clipping_types['horizontal'] += 1
            else:
                clipping_types['vertical'] += 1

    # 生成建议
    recommendations = []

    if clipped_avatars > 0:
        recommendations.append({
            'priority': 'high',
            'issue': f'{clipped_avatars} 个头像被裁剪',
            'category': 'clipping',
            'solutions': [
                '检查并修改父容器的 overflow 属性',
                '增加父容器的尺寸或移除尺寸限制',
                '调整 object-position 属性重新定位图片',
                '使用 CSS contain 属性优化显示'
            ]
        })

    if aspect_ratio_issues > 0:
        recommendations.append({
            'priority': 'high',
            'issue': f'{aspect_ratio_issues} 个头像宽高比不正确',
            'category': 'aspect_ratio',
            'solutions': [
                '确保 width 和 height 属性保持相同比例',
                '使用 object-fit: cover 或 contain',
                '设置固定的 aspect-ratio CSS 属性',
                '检查 max-width/max-height 约束'
            ]
        })

    if images_not_loaded > 0:
        recommendations.append({
            'priority': 'medium',
            'issue': f'{images_not_loaded} 个头像图片未完全加载',
            'category': 'loading',
            'solutions': [
                '检查图片 URL 是否正确',
                '添加图片加载错误处理',
                '使用 loading="eager" 属性',
                '实现图片预加载机制'
            ]
        })

    if no_natural_dimensions > 0:
        recommendations.append({
            'priority': 'medium',
            'issue': f'{no_natural_dimensions} 个头像缺少原始尺寸信息',
            'category': 'image_properties',
            'solutions': [
                '确保图片文件完整',
                '检查图片格式是否支持',
                '添加图片加载完成的回调处理',
                '实现备用图片机制'
            ]
        })

    # 通用建议
    recommendations.append({
        'priority': 'low',
        'issue': '优化建议',
        'category': 'optimization',
        'solutions': [
            '使用适当的图片格式 (WebP, AVIF)',
            '实现响应式图片尺寸',
            '添加图片 lazy loading',
            '使用 CSS 变量统一头像尺寸'
        ]
    })

    report = {
        'status': 'completed',
        'statistics': {
            'total_avatars': total_avatars,
            'clipped_avatars': clipped_avatars,
            'aspect_ratio_issues': aspect_ratio_issues,
            'with_constraints': with_constraints,
            'images_not_loaded': images_not_loaded,
            'no_natural_dimensions': no_natural_dimensions,
            'clipping_types': clipping_types
        },
        'issues_detected': clipped_avatars > 0 or aspect_ratio_issues > 0 or images_not_loaded > 0,
        'recommendations': recommendations,
        'detailed_analysis': analysis_results
    }

    return report

def print_avatar_analysis_summary(report):
    """打印头像分析摘要"""

    print("\n" + "="*80)
    print("📋 VOICECARD 头像显示分析报告")
    print("="*80)

    print(f"📅 分析时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 状态: {report['status']}")

    if report['status'] == 'failed':
        print(f"❌ 原因: {report['message']}")
        return

    # 统计信息
    stats = report['statistics']
    print(f"\n📊 头像统计:")
    print(f"  • 分析头像总数: {stats['total_avatars']}")
    print(f"  • 被裁剪的头像: {stats['clipped_avatars']}")
    print(f"  • 宽高比问题: {stats['aspect_ratio_issues']}")
    print(f"  • 受约束的头像: {stats['with_constraints']}")
    print(f"  • 未加载完成的头像: {stats['images_not_loaded']}")
    print(f"  • 缺少原始尺寸的头像: {stats['no_natural_dimensions']}")

    # 裁剪类型
    if stats['clipped_avatars'] > 0:
        print(f"\n✂️ 裁剪类型:")
        print(f"  • 水平裁剪: {stats['clipping_types']['horizontal']} 个")
        print(f"  • 垂直裁剪: {stats['clipping_types']['vertical']} 个")
        print(f"  • 双向裁剪: {stats['clipping_types']['both']} 个")

    # 问题检测
    print(f"\n⚠️ 问题检测:")
    if report['issues_detected']:
        print(f"  • 状态: 发现问题需要处理")
    else:
        print(f"  • 状态: ✅ 未发现明显问题")

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
        result = await analyze_voicecard_avatars()
        if result:
            print("\n✅ 头像分析成功完成!")
            print("📁 生成的文件:")
            print("  • voicecard_avatar_analysis.json - 详细分析数据")
            print("  • voicecard_avatar_analysis_final.png - 最终页面截图")
        else:
            print("\n❌ 头像分析失败")
    except KeyboardInterrupt:
        print("\n⚠️ 分析被用户中断")
    except Exception as e:
        print(f"\n❌ 发生未预期的错误: {e}")

if __name__ == "__main__":
    asyncio.run(main())