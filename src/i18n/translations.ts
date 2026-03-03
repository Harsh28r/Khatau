export type Language = 'en' | 'hi'

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    orders: 'Orders',
    customers: 'Customers',
    products: 'Products',
    khata: 'Khata',
    settings: 'Settings',
    logout: 'Logout',
    
    // Dashboard
    dashboard: 'Dashboard',
    totalOrders: 'Total Orders',
    pending: 'Pending',
    revenue: 'Revenue',
    recentOrders: 'Recent Orders',
    
    // Khata/Credit
    creditBook: 'Credit Book',
    totalOutstanding: 'Total Outstanding',
    customersWithCredit: 'Customers with Credit',
    recordPayment: 'Record Payment',
    addCredit: 'Add Credit',
    paid: 'Paid',
    unpaid: 'Unpaid',
    partial: 'Partial',
    balance: 'Balance',
    lastPayment: 'Last Payment',
    paymentHistory: 'Payment History',
    
    // Customer
    customerName: 'Customer Name',
    phone: 'Phone',
    address: 'Address',
    addCustomer: 'Add Customer',
    editCustomer: 'Edit Customer',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    
    // Status
    completed: 'Completed',
    cancelled: 'Cancelled',
    preparing: 'Preparing',
    confirmed: 'Confirmed',
    
    // Common
    total: 'Total',
    amount: 'Amount',
    date: 'Date',
    noData: 'No data',
    loading: 'Loading...',
  },
  hi: {
    // Navigation
    home: 'होम',
    orders: 'ऑर्डर',
    customers: 'ग्राहक',
    products: 'सामान',
    khata: 'खाता',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    
    // Dashboard
    dashboard: 'डैशबोर्ड',
    totalOrders: 'कुल ऑर्डर',
    pending: 'बाकी',
    revenue: 'कमाई',
    recentOrders: 'हाल के ऑर्डर',
    
    // Khata/Credit
    creditBook: 'उधार खाता',
    totalOutstanding: 'कुल बाकी',
    customersWithCredit: 'उधार वाले ग्राहक',
    recordPayment: 'पेमेंट दर्ज करें',
    addCredit: 'उधार जोड़ें',
    paid: 'चुकाया',
    unpaid: 'बाकी',
    partial: 'आधा',
    balance: 'बाकी रकम',
    lastPayment: 'आखिरी पेमेंट',
    paymentHistory: 'पेमेंट हिस्ट्री',
    
    // Customer
    customerName: 'ग्राहक का नाम',
    phone: 'फ़ोन',
    address: 'पता',
    addCustomer: 'ग्राहक जोड़ें',
    editCustomer: 'ग्राहक बदलें',
    
    // Actions
    save: 'सेव',
    cancel: 'रद्द',
    delete: 'हटाएं',
    edit: 'बदलें',
    add: 'जोड़ें',
    search: 'खोजें',
    
    // Status
    completed: 'पूरा',
    cancelled: 'रद्द',
    preparing: 'बन रहा है',
    confirmed: 'कन्फर्म',
    
    // Common
    total: 'कुल',
    amount: 'रकम',
    date: 'तारीख',
    noData: 'कोई डाटा नहीं',
    loading: 'लोड हो रहा...',
  },
}

export type TranslationKey = keyof typeof translations.en



