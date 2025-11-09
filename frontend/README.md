# 🎨 Front-end Proje Detayı: React Single Page Application (SPA)

Bu belge, **Full-Stack Not Yönetim Sistemi**'nin kullanıcı arayüzünü oluşturan React (Vite tabanlı) projesinin mimarisini, kullanılan modern pratikleri ve kurulum adımlarını detaylıca açıklamaktadır.

---

### ⚛️ Mimarinin Temel Prensipleri

Front-end projesi, temiz kod ve ölçeklenebilirliği destekleyen modern React pratikleriyle geliştirilmiştir:

| Prensipler | Açıklama | Uygulanan Yapılar |
| :--- | :--- | :--- |
| **Bileşen Temelli Yaklaşım** | Arayüzü küçük, bağımsız ve yeniden kullanılabilir parçalara bölme. | `components` ve `pages` dizinleri. |
| **Merkezi State Yönetimi** | Global olarak ihtiyaç duyulan verileri (Kullanıcı, Tema) tek bir yerden yönetme. | **React Context API** (`AuthContext`, `ThemeContext`). |
| **Routing ve Yetkilendirme** | Uygulama içi sayfa geçişlerini yönetme ve yetkiye dayalı erişim kontrolü. | `React Router DOM v6`, `AdminRoute` bileşeni. |
| **Gelişmiş HTTP Yönetimi** | API çağrılarında hataları ve JWT gönderme işlemini otomatikleştirme. | **Axios Interceptor** yapısı. |

---

### ⚙️ Front-end Dizin Yapısı ve Sorumlulukları

| Dizin | Sorumluluk | Kritik Bileşen/Dosya | Vurgu |
| :--- | :--- | :--- | :--- |
| `pages` | Ana Görünümler | `HomePage`, `AdminPage`, `LoginPage` | `React Router` ile doğrudan eşleşen ana bileşenlerdir. |
| `components` | UI Parçaları | `Navbar.jsx`, `NoteForm.jsx` | Tekrar kullanılabilirlik için tasarlanmış, genellikle props alan "dumb" bileşenlerdir. |
| `context` | Global State | `AuthContext.jsx`, `ThemeContext.jsx` | JWT, kullanıcı bilgileri ve tema durumu gibi global verileri tüm uygulamaya sağlar. |
| `services` | API İletişimi | `AuthApiService.js`, `NoteApiService.js` | Tüm Back-end API çağrılarını içerir. **Axios Interceptor** burada yapılandırılmıştır. |
| `routes` | Özel Rotalar | `AdminRoute.jsx` | Kullanıcının rolüne göre (Admin olup olmadığına) bakarak korumalı sayfalara erişimi kontrol eder. |

---

### 🔑 Kritik Yapılar ve Modern Pratikler

#### 1. Merkezi State Yönetimi (Context API)

* `AuthContext.jsx` dosyası, kullanıcının oturum açma/kapama durumunu ve JWT'yi global olarak tutar. Bu sayede, herhangi bir bileşen, props geçirmeden kullanıcı verisine erişebilir.
* JWT, Context tarafından yönetilir ve kullanıcının tarayıcıda kalıcı olması için yerel depolamada (`localStorage`) saklanır.

#### 2. Axios Interceptor ile Hata Yönetimi

* `services` klasöründe tanımlanan Axios örneği, isteği göndermeden önce (request) ve yanıtı almadan önce (response) araya girer (intercept).
* **Request Interceptor:** Her API isteğine otomatik olarak JWT'yi `Authorization: Bearer [Token]` başlığı olarak ekler.
* **Response Interceptor:** Back-end'den dönen **401 (Unauthorized)** veya **403 (Forbidden)** hatalarını yakalar ve kullanıcıyı otomatik olarak çıkış yapmaya (`logout`) yönlendirir. Bu, tutarlı ve merkezi bir güvenlik yönetimi sağlar.

#### 3. Tema Yönetimi (ThemeContext)

* Kullanıcının tercihi (Light/Dark Mode) `ThemeContext` tarafından tutulur.
* Tema geçişi, global CSS değişkenlerinin (`index.css` veya `main.css` içinde) dinamik olarak güncellenmesiyle sağlanır.

---

## 🛠️ Kurulum Adımları ve Geliştirme Ortamı

Front-end projesini çalıştırmak için **Node.js (v18+)** ve **NPM** gereklidir.

### A. Proje Hazırlığı

1.  **Dizin Değiştirme:** Terminalde `frontend` klasörüne gidin:
    ```bash
    cd frontend
    ```
2.  **Temel Bağımlılıkları Yükleme:** Projenin ana bağımlılıklarını (React, Vite) yükleyin:
    ```bash
    npm install
    ```
3.  **Gerekli Ek Kütüphaneler:** Bu projede kullanılan ve kurulumu gerekli olan kritik kütüphaneleri ayrıca yükleyin:
    ```bash
    # Routing, API İletişimi, İkonlar
    npm install react-router-dom axios react-icons
    ```

### B. Projeyi Çalıştırma

1.  **Geliştirme Sunucusunu Başlatma:** Vite sunucusunu başlatın:
    ```bash
    npm run dev
    ```
2.  **Erişim:** Tarayıcınızı konsolda belirtilen adrese (genellikle `http://localhost:5173/`) yönlendirin.

> **❗ Önemli Not:** Front-end'in başarılı bir şekilde çalışabilmesi için **Back-end API'sinin** (`http://localhost:8080`) **mutlaka çalışır durumda olması gerekir.**

---

### 🧪 Sonraki Adımlar ve İyileştirmeler

Front-end katmanının daha da güçlendirilmesi için hedefler:

1.  **Unit Testler:** **Jest** ve **React Testing Library** kullanarak kritik bileşenlerin (`Navbar`, `NoteForm`) ve özel hook'ların testlerinin yazılması.
2.  **Daha Detaylı Kullanıcı Deneyimi:** Formlar için `react-hook-form` gibi kütüphanelerle daha gelişmiş form doğrulama ve durum yönetimi eklenmesi.
3.  **Bileşen Kütüphanesi:** Styling ve UI için **Tailwind CSS** veya **MUI (Material UI)** gibi bir bileşen kütüphanesine geçiş yaparak geliştirme hızını ve tutarlılığı artırmak.