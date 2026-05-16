export default {
  auth: {
    welcome: "С возвращением",
    signIn: "Войти",
    signUp: "Регистрация",
    createAccount: "Создать аккаунт",
    loginDescription: "Войдите в свой POS-аккаунт для управления бизнесом.",
    registerDescription: "Настройте свой POS-бизнес менее чем за минуту.",
    phone: "Номер телефона",
    password: "Пароль",
    fullName: "Ваше полное имя",
    businessName: "Название бизнеса",
    language: "Язык",
    dontHaveAccount: "Нет аккаунта?",
    alreadyHaveAccount: "Уже есть аккаунт?",
    back: "Назад",
    loading: "Загрузка...",
    enterPassword: "Введите пароль",
    minCharacters: "Минимум 6 символов",
    errors: {
      phoneRequired: "Номер телефона обязателен",
      passwordRequired: "Пароль обязателен",
      passwordLength: "Пароль должен быть не менее 6 символов",
      fullNameRequired: "Имя обязательно",
      businessNameRequired: "Название бизнеса обязательно",
      loginFailed: "Ошибка входа",
      registerFailed: "Ошибка регистрации"
    }
  },
  tabs: {
    home: "Главная",
    products: "Товары",
    transactions: "Транзакции",
    settings: "Настройки",
  },
  common: {
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    error: "Ошибка",
    success: "Успешно",
    warning: "Предупреждение",
    filter: "Фильтрация",
    fillRequiredFields: "Пожалуйста, заполните обязательные поля",
    exportError: "Ошибка при экспорте",
    permissionsDenied: "Доступ запрещен",
    calculator: "Калькулятор",
    edit: "Изменить",
    paymentMethod: "Способ оплаты",
    paymentMethods: {
      cash: "Наличные",
      card: "Карта",
      transfer: "Банковский перевод",
      other: "Другое"
    }
  },
  home: {
    segments: {
      clients: "Клиенты",
      suppliers: "Поставщики",
      employees: "Сотрудники"
    },
    searchPlaceholder: "Имя, Номер телефона",
    noResults: "Ничего не найдено",
    roles: {
      client: "Клиент",
      supplier: "Поставщик"
    },
    sortBy: "Сортировка",
    sortOrder: "Порядок",
    sortOptions: {
      alphabetic: "По алфавиту",
      createdAt: "Дата создания",
      balance: "Баланс (Долг)"
    },
    orderOptions: {
      asc: "По возрастанию",
      desc: "По убыванию"
    },
    addClient: "Добавить клиента",
    fillDetails: "Заполните данные клиента ниже",
    exportTitle: "Экспорт данных",
    clientName: "Имя",
    clientPhone: "Телефон",
    defaultTenantName: "Мой бизнес",
    exportNotSupported: "Экспорт не поддерживается для этой вкладки",
    contactPermissionError: "Нет доступа к контактам",
    placeholders: {
      clientName: "Введите имя клиента",
      supplierName: "Введите имя поставщика"
    },
    addSupplier: "Добавить поставщика",
    fillDetailsSupplier: "Заполните данные поставщика ниже",
    supplierName: "Имя поставщика",
    supplierPhone: "Телефон поставщика"
  },
  clientDetail: {
    title: "Данные клиента",
    balanceUzs: "Общий баланс (UZS)",
    balanceUsd: "Баланс USD",
    history: "История транзакций",
    noHistory: "Транзакции не найдены",
    giveDebt: "Дать в долг",
    receivePayment: "Принять оплату",
    address: "Адрес",
    notes: "Заметка",
    paymentReceived: "Оплата принята",
    debtIssued: "Долг выдан",
    call: "Позвонить",
    noPhone: "Нет номера телефона",
    idBadge: "ID",
    balanceUsdLabel: "Баланс (USD)",
    balanceUzsLabel: "Баланс (UZS)",
    noAddress: "Адрес не указан",
    giveLoan: "Дать в долг",
    makePayment: "Произвести оплату",
    recentTransactions: "Последние транзакции",
    loanDisbursed: "Долг выдан",
    loanTitle: "Долг",
    paymentForLoan: "Оплата по долгу",
    joined: "Присоединился",
    noNotes: "Заметки для этого клиента отсутствуют.",
    amount: "Сумма",
    currency: "Валюта",
    description: "Описание",
    optionalNotes: "Дополнительные примечания...",
    saveTransaction: "Сохранить транзакцию",
    deleteConfirmation: "Вы уверены, что хотите удалить этого клиента?",
    transactionDetails: "Детали транзакции",
    deleteTxConfirmation: "Вы уверены, что хотите удалить эту транзакцию?",
    totalAmount: "Общий баланс",
    dueDate: "Срок погашения"
  },
  supplierDetail: {
    title: "Данные поставщика",
    balanceUzs: "Общий долг (UZS)",
    balanceUsd: "Баланс USD",
    history: "История транзакций",
    noHistory: "Транзакции не найдены",
    paySupplier: "Оплатить",
    receiveRefund: "Возврат средств",
    address: "Адрес",
    notes: "Заметка",
    paymentMade: "Оплата произведена",
    refundReceived: "Возврат получен",
    call: "Позвонить",
    noPhone: "Нет номера телефона",
    edit: "Редактировать",
    deleteConfirmation: "Вы уверены, что хотите удалить этого поставщика?",
    placeholders: {
        name: "Введите имя поставщика"
    }
  },
  inventory: {
    title: "Инвентаризация",
    totalItems: "Всего товаров",
    lowStock: "Мало в наличии",
    outOfStock: "Нет в наличии",
    totalValue: "Общая стоимость",
    overview: "Обзор",
    recentActivity: "Последние действия",
    viewAll: "Посмотреть все",
  },
  products: {
    title: "Товары",
    searchPlaceholder: "Поиск товаров...",
    allCategories: "Все категории",
    inStock: "В наличии",
    lowStock: "Мало",
    outOfStock: "Нет в наличии",
    addProduct: "Добавить товар",
    productImage: "Изображение товара",
    uploadImage: "Нажмите для загрузки",
    productName: "Название товара",
    sku: "SKU",
    category: "Категория",
    purchasePrice: "Цена закупки",
    sellingPrice: "Цена продажи",
    initialStock: "Начальный остаток",
    saveProduct: "Сохранить товар",
    editProduct: "Изменить",
    isActive: "Активен",
    stockQuantity: "Количество на складе",
    available: "Доступно",
    reserved: "Зарезервировано",
    reorderLevel: "Мин. остаток",
    pricing: "Цены",
    supplier: "Поставщик",
    description: "Описание",
    items: "товаров",
    uncategorized: "Без категории",
    emptyTitle: "Товаров пока нет",
    emptySubtitle: "Нажмите кнопку ниже, чтобы добавить первый товар",
    deleteProduct: "Удалить товар",
    deleteConfirmation: "Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.",
    placeholders: {
      name: "Введите название товара",
      description: "Введите описание товара",
      selectCategory: "Выберите категорию",
      selectBrandCategory: "Выберите категорию бренда",
      selectUnit: "Выберите единицу измерения",
      searchCategory: "Поиск категории...",
      searchBrand: "Поиск бренда..."
    },
    currency: "Валюта",
    brandCategory: "Категория бренда",
    unit: "Единица измерения",
    noCategoryFound: "Категория не найдена.",
    noBrandFound: "Бренд не найден.",
    filters: "Фильтры",
    clearAll: "Очистить все",
    allBrands: "Все бренды",
    sortBy: "Сортировка",
    newest: "Новинки",
    brand: "Бренд",
    na: "Н/Д",
    noDescription: "Описание для этого товара не предоставлено.",
    imageRequirements: "PNG, JPG до 5МБ",
    errors: {
      createFailed: "Не удалось создать товар"
    }
  },
  categories: {
    addCategory: "Добавить категорию",
    name: "Название категории",
    placeholders: {
      name: "Введите название категории"
    },
    errors: {
      createFailed: "Не удалось создать категорию"
    }
  },
  brandCategories: {
    addBrandCategory: "Добавить бренд",
    name: "Название бренда",
    placeholders: {
      name: "Введите название бренда"
    },
    errors: {
      createFailed: "Не удалось создать категорию бренда"
    }
  },
  units: {
    addUnit: "Добавить единицу",
    name: "Название единицы",
    shortName: "Краткое название (напр. кг)",
    placeholders: {
      name: "Введите название единицы",
      shortName: "напр. кг, шт"
    },
    errors: {
      createFailed: "Не удалось создать единицу измерения"
    }
  },
  transactions: {
    title: "Транзакции",
    all: "Все",
    income: "Доход",
    expense: "Расход",
    totalIncome: "Общий доход",
    totalExpense: "Общий расход",
    search: "Поиск транзакций...",
    noResults: "Транзакции не найдены",
    addTransaction: "Добавить транзакцию",
    type: "Тип",
    branch: "Филиал",
    category: "Категория",
    selectCategory: " Выберите категорию",
    selectBranch: " Выберите филиал",
    created: "Транзакция добавлена",
    deleted: "Транзакция удалена",
    deleteConfirmation: "Вы уверены, что хотите удалить эту транзакцию?",
    fillRequired: "Пожалуйста, заполните все обязательные поля"
  }
};
