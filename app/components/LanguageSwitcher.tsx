import Link from "next/link"
import { usePathname } from "next/navigation"
import ReactCountryFlag from "react-country-flag"
import { availableLangsForPage } from "../availableLangs"


const languages = [
  { code: "en", name: "English", flag: "US" },
  { code: "ja", name: "日本語", flag: "JP" },
  { code: "es", name: "Español", flag: "ES" },
  { code: "pt", name: "Português", flag: "PT" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "nl", name: "Nederlands", flag: "NL" },
]

function getCurrentLang(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0]
  return languages.find(l => l.code !== "en" && l.code === seg) ? seg : "en"
}

function getLangPath(lang: string, pathname: string) {
  // 取当前页面的主路径（如 /privacy-policy）
  const segs = pathname.split("/").filter(Boolean)
  let pageKey = "/";
  if (segs.length > 0) {
    // 如果是多语言首页
    if (languages.some(l => l.code === segs[0])) {
      pageKey = segs.length === 1 ? "/" : `/${segs.slice(1).join("/")}`;
    } else {
      pageKey = `/${segs.join("/")}`;
    }
  }
  // 判断目标语言是否有该页面
  const availableLangs = availableLangsForPage[pageKey] || ["en"];
  if (lang === "en") {
    return pageKey;
  }
  if (availableLangs.includes(lang)) {
    return lang === "en" ? pageKey : `/${lang}${pageKey === "/" ? "" : pageKey}`;
  }
  // 目标语言没有该页面，跳到该语言首页
  return `/${lang}`;
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const currentLang = getCurrentLang(pathname)
  return (
    <div className="flex flex-wrap justify-start md:justify-end items-center gap-x-1 gap-y-1 w-full" style={{ rowGap: 2, columnGap: 4 }}>
      {languages.map(lang => (
        <Link
          key={lang.code}
          href={getLangPath(lang.code, pathname)}
          hrefLang={lang.code}
          className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-xs transition-colors border border-transparent select-none
            ${currentLang === lang.code ? "bg-green-100 text-green-700 border-green-200" : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`}
          aria-current={currentLang === lang.code ? "page" : undefined}
          style={{ minWidth: 22, minHeight: 22, fontWeight: 400 }}
        >
          <ReactCountryFlag countryCode={lang.flag} svg style={{ width: "1em", height: "1em", marginRight: 1, borderRadius: 2 }} title={lang.code.toUpperCase()} />
          <span>{lang.code.toUpperCase()}</span>
        </Link>
      ))}
    </div>
  )
}
