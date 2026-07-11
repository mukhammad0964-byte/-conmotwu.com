#!/bin/bash
# GitHub Pages 部署验证脚本 / GitHub Pages Deployment Verification Script

echo "=========================================="
echo "GitHub Pages 部署验证 / Deployment Check"
echo "=========================================="
echo ""

# 变量定义 / Variable Definitions
REPO_OWNER="mukhammad0964-byte"
REPO_NAME="-conmotwu.com"
GITHUB_PAGES_URL="https://${REPO_OWNER}.github.io/${REPO_NAME}/"

echo "📋 仓库信息 / Repository Information"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "所有者 / Owner: ${REPO_OWNER}"
echo "仓库名 / Repo: ${REPO_NAME}"
echo "GitHub Pages URL: ${GITHUB_PAGES_URL}"
echo ""

echo "🔍 检查 GitHub Pages 部署 / Checking GitHub Pages Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查主页 / Check Homepage
echo -n "✓ 检查主页 (index.html)... / Checking homepage..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}index.html" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查联系页面 / Check Contact Page
echo -n "✓ 检查联系页面 (contact.html)... / Checking contact page..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}contact.html" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查隐私政策 / Check Privacy Policy
echo -n "✓ 检查隐私政策... / Checking privacy policy..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}privacy-policy.html" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查服务条款 / Check Terms of Service
echo -n "✓ 检查服务条款... / Checking terms of service..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}terms-of-service.html" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查 CSS / Check CSS
echo -n "✓ 检查 CSS... / Checking CSS..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}css/style.css" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查 JavaScript / Check JavaScript
echo -n "✓ 检查 JavaScript... / Checking JavaScript..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}js/main.js" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查 Logo SVG / Check Logo SVG
echo -n "✓ 检查 Logo SVG... / Checking logo..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}images/logo.svg" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查 robots.txt / Check robots.txt
echo -n "✓ 检查 robots.txt... / Checking robots.txt..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}robots.txt" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

# 检查 sitemap.xml / Check sitemap.xml
echo -n "✓ 检查 sitemap.xml... / Checking sitemap..."
if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_PAGES_URL}sitemap.xml" | grep -q "200"; then
    echo " ✅ OK (200)"
else
    echo " ❌ FAILED"
fi

echo ""
echo "🔐 HTTPS 安全检查 / HTTPS Security Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 HTTPS / Check HTTPS
echo -n "✓ 检查 HTTPS 连接... / Checking HTTPS..."
if curl -s -I "${GITHUB_PAGES_URL}" | grep -q "200\|301\|302"; then
    echo " ✅ 正常 / Working"
else
    echo " ❌ 失败 / Failed"
fi

# 检查安全头 / Check Security Headers
echo -n "✓ 检查安全头... / Checking security headers..."
HEADERS=$(curl -s -I "${GITHUB_PAGES_URL}" | head -20)
if echo "${HEADERS}" | grep -q "Strict-Transport-Security"; then
    echo " ✅ HSTS 已启用 / HSTS enabled"
else
    echo " ℹ️  HSTS 由 GitHub Pages 管理 / HSTS managed by GitHub Pages"
fi

echo ""
echo "📈 部署详情 / Deployment Details"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 获取最后修改时间 / Get last modified time
echo -n "✓ 获取最后修改时间... / Getting last modified..."
LAST_MODIFIED=$(curl -s -I "${GITHUB_PAGES_URL}" | grep -i "last-modified" | cut -d' ' -f2-)
if [ ! -z "$LAST_MODIFIED" ]; then
    echo " ${LAST_MODIFIED}"
else
    echo " ℹ️  无法获取 / N/A"
fi

# 获取 Content-Length / Get Content Length
echo -n "✓ 获取首页大小... / Getting homepage size..."
CONTENT_LENGTH=$(curl -s -I "${GITHUB_PAGES_URL}index.html" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
if [ ! -z "$CONTENT_LENGTH" ]; then
    SIZE_KB=$(echo "scale=2; $CONTENT_LENGTH / 1024" | bc)
    echo " ${SIZE_KB} KB"
else
    echo " ℹ️  无法获取 / N/A"
fi

echo ""
echo "=========================================="
echo "✅ 部署验证完成 / Verification Complete"
echo "=========================================="
echo ""
echo "网站访问地址 / Website URL:"
echo "  ${GITHUB_PAGES_URL}"
echo ""
echo "更多信息 / More Information:"
echo "  📖 查看分析报告 / Read analysis:"
echo "     GITHUB_PAGES_ANALYSIS.md"
echo ""
