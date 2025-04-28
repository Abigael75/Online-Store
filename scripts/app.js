let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('proceed-to-checkout');
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('role', 'listitem');
 göz
        cartItem.innerHTML = `
            <span>${sanitizeHTML(item.name)} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart(${index})" aria-label="Remove ${sanitizeHTML(item.name)} from cart">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
    if (checkoutButton) {
        checkoutButton.style.display = cart.length > 0 ? 'inline-block' : 'none';
    }
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

// Cart buttons
document.querySelectorAll('.cart-button').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        addToCart(name, price);
        button.textContent = 'Added!';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
        }, 1000);
    });
});

// Checkout form
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const shipping = form.querySelector('#shipping-method').value;
        const payment = form.querySelector('input[name="payment"]:checked');
        const csrfToken = form.querySelector('input[name="csrf_token"]').value;

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

        if (csrfToken !== 'SIMULATED_CSRF_TOKEN') {
            alert('Invalid CSRF token.');
            return;
        }

        alert('Purchase completed! Check your email for confirmation.');
        cart = [];
        saveCart();
        updateCartDisplay();
        form.reset();
    });
}

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('#name').value;
        const email = contactForm.querySelector('#email').value;
        const message = contactForm.querySelector('#message').value;
        const csrfToken = contactForm.querySelector('input[name="csrf_token"]').value;

        if (!name.match(/^[A-Za-z\s]{2,50}$/)) {
            alert('Please enter a valid name.');
            return;
        }

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (message.length < 10) {
            alert('Message must be at least 10 characters.');
            return;
        }

        if (csrfToken !== 'SIMULATED_CSRF_TOKEN') {
            alert('Invalid CSRF token.');
            return;
        }

        alert('Message sent! We will get back to you soon.');
        contactForm.reset();
    });
}

// Navbar toggle
document.querySelector('.nav-toggle').addEventListener('click', () => {
    const navMenu = document.querySelector('.nav-menu');
    const isExpanded = navMenu.classList.toggle('active');
    document.querySelector('.nav-toggle').setAttribute('aria-expanded', isExpanded);
});

// Initialize
updateCartDisplay();