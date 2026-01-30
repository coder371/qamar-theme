/**
 * Qamar Theme - Main JavaScript
 * Scalable E-commerce Theme Architecture
 * @version 2.0.0
 */

// ============================================
// Configuration
// ============================================

const QumraConfig = {
  // API Endpoints
  api: {
    cart: {
      get: '/ajax/cart',
      add: '/ajax/cart/add',
      change: '/ajax/cart/change',
      remove: '/ajax/cart/remove',
      clear: '/ajax/cart/clear'
    },
    wishlist: {
      add: '/ajax/wishlist/add',
      remove: '/ajax/wishlist/remove',
      clear: '/ajax/wishlist/clear'
    },
    search: {
      products: '/ajax/search',
      suggest: '/ajax/search/suggest'
    },
    product: {
      get: '/ajax/product',
      variant: '/ajax/product/resolve-variant-by-options'
    }
  },

  // Default Settings (uses QumraLocalization from layout if available)
  defaults: {
    get currency() { return window.QumraLocalization?.currencyCode || 'SAR'; },
    get currencySymbol() { return window.QumraLocalization?.currencySymbol || 'ر.س'; },
    get language() { return window.QumraLocalization?.language || 'ar'; },
    toastDuration: 3000,
    debounceDelay: 300,
    animationDuration: 300
  },

  // Messages (Arabic)
  messages: {
    cart: {
      added: 'تمت الإضافة إلى السلة',
      removed: 'تم الحذف من السلة',
      updated: 'تم تحديث السلة',
      cleared: 'تم تفريغ السلة',
      confirmClear: 'هل تريد تفريغ السلة بالكامل؟'
    },
    wishlist: {
      added: 'تمت الإضافة إلى المفضلة',
      removed: 'تم الحذف من المفضلة',
      cleared: 'تم مسح المفضلة',
      confirmClear: 'هل تريد مسح المفضلة بالكامل؟'
    },
    errors: {
      general: 'حدث خطأ',
      network: 'خطأ في الاتصال',
      validation: 'بيانات غير صحيحة'
    }
  },

  // CSS Classes
  classes: {
    loading: 'loading',
    active: 'active',
    removing: 'removing',
    hidden: 'hidden'
  },

  // Data Attributes
  selectors: {
    cart: {
      count: '[data-cart-count]',
      itemsCount: '[data-cart-items-count]',
      total: '[data-cart-total]',
      item: '[data-cart-item]',
      itemQty: '[data-item-qty]',
      itemTotal: '[data-item-total]',
      container: '[data-cart-container]'
    },
    wishlist: {
      count: '[data-wishlist-count]',
      button: '[data-wishlist-btn]'
    }
  }
};

// ============================================
// Event Bus - Central Event System
// ============================================

const EventBus = {
  _events: {},

  /**
   * Subscribe to an event
   */
  on(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
    return () => this.off(event, callback);
  },

  /**
   * Unsubscribe from an event
   */
  off(event, callback) {
    if (!this._events[event]) return;
    this._events[event] = this._events[event].filter(cb => cb !== callback);
  },

  /**
   * Emit an event
   */
  emit(event, data) {
    if (!this._events[event]) return;
    this._events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });

    // Also dispatch as DOM event for external listeners
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
};

// ============================================
// API Client - Base HTTP Client
// ============================================

const ApiClient = {
  /**
   * Make a GET request
   */
  async get(url, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const response = await fetch(fullUrl);
      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  },

  /**
   * Make a POST request
   */
  async post(url, data = {}) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  },

  /**
   * Handle response
   */
  async _handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: true,
        message: data.message || QumraConfig.messages.errors.general,
        status: response.status
      };
    }

    return data;
  },

  /**
   * Handle error
   */
  _handleError(error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: true,
      message: QumraConfig.messages.errors.network
    };
  }
};

// ============================================
// Toast Notification System
// ============================================

const Toast = {
  container: null,

  init() {
    if (this.container) return;

    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 flex flex-col gap-2';
      document.body.appendChild(this.container);
    }
  },

  _icons: {
    success: '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    error: '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    warning: '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    info: '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },

  show(message, type = 'info', duration = QumraConfig.defaults.toastDuration) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      ${this._icons[type] || this._icons.info}
      <span class="flex-1">${message}</span>
      <button onclick="this.parentElement.remove()" class="p-1 hover:opacity-70">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.classList.add(QumraConfig.classes.removing);
        setTimeout(() => toast.remove(), QumraConfig.defaults.animationDuration);
      }, duration);
    }

    return toast;
  },

  success(message, duration) { return this.show(message, 'success', duration); },
  error(message, duration) { return this.show(message, 'error', duration); },
  warning(message, duration) { return this.show(message, 'warning', duration); },
  info(message, duration) { return this.show(message, 'info', duration); }
};

// ============================================
// Base Manager Class Pattern
// ============================================

const BaseManager = {
  loading: false,

  /**
   * Create a manager with common functionality
   */
  create(config) {
    return {
      loading: false,
      ...config,

      /**
       * Execute action with loading state
       */
      async _execute(action, options = {}) {
        if (this.loading) return null;

        const {
          loadingElement = null,
          loadingSelector = null,
          showToast = true,
          successMessage = null,
          errorMessage = QumraConfig.messages.errors.general,
          onSuccess = null,
          onError = null
        } = options;

        this.loading = true;
        this._setLoading(loadingElement, loadingSelector, true);

        try {
          const result = await action();

          if (result && result.success !== false) {
            if (showToast && successMessage) {
              Toast.success(successMessage);
            }
            if (onSuccess) onSuccess(result);
          } else {
            if (showToast) {
              Toast.error(result?.message || errorMessage);
            }
            if (onError) onError(result);
          }

          return result;
        } catch (error) {
          console.error('Manager action error:', error);
          if (showToast) Toast.error(errorMessage);
          if (onError) onError(error);
          return null;
        } finally {
          this.loading = false;
          this._setLoading(loadingElement, loadingSelector, false);
        }
      },

      /**
       * Set loading state on element
       */
      _setLoading(element, selector, loading) {
        const el = element || (selector ? document.querySelector(selector) : null);
        if (!el) return;

        if (loading) {
          el.classList.add(QumraConfig.classes.loading);
          if (el.tagName === 'BUTTON') el.disabled = true;
        } else {
          el.classList.remove(QumraConfig.classes.loading);
          if (el.tagName === 'BUTTON') el.disabled = false;
        }
      }
    };
  }
};

// ============================================
// Cart Manager
// ============================================

const CartManager = BaseManager.create({
  /**
   * Get cart data
   */
  async get() {
    const data = await ApiClient.get(QumraConfig.api.cart.get);
    if (data && data.success !== false) {
      this.updateUI(data);
    }
    return data;
  },

  /**
   * Add item to cart
   */
  async add(productId, quantity = 1, variantId = null) {
    return this._execute(
      async () => {
        const body = { productId, quantity };
        if (variantId) body.variantId = variantId;
        return ApiClient.post(QumraConfig.api.cart.add, body);
      },
      {
        loadingSelector: QumraConfig.selectors.cart.container,
        successMessage: QumraConfig.messages.cart.added,
        onSuccess: (data) => {
          this.updateUI(data);
          EventBus.emit('cart:updated', data);
          // Re-render cart items
          this._renderCartItems(data);
          // Open cart sidebar via Alpine
          const appEl = document.body;
          if (appEl._x_dataStack && appEl._x_dataStack[0]) {
            appEl._x_dataStack[0].toggleModal('cart');
          }
        }
      }
    );
  },

  /**
   * Render cart items in sidebar
   */
  _renderCartItems(cart) {
    const cartContainer = document.querySelector('[data-cart-container]');
    if (!cartContainer) return;

    const itemsContainer = cartContainer.querySelector('.flex-1.overflow-y-auto');
    if (!itemsContainer) return;

    if (!cart.items || cart.items.length === 0) {
      // Show empty cart
      itemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center p-8">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">السلة فارغة</h3>
          <p class="text-gray-500 mb-6">لم تقم بإضافة أي منتجات بعد</p>
          <a href="/products" class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
            تصفح المنتجات
          </a>
        </div>
      `;
      // Remove footer
      const footer = cartContainer.querySelector('.border-t.border-gray-200.bg-gray-50');
      if (footer) footer.remove();
      return;
    }

    // Build items HTML
    const itemsHtml = cart.items.map(item => this._buildCartItemHtml(item)).join('');
    itemsContainer.innerHTML = `<div class="p-4 space-y-4">${itemsHtml}</div>`;

    // Ensure footer exists
    let footer = cartContainer.querySelector('.border-t.border-gray-200.bg-gray-50');
    if (!footer) {
      footer = document.createElement('div');
      footer.className = 'border-t border-gray-200 bg-gray-50 p-4 space-y-4';
      footer.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-gray-800">الإجمالي</span>
          <span class="text-xl font-bold text-primary" data-cart-total data-money="${cart.totalPrice}">${this.formatMoney(cart.totalPrice)}</span>
        </div>
        <div class="space-y-3">
          <a href="/checkout" class="flex items-center justify-center gap-2 w-full py-3 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors">
            <span>إتمام الطلب</span>
            <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
          <button onclick="closeModal()" class="flex items-center justify-center w-full py-3 px-6 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors">
            متابعة التسوق
          </button>
        </div>
      `;
      cartContainer.appendChild(footer);
    }
  },

  /**
   * Build HTML for a single cart item
   */
  _buildCartItemHtml(item) {
    const productData = item.productData || {};
    const handle = productData.handle || item.productId;
    const imageUrl = productData.image?.fileUrl || '/placeholder.jpg';
    const title = productData.title || 'منتج';
    const hasComparePrice = item.compareAtPrice && item.compareAtPrice > item.price;
    const showTrash = item.quantity <= 1;

    return `
      <div class="cart-item flex gap-4 p-3 bg-gray-50 rounded-xl relative group" data-cart-item="${item._id}">
        <div class="cart-item-loading absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center z-10 opacity-0 pointer-events-none transition-opacity">
          <svg class="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
        <a href="/products/${handle}" class="flex-shrink-0">
          <img src="${imageUrl}" alt="${title}" class="w-20 h-20 object-cover rounded-lg">
        </a>
        <div class="flex-1 min-w-0">
          <a href="/products/${handle}" class="block">
            <h4 class="font-medium text-gray-800 line-clamp-2 hover:text-primary transition-colors">${title}</h4>
          </a>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-primary font-bold" data-money="${item.price}">${this.formatMoney(item.price)}</span>
            ${hasComparePrice ? `<span class="text-gray-400 text-sm line-through" data-money="${item.compareAtPrice}">${this.formatMoney(item.compareAtPrice)}</span>` : ''}
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center border border-gray-200 rounded-lg bg-white">
              <button onclick="Qumra.cart.decrement('${item._id}')" class="decrement-btn w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors" data-item-decrement="${item._id}" title="تقليل">
                <svg class="w-4 h-4 text-red-500 icon-trash ${showTrash ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <svg class="w-4 h-4 icon-minus ${showTrash ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="w-10 text-center font-medium text-gray-800" data-item-qty="${item._id}">${item.quantity}</span>
              <button onclick="Qumra.cart.increment('${item._id}')" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors" title="زيادة">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
            <span class="text-sm font-medium text-gray-600" data-item-total="${item._id}" data-money="${item.totalPrice}">${this.formatMoney(item.totalPrice)}</span>
          </div>
        </div>
        <button onclick="Qumra.cart.remove('${item._id}')" class="absolute top-2 left-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="حذف">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
  },

  /**
   * Update item quantity
   */
  async update(itemId, quantity) {
    if (quantity < 1) return this.remove(itemId);

    return this._execute(
      () => ApiClient.post(QumraConfig.api.cart.change, { itemId, quantity }),
      {
        loadingSelector: `[data-cart-item="${itemId}"]`,
        showToast: false,
        onSuccess: (data) => {
          this.updateUI(data);
          EventBus.emit('cart:updated', data);
        }
      }
    );
  },

  // Pending quantities and debounce timers
  _pendingQty: {},
  _debounceTimers: {},

  /**
   * Get current quantity from DOM
   */
  _getQuantityFromDOM(itemId) {
    const qtyElement = document.querySelector(`[data-item-qty="${itemId}"]`);
    return qtyElement ? parseInt(qtyElement.textContent.trim(), 10) || 1 : 1;
  },

  /**
   * Update quantity display in DOM (instant feedback)
   */
  _updateQtyDisplay(itemId, qty) {
    const qtyElement = document.querySelector(`[data-item-qty="${itemId}"]`);
    if (qtyElement) qtyElement.textContent = qty;

    // Toggle trash/minus icons
    const decrementBtn = document.querySelector(`[data-item-decrement="${itemId}"]`);
    if (decrementBtn) {
      const trashIcon = decrementBtn.querySelector('.icon-trash');
      const minusIcon = decrementBtn.querySelector('.icon-minus');
      if (trashIcon && minusIcon) {
        if (qty <= 1) {
          trashIcon.classList.remove('hidden');
          minusIcon.classList.add('hidden');
        } else {
          trashIcon.classList.add('hidden');
          minusIcon.classList.remove('hidden');
        }
      }
    }
  },

  /**
   * Debounced update - sends request after delay
   */
  _debouncedUpdate(itemId) {
    clearTimeout(this._debounceTimers[itemId]);
    this._debounceTimers[itemId] = setTimeout(() => {
      const qty = this._pendingQty[itemId];
      if (qty !== undefined) {
        if (qty <= 0) {
          this.remove(itemId);
        } else {
          this.update(itemId, qty);
        }
        delete this._pendingQty[itemId];
      }
    }, 500);
  },

  /**
   * Increment item quantity (debounced)
   */
  increment(itemId) {
    const currentQty = this._pendingQty[itemId] ?? this._getQuantityFromDOM(itemId);
    const newQty = currentQty + 1;
    this._pendingQty[itemId] = newQty;
    this._updateQtyDisplay(itemId, newQty);
    this._debouncedUpdate(itemId);
  },

  /**
   * Decrement item quantity (debounced)
   */
  decrement(itemId) {
    const currentQty = this._pendingQty[itemId] ?? this._getQuantityFromDOM(itemId);
    const newQty = currentQty - 1;
    this._pendingQty[itemId] = newQty;
    this._updateQtyDisplay(itemId, newQty <= 0 ? 0 : newQty);
    this._debouncedUpdate(itemId);
  },

  /**
   * Remove item from cart
   */
  async remove(itemId) {
    return this._execute(
      () => ApiClient.post(QumraConfig.api.cart.remove, { itemId }),
      {
        loadingSelector: `[data-cart-item="${itemId}"]`,
        successMessage: QumraConfig.messages.cart.removed,
        onSuccess: async (data) => {
          // Remove element from DOM with animation
          const itemEl = document.querySelector(`[data-cart-item="${itemId}"]`);
          if (itemEl) {
            itemEl.classList.add(QumraConfig.classes.removing);
            await this._delay(QumraConfig.defaults.animationDuration);
            itemEl.remove();
          }

          this.updateUI(data);
          EventBus.emit('cart:updated', data);

          // Re-render if empty
          if (!data.items || data.items.length === 0) {
            this._renderCartItems(data);
          }
        }
      }
    );
  },

  /**
   * Clear entire cart
   */
  async clear() {
    if (!confirm(QumraConfig.messages.cart.confirmClear)) return null;

    return this._execute(
      () => ApiClient.post(QumraConfig.api.cart.clear),
      {
        loadingSelector: QumraConfig.selectors.cart.container,
        successMessage: QumraConfig.messages.cart.cleared,
        onSuccess: (data) => {
          this.updateUI(data);
          EventBus.emit('cart:updated', data);
          window.location.reload();
        }
      }
    );
  },

  /**
   * Update UI elements
   */
  updateUI(cart) {
    if (!cart) return;

    // Update count badges
    this._updateElements(QumraConfig.selectors.cart.count, cart.totalQuantity || 0);
    this._updateElements(QumraConfig.selectors.cart.itemsCount, cart.items?.length || 0);
    this._updateElements(QumraConfig.selectors.cart.total, this.formatMoney(cart.totalPrice));

    // Update individual items
    if (cart.items) {
      cart.items.forEach(item => {
        this._updateElement(`[data-item-qty="${item._id}"]`, item.quantity);
        this._updateElement(`[data-item-total="${item._id}"]`, this.formatMoney(item.totalPrice));
      });
    }

    // Update Alpine store
    this._updateAlpineStore('cart', {
      items: cart.items || [],
      totalQuantity: cart.totalQuantity || 0,
      totalPrice: cart.totalPrice || 0
    });
  },

  /**
   * Helper: Update single element
   */
  _updateElement(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  },

  /**
   * Helper: Update multiple elements
   */
  _updateElements(selector, value) {
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = value;
    });
  },

  /**
   * Helper: Update Alpine store
   */
  _updateAlpineStore(name, data) {
    if (window.Alpine && Alpine.store(name)) {
      Object.assign(Alpine.store(name), data);
    }
  },

  /**
   * Helper: Delay promise
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Format money (uses localization settings)
   */
  formatMoney(amount) {
    const num = Number(amount) || 0;
    const fixed = num.toFixed(2);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${parts.join('.')} ${QumraConfig.defaults.currencySymbol}`;
  }
});

// ============================================
// Wishlist Manager
// ============================================

const WishlistManager = BaseManager.create({
  /**
   * Add to wishlist
   */
  async add(productId) {
    return this._execute(
      () => ApiClient.post(QumraConfig.api.wishlist.add, { productId }),
      {
        loadingSelector: `[data-wishlist-btn="${productId}"]`,
        successMessage: QumraConfig.messages.wishlist.added,
        onSuccess: (data) => {
          this.updateUI(data);
          EventBus.emit('wishlist:updated', data);
        }
      }
    );
  },

  /**
   * Remove from wishlist
   */
  async remove(productId) {
    return this._execute(
      () => ApiClient.post(QumraConfig.api.wishlist.remove, { productId }),
      {
        loadingSelector: `[data-wishlist-btn="${productId}"]`,
        successMessage: QumraConfig.messages.wishlist.removed,
        onSuccess: (data) => {
          this.updateUI(data);
          EventBus.emit('wishlist:updated', data);
        }
      }
    );
  },

  /**
   * Toggle wishlist status
   */
  async toggle(productId) {
    const btn = document.querySelector(`[data-wishlist-btn="${productId}"]`);
    const isActive = btn?.classList.contains(QumraConfig.classes.active);
    return isActive ? this.remove(productId) : this.add(productId);
  },

  /**
   * Clear wishlist
   */
  async clear() {
    if (!confirm(QumraConfig.messages.wishlist.confirmClear)) return null;

    return this._execute(
      () => ApiClient.post(QumraConfig.api.wishlist.clear),
      {
        successMessage: QumraConfig.messages.wishlist.cleared,
        onSuccess: (data) => {
          this.updateUI(data);
          EventBus.emit('wishlist:updated', data);
          window.location.reload();
        }
      }
    );
  },

  /**
   * Update UI elements
   */
  updateUI(wishlist) {
    if (!wishlist) return;

    // Update count badges
    const countEls = document.querySelectorAll(QumraConfig.selectors.wishlist.count);
    countEls.forEach(el => {
      el.textContent = wishlist.count || 0;
      el.style.display = (wishlist.count > 0) ? '' : 'none';
    });

    // Update buttons
    const productIds = (wishlist.products || []).map(p => p._id);
    document.querySelectorAll(QumraConfig.selectors.wishlist.button).forEach(btn => {
      const productId = btn.dataset.wishlistBtn;
      btn.classList.toggle(QumraConfig.classes.active, productIds.includes(productId));
    });

    // Update Alpine store
    if (window.Alpine && Alpine.store('wishlist')) {
      Object.assign(Alpine.store('wishlist'), {
        items: wishlist.products || [],
        count: wishlist.count || 0
      });
    }
  }
});

// ============================================
// Search Manager
// ============================================

const SearchManager = {
  _debounceTimer: null,

  /**
   * Search products
   */
  async search(query, options = {}) {
    return ApiClient.get(QumraConfig.api.search.products, { q: query, ...options });
  },

  /**
   * Get suggestions with debounce
   */
  suggest(query, callback, delay = QumraConfig.defaults.debounceDelay) {
    clearTimeout(this._debounceTimer);

    if (query.length < 2) {
      callback([]);
      return;
    }

    this._debounceTimer = setTimeout(async () => {
      const data = await this.search(query, { limit: 5 });
      callback(data.products || []);
    }, delay);
  },

  /**
   * Debounce utility
   */
  debounce(func, delay = QumraConfig.defaults.debounceDelay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }
};

// ============================================
// Product Manager
// ============================================

const ProductManager = {
  /**
   * Get product by ID
   */
  async get(productId) {
    return ApiClient.get(`${QumraConfig.api.product.get}/${productId}`);
  },

  /**
   * Get product variant by options
   */
  async getVariant(productId, selectedOptions) {
    return ApiClient.post(QumraConfig.api.product.variant, {
      productId,
      selectedOptions
    });
  }
};

// ============================================
// Modal/Drawer Controller
// ============================================

const ModalController = {
  _current: null,

  open(name) {
    this._current = name;
    document.body.setAttribute('data-modal', name);
    EventBus.emit('modal:open', { name });
  },

  close() {
    const previous = this._current;
    this._current = null;
    document.body.removeAttribute('data-modal');
    EventBus.emit('modal:close', { name: previous });
  },

  toggle(name) {
    if (this._current === name) {
      this.close();
    } else {
      this.open(name);
    }
  },

  get current() {
    return this._current;
  }
};

// Legacy support
function toggleModal(name) { ModalController.toggle(name); }
function closeModal() { ModalController.close(); }

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') ModalController.close();
});

// ============================================
// Utility Functions
// ============================================

const Utils = {
  /**
   * Format money (uses localization settings)
   */
  formatMoney(amount) {
    const num = Number(amount) || 0;
    const fixed = num.toFixed(2);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${parts.join('.')} ${QumraConfig.defaults.currencySymbol}`;
  },

  /**
   * Calculate discount percentage
   */
  calcDiscount(price, comparePrice) {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  },

  /**
   * Debounce function
   */
  debounce(func, delay = QumraConfig.defaults.debounceDelay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Throttle function
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Lazy load images
   */
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => observer.observe(img));
  }
};

// Legacy function support
function formatMoney(amount, currency) { return Utils.formatMoney(amount, currency); }
function calcDiscount(price, comparePrice) { return Utils.calcDiscount(price, comparePrice); }

// ============================================
// Alpine.js Integration
// ============================================

document.addEventListener('alpine:init', () => {
  // Cart Store
  Alpine.store('cart', {
    items: [],
    totalQuantity: 0,
    totalPrice: 0
  });

  // Wishlist Store
  Alpine.store('wishlist', {
    items: [],
    count: 0
  });

  // Modal Store
  Alpine.store('modal', {
    current: null,
    open(name) { ModalController.open(name); },
    close() { ModalController.close(); },
    toggle(name) { ModalController.toggle(name); }
  });

  // Global App Data
  Alpine.data('app', () => ({
    modal: null,
    toggleModal(name) { this.modal = this.modal === name ? null : name; },
    closeModal() { this.modal = null; }
  }));
});

// ============================================
// Initialization
// ============================================

const Qumra = {
  config: QumraConfig,
  events: EventBus,
  api: ApiClient,
  cart: CartManager,
  wishlist: WishlistManager,
  search: SearchManager,
  product: ProductManager,
  modal: ModalController,
  utils: Utils,
  toast: Toast,

  init() {
    Toast.init();
    Utils.lazyLoadImages();
    this.formatAllMoney();
    console.log('Qumra Theme v2.0 initialized');
  },

  /**
   * Format all elements with data-money attribute
   */
  formatAllMoney() {
    document.querySelectorAll('[data-money]').forEach(el => {
      const amount = parseFloat(el.dataset.money) || 0;
      el.textContent = Utils.formatMoney(amount);
    });
  }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => Qumra.init());

// ============================================
// Global Exports
// ============================================

// Namespace export
window.Qumra = Qumra;

// Individual exports (backward compatibility)
window.QumraConfig = QumraConfig;
window.EventBus = EventBus;
window.ApiClient = ApiClient;
window.CartManager = CartManager;
window.WishlistManager = WishlistManager;
window.SearchManager = SearchManager;
window.ProductManager = ProductManager;
window.ModalController = ModalController;
window.Toast = Toast;
window.Utils = Utils;

// Legacy function exports
window.toggleModal = toggleModal;
window.closeModal = closeModal;
window.formatMoney = formatMoney;
window.calcDiscount = calcDiscount;
