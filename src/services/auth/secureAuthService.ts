import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  confirmPassword?: string;
}

class SecureAuthService {
  // Sign up with email verification
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { email, password, confirmPassword } = credentials;

      // Client-side validation
      if (!email || !password) {
        return { success: false, error: 'Email e senha são obrigatórios' };
      }

      if (password.length < 8) {
        return { success: false, error: 'A senha deve ter pelo menos 8 caracteres' };
      }

      if (confirmPassword && password !== confirmPassword) {
        return { success: false, error: 'As senhas não conferem' };
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Formato de email inválido' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return this.handleAuthError(error);
      }

      return { 
        success: true, 
        user: data.user,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Erro interno no servidor' };
    }
  }

  // Sign in with enhanced security
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        return { success: false, error: 'Email e senha são obrigatórios' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        return this.handleAuthError(error);
      }

      return { 
        success: true, 
        user: data.user 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Erro interno no servidor' };
    }
  }

  // Sign out
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: 'Erro ao fazer logout' };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Erro interno no servidor' };
    }
  }

  // Change password with current password verification
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      if (!currentPassword || !newPassword) {
        return { success: false, error: 'Senha atual e nova senha são obrigatórias' };
      }

      if (newPassword.length < 8) {
        return { success: false, error: 'A nova senha deve ter pelo menos 8 caracteres' };
      }

      // First verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        return { success: false, error: 'Senha atual incorreta' };
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return this.handleAuthError(error);
      }

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Erro interno no servidor' };
    }
  }

  // Handle authentication errors with user-friendly messages
  private handleAuthError(error: AuthError): AuthResponse {
    console.error('Auth error:', error);

    switch (error.message) {
      case 'Invalid login credentials':
        return { success: false, error: 'Email ou senha incorretos' };
      case 'Email not confirmed':
        return { success: false, error: 'Por favor, confirme seu email antes de fazer login' };
      case 'User already registered':
        return { success: false, error: 'Este email já está cadastrado' };
      case 'Password should be at least 8 characters':
        return { success: false, error: 'A senha deve ter pelo menos 8 caracteres' };
      case 'Invalid email':
        return { success: false, error: 'Formato de email inválido' };
      case 'Signup is disabled':
        return { success: false, error: 'Cadastro está temporariamente desabilitado' };
      default:
        return { success: false, error: 'Erro de autenticação. Tente novamente.' };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }
}

export const secureAuthService = new SecureAuthService();