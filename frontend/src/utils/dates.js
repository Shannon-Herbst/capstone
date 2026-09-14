export const getTodayString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0

    const [startYear, startMonth, startDay] = checkIn.split('-').map(Number)
    const [endYear, endMonth, endDay] = checkOut.split('-').map(Number)

    const start = new Date(startYear, startMonth - 1, startDay)
    const end = new Date(endYear, endMonth - 1, endDay)

    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24))

    return nights > 0 ? nights : 0
}

export const formatDisplayDate = (dateString) => {
    if (!dateString) return ''

    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export const addDays = (dateString, days) => {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day + days)

    const newYear = date.getFullYear()
    const newMonth = String(date.getMonth() + 1).padStart(2, '0')
    const newDay = String(date.getDate()).padStart(2, '0')

    return `${newYear}-${newMonth}-${newDay}`
}
