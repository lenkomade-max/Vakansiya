/**
 * Category Images Configuration
 *
 * Fallback маппинг категорий к изображениям
 * Используется если в БД не заполнено поле image_url
 */

const CDN = 'https://giunonajbfrlasaxqvoi.supabase.co/storage/v1/object/public/category-images';

export const CATEGORY_IMAGES: Record<string, string> = {
  // GÜNDƏLIK İŞLƏR - Construction & Repair
  'Construction': `${CDN}/construction.jpeg`,
  'Electrician': `${CDN}/electrician.jpeg`,
  'Plumber': `${CDN}/plumber.jpeg`,
  'Painter': `${CDN}/painter.jpeg`,
  'Carpenter': `${CDN}/painter.jpeg`, // Same as painter
  'Moving': `${CDN}/moving.jpeg`,

  // GÜNDƏLIK İŞLƏR - Transport
  'Driving': `${CDN}/driver.png`,
  'Delivery': `${CDN}/courier.jpeg`,
  'Courier': `${CDN}/courier.jpeg`,
  'TransportLogistics': `${CDN}/warehouse.jpeg`,

  // GÜNDƏLIK İŞLƏR - Home Services
  'Cleaning': `${CDN}/cleaning.jpeg`,
  'Cooking': `${CDN}/chef.jpeg`,
  'Gardening': `${CDN}/gardening.jpeg`,
  'Care': `${CDN}/care.jpeg`,
  'HomeStaff': `${CDN}/care.jpeg`, // Same as care

  // GÜNDƏLIK İŞLƏR - Restaurant & Tourism
  'Restaurant': `${CDN}/waiter.png`,
  'Waiter': `${CDN}/waiter.png`,
  'Chef': `${CDN}/chef.jpeg`,
  'Event': `${CDN}/event.png`,
  'Promotion': `${CDN}/event.png`, // Same as event

  // GÜNDƏLIK İŞLƏR - Warehouse & Logistics
  'Warehouse': `${CDN}/warehouse.jpeg`,
  'Loading': `${CDN}/moving.jpeg`, // Same as moving
  'Packing': `${CDN}/warehouse.jpeg`,
  'Sorting': `${CDN}/warehouse.jpeg`,

  // GÜNDƏLIK İŞLƏR - Office Work
  'Administration': `${CDN}/office.jpeg`,
  'DataEntry': `${CDN}/office.jpeg`,
  'Helper': `${CDN}/office.jpeg`,
  'Reception': `${CDN}/receptionist.jpeg`,

  // GÜNDƏLIK İŞLƏR - Creative
  'Design': `${CDN}/designer.jpeg`,
  'Photography': `${CDN}/photographer.jpeg`,
  'VideoOperator': `${CDN}/photographer.jpeg`, // Same as photographer
  'Marketing': `${CDN}/marketing.png`,

  // GÜNDƏLIK İŞLƏR - IT & Technology
  'IT': `${CDN}/developer.jpeg`,
  'ComputerRepair': `${CDN}/it-support.jpeg`,
  'WebDev': `${CDN}/developer.jpeg`,
  'TechSupport': `${CDN}/it-support.jpeg`,

  // GÜNDƏLIK İŞLƏR - Education & Translation
  'Education': `${CDN}/teacher.png`,
  'Tutor': `${CDN}/teacher.png`,
  'Translation': `${CDN}/translator.png`,
  'LanguageTeacher': `${CDN}/teacher.png`,

  // GÜNDƏLIK İŞLƏR - Health & Beauty
  'Healthcare': `${CDN}/doctor.jpeg`,
  'Nurse': `${CDN}/doctor.jpeg`,
  'Beauty': `${CDN}/beauty.jpeg`,
  'Massage': `${CDN}/beauty.jpeg`,
  'Fitness': `${CDN}/beauty.jpeg`,

  // GÜNDƏLIK İŞLƏR - Finance & Legal
  'Finance': `${CDN}/accountant.jpeg`,
  'Accountant': `${CDN}/accountant.jpeg`,
  'Legal': `${CDN}/lawyer.jpeg`,
  'HR': `${CDN}/hr.jpeg`,

  // GÜNDƏLIK İŞLƏR - Other Services
  'Auto': `${CDN}/mechanic.jpeg`,
  'Mechanic': `${CDN}/mechanic.jpeg`,
  'Security': `${CDN}/security.jpeg`,
  'Industry': `${CDN}/industry.jpeg`,
  'Sales': `${CDN}/sales.jpeg`,
  'Other': `${CDN}/other.jpeg`,

  // VAKANSIYALAR - IT & Technology
  'FrontendDev': `${CDN}/developer.jpeg`,
  'BackendDev': `${CDN}/developer.jpeg`,
  'FullStackDev': `${CDN}/developer.jpeg`,
  'MobileDev': `${CDN}/developer.jpeg`,
  'DevOps': `${CDN}/it-support.jpeg`,
  'QAEngineer': `${CDN}/data-analyst.jpeg`,
  'DataAnalyst': `${CDN}/data-analyst.jpeg`,
  'SystemAdmin': `${CDN}/it-support.jpeg`,
  'ITSupport': `${CDN}/it-support.jpeg`,

  // VAKANSIYALAR - Sales
  'SalesManager': `${CDN}/sales.jpeg`,
  'AccountManager': `${CDN}/sales.jpeg`,
  'SalesConsultant': `${CDN}/sales.jpeg`,
  'BusinessDev': `${CDN}/sales.jpeg`,
  'Cashier': `${CDN}/cashier.jpeg`,
  'SalesRep': `${CDN}/sales.jpeg`,

  // VAKANSIYALAR - Marketing & Advertising
  'MarketingManager': `${CDN}/marketing.png`,
  'SMMManager': `${CDN}/smm.png`,
  'SEOSpecialist': `${CDN}/smm.png`,
  'ContentManager': `${CDN}/marketing.png`,
  'BrandManager': `${CDN}/marketing.png`,
  'PRManager': `${CDN}/smm.png`,

  // VAKANSIYALAR - Healthcare & Pharmacy
  'Doctor': `${CDN}/doctor.jpeg`,
  'Pharmacist': `${CDN}/pharmacist.jpeg`,
  'MedicalAssistant': `${CDN}/doctor.jpeg`,
  'LabTechnician': `${CDN}/doctor.jpeg`,

  // VAKANSIYALAR - Education
  'Teacher': `${CDN}/teacher.png`,
  'TrainingSpecialist': `${CDN}/teacher.png`,

  // VAKANSIYALAR - Finance & Accounting
  'FinanceManager': `${CDN}/accountant.jpeg`,
  'FinanceAnalyst': `${CDN}/accountant.jpeg`,
  'Auditor': `${CDN}/accountant.jpeg`,
  'Economist': `${CDN}/accountant.jpeg`,

  // VAKANSIYALAR - Construction & Repair
  'Engineer': `${CDN}/engineer.jpeg`,
  'Architect': `${CDN}/engineer.jpeg`,
  'Foreman': `${CDN}/construction.jpeg`,
  'ConstructionWorker': `${CDN}/construction.jpeg`,

  // VAKANSIYALAR - Restaurant & Tourism
  'Barista': `${CDN}/barista.jpeg`,
  'Bartender': `${CDN}/barista.jpeg`,
  'RestaurantManager': `${CDN}/restaurant-manager.jpeg`,
  'TourGuide': `${CDN}/event.png`,

  // VAKANSIYALAR - Transport & Logistics
  'Driver': `${CDN}/driver.png`,
  'LogisticsManager': `${CDN}/warehouse.jpeg`,
  'WarehouseManager': `${CDN}/warehouse.jpeg`,
  'Loader': `${CDN}/moving.jpeg`,

  // VAKANSIYALAR - Administrative
  'OfficeManager': `${CDN}/office-manager.jpeg`,
  'Secretary': `${CDN}/office.jpeg`,
  'Receptionist': `${CDN}/receptionist.jpeg`,
  'Assistant': `${CDN}/office.jpeg`,
  'HRManager': `${CDN}/hr.jpeg`,
  'Recruiter': `${CDN}/hr.jpeg`,

  // VAKANSIYALAR - Design
  'GraphicDesigner': `${CDN}/designer.jpeg`,
  'UXUIDesigner': `${CDN}/ux-designer.jpeg`,
  'WebDesigner': `${CDN}/designer.jpeg`,
  'MotionDesigner': `${CDN}/interior-designer.jpeg`,
  'InteriorDesigner': `${CDN}/interior-designer.jpeg`,

  // VAKANSIYALAR - Other
  'Cleaner': `${CDN}/cleaning.jpeg`,
  'Lawyer': `${CDN}/lawyer.jpeg`,
  'Photographer': `${CDN}/photographer.jpeg`,
  'Translator': `${CDN}/translator.png`,

  // ===== PARENT CATEGORIES (for parser) =====

  // GÜNDƏLIK İŞLƏR - Parent Categories
  'ConstructionMain': `${CDN}/construction.jpeg`,
  'TransportMain': `${CDN}/driver.png`,
  'HomeServicesMain': `${CDN}/cleaning.jpeg`,
  'RestaurantMain': `${CDN}/waiter.png`,
  'WarehouseMain': `${CDN}/warehouse.jpeg`,
  'OfficeMain': `${CDN}/office.jpeg`,
  'CreativeMain': `${CDN}/designer.jpeg`,
  'ITMain': `${CDN}/developer.jpeg`,
  'EducationMain': `${CDN}/teacher.png`,
  'HealthBeautyMain': `${CDN}/doctor.jpeg`,
  'FinanceLegalMain': `${CDN}/accountant.jpeg`,
  'OtherServicesMain': `${CDN}/other.jpeg`,

  // VAKANSIYALAR - Parent Categories
  'ITVacancyMain': `${CDN}/developer.jpeg`,
  'SalesVacancyMain': `${CDN}/sales.jpeg`,
  'MarketingVacancyMain': `${CDN}/marketing.png`,
  'HealthcareVacancyMain': `${CDN}/doctor.jpeg`,
  'EducationVacancyMain': `${CDN}/teacher.png`,
  'FinanceVacancyMain': `${CDN}/accountant.jpeg`,
  'ConstructionVacancyMain': `${CDN}/construction.jpeg`,
  'RestaurantVacancyMain': `${CDN}/waiter.png`,
  'TransportVacancyMain': `${CDN}/driver.png`,
  'AdminVacancyMain': `${CDN}/office.jpeg`,
  'DesignVacancyMain': `${CDN}/designer.jpeg`,
  'OtherVacancyMain': `${CDN}/other.jpeg`,
};

/**
 * Placeholder изображение (если категория не найдена)
 */
export const PLACEHOLDER_IMAGE = `${CDN}/other.jpeg`;

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
