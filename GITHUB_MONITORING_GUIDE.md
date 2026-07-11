# GitHub Pages 部署监控和故障排除指南
# GitHub Pages Deployment Monitoring & Troubleshooting Guide

## 📊 部署状态快速查看 / Quick Deployment Status

### GitHub 仓库地址
```
https://github.com/mukhammad0964-byte/-conmotwu.com
```

### GitHub Pages 网站地址
```
https://mukhammad0964-byte.github.io/-conmotwu.com/
```

### 实时部署日志位置
```
GitHub 仓库 → Actions 标签页 → 查看最近的工作流运行
Repository → Actions Tab → View Latest Workflow Run
```

---

## ✅ 部署流程工作原理 / How Deployment Works

### 自动部署流程
```
1. 本地提交代码 / Push code locally
         ↓
2. git push origin master
         ↓
3. GitHub 检测到 push 事件 / GitHub detects push
         ↓
4. 触发 GitHub Actions 工作流 / Trigger workflow
         ↓
5. 检出代码 (actions/checkout@v4)
         ↓
6. 配置 GitHub Pages (actions/configure-pages@v5)
         ↓
7. 上传 artifacts (actions/upload-pages-artifact@v3)
         ↓
8. 部署到 GitHub Pages (actions/deploy-pages@v5)
         ↓
9. 网站更新 / Website updated ✅
```

### 预计部署时间
- ⏱️ **快速**: 30 秒 - 2 分钟
- 📍 **服务器缓存**: 最多 5 分钟才能在全球生效

---

## 🔍 检查部署状态 / Check Deployment Status

### 方法 1: GitHub Actions 界面
1. 打开仓库 → Actions 标签页
2. 查看最近的工作流运行
3. 观察 ✅ 绿色勾号 = 成功
4. 观察 ❌ 红色 X = 失败
5. 点击运行查看详细日志

### 方法 2: 命令行检查
```bash
# 查看最后一次提交状态
git log --oneline -5

# 查看工作流状态（需要 GitHub CLI）
gh run list -R mukhammad0964-byte/-conmotwu.com

# 检查 GitHub Pages 健康状态
curl -I https://mukhammad0964-byte.github.io/-conmotwu.com/
```

### 方法 3: 浏览器验证
1. 打开 `https://mukhammad0964-byte.github.io/-conmotwu.com/`
2. 按 F12 打开开发者工具
3. 查看 Network 标签页
4. 检查所有文件的 HTTP 状态码是否为 200

---

## 🛠️ 常见问题排查 / Troubleshooting

### 问题 1: 网站显示 404 错误
**症状**: 访问网站时显示 "404 Page Not Found"

**原因**:
- GitHub Pages 还未完成部署
- 工作流失败
- 仓库设置中 Pages 未启用

**解决方案**:
```bash
# 1. 检查工作流状态
访问 GitHub → Actions → 查看最近运行

# 2. 如果失败，查看详细日志
点击失败的运行 → 查看 "Deploy" 步骤输出

# 3. 检查 GitHub Pages 设置
Repository Settings → Pages → Source 应为 "Deploy from a branch"

# 4. 等待重新部署
修改任意文件并 push，触发新的部署
```

### 问题 2: 网站内容过时
**症状**: 修改文件后，网站仍显示旧内容

**原因**:
- 浏览器缓存
- GitHub Pages CDN 缓存
- 工作流尚未完成

**解决方案**:
```bash
# 1. 检查工作流是否完成
访问 GitHub Actions 查看最新运行

# 2. 清除浏览器缓存
Ctrl+Shift+Delete (或 Cmd+Shift+Delete on Mac)
选择 "Clear All Time"

# 3. 硬刷新
Ctrl+F5 (或 Cmd+Shift+R on Mac)

# 4. 检查 CDN 缓存
在不同浏览器或隐身模式测试

# 5. 强制使用最新版本
访问 https://mukhammad0964-byte.github.io/-conmotwu.com/?v=$(date +%s)
```

### 问题 3: CSS/JS 加载失败
**症状**: 网站显示但样式或交互不工作

**原因**:
- 资源路径错误
- baseurl 配置错误
- 文件大小写不匹配 (Linux 敏感)

**解决方案**:
```bash
# 1. 检查文件路径
ls -la css/
ls -la js/
ls -la images/

# 2. 验证 _config.yml 中的 baseurl
cat _config.yml | grep baseurl

# 3. 检查 HTML 中的路径
grep -r "href=" index.html | head -5

# 4. 确保大小写一致
# CSS/style.css ✅ (全小写)
# Css/Style.css ❌ (错误的大小写)

# 5. 重新部署
git add -A
git commit -m "Fix resource paths"
git push origin master
```

### 问题 4: HTTPS 证书错误
**症状**: "这个网站的安全证书有问题"

**原因**:
- 极其罕见（GitHub Pages 使用 Let's Encrypt）
- 通常是中间人攻击或 VPN 问题
- 浏览器信任库过时

**解决方案**:
```bash
# 1. 尝试其他浏览器
# 2. 禁用 VPN 或代理
# 3. 清除 OS 级别的 DNS 缓存
# macOS: sudo dscacheutil -flushcache
# Windows: ipconfig /flushdns
# Linux: sudo systemctl restart systemd-resolved

# 4. 使用 curl 验证 HTTPS
curl -I https://mukhammad0964-byte.github.io/-conmotwu.com/

# 应该看到:
# HTTP/2 200
# strict-transport-security: max-age=31536000; includeSubdomains; preload
```

### 问题 5: 自定义域名不工作
**症状**: 自定义域名解析失败或重定向错误

**原因**:
- CNAME 文件不存在
- DNS 记录配置错误
- DNS 传播延迟

**解决方案**:
```bash
# 1. 创建 CNAME 文件（如需自定义域名）
echo "www.conmotwu.com" > CNAME

# 2. 推送 CNAME 文件
git add CNAME
git commit -m "Add custom domain configuration"
git push origin master

# 3. 在 DNS 提供商配置 CNAME 记录
# 添加 CNAME 记录:
# 名称: www
# 类型: CNAME
# 值: mukhammad0964-byte.github.io

# 4. 验证 DNS 传播
nslookup www.conmotwu.com
# 或
dig www.conmotwu.com

# 5. 在 GitHub Settings → Pages 中验证
# 应该显示: "Your site is published at https://www.conmotwu.com"
```

---

## 📈 性能监控 / Performance Monitoring

### 检查网站性能
```bash
# 1. 使用 Google PageSpeed Insights
访问 https://pagespeed.web.dev/
输入: https://mukhammad0964-byte.github.io/-conmotwu.com/

# 2. 使用 GTmetrix
访问 https://gtmetrix.com/
输入: https://mukhammad0964-byte.github.io/-conmotwu.com/

# 3. 使用命令行工具
curl -w "Time to First Byte: %{time_starttransfer}s\n" \
     -o /dev/null -s https://mukhammad0964-byte.github.io/-conmotwu.com/
```

### 性能目标
- ⚡ **首字节时间 (TTFB)**: < 500ms
- 🎯 **首次内容绘制 (FCP)**: < 1.8s
- 🏁 **最大内容绘制 (LCP)**: < 2.5s
- ⚙️ **累积布局转移 (CLS)**: < 0.1

---

## 🔄 持续部署工作流 / CI/CD Workflow

### 正常的部署流程
```
1. 在本地开发修改文件
2. git add .
3. git commit -m "描述变更"
4. git push origin master
5. GitHub 自动构建和部署
6. 等待 Actions 完成 (1-2 分钟)
7. 访问网站验证更新
```

### 部署前检查清单
```
□ 本地测试完毕
□ 所有文件保存
□ 没有遗留的控制台错误
□ 图像和链接都有效
□ SEO 配置正确
□ robots.txt 和 sitemap.xml 已更新
□ 提交消息清晰描述性强
```

---

## 🔐 安全监控 / Security Monitoring

### 检查安全头
```bash
# 查看所有响应头
curl -I https://mukhammad0964-byte.github.io/-conmotwu.com/

# 应该看到:
# HTTP/2 200
# content-type: text/html; charset=utf-8
# strict-transport-security: max-age=31536000; includeSubdomains; preload
# x-frame-options: SAMEORIGIN (由 GitHub 管理)
# x-content-type-options: nosniff (由 GitHub 管理)
```

### 监控 GitHub Security Alerts
1. 访问仓库 → Security 标签页
2. 定期检查 "Dependabot alerts"
3. 及时修复任何报告的漏洞
4. 启用 "Automatic security updates"

---

## 📝 部署日志审查 / Deployment Logs Review

### 查看完整的部署日志
1. GitHub 仓库 → Actions 标签页
2. 点击最近的工作流运行
3. 点击 "Deploy to GitHub Pages" 步骤
4. 查看完整的构建输出

### 常见的成功日志输出
```
✓ Artifact uploaded for deployment: 126 files, 2.5 MB total
✓ Deployment successful!
✓ Pages site will be deployed on-demand, from the uploaded artifact
✓ Environment URL: https://mukhammad0964-byte.github.io/-conmotwu.com/
```

### 常见的失败日志输出
```
✗ Error: Unable to upload artifact
✗ Error: Insufficient permissions
✗ Error: Workflow file syntax error
```

---

## 🎯 定期维护任务 / Regular Maintenance Tasks

### 每周任务
- [ ] 检查 GitHub Actions 工作流是否正常运行
- [ ] 测试网站的关键功能
- [ ] 验证所有外部链接是否有效

### 每月任务
- [ ] 检查 Google PageSpeed 分数
- [ ] 审查 GitHub Security Alerts
- [ ] 分析网站流量和用户行为
- [ ] 更新内容和信息（如需要）

### 每年任务
- [ ] 审查隐私政策和条款
- [ ] 安全审计
- [ ] 更新依赖和库
- [ ] 域名和证书续期检查

---

## 📚 有用的资源 / Useful Resources

### 官方文档
- GitHub Pages: https://docs.github.com/en/pages
- GitHub Actions: https://docs.github.com/en/actions
- Jekyll: https://jekyllrb.com/docs/

### 调试工具
- Google PageSpeed Insights: https://pagespeed.web.dev/
- W3C HTML Validator: https://validator.w3.org/
- GTmetrix: https://gtmetrix.com/
- SSL Labs: https://www.ssllabs.com/ssltest/

### 性能监控
- GitHub Actions Status: https://www.githubstatus.com/
- Let's Encrypt Status: https://letsencrypt.status.io/

---

## 💬 获取帮助 / Getting Help

### 遇到问题？
1. 查看 GitHub Pages 文档: https://docs.github.com/en/pages/getting-started-with-github-pages
2. 查看本仓库的 GITHUB_PAGES_ANALYSIS.md
3. 查看 GitHub Discussions
4. 提交 Issue 到仓库

### 联系方式
- 📧 Email: mukhammad0964@icloud.com
- 🌐 Website: https://mukhammad0964-byte.github.io/-conmotwu.com/

---

**最后更新**: 2026-07-11
**配置状态**: ✅ **正常运作**
**下次检查**: 建议每周检查一次

---

## 📋 快速参考 / Quick Reference

| 任务 | 命令/URL |
|------|---------|
| 查看仓库 | https://github.com/mukhammad0964-byte/-conmotwu.com |
| 查看网站 | https://mukhammad0964-byte.github.io/-conmotwu.com/ |
| 查看 Actions | https://github.com/mukhammad0964-byte/-conmotwu.com/actions |
| 查看设置 | https://github.com/mukhammad0964-byte/-conmotwu.com/settings |
| 推送更新 | git push origin master |
| 检查状态 | curl -I https://mukhammad0964-byte.github.io/-conmotwu.com/ |
| 清除缓存 | Ctrl+Shift+Delete (浏览器) |
| 查看日志 | GitHub → Actions → Latest Run |
