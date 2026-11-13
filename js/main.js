/**
 * Goldenrod Apiary – Interactive Webpage Script
 * Handles Cart Management, LocalStorage Persistence, Mobile Drawer,
 * Newsletter Submissions, Toast Notifications, and Checkout.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Product Catalog Data
    // -------------------------------------------------------------------------
    const PRODUCTS = {
        wildflower: {
            id: 'wildflower',
            name: 'Wildflower',
            weight: '340 g jar',
            price: 449,
            bg: '#FFE6A0',
            jarColor: '#E09A12'
        },
        acacia: {
            id: 'acacia',
            name: 'Acacia',
            weight: '340 g jar',
            price: 529,
            bg: '#E4EBCB',
            jarColor: '#F0CD6A'
        },
        forest: {
            id: 'forest',
            name: 'Forest',
            weight: '340 g jar',
            price: 599,
            bg: '#7A4413',
            jarColor: '#2B1405'
        }
    };

    const FREE_SHIPPING_THRESHOLD = 1000;
    const STANDARD_SHIPPING_FEE = 60;
    const STORAGE_KEY = 'goldenrod_apiary_cart_v1';

    // -------------------------------------------------------------------------
    // 2. State & Local Storage
    // -------------------------------------------------------------------------
    let cart = [];

    function loadCart() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            cart = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Could not read cart from localStorage:', e);
            cart = [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.warn('Could not save cart to localStorage:', e);
        }
    }

    // -------------------------------------------------------------------------
    // 3. DOM Elements
    // -------------------------------------------------------------------------
    const cartButton = document.getElementById('cart-btn');
    const cartBadge = document.getElementById('cart-badge');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsWrap = document.getElementById('cart-items-wrap');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartShippingEl = document.getElementById('cart-shipping');
    const cartTotalEl = document.getElementById('cart-total');
    const shippingProgressFill = document.getElementById('shipping-bar-fill');
    const shippingProgressText = document.getElementById('shipping-progress-text');
    const checkoutBtn = document.getElementById('checkout-btn');
    const toastContainer = document.getElementById('toast-container');
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const headerWrap = document.querySelector('.header-wrap');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('em');
    const modalOverlay = document.getElementById('checkout-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // -------------------------------------------------------------------------
    // 4. Cart Operations
    // -------------------------------------------------------------------------
    function addToCart(productId) {
        const product = PRODUCTS[productId];
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                weight: product.weight,
                price: product.price,
                bg: product.bg,
                jarColor: product.jarColor,
                quantity: 1
            });
        }

        saveCart();
        renderCart();
        bumpBadge();
        showToast(`Added ${product.name} Honey to cart! 🍯`);
    }

    function updateQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
            showToast(`Removed from cart`, 'info');
        }

        saveCart();
        renderCart();
        bumpBadge();
    }

    function removeFromCart(productId) {
        const item = cart.find(i => i.id === productId);
        const itemName = item ? item.name : 'Item';
        cart = cart.filter(i => i.id !== productId);
        saveCart();
        renderCart();
        bumpBadge();
        showToast(`Removed ${itemName} Honey from cart`, 'info');
    }

    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
        bumpBadge();
    }

    function bumpBadge() {
        if (!cartBadge) return;
        cartBadge.classList.remove('bump');
        void cartBadge.offsetWidth; // Trigger reflow
        cartBadge.classList.add('bump');
    }

    // -------------------------------------------------------------------------
    // 5. Render Cart UI
    // -------------------------------------------------------------------------
    function renderCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }

        // Subtotal calculation
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
        const shippingFee = (subtotal > 0 && !qualifiesForFreeShipping) ? STANDARD_SHIPPING_FEE : 0;
        const total = subtotal + shippingFee;

        // Shipping Progress
        if (subtotal === 0) {
            shippingProgressText.textContent = `Add ₹${FREE_SHIPPING_THRESHOLD} for free shipping`;
            shippingProgressFill.style.width = '0%';
        } else if (qualifiesForFreeShipping) {
            shippingProgressText.innerHTML = `🎉 You've unlocked <strong>Free Shipping!</strong>`;
            shippingProgressFill.style.width = '100%';
        } else {
            const difference = FREE_SHIPPING_THRESHOLD - subtotal;
            const percentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
            shippingProgressText.textContent = `Add ₹${difference} more for Free Shipping!`;
            shippingProgressFill.style.width = `${percentage}%`;
        }

        // Summary values
        if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        if (cartShippingEl) {
            cartShippingEl.textContent = subtotal === 0 ? '₹0' : (qualifiesForFreeShipping ? 'FREE' : `₹${STANDARD_SHIPPING_FEE}`);
        }
        if (cartTotalEl) cartTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;

        // Render Cart Items
        if (!cartItemsWrap) return;

        if (cart.length === 0) {
            cartItemsWrap.innerHTML = `
                <div class="empty-cart-state">
                    <svg width="64" height="64" viewBox="0 0 24 26" fill="currentColor">
                        <polygon points="12,1 22,6.5 22,19.5 12,25 2,19.5 2,6.5" opacity="0.4" />
                    </svg>
                    <p>Your harvest basket is empty.</p>
                    <button class="btn" id="start-shopping-btn" style="padding:0.75rem 1.4rem;font-size:0.95rem;">Explore Harvests</button>
                </div>
            `;
            const startBtn = document.getElementById('start-shopping-btn');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    closeCart();
                    const shopSection = document.getElementById('shop');
                    if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
                });
            }
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;

        cartItemsWrap.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-thumb" style="background:${item.bg};">
                    <svg viewBox="0 0 120 150" style="color:${item.jarColor};width:32px;height:auto;">
                        <use href="#jar" />
                    </svg>
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-meta">${item.weight} • ₹${item.price}</div>
                    <div class="item-qty-controls">
                        <button type="button" class="qty-btn minus-btn" aria-label="Decrease quantity" data-id="${item.id}">−</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button type="button" class="qty-btn plus-btn" aria-label="Increase quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="item-price-side">
                    <span class="item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <button type="button" class="remove-btn" aria-label="Remove ${item.name} honey" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        // Attach event listeners to quantity buttons and remove buttons
        cartItemsWrap.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
        });

        cartItemsWrap.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
        });

        cartItemsWrap.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
        });

        // Synchronize Shop Add-to-Cart buttons so "Added!" stays active and never fades out
        document.querySelectorAll('.add').forEach(btn => {
            const productId = btn.dataset.productId;
            const inCart = cart.find(item => item.id === productId);
            if (inCart && inCart.quantity > 0) {
                btn.classList.add('added');
                btn.innerHTML = inCart.quantity > 1 ? `Added (${inCart.quantity})! ✓` : 'Added! ✓';
            } else {
                btn.classList.remove('added');
                btn.innerHTML = 'Add to cart';
            }
        });
    }

    // -------------------------------------------------------------------------
    // 6. Cart Drawer Toggle Controls
    // -------------------------------------------------------------------------
    function openCart() {
        if (!cartOverlay || !cartDrawer) return;
        cartOverlay.classList.add('open');
        cartDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (cartCloseBtn) cartCloseBtn.focus();
    }

    function closeCart() {
        if (!cartOverlay || !cartDrawer) return;
        cartOverlay.classList.remove('open');
        cartDrawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // -------------------------------------------------------------------------
    // 7. Add To Cart Buttons in Shop Section
    // -------------------------------------------------------------------------
    const addButtons = document.querySelectorAll('.add');
    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            if (!productId) return;

            addToCart(productId);
            // State is preserved permanently via renderCart() without fading out
        });
    });

    // -------------------------------------------------------------------------
    // 8. Mobile Navigation Toggle
    // -------------------------------------------------------------------------
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            if (isOpen) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    function openMobileNav() {
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
    }

    // -------------------------------------------------------------------------
    // 9. Sticky Header Blur Effect on Scroll
    // -------------------------------------------------------------------------
    if (headerWrap) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                headerWrap.classList.add('scrolled');
            } else {
                headerWrap.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // -------------------------------------------------------------------------
    // 10. Newsletter Form Submission
    // -------------------------------------------------------------------------
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email address.', 'warning');
                newsletterEmail.focus();
                return;
            }

            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Joining...';

            setTimeout(() => {
                showToast(`Welcome! Harvest alerts will be sent to ${email} 🌼`);
                newsletterEmail.value = '';
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 750);
        });
    }

    // -------------------------------------------------------------------------
    // 11. Checkout Process Simulation
    // -------------------------------------------------------------------------
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            closeCart();
            openCheckoutModal();
            clearCart();
        });
    }

    function openCheckoutModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckoutModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCheckoutModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeCheckoutModal();
        });
    }

    // -------------------------------------------------------------------------
    // 12. Toast Notification Helper
    // -------------------------------------------------------------------------
    function showToast(message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');

        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        } else if (type === 'warning') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        } else {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        }

        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3400);
    }

    // Keyboard accessibility: Close modals/drawer with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeMobileNav();
            closeCheckoutModal();
        }
    });

    // -------------------------------------------------------------------------
    // 13. 3D Honey Bottle Scroll & Interactive Physics Engine
    // -------------------------------------------------------------------------
    const jarWrap = document.getElementById('jar-wrap');
    const jar3dBody = document.getElementById('jar-3d-body');
    const jarShadow = document.getElementById('jar-shadow');
    const heroSection = document.querySelector('.hero');

    if (jar3dBody && jarShadow) {
        // Physics State Variables
        let current = {
            translateY: 0,
            translateZ: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 3,
            scale: 1,
            shadowScale: 1,
            shadowOpacity: 0.38
        };

        let target = { ...current };

        let mouse = { x: 0, y: 0 };
        let lastScrollY = window.scrollY;
        let lastScrollTime = performance.now();
        let scrollVelocity = 0;
        let clickImpulse = 0;

        // Listen for scroll velocity and direction
        window.addEventListener('scroll', () => {
            const now = performance.now();
            const dt = Math.max(10, now - lastScrollTime);
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY;

            // Compute normalized velocity (-2 to +2)
            const rawVelocity = delta / dt;
            scrollVelocity = Math.max(-2, Math.min(2, rawVelocity));

            lastScrollY = currentScrollY;
            lastScrollTime = now;
        }, { passive: true });

        // Mouse Parallax across the Hero area
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
                mouse.x = Math.max(-1, Math.min(1, x));
                mouse.y = Math.max(-1, Math.min(1, y));
            });

            heroSection.addEventListener('mouseleave', () => {
                mouse.x = 0;
                mouse.y = 0;
            });
        }

        // Tap / Click 3D "Boing" Pop Reaction
        function triggerJarPop() {
            clickImpulse = 1.0;
            showToast('100% Raw Wildflower Honey – Straight from hive #14! 🍯', 'info');
        }

        jar3dBody.addEventListener('click', triggerJarPop);
        jar3dBody.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerJarPop();
            }
        });

        // Main Animation Render Loop
        function animateJar(time) {
            // Smoothly decay velocity towards 0
            scrollVelocity *= 0.88;
            if (Math.abs(scrollVelocity) < 0.005) scrollVelocity = 0;

            // 1. Immediate, Punchy Scroll-Progress Mapping
            // Responds over the first 180px so the 3D pop is instantly prominent and vivid!
            const scrollThreshold = 180;
            const progress = Math.min(1.0, Math.max(0, window.scrollY / scrollThreshold));

            // Base 3D elevation locked to scroll progress:
            // When leaving the scroll in mid, progress remains unchanged and the jar stays popped!
            const baseTranslateZ    = progress * 95;           // Pops out toward viewer: 0 -> 95px
            const baseTranslateY    = -(progress * 38);        // Lifts upward: 0 -> -38px
            const baseScale         = 1.0 + (progress * 0.16); // Scales up: 1.0 -> 1.16x
            const baseRotateX       = 0;                       // Balanced 0deg: top and bottom pop forward equally!
            const baseRotateZ       = 3 + (progress * 3.5);    // Rotates smoothly: 3deg -> 6.5deg
            const baseShadowScale   = 1.0 - (progress * 0.25); // Contact shadow shrinks with altitude
            const baseShadowOpacity = 0.38 - (progress * 0.18);// Contact shadow softens

            // 2. Dynamic Scroll Velocity (responsive extra pop while actively scrolling)
            const velFactor     = Math.max(-2, Math.min(2, scrollVelocity));
            const velTiltX      = velFactor * 1.5;             // Subtle dynamic tilt without lower-body protrusion
            const velExtraZ     = Math.abs(velFactor) * 18;
            const velExtraScale = Math.abs(velFactor) * 0.018;

            // 3. Ambient Breathing Float (centers around current popped altitude)
            const breathOffset = Math.sin(time * 0.0022) * 4.5;
            const breathRotZ   = Math.cos(time * 0.0018) * 1.4;

            // 4. Click Impulse Decay
            if (clickImpulse > 0.001) {
                clickImpulse *= 0.88;
            } else {
                clickImpulse = 0;
            }
            const clickPopZ  = Math.sin(clickImpulse * Math.PI) * 55;
            const clickScale = clickImpulse * 0.12;

            // 5. Target 3D Coordinates (strictly persists at current scroll progress when idle!)
            target.translateZ = baseTranslateZ + velExtraZ + clickPopZ;
            target.translateY = baseTranslateY + breathOffset - (clickPopZ * 0.3);
            target.scale      = baseScale + velExtraScale + clickScale;
            target.rotateX    = baseRotateX + velTiltX - (mouse.y * 5); // Balanced mouse tilt
            target.rotateY    = mouse.x * 12;
            target.rotateZ    = baseRotateZ + breathRotZ + (velFactor * 1.2);
            target.shadowScale   = Math.max(0.65, baseShadowScale - (velExtraZ * 0.002));
            target.shadowOpacity = Math.max(0.12, baseShadowOpacity - (velExtraZ * 0.001));

            // Silky smooth Linear Interpolation (Lerp factor = 0.1)
            const LERP = 0.1;
            current.translateY += (target.translateY - current.translateY) * LERP;
            current.translateZ += (target.translateZ - current.translateZ) * LERP;
            current.rotateX += (target.rotateX - current.rotateX) * LERP;
            current.rotateY += (target.rotateY - current.rotateY) * LERP;
            current.rotateZ += (target.rotateZ - current.rotateZ) * LERP;
            current.scale += (target.scale - current.scale) * LERP;
            current.shadowScale += (target.shadowScale - current.shadowScale) * LERP;
            current.shadowOpacity += (target.shadowOpacity - current.shadowOpacity) * LERP;

            // Apply 3D matrix transform to Honey Bottle
            jar3dBody.style.transform = `translate3d(0, ${current.translateY.toFixed(2)}px, ${current.translateZ.toFixed(2)}px) ` +
                `rotateX(${current.rotateX.toFixed(2)}deg) ` +
                `rotateY(${current.rotateY.toFixed(2)}deg) ` +
                `rotateZ(${current.rotateZ.toFixed(2)}deg) ` +
                `scale3d(${current.scale.toFixed(3)}, ${current.scale.toFixed(3)}, 1)`;

            // Apply dynamic 3D contact shadow transform (scales & diffuses with elevation)
            const shadowYOffset = Math.max(0, -current.translateY * 0.45);
            jarShadow.style.transform = `translate3d(0, ${shadowYOffset.toFixed(1)}px, 0) scale(${current.shadowScale.toFixed(3)})`;
            jarShadow.style.opacity = current.shadowOpacity.toFixed(3);

            requestAnimationFrame(animateJar);
        }

        requestAnimationFrame(animateJar);
    }

    // Initial load
    loadCart();
    renderCart();
});
