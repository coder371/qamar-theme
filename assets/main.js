/* Qamar Theme - Main JavaScript */

(function () {
  'use strict';

  // ===== Config =====
  const config = window.__QUMRA_CONFIG__ || {};
  const QumraConfig = {
    api: {
      cart: {
        get: '/ajax/cart',
        add: '/ajax/cart/add',
        change: '/ajax/cart/change',
        remove: '/ajax/cart/remove',
        clear: '/ajax/cart/clear'
      },
      product: {
        get: '/ajax/product',
        variant: '/ajax/product/resolve-variant-by-options'
      }
    },
    defaults: {
      currency: config.currency || 'SAR',
      currencySymbol: config.currencySymbol || 'ر.س',
      language: config.language || 'ar',
      exchangeRate: config.exchangeRate || 1
    },
    selectors: {
      cart: {
        count: '[data-cart-count]',
        itemsCount: '[data-cart-items-count]',
        total: '[data-cart-total]',
        container: '[data-cart-container]'
      }
    },
    messages: {
      addedToCart: (config.messages && config.messages.addedToCart) || 'Added to cart',
      addError: (config.messages && config.messages.addError) || 'Error, please try again'
    }
  };

  // ===== EventBus =====
  const EventBus = {
    _listeners: {},
    on(event, callback) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
      return () => {
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
      };
    },
    emit(event, data) {
      (this._listeners[event] || []).forEach(cb => cb(data));
      window.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
  };

  // ===== ApiClient =====
  const ApiClient = {
    async get(url, params) {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(url + query);
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      return res.json();
    },
    async post(url, body) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      return res.json();
    }
  };

  // ===== Utils =====
  const _moneyFormat = (function() {
    var sample = (config.moneyFormatSample || '').trim();
    var symbol = config.currencySymbol || '';
    if (!sample || !symbol) return { useComma: true, space: ' ' };
    var idx = sample.indexOf(symbol);
    var hasSpace = idx > 0 && sample[idx - 1] === ' ';
    var numPart = sample.substring(0, hasSpace ? idx - 1 : idx);
    return { useComma: numPart.indexOf(',') !== -1, space: hasSpace ? ' ' : '' };
  })();

  const Utils = {
    formatMoney(amount) {
      if (amount == null) return '';
      var num = Number(amount);
      var formatted;
      if (_moneyFormat.useComma) {
        formatted = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        formatted = num.toFixed(2);
      }
      return formatted + _moneyFormat.space + QumraConfig.defaults.currencySymbol;
    },

    calcDiscount(price, compareAtPrice) {
      if (!compareAtPrice || compareAtPrice <= price) return 0;
      return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    },

    debounce(fn, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    throttle(fn, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }
  };

  // ===== Toast =====
  const Toast = {
    _show(message, type, duration) {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'toast toast-' + type;
      el.textContent = message;
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => el.remove(), 300);
      }, duration || 3000);
    },
    success(msg, duration) { this._show(msg, 'success', duration); },
    error(msg, duration) { this._show(msg, 'error', duration); },
    warning(msg, duration) { this._show(msg, 'warning', duration); },
    info(msg, duration) { this._show(msg, 'info', duration); }
  };

  // ===== Helper: Update DOM selectors =====
  function updateSelectors(selectors, values) {
    Object.entries(selectors).forEach(([key, selector]) => {
      if (typeof selector === 'string' && values[key] !== undefined) {
        document.querySelectorAll(selector).forEach(el => {
          el.textContent = values[key];
        });
      }
    });
  }

  // ===== CartManager =====
  const CartManager = {
    async get() {
      return ApiClient.get(QumraConfig.api.cart.get);
    },

    async add(productId, quantity, options) {
      const body = { productId, quantity: quantity || 1 };
      if (Array.isArray(options) && options.length) {
        body.options = options;
      } else if (options) {
        body.variantId = options;
      }

      try {
        const data = await ApiClient.post(QumraConfig.api.cart.add, body);

        if (data.success === false) {
          throw new Error(data.message || 'Failed');
        }

        this._updateUI(data);
        this._refreshDrawer(data);
        EventBus.emit('cart:updated', data);
        EventBus.emit('cart:item-added', { productId, data });

        Toast.success(QumraConfig.messages.addedToCart);

        // Open cart drawer after short delay
        setTimeout(() => { ModalController.open('cart'); }, 300);

        return data;
      } catch (error) {
        Toast.error(QumraConfig.messages.addError);
        throw error;
      }
    },

    async update(itemId, quantity) {
      const data = await ApiClient.post(QumraConfig.api.cart.change, { itemId, quantity });
      if (data.success !== false) {
        this._updateUI(data);
        this._refreshDrawer(data);
        EventBus.emit('cart:updated', data);
      }
      return data;
    },

    async remove(itemId) {
      const itemEl = document.querySelector('[data-cart-item="' + itemId + '"]');
      if (itemEl) itemEl.classList.add('removing');
      const data = await ApiClient.post(QumraConfig.api.cart.remove, { itemId });
      if (data.success !== false) {
        this._updateUI(data);
        EventBus.emit('cart:updated', data);
        setTimeout(() => {
          if (itemEl) itemEl.remove();
          this._refreshDrawer(data);
        }, 300);
      }
      return data;
    },

    async clear() {
      const data = await ApiClient.post(QumraConfig.api.cart.clear, {});
      if (data.success !== false) {
        this._updateUI(data);
        this._refreshDrawer(data);
        EventBus.emit('cart:updated', data);
      }
      return data;
    },

    _updateUI(data) {
      updateSelectors(QumraConfig.selectors.cart, {
        count: data.totalQuantity || 0,
        itemsCount: (data.items || []).length,
        total: Utils.formatMoney(data.totalPrice)
      });
    },

    _refreshDrawer(data) {
      var container = document.querySelector('[data-cart-container]');
      var footer = document.querySelector('[data-cart-footer]');
      var empty = document.querySelector('[data-cart-empty]');
      var countBar = document.querySelector('[data-cart-count-bar]');
      var items = data.items || [];

      if (items.length > 0) {
        var itemIds = items.map(function(i) { return i._id; });

        // Update item totals
        items.forEach(function (item) {
          document.querySelectorAll('[data-item-total="' + item._id + '"]').forEach(function(el) {
            el.textContent = Utils.formatMoney(item.totalPrice);
          });
        });

        // Add new items that don't exist in DOM yet
        if (container) {
          var listEl = container.querySelector('.space-y-4');
          if (listEl) {
            items.forEach(function(item) {
              if (!container.querySelector('[data-cart-item="' + item._id + '"]')) {
                var html = CartManager._buildItemHTML(item);
                var temp = document.createElement('div');
                temp.innerHTML = html;
                while (temp.firstChild) {
                  var node = temp.firstChild;
                  listEl.appendChild(node);
                  if (window.Alpine && node.nodeType === 1) {
                    Alpine.initTree(node);
                  }
                }
              }
            });
          }
        }

        // Remove items from DOM that no longer exist in cart
        if (container) {
          container.querySelectorAll('[data-cart-item]').forEach(function (el) {
            var id = el.getAttribute('data-cart-item');
            if (itemIds.indexOf(id) === -1) {
              el.style.transition = 'all 0.3s ease';
              el.style.opacity = '0';
              el.style.transform = 'scale(0.95)';
              setTimeout(function () { el.remove(); }, 300);
            }
          });
          container.style.display = '';
        }

        // Update footer total
        if (footer) {
          footer.style.display = '';
          var totalEl = footer.querySelector('[data-cart-total]');
          if (totalEl) totalEl.textContent = Utils.formatMoney(data.totalPrice);
        }

        // Show count bar
        if (countBar) countBar.style.display = '';

        // Hide empty state
        if (empty) empty.style.display = 'none';
      } else {
        // No items - show empty state
        if (container) container.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (countBar) countBar.style.display = 'none';
        if (empty) empty.style.display = '';
      }
    },

    _buildItemHTML(item) {
      var id = item._id;
      var slug = (item.productData && item.productData.slug) || '';
      var title = (item.productData && item.productData.title) || '';
      var imageUrl = (item.productData && item.productData.image && item.productData.image.fileUrl) || '';
      var totalPrice = Utils.formatMoney(item.totalPrice);

      var imageHtml = imageUrl
        ? '<div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">' +
          '<img src="' + imageUrl + '" alt="' + title + '" class="w-full h-full object-cover" loading="lazy"></div>'
        : '<div class="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">' +
          '<svg class="w-7 h-7 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>';

      var variantHtml = '';
      if (item.variantData && item.variantData.options && item.variantData.options.length) {
        variantHtml = '<div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1">';
        item.variantData.options.forEach(function(opt) {
          var optName = (opt.option && opt.option.name) || '';
          var optType = (opt.option && opt.option.type) || 'text';
          var colorDot = optType === 'color'
            ? '<span class="inline-block w-3 h-3 rounded-full border border-gray-200 align-middle" style="background-color: ' + (opt.value || '#fff') + '"></span>'
            : '';
          variantHtml += '<span class="text-[11px] text-gray-400 flex items-center gap-1">' +
            optName + ': ' + colorDot +
            '<span class="text-gray-500">' + opt.label + '</span></span>';
        });
        variantHtml += '</div>';
      }

      return '<div class="transition-all duration-300" data-cart-item="' + id + '" ' +
        'x-show="activeItems.includes(\'' + id + '\')" ' +
        'x-transition:enter="transition ease-out duration-300" ' +
        'x-transition:enter-start="opacity-0 translate-y-2" ' +
        'x-transition:enter-end="opacity-100 translate-y-0" ' +
        'x-transition:leave="transition ease-in duration-200" ' +
        'x-transition:leave-start="opacity-100" ' +
        'x-transition:leave-end="opacity-0" ' +
        ':class="{ \'opacity-20 scale-95 pointer-events-none\': removingId === \'' + id + '\' }">' +
        '<div class="flex gap-3.5">' +
          '<a href="/product/' + slug + '" @click="$store.modal.close()" class="shrink-0">' + imageHtml + '</a>' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex items-start justify-between gap-2">' +
              '<a href="/product/' + slug + '" @click="$store.modal.close()" class="text-[13px] font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2 leading-snug">' + title + '</a>' +
              '<button @click="removeItem(\'' + id + '\')" class="shrink-0 mt-0.5 text-gray-300 hover:text-red-400 transition-colors p-0.5">' +
                '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>' +
            variantHtml +
            '<div class="flex items-center justify-between mt-2.5">' +
              '<div class="inline-flex items-center bg-gray-50 rounded-full h-8">' +
                '<button @click="decrement(\'' + id + '\')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white transition-all">' +
                  '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>' +
                '</button>' +
                '<span class="w-7 text-center text-xs font-bold text-gray-800">' +
                  '<span x-show="updating !== \'' + id + '\'" x-text="quantities[\'' + id + '\']">' + item.quantity + '</span>' +
                  '<svg x-show="updating === \'' + id + '\'" x-cloak class="w-3.5 h-3.5 animate-spin mx-auto text-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>' +
                '</span>' +
                '<button @click="increment(\'' + id + '\')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white transition-all">' +
                  '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>' +
                '</button>' +
              '</div>' +
              '<div class="text-end">' +
                '<span class="text-sm font-bold text-gray-900 transition-all" data-item-total="' + id + '" :class="{ \'animate-pulse text-primary\': updating === \'' + id + '\' }">' + totalPrice + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  };

  // ===== WishlistManager =====
  const WishlistManager = {
    async add(productId) {
      const data = await ApiClient.post('/ajax/wishlist/add', { productId });
      this._emit(data);
      return data;
    },

    async remove(productId) {
      const data = await ApiClient.post('/ajax/wishlist/remove', { productId });
      this._emit(data);
      return data;
    },

    async toggle(productId, isInWishlist) {
      return isInWishlist ? this.remove(productId) : this.add(productId);
    },

    _emit(data) {
      document.querySelectorAll('[data-wishlist-count]').forEach(el => {
        el.textContent = data.count || 0;
      });
      EventBus.emit('wishlist:updated', data);
    }
  };

  // ===== ProductManager =====
  const ProductManager = {
    async get(handle) {
      return ApiClient.get(QumraConfig.api.product.get, { handle });
    },

    async getVariant(productId, selectedOptions, quantity) {
      return ApiClient.post(QumraConfig.api.product.variant, {
        productId,
        options: selectedOptions,
        quantity: quantity || 1
      });
    },

    calculatePrice(variant, quantity) {
      return {
        price: variant.price * (quantity || 1),
        compareAtPrice: (variant.compareAtPrice || 0) * (quantity || 1)
      };
    }
  };

  // ===== ModalController =====
  const ModalController = {
    current: null,

    open(name) {
      this.current = name;
      document.body.style.overflow = 'hidden';
      EventBus.emit('modal:open', { name });
    },

    close() {
      const name = this.current;
      this.current = null;
      document.body.style.overflow = '';
      EventBus.emit('modal:close', { name });
    },

    toggle(name) {
      if (this.current === name) {
        this.close();
      } else {
        this.close();
        this.open(name);
      }
    }
  };

  // ===== Qumra Namespace =====
  const Qumra = {
    config: QumraConfig,
    events: EventBus,
    api: ApiClient,
    cart: CartManager,
    wishlist: WishlistManager,
    product: ProductManager,
    modal: ModalController,
    utils: Utils,
    toast: Toast
  };

  // ===== Global Exports =====
  window.Qumra = Qumra;

  // Backward compatibility
  window.CartManager = CartManager;
  window.WishlistManager = WishlistManager;
  window.ProductManager = ProductManager;
  window.EventBus = EventBus;
  window.formatMoney = Utils.formatMoney;
  window.toggleModal = function (name) { ModalController.toggle(name); };

  // ===== Alpine.js Stores + Components =====
  document.addEventListener('alpine:init', () => {
    // --- Stores ---
    Alpine.store('modal', {
      current: null,
      open(name) { Qumra.modal.open(name); this.current = name; },
      close() { Qumra.modal.close(); this.current = null; },
      toggle(name) {
        if (this.current === name) { this.close(); }
        else { this.close(); this.open(name); }
      }
    });

    Alpine.store('wishlist', {
      ids: (config.wishlistIds || []),
      has(productId) { return this.ids.indexOf(productId) !== -1; },
      update(data) {
        if (data && data.products) {
          this.ids = data.products.map(p => p._id || p);
        }
      }
    });

    Alpine.store('cart', {
      totalQuantity: 0,
      totalPrice: 0,
      items: [],
      update(data) {
        this.totalQuantity = data.totalQuantity || 0;
        this.totalPrice = data.totalPrice || 0;
        this.items = data.items || [];
      }
    });

    // --- Cart Interaction Component ---
    Alpine.data('cartInteraction', (config) => ({
      quantities: {},
      updateTimers: {},
      updating: null,
      removingId: null,
      confirmRemoveId: null,
      activeItems: [],

      init() {
        (config.items || []).forEach(i => {
          this.quantities[i.id] = i.qty;
          this.activeItems.push(i.id);
        });

        window.addEventListener('cart:updated', (e) => {
          this.updating = null;
          this.removingId = null;
          this.confirmRemoveId = null;
          if (e.detail && e.detail.items) {
            this.activeItems = e.detail.items.map(i => i._id);
            e.detail.items.forEach(item => {
              this.quantities[item._id] = item.quantity;
            });
          } else {
            this.activeItems = [];
          }
        });
      },

      increment(id) {
        this.quantities[id] = (this.quantities[id] || 1) + 1;
        this._scheduleUpdate(id);
      },

      decrement(id) {
        var c = this.quantities[id] || 1;
        if (c <= 1) {
          if (config.confirmRemove) {
            this.confirmRemoveId = id;
          } else {
            this.removeItem(id);
          }
          return;
        }
        this.quantities[id] = c - 1;
        this._scheduleUpdate(id);
      },

      _scheduleUpdate(id) {
        if (this.updateTimers[id]) clearTimeout(this.updateTimers[id]);
        this.updateTimers[id] = setTimeout(() => {
          this.updating = id;
          delete this.updateTimers[id];
          Qumra.cart.update(id, this.quantities[id]);
        }, 500);
      },

      removeItem(id) {
        this.removingId = id;
        this.confirmRemoveId = null;
        Qumra.cart.remove(id);
      }
    }));

    // --- Product Card Component ---
    Alpine.data('productCard', (productId) => ({
      productId: productId,
      cartLoading: false,
      cartSuccess: false,
      wishlistLoading: false,

      get inWishlist() {
        return Alpine.store('wishlist').has(this.productId);
      },

      async addToCart() {
        if (this.cartLoading) return;
        this.cartLoading = true;
        try {
          await Qumra.cart.add(this.productId);
          this.cartSuccess = true;
          setTimeout(() => { this.cartSuccess = false; }, 2000);
        } catch (e) {
          // Error already handled in CartManager
        } finally {
          this.cartLoading = false;
        }
      },

      async toggleWishlist() {
        if (this.wishlistLoading) return;
        this.wishlistLoading = true;
        try {
          await Qumra.wishlist.toggle(this.productId, this.inWishlist);
        } catch (e) {
          // silent
        } finally {
          this.wishlistLoading = false;
        }
      }
    }));
  });

  // ===== Sync Alpine Stores with Events =====
  EventBus.on('cart:updated', (data) => {
    if (window.Alpine && Alpine.store('cart')) {
      Alpine.store('cart').update(data);
    }
  });

  EventBus.on('wishlist:updated', (data) => {
    if (window.Alpine && Alpine.store('wishlist')) {
      Alpine.store('wishlist').update(data);
    }
  });

  EventBus.on('modal:open', ({ name }) => {
    if (window.Alpine && Alpine.store('modal')) {
      Alpine.store('modal').current = name;
    }
  });

  EventBus.on('modal:close', () => {
    if (window.Alpine && Alpine.store('modal')) {
      Alpine.store('modal').current = null;
    }
  });

})();
