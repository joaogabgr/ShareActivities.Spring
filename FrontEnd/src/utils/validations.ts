export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 6) {
        return { isValid: false, message: "A senha deve ter no mínimo 6 caracteres" };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: "A senha deve conter pelo menos uma letra maiúscula" };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: "A senha deve conter pelo menos uma letra minúscula" };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: "A senha deve conter pelo menos um número" };
    }
    return { isValid: true, message: "" };
};

export const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    if (cleanCPF.length !== 11) return false;

    // Verifica CPFs com números iguais
    if (/^(\d)\1+$/.test(cleanCPF)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cleanCPF.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cleanCPF.charAt(10))) return false;

    return true;
};

export const formatCPF = (cpf: string): string => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const validateName = (name: string): { isValid: boolean; message: string } => {
    if (name.length < 3) {
        return { isValid: false, message: "O nome deve ter pelo menos 3 caracteres" };
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
        return { isValid: false, message: "O nome deve conter apenas letras" };
    }
    return { isValid: true, message: "" };
}; 