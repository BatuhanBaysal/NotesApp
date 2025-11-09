# 🔐 Back-end Proje Detayı: Spring Boot API

Bu belge, **Full-Stack Not Yönetim Sistemi**'nin arka yüzünü oluşturan Spring Boot projesinin mimarisini, güvenlik yaklaşımını ve tüm REST API endpoint'lerini detaylıca açıklamaktadır.

---

### 🎯 Mimari Yaklaşım: Üç Katmanlı Mimari

Proje, temiz sorumluluk ayrılığı için standart **Üç Katmanlı Mimari (Controller, Service, Repository)** desenini katı bir şekilde uygular.

| Katman | Sorumluluk | Uygulanan Desenler |
| :--- | :--- | :--- |
| **Controller** | HTTP İsteklerini Karşılama ve Yönlendirme. | RESTful prensipleri, API Endpoint tanımı. |
| **Service** | **İş Mantığı**nın yürütülmesi, Yetkilendirme Kontrolü, Veri Dönüşümü (DTO/Entity). | Transaction Management, Dependency Injection. |
| **Repository** | Veritabanı ile doğrudan iletişim. | **Spring Data JPA**, Paginasyon ve Arama Metodları. |

> **⭐ Önemli Vurgu: Paginasyon (Sayfalama)**
> Listeleme işlemlerinde (Notlar ve Kullanıcılar), `Pageable` arayüzü kullanılarak sunucu taraflı sayfalama (`Spring Data Paging`) uygulanmıştır. Bu, uygulamanın büyük veri kümelerine karşı performansını korumasını sağlar.

---

### 🛡️ Güvenlik Mimarisi: JWT ve RBAC

Projenin güvenliği, modern, durum bilgisi olmayan (Stateless) bir yaklaşımla sağlanmıştır.

#### 1. JSON Web Token (JWT)

| Sınıf / Konfigürasyon | Rolü | Vurgu |
| :--- | :--- | :--- |
| `SecurityConfig` | Güvenlik zincirini (Security Filter Chain) tanımlar. **CORS** ve **CSRF** ayarları burada yapılır. | Her isteğin durum bilgisiz (stateless) olduğunu belirtir. |
| `JwtAuthenticationFilter` | Gelen her istekte `Authorization` başlığını kontrol eder, token'ı ayrıştırır ve kullanıcıyı doğrular. | **Token Validasyonu** ve SecurityContext'e kullanıcı bilgilerini yerleştirme. |
| `AuthenticationController` | Kullanıcı girişi (`/login`) ve kaydı (`/register`) endpoint'lerini yönetir. | **Kullanıcı şifrelemesi** için `PasswordEncoder` kullanır. |

#### 2. Role-Based Access Control (RBAC)

* `Role` (Enum) bilgisi, kullanıcının yetkilerini belirler.
* Yöneticiye özel endpoint'ler, Spring Security'nin `@PreAuthorize("hasRole('ADMIN')")` anotasyonları ile korunmuştur. Bu, yetkisiz erişimi engeller.

---

### 🔌 API Endpoint Detayları (Postman Hazır)

Tüm endpoint'ler `http://localhost:8080/api/` ön ekiyle başlar.

#### A. Kimlik Doğrulama (Authentication)

| HTTP Metodu | Endpoint | Gerekli Rol | Açıklama |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | USER / ADMIN | Yeni bir kullanıcı hesabı oluşturur. |
| `POST` | `/auth/login` | USER / ADMIN | Kullanıcı girişi. Başarılı olursa **JWT Token** ve kullanıcı bilgilerini döndürür. |

#### B. Not Yönetimi (Note Controller - Korumalı)

Bu endpoint'ler sadece oturum açmış kullanıcıya (USER veya ADMIN) özeldir ve her kullanıcı sadece kendi notlarına erişebilir.

| HTTP Metodu | Endpoint                   | Gerekli Rol | Açıklama |
| :--- |:---------------------------| :--- | :--- |
| `GET` | `/api/notes/all`           | USER / ADMIN | Oturum açmış kullanıcının tüm notlarını **Paginasyon** ile listeler. |
| `GET` | `/api/notes/{id}`          | USER / ADMIN | Belirtilen ID'ye sahip notu getirir. (Not sahibi kontrolü yapılır.) |
| `POST` | `/api/notes/create`        | USER / ADMIN | Yeni bir not oluşturur. |
| `PUT` | `/api/notes/update/{id}`   | USER / ADMIN | Var olan notu günceller. |
| `DELETE` | `/api/notes/deleteId/{id}` | USER / ADMIN | Notu siler. |

#### C. Yönetici İşlemleri (Admin Controller - RBAC Korumalı)

Bu endpoint'ler **kesinlikle sadece ADMIN rolüne sahip kullanıcılar** tarafından erişilebilir.

| HTTP Metodu | Endpoint | Gerekli Rol | Açıklama                                                                           |
| :--- | :--- | :--- |:-----------------------------------------------------------------------------------|
| `POST` | `/api/auth/register` | USER / ADMIN | Yeni bir kullanıcı hesabı oluşturur.                                               |
| `POST` | `/api/auth/login` | USER / ADMIN | Kullanıcı girişi. Başarılı olursa **JWT Token** ve kullanıcı bilgilerini döndürür. |
| `GET` | `/api/admin/users` | ADMIN | Sadece Admin rolüne sahip kişiler için başarılı dönüş sağlar.                      |

---

### ⚙️ Merkezi Hata Yönetimi ve Persistence (Kalıcılık)

#### 1. Global Exception Handling

* `exception/GlobalExceptioHandler.java` sınıfı kullanılarak tüm uygulama genelindeki hatalar merkezi olarak yönetilir.
* Örnekler: `ResourceNotFoundException` -> **404 Not Found**, Veri giriş hataları -> **400 Bad Request**.

#### 2. Veritabanı İlişkisi (Persistence)

* `NoteEntity` ve `UserEntity` arasında **One-to-Many** ilişkisi mevcuttur.
* Bu ilişki, Spring Data JPA tarafından yönetilir ve her notun sistemde var olan bir kullanıcıya ait olmasını (foreign key) zorunlu kılar.

---

### 🧪 Sonraki Adımlar

Back-end projesini daha da güçlendirmek için planlanan geliştirmeler şunlardır:

* **Token Yenileme (Refresh Token):** Uzun süreli oturum yönetimi için daha güvenli bir Refresh Token mekanizması entegrasyonu.
* **Unit Testler:** `Service` katmanındaki iş mantığını **JUnit** ve **Mockito** kullanarak kapsamlı bir şekilde test etmek.
* **Swagger/OpenAPI:** API dokümantasyonunu otomatik oluşturmak için Swagger entegrasyonu.