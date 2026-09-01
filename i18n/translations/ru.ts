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
    sales: "Продажи",
    transactions: "Транзакции",
    settings: "Настройки",
  },
  common: {
    save: "Сохранить",
    cancel: "Отмена",
    confirm: "Подтвердить",
    time: "Время",
    delete: "Удалить",
    error: "Ошибка",
    success: "Успешно",
    warning: "Предупреждение",
    filter: "Фильтрация",
    on: "Вкл",
    off: "Выкл",
    somethingWentWrong: "Что-то пошло не так",
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
      supplier: "Поставщик",
      employee: "Сотрудник"
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
    dueDate: "Срок погашения",
    linkedSale: "Связанная продажа",
    viewSale: "Открыть продажу",
    paidAmount: "Оплачено",
    seller: "Продавец"
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
    allStock: "Весь склад",
    empty: "Записей о складе пока нет",
    noLowStock: "Ничего не заканчивается",
    minLabel: "Мин",
    currentStock: "Текущий остаток",
    quantity: "Количество",
    minQuantity: "Мин. остаток",
    maxQuantity: "Макс. остаток",
    costPrice: "Себестоимость",
    location: "Место хранения",
    notePlaceholder: "Примечание (причина изменения)",
    saveChanges: "Сохранить изменения",
    adjusted: "Склад обновлён",
    movements: "История движений",
    noMovements: "Движений пока нет",
    movementTypes: {
      in: "Приход",
      out: "Расход",
      adjustment: "Корректировка"
    },
    deleteRecord: "Удалить складскую запись",
    deleteConfirm: "Запись о складе для этого товара будет удалена безвозвратно. Продолжить?",
    deleted: "Складская запись удалена"
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
      sku: "Введите штрих-код / SKU (необязательно)",
      selectCategory: "Выберите категорию",
      selectBrandCategory: "Выберите категорию бренда",
      selectUnit: "Выберите единицу измерения",
      selectSupplier: "Выберите поставщика",
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
    date: "Дата",
    detail: "Детали транзакции",
    deleteTitle: "Удалить транзакцию",
    deleteConfirmation: "Вы уверены, что хотите удалить эту транзакцию?",
    fillRequired: "Пожалуйста, заполните все обязательные поля"
  },
  sales: {
    title: "Продажи",
    createPosSale: "Новая Продажа",
    tabs: {
      all: "Все",
      completed: "Завершено",
      debt: "Долг",
      cancelled: "Отменено"
    },
    status: {
      completed: "Завершено",
      debt: "Долг",
      cancelled: "Отменено",
      unknown: "Неизвестно"
    },
    walkInCustomer: "Обычный клиент",
    noResults: "Продажи не найдены",
    items_one: "{{count}} товар",
    items_few: "{{count}} товара",
    items_many: "{{count}} товаров",
    items_other: "{{count}} товаров",
    summary: {
      revenue: "Выручка",
      profit: "Прибыль",
      debt: "Долг"
    },
    pos: {
      title: "Новая продажа",
      addItems: "Добавить товары",
      searchProducts: "Поиск товаров...",
      cart: "Корзина",
      cartEmpty: "Товары ещё не добавлены",
      client: "Клиент (необязательно)",
      walkIn: "Обычный клиент",
      discount: "Скидка",
      sellOnDebt: "Продать в долг",
      paidAmount: "Сумма оплаты",
      subtotal: "Подытог",
      total: "Итого",
      toPay: "Оплачено",
      debt: "Долг",
      available: "Доступно",
      outOfStock: "Нет в наличии",
      checkout: "Оформить",
      errors: {
        emptyCart: "Добавьте хотя бы один товар",
        clientRequiredForDebt: "Выберите клиента для продажи в долг",
        paidExceedsTotal: "Оплата не может превышать сумму"
      },
      success: {
        saleCreated: "Продажа сохранена"
      }
    },
    detail: {
      title: "Детали продажи",
      client: "Клиент",
      seller: "Продавец",
      date: "Дата",
      walkIn: "Обычный клиент",
      items: "Товары",
      subtotal: "Подытог",
      discount: "Скидка",
      total: "Итого",
      paid: "Оплачено",
      debt: "Долг",
      cancelSale: "Отменить продажу",
      cancelConfirm: "Товар вернётся на склад, долг клиента будет отменён. Продолжить?",
      cancelSuccess: "Продажа отменена",
      linkedDebt: "Связанные операции клиента",
      payDebt: "Погасить долг",
      remainingDebt: "Остаток долга",
      confirmPayment: "Подтвердить оплату",
      paySuccess: "Оплата зафиксирована"
    }
  },
  settings: {
    sections: {
      account: "Аккаунт",
      business: "Бизнес",
      security: "Безопасность",
      appearance: "Оформление",
      administration: "Администрирование"
    },
    rows: {
      profile: "Профиль",
      password: "Сменить пароль",
      business: "Профиль бизнеса",
      branches: "Филиалы",
      catalog: "Каталог",
      subscription: "Подписка",
      appLock: "Блокировка (PIN)",
      sessions: "Активные сеансы",
      theme: "Тема",
      logout: "Выйти",
      tenants: "Организации",
      plans: "Тарифные планы"
    },
    roles: {
      super_admin: "Супер-админ",
      owner: "Владелец",
      seller: "Продавец"
    },
    logoutConfirm: "Потребуется войти снова, чтобы пользоваться приложением.",
    profile: {
      saved: "Профиль обновлён",
      nameLockedForSeller: "Имя может изменить только владелец."
    },
    password: {
      changed: "Пароль изменён",
      current: "Текущий пароль",
      new: "Новый пароль",
      confirm: "Повторите новый пароль",
      currentRequired: "Введите текущий пароль",
      mismatch: "Новые пароли не совпадают",
      hint: "Минимум 6 символов.",
      submit: "Обновить пароль"
    },
    business: {
      saved: "Бизнес обновлён",
      readOnlyForSeller: "Изменять данные бизнеса может только владелец."
    },
    branches: {
      empty: "Филиалов пока нет",
      add: "Новый филиал",
      edit: "Изменить филиал",
      created: "Филиал создан",
      updated: "Филиал обновлён",
      deactivated: "Филиал отключён",
      active: "Активен",
      inactive: "Отключён",
      deactivate: "Отключить филиал",
      deactivateConfirm: "Филиал будет скрыт и помечен как неактивный. Продолжить?"
    },
    catalog: {
      categories: "Категории",
      "brand-categories": "Бренды",
      units: "Единицы"
    },
    subscription: {
      noPlan: "Без плана",
      until: "до",
      renews: "Продление",
      available: "Доступные планы",
      currentPlan: "Текущий план",
      contactToChange: "Свяжитесь с поддержкой, чтобы сменить план.",
      status: {
        trial: "Пробный",
        active: "Активна",
        expired: "Истекла",
        cancelled: "Отменена"
      },
      limits: {
        days: "{{count}} дней доступа",
        branches: "До {{count}} филиалов",
        users: "До {{count}} сотрудников",
        products: "До {{count}} товаров"
      }
    },
    security: {
      on: "Блокировка включена",
      off: "Блокировка выключена",
      explainer: "Запрашивать 4-значный PIN при запуске приложения.",
      enable: "Задать PIN",
      lockNow: "Заблокировать сейчас",
      change: "Сменить PIN",
      disable: "Выключить блокировку",
      enabled: "Блокировка включена",
      disabled: "Блокировка выключена",
      enterPin: "Введите PIN",
      enterPinSubtitle: "Введите PIN для разблокировки",
      newPin: "Новый PIN",
      newPinSubtitle: "Придумайте 4-значный PIN",
      confirmPin: "Подтвердите PIN",
      confirmPinSubtitle: "Введите новый PIN ещё раз",
      currentPin: "Текущий PIN",
      currentPinSubtitle: "Введите текущий PIN, чтобы продолжить",
      wrongPin: "Неверный PIN",
      noMatch: "PIN не совпал, попробуйте снова",
      lockedOut: "Слишком много попыток",
      tryAgainIn: "Повторите через {{time}}",
      attemptsRemaining_one: "Осталась {{count}} попытка",
      attemptsRemaining_few: "Осталось {{count}} попытки",
      attemptsRemaining_many: "Осталось {{count}} попыток",
      attemptsRemaining_other: "Осталось {{count}} попыток",
      forgotPin: "Забыли PIN?",
      forgotPinConfirmTitle: "Забыли PIN-код?",
      forgotPinConfirmMessage: "Вы выйдете из аккаунта, а PIN на этом устройстве будет удалён. Войдите снова, чтобы задать новый.",
      forgotPinConfirmAction: "Выйти и сбросить"
    },
    sessions: {
      revoked: "Сеанс завершён",
      current: "Это устройство",
      revoke: "Завершить",
      logoutAll: "Завершить все сеансы",
      logoutAllConfirm: "Все устройства, включая это, будут разлогинены.",
      unknownDevice: "Неизвестное устройство"
    }
  },
  staff: {
    add: "Добавить сотрудника",
    edit: "Изменить сотрудника",
    detail: "Сотрудник",
    created: "Сотрудник добавлен",
    updated: "Сотрудник обновлён",
    deactivated: "Сотрудник отключён",
    deactivate: "Отключить",
    deactivateConfirm: "Этот человек больше не сможет войти. Продолжить?",
    role: "Роль",
    branch: "Филиал",
    noBranch: "Без филиала",
    status: "Статус",
    newPassword: "Новый пароль (пусто — оставить прежний)",
    createHint: "Вход по этому номеру телефона и паролю.",
    editHint: "Оставьте пароль пустым, чтобы не менять его.",
    reactivateHint: "Восстановить сотрудника"
  },
  admin: {
    tenants: {
      title: "Организации",
      empty: "Организаций нет",
      detail: "Организация",
      saved: "Организация обновлена",
      deactivated: "Организация отключена",
      deactivate: "Отключить организацию",
      deactivateConfirm: "Бизнес и все сотрудники потеряют доступ. Продолжить?",
      users: "Сотрудники",
      products: "Товары",
      branches: "Филиалы"
    },
    plans: {
      title: "Тарифные планы",
      empty: "Планов пока нет",
      add: "Новый план",
      edit: "Изменить план",
      created: "План создан",
      updated: "План обновлён",
      deactivated: "План отключён",
      deactivate: "Отключить план",
      deactivateConfirm: "Новые организации не смогут выбрать этот план. Продолжить?",
      name: "Название плана",
      description: "Описание",
      price: "Цена",
      durationDays: "Срок (дней)",
      maxBranches: "Макс. филиалов",
      maxUsers: "Макс. сотрудников",
      maxProducts: "Макс. товаров",
      nameRequired: "Введите название плана",
      durationRequired: "Срок — не менее 1 дня"
    }
  }
};
