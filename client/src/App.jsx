import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from './api.js'
import { getProductImage, getProductBadges, getProductCategory } from './productMeta.js'

// ═══════════════════════════════════════════════════════════════════════════
// FALLBACK STATIC CUSTOMERS (Initial fallback before API loads)
// ═══════════════════════════════════════════════════════════════════════════
const INITIAL_CUSTOMERS = [
  { customer_id: 1, name: 'Alice Smith', email: 'alice@test.com', phone: '123-456-7890' },
  { customer_id: 2, name: 'Bob Jones', email: 'bob@test.com', phone: '098-765-4321' },
]

const POPULAR_TAGS = [
  'Oversized T-Shirts',
  'Polos',
  'Anime Merch',
  'Marvel Merch',
  'Classic T-Shirts',
  'Gaming Gear',
]

// ═══════════════════════════════════════════════════════════════════════════
// BRAND LOGO: ONE FOR ALL STORE
// ═══════════════════════════════════════════════════════════════════════════
function OneForAllLogo() {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      {/* Pop-Culture Mascot Icon */}
      <div className="w-10 h-10 bg-[#E11B22] rounded-2xl flex items-center justify-center shadow-md transform hover:scale-105 transition-transform flex-shrink-0">
        <svg className="w-6 h-6 text-white" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 8C27.9 8 10 25.9 10 48v44c0 3 3.6 4.8 6 3l10-8 10 8c2.4 1.9 5.8 1.9 8.2 0l5.8-4.7 5.8 4.7c2.4 1.9 5.8 1.9 8.2 0l10-8 10 8c2.4 1.8 6 0 6-3V48C90 25.9 72.1 8 50 8z"
            fill="currentColor"
          />
          <ellipse cx="36" cy="42" rx="6" ry="8" fill="#1C1C1C" />
          <ellipse cx="64" cy="42" rx="6" ry="8" fill="#1C1C1C" />
          <circle cx="38" cy="43" r="2.5" fill="#FFFFFF" />
          <circle cx="66" cy="43" r="2.5" fill="#FFFFFF" />
          <path d="M42 58c4.5 4 11.5 4 16 0" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="leading-tight">
        <span className="text-[#1C1C1C] font-black tracking-tight text-xl font-sans block">
          ONE FOR ALL <span className="text-[#E11B22] font-black">STORE</span>
        </span>
        <span className="text-[10px] text-gray-500 font-extrabold tracking-widest uppercase block mt-0.5">
          Official Pop-Culture Merch
        </span>
      </div>
    </div>
  )
}

function EmptyCartIllustration() {
  return (
    <svg className="w-32 h-32 mx-auto mb-4" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="142" rx="55" ry="8" fill="#E5E7EB" />
      <path
        d="M80 30c-15.5 0-28 12.5-28 28v28c0 2 2.5 3.3 4.2 2.1l7-5.5 7 5.5c1.7 1.3 4 1.3 5.7 0l4.1-3.3 4.1 3.3c1.7 1.3 4 1.3 5.7 0l7-5.5 7 5.5c1.7 1.2 4.2-.1 4.2-2.1V58c0-15.5-12.5-28-28-28z"
        fill="#FFFFFF"
        stroke="#1F2937"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse cx="70" cy="54" rx="4" ry="5.5" fill="#1F2937" />
      <ellipse cx="90" cy="54" rx="4" ry="5.5" fill="#1F2937" />
      <path d="M68 62c0 2.5-1.8 4.5-3.5 4.5S61 64.5 61 62c0-2 3.5-6 3.5-6s3.5 4 3.5 6z" fill="#38BDF8" />
      <path d="M74 72c3-2.5 9-2.5 12 0" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M45 92h68l-8 28H57L45 92z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M40 85h8l7 35h52" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 85l-5-10h-8" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="77" y="99" width="4" height="11" rx="2" fill="#0284C7" />
      <circle cx="79" cy="115" r="2.5" fill="#0284C7" />
      <circle cx="62" cy="128" r="6" fill="#374151" stroke="#0284C7" strokeWidth="2" />
      <circle cx="95" cy="128" r="6" fill="#374151" stroke="#0284C7" strokeWidth="2" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'error' ? 'bg-[#E11B22]' : type === 'success' ? 'bg-emerald-600' : 'bg-gray-900'
  return (
    <div className={`fixed top-20 right-6 z-[100] ${bg} text-white px-5 py-3.5 rounded-xl shadow-2xl font-semibold text-sm max-w-sm flex items-center gap-3 toast-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto opacity-75 hover:opacity-100 text-lg leading-none cursor-pointer">✕</button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOP TICKER BAR
// ═══════════════════════════════════════════════════════════════════════════
function TickerBar() {
  const text = 'OFFICIAL POP-CULTURE MERCH • FREE SHIPPING ON ORDERS ABOVE ₹499 • EASY 30 DAYS RETURNS • CASH ON DELIVERY AVAILABLE • '
  return (
    <div className="bg-[#E11B22] text-white overflow-hidden whitespace-nowrap h-9 flex items-center text-xs font-black tracking-wider uppercase">
      <div className="ticker-animate">
        {Array(8).fill(text).join('')}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR (Spacious, Clean, Authentic E-Commerce with Account Button)
// ═══════════════════════════════════════════════════════════════════════════
function Navbar({
  customer,
  onOpenAccount,
  cartCount,
  onCartToggle,
  onOrdersToggle,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) {
  const customerId = customer.customer_id || customer.id || 1
  const firstName = customer.name ? customer.name.split(' ')[0] : 'User'

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="store-container flex items-center justify-between h-20 gap-6">
        {/* Left: Category Navigation Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 h-full">
          {['MEN', 'WOMEN', 'SNEAKERS'].map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`h-full flex items-center text-sm font-black tracking-wider transition-all relative px-1 cursor-pointer
                ${activeTab === tab ? 'text-[#1C1C1C]' : 'text-gray-500 hover:text-[#1C1C1C]'}`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E11B22] rounded-t-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Center: Brand Logo */}
        <div className="flex-shrink-0">
          <OneForAllLogo />
        </div>

        {/* Right: Search, User Profile, Orders, Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Pill Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2.5 w-64 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all shadow-2xs">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent text-xs w-full outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
            <svg className="w-4 h-4 text-gray-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* User Account Button (Replaces ugly dropdown with clean profile modal) */}
          <button
            id="user-account-btn"
            onClick={onOpenAccount}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-full px-3.5 py-1.5 shadow-2xs transition-colors cursor-pointer"
            title="User Account & Switch Profile"
          >
            <div className="w-5 h-5 rounded-full bg-[#E11B22] text-white flex items-center justify-center text-[10px] font-black">
              {customer.name ? customer.name[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-black text-gray-800">
              Hi, {firstName}
            </span>
            <span className="text-[10px] text-gray-400 font-bold hidden sm:inline">
              #{customerId}
            </span>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Orders Button */}
          <button
            id="orders-button"
            onClick={onOrdersToggle}
            className="flex items-center gap-1.5 text-xs font-black text-gray-700 hover:text-[#E11B22] px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            title="View Order History"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden sm:inline">Orders</span>
          </button>

          {/* Wishlist Heart Icon */}
          <button className="hidden sm:block p-2 text-gray-600 hover:text-[#E11B22] hover:scale-110 transition-all cursor-pointer" title="Wishlist">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Shopping Bag / Cart */}
          <button
            id="cart-button"
            onClick={onCartToggle}
            className="relative p-2 text-gray-800 hover:text-[#E11B22] transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#E11B22] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ACCOUNT & USER MANAGEMENT MODAL (Active profile, Switch user, Create user)
// ═══════════════════════════════════════════════════════════════════════════
function AccountModal({
  isOpen,
  onClose,
  currentCustomer,
  customers,
  onSelectCustomer,
  onCreateCustomer,
  onOpenOrders,
}) {
  const [tab, setTab] = useState('active') // 'active', 'switch', 'create'
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  if (!isOpen) return null

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) {
      setFormError('Please enter a customer name.')
      return
    }
    setFormError('')
    setIsSubmitting(true)
    try {
      await onCreateCustomer({
        name: newName.trim(),
        email: newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, '')}@test.com`,
        phone: newPhone.trim() || '555-010-0000',
      })
      setNewName('')
      setNewEmail('')
      setNewPhone('')
      onClose()
    } catch (err) {
      setFormError(err.message || 'Failed to create user.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentId = currentCustomer.customer_id || currentCustomer.id

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 drawer-backdrop" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-md flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Customer Account</h2>
            <p className="text-xs text-gray-500 font-medium">Switch profiles or create a new user</p>
          </div>
          <button id="close-account-modal" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-150 px-6 pt-2 bg-white">
          <button
            onClick={() => setTab('active')}
            className={`py-3 px-3 text-xs font-black tracking-wider transition-all relative cursor-pointer
              ${tab === 'active' ? 'text-[#E11B22]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            ACTIVE PROFILE
            {tab === 'active' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11B22]" />}
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`py-3 px-3 text-xs font-black tracking-wider transition-all relative cursor-pointer
              ${tab === 'switch' ? 'text-[#E11B22]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            SWITCH ({customers.length})
            {tab === 'switch' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11B22]" />}
          </button>
          <button
            onClick={() => setTab('create')}
            className={`py-3 px-3 text-xs font-black tracking-wider transition-all relative cursor-pointer
              ${tab === 'create' ? 'text-[#E11B22]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            + NEW USER
            {tab === 'create' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11B22]" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {tab === 'active' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-14 h-14 rounded-2xl bg-[#E11B22] text-white flex items-center justify-center font-black text-xl shadow-md">
                  {currentCustomer.name ? currentCustomer.name[0].toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-gray-900 truncate">{currentCustomer.name}</h3>
                    <span className="bg-red-50 text-[#E11B22] text-[10px] font-black px-2 py-0.5 rounded-full">
                      ID #{currentId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{currentCustomer.email}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{currentCustomer.phone || 'Phone not set'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => { onClose(); onOpenOrders(); }}
                  className="py-3 px-4 bg-gray-900 hover:bg-black text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  View Orders
                </button>
                <button
                  onClick={() => setTab('switch')}
                  className="py-3 px-4 border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  Switch User
                </button>
              </div>
            </div>
          )}

          {tab === 'switch' && (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {customers.map((c) => {
                const cId = c.customer_id || c.id
                const isSelected = cId === currentId
                return (
                  <div
                    key={cId}
                    onClick={() => { onSelectCustomer(c); onClose(); }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer
                      ${isSelected
                        ? 'bg-red-50/70 border-[#E11B22] shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs
                        ${isSelected ? 'bg-[#E11B22] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {c.name ? c.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-900">{c.name}</p>
                        <p className="text-[11px] text-gray-400">ID #{cId} • {c.email}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="text-[#E11B22] font-black text-xs">✓ Active</span>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 hover:text-[#E11B22]">Switch</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-3.5">
              {formError && (
                <div className="p-3 bg-red-50 text-[#E11B22] text-xs font-semibold rounded-xl border border-red-100">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  placeholder="e.g. Peter Parker"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-[#E11B22] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  maxLength={20}
                  placeholder="e.g. spidey@nyc.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-[#E11B22] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  maxLength={13}
                  placeholder="e.g. 555-019-9999"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-[#E11B22] focus:bg-white transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#E11B22] hover:bg-[#b81218] text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT & LOGIN'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT CARD (Spacious, Well-Framed Buttons, Never Touching Boundaries)
// ═══════════════════════════════════════════════════════════════════════════
function ProductCard({ product, index, onAddToCart, isAdding }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const image = getProductImage(product, index)
  const badges = getProductBadges(product)
  const categoryLabel = getProductCategory(product)
  const lowStock = product.stock > 0 && product.stock <= 5
  const outOfStock = product.stock <= 0

  return (
    <div className="store-card group">
      {/* Product Image Area */}
      <div className="store-card-img-wrap">
        <img
          src={image}
          alt={product.product_name}
          className="store-card-img"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {badges.map((badge, i) => (
            <span
              key={i}
              className="bg-[#1C1C1C]/90 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#E11B22] transition-colors z-10 cursor-pointer"
          title="Add to Wishlist"
        >
          <svg
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#E11B22] text-[#E11B22]' : 'fill-none'}`}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Sold Out Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="bg-[#E11B22] text-white font-black text-xs px-4 py-2 rounded-lg tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Product Details Area (Generous Padding & Safe Bottom Margin) */}
      <div className="store-card-body">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            {categoryLabel}
          </p>
          <h3 className="font-bold text-base text-gray-900 line-clamp-1 mb-2.5" title={product.product_name}>
            {product.product_name}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{(Number(product.price) * 1.35).toFixed(0)}
              </span>
            </div>

            {/* Stock indicator badge */}
            <div className="text-xs font-semibold">
              {lowStock ? (
                <span className="text-amber-600 flex items-center gap-1.5 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Only {product.stock} left!
                </span>
              ) : outOfStock ? (
                <span className="text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full">Sold Out</span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  In Stock ({product.stock})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart CTA with Generous Margins so it is never flush with the card bottom */}
        <div>
          <button
            id={`add-to-cart-${product.product_id}`}
            onClick={() => onAddToCart(product)}
            disabled={outOfStock || isAdding}
            className="store-card-btn"
          >
            {isAdding ? 'ADDING TO BAG...' : outOfStock ? 'SOLD OUT' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════════════════════════════
function CartDrawer({
  isOpen,
  cart,
  products,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
  isCheckingOut,
}) {
  const productMap = useMemo(() => {
    const map = {}
    for (const p of products) {
      map[p.product_id] = p
      map[String(p.product_id)] = p
    }
    return map
  }, [products])

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const p = productMap[item.product_id]
      return sum + (p ? Number(p.price) * item.quantity : 0)
    }, 0)
  }, [cart, productMap])

  return (
    <>
      {/* Dark Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 drawer-backdrop transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Step Indicator Header */}
        <div className="bg-white border-b border-gray-150 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              MY SHOPPING BAG ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
            <button
              id="close-cart"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between text-xs font-black tracking-wider text-gray-400 pt-1">
            <span className="text-[#E11B22] flex items-center gap-1.5">
              <span>●</span> MY BAG
            </span>
            <span className="text-gray-300">────────</span>
            <span className="text-gray-400">ADDRESS</span>
            <span className="text-gray-300">────────</span>
            <span className="text-gray-400">PAYMENT</span>
          </div>
        </div>

        {/* Cart Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <EmptyCartIllustration />
              <h3 className="font-black text-gray-900 text-xl mb-1.5">
                Your shopping cart is empty.
              </h3>
              <p className="text-gray-500 text-xs mb-6 max-w-xs leading-relaxed">
                Please add something soon, carts have feelings too.
              </p>

              {/* Popular Categories Box */}
              <div className="bg-gray-50 rounded-2xl p-5 w-full mb-6 border border-gray-200">
                <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {POPULAR_TAGS.map(tag => (
                    <span
                      key={tag}
                      className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs hover:border-[#E11B22] hover:text-[#E11B22] cursor-pointer transition-colors"
                      onClick={onClose}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full py-3.5 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-xl text-xs font-black tracking-widest uppercase transition-colors cursor-pointer"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-150">
                <span className="font-semibold">Items in your cart</span>
                <span className="text-xs font-bold text-gray-700">
                  {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {cart.map((item) => {
                const product = productMap[item.product_id]
                if (!product) return null

                return (
                  <div
                    key={item.product_id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {/* Thumbnail */}
                    <img
                      src={getProductImage(product)}
                      alt={product.product_name}
                      className="w-20 h-24 object-cover rounded-xl flex-shrink-0 bg-white border border-gray-100"
                    />

                    {/* Meta & Controls */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 truncate" title={product.product_name}>
                          {product.product_name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-base font-black text-[#E11B22]">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            (Stock: {product.stock})
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-xs font-black text-gray-900 bg-gray-50 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => onRemove(item.product_id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-white shadow-lg space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-[#E11B22] text-xl font-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              id="checkout-button"
              onClick={onCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-[#E11B22] hover:bg-[#b81218] text-white font-black text-sm tracking-widest uppercase rounded-xl shadow-lg hover:shadow-xl transition-all btn-press disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>PROCESSING ORDER...</span>
                </>
              ) : (
                <span>PROCEED TO CHECKOUT</span>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS MODAL
// ═══════════════════════════════════════════════════════════════════════════
function OrdersModal({ isOpen, orders, loading, error, onClose, customerName }) {
  if (!isOpen) return null

  const statusBadge = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Processing: 'bg-blue-100 text-blue-800 border-blue-200',
    Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 drawer-backdrop" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Order History</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Customer Profile: <strong className="text-gray-900">{customerName}</strong></p>
          </div>
          <button id="close-orders" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E11B22] rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-gray-500">Loading Order History...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 font-bold text-sm mb-1">{error}</p>
              <p className="text-xs text-gray-400">Failed to load order history.</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-800 font-bold text-base mb-1">No orders placed yet</p>
              <p className="text-xs text-gray-500">Orders placed via checkout will show up here.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order.order_id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs hover:border-gray-300 transition-colors">
                  {/* Order header row */}
                  <div className="bg-gray-50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-gray-150 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-gray-900">Order #{order.order_id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${statusBadge[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-gray-500 font-medium">
                      {new Date(order.order_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Order line items */}
                  <div className="p-5 space-y-2.5">
                    {order.items.map((item) => (
                      <div key={item.order_item_id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <span className="font-semibold text-gray-800">{item.product_name}</span>
                          <span className="text-gray-400">×{item.quantity}</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          ₹{(Number(item.unit_price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order footer total */}
                  <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-150 flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-wider">Total Paid</span>
                    <span className="font-black text-base text-[#E11B22]">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [customer, setCustomer] = useState(INITIAL_CUSTOMERS[0])
  const [accountModalOpen, setAccountModalOpen] = useState(false)

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState(null)
  const [addingProduct, setAddingProduct] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [toast, setToast] = useState(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [activeTab, setActiveTab] = useState('MEN')

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, key: Date.now() })
  }, [])

  // ─── 1. Load Customers from MySQL ───────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    try {
      const data = await api.getCustomers()
      if (Array.isArray(data) && data.length > 0) {
        setCustomers(data)
        // Keep active customer in sync
        setCustomer(prev => {
          const match = data.find(c => (c.customer_id || c.id) === (prev.customer_id || prev.id))
          return match || data[0]
        })
      }
    } catch {
      // Fallback already in state
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // ─── 2. Create New Customer ─────────────────────────────────────────
  const handleCreateCustomer = async (customerData) => {
    try {
      const newCust = await api.createCustomer(customerData)
      setCustomers(prev => [...prev, newCust])
      setCustomer(newCust)
      setCart([])
      setOrders([])
      showToast(newCust.message || `Account for "${newCust.name}" created!`, 'success')
      return newCust
    } catch (err) {
      showToast(err.message, 'error')
      throw err
    }
  }

  // ─── 3. Switch Customer ──────────────────────────────────────────────
  const handleCustomerChange = (c) => {
    setCustomer(c)
    setOrders([])
    setOrdersOpen(false)
    setCartOpen(false)
    showToast(`Switched active user to ${c.name}`, 'info')
  }

  // ─── 4. Load Catalog (105 items) ────────────────────────────────────
  const fetchCatalog = useCallback(() => {
    setCatalogLoading(true)
    setCatalogError(null)
    api.getCatalog()
      .then((data) => setProducts(data))
      .catch((err) => setCatalogError(err.message))
      .finally(() => setCatalogLoading(false))
  }, [])

  useEffect(() => {
    fetchCatalog()
  }, [fetchCatalog])

  // ─── 5. Load Cart ───────────────────────────────────────────────────
  const activeCustomerId = customer.customer_id || customer.id || 1
  const fetchCart = useCallback((customerId) => {
    api.getCart(customerId)
      .then((data) => setCart(data.items || []))
      .catch(() => setCart([]))
  }, [])

  useEffect(() => {
    fetchCart(activeCustomerId)
  }, [activeCustomerId, fetchCart])

  // ─── 6. Add to Cart ─────────────────────────────────────────────────
  const handleAddToCart = async (product) => {
    setAddingProduct(product.product_id)
    try {
      const existing = cart.find(i => Number(i.product_id) === Number(product.product_id))
      const newQty = existing ? existing.quantity + 1 : 1

      if (newQty > product.stock) {
        showToast(`Only ${product.stock} items available for "${product.product_name}".`, 'error')
        return
      }

      const updated = existing
        ? cart.map(i => Number(i.product_id) === Number(product.product_id) ? { ...i, quantity: newQty } : i)
        : [...cart, { product_id: product.product_id, quantity: 1 }]

      const result = await api.updateCart(activeCustomerId, updated)
      setCart(result.items || [])
      showToast(`Added "${product.product_name}" to your bag!`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setAddingProduct(null)
    }
  }

  // ─── 7. Update Cart Item Quantity ────────────────────────────────────
  const handleUpdateQty = async (productId, newQty) => {
    if (newQty <= 0) {
      return handleRemove(productId)
    }
    try {
      const updated = cart.map(i => Number(i.product_id) === Number(productId) ? { ...i, quantity: newQty } : i)
      const result = await api.updateCart(activeCustomerId, updated)
      setCart(result.items || [])
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // ─── 8. Remove Item from Cart ────────────────────────────────────────
  const handleRemove = async (productId) => {
    try {
      const updated = cart.filter(i => Number(i.product_id) !== Number(productId))
      const result = await api.updateCart(activeCustomerId, updated)
      setCart(result.items || [])
      showToast('Item removed from cart.', 'info')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // ─── 9. Checkout ─────────────────────────────────────────────────────
  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      const result = await api.checkout(activeCustomerId)
      setCart([])
      setCartOpen(false)
      showToast(
        result.message || `Order #${result.orderId} placed successfully! Total: ₹${result.totalAmount}`,
        'success'
      )
      fetchCatalog()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setCheckingOut(false)
    }
  }

  // ─── 10. Load Order History ──────────────────────────────────────────
  const handleOrdersToggle = async () => {
    if (ordersOpen) {
      setOrdersOpen(false)
      return
    }
    setOrdersOpen(true)
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const result = await api.getOrders(activeCustomerId)
      setOrders(result.orders || [])
    } catch (err) {
      setOrdersError(err.message)
    } finally {
      setOrdersLoading(false)
    }
  }

  // Dynamic Category Counts
  const categoryCounts = useMemo(() => {
    const counts = { ALL: products.length, OVERSIZED: 0, POLOS: 0, CLASSIC: 0, TECH: 0 }
    for (const p of products) {
      const cat = getProductCategory(p).toLowerCase()
      const name = p.product_name.toLowerCase()
      if (cat.includes('oversized') || name.includes('oversized')) counts.OVERSIZED++
      else if (cat.includes('polo') || cat.includes('shirt') || name.includes('polo')) counts.POLOS++
      else if (cat.includes('classic') || cat.includes('vest') || cat.includes('jersey') || name.includes('classic')) counts.CLASSIC++
      else if (cat.includes('tech') || cat.includes('accessories') || cat.includes('audio') || name.includes('mouse') || name.includes('keyboard') || name.includes('cable') || name.includes('stand') || name.includes('headphone')) counts.TECH++
      else counts.OVERSIZED++
    }
    return counts
  }, [products])

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (inStockOnly && p.stock <= 0) return false
        if (selectedCategory !== 'ALL') {
          const cat = getProductCategory(p).toLowerCase()
          const name = p.product_name.toLowerCase()
          if (selectedCategory === 'OVERSIZED' && !cat.includes('oversized') && !name.includes('oversized')) return false
          if (selectedCategory === 'POLOS' && !cat.includes('polo') && !cat.includes('shirt') && !name.includes('polo')) return false
          if (selectedCategory === 'CLASSIC' && !cat.includes('classic') && !cat.includes('vest') && !cat.includes('jersey') && !name.includes('classic')) return false
          if (selectedCategory === 'TECH' && !cat.includes('tech') && !cat.includes('accessories') && !cat.includes('audio') && !name.includes('mouse') && !name.includes('keyboard') && !name.includes('cable') && !name.includes('stand') && !name.includes('headphone')) return false
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const nameMatch = p.product_name.toLowerCase().includes(query)
          const catMatch = getProductCategory(p).toLowerCase().includes(query)
          if (!nameMatch && !catMatch) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price)
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price)
        if (sortBy === 'stock-high') return b.stock - a.stock
        return 0
      })
  }, [products, inStockOnly, selectedCategory, searchQuery, sortBy])

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1C1C1C] flex flex-col font-sans">
      {/* Top Banner Ticker */}
      <TickerBar />

      {/* Main Navbar */}
      <Navbar
        customer={customer}
        onOpenAccount={() => setAccountModalOpen(true)}
        cartCount={cartCount}
        onCartToggle={() => setCartOpen(!cartOpen)}
        onOrdersToggle={handleOrdersToggle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Page Layout Centered with Generous Store Container */}
      <main className="store-container py-8 flex-1">
        {/* Breadcrumb & Title Area */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 font-semibold mb-2">
            Home  /  Men  /  <span className="text-gray-800 font-bold">Official Pop-Culture Merch & Apparel</span>
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                All Official Merchandise
                {!catalogLoading && !catalogError && (
                  <span className="text-gray-400 font-normal text-base ml-3">
                    — {filteredProducts.length} items
                  </span>
                )}
              </h1>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-black uppercase tracking-wider hidden sm:inline">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 text-xs font-bold text-gray-800 rounded-xl px-4 py-2 outline-none focus:border-[#E11B22] shadow-2xs cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock-high">Stock Availability</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Left Filter Sidebar + Product Grid (Spacious 40px Gap) */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 items-start">
          {/* Left Sidebar Filter (Clean, Authentic Souled Store Design) */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            {/* Category Filter */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-150 pb-2.5">
                Categories
              </h4>
              <div className="space-y-1.5 text-xs font-medium">
                {[
                  { id: 'ALL', label: 'All Merchandise', count: categoryCounts.ALL },
                  { id: 'OVERSIZED', label: 'Oversized T-Shirts', count: categoryCounts.OVERSIZED },
                  { id: 'POLOS', label: 'Polos & Shirts', count: categoryCounts.POLOS },
                  { id: 'CLASSIC', label: 'Classic & Vests', count: categoryCounts.CLASSIC },
                  { id: 'TECH', label: 'Tech & Accessories', count: categoryCounts.TECH },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between text-left py-2 px-2.5 rounded-xl transition-colors cursor-pointer
                      ${selectedCategory === cat.id ? 'bg-red-50 text-[#E11B22] font-black' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[11px] text-gray-400 font-normal">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-150 pb-2.5">
                Availability
              </h4>
              <label className="flex items-center gap-3 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-gray-300 text-[#E11B22] focus:ring-[#E11B22] w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Store Perks Box (Authentic Retail) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-red-50 text-[#E11B22] flex items-center justify-center font-bold text-sm">✓</span>
                <div>
                  <p className="font-bold text-gray-900">100% Official Merch</p>
                  <p className="text-[10px] text-gray-400">Authentic Licensed Products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-red-50 text-[#E11B22] flex items-center justify-center font-bold text-sm">⚡</span>
                <div>
                  <p className="font-bold text-gray-900">Fast Express Delivery</p>
                  <p className="text-[10px] text-gray-400">Dispatch in 24 Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-red-50 text-[#E11B22] flex items-center justify-center font-bold text-sm">↩</span>
                <div>
                  <p className="font-bold text-gray-900">Easy 30 Days Return</p>
                  <p className="text-[10px] text-gray-400">Doorstep Pickup</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {catalogLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E11B22] rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-600">Loading catalog...</p>
              </div>
            )}

            {/* Error State */}
            {catalogError && (
              <div className="bg-white border border-red-100 rounded-3xl p-10 text-center max-w-md mx-auto my-12 shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#E11B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Unable to load catalog</h3>
                <p className="text-xs text-gray-500 mb-4">{catalogError}</p>
                <button
                  onClick={fetchCatalog}
                  className="px-6 py-2.5 bg-[#E11B22] text-white text-xs font-bold rounded-xl hover:bg-[#b81218] transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Product Grid (Spacious 3 Columns with 28px Gaps) */}
            {!catalogLoading && !catalogError && (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-gray-200">
                    <p className="text-gray-600 font-bold text-base mb-2">No merchandise found.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setInStockOnly(false); setSelectedCategory('ALL'); }}
                      className="text-xs font-black text-[#E11B22] hover:underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {filteredProducts.map((product, idx) => (
                      <ProductCard
                        key={product.product_id}
                        product={product}
                        index={idx}
                        onAddToCart={handleAddToCart}
                        isAdding={addingProduct === product.product_id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Signature Store Footer (Authentic E-Commerce Design) */}
      <footer className="mt-20 bg-[#1C1C1C] text-white">
        {/* Red Homegrown Brand Banner */}
        <div className="bg-[#E11B22] py-4 text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-widest uppercase text-white">
            HOMEGROWN INDIAN BRAND
          </h2>
        </div>

        {/* Happy Customers Banner */}
        <div className="bg-white text-gray-900 py-8 text-center border-b border-gray-200">
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Over <span className="font-black text-[#1C1C1C]">6 Million</span> Happy Customers
          </p>
        </div>

        {/* 4 Feature Badges Bar */}
        <div className="border-b border-gray-800 py-8 bg-[#181818]">
          <div className="store-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-black text-sm text-white">100% GENUINE</p>
              <p className="text-xs text-gray-400">Direct From Licensed Creators</p>
            </div>
            <div className="space-y-1">
              <p className="font-black text-sm text-white">EASY 30 DAYS RETURN</p>
              <p className="text-xs text-gray-400">Hassle-Free Doorstep Pickup</p>
            </div>
            <div className="space-y-1">
              <p className="font-black text-sm text-white">FREE SHIPPING</p>
              <p className="text-xs text-gray-400">On All Prepaid Orders</p>
            </div>
            <div className="space-y-1">
              <p className="font-black text-sm text-white">100% SECURE PAYMENTS</p>
              <p className="text-xs text-gray-400">SSL Encrypted Checkout</p>
            </div>
          </div>
        </div>

        {/* Multi-Column E-Commerce Footer Navigation */}
        <div className="store-container py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-xs">
            {/* Column 1 */}
            <div className="space-y-3">
              <h4 className="font-black tracking-widest uppercase text-white text-sm">Need Help</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Track Order</li>
                <li className="hover:text-white cursor-pointer transition-colors">Returns & Refunds</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQs & Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">My Account</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h4 className="font-black tracking-widest uppercase text-white text-sm">Company</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Community Initiatives</li>
                <li className="hover:text-white cursor-pointer transition-colors">Gift Vouchers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h4 className="font-black tracking-widest uppercase text-white text-sm">More Info</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Security Safeguards</li>
                <li className="hover:text-white cursor-pointer transition-colors">Sitemap</li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <h4 className="font-black tracking-widest uppercase text-white text-sm">Stores Near Me</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Mumbai • Bandra & Colaba</li>
                <li className="hover:text-white cursor-pointer transition-colors">Bengaluru • Indiranagar</li>
                <li className="hover:text-white cursor-pointer transition-colors">Delhi NCR • CyberHub</li>
                <li className="hover:text-white cursor-pointer transition-colors">Pune • Phoenix Marketcity</li>
                <li className="hover:text-white cursor-pointer transition-colors">Hyderabad • Jubilee Hills</li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 ONE FOR ALL Store. All Rights Reserved.</p>
            <div className="flex items-center gap-6 text-gray-400">
              <span className="hover:text-white cursor-pointer">Instagram</span>
              <span className="hover:text-white cursor-pointer">Facebook</span>
              <span className="hover:text-white cursor-pointer">Twitter / X</span>
              <span className="hover:text-white cursor-pointer">YouTube</span>
            </div>
          </div>
        </div>
      </footer>

      {/* User Account & Switch Profile Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        currentCustomer={customer}
        customers={customers}
        onSelectCustomer={handleCustomerChange}
        onCreateCustomer={handleCreateCustomer}
        onOpenOrders={handleOrdersToggle}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        cart={cart}
        products={products}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
        isCheckingOut={checkingOut}
      />

      {/* Orders Modal */}
      <OrdersModal
        isOpen={ordersOpen}
        orders={orders}
        loading={ordersLoading}
        error={ordersError}
        onClose={() => setOrdersOpen(false)}
        customerName={customer.name}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
