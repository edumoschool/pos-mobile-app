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
    calculator: "Calculator"
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
    clientName: "Name",
    clientPhone: "Phone",
    defaultTenantName: "My Business",
    exportNotSupported: "Export not supported for this tab",
    contactPermissionError: "Contacts permission not granted",
    placeholders: {
      clientName: "Enter client name"
    }
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
    noPhone: "No phone number"
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
      searchCategory: "Search category...",
      searchBrand: "Search brand..."
    },
    currency: "Currency",
    brandCategory: "Brand Category",
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
  }
};
