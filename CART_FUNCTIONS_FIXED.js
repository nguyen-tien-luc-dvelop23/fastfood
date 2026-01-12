// Change Quantity
function changeQty(button, change) {
    let qtyDiv = button.parentElement;
    let input = qtyDiv.querySelector('input');
    let currentValue = parseInt(input.value);
    let newValue = currentValue + change;
    
    if (newValue >= 1) {
        input.value = newValue;
    }
}

// Add to Cart with Quantity - FIXED VERSION
function addToCartWithQty(name, price, button) {
    // Get the food card element
    let card = button.closest('.food-card');
    
    // Get image from the card
    let imgElement = card.querySelector('.food-card-img img');
    let image = imgElement ? imgElement.src : 'images/menu-pizza.jpg';
    
    // Get quantity input
    let qtyDiv = button.parentElement.querySelector('.food-card-qty');
    let quantity = parseInt(qtyDiv.querySelector('input').value);
    
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const item = cart.find(i => i.name === name);
    
    if (item) {
        item.quantity += quantity;
    } else {
        // Add new item WITH IMAGE
        cart.push({ 
            name: name, 
            price: price, 
            quantity: quantity,
            image: image  // FIXED: Now saves the image!
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ ' + quantity + 'x ' + name + ' đã được thêm vào giỏ hàng!');
    
    // Reset quantity input
    qtyDiv.querySelector('input').value = 1;
}

// Add to Cart (old function - keep for compatibility)
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.name === name);
    
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ ' + name + ' đã được thêm vào giỏ hàng!');
}
