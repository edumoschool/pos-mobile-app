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
    sales: "Sotuvlar",
    transactions: "Tranzaksiyalar",
    settings: "Sozlamalar",
  },
  common: {
    save: "Saqlash",
    cancel: "Bekor qilish",
    confirm: "Tasdiqlash",
    time: "Vaqt",
    delete: "O'chirish",
    error: "Xatolik",
    success: "Muvaffaqiyatli",
    warning: "Ogohlantirish",
    filter: "Filtrlash",
    on: "Yoniq",
    off: "O'chiq",
    somethingWentWrong: "Nimadir xato ketdi",
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
      supplier: "Ta'minotchi",
      employee: "Xodim"
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
    totalAmount: "Umumiy balans",
    dueDate: "Muddat",
    linkedSale: "Bog'liq sotuv",
    viewSale: "Sotuvni ko'rish",
    paidAmount: "To'langan",
    seller: "Sotuvchi"
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
    deleteConfirmation: "Haqiqatan ham bu ta'minotchini o'chirib tashlamoqchimisiz?",
    placeholders: {
        name: "Ta'minotchi nomini kiriting"
    }
  },
  inventory: {
    title: "Omborxona",
    totalItems: "Jami tovarlar",
    lowStock: "Kam qolgan",
    outOfStock: "Tugagan",
    totalValue: "Umumiy qiymat",
    overview: "Umumiy ma'lumot",
    recentActivity: "Oxirgi harakatlar",
    viewAll: "Hammasini ko'rish",
    allStock: "Barcha ombor",
    empty: "Hali ombor yozuvlari yo'q",
    noLowStock: "Hech narsa kam qolmagan",
    minLabel: "Min",
    currentStock: "Joriy qoldiq",
    quantity: "Miqdor",
    minQuantity: "Min. qoldiq",
    maxQuantity: "Maks. qoldiq",
    costPrice: "Tannarx",
    location: "Saqlash joyi",
    notePlaceholder: "Izoh (o'zgarish sababi)",
    saveChanges: "O'zgarishlarni saqlash",
    adjusted: "Ombor yangilandi",
    movements: "Harakatlar tarixi",
    noMovements: "Hali harakatlar yo'q",
    movementTypes: {
      in: "Kirim",
      out: "Chiqim",
      adjustment: "Tuzatish"
    },
    deleteRecord: "Ombor yozuvini o'chirish",
    deleteConfirm: "Ushbu mahsulot uchun ombor yozuvi butunlay o'chiriladi. Davom etilsinmi?",
    deleted: "Ombor yozuvi o'chirildi"
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
      sku: "Shtrix-kod / SKU kiriting (ixtiyoriy)",
      selectCategory: "Kategoriyani tanlang",
      selectBrandCategory: "Brend kategoriyasini tanlang",
      selectUnit: "O'lchov birligini tanlang",
      selectSupplier: "Ta'minotchini tanlang",
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
  },
  transactions: {
    title: "Tranzaksiyalar",
    all: "Barchasi",
    income: "Kirim",
    expense: "Chiqim",
    totalIncome: "Jami kirim",
    totalExpense: "Jami chiqim",
    search: "Tranzaksiya qidirish...",
    noResults: "Tranzaksiyalar topilmadi",
    addTransaction: "Tranzaksiya qo'shish",
    type: "Turi",
    branch: "Filial",
    category: "Kategoriya",
    selectCategory: " Kategoriyani tanlang",
    selectBranch: " Filialni tanlang",
    created: "Tranzaksiya qo'shildi",
    deleted: "Tranzaksiya o'chirildi",
    date: "Sana",
    detail: "Tranzaksiya tafsiloti",
    deleteTitle: "Tranzaksiyani o'chirish",
    deleteConfirmation: "Haqiqatan ham bu tranzaksiyani o'chirib tashlamoqchimisiz?",
    fillRequired: "Iltimos, barcha majburiy maydonlarni to'ldiring"
  },
  sales: {
    title: "Sotuvlar",
    createPosSale: "Sotuv yaratish",
    tabs: {
      all: "Barchasi",
      completed: "Tugallangan",
      debt: "Qarz",
      cancelled: "Bekor qilingan"
    },
    status: {
      completed: "Tugallangan",
      debt: "Qarz",
      cancelled: "Bekor qilingan",
      unknown: "Noma'lum"
    },
    walkInCustomer: "Odatiy mijoz",
    noResults: "Sotuvlar topilmadi",
    items_one: "{{count}} ta mahsulot",
    items_other: "{{count}} ta mahsulot",
    summary: {
      revenue: "Tushum",
      profit: "Foyda",
      debt: "Qarz"
    },
    pos: {
      title: "Yangi sotuv",
      addItems: "Mahsulot qo'shish",
      searchProducts: "Mahsulot qidirish...",
      cart: "Savat",
      cartEmpty: "Hali mahsulot qo'shilmagan",
      client: "Mijoz (ixtiyoriy)",
      walkIn: "Odatiy mijoz",
      discount: "Chegirma",
      sellOnDebt: "Qarzga sotish",
      paidAmount: "To'langan summa",
      subtotal: "Oraliq jami",
      total: "Jami",
      toPay: "To'landi",
      debt: "Qarz",
      available: "Mavjud",
      outOfStock: "Omborda yo'q",
      checkout: "Rasmiylashtirish",
      errors: {
        emptyCart: "Kamida bitta mahsulot qo'shing",
        clientRequiredForDebt: "Qarzga sotuv uchun mijoz tanlang",
        paidExceedsTotal: "To'lov jami summadan oshmasligi kerak"
      },
      success: {
        saleCreated: "Sotuv saqlandi"
      }
    },
    detail: {
      title: "Sotuv tafsilotlari",
      client: "Mijoz",
      seller: "Sotuvchi",
      date: "Sana",
      walkIn: "Odatiy mijoz",
      items: "Mahsulotlar",
      subtotal: "Oraliq jami",
      discount: "Chegirma",
      total: "Jami",
      paid: "To'landi",
      debt: "Qarz",
      cancelSale: "Sotuvni bekor qilish",
      cancelConfirm: "Mahsulot omborga qaytariladi, mijoz qarzi bekor qilinadi. Davom etilsinmi?",
      cancelSuccess: "Sotuv bekor qilindi",
      linkedDebt: "Bog'liq mijoz operatsiyalari",
      payDebt: "Qarzni to'lash",
      remainingDebt: "Qolgan qarz",
      confirmPayment: "To'lovni tasdiqlash",
      paySuccess: "To'lov qayd etildi"
    }
  },
  settings: {
    sections: {
      account: "Hisob",
      business: "Biznes",
      security: "Xavfsizlik",
      appearance: "Ko'rinish",
      administration: "Administratsiya"
    },
    rows: {
      profile: "Profil",
      password: "Parolni o'zgartirish",
      business: "Biznes profili",
      branches: "Filiallar",
      catalog: "Katalog",
      subscription: "Obuna",
      appLock: "Ilova qulfi (PIN)",
      sessions: "Faol seanslar",
      theme: "Mavzu",
      logout: "Chiqish",
      tenants: "Tashkilotlar",
      plans: "Tarif rejalari"
    },
    roles: {
      super_admin: "Super admin",
      owner: "Egasi",
      seller: "Sotuvchi"
    },
    logoutConfirm: "Ilovadan foydalanish uchun qayta kirishingiz kerak bo'ladi.",
    profile: {
      saved: "Profil yangilandi",
      nameLockedForSeller: "Ismni faqat egasi o'zgartira oladi."
    },
    password: {
      changed: "Parol o'zgartirildi",
      current: "Joriy parol",
      new: "Yangi parol",
      confirm: "Yangi parolni tasdiqlang",
      currentRequired: "Joriy parolni kiriting",
      mismatch: "Yangi parollar mos kelmadi",
      hint: "Kamida 6 ta belgi.",
      submit: "Parolni yangilash"
    },
    business: {
      saved: "Biznes yangilandi",
      readOnlyForSeller: "Biznes ma'lumotlarini faqat egasi tahrirlaydi."
    },
    branches: {
      empty: "Hali filiallar yo'q",
      add: "Yangi filial",
      edit: "Filialni tahrirlash",
      created: "Filial yaratildi",
      updated: "Filial yangilandi",
      deactivated: "Filial o'chirildi",
      active: "Faol",
      inactive: "Nofaol",
      deactivate: "Filialni o'chirish",
      deactivateConfirm: "Filial yashiriladi va nofaol deb belgilanadi. Davom etilsinmi?"
    },
    catalog: {
      categories: "Kategoriyalar",
      "brand-categories": "Brendlar",
      units: "Birliklar"
    },
    subscription: {
      noPlan: "Reja yo'q",
      until: "gacha",
      renews: "Yangilanadi",
      available: "Mavjud rejalar",
      currentPlan: "Joriy reja",
      contactToChange: "Rejani o'zgartirish uchun qo'llab-quvvatlashga murojaat qiling.",
      status: {
        trial: "Sinov",
        active: "Faol",
        expired: "Muddati tugagan",
        cancelled: "Bekor qilingan"
      },
      limits: {
        days: "{{count}} kunlik kirish",
        branches: "{{count}} tagacha filial",
        users: "{{count}} tagacha xodim",
        products: "{{count}} tagacha mahsulot"
      }
    },
    security: {
      on: "Ilova qulfi yoqilgan",
      off: "Ilova qulfi o'chirilgan",
      explainer: "Ilovani ochishda 4 xonali PIN so'ralsin.",
      enable: "PIN o'rnatish",
      lockNow: "Hozir qulflash",
      change: "PINni o'zgartirish",
      disable: "Ilova qulfini o'chirish",
      enabled: "Ilova qulfi yoqildi",
      disabled: "Ilova qulfi o'chirildi",
      enterPin: "PIN kiriting",
      enterPinSubtitle: "Qulfdan chiqarish uchun PIN kiriting",
      newPin: "Yangi PIN",
      newPinSubtitle: "4 xonali PIN tanlang",
      confirmPin: "PINni tasdiqlang",
      confirmPinSubtitle: "Yangi PINni qayta kiriting",
      currentPin: "Joriy PIN",
      currentPinSubtitle: "Davom etish uchun joriy PINni kiriting",
      wrongPin: "Noto'g'ri PIN",
      noMatch: "PIN mos kelmadi, qayta urinib ko'ring",
      lockedOut: "Juda ko'p urinish",
      tryAgainIn: "{{time}} dan keyin urinib ko'ring",
      attemptsRemaining_one: "{{count}} urinish qoldi",
      attemptsRemaining_other: "{{count}} urinish qoldi",
      forgotPin: "PINni unutdingizmi?",
      forgotPinConfirmTitle: "PIN-kodni unutdingizmi?",
      forgotPinConfirmMessage: "Tizimdan chiqarilasiz va bu qurilmadagi PIN o'chiriladi. Yangisini o'rnatish uchun qayta kiring.",
      forgotPinConfirmAction: "Chiqish va tiklash"
    },
    sessions: {
      revoked: "Seans tugatildi",
      current: "Bu qurilma",
      revoke: "Tugatish",
      logoutAll: "Barcha seanslardan chiqish",
      logoutAllConfirm: "Bu qurilma ham, barcha qurilmalar tizimdan chiqariladi.",
      unknownDevice: "Noma'lum qurilma"
    }
  },
  staff: {
    add: "Xodim qo'shish",
    edit: "Xodimni tahrirlash",
    detail: "Xodim",
    created: "Xodim qo'shildi",
    updated: "Xodim yangilandi",
    deactivated: "Xodim o'chirildi",
    deactivate: "O'chirish",
    deactivateConfirm: "Bu shaxs endi tizimga kira olmaydi. Davom etilsinmi?",
    role: "Rol",
    branch: "Filial",
    noBranch: "Filialsiz",
    status: "Holat",
    newPassword: "Yangi parol (bo'sh qoldirilsa — o'zgarmaydi)",
    createHint: "Ushbu telefon raqami va parol bilan kiradi.",
    editHint: "Parolni o'zgartirmaslik uchun bo'sh qoldiring.",
    reactivateHint: "Xodimni qayta faollashtirish"
  },
  admin: {
    tenants: {
      title: "Tashkilotlar",
      empty: "Tashkilotlar yo'q",
      detail: "Tashkilot",
      saved: "Tashkilot yangilandi",
      deactivated: "Tashkilot o'chirildi",
      deactivate: "Tashkilotni o'chirish",
      deactivateConfirm: "Biznes va barcha xodimlar kirish huquqini yo'qotadi. Davom etilsinmi?",
      users: "Xodimlar",
      products: "Mahsulotlar",
      branches: "Filiallar"
    },
    plans: {
      title: "Tarif rejalari",
      empty: "Hali rejalar yo'q",
      add: "Yangi reja",
      edit: "Rejani tahrirlash",
      created: "Reja yaratildi",
      updated: "Reja yangilandi",
      deactivated: "Reja o'chirildi",
      deactivate: "Rejani o'chirish",
      deactivateConfirm: "Yangi tashkilotlar bu rejani tanlay olmaydi. Davom etilsinmi?",
      name: "Reja nomi",
      description: "Tavsif",
      price: "Narx",
      durationDays: "Muddat (kun)",
      maxBranches: "Maks. filiallar",
      maxUsers: "Maks. xodimlar",
      maxProducts: "Maks. mahsulotlar",
      nameRequired: "Reja nomini kiriting",
      durationRequired: "Muddat kamida 1 kun bo'lishi kerak"
    }
  }
};
