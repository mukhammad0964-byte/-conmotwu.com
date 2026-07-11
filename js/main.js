// ============================================
// Conmot Wu Studio - Main JavaScript File
// 交互功能、表单验证、动画触发
// ============================================

// ============================================
// 页面加载完成后的初始化
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // 初始化所有交互功能
  initNavigation();
  initScrollAnimations();
  initFormValidation();
  initContactForm();
  initSmoothScroll();
  initDynamicAnimations();
});

// ============================================
// 导航功能
// ============================================

function initNavigation() {
  // Logo点击返回主页
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function() {
      window.location.href = '/';
    });
  }

  // 导航链接点击处理
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 移除所有活跃状态
      navLinks.forEach(l => l.classList.remove('active'));
      // 添加当前链接的活跃状态
      this.classList.add('active');
    });
  });

  // 响应式菜单（如果需要）
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
}

// ============================================
// 平滑滚动
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// 滚动动画触发
// ============================================

function initScrollAnimations() {
  // 创建 Intersection Observer 用于滚动进入视图时的动画
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 添加进入动画类
        entry.target.style.opacity = '1';
        entry.target.style.animation = `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        
        // 如果是服务卡片，添加延迟
        if (entry.target.classList.contains('service-card')) {
          const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
        
        // 停止观察此元素
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 观察所有需要动画的元素
  const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact-info-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
  });
}

// ============================================
// 表单验证
// ============================================

function initFormValidation() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取表单字段
    const formData = {
      name: form.querySelector('[name="name"]')?.value.trim(),
      email: form.querySelector('[name="email"]')?.value.trim(),
      phone: form.querySelector('[name="phone"]')?.value.trim(),
      subject: form.querySelector('[name="subject"]')?.value.trim(),
      message: form.querySelector('[name="message"]')?.value.trim()
    };

    // 验证表单
    if (!validateForm(formData)) {
      return;
    }

    // 表单验证成功，可以提交
    submitForm(formData);
  });
}

function validateForm(data) {
  // 验证姓名
  if (!data.name || data.name.length < 2) {
    showNotification('Please enter a valid name', 'error');
    return false;
  }

  // 验证邮箱
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showNotification('Please enter a valid email address', 'error');
    return false;
  }

  // 验证消息
  if (!data.message || data.message.length < 10) {
    showNotification('Please enter a message with at least 10 characters', 'error');
    return false;
  }

  return true;
}

function submitForm(data) {
  // 显示成功消息
  showNotification('Thank you for your message! We will contact you soon.', 'success');
  
  // 重置表单
  document.querySelector('form')?.reset();

  // 在实际应用中，这里会调用 API 端点来保存数据
  console.log('表单数据已提交:', data);
  
  // 可选：发送到服务器
  // sendFormToServer(data);
}

function initContactForm() {
  // 如果联系表单存在，添加额外的功能
  const contactBtn = document.querySelector('.contact-submit-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function() {
      this.style.animation = 'spin 0.6s ease-in-out';
    });
  }
}

// ============================================
// 通知系统
// ============================================

function showNotification(message, type = 'info') {
  // 移除已存在的通知
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // 添加样式
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 2000;
    animation: slideInRight 0.3s ease-out forwards;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;

  // 根据类型设置样式
  if (type === 'success') {
    notification.style.background = '#4caf50';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.background = '#f44336';
    notification.style.color = 'white';
  } else {
    notification.style.background = '#2196f3';
    notification.style.color = 'white';
  }

  document.body.appendChild(notification);

  // 3秒后移除通知
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// 动态动画效果
// ============================================

function initDynamicAnimations() {
  // 为所有可点击的卡片添加涟漪效果
  const cards = document.querySelectorAll('.service-card, .contact-info-card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // 创建涟漪效果
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      `;
      
      // 添加动画样式（如果还没有）
      if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', 'true');
        style.textContent = `
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 鼠标跟踪效果（可选）
  addMouseFollowEffect();
}

// ============================================
// 鼠标跟踪效果
// ============================================

function addMouseFollowEffect() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  document.addEventListener('mousemove', function(e) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    // 根据鼠标位置调整背景
    const gradientBg = document.querySelector('.hero::before');
    if (gradientBg) {
      // 注意：CSS伪元素无法直接通过JS修改，这里使用其他方法
    }
  });
}

// ============================================
// 页面加载完成后的效果
// ============================================

window.addEventListener('load', function() {
  // 移除加载动画
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader?.remove(), 300);
  }

  // 触发页面进入动画
  const pageContent = document.querySelector('main');
  if (pageContent) {
    pageContent.style.animation = 'fadeInUp 0.8s ease-out forwards';
  }
});

// ============================================
// 性能优化：防抖函数
// ============================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// 响应式设计辅助函数
// ============================================

function handleResponsive() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // 移动设备适配
    document.body.classList.add('mobile');
  } else {
    document.body.classList.remove('mobile');
  }
}

// 窗口大小改变时调用
window.addEventListener('resize', debounce(handleResponsive, 250));
handleResponsive();

// ============================================
// 辅助函数：获取URL参数
// ============================================

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// ============================================
// 导出函数供外部使用
// ============================================

window.ConmotWu = {
  showNotification: showNotification,
  validateForm: validateForm,
  submitForm: submitForm,
  getUrlParameter: getUrlParameter
};

console.log('Conmot Wu Studio - Website initialized');
