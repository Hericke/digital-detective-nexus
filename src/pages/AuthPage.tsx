import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureAuthService } from '@/services/auth/secureAuthService';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const user = await secureAuthService.getCurrentUser();
      if (user) {
        setUser(user);
        navigate('/');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          navigate('/');
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await secureAuthService.signUp({
        email,
        password,
        confirmPassword
      });

      if (result.success) {
        toast({
          title: 'Cadastro realizado com sucesso!',
          description: 'Verifique seu email para confirmar a conta.',
        });
        
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (error) {
      setError('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await secureAuthService.signIn({
        email,
        password
      });

      if (result.success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo ao CavernaSPY',
        });
        navigate('/');
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  // If user is already authenticated, show loading
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-3">
            <img 
              src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png"
              alt="CavernaSPY"
              className="h-16 w-16 mr-3"
            />
            <h1 className="text-3xl font-bold cyber-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CavernaSPY
            </h1>
          </div>
          <p className="text-muted-foreground">Acesso Seguro</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Auth Tabs */}
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Fazer Login
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                      }}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError();
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && !loading && handleSignIn()}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleSignIn}
                  className="w-full"
                  disabled={loading || !email || !password}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Criar Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                      }}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError();
                      }}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearError();
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && !loading && handleSignUp()}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleSignUp}
                  className="w-full"
                  disabled={loading || !email || !password || !confirmPassword}
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to home link */}
        <div className="text-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Voltar para página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;