// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('role', 'listitem');
        cartItem.innerHTML = `
            <span>${sanitizeHTML(item.name)} (x${item.quantity})</span>
            <span>$${ (item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart(${index})" aria-label="Remove ${item.name} from cart">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

// Basic XSS prevention
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    saveCart();
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

// Cart button animation
document.querySelectorAll('.cart-button').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        button.classList.add('added');
        addToCart(name, price);
        setTimeout(() => {
            button.classList.remove('added');
        }, 1000);
    });
});

// Form validation and submission
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const shipping = form.querySelector('#shipping-method').value;
    const payment = form.querySelector('input[name="payment"]:checked');
    const csrfToken = form.querySelector('input[name="csrf_token"]').value;

    // Basic client-side validation
    if (!name.match(/^[A-Za-z\s]{2,50}$/)) {
        alert('Please enter a valid name (2-50 characters, letters and spaces only).');
        return;
    }

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!payment) {
        alert('Please select a payment method.');
        return;
    }

    // Simulate CSRF check (server-side should validate this)
    if (csrfToken !== 'SIMULATED_CSRF_TOKEN') {
        alert('Invalid CSRF token.');
        return;
    }

    // Simulate form submission
    alert('Purchase completed! Check your email for confirmation.');
    cart = [];
    saveCart();
    updateCartDisplay();
    form.reset();
});

// Navbar toggle
document.querySelector('.nav-toggle').addEventListener('click', () => {
    const navMenu = document.querySelector('.nav-menu');
    const isExpanded = navMenu.classList.toggle('active');
    document.querySelector('.nav-toggle').setAttribute('aria-expanded', isExpanded);
});

// Initialize cart display
updateCartDisplay();