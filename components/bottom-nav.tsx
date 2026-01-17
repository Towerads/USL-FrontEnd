"use client"

import { UserOutlined, VideoCameraOutlined, BarChartOutlined, AppstoreOutlined, DashboardOutlined } from '@ant-design/icons';
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BottomNavProps {
  userType?: "default" | "advertiser" | "publisher"
}

export function BottomNav({ userType = "default" }: BottomNavProps) {
  const pathname = usePathname()

  const getNavigationConfig = () => {
    if (userType === "advertiser") {
      return {
        basePath: "/advertiser",
        tabs: [
          { id: "profile", href: "/profile", icon: UserOutlined, label: "Профиль" },
          { id: "creatives", href: "/creatives", icon: VideoCameraOutlined, label: "Креативы" },
          { id: "stats", href: "/stats", icon: BarChartOutlined, label: "Статистика" },
          { id: "channels", href: "/channels-catalog", icon: AppstoreOutlined, label: "Каталог" },
        ],
      }
    }

    if (userType === "publisher") {
      return {
        basePath: "/publisher",
        tabs: [
          { id: "profile", href: "/profile", icon: UserOutlined, label: "Профиль" },
          { id: "dashboard", href: "/publisher", icon: DashboardOutlined, label: "Дашборд" },
          { id: "stats", href: "/stats", icon: BarChartOutlined, label: "Статистика" },
          { id: "channels", href: "/channels-catalog", icon: AppstoreOutlined, label: "Каталог" },
        ],
      }
    }

    return {
      basePath: "",
      tabs: [
        { id: "profile", href: "/profile", icon: UserOutlined, label: "Профиль" },
      ],
    }
  }

  const { tabs } = getNavigationConfig()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderTop: '1px solid #E6E6E6',
      zIndex: 50,
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', gap: '0', maxWidth: '600px', width: '100%', padding: '0 16px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.id}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '10px 8px',
                flex: 1,
                transition: 'all 0.2s ease',
                color: isActive ? '#1677ff' : '#999',
                textDecoration: 'none',
                borderRadius: '12px',
                background: isActive ? 'rgba(22, 119, 255, 0.1)' : 'transparent'
              }}
            >
              <Icon style={{ fontSize: '22px' }} />
              <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
