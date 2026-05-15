export default {
  auth: {
    welcome: "Xush kelibsiz",
    signIn: "Tizimga kirish",
    signUp: "Ro'yxatdan o'tish",
    createAccount: "Hisob yaratish",
    loginDescription: "Biznesingizni boshqarish uchun POS hisobingizga kiring.",
    registerDescription: "Bir daqiqadan kamroq vaqt ichida POS biznesingizni sozlang.",
    phone: "Telefon raqami",
    password: "Parol",
    fullName: "To'liq ismingiz",
    businessName: "Biznes nomi",
    language: "Til",
    dontHaveAccount: "Hisobingiz yo'qmi?",
    alreadyHaveAccount: "Hisobingiz bormi?",
    back: "Orqaga",
    loading: "Yuklanmoqda...",
    enterPassword: "Parolni kiriting",
    minCharacters: "Kamida 6 ta belgi",
    errors: {
      phoneRequired: "Telefon raqami kiritilishi shart",
      passwordRequired: "Parol kiritilishi shart",
      passwordLength: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
      fullNameRequired: "Ism kiritilishi shart",
      businessNameRequired: "Biznes nomi kiritilishi shart",
      loginFailed: "Kirishda xatolik yuz berdi",
      registerFailed: "Ro'yxatdan o'tishda xatolik yuz berdi"
    }
  },
  tabs: {
    home: "Asosiy",
    products: "Mahsulotlar",
    settings: "Sozlamalar",
  },
  common: {
    save: "Saqlash",
    cancel: "Bekor qilish",
    delete: "O'chirish",
    error: "Xatolik",
    success: "Muvaffaqiyatli",
    warning: "Ogohlantirish",
    filter: "Filtrlash",
    fillRequiredFields: "Iltimos, majburiy maydonlarni to'ldiring",
    exportError: "Eksport qilishda xatolik yuz berdi",
    permissionsDenied: "Ruxsat berilmagan",
    calculator: "Kalkulator",
    edit: "Tahrirlash",
    paymentMethod: "To'lov turi",
    paymentMethods: {
      cash: "Naqd",
      card: "Karta",
      transfer: "Bank o'tkazmasi",
      other: "Boshqa"
    }
  },
  home: {
    segments: {
      clients: "Mijozlar",
      suppliers: "Ta'minotchilar",
      employees: "Xodimlar"
    },
    searchPlaceholder: "Ism, Telefon raqam",
    noResults: "Natija topilmadi",
    roles: {
      client: "Mijoz",
      supplier: "Ta'minotchi"
    },
    sortBy: "Saralash turi",
    sortOrder: "Tartib",
    sortOptions: {
      alphabetic: "Alifbo bo'yicha",
      createdAt: "Yaratilgan vaqti",
      balance: "Balans (Qarz)"
    },
    orderOptions: {
      asc: "O'suvchi",
      desc: "Kamayuvchi"
    },
    addClient: "Mijoz qo'shish",
    fillDetails: "Mijoz ma'lumotlarini quyida to'ldiring",
    exportTitle: "Ma'lumotlarni eksport qilish",
    clientName: "Ism",
    clientPhone: "Telefon",
    defaultTenantName: "Mening biznesim",
    exportNotSupported: "Ushbu bo'lim uchun eksport mavjud emas",
    contactPermissionError: "Kontaktlarga ruxsat berilmagan",
    placeholders: {
      clientName: "Mijoz ismini kiriting",
      supplierName: "Ta'minotchi ismini kiriting"
    },
    addSupplier: "Ta'minotchi qo'shish",
    fillDetailsSupplier: "Ta'minotchi ma'lumotlarini quyida to'ldiring",
    supplierName: "Ta'minotchi nomi",
    supplierPhone: "Ta'minotchi telefoni"
  },
  clientDetail: {
    title: "Mijoz ma'lumotlari",
    balanceUzs: "Umumiy balans (UZS)",
    balanceUsd: "USD Balans",
    history: "Tranzaksiyalar tarixi",
    noHistory: "Tranzaksiyalar mavjud emas",
    giveDebt: "Qarz berish",
    receivePayment: "To'lov olish",
    address: "Manzil",
    notes: "Eslatma",
    paymentReceived: "To'lov qabul qilindi",
    debtIssued: "Qarz berildi",
    call: "Qo'ng'iroq qilish",
    noPhone: "Telefon raqami yo'q",
    idBadge: "ID",
    balanceUsdLabel: "Balans (USD)",
    balanceUzsLabel: "Balans (UZS)",
    noAddress: "Manzil kiritilmagan",
    giveLoan: "Qarz berish",
    makePayment: "To'lov qilish",
    recentTransactions: "Oxirgi tranzaksiyalar",
    loanDisbursed: "Qarz berildi",
    loanTitle: "Qarz",
    paymentForLoan: "Qarz uchun to'lov",
    joined: "Qo'shilgan",
    noNotes: "Ushbu mijoz uchun eslatmalar yo'q.",
    amount: "Summa",
    currency: "Valyuta",
    description: "Tavsif",
    optionalNotes: "Ixtiyoriy eslatmalar...",
    saveTransaction: "Tranzaksiyani saqlash",
    deleteConfirmation: "Haqiqatan ham bu mijozni o'chirib tashlamoqchimisiz?",
    transactionDetails: "Tranzaksiya tafsilotlari",
    deleteTxConfirmation: "Haqiqatan ham bu tranzaksiyani o'chirib tashlamoqchimisiz?",
    totalAmount: "Umumiy balans"
  },
  supplierDetail: {
    title: "Ta'minotchi ma'lumotlari",
    balanceUzs: "Umumiy qarz (UZS)",
    balanceUsd: "USD Balans",
    history: "Tranzaksiyalar tarixi",
    noHistory: "Tranzaksiyalar mavjud emas",
    paySupplier: "To'lov qilish",
    receiveRefund: "Qaytarib olish",
    address: "Manzil",
    notes: "Eslatma",
    paymentMade: "To'lov qilindi",
    refundReceived: "Pul qaytarildi",
    call: "Qo'ng'iroq qilish",
    noPhone: "Telefon raqami yo'q",
    edit: "Tahrirlash",
    placeholders: {
        name: "Ta'minotchi nomini kiriting"
    }
  },
  inventory: {
    title: "Inventarizatsiya",
    totalItems: "Jami tovarlar",
    lowStock: "Kam qolgan",
    outOfStock: "Tugagan",
    totalValue: "Umumiy qiymat",
    overview: "Umumiy ma'lumot",
    recentActivity: "Oxirgi harakatlar",
    viewAll: "Hammasini ko'rish",
  },
  products: {
    title: "Mahsulotlar",
    searchPlaceholder: "Mahsulot qidirish...",
    allCategories: "Barcha kategoriyalar",
    inStock: "Mavjud",
    lowStock: "Kam qolgan",
    outOfStock: "Tugagan",
    addProduct: "Mahsulot qo'shish",
    productImage: "Mahsulot rasmi",
    uploadImage: "Rasm yuklash uchun bosing",
    productName: "Mahsulot nomi",
    sku: "SKU",
    category: "Kategoriya",
    purchasePrice: "Sotib olish narxi",
    sellingPrice: "Sotish narxi",
    initialStock: "Boshlang'ich qoldiq",
    saveProduct: "Mahsulotni saqlash",
    editProduct: "Tahrirlash",
    isActive: "Faolmi",
    stockQuantity: "Qoldiq miqdori",
    available: "Mavjud",
    reserved: "Band qilingan",
    reorderLevel: "Minimal qoldiq",
    pricing: "Narxlar",
    supplier: "Ta'minotchi",
    description: "Tavsif",
    items: "ta mahsulot",
    uncategorized: "Kategoriyasiz",
    emptyTitle: "Mahsulotlar yo'q",
    emptySubtitle: "Birinchi mahsulotingizni qo'shish uchun quyidagi tugmani bosing",
    deleteProduct: "Mahsulotni o'chirish",
    deleteConfirmation: "Haqiqatan ham bu mahsulotni o'chirib tashlamoqchimisiz? Bu amalni bekor qilib bo'lmaydi.",
    placeholders: {
      name: "Mahsulot nomini kiriting",
      description: "Mahsulot tavsifini kiriting",
      selectCategory: "Kategoriyani tanlang",
      selectBrandCategory: "Brend kategoriyasini tanlang",
      selectUnit: "O'lchov birligini tanlang",
      searchCategory: "Kategoriyani qidirish...",
      searchBrand: "Brendni qidirish..."
    },
    currency: "Valyuta",
    brandCategory: "Brend kategoriyasi",
    unit: "O'lchov birligi",
    noCategoryFound: "Kategoriya topilmadi.",
    noBrandFound: "Brend topilmadi.",
    filters: "Filtrlar",
    clearAll: "Hammasini tozalash",
    allBrands: "Barcha brendlar",
    sortBy: "Saralash turi",
    newest: "Yangi",
    brand: "Brend",
    na: "Mavjud emas",
    noDescription: "Ushbu mahsulot uchun tavsif berilmagan.",
    imageRequirements: "PNG, JPG 5MB gacha",
    errors: {
      createFailed: "Mahsulotni yaratib bo'lmadi"
    }
  },
  categories: {
    addCategory: "Kategoriya qo'shish",
    name: "Kategoriya nomi",
    placeholders: {
      name: "Kategoriya nomini kiriting"
    },
    errors: {
      createFailed: "Kategoriyani yaratib bo'lmadi"
    }
  },
  brandCategories: {
    addBrandCategory: "Brend qo'shish",
    name: "Brend nomi",
    placeholders: {
      name: "Brend nomini kiriting"
    },
    errors: {
      createFailed: "Brend kategoriyasini yaratib bo'lmadi"
    }
  },
  units: {
    addUnit: "O'lchov birligi qo'shish",
    name: "O'lchov birligi nomi",
    shortName: "Qisqa nomi (mas. kg)",
    placeholders: {
      name: "O'lchov birligi nomini kiriting",
      shortName: "mas. kg, dona"
    },
    errors: {
      createFailed: "O'lchov birligini yaratib bo'lmadi"
    }
  }
};
