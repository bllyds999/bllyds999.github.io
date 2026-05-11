(function () {
  function getTimePeriod() {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 8) return '早上'
    if (hour >= 8 && hour < 11) return '上午'
    if (hour >= 11 && hour < 13) return '中午'
    if (hour >= 13 && hour < 18) return '下午'
    if (hour >= 18 && hour < 23) return '晚上'
    return '凌晨'
  }

  function getMemorialDay() {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()

    if (month === 1 && day === 8) return '周恩来总理逝世 ' + (now.getFullYear() - 1976) + ' 周年纪念日'
    if (month === 2 && day === 19) return '邓小平同志逝世 ' + (now.getFullYear() - 1997) + ' 周年纪念日'
    if (month === 4 && (day === 4 || day === 5)) return '清明节'
    if (month === 5 && day === 12) return '汶川大地震 ' + (now.getFullYear() - 2008) + ' 周年纪念日'
    if (month === 7 && day === 7) return '七七事变 ' + (now.getFullYear() - 1937) + ' 周年纪念日'
    if (month === 8 && day === 15) return '日本投降 ' + (now.getFullYear() - 1945) + ' 周年纪念日'
    if (month === 9 && day === 9) return '毛泽东主席逝世 ' + (now.getFullYear() - 1976) + ' 周年纪念日'
    if (month === 9 && day === 18) return '九一八事变 ' + (now.getFullYear() - 1931) + ' 周年纪念日'
    if (month === 9 && day === 30) return '烈士纪念日'
    if (month === 12 && day === 13) return '南京大屠杀死难者国家公祭日'
    return null
  }

  function getBirthday() {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const year = now.getFullYear()

    if (month === 9 && day === 9) {
      const marker = localStorage.getItem('birthdayAlert_' + year)
      if (!marker) {
        localStorage.setItem('birthdayAlert_' + year, String(year))
        return '<i class="fa-solid fa-cake-candles"></i> 今天是我生日！'
      }
    }
    return null
  }

  function isHomePage() {
    return window.location.pathname === '/' || window.location.pathname === '/index.html'
  }

  if (isHomePage()) {
    setTimeout(() => {
      const period = getTimePeriod()
      btf.snackbarShow(`<i class="fa-solid fa-lightbulb"></i> 现在是${period}，${period === '凌晨' ? '祝你好梦' : period === '早上' || period === '上午' ? '祝你有个好心情' : period === '中午' ? '午安' : period === '下午' ? '下午好' : '晚上好'}！`)

      setTimeout(() => {
        const memorial = getMemorialDay()
        if (memorial) {
          btf.snackbarShow(`<i class="fa-solid fa-lightbulb"></i> 今天是${memorial}，全站默哀一天！`)
        }

        const birthday = getBirthday()
        if (birthday) {
          btf.snackbarShow(birthday, false, 5000)
        }
      }, 1000)
    }, 1000)
  }
})();