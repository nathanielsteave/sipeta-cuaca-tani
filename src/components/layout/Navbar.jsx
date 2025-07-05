import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);

  // --- PERUBAHAN DI SINI: Link "Prakiraan" dihapus ---
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Panduan', href: '/panduan-petani' },
    { name: 'Tentang', href: '/tentang' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const getLinkClass = (href) => {
    const isActive = activePath === href;
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300";

    if (isActive) {
      return `${baseClass} bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100`;
    }
    return `${baseClass} text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700`;
  };

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-primary-700 dark:text-primary-200">SiPETA Cuaca Tani</span>
          </a>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className={getLinkClass(link.href)}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="p-2 rounded-md text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none">
              <span className="sr-only">Buka menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800`}
        style={{ maxHeight: isOpen ? '300px' : '0' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={`${getLinkClass(link.href)} block text-base`}>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}