// Função para formatar a data das mensagens
export const formatMessageDate = (date: Date): string => {
  const now = new Date();
  
  // Ajustar para o mesmo fuso horário
  const adjustedDate = new Date(date);
  
  // Calcular a diferença em horas considerando os minutos também
  const diffInMs = now.getTime() - adjustedDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  // Se a diferença for negativa, significa que o horário do servidor está adiantado
  if (diffInHours < 0) {
    return 'Agora';
  }
  
  if (diffInHours < 24) {
    if (diffInHours === 0) {
      // Se for menos de uma hora, mostrar em minutos
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes <= 0) {
        return 'Agora';
      } else if (diffInMinutes === 1) {
        return '1 minuto atrás';
      } else {
        return `${diffInMinutes} minutos atrás`;
      }
    } else if (diffInHours === 1) {
      return '1 hora atrás';
    } else {
      return `${diffInHours} horas atrás`;
    }
  } else {
    return adjustedDate.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}; 