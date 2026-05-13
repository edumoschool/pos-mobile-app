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
    fillRequiredFields: "Пожалуйста, заполните обязательные поля"
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
    }
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
    noPhone: "Нет номера телефона"
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
      searchCategory: "Поиск категории...",
      searchBrand: "Поиск бренда..."
    },
    currency: "Валюта",
    brandCategory: "Категория бренда",
    noCategoryFound: "Категория не найдена.",
    noBrandFound: "Бренд не найден."
  }
};
