"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { availableLangsForPage } from "../availableLangs"
import { LanguageSwitcher } from "./LanguageSwitcher"

const languages = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "nl", name: "Nederlands" },
];

const navItems = [
  { label: "Home", path: "" },
  { label: "Play Now", path: "#play" },
  { label: "Tips & Guide", path: "suika-game-tips" },
  { label: "FAQ", path: "#faq" },
  { label: "Contact", path: "contact" },
  { label: "Privacy Policy", path: "privacy-policy" },
  { label: "Terms of Service", path: "terms-of-service" },
];

// 获取当前语言
function getCurrentLang(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0]
  return languages.find(l => l.code !== "en" && l.code === seg) ? seg : "en"
}

// 智能菜单链接生成
function getMenuLink(page: string, currentLang: string) {
  // 首页
  if (!page) return currentLang === "en" ? "/" : `/${currentLang}`;
  // 锚点
  if (page.startsWith("#")) return currentLang === "en" ? `/${page}` : `/${currentLang}${page}`;
  // 其它页面
  const langs = availableLangsForPage[`/${page}`] || ["en"];
  if (langs.includes(currentLang)) {
    return currentLang === "en" ? `/${page}` : `/${currentLang}/${page}`;
  }
  return `/${page}`; // fallback 到英文
}

export default function Navbar() {
  const pathname = usePathname()
  const currentLang = getCurrentLang(pathname)
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full bg-white flex justify-center">
      <div className="w-full max-w-7xl flex" style={{ minHeight: 56 }}>
        {/* Logo栏 */}
        <div className="flex items-center justify-center pl-3 md:pl-0 w-auto md:w-[120px]">
          <Link
            href={currentLang === "en" ? "/" : `/${currentLang}`}
            className="flex items-center text-lg font-extrabold text-green-600 hover:text-green-700 transition-colors whitespace-nowrap"
            aria-label="Suika Game Home"
            style={{ lineHeight: 1, padding: '6px 0' }}
          >
            <span className="mr-2 text-xl">🍉</span> Suika Game
          </Link>
        </div>
        {/* 右侧内容区 */}
        <div className="flex-1 flex flex-col gap-0">
          {/* 语言栏 */}
          <div className="flex justify-end items-center pr-4 py-1">
            <LanguageSwitcher />
          </div>
          {/* 主导航栏 */}
          <div className="flex items-center pl-4 py-1">
            <div className="hidden md:flex items-center space-x-2 flex-1 justify-end">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={getMenuLink(item.path, currentLang)}
                  className="px-4 py-2 rounded-md text-gray-700 font-medium hover:bg-green-100 hover:text-green-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {/* Mobile Burger */}
            <button className="md:hidden p-2 rounded focus:outline-none ml-auto" onClick={() => setOpen(!open)} aria-label="Open Menu">
              <span>☰</span>
            </button>
          </div>
          {/* Mobile Menu */}
          {open && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <ul className="flex flex-col py-2">
                {navItems.map(item => (
                  <li key={item.label}>
                    <Link
                      href={getMenuLink(item.path, currentLang)}
                      className="block px-6 py-3 text-gray-700 font-medium hover:bg-green-100 hover:text-green-700 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}