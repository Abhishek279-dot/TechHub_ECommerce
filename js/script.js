// ========================================
// 🎯 TECHHUB INDIA - COMPLETE JAVASCRIPT (FIXED)
// ========================================

// ==========================================
// 📱 SWIPER SLIDERS INITIALIZATION
// ==========================================

// Top notification slider (promotional messages)
var swiper = new Swiper(".top-slider", {
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Banner image slider (main banner section)
var bannerImageSwiper = new Swiper(".banner-image-swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 0,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".banner-image-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".banner-image-swiper .swiper-button-next",
    prevEl: ".banner-image-swiper .swiper-button-prev",
  },
  speed: 800,
});

// ==========================================
// 🔽 DROPDOWN FUNCTIONS (Brand & Device Selection)
// ==========================================

// Toggle dropdown visibility
function toggleDropdown(dropdownId) {
  var dropdown = document.getElementById(dropdownId);
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Select brand and update button text
function selectBrand(brandName) {
  document.querySelector('#brandDropdown').previousElementSibling.innerHTML = brandName + ' ▼';
  document.getElementById('brandDropdown').style.display = 'none';
}

// Select device and update button text
function selectDevice(deviceName) {
  document.querySelector('#deviceDropdown').previousElementSibling.innerHTML = deviceName + ' ▼';
  document.getElementById('deviceDropdown').style.display = 'none';
}

// Close dropdowns when clicking outside
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].style.display = "none";
    }
  }
}

// ==========================================
// 📑 TAB FUNCTIONS (Product Details Pages)
// ==========================================

function openTab(evt, tabName) {
  // Hide all tab content
  let tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove active class from all tab buttons
  let tablinks = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show clicked tab and add active class
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

// ==========================================
// 🔄 NAVIGATION FUNCTIONS
// ==========================================

// Smooth scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Alternative scroll method
function goToProducts() {
    document.getElementById('products').scrollIntoView();
}

// Scroll to the top and show the button after the page has been scrolled
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

window.addEventListener('scroll', function() {
  const scrollButton = document.querySelector('.scroll-top');
  if (window.pageYOffset > 300) {
    scrollButton.classList.add('show');
  } else {
    scrollButton.classList.remove('show');
  }
});

// ==========================================
// 🛒 SHOPPING CART SYSTEM
// ==========================================

// Cart variables
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Add product to cart with enhanced feedback
function addToCart(productId, productName, price, imageUrl, buttonElement) {
    // Visual feedback for button click
    if (buttonElement) {
        buttonElement.style.background = '#4CAF50';
        buttonElement.textContent = 'Added! ✓';
        
        setTimeout(() => {
            buttonElement.style.background = '';
            buttonElement.textContent = 'Add to Cart';
        }, 2000);
    }

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${productName} quantity updated! (${existingItem.quantity})`, 'success');
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseInt(price), // Fix: Ensure price is number
            image: imageUrl,
            quantity: 1
        });
        showNotification(`${productName} added to cart!`, 'success');
    }
    
    updateCartUI();
    saveCart(); // Save to localStorage
}

// Update cart display and counters
function updateCartUI() {
    // Calculate totals
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart count badge
    const cartCountElement = document.getElementById('cartCount');
    const cartItemsText = document.getElementById('cartItemsText');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        // Add bounce animation to cart badge
        cartCountElement.classList.add('updated');
        setTimeout(() => {
            cartCountElement.classList.remove('updated');
        }, 600);
    }
    
    // Update items text for modern cart button
    if (cartItemsText) {
        const itemText = cartCount === 1 ? 'item' : 'items';
        cartItemsText.textContent = `${cartCount} ${itemText}`;
    }
    
    // Update cart items display
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
        } else {
            // Generate HTML for each cart item
            let cartHTML = '';
            
            cart.forEach(item => {
                cartHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                        <div class="item-details" style="flex: 1; margin-left: 15px;">
                            <h4 class="item-name" style="margin: 0 0 5px 0; font-size: 14px;">${item.name}</h4>
                            <p class="item-price" style="margin: 0 0 10px 0; color: #666; font-size: 13px;">₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
                            <div class="quantity-controls" style="display: flex; align-items: center; gap: 8px;">
                                <button onclick="changeQuantity('${item.id}', -1)" style="background: #87CEEB; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                                <span style="background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${item.quantity}</span>
                                <button onclick="changeQuantity('${item.id}', 1)" style="background: #87CEEB; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                                <button onclick="removeFromCart('${item.id}')" style="background: #ff4757; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-left: 10px;">🗑️</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = cartHTML;
        }
    }
    
    // Update total amount
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal;
    }
    
    // Debug info (remove in production)
    console.log('Cart updated:', cart);
    console.log('Total items:', cartCount);
    console.log('Total amount: ₹', cartTotal);
}

// Toggle cart sidebar visibility
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

// Change item quantity in cart
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
    showNotification('Item removed from cart', 'error');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Checkout successful! Total: ₹${cartTotal}\nThank you for shopping with TechHub India!`);
    cart = [];
    updateCartUI();
    saveCart();
    toggleCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('techHubCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('techHubCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.log('Error loading cart from localStorage');
            cart = [];
        }
    }
}

// ==========================================
// 🔔 NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideInRight 0.4s ease;
        min-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 3000);
}

// ==========================================
// 🔍 PRODUCT SEARCH SYSTEM (FIXED)
// ==========================================

// Product search initialization
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('productSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    // Complete keywords mapping for all products
    const productKeywords = {
        // Bluetooth Speaker keywords
        'bluetooth speaker': 'bluetooth',
        'blutooth speaker': 'bluetooth',
        'speaker': 'bluetooth', 
        'audio': 'bluetooth',
        'music': 'bluetooth',
        'sound': 'bluetooth',
        'bass': 'bluetooth',
        'wireless speaker': 'bluetooth',
        
        // TYPE C Cable keywords
        'type c cable': 'type',
        'type c cabal': 'type',
        'cable': 'type',
        'cabal': 'type',
        'usb': 'type',
        'charging cable': 'type',
        'wire': 'type',
        'type c': 'type',
        
        // Phone Holder keywords
        'phone holder': 'phone',
        'holder': 'phone',
        'stand': 'phone',
        'mobile stand': 'phone',
        'phone stand': 'phone',
        'mobile holder': 'phone',
        
        // Realme Earbuds keywords
        'realme earbuds': 'realme',
        'earbuds': 'realme',
        'realme': 'realme',
        'wireless earbuds': 'realme',
        'buds': 'realme',
        'ear buds': 'realme',
        
        // PowerBank keywords
        'powerbank': 'powerbank',
        'power bank': 'powerbank', 
        'mi powerbank': 'powerbank',
        'battery': 'powerbank',
        'portable charger': 'powerbank',
        
        // Other product keywords...
        'headset': 'headset',
        'watch': 'watch',
        'charger': 'charger',
        'adapter': 'charger',
        'gopro': 'gopro',
        'camera': 'gopro',
        'neckband': 'neckband',
        'vivo': 'vivo',
        'samsung': 'samsung',
        's25': 'samsung'
    };
    
    // FIXED Search function
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            showNotification('Please type something to search', 'error');
            return;
        }
        
        // Find matching products
        const products = document.querySelectorAll('.product-card');
        let found = false;
        let searchTerm = query;
        
        // Check if query exists in keywords mapping
        if (productKeywords[query]) {
            searchTerm = productKeywords[query];
        }
        
        products.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            
            // Enhanced search logic
            if (title.includes(query) || 
                title.includes(searchTerm) ||
                (query.includes('speaker') && title.includes('bluetooth')) ||
                (query.includes('cable') && title.includes('type')) ||
                (query.includes('holder') && title.includes('phone')) ||
                (query.includes('earbuds') && title.includes('realme')) ||
                (query.includes('powerbank') && title.includes('mi')) ||
                (query.includes('headset') && title.includes('wireless')) ||
                (query.includes('watch') && title.includes('smart')) ||
                (query.includes('charger') && title.includes('adapter'))) {
                
                // FIXED: Ensure product visibility first
                card.style.opacity = '1';
                card.style.display = 'block';
                card.style.visibility = 'visible';
                
                // Scroll to found product
                card.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
                
                // FIXED: Better blink animation timing
                setTimeout(() => {
                    // Remove existing animation classes
                    card.classList.remove('search-blink');
                    
                    // Force browser reflow
                    card.offsetHeight;
                    
                    // Add blink class with forced visibility
                    card.classList.add('search-blink');
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                    
                    // Remove blink class after animation completes
                    setTimeout(() => {
                        card.classList.remove('search-blink');
                        // Ensure product stays visible
                        card.style.opacity = '1';
                        card.style.visibility = 'visible';
                    }, 2400); // 3 blinks × 0.8s = 2.4s
                    
                }, 1000); // Increased delay after scroll
                
                // Show success notification
                showNotification(`Found: ${card.querySelector('.product-title').textContent}`, 'success');
                
                found = true;
                return; // Stop after first match
            }
        });
        
        if (!found) {
            showNotification('Product not found! Try: speaker, cable, holder, earbuds, watch, charger', 'error');
        }
        
        searchInput.value = ''; // Clear search input
    }
    
    // Search event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Initialize cart on page load
    updateCartUI();
    loadCart();
});

// ==========================================
// 🎨 CSS ANIMATIONS & STYLES (FIXED)
// ==========================================

// Add CSS animations for notifications and effects
const style = document.createElement('style');
style.textContent = `
    /* Notification slide animations */
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Cart badge bounce animation */
    @keyframes cartBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); background: #FF6B6B; }
    }
    
    .cart-badge.updated {
        animation: cartBounce 0.6s ease;
    }
    
    /* FIXED Search blink effect */
    .search-blink {
        animation: searchBlink 0.8s ease-in-out 3 !important;
        border: 4px solid #c40913ff !important;
        border-radius: 15px !important;
        box-shadow: 0 0 25px rgba(135, 206, 235, 0.8) !important;
        transform: scale(1.02) !important;
        position: relative !important;
        z-index: 100 !important;
        
        /* CRITICAL: Force visibility during animation */
        opacity: 1 !important;
        display: block !important;
        visibility: visible !important;
    }
    
    /* Prevent any child elements from disappearing */
    .search-blink * {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    @keyframes searchBlink {
        0% { 
            border-color: #87CEEB;
            box-shadow: 0 0 20px rgba(135, 206, 235, 0.6);
            transform: scale(1.02);
            opacity: 1;
        }
        50% { 
            border-color: #FF6B6B;
            box-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
            transform: scale(1.05);
            opacity: 1;
        }
        100% { 
            border-color: #87CEEB;
            box-shadow: 0 0 20px rgba(135, 206, 235, 0.6);
            transform: scale(1.02);
            opacity: 1;
        }
    }
    
    /* Override any existing product animations during search */
    .product-card.search-blink {
        animation: searchBlink 0.8s ease-in-out 3 !important;
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

// ==========================================
// 🚀 FINAL CONSOLE MESSAGE
// ==========================================

console.log('🎯 TechHub India - Website Loaded Successfully! 🛒');
console.log('Features: ✅ Search ✅ Cart ✅ Sliders ✅ Notifications');
console.log('🔧 Search Animation Fixed - No More Disappearing Products!');





function goToLogin() {
    // Redirect user to your login page
    window.location.href = 'pages/loginnn.html';
}



