# 🔐 Hệ Thống Xác Thực ThanhF 1

## Cách Hoạt Động

### 📝 **Đăng Ký (Register)**
1. Người dùng nhập: **Họ Tên**, **Email**, **Số Điện Thoại**, **Mật Khẩu**
2. Hệ thống **kiểm tra email chưa được đăng ký**
3. Nếu OK → **Lưu tài khoản vào `localStorage`** với khóa `accounts`
4. Lưu danh sách tất cả tài khoản: 
```javascript
{
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0909123456",
    password: "123456"
}
```
5. **Tự động đăng nhập** sau khi đăng ký thành công

### 🔑 **Đăng Nhập (Login)**
1. Người dùng nhập **Email** + **Mật Khẩu**
2. Hệ thống **tìm kiếm tài khoản** trong `localStorage['accounts']`
3. **Kiểm tra email AND mật khẩu khớp không**
4. Nếu đúng → **Lưu session người dùng** vào `localStorage['user']`
5. Nếu sai → ❌ **Thông báo lỗi**

### 💾 **Dữ Liệu Lưu Trữ**

**1. Danh sách tài khoản** (`localStorage['accounts']`):
```javascript
[
    {
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0909123456",
        password: "123456"
    },
    {
        name: "Trần Thị B",
        email: "tranthib@email.com",
        phone: "0919654321",
        password: "654321"
    }
]
```

**2. Phiên hiện tại** (`localStorage['user']`):
```javascript
{
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0909123456",
    loggedIn: true
}
```

## ✨ Tính Năng

✅ **Lưu tài khoản vĩnh viễn** - Tài khoản tồn tại cho đến khi xóa localStorage  
✅ **Kiểm tra mật khẩu** - Phải nhập đúng mật khẩu mới đăng nhập được  
✅ **Kiểm tra email trùng** - Không cho phép đăng ký email đã tồn tại  
✅ **Tự động đăng nhập** - Sau khi đăng ký thành công  
✅ **Lưu phiên đăng nhập** - Người dùng giữ đăng nhập khi reload trang  
✅ **Hiển thị tên người dùng** - Avatar + Tên hiển thị trên navbar

## 🧪 Hướng Dẫn Thử Nghiệm

### Test Case 1: Đăng Ký Tài Khoản Mới
```
1. Nhấp "✍️ Đăng Ký"
2. Nhập:
   - Họ Tên: "Lục Minh"
   - Email: "lucminh@gmail.com"
   - Số Điện Thoại: "0909888888"
   - Mật Khẩu: "abc123"
   - Nhập Lại: "abc123"
3. Nhấp "Đăng Ký"
4. ✅ Thông báo: "Đăng ký thành công! Bạn đã được tự động đăng nhập"
5. ✅ Navbar hiển thị "L" (Avatar) + "Lục Minh"
```

### Test Case 2: Đăng Nhập Với Tài Khoản Vừa Tạo
```
1. Đăng xuất (nếu cần)
2. Nhấp "🔐 Đăng Nhập"
3. Nhập:
   - Email: "lucminh@gmail.com"
   - Mật Khẩu: "abc123"
4. Nhấp "Đăng Nhập"
5. ✅ Thông báo: "Đăng nhập thành công!"
6. ✅ Navbar hiển thị "L" + "Lục Minh"
```

### Test Case 3: Đăng Nhập Với Mật Khẩu Sai
```
1. Nhấp "🔐 Đăng Nhập"
2. Nhập:
   - Email: "lucminh@gmail.com"
   - Mật Khẩu: "saimatkhau"
3. Nhấp "Đăng Nhập"
4. ❌ Thông báo: "Email hoặc mật khẩu không đúng!"
5. ❌ Không đăng nhập được
```

### Test Case 4: Đăng Ký Email Đã Tồn Tại
```
1. Nhấp "✍️ Đăng Ký"
2. Nhập email: "lucminh@gmail.com" (email đã có)
3. Nhập mật khẩu khác
4. Nhấp "Đăng Ký"
5. ❌ Thông báo: "Email này đã được đăng ký rồi!"
6. ❌ Không cho phép đăng ký
```

### Test Case 5: Kiểm Tra Mật Khẩu Không Khớp
```
1. Nhấp "✍️ Đăng Ký"
2. Nhập:
   - Mật Khẩu: "abc123"
   - Nhập Lại: "abc124" (khác)
3. Nhấp "Đăng Ký"
4. ⚠️ Thông báo: "Mật khẩu không khớp!"
```

## 🔄 Luồng Ứng Dụng

```
┌─────────────────────────────┐
│     Người Dùng Mới?          │
└──────────────┬──────────────┘
               │
        ┌──────▼──────┐
        │  Có/Không?  │
        └──────┬──────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
  KHÔNG                  CÓ
    │                     │
    │          ┌──────────▼────────────┐
    │          │   1. Nhập Email/MK    │
    │          │   2. Check tài khoản  │
    │          │   3. Nếu sai → Lỗi    │
    │          │   4. Nếu đúng → Login │
    │          └──────────┬────────────┘
    │                     │
    ▼                     ▼
┌──────────────────────────────────┐
│  1. Nhập Họ Tên, Email, SĐT, MK  │
│  2. Check email đã dùng chưa?    │
│  3. Nếu có → Lỗi                 │
│  4. Nếu không → Lưu + Auto Login │
└──────────────┬───────────────────┘
               │
               ▼
        ┌─────────────────┐
        │  Đăng Nhập OK   │
        │  Hiển thị Tên   │
        │  Navbar Update  │
        └─────────────────┘
```

## 📱 Các Trang Được Cập Nhật

✅ **index.html** - Hệ thống xác thực chính  
✅ **foods.html** - Đăng nhập trên trang menu  
❌ **categories.html** - Sẽ cập nhật  
❌ **order.html** - Sẽ cập nhật  

## 💡 Ghi Chú

- Dữ liệu được lưu trong **localStorage** của trình duyệt
- Khi xóa localStorage → Tất cả tài khoản sẽ mất
- Để xóa tài khoản: Mở **DevTools → Application → Local Storage → Xóa key "accounts"**
- Mật khẩu lưu ở **dạng text thuần** (trong thực tế nên mã hóa)

## 🔒 Cải Tiến Tương Lai

Nếu muốn bảo mật hơn:
1. Mã hóa mật khẩu trước khi lưu
2. Sử dụng Backend API thay vì localStorage
3. Thêm hash mật khẩu (bcrypt, SHA-256)
4. Thêm OTP xác thực Email
5. Session timeout tự động đăng xuất

---

**Cập nhật: 9 Tháng 1, 2026**  
**Version: 2.0 - Hệ Thống Xác Thực Hoàn Chỉnh**
