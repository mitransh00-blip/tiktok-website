import { createContext, useState, useContext } from "react";

const translations = {
  en: {
    // Auth
    welcome_back: "Welcome Back",
    create_account: "Create Account",
    username: "Username",
    email: "Email",
    phone_number: "Phone Number",
    password: "Password",
    confirm_password: "Confirm Password",
    login: "Login",
    register: "Register",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    already_have_account: "Already have an account?",
    username_or_phone: "Username or Phone",
    username_or_phone_or_email: "Username, phone or email",
    cameroon_only: "Cameroon only (+237)",
    cameroon_phone_format: "9 digits any 0-9",
    select_language: "Select Language",
    preferred_language: "Preferred Language",
    please_wait: "Please wait...",
    passwords_dont_match: "Passwords don't match",
    password_too_short: "Password must be at least 6 characters",
    username_too_short: "Username must be at least 3 characters",
    username_invalid_chars: "Username can only contain letters, numbers and underscores",
    something_went_wrong: "Something went wrong",
    continue_as_guest: "Continue as Guest",
    authentication_failed: "Authentication failed",
    
    // Navigation
    market: "Market",
    preference: "Preference",
    explore: "Explore",
    live: "LIVE",
    search_placeholder: "Search products...",
    search: "Search",
    
    // Actions
    like: "Like",
    comment: "Comment",
    favorite: "Add to Cart",
    share: "Share",
    request: "Request",
    repost: "Repost",
    download: "Download",
    
    // Order
    quantity: "Quantity",
    size: "Size",
    color: "Color",
    submit_request: "Submit Request",
    cancel: "Cancel",
    send_request: "Send Request",
    order_request: "Order Request",
    order_placed: "Your order has been placed!",
    order_approved: "Order Approved - Please Pay",
    order_pending: "Order Pending",
    order_paid: "Paid - Awaiting Delivery",
    order_delivered: "Delivered",
    order_confirmed: "Confirmed - Thank you!",
    order_cancelled: "Cancelled",
    order_refunded: "Refunded",
    
    // Payment
    payment: "Payment",
    mtn_mobile_money: "MTN Mobile Money",
    orange_money: "Orange Money",
    confirm_payment: "Confirm Payment",
    payment_instructions_mtn: "Dial *126# to send payment",
    payment_instructions_orange: "Dial #123# to send payment",
    payment_successful: "Payment Successful!",
    payment_failed: "Payment Failed",
    auto_refund_notice: "If vendor doesn't deliver within 7 days, you'll be automatically refunded",
    
    // Profile
    my_products: "My Products",
    cart: "Cart",
    liked: "Liked",
    profile: "Profile",
    followers: "Followers",
    following: "Following",
    likes: "Likes",
    logout: "Logout",
    edit_profile: "Edit Profile",
    followers_count: "Followers",
    following_count: "Following",
    likes_count: "Likes",
    transactions: "Transactions",
    viral_score: "Trending Score",
    
    // Upload
    upload_product: "Upload Product",
    title: "Title",
    description: "Description",
    price: "Price",
    location: "Location",
    select_image: "Select Image",
    select_video: "Select Video",
    uploading: "Uploading...",
    upload_success: "Product uploaded successfully!",
    available_colors: "Available Colors",
    available_sizes: "Available Sizes",
    enter_colors: "Enter colors (comma separated)",
    enter_sizes: "Enter sizes (comma separated)",
    
    // Notifications
    notifications: "Notifications",
    messages: "Messages",
    no_notifications: "No notifications yet",
    no_messages: "No messages yet",
    new_order_request: "New Order Request",
    order_approved_msg: "Your order has been approved!",
    payment_received_msg: "Payment received! Please deliver the order.",
    order_delivered_msg: "Your order has been delivered!",
    order_confirmed_msg: "Order confirmed! 97% released to vendor.",
    
    // Status
    processing: "Processing...",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    retry: "Retry",
    
    // Messages
    follow: "Follow",
    unfollow: "Unfollow",
    following: "Following",
    view_profile: "View Profile",
    confirm_receipt: "Confirm Receipt",
    order_received: "I Received My Order",
    vendor_info: "Vendor",
    price_label: "Price",
    amount: "Total Amount",
    delivery_within_7_days: "Delivery within 7 days",
    trending_now: "Trending Now",
    no_products: "No products found",
    be_first_to_upload: "Be the first to upload!",
    follow_vendors: "Follow vendors to see their products in Preference",
    
    // Validation
    username_required: "Username is required",
    email_required: "Email is required",
    phone_required: "Phone number is required",
    password_required: "Password is required",
    invalid_email: "Invalid email format",
    invalid_phone: "Invalid phone number",
    username_taken: "Username already taken",
    phone_taken: "Phone number already registered",
    email_taken: "Email already registered",
    
    // Misc
    xaf: "XAF",
    items: "items",
    view_all: "View All",
    cancel_order: "Cancel Order",
    approve_order: "Approve Order",
    mark_delivered: "Mark as Delivered",
    
    // Guest Modal
    oops: "Oops!",
    login_to_continue: "Login to continue",
    login_to_like: "Login to like this product",
    login_to_comment: "Login to comment",
    login_to_favorite: "Login to add to cart",
    login_to_request: "Login to request this product",
    login_to_follow: "Login to follow this vendor",
    continue_browsing: "Continue browsing",
    
    // Admin
    admin_dashboard: "Admin Dashboard",
    total_users: "Total Users",
    total_products: "Total Products",
    total_orders: "Total Orders",
    total_revenue: "Total Revenue",
    recent_orders: "Recent Orders",
    all_users: "All Users",
    all_products: "All Products",
    delete: "Delete",
    ban: "Ban",
    unban: "Unban",
    active: "Active",
    banned: "Banned",
    admin_only: "Admin access only",
    unauthorized: "Unauthorized access",
  },
  fr: {
    // Auth
    welcome_back: "Bienvenue",
    create_account: "Creer un compte",
    username: "Nom d'utilisateur",
    email: "Email",
    phone_number: "Numero de telephone",
    password: "Mot de passe",
    confirm_password: "Confirmer le mot de passe",
    login: "Connexion",
    register: "S'inscrire",
    no_account: "Pas de compte?",
    have_account: "Deja un compte?",
    username_or_phone: "Nom ou Telephone",
    cameroon_only: "Cameroun uniquement (+237)",
    select_language: "Choisir la langue",
    please_wait: "Veuillez patienter...",
    passwords_dont_match: "Les mots de passe ne correspondent pas",
    password_too_short: "Le mot de passe doit contenir au moins 6 caracteres",
    something_went_wrong: "Une erreur s'est produite",
    continue_as_guest: "Continuer en tant qu'invite",
    
    // Navigation
    market: "Marche",
    preference: "Preference",
    explore: "Explorer",
    live: "DIRECT",
    search_placeholder: "Rechercher des produits...",
    search: "Rechercher",
    
    // Actions
    like: "Aimer",
    comment: "Commenter",
    favorite: "Ajouter au panier",
    share: "Partager",
    request: "Commander",
    repost: "Republier",
    download: "Telecharger",
    
    // Order
    quantity: "Quantite",
    size: "Taille",
    color: "Couleur",
    submit_request: "Envoyer la demande",
    cancel: "Annuler",
    send_request: "Envoyer la demande",
    order_request: "Demande de commande",
    order_placed: "Votre commande a ete envoyee!",
    order_approved: "Commande approuvee - Veuillez payer",
    order_pending: "Commande en attente",
    order_paid: "Paye - En attente de livraison",
    order_delivered: "Livre",
    order_confirmed: "Confirme - Merci!",
    order_cancelled: "Annule",
    order_refunded: "Rembourse",
    
    // Payment
    payment: "Paiement",
    mtn_mobile_money: "MTN Mobile Money",
    orange_money: "Orange Money",
    confirm_payment: "Confirmer le paiement",
    payment_instructions_mtn: "Composez *126# pour envoyer le paiement",
    payment_instructions_orange: "Composez #123# pour envoyer le paiement",
    payment_successful: "Paiement reussi!",
    payment_failed: "Paiement echoue",
    auto_refund_notice: "Si le vendeur ne livre pas sous 7 jours, vous serez automatiquement rembourse",
    
    // Profile
    my_products: "Mes produits",
    cart: "Panier",
    liked: "Aimes",
    profile: "Profil",
    followers: "Abonnes",
    following: "Abonnements",
    likes: "Aimes",
    logout: "Deconnexion",
    edit_profile: "Modifier le profil",
    followers_count: "Abonnes",
    following_count: "Abonnements",
    likes_count: "Aimes",
    transactions: "Transactions",
    viral_score: "Score de tendance",
    
    // Upload
    upload_product: "Publier un produit",
    title: "Titre",
    description: "Description",
    price: "Prix",
    location: "Localisation",
    select_image: "Choisir une image",
    select_video: "Choisir une video",
    uploading: "Telechargement...",
    upload_success: "Produit publie avec succes!",
    available_colors: "Couleurs disponibles",
    available_sizes: "Tailles disponibles",
    enter_colors: "Entrez les couleurs (separees par des virgules)",
    enter_sizes: "Entrez les tailles (separees par des virgules)",
    
    // Notifications
    notifications: "Notifications",
    messages: "Messages",
    no_notifications: "Pas encore de notifications",
    no_messages: "Pas encore de messages",
    new_order_request: "Nouvelle demande de commande",
    order_approved_msg: "Votre commande a ete approuvee!",
    payment_received_msg: "Paiement recu! Veuillez livrer la commande.",
    order_delivered_msg: "Votre commande a ete livree!",
    order_confirmed_msg: "Commande confirmee! 97% libere au vendeur.",
    
    // Status
    processing: "Traitement...",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succes",
    retry: "Reessayer",
    
    // Messages
    follow: "Suivre",
    unfollow: "Ne plus suivre",
    following: "Abonnements",
    view_profile: "Voir le profil",
    confirm_receipt: "Confirmer la reception",
    order_received: "J'ai recu ma commande",
    vendor_info: "Vendeur",
    price_label: "Prix",
    amount: "Montant total",
    delivery_within_7_days: "Livraison sous 7 jours",
    trending_now: "Tendances",
    no_products: "Aucun produit trouve",
    be_first_to_upload: "Soyez le premier a publier!",
    follow_vendors: "Suivez des vendeurs pour voir leurs produits dans Preference",
    
    // Validation
    username_required: "Le nom d'utilisateur est requis",
    email_required: "L'email est requis",
    phone_required: "Le numero de telephone est requis",
    password_required: "Le mot de passe est requis",
    invalid_email: "Format email invalide",
    invalid_phone: "Numero de telephone invalide",
    username_taken: "Nom d'utilisateur deja utilise",
    phone_taken: "Numero de telephone deja enregistre",
    email_taken: "Email deja enregistre",
    
    // Misc
    xaf: "XAF",
    items: "articles",
    view_all: "Voir tout",
    cancel_order: "Annuler la commande",
    approve_order: "Approuver la commande",
    mark_delivered: "Marquer comme livre",
    
    // Guest Modal
    oops: "Oups!",
    login_to_continue: "Connectez-vous pour continuer",
    login_to_like: "Connectez-vous pour aimer ce produit",
    login_to_comment: "Connectez-vous pour commenter",
    login_to_favorite: "Connectez-vous pour ajouter au panier",
    login_to_request: "Connectez-vous pour commander ce produit",
    login_to_follow: "Connectez-vous pour suivre ce vendeur",
    continue_browsing: "Continuer la navigation",
    
    // Admin
    admin_dashboard: "Tableau de bord admin",
    total_users: "Total utilisateurs",
    total_products: "Total produits",
    total_orders: "Total commandes",
    total_revenue: "Revenu total",
    recent_orders: "Commandes recentes",
    all_users: "Tous les utilisateurs",
    all_products: "Tous les produits",
    delete: "Supprimer",
    ban: "Bloquer",
    unban: "Debloquer",
    active: "Actif",
    banned: "Bloque",
    admin_only: "Accès admin uniquement",
    unauthorized: "Accès non autorise",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
