-- ============================================
-- REORGANIZE CATEGORIES INTO PARENT-CHILD HIERARCHY
-- Автоматически создает главные категории и распределяет подкатегории
-- ============================================

-- ШАІГ 1: Удаляем старые категории для gundelik (чтобы избежать дублей)
DELETE FROM categories WHERE type = 'short_job';

-- ШАГ 2: Создаем ГЛАВНЫЕ КАТЕГОРИИ для Gündəlik İşlər (parent_id = NULL)
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active) VALUES
-- 1. Tikinti və təmir
('ConstructionMain', 'Tikinti və təmir', 'short_job', NULL, 1, true),
-- 2. Nəqliyyat
('TransportMain', 'Nəqliyyat', 'short_job', NULL, 2, true),
-- 3. Ev xidmətləri
('HomeServicesMain', 'Ev xidmətləri', 'short_job', NULL, 3, true),
-- 4. Restoran və turizm
('RestaurantMain', 'Restoran və turizm', 'short_job', NULL, 4, true),
-- 5. Anbar və logistika
('WarehouseMain', 'Anbar və logistika', 'short_job', NULL, 5, true),
-- 6. Ofis işləri
('OfficeMain', 'Ofis işləri', 'short_job', NULL, 6, true),
-- 7. Yaradıcılıq
('CreativeMain', 'Yaradıcılıq', 'short_job', NULL, 7, true),
-- 8. İT və texnologiya
('ITMain', 'İT və texnologiya', 'short_job', NULL, 8, true),
-- 9. Təhsil və tərcümə
('EducationMain', 'Təhsil və tərcümə', 'short_job', NULL, 9, true),
-- 10. Tibb və gözəllik
('HealthBeautyMain', 'Tibb və gözəllik', 'short_job', NULL, 10, true),
-- 11. Maliyyə və hüquq
('FinanceLegalMain', 'Maliyyə və hüquq', 'short_job', NULL, 11, true),
-- 12. Digər xidmətlər
('OtherServicesMain', 'Digər xidmətlər', 'short_job', NULL, 12, true);

-- ШАГ 3: Создаем ПОДКАТЕГОРИИ с привязкой к родителям

-- 1. Tikinti və təmir → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Construction', 'Tikinti işləri', 'short_job', id, 1, true FROM categories WHERE name = 'ConstructionMain' AND type = 'short_job'
UNION ALL
SELECT 'Electrician', 'Elektrik', 'short_job', id, 2, true FROM categories WHERE name = 'ConstructionMain' AND type = 'short_job'
UNION ALL
SELECT 'Plumber', 'Santexnik', 'short_job', id, 3, true FROM categories WHERE name = 'ConstructionMain' AND type = 'short_job'
UNION ALL
SELECT 'Painter', 'Rəngsaz', 'short_job', id, 4, true FROM categories WHERE name = 'ConstructionMain' AND type = 'short_job'
UNION ALL
SELECT 'Carpenter', 'Dülgər', 'short_job', id, 5, true FROM categories WHERE name = 'ConstructionMain' AND type = 'short_job'
UNION ALL
SELECT 'Moving', 'Köçürmə', 'short_job', id, 6, true FROM categories WHERE name = 'ConstructionMain' AND type = 'short_job';

-- 2. Nəqliyyat → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Driving', 'Sürücülük', 'short_job', id, 1, true FROM categories WHERE name = 'TransportMain' AND type = 'short_job'
UNION ALL
SELECT 'Delivery', 'Çatdırılma', 'short_job', id, 2, true FROM categories WHERE name = 'TransportMain' AND type = 'short_job'
UNION ALL
SELECT 'Courier', 'Kuryer', 'short_job', id, 3, true FROM categories WHERE name = 'TransportMain' AND type = 'short_job'
UNION ALL
SELECT 'TransportLogistics', 'Logistika', 'short_job', id, 4, true FROM categories WHERE name = 'TransportMain' AND type = 'short_job';

-- 3. Ev xidmətləri → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Cleaning', 'Təmizlik', 'short_job', id, 1, true FROM categories WHERE name = 'HomeServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Cooking', 'Aşpazlıq', 'short_job', id, 2, true FROM categories WHERE name = 'HomeServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Gardening', 'Bağçılıq', 'short_job', id, 3, true FROM categories WHERE name = 'HomeServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Care', 'Baxıcılıq (uşaq, yaşlı, heyvan)', 'short_job', id, 4, true FROM categories WHERE name = 'HomeServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'HomeStaff', 'Ev işçiləri', 'short_job', id, 5, true FROM categories WHERE name = 'HomeServicesMain' AND type = 'short_job';

-- 4. Restoran və turizm → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Restaurant', 'Restoran işi', 'short_job', id, 1, true FROM categories WHERE name = 'RestaurantMain' AND type = 'short_job'
UNION ALL
SELECT 'Waiter', 'Ofisiant', 'short_job', id, 2, true FROM categories WHERE name = 'RestaurantMain' AND type = 'short_job'
UNION ALL
SELECT 'Chef', 'Aşpaz', 'short_job', id, 3, true FROM categories WHERE name = 'RestaurantMain' AND type = 'short_job'
UNION ALL
SELECT 'Event', 'Tədbir köməkçisi', 'short_job', id, 4, true FROM categories WHERE name = 'RestaurantMain' AND type = 'short_job'
UNION ALL
SELECT 'Promotion', 'Promoter', 'short_job', id, 5, true FROM categories WHERE name = 'RestaurantMain' AND type = 'short_job';

-- 5. Anbar və logistika → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Warehouse', 'Anbar işləri', 'short_job', id, 1, true FROM categories WHERE name = 'WarehouseMain' AND type = 'short_job'
UNION ALL
SELECT 'Loading', 'Yükləmə/Boşaltma', 'short_job', id, 2, true FROM categories WHERE name = 'WarehouseMain' AND type = 'short_job'
UNION ALL
SELECT 'Packing', 'Qablaşdırma', 'short_job', id, 3, true FROM categories WHERE name = 'WarehouseMain' AND type = 'short_job'
UNION ALL
SELECT 'Sorting', 'Sortirovka', 'short_job', id, 4, true FROM categories WHERE name = 'WarehouseMain' AND type = 'short_job';

-- 6. Ofis işləri → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Administration', 'İnzibati kömək', 'short_job', id, 1, true FROM categories WHERE name = 'OfficeMain' AND type = 'short_job'
UNION ALL
SELECT 'DataEntry', 'Məlumat daxiletməsi', 'short_job', id, 2, true FROM categories WHERE name = 'OfficeMain' AND type = 'short_job'
UNION ALL
SELECT 'Helper', 'Ofis köməkçisi', 'short_job', id, 3, true FROM categories WHERE name = 'OfficeMain' AND type = 'short_job'
UNION ALL
SELECT 'Reception', 'Resepşn', 'short_job', id, 4, true FROM categories WHERE name = 'OfficeMain' AND type = 'short_job';

-- 7. Yaradıcılıq → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Design', 'Dizayn', 'short_job', id, 1, true FROM categories WHERE name = 'CreativeMain' AND type = 'short_job'
UNION ALL
SELECT 'Photography', 'Fotoqrafiya', 'short_job', id, 2, true FROM categories WHERE name = 'CreativeMain' AND type = 'short_job'
UNION ALL
SELECT 'VideoOperator', 'Video operator', 'short_job', id, 3, true FROM categories WHERE name = 'CreativeMain' AND type = 'short_job'
UNION ALL
SELECT 'Marketing', 'Marketinq', 'short_job', id, 4, true FROM categories WHERE name = 'CreativeMain' AND type = 'short_job';

-- 8. İT və texnologiya → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'IT', 'İT xidmətləri', 'short_job', id, 1, true FROM categories WHERE name = 'ITMain' AND type = 'short_job'
UNION ALL
SELECT 'ComputerRepair', 'Kompüter təmiri', 'short_job', id, 2, true FROM categories WHERE name = 'ITMain' AND type = 'short_job'
UNION ALL
SELECT 'WebDev', 'Veb proqramlaşdırma', 'short_job', id, 3, true FROM categories WHERE name = 'ITMain' AND type = 'short_job'
UNION ALL
SELECT 'TechSupport', 'Texniki dəstək', 'short_job', id, 4, true FROM categories WHERE name = 'ITMain' AND type = 'short_job';

-- 9. Təhsil və tərcümə → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Education', 'Təhsil', 'short_job', id, 1, true FROM categories WHERE name = 'EducationMain' AND type = 'short_job'
UNION ALL
SELECT 'Tutor', 'Repetitor', 'short_job', id, 2, true FROM categories WHERE name = 'EducationMain' AND type = 'short_job'
UNION ALL
SELECT 'Translation', 'Tərcümə', 'short_job', id, 3, true FROM categories WHERE name = 'EducationMain' AND type = 'short_job'
UNION ALL
SELECT 'LanguageTeacher', 'Dil müəllimi', 'short_job', id, 4, true FROM categories WHERE name = 'EducationMain' AND type = 'short_job';

-- 10. Tibb və gözəllik → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Healthcare', 'Tibb xidməti', 'short_job', id, 1, true FROM categories WHERE name = 'HealthBeautyMain' AND type = 'short_job'
UNION ALL
SELECT 'Nurse', 'Tibb bacısı', 'short_job', id, 2, true FROM categories WHERE name = 'HealthBeautyMain' AND type = 'short_job'
UNION ALL
SELECT 'Beauty', 'Gözəllik xidməti', 'short_job', id, 3, true FROM categories WHERE name = 'HealthBeautyMain' AND type = 'short_job'
UNION ALL
SELECT 'Massage', 'Masaj', 'short_job', id, 4, true FROM categories WHERE name = 'HealthBeautyMain' AND type = 'short_job'
UNION ALL
SELECT 'Fitness', 'Fitnes məşqçisi', 'short_job', id, 5, true FROM categories WHERE name = 'HealthBeautyMain' AND type = 'short_job';

-- 11. Maliyyə və hüquq → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Finance', 'Maliyyə', 'short_job', id, 1, true FROM categories WHERE name = 'FinanceLegalMain' AND type = 'short_job'
UNION ALL
SELECT 'Accountant', 'Mühasib', 'short_job', id, 2, true FROM categories WHERE name = 'FinanceLegalMain' AND type = 'short_job'
UNION ALL
SELECT 'Legal', 'Hüquqi məsləhət', 'short_job', id, 3, true FROM categories WHERE name = 'FinanceLegalMain' AND type = 'short_job'
UNION ALL
SELECT 'HR', 'Kadr xidməti', 'short_job', id, 4, true FROM categories WHERE name = 'FinanceLegalMain' AND type = 'short_job';

-- 12. Digər xidmətlər → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Auto', 'Avtomobil xidməti', 'short_job', id, 1, true FROM categories WHERE name = 'OtherServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Mechanic', 'Avtomexanik', 'short_job', id, 2, true FROM categories WHERE name = 'OtherServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Security', 'Təhlükəsizlik', 'short_job', id, 3, true FROM categories WHERE name = 'OtherServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Industry', 'Sənaye işçisi', 'short_job', id, 4, true FROM categories WHERE name = 'OtherServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Sales', 'Satış', 'short_job', id, 5, true FROM categories WHERE name = 'OtherServicesMain' AND type = 'short_job'
UNION ALL
SELECT 'Other', 'Digər', 'short_job', id, 6, true FROM categories WHERE name = 'OtherServicesMain' AND type = 'short_job';

-- ШАГ 4: Реорганизуем VACANCY категории с подкатегориями
-- Сначала удаляем старые
DELETE FROM categories WHERE type = 'vacancy';

-- Создаем ГЛАВНЫЕ КАТЕГОРИИ для Vakansiya (parent_id = NULL)
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active) VALUES
-- 1. İT və texnologiya
('ITVacancyMain', 'İT və texnologiya', 'vacancy', NULL, 1, true),
-- 2. Satış
('SalesVacancyMain', 'Satış', 'vacancy', NULL, 2, true),
-- 3. Marketinq və reklam
('MarketingVacancyMain', 'Marketinq və reklam', 'vacancy', NULL, 3, true),
-- 4. Tibb və əczaçılıq
('HealthcareVacancyMain', 'Tibb və əczaçılıq', 'vacancy', NULL, 4, true),
-- 5. Təhsil
('EducationVacancyMain', 'Təhsil', 'vacancy', NULL, 5, true),
-- 6. Maliyyə və mühasibat
('FinanceVacancyMain', 'Maliyyə və mühasibat', 'vacancy', NULL, 6, true),
-- 7. Tikinti və təmir
('ConstructionVacancyMain', 'Tikinti və təmir', 'vacancy', NULL, 7, true),
-- 8. Restoran və turizm
('RestaurantVacancyMain', 'Restoran və turizm', 'vacancy', NULL, 8, true),
-- 9. Nəqliyyat və logistika
('TransportVacancyMain', 'Nəqliyyat və logistika', 'vacancy', NULL, 9, true),
-- 10. İnzibati işlər
('AdminVacancyMain', 'İnzibati işlər', 'vacancy', NULL, 10, true),
-- 11. Dizayn
('DesignVacancyMain', 'Dizayn', 'vacancy', NULL, 11, true),
-- 12. Digər
('OtherVacancyMain', 'Digər', 'vacancy', NULL, 12, true);

-- ПОДКАТЕГОРИИ для Vakansiya

-- 1. İT və texnologiya → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'FrontendDev', 'Frontend Developer', 'vacancy', id, 1, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'BackendDev', 'Backend Developer', 'vacancy', id, 2, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'FullStackDev', 'Full Stack Developer', 'vacancy', id, 3, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'MobileDev', 'Mobile Developer', 'vacancy', id, 4, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'DevOps', 'DevOps Engineer', 'vacancy', id, 5, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'QAEngineer', 'QA Engineer', 'vacancy', id, 6, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'DataAnalyst', 'Data Analyst', 'vacancy', id, 7, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'SystemAdmin', 'System Administrator', 'vacancy', id, 8, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'ITSupport', 'IT Support', 'vacancy', id, 9, true FROM categories WHERE name = 'ITVacancyMain' AND type = 'vacancy';

-- 2. Satış → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'SalesManager', 'Satış meneceri', 'vacancy', id, 1, true FROM categories WHERE name = 'SalesVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'AccountManager', 'Account Manager', 'vacancy', id, 2, true FROM categories WHERE name = 'SalesVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'SalesConsultant', 'Satış məsləhətçisi', 'vacancy', id, 3, true FROM categories WHERE name = 'SalesVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'BusinessDev', 'Business Development', 'vacancy', id, 4, true FROM categories WHERE name = 'SalesVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Cashier', 'Kassir', 'vacancy', id, 5, true FROM categories WHERE name = 'SalesVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'SalesRep', 'Satış nümayəndəsi', 'vacancy', id, 6, true FROM categories WHERE name = 'SalesVacancyMain' AND type = 'vacancy';

-- 3. Marketinq və reklam → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'MarketingManager', 'Marketinq meneceri', 'vacancy', id, 1, true FROM categories WHERE name = 'MarketingVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'SMMManager', 'SMM Manager', 'vacancy', id, 2, true FROM categories WHERE name = 'MarketingVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'SEOSpecialist', 'SEO Specialist', 'vacancy', id, 3, true FROM categories WHERE name = 'MarketingVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'ContentManager', 'Kontent meneceri', 'vacancy', id, 4, true FROM categories WHERE name = 'MarketingVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'BrandManager', 'Brand Manager', 'vacancy', id, 5, true FROM categories WHERE name = 'MarketingVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'PRManager', 'PR Manager', 'vacancy', id, 6, true FROM categories WHERE name = 'MarketingVacancyMain' AND type = 'vacancy';

-- 4. Tibb və əczaçılıq → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Doctor', 'Həkim', 'vacancy', id, 1, true FROM categories WHERE name = 'HealthcareVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Nurse', 'Tibb bacısı', 'vacancy', id, 2, true FROM categories WHERE name = 'HealthcareVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Pharmacist', 'Əczaçı', 'vacancy', id, 3, true FROM categories WHERE name = 'HealthcareVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'MedicalAssistant', 'Tibb köməkçisi', 'vacancy', id, 4, true FROM categories WHERE name = 'HealthcareVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'LabTechnician', 'Laborant', 'vacancy', id, 5, true FROM categories WHERE name = 'HealthcareVacancyMain' AND type = 'vacancy';

-- 5. Təhsil → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Teacher', 'Müəllim', 'vacancy', id, 1, true FROM categories WHERE name = 'EducationVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Tutor', 'Repetitor', 'vacancy', id, 2, true FROM categories WHERE name = 'EducationVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'LanguageTeacher', 'Xarici dil müəllimi', 'vacancy', id, 3, true FROM categories WHERE name = 'EducationVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'TrainingSpecialist', 'Təlim mütəxəssisi', 'vacancy', id, 4, true FROM categories WHERE name = 'EducationVacancyMain' AND type = 'vacancy';

-- 6. Maliyyə və mühasibat → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Accountant', 'Mühasib', 'vacancy', id, 1, true FROM categories WHERE name = 'FinanceVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'FinanceManager', 'Maliyyə meneceri', 'vacancy', id, 2, true FROM categories WHERE name = 'FinanceVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'FinanceAnalyst', 'Maliyyə analitiki', 'vacancy', id, 3, true FROM categories WHERE name = 'FinanceVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Auditor', 'Auditor', 'vacancy', id, 4, true FROM categories WHERE name = 'FinanceVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Economist', 'İqtisadçı', 'vacancy', id, 5, true FROM categories WHERE name = 'FinanceVacancyMain' AND type = 'vacancy';

-- 7. Tikinti və təmir → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Engineer', 'Mühəndis', 'vacancy', id, 1, true FROM categories WHERE name = 'ConstructionVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Architect', 'Arxitektor', 'vacancy', id, 2, true FROM categories WHERE name = 'ConstructionVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Foreman', 'Usta', 'vacancy', id, 3, true FROM categories WHERE name = 'ConstructionVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'ConstructionWorker', 'Tikinti işçisi', 'vacancy', id, 4, true FROM categories WHERE name = 'ConstructionVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Electrician', 'Elektrik', 'vacancy', id, 5, true FROM categories WHERE name = 'ConstructionVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Plumber', 'Santexnik', 'vacancy', id, 6, true FROM categories WHERE name = 'ConstructionVacancyMain' AND type = 'vacancy';

-- 8. Restoran və turizm → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Chef', 'Aşpaz', 'vacancy', id, 1, true FROM categories WHERE name = 'RestaurantVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Waiter', 'Ofisiant', 'vacancy', id, 2, true FROM categories WHERE name = 'RestaurantVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Barista', 'Barista', 'vacancy', id, 3, true FROM categories WHERE name = 'RestaurantVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Bartender', 'Barmen', 'vacancy', id, 4, true FROM categories WHERE name = 'RestaurantVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'RestaurantManager', 'Restoran meneceri', 'vacancy', id, 5, true FROM categories WHERE name = 'RestaurantVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'TourGuide', 'Tur bələdçisi', 'vacancy', id, 6, true FROM categories WHERE name = 'RestaurantVacancyMain' AND type = 'vacancy';

-- 9. Nəqliyyat və logistika → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Driver', 'Sürücü', 'vacancy', id, 1, true FROM categories WHERE name = 'TransportVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Courier', 'Kuryer', 'vacancy', id, 2, true FROM categories WHERE name = 'TransportVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'LogisticsManager', 'Logistika meneceri', 'vacancy', id, 3, true FROM categories WHERE name = 'TransportVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'WarehouseManager', 'Anbar meneceri', 'vacancy', id, 4, true FROM categories WHERE name = 'TransportVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Loader', 'Yükləyici', 'vacancy', id, 5, true FROM categories WHERE name = 'TransportVacancyMain' AND type = 'vacancy';

-- 10. İnzibati işlər → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'OfficeManager', 'Ofis meneceri', 'vacancy', id, 1, true FROM categories WHERE name = 'AdminVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Secretary', 'Katib', 'vacancy', id, 2, true FROM categories WHERE name = 'AdminVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Receptionist', 'Resepşn', 'vacancy', id, 3, true FROM categories WHERE name = 'AdminVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Assistant', 'Assistent', 'vacancy', id, 4, true FROM categories WHERE name = 'AdminVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'HRManager', 'HR meneceri', 'vacancy', id, 5, true FROM categories WHERE name = 'AdminVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Recruiter', 'Recruiter', 'vacancy', id, 6, true FROM categories WHERE name = 'AdminVacancyMain' AND type = 'vacancy';

-- 11. Dizayn → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'GraphicDesigner', 'Qrafik dizayner', 'vacancy', id, 1, true FROM categories WHERE name = 'DesignVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'UXUIDesigner', 'UX/UI Designer', 'vacancy', id, 2, true FROM categories WHERE name = 'DesignVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'WebDesigner', 'Web Designer', 'vacancy', id, 3, true FROM categories WHERE name = 'DesignVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'MotionDesigner', 'Motion Designer', 'vacancy', id, 4, true FROM categories WHERE name = 'DesignVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'InteriorDesigner', 'İnteryer dizayneri', 'vacancy', id, 5, true FROM categories WHERE name = 'DesignVacancyMain' AND type = 'vacancy';

-- 12. Digər → ПОДКАТЕГОРИИ
INSERT INTO categories (name, name_az, type, parent_id, sort_order, is_active)
SELECT 'Security', 'Mühafizəçi', 'vacancy', id, 1, true FROM categories WHERE name = 'OtherVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Cleaner', 'Təmizlikçi', 'vacancy', id, 2, true FROM categories WHERE name = 'OtherVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Lawyer', 'Hüquqşünas', 'vacancy', id, 3, true FROM categories WHERE name = 'OtherVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Photographer', 'Fotoqraf', 'vacancy', id, 4, true FROM categories WHERE name = 'OtherVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Translator', 'Tərcüməçi', 'vacancy', id, 5, true FROM categories WHERE name = 'OtherVacancyMain' AND type = 'vacancy'
UNION ALL
SELECT 'Other', 'Digər', 'vacancy', id, 6, true FROM categories WHERE name = 'OtherVacancyMain' AND type = 'vacancy';

-- Комментарий для документации
COMMENT ON COLUMN categories.parent_id IS 'Parent category ID for subcategories. NULL = main category, NOT NULL = subcategory';
