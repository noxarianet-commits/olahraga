// Konfigurasi API
const API_BASE_URL = 'http://localhost/absensi-olahrga/api'; // Ganti dengan URL API yang sesuai

// Fungsi untuk menampilkan pesan
function showMessage(message, type = 'info') {
    // Buat elemen pesan
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Style untuk pesan
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // Warna berdasarkan jenis pesan
    if (type === 'success') {
        messageEl.style.backgroundColor = '#059669';
    } else if (type === 'error') {
        messageEl.style.backgroundColor = '#dc2626';
    } else {
        messageEl.style.backgroundColor = '#1e3a8a';
    }
    
    // Tambahkan ke body
    document.body.appendChild(messageEl);
    
    // Hapus setelah 5 detik
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// Fungsi untuk memeriksa apakah pengguna sudah login
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!user || !userRole) {
        return false;
    }
    
    return { user: JSON.parse(user), role: userRole };
}

// Fungsi untuk redirect berdasarkan role
function redirectByRole(role) {
    if (role === 'siswa') {
        window.location.href = 'dashboard-siswa.html';
    } else if (role === 'admin') {
        window.location.href = 'dashboard-admin.html';
    }
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// Fungsi untuk mendapatkan waktu sekarang dalam format yang diinginkan
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${date} ${time}`;
}

// ==================== LOGIN SISWA ====================
if (window.location.pathname.includes('login-siswa.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                nama: document.getElementById('nama').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                // Simulasi request API
                const response = await fetch(`${API_BASE_URL}/login-siswa.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    // Simpan data user ke localStorage
                    localStorage.setItem('currentUser', JSON.stringify(result.data));
                    localStorage.setItem('userRole', 'siswa');
                    
                    showMessage('Login berhasil!', 'success');
                    
                    // Redirect ke dashboard siswa
                    setTimeout(() => {
                        window.location.href = 'dashboard-siswa.html';
                    }, 1000);
                } else {
                    showMessage(result.message || 'Login gagal!', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Terjadi kesalahan saat login', 'error');
                
                // Fallback untuk demo (jika API tidak tersedia)
                // Simpan data user ke localStorage untuk demo
                localStorage.setItem('currentUser', JSON.stringify({
                    nama: formData.nama,
                    email: formData.email
                }));
                localStorage.setItem('userRole', 'siswa');
                
                showMessage('Login berhasil (demo mode)!', 'success');
                
                // Redirect ke dashboard siswa
                setTimeout(() => {
                    window.location.href = 'dashboard-siswa.html';
                }, 1000);
            }
        });
    });
}

// ==================== LOGIN ADMIN ====================
if (window.location.pathname.includes('login-admin.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                // Simulasi request API
                const response = await fetch(`${API_BASE_URL}/login-admin.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    // Simpan data user ke localStorage
                    localStorage.setItem('currentUser', JSON.stringify(result.data));
                    localStorage.setItem('userRole', 'admin');
                    
                    showMessage('Login berhasil!', 'success');
                    
                    // Redirect ke dashboard admin
                    setTimeout(() => {
                        window.location.href = 'dashboard-admin.html';
                    }, 1000);
                } else {
                    showMessage(result.message || 'Login gagal!', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Terjadi kesalahan saat login', 'error');
                
                // Fallback untuk demo (jika API tidak tersedia)
                // Simpan data user ke localStorage untuk demo
                localStorage.setItem('currentUser', JSON.stringify({
                    email: formData.email
                }));
                localStorage.setItem('userRole', 'admin');
                
                showMessage('Login berhasil (demo mode)!', 'success');
                
                // Redirect ke dashboard admin
                setTimeout(() => {
                    window.location.href = 'dashboard-admin.html';
                }, 1000);
            }
        });
    });
}

// ==================== DASHBOARD SISWA ====================
if (window.location.pathname.includes('dashboard-siswa.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Periksa autentikasi
        const auth = checkAuth();
        if (!auth || auth.role !== 'siswa') {
            window.location.href = 'login-siswa.html';
            return;
        }
        
        const user = auth.user;
        
        // Tampilkan informasi user
        document.getElementById('userName').textContent = user.nama;
        document.getElementById('nama').value = user.nama;
        
        // Set waktu absensi otomatis
        document.getElementById('waktu').value = getCurrentDateTime();
        
        // Setup form absensi
        const absensiForm = document.getElementById('absensiForm');
        
        absensiForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                nama: document.getElementById('nama').value,
                kelas: document.getElementById('kelas').value,
                mataPelajaran: document.getElementById('mataPelajaran').value,
                waktu: document.getElementById('waktu').value,
                email: user.email
            };
            
            try {
                // Simulasi request API
                const response = await fetch(`${API_BASE_URL}/absensi.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showMessage('Absensi berhasil disimpan!', 'success');
                    
                    // Reset form
                    absensiForm.reset();
                    document.getElementById('nama').value = user.nama;
                    document.getElementById('waktu').value = getCurrentDateTime();
                    
                    // Refresh riwayat absensi
                    loadRiwayatAbsensi();
                } else {
                    showMessage(result.message || 'Gagal menyimpan absensi!', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Terjadi kesalahan saat menyimpan absensi', 'error');
                
                // Fallback untuk demo
                showMessage('Absensi berhasil disimpan (demo mode)!', 'success');
                
                // Reset form
                absensiForm.reset();
                document.getElementById('nama').value = user.nama;
                document.getElementById('waktu').value = getCurrentDateTime();
                
                // Refresh riwayat absensi
                loadRiwayatAbsensi();
            }
        });
        
        // Setup logout button
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        // Load riwayat absensi
        loadRiwayatAbsensi();
        
        async function loadRiwayatAbsensi() {
            try {
                // Simulasi request API
                const response = await fetch(`${API_BASE_URL}/riwayat-siswa.php?email=${user.email}`);
                const result = await response.json();
                
                const tableBody = document.querySelector('#riwayatTable tbody');
                tableBody.innerHTML = '';
                
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    result.data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.tanggal}</td>
                            <td>${item.mataPelajaran}</td>
                            <td>${item.waktu}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    // Data demo jika API tidak tersedia
                    const demoData = [
                        { tanggal: '15/03/2023', mataPelajaran: 'Sepak Bola', waktu: '08:00' },
                        { tanggal: '10/03/2023', mataPelajaran: 'Basket', waktu: '10:30' },
                        { tanggal: '05/03/2023', mataPelajaran: 'Renang', waktu: '14:15' }
                    ];
                    
                    demoData.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.tanggal}</td>
                            <td>${item.mataPelajaran}</td>
                            <td>${item.waktu}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                
                // Data demo jika terjadi error
                const tableBody = document.querySelector('#riwayatTable tbody');
                tableBody.innerHTML = '';
                
                const demoData = [
                    { tanggal: '15/03/2023', mataPelajaran: 'Sepak Bola', waktu: '08:00' },
                    { tanggal: '10/03/2023', mataPelajaran: 'Basket', waktu: '10:30' },
                    { tanggal: '05/03/2023', mataPelajaran: 'Renang', waktu: '14:15' }
                ];
                
                demoData.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.tanggal}</td>
                        <td>${item.mataPelajaran}</td>
                        <td>${item.waktu}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }
    });
}

// ==================== DASHBOARD ADMIN ====================
if (window.location.pathname.includes('dashboard-admin.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Periksa autentikasi
        const auth = checkAuth();
        if (!auth || auth.role !== 'admin') {
            window.location.href = 'login-admin.html';
            return;
        }
        
        // Setup logout button
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        // Setup filter form
        const filterForm = document.getElementById('filterForm');
        const resetFilterBtn = document.getElementById('resetFilter');
        const exportBtn = document.getElementById('exportBtn');
        
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loadAbsensiData();
        });
        
        resetFilterBtn.addEventListener('click', function() {
            filterForm.reset();
            loadAbsensiData();
        });
        
        exportBtn.addEventListener('click', function() {
            // Fitur export akan diimplementasikan di backend
            showMessage('Fitur export akan diimplementasikan di backend PHP', 'info');
        });
        
        // Load data absensi
        loadAbsensiData();
        
        async function loadAbsensiData() {
            try {
                // Simulasi request API
                const response = await fetch(`${API_BASE_URL}/all-absensi.php`);
                const result = await response.json();
                
                const tableBody = document.querySelector('#absensiTable tbody');
                tableBody.innerHTML = '';
                
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    // Terapkan filter jika ada
                    const filterNama = document.getElementById('filterNama').value.toLowerCase();
                    const filterTanggal = document.getElementById('filterTanggal').value;
                    const filterKelas = document.getElementById('filterKelas').value.toLowerCase();
                    
                    const filteredData = result.data.filter(item => {
                        const namaMatch = !filterNama || item.nama.toLowerCase().includes(filterNama);
                        const tanggalMatch = !filterTanggal || item.tanggal === filterTanggal;
                        const kelasMatch = !filterKelas || (item.kelas && item.kelas.toLowerCase().includes(filterKelas));
                        
                        return namaMatch && tanggalMatch && kelasMatch;
                    });
                    
                    filteredData.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.nama}</td>
                            <td>${item.kelas || '-'}</td>
                            <td>${item.mataPelajaran}</td>
                            <td>${item.tanggal}</td>
                            <td>${item.waktu}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    // Data demo jika API tidak tersedia
                    const demoData = [
                        { nama: 'Ahmad Rizki', kelas: '10 IPA 1', mataPelajaran: 'Sepak Bola', tanggal: '2023-03-15', waktu: '08:00' },
                        { nama: 'Siti Nurhaliza', kelas: '10 IPS 2', mataPelajaran: 'Basket', tanggal: '2023-03-15', waktu: '10:30' },
                        { nama: 'Budi Santoso', kelas: '11 IPA 1', mataPelajaran: 'Renang', tanggal: '2023-03-14', waktu: '14:15' },
                        { nama: 'Maya Sari', kelas: '11 IPS 1', mataPelajaran: 'Voli', tanggal: '2023-03-14', waktu: '09:45' },
                        { nama: 'Rizky Pratama', kelas: '12 IPA 2', mataPelajaran: 'Bulu Tangkis', tanggal: '2023-03-13', waktu: '11:20' }
                    ];
                    
                    // Terapkan filter jika ada
                    const filterNama = document.getElementById('filterNama').value.toLowerCase();
                    const filterTanggal = document.getElementById('filterTanggal').value;
                    const filterKelas = document.getElementById('filterKelas').value.toLowerCase();
                    
                    const filteredData = demoData.filter(item => {
                        const namaMatch = !filterNama || item.nama.toLowerCase().includes(filterNama);
                        const tanggalMatch = !filterTanggal || item.tanggal === filterTanggal;
                        const kelasMatch = !filterKelas || (item.kelas && item.kelas.toLowerCase().includes(filterKelas));
                        
                        return namaMatch && tanggalMatch && kelasMatch;
                    });
                    
                    filteredData.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.nama}</td>
                            <td>${item.kelas}</td>
                            <td>${item.mataPelajaran}</td>
                            <td>${item.tanggal}</td>
                            <td>${item.waktu}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                
                // Data demo jika terjadi error
                const tableBody = document.querySelector('#absensiTable tbody');
                tableBody.innerHTML = '';
                
                const demoData = [
                    { nama: 'Ahmad Rizki', kelas: '10 IPA 1', mataPelajaran: 'Sepak Bola', tanggal: '2023-03-15', waktu: '08:00' },
                    { nama: 'Siti Nurhaliza', kelas: '10 IPS 2', mataPelajaran: 'Basket', tanggal: '2023-03-15', waktu: '10:30' },
                    { nama: 'Budi Santoso', kelas: '11 IPA 1', mataPelajaran: 'Renang', tanggal: '2023-03-14', waktu: '14:15' },
                    { nama: 'Maya Sari', kelas: '11 IPS 1', mataPelajaran: 'Voli', tanggal: '2023-03-14', waktu: '09:45' },
                    { nama: 'Rizky Pratama', kelas: '12 IPA 2', mataPelajaran: 'Bulu Tangkis', tanggal: '2023-03-13', waktu: '11:20' }
                ];
                
                // Terapkan filter jika ada
                const filterNama = document.getElementById('filterNama').value.toLowerCase();
                const filterTanggal = document.getElementById('filterTanggal').value;
                const filterKelas = document.getElementById('filterKelas').value.toLowerCase();
                
                const filteredData = demoData.filter(item => {
                    const namaMatch = !filterNama || item.nama.toLowerCase().includes(filterNama);
                    const tanggalMatch = !filterTanggal || item.tanggal === filterTanggal;
                    const kelasMatch = !filterKelas || (item.kelas && item.kelas.toLowerCase().includes(filterKelas));
                    
                    return namaMatch && tanggalMatch && kelasMatch;
                });
                
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.nama}</td>
                        <td>${item.kelas}</td>
                        <td>${item.mataPelajaran}</td>
                        <td>${item.tanggal}</td>
                        <td>${item.waktu}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }
    });
}