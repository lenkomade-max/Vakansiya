# Оптимизированный список категорий для генерации изображений

## Стратегия объединения: вместо 152 → **30-35 уникальных изображений**

---

## ГРУППИРОВКА ПО СХОЖЕСТИ

### 1️⃣ **СТРОИТЕЛЬСТВО И РЕМОНТ** (1 изображение)
**Используется для:**
- Construction (Tikinti işləri) - gundelik
- ConstructionWorker (Tikinti işçisi) - vacancy
- Foreman (Usta) - vacancy
- ConstructionMain - главная категория

**Промпт:**
```
Professional photo of construction workers at building site in Baku, wearing safety helmets and vests, modern residential construction, natural daylight, realistic photography --ar 16:9
```

---

### 2️⃣ **ЭЛЕКТРИК** (1 изображение)
**Используется для:**
- Electrician (Elektrik) - gundelik
- Electrician (Elektrik) - vacancy

**Промпт:**
```
Professional electrician working with electrical panel, testing equipment, modern apartment in Baku, focused work, natural lighting --ar 16:9
```

---

### 3️⃣ **САНТЕХНИК** (1 изображение)
**Используется для:**
- Plumber (Santexnik) - gundelik
- Plumber (Santexnik) - vacancy

**Промпт:**
```
Professional plumber repairing pipes, tools and equipment, modern bathroom, Azerbaijan apartment, professional service --ar 16:9
```

---

### 4️⃣ **ПОКРАСКА / ОТДЕЛКА** (1 изображение)
**Используется для:**
- Painter (Rəngsaz) - gundelik
- Carpenter (Dülgər) - gundelik

**Промпт:**
```
Professional painter with roller painting white wall, clean workspace, modern apartment interior, natural lighting, professional work --ar 16:9
```

---

### 5️⃣ **ПЕРЕЕЗД / ГРУЗЧИКИ** (1 изображение)
**Используется для:**
- Moving (Köçürmə) - gundelik
- Loading (Yükləmə/Boşaltma) - gundelik
- Loader (Yükləyici) - vacancy

**Промпт:**
```
Professional movers carrying furniture boxes, team work, moving truck in background, Baku street, efficient service --ar 16:9
```

---

### 6️⃣ **ВОДИТЕЛИ** (1 изображение)
**Используется для:**
- Driving (Sürücülük) - gundelik
- Driver (Sürücü) - vacancy

**Промпт:**
```
Professional driver in clean modern car, Baku city roads, confident posture, professional taxi/delivery service, daytime --ar 16:9
```

---

### 7️⃣ **ДОСТАВКА / КУРЬЕРЫ** (1 изображение)
**Используется для:**
- Delivery (Çatdırılma) - gundelik
- Courier (Kuryer) - gundelik
- Courier (Kuryer) - vacancy

**Промпт:**
```
Delivery courier with thermal bag on motorcycle, Baku streets, modern delivery service, professional uniform, fast service --ar 16:9
```

---

### 8️⃣ **ЛОГИСТИКА / СКЛАД** (1 изображение)
**Используется для:**
- TransportLogistics (Logistika) - gundelik
- Warehouse (Anbar işləri) - gundelik
- Packing (Qablaşdırma) - gundelik
- Sorting (Sortirovka) - gundelik
- LogisticsManager (Logistika meneceri) - vacancy
- WarehouseManager (Anbar meneceri) - vacancy

**Промпт:**
```
Modern warehouse interior with organized shelves, logistics professional with tablet checking inventory, clean organized space, professional lighting --ar 16:9
```

---

### 9️⃣ **УБОРКА** (1 изображение)
**Используется для:**
- Cleaning (Təmizlik) - gundelik
- Cleaner (Təmizlikçi) - vacancy

**Промпт:**
```
Professional cleaning service, person cleaning modern apartment with equipment, clean bright interior, professional service, natural lighting --ar 16:9
```

---

### 🔟 **КУЛИНАРИЯ / ПОВАРА** (1 изображение)
**Используется для:**
- Cooking (Aşpazlıq) - gundelik
- Chef (Aşpaz) - gundelik
- Chef (Aşpaz) - vacancy

**Промпт:**
```
Professional chef preparing food in modern restaurant kitchen, white uniform, professional equipment, clean workspace, culinary expertise --ar 16:9
```

---

### 1️⃣1️⃣ **САДОВОДСТВО** (1 изображение)
**Используется для:**
- Gardening (Bağçılıq) - gundelik

**Промпт:**
```
Gardener working in beautiful garden, trimming plants, green landscape, Azerbaijan villa, professional gardening tools, sunny day --ar 16:9
```

---

### 1️⃣2️⃣ **УХОД / ЗАБОТА** (1 изображение)
**Используется для:**
- Care (Baxıcılıq) - gundelik
- HomeStaff (Ev işçiləri) - gundelik

**Промпт:**
```
Professional caregiver with elderly person or child in comfortable home setting, caring atmosphere, Azerbaijan home interior, warm lighting --ar 16:9
```

---

### 1️⃣3️⃣ **РЕСТОРАН / ОФИЦИАНТЫ** (1 изображение)
**Используется для:**
- Restaurant (Restoran işi) - gundelik
- Waiter (Ofisiant) - gundelik
- Waiter (Ofisiant) - vacancy

**Промпт:**
```
Professional waiter serving in modern Baku restaurant, elegant uniform, carrying tray, upscale dining atmosphere, professional service --ar 16:9
```

---

### 1️⃣4️⃣ **БАРИСТА / БАРМЕН** (1 изображение)
**Используется для:**
- Barista (Barista) - vacancy
- Bartender (Barmen) - vacancy

**Промпт:**
```
Professional barista making coffee with espresso machine, modern cafe in Baku, coffee art, professional equipment, cozy atmosphere --ar 16:9
```

---

### 1️⃣5️⃣ **МЕНЕДЖЕР РЕСТОРАНА** (1 изображение)
**Используется для:**
- RestaurantManager (Restoran meneceri) - vacancy

**Промпт:**
```
Restaurant manager in elegant restaurant, professional attire, tablet in hand, managing staff, upscale Baku restaurant interior --ar 16:9
```

---

### 1️⃣6️⃣ **МЕРОПРИЯТИЯ / ПРОМОУТЕРЫ** (1 изображение)
**Используется для:**
- Event (Tədbir köməkçisi) - gundelik
- Promotion (Promoter) - gundelik
- TourGuide (Tur bələdçisi) - vacancy

**Промпт:**
```
Event staff at corporate event in Baku, professional attire, welcoming guests, modern conference hall, professional event atmosphere --ar 16:9
```

---

### 1️⃣7️⃣ **ОФИСНАЯ РАБОТА** (1 изображение)
**Используется для:**
- Administration (İnzibati kömək) - gundelik
- DataEntry (Məlumat daxiletməsi) - gundelik
- Helper (Ofis köməkçisi) - gundelik
- Reception (Resepşn) - gundelik
- Assistant (Assistent) - vacancy
- Secretary (Katib) - vacancy

**Промпт:**
```
Professional office worker at modern desk with computer, organized workspace, glass office in Baku business center, natural light, corporate atmosphere --ar 16:9
```

---

### 1️⃣8️⃣ **ОФИС-МЕНЕДЖЕР** (1 изображение)
**Используется для:**
- OfficeManager (Ofis meneceri) - vacancy

**Промпт:**
```
Professional office manager in modern Baku office, coordinating team, tablet and documents, glass office, business professional attire --ar 16:9
```

---

### 1️⃣9️⃣ **РЕСЕПШН** (1 изображение)
**Используется для:**
- Receptionist (Resepşn) - vacancy

**Промпт:**
```
Professional receptionist at modern reception desk, welcoming smile, elegant office lobby in Baku, professional corporate environment --ar 16:9
```

---

### 2️⃣0️⃣ **ДИЗАЙН (ГРАФИКА)** (1 изображение)
**Используется для:**
- Design (Dizayn) - gundelik
- GraphicDesigner (Qrafik dizayner) - vacancy
- WebDesigner (Web Designer) - vacancy

**Промпт:**
```
Graphic designer working on creative project, dual monitors showing design work, modern creative studio in Baku, artistic workspace --ar 16:9
```

---

### 2️⃣1️⃣ **UX/UI ДИЗАЙН** (1 изображение)
**Используется для:**
- UXUIDesigner (UX/UI Designer) - vacancy

**Промпт:**
```
UX/UI designer working on interface design, Figma on screen, modern tech office, tablet with stylus, creative professional workspace --ar 16:9
```

---

### 2️⃣2️⃣ **ИНТЕРЬЕР / MOTION** (1 изображение)
**Используется для:**
- MotionDesigner (Motion Designer) - vacancy
- InteriorDesigner (İnteryer dizayneri) - vacancy

**Промпт:**
```
Interior designer working on project with samples and tablet, modern showroom, elegant design materials, professional creative work --ar 16:9
```

---

### 2️⃣3️⃣ **ФОТОГРАФИЯ / ВИДЕО** (1 изображение)
**Используется для:**
- Photography (Fotoqrafiya) - gundelik
- VideoOperator (Video operator) - gundelik
- Photographer (Fotoqraf) - vacancy

**Промпт:**
```
Professional photographer with camera on tripod, shooting in studio or Baku location, professional lighting equipment, creative work --ar 16:9
```

---

### 2️⃣4️⃣ **МАРКЕТИНГ** (1 изображение)
**Используется для:**
- Marketing (Marketinq) - gundelik
- MarketingManager (Marketinq meneceri) - vacancy
- BrandManager (Brand Manager) - vacancy
- ContentManager (Kontent meneceri) - vacancy

**Промпт:**
```
Marketing professional presenting strategy on screen, modern office meeting room, charts and analytics, professional business environment --ar 16:9
```

---

### 2️⃣5️⃣ **SMM / SEO / PR** (1 изображение)
**Используется для:**
- SMMManager (SMM Manager) - vacancy
- SEOSpecialist (SEO Specialist) - vacancy
- PRManager (PR Manager) - vacancy

**Промпт:**
```
Social media manager working with multiple screens showing analytics and social platforms, modern creative office, professional digital marketing --ar 16:9
```

---

### 2️⃣6️⃣ **IT РАЗРАБОТКА** (1 изображение)
**Используется для:**
- IT (İT xidmətləri) - gundelik
- WebDev (Veb proqramlaşdırma) - gundelik
- FrontendDev (Frontend Developer) - vacancy
- BackendDev (Backend Developer) - vacancy
- FullStackDev (Full Stack Developer) - vacancy
- MobileDev (Mobile Developer) - vacancy

**Промпт:**
```
Software developer coding on laptop with multiple monitors, modern code editor, tech startup office in Baku, professional developer workspace --ar 16:9
```

---

### 2️⃣7️⃣ **IT ИНФРАСТРУКТУРА** (1 изображение)
**Используется для:**
- ComputerRepair (Kompüter təmiri) - gundelik
- TechSupport (Texniki dəstək) - gundelik
- DevOps (DevOps Engineer) - vacancy
- SystemAdmin (System Administrator) - vacancy
- ITSupport (IT Support) - vacancy

**Промпт:**
```
IT specialist working with server equipment or repairing computer, professional tools, modern tech room, technical expertise --ar 16:9
```

---

### 2️⃣8️⃣ **QA / DATA ANALYST** (1 изображение)
**Используется для:**
- QAEngineer (QA Engineer) - vacancy
- DataAnalyst (Data Analyst) - vacancy

**Промпт:**
```
Data analyst working with analytics dashboards and charts on multiple screens, modern tech office, professional data analysis work --ar 16:9
```

---

### 2️⃣9️⃣ **ОБРАЗОВАНИЕ** (1 изображение)
**Используется для:**
- Education (Təhsil) - gundelik
- Tutor (Repetitor) - gundelik
- Tutor (Repetitor) - vacancy
- LanguageTeacher (Dil müəllimi) - gundelik
- Teacher (Müəllim) - vacancy
- LanguageTeacher (Xarici dil müəllimi) - vacancy
- TrainingSpecialist (Təlim mütəxəssisi) - vacancy

**Промпт:**
```
Professional teacher in modern classroom or tutoring session, whiteboard with materials, engaging with students, educational environment --ar 16:9
```

---

### 3️⃣0️⃣ **ПЕРЕВОД** (1 изображение)
**Используется для:**
- Translation (Tərcümə) - gundelik
- Translator (Tərcüməçi) - vacancy

**Промпт:**
```
Professional translator working with documents and computer, multiple language dictionaries, modern office workspace, concentration and expertise --ar 16:9
```

---

### 3️⃣1️⃣ **МЕДИЦИНА** (1 изображение)
**Используется для:**
- Healthcare (Tibb xidməti) - gundelik
- Nurse (Tibb bacısı) - gundelik
- Nurse (Tibb bacısı) - vacancy
- Doctor (Həkim) - vacancy
- MedicalAssistant (Tibb köməkçisi) - vacancy
- LabTechnician (Laborant) - vacancy

**Промпт:**
```
Professional healthcare worker in modern medical clinic in Baku, white coat, medical equipment, professional healthcare environment --ar 16:9
```

---

### 3️⃣2️⃣ **АПТЕКА** (1 изображение)
**Используется для:**
- Pharmacist (Əczaçı) - vacancy

**Промпт:**
```
Professional pharmacist in modern pharmacy, organizing medications, white coat, clean professional pharmacy interior in Baku --ar 16:9
```

---

### 3️⃣3️⃣ **КРАСОТА / МАССАЖ / ФИТНЕС** (1 изображение)
**Используется для:**
- Beauty (Gözəllik xidməti) - gundelik
- Massage (Masaj) - gundelik
- Fitness (Fitnes məşqçisi) - gundelik

**Промпт:**
```
Beauty specialist or fitness trainer in modern salon or gym, professional service, clean bright space in Baku, wellness atmosphere --ar 16:9
```

---

### 3️⃣4️⃣ **ФИНАНСЫ / БУХГАЛТЕРИЯ** (1 изображение)
**Используется для:**
- Finance (Maliyyə) - gundelik
- Accountant (Mühasib) - gundelik
- Accountant (Mühasib) - vacancy
- FinanceManager (Maliyyə meneceri) - vacancy
- FinanceAnalyst (Maliyyə analitiki) - vacancy
- Auditor (Auditor) - vacancy
- Economist (İqtisadçı) - vacancy

**Промпт:**
```
Finance professional working with financial documents and calculator, computer with spreadsheets, modern corporate office in Baku --ar 16:9
```

---

### 3️⃣5️⃣ **HR / РЕКРУТИНГ** (1 изображение)
**Используется для:**
- HR (Kadr xidməti) - gundelik
- HRManager (HR meneceri) - vacancy
- Recruiter (Recruiter) - vacancy

**Промпт:**
```
HR professional conducting interview in modern office, professional atmosphere, Baku business center, corporate meeting room --ar 16:9
```

---

### 3️⃣6️⃣ **ЮРИСТЫ** (1 изображение)
**Используется для:**
- Legal (Hüquqi məsləhət) - gundelik
- Lawyer (Hüquqşünas) - vacancy

**Промпт:**
```
Professional lawyer in office with law books and documents, formal attire, modern law office in Baku, professional legal atmosphere --ar 16:9
```

---

### 3️⃣7️⃣ **ПРОДАЖИ** (1 изображение)
**Используется для:**
- Sales (Satış) - gundelik
- SalesManager (Satış meneceri) - vacancy
- AccountManager (Account Manager) - vacancy
- SalesConsultant (Satış məsləhətçisi) - vacancy
- BusinessDev (Business Development) - vacancy
- SalesRep (Satış nümayəndəsi) - vacancy

**Промпт:**
```
Sales professional in meeting with client, modern office or showroom, professional presentation, business atmosphere in Baku --ar 16:9
```

---

### 3️⃣8️⃣ **КАССИР** (1 изображение)
**Используется для:**
- Cashier (Kassir) - vacancy

**Промпт:**
```
Professional cashier at modern cash register in retail store, friendly service, organized checkout area, professional retail environment --ar 16:9
```

---

### 3️⃣9️⃣ **ИНЖЕНЕР / АРХИТЕКТОР** (1 изображение)
**Используется для:**
- Engineer (Mühəndis) - vacancy
- Architect (Arxitektor) - vacancy

**Промпт:**
```
Professional engineer or architect working with blueprints and laptop, construction plans, modern architecture office in Baku --ar 16:9
```

---

### 4️⃣0️⃣ **АВТОМЕХАНИК** (1 изображение)
**Используется для:**
- Auto (Avtomobil xidməti) - gundelik
- Mechanic (Avtomexanik) - gundelik
- Mechanic (Avtomexanik) - vacancy

**Промпт:**
```
Professional auto mechanic working under car hood in modern service garage, professional tools, clean organized workspace --ar 16:9
```

---

### 4️⃣1️⃣ **ОХРАНА** (1 изображение)
**Используется для:**
- Security (Təhlükəsizlik) - gundelik
- Security (Mühafizəçi) - vacancy

**Промпт:**
```
Professional security guard in uniform at building entrance, modern business center in Baku, professional security service --ar 16:9
```

---

### 4️⃣2️⃣ **ПРОМЫШЛЕННОСТЬ** (1 изображение)
**Используется для:**
- Industry (Sənaye işçisi) - gundelik

**Промпт:**
```
Industrial worker in factory or production facility, safety equipment, modern industrial environment, professional work --ar 16:9
```

---

### 4️⃣3️⃣ **УНИВЕРСАЛЬНОЕ "ДРУГОЕ"** (1 изображение)
**Используется для:**
- Other (Digər) - gundelik
- Other (Digər) - vacancy
- ConstructionMain, TransportMain, HomeServicesMain и другие "Main" категории

**Промпт:**
```
Diverse group of professionals from different industries, collage style, modern Baku workplaces, variety of occupations, professional atmosphere --ar 16:9
```

---

## ИТОГОВАЯ СТАТИСТИКА

### Было: **152 категории**
### Стало: **43 уникальных изображения**

### Оптимизация: **72% экономия**

---

## КАРТА ИСПОЛЬЗОВАНИЯ

| Изображение | Количество категорий | Экономия |
|------------|---------------------|----------|
| Строительство | 4 | 3 фото |
| Электрик | 2 | 1 фото |
| Сантехник | 2 | 1 фото |
| Покраска | 2 | 1 фото |
| Переезд/грузчики | 3 | 2 фото |
| Водители | 2 | 1 фото |
| Доставка/курьеры | 3 | 2 фото |
| Логистика/склад | 6 | 5 фото |
| Уборка | 2 | 1 фото |
| Кулинария | 3 | 2 фото |
| Садоводство | 1 | 0 фото |
| Уход/забота | 2 | 1 фото |
| Ресторан/официанты | 3 | 2 фото |
| Бариста/бармен | 2 | 1 фото |
| Менеджер ресторана | 1 | 0 фото |
| Мероприятия | 3 | 2 фото |
| Офисная работа | 6 | 5 фото |
| Офис-менеджер | 1 | 0 фото |
| Ресепшн | 1 | 0 фото |
| Дизайн (графика) | 3 | 2 фото |
| UX/UI дизайн | 1 | 0 фото |
| Интерьер/motion | 2 | 1 фото |
| Фотография/видео | 3 | 2 фото |
| Маркетинг | 4 | 3 фото |
| SMM/SEO/PR | 3 | 2 фото |
| IT разработка | 6 | 5 фото |
| IT инфраструктура | 5 | 4 фото |
| QA/Data Analyst | 2 | 1 фото |
| Образование | 7 | 6 фото |
| Перевод | 2 | 1 фото |
| Медицина | 6 | 5 фото |
| Аптека | 1 | 0 фото |
| Красота/массаж/фитнес | 3 | 2 фото |
| Финансы/бухгалтерия | 7 | 6 фото |
| HR/рекрутинг | 3 | 2 фото |
| Юристы | 2 | 1 фото |
| Продажи | 6 | 5 фото |
| Кассир | 1 | 0 фото |
| Инженер/архитектор | 2 | 1 фото |
| Автомеханик | 3 | 2 фото |
| Охрана | 2 | 1 фото |
| Промышленность | 1 | 0 фото |
| Универсальное "другое" | 67 | 66 фото |

---

**ОБЩАЯ ЭКОНОМИЯ: 109 изображений не нужно генерировать!**

**Дата:** 2025-01-10
