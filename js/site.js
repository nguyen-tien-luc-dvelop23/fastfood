// Shared site utilities (safe-guarded: define only if not already present)
(function(){
  // Insert login/register modals if missing
  function ensureModals(){
    if (!document.getElementById('loginModal')){
      const div = document.createElement('div');
      div.id = 'loginModal'; div.className = 'modal';
      div.innerHTML = `
        <div class="modal-content">
          <span class="close-modal" onclick="closeLoginModal()">&times;</span>
          <div class="modal-header"><h2>🔐 Đăng Nhập</h2></div>
          <form id="loginForm">
            <div class="form-group"><label>📧 Email:</label><input type="email" id="loginEmail" required></div>
            <div class="form-group"><label>🔑 Mật Khẩu:</label><input type="password" id="loginPassword" required></div>
            <div class="form-group"><button type="submit">Đăng Nhập</button></div>
            <div class="auth-link">Chưa có tài khoản? <a onclick="switchToRegister()">Đăng ký</a></div>
          </form>
        </div>`;
      document.body.appendChild(div);
    }

    if (!document.getElementById('registerModal')){
      const div = document.createElement('div');
      div.id = 'registerModal'; div.className = 'modal';
      div.innerHTML = `
        <div class="modal-content">
          <span class="close-modal" onclick="closeRegisterModal()">&times;</span>
          <div class="modal-header"><h2>✍️ Đăng Ký</h2></div>
          <form id="registerForm">
            <div class="form-group"><label>👤 Họ Tên:</label><input type="text" id="regName" required></div>
            <div class="form-group"><label>📧 Email:</label><input type="email" id="regEmail" required></div>
            <div class="form-group"><label>📱 SĐT:</label><input type="tel" id="regPhone" required></div>
            <div class="form-group"><label>🔑 Mật Khẩu:</label><input type="password" id="regPassword" required></div>
            <div class="form-group"><label>✓ Nhập Lại:</label><input type="password" id="regPassword2" required></div>
            <div class="form-group"><button type="submit">Đăng Ký</button></div>
            <div class="auth-link">Đã có tài khoản? <a onclick="switchToLogin()">Đăng nhập</a></div>
          </form>
        </div>`;
      document.body.appendChild(div);
    }
  }

  if (typeof showNotification === 'undefined'){
    window.showNotification = function(message, type='info'){
      const n = document.createElement('div'); n.className = 'notification '+type; n.textContent = message; document.body.appendChild(n);
      setTimeout(()=>{ n.style.opacity='0'; n.style.transform='translateY(-10px)'; setTimeout(()=>n.remove(),300); },3000);
    };
  }

  // Modals
  if (typeof openLoginModal === 'undefined') window.openLoginModal = function(){ ensureModals(); document.getElementById('loginModal').classList.add('show'); };
  if (typeof closeLoginModal === 'undefined') window.closeLoginModal = function(){ const m=document.getElementById('loginModal'); if(m) m.classList.remove('show'); };
  if (typeof openRegisterModal === 'undefined') window.openRegisterModal = function(){ ensureModals(); document.getElementById('registerModal').classList.add('show'); };
  if (typeof closeRegisterModal === 'undefined') window.closeRegisterModal = function(){ const m=document.getElementById('registerModal'); if(m) m.classList.remove('show'); };
  if (typeof switchToRegister === 'undefined') window.switchToRegister = function(){ closeLoginModal(); openRegisterModal(); };
  if (typeof switchToLogin === 'undefined') window.switchToLogin = function(){ closeRegisterModal(); openLoginModal(); };

  // Update profile/auth UI
  if (typeof updateUserProfile === 'undefined'){
    window.updateUserProfile = function(){
      const user = JSON.parse(localStorage.getItem('user'));
      const profileMenu = document.getElementById('profile-menu');
      const authMenu = document.getElementById('auth-menu');
      if (user && user.loggedIn){ if (profileMenu) profileMenu.style.display='inline'; if (authMenu) authMenu.style.display='none'; }
      else { if (profileMenu) profileMenu.style.display='none'; if (authMenu) authMenu.style.display='inline'; }
    };
  }

  if (typeof logout === 'undefined') window.logout = function(){ localStorage.removeItem('user'); updateUserProfile(); showNotification('✅ Đã đăng xuất', 'success'); };

  // cart count updater
  function updateCartCount(){ const span = document.getElementById('cart-count'); if(!span) return; const cart = JSON.parse(localStorage.getItem('cart'))||[]; span.textContent = cart.reduce((s,i)=>s+(i.quantity||0),0); }
  window.updateCartCount = updateCartCount;

  if (typeof addToCart === 'undefined'){
    window.addToCart = function(name, price, image){
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.loggedIn){ showNotification('⚠️ Vui lòng đăng nhập để đặt hàng!', 'warning'); openLoginModal(); return; }
      const cart = JSON.parse(localStorage.getItem('cart'))||[];
      const item = cart.find(i=>i.name===name);
      if (item) item.quantity += 1; else cart.push({ name, price, image: image||'images/menu-pizza.jpg', quantity:1 });
      localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); showNotification('✅ Đã thêm '+name+' vào giỏ hàng!', 'success');
    };
  }

  // Ensure modals exist and wire forms
  document.addEventListener('DOMContentLoaded', function(){
    ensureModals(); updateUserProfile(); updateCartCount();
    // wire login/register handlers if not present
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !loginForm.dataset.wired){
      loginForm.addEventListener('submit', function(e){ e.preventDefault(); const email=document.getElementById('loginEmail').value; const password=document.getElementById('loginPassword').value; const accounts = JSON.parse(localStorage.getItem('accounts'))||[]; const acc = accounts.find(a=>a.email===email && a.password===password); if (acc){ localStorage.setItem('user', JSON.stringify({ name:acc.name, email:acc.email, phone:acc.phone, loggedIn:true })); updateUserProfile(); closeLoginModal(); loginForm.reset(); showNotification('✅ Đăng nhập thành công!', 'success'); } else showNotification('❌ Email hoặc mật khẩu không đúng!', 'error'); });
      loginForm.dataset.wired = '1';
    }
    const registerForm = document.getElementById('registerForm');
    if (registerForm && !registerForm.dataset.wired){
      registerForm.addEventListener('submit', function(e){ e.preventDefault(); const name=document.getElementById('regName').value; const email=document.getElementById('regEmail').value; const phone=document.getElementById('regPhone').value; const password=document.getElementById('regPassword').value; const password2=document.getElementById('regPassword2').value; if (password!==password2){ showNotification('⚠️ Mật khẩu không khớp!','warning'); return; } const accounts=JSON.parse(localStorage.getItem('accounts'))||[]; if (accounts.find(a=>a.email===email)){ showNotification('❌ Email đã tồn tại','error'); return; } accounts.push({ name, email, phone, password }); localStorage.setItem('accounts', JSON.stringify(accounts)); localStorage.setItem('user', JSON.stringify({ name, email, phone, loggedIn:true })); updateUserProfile(); closeRegisterModal(); registerForm.reset(); showNotification('✅ Đăng ký thành công!','success'); });
      registerForm.dataset.wired = '1';
    }
    // Close modals on outside click
    window.addEventListener('click', function(e){ const lm=document.getElementById('loginModal'); const rm=document.getElementById('registerModal'); if (e.target===lm) closeLoginModal(); if (e.target===rm) closeRegisterModal(); });
  });

})();
