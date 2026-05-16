export default {
  auth: {
    welcome: "Welcome back",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create account",
    loginDescription: "Sign in to your POS account to manage your business.",
    registerDescription: "Set up your POS business in under a minute.",
    phone: "Phone Number",
    password: "Password",
    fullName: "Your Full Name",
    businessName: "Business Name",
    language: "Language",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    back: "Back",
    loading: "Loading...",
    enterPassword: "Enter password",
    minCharacters: "Min 6 characters",
    errors: {
      phoneRequired: "Phone number is required",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 6 characters",
      fullNameRequired: "Full name is required",
      businessNameRequired: "Business name is required",
      loginFailed: "Login failed",
      registerFailed: "Registration failed"
    }
  },
  tabs: {
    home: "Home",
    products: "Products",
    transactions: "Transactions",
    settings: "Settings",
  },
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    error: "Error",
    success: "Success",
    warning: "Warning",
    filter: "Filter",
    fillRequiredFields: "Please fill in required fields",
    exportError: "Error during export",
    permissionsDenied: "Permission denied",
    calculator: "Calculator",
    edit: "Edit",
    paymentMethod: "Payment Method",
    paymentMethods: {
      cash: "Cash",
      card: "Card",
      transfer: "Bank Transfer",
      other: "Other"
    }
  },
  home: {
    segments: {
      clients: "Clients",
      suppliers: "Suppliers",
      employees: "Employees"
    },
    searchPlaceholder: "Name, Phone number",
    noResults: "No results found",
    roles: {
      client: "Client",
      supplier: "Supplier"
    },
    sortBy: "Sort By",
    sortOrder: "Order",
    sortOptions: {
      alphabetic: "Alphabetic",
      createdAt: "Created Date",
      balance: "Balance (Debt)"
    },
    orderOptions: {
      asc: "Ascending",
      desc: "Descending"
    },
    addClient: "Add Client",
    fillDetails: "Fill in the client details below",
    exportTitle: "Export Data",
    clientName: "Name",
    clientPhone: "Phone",
    defaultTenantName: "My Business",
    exportNotSupported: "Export not supported for this tab",
    contactPermissionError: "Contacts permission not granted",
    placeholders: {
      clientName: "Enter client name",
      supplierName: "Enter supplier name"
    },
    addSupplier: "Add Supplier",
    fillDetailsSupplier: "Fill in the supplier details below",
    supplierName: "Supplier Name",
    supplierPhone: "Supplier Phone"
  },
  clientDetail: {
    title: "Client Details",
    balanceUzs: "Total Balance (UZS)",
    balanceUsd: "USD Balance",
    history: "Transaction History",
    noHistory: "No transactions found",
    giveDebt: "Give Debt",
    receivePayment: "Receive Payment",
    address: "Address",
    notes: "Notes",
    paymentReceived: "Payment Received",
    debtIssued: "Debt Issued",
    call: "Call",
    noPhone: "No phone number",
    idBadge: "ID",
    balanceUsdLabel: "Balance (USD)",
    balanceUzsLabel: "Balance (UZS)",
    noAddress: "Address not provided",
    giveLoan: "Give Loan",
    makePayment: "Make Payment",
    recentTransactions: "Recent Transactions",
    loanDisbursed: "Loan Disbursed",
    loanTitle: "Loan",
    paymentForLoan: "Payment for loan",
    joined: "Joined",
    noNotes: "No notes available for this client.",
    amount: "Amount",
    currency: "Currency",
    description: "Description",
    optionalNotes: "Optional notes...",
    saveTransaction: "Save Transaction",
    deleteConfirmation: "Are you sure you want to delete this client?",
    transactionDetails: "Transaction Details",
    deleteTxConfirmation: "Are you sure you want to delete this transaction?",
    totalAmount: "Total Balance",
    dueDate: "Due Date"
  },
  supplierDetail: {
    title: "Supplier Details",
    balanceUzs: "Total Debt (UZS)",
    balanceUsd: "USD Balance",
    history: "Transaction History",
    noHistory: "No transactions found",
    paySupplier: "Pay Supplier",
    receiveRefund: "Receive Refund",
    address: "Address",
    notes: "Notes",
    paymentMade: "Payment Made",
    refundReceived: "Refund Received",
    call: "Call",
    noPhone: "No phone number",
    edit: "Edit Supplier",
    deleteConfirmation: "Are you sure you want to delete this supplier?",
    placeholders: {
        name: "Enter supplier name"
    }
  },
  inventory: {
    title: "Inventory",
    totalItems: "Total Items",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    totalValue: "Total Value",
    overview: "Overview",
    recentActivity: "Recent Activity",
    viewAll: "View All",
  },
  products: {
    title: "Products",
    searchPlaceholder: "Search products...",
    allCategories: "All Categories",
    inStock: "In Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    addProduct: "Add Product",
    productImage: "Product Image",
    uploadImage: "Tap to upload image",
    productName: "Product Name",
    sku: "SKU",
    category: "Category",
    purchasePrice: "Purchase Price",
    sellingPrice: "Selling Price",
    initialStock: "Initial Stock",
    saveProduct: "Save Product",
    editProduct: "Edit",
    isActive: "Is Active",
    stockQuantity: "Stock Quantity",
    available: "Available",
    reserved: "Reserved",
    reorderLevel: "Reorder Level",
    pricing: "Pricing",
    supplier: "Supplier",
    description: "Description",
    items: "items",
    uncategorized: "Uncategorized",
    emptyTitle: "No products yet",
    emptySubtitle: "Tap the button below to add your first product",
    deleteProduct: "Delete Product",
    deleteConfirmation: "Are you sure you want to delete this product? This action cannot be undone.",
    placeholders: {
      name: "Enter product name",
      description: "Enter product description",
      selectCategory: "Select category",
      selectBrandCategory: "Select brand category",
      selectUnit: "Select unit",
      searchCategory: "Search category...",
      searchBrand: "Search brand..."
    },
    currency: "Currency",
    brandCategory: "Brand Category",
    unit: "Unit",
    noCategoryFound: "No category found.",
    noBrandFound: "No brand found.",
    filters: "Filters",
    clearAll: "Clear all",
    allBrands: "All Brands",
    sortBy: "Sort by",
    newest: "Newest",
    brand: "Brand",
    na: "N/A",
    noDescription: "No description provided for this product.",
    imageRequirements: "PNG, JPG up to 5MB",
    errors: {
      createFailed: "Could not create product"
    }
  },
  categories: {
    addCategory: "Add Category",
    name: "Category Name",
    placeholders: {
      name: "Enter category name"
    },
    errors: {
      createFailed: "Could not create category"
    }
  },
  brandCategories: {
    addBrandCategory: "Add Brand",
    name: "Brand Name",
    placeholders: {
      name: "Enter brand name"
    },
    errors: {
      createFailed: "Could not create brand category"
    }
  },
  units: {
    addUnit: "Add Unit",
    name: "Unit Name",
    shortName: "Short Name (e.g. kg)",
    placeholders: {
      name: "Enter unit name",
      shortName: "e.g. kg, pcs"
    },
    errors: {
      createFailed: "Could not create unit"
    }
  },
  transactions: {
    title: "Transactions",
    all: "All",
    income: "Income",
    expense: "Expense",
    totalIncome: "Total Income",
    totalExpense: "Total Expense",
    search: "Search transactions...",
    noResults: "No transactions found",
    addTransaction: "Add Transaction",
    type: "Type",
    branch: "Branch",
    category: "Category",
    selectCategory: " Select a category",
    selectBranch: " Select a branch",
    created: "Transaction added",
    deleted: "Transaction deleted",
    deleteConfirmation: "Are you sure you want to delete this transaction?",
    fillRequired: "Please fill in all required fields"
  }
};
