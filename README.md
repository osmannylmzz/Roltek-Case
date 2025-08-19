# Roltek-Case
Roltek Stajyer Teknik Case — Device Management (Spring Boot + Next.js)

Kullanıcıların giriş yapıp kendi cihazlarını (CRUD) yönettiği, JWT korumalı, full-stack bir örnek uygulama.

Backend: Java 17, Spring Boot 3, Spring Security, JPA, H2/PostgreSQL, JWT (jjwt), BCrypt, Swagger

Frontend: Next.js (App Router, TS), React Query v5, Axios, RHF + Zod, Tailwind, react-hot-toast

📁 Proje Yapısı
.
├─ backend/           # Spring Boot REST API
│  ├─ src/main/java/com/roltek/devices/...
│  └─ src/main/resources/application.properties
└─ frontend/          # Next.js (TypeScript) UI
   ├─ app/
   ├─ components/
   └─ lib/

🚀 Hızlı Başlangıç
Gereksinimler

Backend: Java 17+, Maven 3.9+

Frontend: Node.js 18+, pnpm / yarn / npm

1) Backend’i Çalıştır

backend/src/main/resources/application.properties (geliştirme için örnek):

# H2 (in-memory)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.datasource.url=jdbc:h2:mem:testdb

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false

# CORS (frontend origin)
app.cors.allowed-origins=http://localhost:3000

# JWT (>= 256-bit base64 zorunlu)
jwt.secret=3nGXSZ1iVq3pM2xUe7s7i7c1E7wC0b8hF0Y0KQqg1qA=


Çalıştır:

cd backend
./mvnw spring-boot:run    # Windows: mvnw spring-boot:run


Açılan yardımcı ekranlar:

Swagger UI: http://localhost:8080/swagger-ui/index.html

H2 Console: http://localhost:8080/h2-console
 (JDBC URL: jdbc:h2:mem:testdb)

Uygulama start alırken demo kullanıcılar otomatik eklenir:

demo@roltek.com / Demo1234!

demo2@roltek.com / Demo1234!

2) Frontend’i Çalıştır

.env.local:

NEXT_PUBLIC_API_URL=http://localhost:8080


Kur ve çalıştır:

cd frontend
pnpm install            # veya yarn / npm i
pnpm add react-hot-toast
pnpm dev


Yönlendirmeler:

/login → Giriş

/devices → Cihaz listesi/ekle/düzenle/sil (auth zorunlu)

🔐 Kimlik Doğrulama

Giriş: POST /auth/login

{ "email": "demo@roltek.com", "password": "Demo1234!" }


Yanıt:

{ "accessToken": "<JWT>" }


Korumalı isteklerde:
Authorization: Bearer <JWT>

Token süresi dolduğunda API 401 döndürür; frontend interceptor otomatik logout edip /login’a yönlendirir.

🧠 Veri Modeli

Device

UUID id;
String name;
DeviceType type;     // SENSOR, CAMERA, LIGHT, OTHER
String serialNumber; // unique
LocalDateTime createdAt;
User owner;          // @ManyToOne


Not: owner request’te gönderilmez. Sunucu, JWT’den aktif kullanıcıyı alıp otomatik set eder.
İsteğe bağlı olarak response DTO’da userId döndürülebilir.

📚 API Uçları
Auth

POST /auth/login → { accessToken }

Devices (JWT zorunlu)

GET /devices — Sayfalı liste
Query: page, size, sort, q, type
Örnek:
GET /devices?page=0&size=10&sort=createdAt,desc&q=sensor&type=SENSOR

GET /devices/{id}

POST /devices

PUT /devices/{id}

DELETE /devices/{id}

Örnek İstek (Create/Update)
{
  "name": "Living Room Sensor",
  "type": "SENSOR",           // SENSOR | CAMERA | LIGHT | OTHER
  "serialNumber": "SN-1001"
}

Örnek Yanıt (DeviceDto)
{
  "id": "4e4c6a5c-....",
  "name": "Living Room Sensor",
  "type": "SENSOR",
  "serialNumber": "SN-1001",
  "createdAt": "2025-08-19T10:15:30",
  "userId": "b02c8c16-...."      // opsiyonel
}


Kısıtlar & Hatalar

Başka kullanıcının cihazına erişim: 403 Forbidden

Bulunamadı: 404 Not Found

serialNumber tekil değil: 409 Conflict

Doğrulama: 400 Bad Request

Yetki yok/token yok: 401 Unauthorized

🖥️ Frontend Özellikleri

Auth Guard: /devices sayfası token yoksa /login’a atar.

Axios Interceptor: Tüm isteklere Authorization ekler; 401’de otomatik logout + toast.

React Query v5: Server-side pagination, arama (q) ve type filtresi.

Formlar: React Hook Form + Zod doğrulama (enum select).

UI Durumları: loading / empty / error state’leri.

Toast Bildirimleri: react-hot-toast.

🧪 Hızlı cURL Testleri
# Login → token al
curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@roltek.com","password":"Demo1234!"}'

# TOKEN=<çıkan JWT'yi kopyala>

# Liste
curl -s "http://localhost:8080/devices?page=0&size=10&sort=createdAt,desc" \
  -H "Authorization: Bearer $TOKEN"

# Oluştur
curl -s -X POST http://localhost:8080/devices \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Env Sensor","type":"SENSOR","serialNumber":"SN-1001"}'

# Çakışma testi (aynı seri no)
curl -s -X POST http://localhost:8080/devices \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Other","type":"SENSOR","serialNumber":"SN-1001"}'
# => 409
