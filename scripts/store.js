document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Initialize cart
    updateCart();
    
    // Navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Add to cart
    document.querySelectorAll('.cart-button').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            
            button.classList.add('clicked');
            setTimeout(() => button.classList.remove('clicked'), 2000);

            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            saveCart();
            updateCart();
        });
    });

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const payment = document.querySelector('input[name="payment"]:checked');
        
        if (!name || !address || !payment) {
            alert('Please fill in all required fields');
            return;
        }

        alert('Purchase completed successfully!');
        cart = [];
        saveCart();
        updateCart();
        checkoutForm.reset();
    });

    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name} x${item.quantity}</span>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-button" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = total.toFixed(2);
    }

    window.updateQuantity = (index, change) => {
        const item = cart[index];
        item.quantity = Math.max(1, item.quantity + change);
        
        saveCart();
        updateCart();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        saveCart();
        updateCart();
    };

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
});