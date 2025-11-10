/**
 * Category Images Configuration
 *
 * Fallback маппинг категорий к изображениям
 * Используется если в БД не заполнено поле image_url
 */

export const CATEGORY_IMAGES: Record<string, string> = {
  // GÜNDƏLIK İŞLƏR - Construction & Repair
  'Construction': '/images/categories/construction.jpeg',
  'Electrician': '/images/categories/electrician.jpeg',
  'Plumber': '/images/categories/plumber.jpeg',
  'Painter': '/images/categories/painter.jpeg',
  'Carpenter': '/images/categories/painter.jpeg', // Same as painter
  'Moving': '/images/categories/moving.jpeg',

  // GÜNDƏLIK İŞLƏR - Transport
  'Driving': '/images/categories/driver.png',
  'Delivery': '/images/categories/courier.jpeg',
  'Courier': '/images/categories/courier.jpeg',
  'TransportLogistics': '/images/categories/warehouse.jpeg',

  // GÜNDƏLIK İŞLƏR - Home Services
  'Cleaning': '/images/categories/cleaning.jpeg',
  'Cooking': '/images/categories/chef.jpeg',
  'Gardening': '/images/categories/gardening.jpeg',
  'Care': '/images/categories/care.jpeg',
  'HomeStaff': '/images/categories/care.jpeg', // Same as care

  // GÜNDƏLIK İŞLƏR - Restaurant & Tourism
  'Restaurant': '/images/categories/waiter.png',
  'Waiter': '/images/categories/waiter.png',
  'Chef': '/images/categories/chef.jpeg',
  'Event': '/images/categories/event.png',
  'Promotion': '/images/categories/event.png', // Same as event

  // GÜNDƏLIK İŞLƏR - Warehouse & Logistics
  'Warehouse': '/images/categories/warehouse.jpeg',
  'Loading': '/images/categories/moving.jpeg', // Same as moving
  'Packing': '/images/categories/warehouse.jpeg',
  'Sorting': '/images/categories/warehouse.jpeg',

  // GÜNDƏLIK İŞLƏR - Office Work
  'Administration': '/images/categories/office.jpeg',
  'DataEntry': '/images/categories/office.jpeg',
  'Helper': '/images/categories/office.jpeg',
  'Reception': '/images/categories/receptionist.jpeg',

  // GÜNDƏLIK İŞLƏR - Creative
  'Design': '/images/categories/designer.jpeg',
  'Photography': '/images/categories/photographer.jpeg',
  'VideoOperator': '/images/categories/photographer.jpeg', // Same as photographer
  'Marketing': '/images/categories/marketing.png',

  // GÜNDƏLIK İŞLƏR - IT & Technology
  'IT': '/images/categories/developer.jpeg',
  'ComputerRepair': '/images/categories/it-support.jpeg',
  'WebDev': '/images/categories/developer.jpeg',
  'TechSupport': '/images/categories/it-support.jpeg',

  // GÜNDƏLIK İŞLƏR - Education & Translation
  'Education': '/images/categories/teacher.png',
  'Tutor': '/images/categories/teacher.png',
  'Translation': '/images/categories/translator.png',
  'LanguageTeacher': '/images/categories/teacher.png',

  // GÜNDƏLIK İŞLƏR - Health & Beauty
  'Healthcare': '/images/categories/doctor.jpeg',
  'Nurse': '/images/categories/doctor.jpeg',
  'Beauty': '/images/categories/beauty.jpeg',
  'Massage': '/images/categories/beauty.jpeg',
  'Fitness': '/images/categories/beauty.jpeg',

  // GÜNDƏLIK İŞLƏR - Finance & Legal
  'Finance': '/images/categories/accountant.jpeg',
  'Accountant': '/images/categories/accountant.jpeg',
  'Legal': '/images/categories/lawyer.jpeg',
  'HR': '/images/categories/hr.jpeg',

  // GÜNDƏLIK İŞLƏR - Other Services
  'Auto': '/images/categories/mechanic.jpeg',
  'Mechanic': '/images/categories/mechanic.jpeg',
  'Security': '/images/categories/security.jpeg',
  'Industry': '/images/categories/industry.jpeg',
  'Sales': '/images/categories/sales.jpeg',
  'Other': '/images/categories/other.jpeg',

  // VAKANSIYALAR - IT & Technology
  'FrontendDev': '/images/categories/developer.jpeg',
  'BackendDev': '/images/categories/developer.jpeg',
  'FullStackDev': '/images/categories/developer.jpeg',
  'MobileDev': '/images/categories/developer.jpeg',
  'DevOps': '/images/categories/it-support.jpeg',
  'QAEngineer': '/images/categories/data-analyst.jpeg',
  'DataAnalyst': '/images/categories/data-analyst.jpeg',
  'SystemAdmin': '/images/categories/it-support.jpeg',
  'ITSupport': '/images/categories/it-support.jpeg',

  // VAKANSIYALAR - Sales
  'SalesManager': '/images/categories/sales.jpeg',
  'AccountManager': '/images/categories/sales.jpeg',
  'SalesConsultant': '/images/categories/sales.jpeg',
  'BusinessDev': '/images/categories/sales.jpeg',
  'Cashier': '/images/categories/cashier.jpeg',
  'SalesRep': '/images/categories/sales.jpeg',

  // VAKANSIYALAR - Marketing & Advertising
  'MarketingManager': '/images/categories/marketing.png',
  'SMMManager': '/images/categories/smm.png',
  'SEOSpecialist': '/images/categories/smm.png',
  'ContentManager': '/images/categories/marketing.png',
  'BrandManager': '/images/categories/marketing.png',
  'PRManager': '/images/categories/smm.png',

  // VAKANSIYALAR - Healthcare & Pharmacy
  'Doctor': '/images/categories/doctor.jpeg',
  'Pharmacist': '/images/categories/pharmacist.jpeg',
  'MedicalAssistant': '/images/categories/doctor.jpeg',
  'LabTechnician': '/images/categories/doctor.jpeg',

  // VAKANSIYALAR - Education
  'Teacher': '/images/categories/teacher.png',
  'TrainingSpecialist': '/images/categories/teacher.png',

  // VAKANSIYALAR - Finance & Accounting
  'FinanceManager': '/images/categories/accountant.jpeg',
  'FinanceAnalyst': '/images/categories/accountant.jpeg',
  'Auditor': '/images/categories/accountant.jpeg',
  'Economist': '/images/categories/accountant.jpeg',

  // VAKANSIYALAR - Construction & Repair
  'Engineer': '/images/categories/engineer.jpeg',
  'Architect': '/images/categories/engineer.jpeg',
  'Foreman': '/images/categories/construction.jpeg',
  'ConstructionWorker': '/images/categories/construction.jpeg',

  // VAKANSIYALAR - Restaurant & Tourism
  'Barista': '/images/categories/barista.jpeg',
  'Bartender': '/images/categories/barista.jpeg',
  'RestaurantManager': '/images/categories/restaurant-manager.jpeg',
  'TourGuide': '/images/categories/event.png',

  // VAKANSIYALAR - Transport & Logistics
  'Driver': '/images/categories/driver.png',
  'LogisticsManager': '/images/categories/warehouse.jpeg',
  'WarehouseManager': '/images/categories/warehouse.jpeg',
  'Loader': '/images/categories/moving.jpeg',

  // VAKANSIYALAR - Administrative
  'OfficeManager': '/images/categories/office-manager.jpeg',
  'Secretary': '/images/categories/office.jpeg',
  'Receptionist': '/images/categories/receptionist.jpeg',
  'Assistant': '/images/categories/office.jpeg',
  'HRManager': '/images/categories/hr.jpeg',
  'Recruiter': '/images/categories/hr.jpeg',

  // VAKANSIYALAR - Design
  'GraphicDesigner': '/images/categories/designer.jpeg',
  'UXUIDesigner': '/images/categories/ux-designer.jpeg',
  'WebDesigner': '/images/categories/designer.jpeg',
  'MotionDesigner': '/images/categories/interior-designer.jpeg',
  'InteriorDesigner': '/images/categories/interior-designer.jpeg',

  // VAKANSIYALAR - Other
  'Cleaner': '/images/categories/cleaning.jpeg',
  'Lawyer': '/images/categories/lawyer.jpeg',
  'Photographer': '/images/categories/photographer.jpeg',
  'Translator': '/images/categories/translator.png',

  // ===== PARENT CATEGORIES (for parser) =====

  // GÜNDƏLIK İŞLƏR - Parent Categories
  'ConstructionMain': '/images/categories/construction.jpeg',
  'TransportMain': '/images/categories/driver.png',
  'HomeServicesMain': '/images/categories/cleaning.jpeg',
  'RestaurantMain': '/images/categories/waiter.png',
  'WarehouseMain': '/images/categories/warehouse.jpeg',
  'OfficeMain': '/images/categories/office.jpeg',
  'CreativeMain': '/images/categories/designer.jpeg',
  'ITMain': '/images/categories/developer.jpeg',
  'EducationMain': '/images/categories/teacher.png',
  'HealthBeautyMain': '/images/categories/doctor.jpeg',
  'FinanceLegalMain': '/images/categories/accountant.jpeg',
  'OtherServicesMain': '/images/categories/other.jpeg',

  // VAKANSIYALAR - Parent Categories
  'ITVacancyMain': '/images/categories/developer.jpeg',
  'SalesVacancyMain': '/images/categories/sales.jpeg',
  'MarketingVacancyMain': '/images/categories/marketing.png',
  'HealthcareVacancyMain': '/images/categories/doctor.jpeg',
  'EducationVacancyMain': '/images/categories/teacher.png',
  'FinanceVacancyMain': '/images/categories/accountant.jpeg',
  'ConstructionVacancyMain': '/images/categories/construction.jpeg',
  'RestaurantVacancyMain': '/images/categories/waiter.png',
  'TransportVacancyMain': '/images/categories/driver.png',
  'AdminVacancyMain': '/images/categories/office.jpeg',
  'DesignVacancyMain': '/images/categories/designer.jpeg',
  'OtherVacancyMain': '/images/categories/other.jpeg',
};

/**
 * Placeholder изображение (если категория не найдена)
 */
export const PLACEHOLDER_IMAGE = '/images/categories/other.jpeg';

/**
 * Alt тексты для изображений (для SEO)
 */
export const CATEGORY_IMAGE_ALTS: Record<string, string> = {
  'Construction': 'Tikinti işçisi və tikinti sahəsi',
  'Electrician': 'Elektrik işçisi elektrik paneli ilə işləyir',
  'Plumber': 'Santexnik boru təmiri görür',
  'Painter': 'Rəngsaz divar boyayır',
  'Driver': 'Professional sürücü avtomobil idarə edir',
  'Courier': 'Kuryer çatdırılma xidməti göstərir',
  'Warehouse': 'Anbar işçisi inventarizasiya aparır',
  'Cleaning': 'Təmizlik xidməti',
  'Chef': 'Aşpaz mətbəxdə iş görür',
  'Waiter': 'Ofisiant restoranda xidmət göstərir',
  'Office': 'Ofis işçisi kompüterdə iş görür',
  'Developer': 'Proqramçı kod yazır',
  'Designer': 'Dizayner kreativ iş görür',
  'Teacher': 'Müəllim dərs keçir',
  'Doctor': 'Həkim tibbi xidmət göstərir',
  'Accountant': 'Mühasib maliyyə hesabatları ilə işləyir',
  'Sales': 'Satış meneceri müştəri ilə görüşür',
  'Marketing': 'Marketinq mütəxəssisi strategiya hazırlayır',
  'HR': 'HR meneceri müsahibə aparır',
  'Lawyer': 'Hüquqşünas qanun kitabları ilə işləyir',
  'Other': 'Müxtəlif peşə sahələri',
};
