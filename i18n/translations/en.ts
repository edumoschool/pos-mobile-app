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
    sales: "Sales",
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
    on: "On",
    off: "Off",
    somethingWentWrong: "Something went wrong",
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
      supplier: "Supplier",
      employee: "Employee"
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
    allStock: "All Stock",
    empty: "No inventory records yet",
    noLowStock: "Nothing is running low",
    minLabel: "Min",
    currentStock: "Current Stock",
    quantity: "Quantity",
    minQuantity: "Min quantity",
    maxQuantity: "Max quantity",
    costPrice: "Cost price",
    location: "Storage location",
    notePlaceholder: "Note (reason for this change)",
    saveChanges: "Save changes",
    adjusted: "Inventory updated",
    movements: "Movement History",
    noMovements: "No movements recorded yet",
    movementTypes: {
      in: "Stock in",
      out: "Stock out",
      adjustment: "Adjustment"
    },
    deleteRecord: "Delete inventory record",
    deleteConfirm: "This permanently removes the stock record for this product. Continue?",
    deleted: "Inventory record deleted"
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
    date: "Date",
    detail: "Transaction Detail",
    deleteTitle: "Delete Transaction",
    deleteConfirmation: "Are you sure you want to delete this transaction?",
    fillRequired: "Please fill in all required fields"
  },
  sales: {
    title: "Sales",
    createPosSale: "Create Sale",
    tabs: {
      all: "All",
      completed: "Completed",
      debt: "Debt",
      cancelled: "Cancelled"
    },
    status: {
      completed: "Completed",
      debt: "Debt",
      cancelled: "Cancelled",
      unknown: "Unknown"
    },
    walkInCustomer: "Walk-in Customer",
    noResults: "No sales found",
    items_one: "{{count}} item",
    items_other: "{{count}} items",
    summary: {
      revenue: "Revenue",
      profit: "Profit",
      debt: "Debt"
    },
    pos: {
      title: "New Sale",
      addItems: "Add items",
      searchProducts: "Search products...",
      cart: "Cart",
      cartEmpty: "No items added yet",
      client: "Client (optional)",
      walkIn: "Walk-in customer",
      discount: "Discount",
      fullyPaid: "Paid in full",
      paidAmount: "Amount paid now",
      subtotal: "Subtotal",
      total: "Total",
      toPay: "Paid",
      debt: "Debt",
      available: "Available",
      outOfStock: "Out of stock",
      checkout: "Checkout",
      errors: {
        emptyCart: "Add at least one product",
        clientRequiredForDebt: "Select a client for a debt sale",
        paidExceedsTotal: "Paid amount cannot exceed the total"
      },
      success: {
        saleCreated: "Sale recorded"
      }
    },
    detail: {
      title: "Sale Details",
      client: "Client",
      seller: "Seller",
      date: "Date",
      walkIn: "Walk-in customer",
      items: "Items",
      subtotal: "Subtotal",
      discount: "Discount",
      total: "Total",
      paid: "Paid",
      debt: "Debt",
      cancelSale: "Cancel Sale",
      cancelConfirm: "This restores stock and reverses any client debt. Continue?",
      cancelSuccess: "Sale cancelled",
      linkedDebt: "Linked client transactions"
    }
  },
  settings: {
    sections: {
      account: "Account",
      business: "Business",
      security: "Security",
      appearance: "Appearance",
      administration: "Administration"
    },
    rows: {
      profile: "Profile",
      password: "Change password",
      business: "Business profile",
      branches: "Branches",
      catalog: "Catalog",
      subscription: "Subscription",
      appLock: "App lock (PIN)",
      sessions: "Active sessions",
      theme: "Theme",
      logout: "Log out",
      tenants: "Tenants",
      plans: "Subscription plans"
    },
    roles: {
      super_admin: "Super admin",
      owner: "Owner",
      seller: "Seller"
    },
    logoutConfirm: "You'll need to sign in again to use the app.",
    profile: {
      saved: "Profile updated",
      nameLockedForSeller: "Only an owner can change your name."
    },
    password: {
      changed: "Password changed",
      current: "Current password",
      new: "New password",
      confirm: "Confirm new password",
      currentRequired: "Enter your current password",
      mismatch: "The new passwords don't match",
      hint: "Use at least 6 characters.",
      submit: "Update password"
    },
    business: {
      saved: "Business updated",
      readOnlyForSeller: "Only an owner can edit business details."
    },
    branches: {
      empty: "No branches yet",
      add: "New branch",
      edit: "Edit branch",
      created: "Branch created",
      updated: "Branch updated",
      deactivated: "Branch deactivated",
      active: "Active",
      inactive: "Inactive",
      deactivate: "Deactivate branch",
      deactivateConfirm: "This branch will be hidden and marked inactive. Continue?"
    },
    catalog: {
      categories: "Categories",
      "brand-categories": "Brands",
      units: "Units"
    },
    subscription: {
      noPlan: "No plan",
      until: "until",
      renews: "Renews",
      available: "Available plans",
      currentPlan: "Current plan",
      contactToChange: "Contact support to change your plan.",
      status: {
        trial: "Trial",
        active: "Active",
        expired: "Expired",
        cancelled: "Cancelled"
      },
      limits: {
        days: "{{count}} days of access",
        branches: "Up to {{count}} branches",
        users: "Up to {{count}} staff",
        products: "Up to {{count}} products"
      }
    },
    security: {
      on: "App lock is on",
      off: "App lock is off",
      explainer: "Require a 4-digit PIN to open the app.",
      enable: "Set up a PIN",
      lockNow: "Lock now",
      change: "Change PIN",
      disable: "Turn off app lock",
      enabled: "App lock enabled",
      disabled: "App lock disabled",
      enterPin: "Enter PIN",
      enterPinSubtitle: "Enter your PIN to unlock",
      newPin: "New PIN",
      newPinSubtitle: "Choose a 4-digit PIN",
      confirmPin: "Confirm PIN",
      confirmPinSubtitle: "Re-enter your new PIN",
      currentPin: "Current PIN",
      currentPinSubtitle: "Enter your current PIN to continue",
      wrongPin: "Incorrect PIN",
      noMatch: "PINs didn't match, try again",
      lockedOut: "Too many attempts",
      tryAgainIn: "Try again in {{time}}",
      attemptsRemaining_one: "{{count}} attempt remaining",
      attemptsRemaining_other: "{{count}} attempts remaining"
    },
    sessions: {
      revoked: "Session revoked",
      current: "This device",
      revoke: "Revoke",
      logoutAll: "Log out all sessions",
      logoutAllConfirm: "Every device, including this one, will be signed out.",
      unknownDevice: "Unknown device"
    }
  },
  staff: {
    add: "Add staff",
    edit: "Edit staff",
    detail: "Staff member",
    created: "Staff member added",
    updated: "Staff member updated",
    deactivated: "Staff member deactivated",
    deactivate: "Deactivate",
    deactivateConfirm: "This person will no longer be able to sign in. Continue?",
    role: "Role",
    branch: "Branch",
    noBranch: "No branch",
    status: "Status",
    newPassword: "New password (leave blank to keep)",
    createHint: "They sign in with this phone number and password.",
    editHint: "Leave the password blank to keep the current one.",
    reactivateHint: "Reactivate this staff member"
  },
  admin: {
    tenants: {
      title: "Tenants",
      empty: "No tenants",
      detail: "Tenant",
      saved: "Tenant updated",
      deactivated: "Tenant deactivated",
      deactivate: "Deactivate tenant",
      deactivateConfirm: "The business and all its staff will lose access. Continue?",
      users: "Staff",
      products: "Products",
      branches: "Branches"
    },
    plans: {
      title: "Subscription plans",
      empty: "No plans yet",
      add: "New plan",
      edit: "Edit plan",
      created: "Plan created",
      updated: "Plan updated",
      deactivated: "Plan deactivated",
      deactivate: "Deactivate plan",
      deactivateConfirm: "New tenants won't be able to pick this plan. Continue?",
      name: "Plan name",
      description: "Description",
      price: "Price",
      durationDays: "Duration (days)",
      maxBranches: "Max branches",
      maxUsers: "Max staff",
      maxProducts: "Max products",
      nameRequired: "Enter a plan name",
      durationRequired: "Duration must be at least 1 day"
    }
  }
};
