export const borderRadius = 12;
export const padding = 12;
export const margin = 12;

export const colors = {
    primary: '#4285F4',        // Azul principal
    primaryDark: '#3367D6',    // Azul escuro
    secondary: '#34A853',      // Verde secundário
    accent: '#FBBC05',         // Amarelo
    error: '#EA4335',          // Vermelho para erros
    background: '#F5F7FA',     // Fundo claro
    surface: '#FFFFFF',        // Superfícies
    textPrimary: '#202124',    // Texto principal
    textSecondary: '#5F6368',  // Texto secundário
    textLight: '#FFFFFF',      // Texto em fundos escuros
    divider: '#DADCE0',        // Linha divisória
    disabled: '#9AA0A6',       // Elementos desativados
    statusPending: '#FBBC05',  // Status pendente (amarelo)
    statusInProgress: '#4285F4', // Status em progresso (azul)
    statusDone: '#34A853',     // Status concluído (verde)
    priorityHigh: '#EA4335',   // Prioridade alta (vermelho)
    priorityMedium: '#FBBC05', // Prioridade média (amarelo)
    priorityLow: '#34A853',    // Prioridade baixa (verde)
};

export const spacing = {
    xs: 4,
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
    xxl: 48,
};

export const fonts = {
    size: {
        xs: 12,
        small: 14,
        medium: 16,
        large: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },
    weight: {
        regular: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
    }
};

export const shadows = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    large: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
};