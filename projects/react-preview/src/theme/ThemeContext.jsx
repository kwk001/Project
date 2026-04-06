import { createContext, useContext, useState, useMemo } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  const theme = useMemo(() => ({
    isDark,
    toggleTheme: () => setIsDark(prev => !prev),
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
      colorBgContainer: isDark ? '#141414' : '#ffffff',
      colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
      colorText: isDark ? '#ffffff' : '#000000',
      colorTextSecondary: isDark ? '#a6a6a6' : '#666666',
      colorBorder: isDark ? '#434343' : '#d9d9d9',
    }
  }), [isDark])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
