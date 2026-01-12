# 🔧 Hướng Dẫn Sửa Lỗi Hình Ảnh Trong order.html

## 🐛 Vấn Đề
Khi bạn nhấp vào các món ăn để đặt hàng, phần order.html **không hiển thị hình ảnh**. Hình ảnh bị mất vì:

1. **foods.html** không lưu đường dẫn hình ảnh khi thêm vào giỏ
2. **order.html** tìm kiếm `item.image` nhưng nó là `undefined`
3. Hệ thống hiển thị lỗi thay vì hình ảnh mặc định

---

## ✅ Giải Pháp

### **Bước 1: Cập Nhật foods.html**
Trong file **foods.html**, thay thế hàm `addToCartWithQty`:

```javascript
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
            image: image  // ← QUAN TRỌNG: Lưu hình ảnh!
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ ' + quantity + 'x ' + name + ' đã được thêm vào giỏ hàng!');
    
    // Reset quantity input
    qtyDiv.querySelector('input').value = 1;
}
```

**Thay đổi chính:**
- ✅ Lấy element `.food-card` từ button
- ✅ Tìm đường dẫn ảnh từ `img` element
- ✅ Lưu `image: image` khi thêm vào giỏ
- ✅ Mặc định là `images/menu-pizza.jpg` nếu không có

---

### **Bước 2: Cập Nhật order.html**
Trong phần JavaScript của **order.html**, đảm bảo xử lý:

```javascript
// Trong vòng forEach khi render giỏ hàng
cart.forEach((item, index) => {
    const itemTotal = (item.price || 0) * item.quantity;
    total += itemTotal;
    
    // ← CẬP NHẬT ĐIỂM NÀY
    // Default image if not set
    const imgSrc = item.image || 'images/menu-pizza.jpg';

    itemsDiv.innerHTML += `
        <div class="food-menu-box">
            <div class="food-menu-img">
                <img src="${imgSrc}" class="img-responsive img-curve" alt="${item.name}">
            </div>
            ...
        </div>
    `;
});
```

**Thay đổi chính:**
- ✅ Kiểm tra `item.image` trước
- ✅ Nếu không có → dùng hình mặc định
- ✅ Sử dụng `imgSrc` trong `<img src="">`

---

## 🧪 Kiểm Tra

### **Test Case 1: Thêm Môn Ăn**
```
1. Vào foods.html
2. Chọn số lượng (ví dụ: 2)
3. Nhấp "🛒"
4. Thông báo: "✅ 2x [Tên Món] đã được thêm"
5. Mở DevTools → Application → Local Storage
6. Tìm key "cart" → Xem JSON
7. Kiểm tra: { name: "...", price: xxx, quantity: 2, image: "images/menu-pizza.jpg" }
```

### **Test Case 2: Xem Order**
```
1. Vào order.html
2. ✅ Hình ảnh MÓN ĂN hiển thị bình thường
3. ✅ Tên, giá, số lượng, thành tiền hiển thị đúng
4. Thử nhấp "+" hoặc "−" để thay đổi số lượng
5. Nhấp "🗑️ Xóa Món" để xóa
```

---

## 📊 Dữ Liệu Lưu Trữ

### **Trước sửa (Sai):**
```javascript
localStorage['cart'] = [
    {
        name: "Pizza Gà Hawaii",
        price: 184000,
        quantity: 2
        // ❌ THIẾU: image
    }
]
```

### **Sau sửa (Đúng):**
```javascript
localStorage['cart'] = [
    {
        name: "Pizza Gà Hawaii",
        price: 184000,
        quantity: 2,
        image: "images/menu-pizza.jpg"  // ✅ CÓ đường dẫn ảnh
    }
]
```

---

## 🎯 File Cần Cập Nhật

| File | Chỉnh Sửa |
|------|----------|
| `foods.html` | Hàm `addToCartWithQty()` - Thêm lưu `image` |
| `order.html` | Lấy `item.image` + fallback mặc định |
| `index.html` | Tương tự foods.html (nếu có) |

---

## 💡 Lưu Ý Quan Trọng

1. **Xóa cache giỏ hàng cũ:**
   - DevTools → Application → Local Storage
   - Xóa key "cart"
   - Làm mới trang

2. **Các hình ảnh mặc định:**
   - `images/menu-pizza.jpg` - Pizza
   - `images/menu-burger.jpg` - Burger
   - `images/menu-momo.jpg` - Momo

3. **Đường dẫn hình ảnh:**
   - Phải là đường dẫn **tương đối** (relative path)
   - VD: `images/menu-pizza.jpg` ✅
   - VD: `/images/menu-pizza.jpg` ❌
   - VD: `file:///C:/...` ❌

---

## 🚀 Triển Khai

Sau khi sửa:

1. ✅ Lưu file `foods.html`
2. ✅ Lưu file `order.html`
3. ✅ Refresh trình duyệt (Ctrl+F5)
4. ✅ Xóa localStorage["cart"]
5. ✅ Test lại

---

**Cập nhật: 9 Tháng 1, 2026**  
**Status: ✅ HÌNH ẢNH SẼ HIỂN THỊ ĐÚNG**
