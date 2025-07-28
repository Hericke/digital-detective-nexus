/**
 * Input validation and sanitization utilities
 */

// Email validation with enhanced security
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  // Length check
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email muito longo' };
  }

  // Basic format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  return { isValid: true };
};

// Password validation with security requirements
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Senha é obrigatória' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'A senha deve ter pelo menos 8 caracteres' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Senha muito longa' };
  }

  // Check for common weak patterns
  const weakPatterns = [
    /^(.)\1+$/, // All same character
    /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def)/i, // Sequential
    /^(password|123456|qwerty|admin|login)/i // Common passwords
  ];

  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      return { isValid: false, error: 'Senha muito fraca. Use uma combinação mais segura' };
    }
  }

  return { isValid: true };
};

// Phone number validation and sanitization
export const validatePhone = (phone: string): { isValid: boolean; cleaned?: string; error?: string } => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Número de telefone é obrigatório' };
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 8 || cleaned.length > 15) {
    return { isValid: false, error: 'Número de telefone deve ter entre 8 e 15 dígitos' };
  }

  return { isValid: true, cleaned };
};

// CNPJ validation
export const validateCNPJ = (cnpj: string): { isValid: boolean; cleaned?: string; error?: string } => {
  if (!cnpj || typeof cnpj !== 'string') {
    return { isValid: false, error: 'CNPJ é obrigatório' };
  }

  const cleaned = cnpj.replace(/\D/g, '');

  if (cleaned.length !== 14) {
    return { isValid: false, error: 'CNPJ deve ter 14 dígitos' };
  }

  // Basic CNPJ validation algorithm
  if (!/^\d{14}$/.test(cleaned)) {
    return { isValid: false, error: 'CNPJ deve conter apenas números' };
  }

  return { isValid: true, cleaned };
};

// Generic text sanitization
export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .trim()
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

// URL validation
export const validateURL = (url: string): { isValid: boolean; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL é obrigatória' };
  }

  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, error: 'Apenas URLs HTTP e HTTPS são permitidas' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'URL inválida' };
  }
};

// File validation for uploads
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (file.size > maxSize) {
    return { isValid: false, error: 'Arquivo muito grande. Máximo 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Tipo de arquivo não permitido' };
  }

  return { isValid: true };
};