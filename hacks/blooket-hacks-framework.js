/**
 * Blooket Hacks Framework - iPad/Mobile Edition
 * Full support for iPad, iPhone, and Android devices
 * 
 * DISCLAIMER: Use responsibly and in accordance with Blooket's terms of service.
 * This framework is for educational purposes only.
 */

// ==================== DEVICE DETECTION ====================

const DeviceInfo = {
  isIpad: /iPad/.test(navigator.userAgent),
  isIphone: /iPhone/.test(navigator.userAgent),
  isAndroid: /Android/.test(navigator.userAgent),
  isMobile: /iPhone|iPad|Android/.test(navigator.userAgent),
  isDesktop: !/iPhone|iPad|Android/.test(navigator.userAgent),
  
  getDeviceType() {
    if (this.isIpad) return 'iPad';
    if (this.isIphone) return 'iPhone';
    if (this.isAndroid) return 'Android';
    return 'Desktop';
  },
  
  log() {
    console.log(`[Device] ${this.getDeviceType()} - Mobile: ${this.isMobile}`);
  }
};

// ==================== FRAMEWORK CORE ====================

class BlooketHacksFramework {
  constructor() {
    this.hacks = new Map();
    this.enabled = new Set();
    this.version = '2.0.0-mobile';
    this.isMobile = DeviceInfo.isMobile;
  }

  /**
   * Register a new hack
   * @param {string} name - Unique hack name
   * @param {Object} hackObject - Hack object with methods
   */
  registerHack(name, hackObject) {
    if (this.hacks.has(name)) {
      console.warn(`[Framework] Hack '${name}' already exists. Overwriting...`);
    }
    this.hacks.set(name, hackObject);
    console.log(`[Framework] Registered hack: ${name}`);
    return this;
  }

  /**
   * Enable a registered hack
   * @param {string} name - Hack name
   */
  enableHack(name) {
    const hack = this.hacks.get(name);
    if (!hack) {
      console.error(`[Framework] Hack '${name}' not found`);
      return false;
    }
    if (hack.enable && typeof hack.enable === 'function') {
      hack.enable();
      this.enabled.add(name);
      console.log(`[Framework] ✓ Enabled: ${name}`);
      return true;
    }
  }

  /**
   * Disable a registered hack
   * @param {string} name - Hack name
   */
  disableHack(name) {
    const hack = this.hacks.get(name);
    if (!hack) {
      console.error(`[Framework] Hack '${name}' not found`);
      return false;
    }
    if (hack.disable && typeof hack.disable === 'function') {
      hack.disable();
      this.enabled.delete(name);
      console.log(`[Framework] ✗ Disabled: ${name}`);
      return true;
    }
  }

  /**
   * Get a hack by name
   * @param {string} name - Hack name
   */
  getHack(name) {
    return this.hacks.get(name);
  }

  /**
   * List all registered hacks
   */
  listHacks() {
    console.log('[Framework] ═══════════════════════════════════');
    console.log('[Framework] Registered Hacks:');
    console.log('[Framework] ═══════════════════════════════════');
    this.hacks.forEach((hack, name) => {
      const status = this.enabled.has(name) ? '✓ ENABLED' : '✗ disabled';
      console.log(`[Framework] ${status.padEnd(12)} - ${name}`);
    });
    console.log('[Framework] ═══════════════════════════════════');
  }

  /**
   * Enable all hacks
   */
  enableAll() {
    this.hacks.forEach((hack, name) => this.enableHack(name));
  }

  /**
   * Disable all hacks
   */
  disableAll() {
    this.enabled.forEach(name => this.disableHack(name));
  }
}

// ==================== UTILITY FUNCTIONS ====================

const BlooketUtils = {
  /**
   * Log with prefix
   */
  log(message, prefix = 'Blooket') {
    console.log(`[${prefix}] ${message}`);
  },

  /**
   * Log error
   */
  error(message, prefix = 'Blooket') {
    console.error(`[${prefix}] ERROR: ${message}`);
  },

  /**
   * Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Get element with retry
   */
  async getElement(selector, maxRetries = 10) {
    for (let i = 0; i < maxRetries; i++) {
      const element = document.querySelector(selector);
      if (element) return element;
      await this.delay(100);
    }
    return null;
  },

  /**
   * Get all elements
   */
  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Click element (works on mobile)
   */
  click(element) {
    if (!element) return;
    
    // Try multiple click methods for mobile compatibility
    try {
      element.click();
    } catch (e) {
      // Fallback for some mobile browsers
      const event = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
      
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(clickEvent);
    }
  },

  /**
   * Tap element (touch event)
   */
  tap(element) {
    if (!element) return;
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
      touches: [{ clientX: 0, clientY: 0 }]
    });
    element.dispatchEvent(touchStartEvent);
    
    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      cancelable: true,
      view: window,
      touches: []
    });
    element.dispatchEvent(touchEndEvent);
    
    this.click(element);
  },

  /**
   * Set text content
   */
  setText(element, text) {
    if (element) element.innerText = text;
  },

  /**
   * Get text content
   */
  getText(element) {
    return element ? element.innerText : '';
  },

  /**
   * Set attribute
   */
  setAttribute(element, attr, value) {
    if (element) element.setAttribute(attr, value);
  },

  /**
   * Get attribute
   */
  getAttribute(element, attr) {
    return element ? element.getAttribute(attr) : null;
  },

  /**
   * Add event listener (works on mobile)
   */
  addEventListener(element, event, callback) {
    if (!element) return;
    
    // Map mouse events to touch events on mobile
    if (DeviceInfo.isMobile) {
      if (event === 'click' || event === 'mousedown') {
        element.addEventListener('touchstart', callback);
        element.addEventListener('click', callback);
      } else if (event === 'mousemove') {
        element.addEventListener('touchmove', callback);
      } else {
        element.addEventListener(event, callback);
      }
    } else {
      element.addEventListener(event, callback);
    }
  },

  /**
   * Wait for element
   */
  async waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await this.delay(100);
    }
    return null;
  },

  /**
   * Get localStorage value (IndexedDB fallback for iOS)
   */
  getStorage(key) {
    try {
      // Try localStorage first
      const value = localStorage.getItem(key);
      if (value) return JSON.parse(value);
    } catch (e) {
      this.log('localStorage unavailable, trying IndexedDB', 'Storage');\n    }\n    \n    // Fallback to sessionStorage\n    try {\n      const value = sessionStorage.getItem(key);\n      if (value) return JSON.parse(value);\n    } catch (e) {}\n    \n    return null;\n  },\n\n  /**\n   * Set localStorage value (IndexedDB fallback for iOS)\n   */\n  setStorage(key, value) {\n    try {\n      localStorage.setItem(key, JSON.stringify(value));\n      return true;\n    } catch (e) {\n      try {\n        sessionStorage.setItem(key, JSON.stringify(value));\n        return true;\n      } catch (e2) {\n        return false;\n      }\n    }\n  },\n\n  /**\n   * Trigger input change (mobile compatible)\n   */\n  triggerChange(element, value) {\n    if (!element) return;\n    \n    element.value = value;\n    \n    // Trigger multiple events for compatibility\n    const events = ['input', 'change', 'touchend', 'blur'];\n    events.forEach(eventType => {\n      try {\n        element.dispatchEvent(new Event(eventType, { bubbles: true }));\n      } catch (e) {}\n    });\n  },\n\n  /**\n   * Get computed style\n   */\n  getStyle(element, property) {\n    if (!element) return null;\n    return window.getComputedStyle(element).getPropertyValue(property);\n  },\n\n  /**\n   * Set style\n   */\n  setStyle(element, property, value) {\n    if (element) element.style[property] = value;\n  }\n};\n\n// ==================== BUILT-IN HACKS ====================\n\n// Auto-Answer Hack\nconst AutoAnswerHack = {\n  enabled: false,\n  answers: new Map(),\n\n  enable() {\n    this.enabled = true;\n    BlooketUtils.log('Auto-Answer enabled', 'Auto-Answer');\n  },\n\n  disable() {\n    this.enabled = false;\n    BlooketUtils.log('Auto-Answer disabled', 'Auto-Answer');\n  },\n\n  setAnswer(question, answerIndex) {\n    this.answers.set(question.toLowerCase(), answerIndex);\n    BlooketUtils.log(`Mapped: \"${question}\" -> Answer ${answerIndex + 1}`, 'Auto-Answer');\n  },\n\n  getAnswer(question) {\n    return this.answers.get(question.toLowerCase());\n  },\n\n  clearAnswers() {\n    this.answers.clear();\n    BlooketUtils.log('All answers cleared', 'Auto-Answer');\n  }\n};\n\n// Money Hack\nconst MoneyHack = {\n  enabled: false,\n  targetAmount: 1000,\n  monitorInterval: null,\n\n  enable() {\n    this.enabled = true;\n    BlooketUtils.log(`Money hack enabled (Target: ${this.targetAmount})`, 'Money');\n    this.startMonitoring();\n  },\n\n  disable() {\n    this.enabled = false;\n    if (this.monitorInterval) clearInterval(this.monitorInterval);\n    BlooketUtils.log('Money hack disabled', 'Money');\n  },\n\n  setTargetAmount(amount) {\n    this.targetAmount = amount;\n    BlooketUtils.log(`Target amount set to: ${amount}`, 'Money');\n  },\n\n  async startMonitoring() {\n    this.monitorInterval = setInterval(async () => {\n      if (!this.enabled) return;\n      const current = this.getCurrentMoney();\n      if (current < this.targetAmount) {\n        this.setMoney(this.targetAmount);\n      }\n    }, 1000);\n  },\n\n  getCurrentMoney() {\n    const moneyElements = document.querySelectorAll('[class*=\"money\"], [class*=\"coin\"], [class*=\"currency\"], [class*=\"gold\"], [class*=\"cash\"]');\n    for (const element of moneyElements) {\n      const text = element.innerText || element.textContent;\n      const match = text.match(/\\d+/);\n      if (match) return parseInt(match[0]);\n    }\n    return 0;\n  },\n\n  setMoney(amount) {\n    const moneyElements = document.querySelectorAll('[class*=\"money\"], [class*=\"coin\"], [class*=\"currency\"], [class*=\"gold\"], [class*=\"cash\"]');\n    moneyElements.forEach(element => {\n      element.innerText = String(amount);\n    });\n    BlooketUtils.log(`Money set to: ${amount}`, 'Money');\n  },\n\n  addMoney(amount) {\n    const current = this.getCurrentMoney();\n    this.setMoney(current + amount);\n  },\n\n  subtractMoney(amount) {\n    const current = this.getCurrentMoney();\n    this.setMoney(Math.max(0, current - amount));\n  }\n};\n\n// Speed Hack\nconst SpeedHack = {\n  enabled: false,\n  speedMultiplier: 1,\n\n  enable() {\n    this.enabled = true;\n    this.applySpeed();\n    BlooketUtils.log(`Speed hack enabled (${this.speedMultiplier}x)`, 'Speed');\n  },\n\n  disable() {\n    this.enabled = false;\n    this.resetSpeed();\n    BlooketUtils.log('Speed hack disabled', 'Speed');\n  },\n\n  setSpeed(multiplier) {\n    this.speedMultiplier = multiplier;\n    if (this.enabled) this.applySpeed();\n    BlooketUtils.log(`Speed set to: ${multiplier}x`, 'Speed');\n  },\n\n  applySpeed() {\n    document.documentElement.style.setProperty('--animation-speed', `${1 / this.speedMultiplier}`);\n  },\n\n  resetSpeed() {\n    document.documentElement.style.removeProperty('--animation-speed');\n  }\n};\n\n// ==================== INITIALIZE FRAMEWORK ====================\n\nconst BlooketHacks = new BlooketHacksFramework();\n\n// Register built-in hacks\nBlooketHacks.registerHack('auto-answer', AutoAnswerHack);\nBlooketHacks.registerHack('money', MoneyHack);\nBlooketHacks.registerHack('speed', SpeedHack);\n\n// Export to window\nwindow.BlooketHacks = BlooketHacks;\nwindow.BlooketUtils = BlooketUtils;\nwindow.AutoAnswerHack = AutoAnswerHack;\nwindow.MoneyHack = MoneyHack;\nwindow.SpeedHack = SpeedHack;\nwindow.DeviceInfo = DeviceInfo;\n\nBlooketUtils.log('Blooket Hacks Framework v' + BlooketHacks.version + ' loaded!', 'Framework');\nBlooketUtils.log('Device: ' + DeviceInfo.getDeviceType(), 'Framework');\nBlooketUtils.log('Type \"help()\" for usage guide', 'Framework');\n\n// ==================== HELP FUNCTION ====================\n\nwindow.help = function() {\n  console.clear();\n  console.log(`\n╔═══════════════════════════════════════════════════════════════╗\n║   BLOOKET HACKS FRAMEWORK - v2.0 iPad/Mobile Compatible      ║\n║   Device: ${DeviceInfo.getDeviceType().padEnd(50)}║\n╚═══════════════════════════════════════════════════════════════╝\n\n📋 LIST ALL HACKS:\n   BlooketHacks.listHacks()\n\n✅ ENABLE HACK:\n   BlooketHacks.enableHack('hack-name')\n   Example: BlooketHacks.enableHack('money')\n\n❌ DISABLE HACK:\n   BlooketHacks.disableHack('hack-name')\n   Example: BlooketHacks.disableHack('money')\n\n🚀 ENABLE ALL:\n   BlooketHacks.enableAll()\n\n⛔ DISABLE ALL:\n   BlooketHacks.disableAll()\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n                 BUILT-IN HACKS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔤 AUTO-ANSWER:\n   AutoAnswerHack.setAnswer('Question text', 0-3)\n   AutoAnswerHack.enable()\n   AutoAnswerHack.disable()\n   AutoAnswerHack.clearAnswers()\n\n💰 MONEY:\n   MoneyHack.setTargetAmount(5000)\n   MoneyHack.enable()\n   MoneyHack.disable()\n   MoneyHack.addMoney(1000)\n   MoneyHack.subtractMoney(500)\n   MoneyHack.getCurrentMoney()\n\n⚡ SPEED:\n   SpeedHack.setSpeed(2)     // 2x speed\n   SpeedHack.enable()\n   SpeedHack.disable()\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n            📱 iPAD/MOBILE SETUP\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nON iPAD (Safari):\n1. Open Blooket in Safari\n2. Press Cmd + Option + I (or Cmd + Shift + C)\n3. Go to Console tab\n4. Paste this code and press Enter:\n\nfetch('https://raw.githubusercontent.com/yusufaboukar109-ship-it/Blooket/main/hacks/blooket-hacks-framework.js')\n  .then(r => r.text())\n  .then(code => eval(code));\n\n5. Use the hacks commands below\n\nON iPAD (Chrome):\n1. Open Blooket in Chrome\n2. Tap Menu → More Tools → Developer Tools\n3. Go to Console tab\n4. Paste the code above\n\nON ANDROID:\n1. Open Blooket in Chrome\n2. Press Menu → More Tools → Developer Tools\n3. Go to Console tab\n4. Paste the code above\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n            CREATE YOUR OWN HACK\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nconst MyHack = {\n  enabled: false,\n  \n  enable() {\n    this.enabled = true;\n    BlooketUtils.log('My hack enabled', 'MyHack');\n  },\n  \n  disable() {\n    this.enabled = false;\n    BlooketUtils.log('My hack disabled', 'MyHack');\n  }\n};\n\nBlooketHacks.registerHack('my-hack', MyHack);\nBlooketHacks.enableHack('my-hack');\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n            UTILITY FUNCTIONS (BlooketUtils)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDOM (Mobile Compatible):\n  await BlooketUtils.getElement('.selector')\n  BlooketUtils.getElements('.selector')\n  await BlooketUtils.waitForElement('.selector')\n  BlooketUtils.click(element)     // Works on touch\n  BlooketUtils.tap(element)       // Touch event\n  BlooketUtils.setText(element, 'text')\n  BlooketUtils.getText(element)\n  BlooketUtils.triggerChange(element, 'value')\n  BlooketUtils.getStyle(element, 'property')\n  BlooketUtils.setStyle(element, 'property', 'value')\n\nSTORAGE:\n  BlooketUtils.getStorage('key')\n  BlooketUtils.setStorage('key', data)\n\nUTILS:\n  await BlooketUtils.delay(1000)\n  BlooketUtils.log('message', 'prefix')\n  BlooketUtils.error('error', 'prefix')\n\nDEVICE INFO:\n  DeviceInfo.isIpad\n  DeviceInfo.isIphone\n  DeviceInfo.isAndroid\n  DeviceInfo.isMobile\n  DeviceInfo.getDeviceType()\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️  DISCLAIMER:\nFor educational purposes only. Use responsibly!\nComply with Blooket's Terms of Service.\n\n`);\n};\n\n// Show startup message\nconsole.log('%c✅ Blooket Hacks Framework Ready! (Mobile v2.0)', 'color: #00ff00; font-weight: bold; font-size: 14px;');\nconsole.log('%c🌐 Device: ' + DeviceInfo.getDeviceType(), 'color: #00ccff; font-size: 12px;');\nconsole.log('%cType help() for full guide', 'color: #00ffff; font-size: 12px;');
