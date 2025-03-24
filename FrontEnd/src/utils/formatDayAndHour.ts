export const formatDayAndHour = (date: string | Date): string => {
    const dateObject = typeof date === 'string' ? new Date(date) : date;

    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    return `Criado no dia ${day}/${month}/${year} as ${hours}:${minutes}`;
};

export const formatDay = (date: string | Date): string => {
    const dateObject = typeof date === 'string' ? new Date(date) : date;

    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();

    return `Atividade vai ser recuperada dia ${day}/${month}/${year}`;
}

export const expireDate = (date: string | Date): string => {
    const dateObject = typeof date === 'string' ? new Date(date) : date;

    // Ajusta o fuso horário subtraindo 3 horas
    const adjustedDate = new Date(dateObject.getTime() - 3 * 60 * 60 * 1000);

    const day = adjustedDate.getDate().toString().padStart(2, '0');
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = adjustedDate.getFullYear();

    const hours = adjustedDate.getHours().toString().padStart(2, '0');
    const minutes = adjustedDate.getMinutes().toString().padStart(2, '0');

    return `Expira no dia ${day}/${month}/${year} as ${hours}:${minutes}`;
};