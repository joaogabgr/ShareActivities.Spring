export const formatDayAndHour = (date: string | Date): string => {
    const dateObject = typeof date === 'string' ? new Date(date) : date;

    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    return `Criado no dia ${day}/${month}/${year} as ${hours}:${minutes}`;
};