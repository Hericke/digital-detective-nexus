
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const TelaLogin = () => {
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [senhaAdm, setSenhaAdm] = useState('');
  const [novaSenhaUsuario, setNovaSenhaUsuario] = useState('');
  const [novaSenhaAdm, setNovaSenhaAdm] = useState('');
  const [showAdmSection, setShowAdmSection] = useState(false);
  const [isAdmLoggedIn, setIsAdmLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdmPassword, setShowAdmPassword] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [showNewAdmPassword, setShowNewAdmPassword] = useState(false);

  // Senhas padrão (em produção, seria melhor usar Supabase)
  const [senhaUsuarioPadrao, setSenhaUsuarioPadrao] = useState('cavernaSPY2025');
  const [senhaAdmPadrao, setSenhaAdmPadrao] = useState('cavernatec');

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginUsuario = () => {
    if (senhaUsuario === senhaUsuarioPadrao) {
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao CavernaSPY',
      });
      navigate('/');
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleLoginAdm = () => {
    if (senhaAdm === senhaAdmPadrao) {
      setIsAdmLoggedIn(true);
      setError('');
      toast({
        title: 'Acesso de administrador autorizado',
        description: 'Área de administração liberada',
      });
    } else {
      setError('Senha de administrador incorreta.');
    }
  };

  const handleAtualizarSenhaUsuario = () => {
    if (novaSenhaUsuario.trim()) {
      setSenhaUsuarioPadrao(novaSenhaUsuario);
      setNovaSenhaUsuario('');
      toast({
        title: 'Senha atualizada com sucesso!',
        description: 'A senha de acesso do usuário foi alterada.',
      });
    }
  };

  const handleAtualizarSenhaAdm = () => {
    if (novaSenhaAdm.trim()) {
      setSenhaAdmPadrao(novaSenhaAdm);
      setNovaSenhaAdm('');
      toast({
        title: 'Senha atualizada com sucesso!',
        description: 'A senha do administrador foi alterada.',
      });
    }
  };

  const clearError = () => setError('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Cabeçalho */}
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
          <p className="text-muted-foreground">Login</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login de Usuário Comum */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <User className="h-5 w-5" />
              Acesso de Usuário
            </CardTitle>
            <CardDescription>
              Entre com sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha-usuario">Senha de Acesso</Label>
              <div className="relative">
                <Input
                  id="senha-usuario"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha de acesso"
                  value={senhaUsuario}
                  onChange={(e) => {
                    setSenhaUsuario(e.target.value);
                    clearError();
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLoginUsuario()}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleLoginUsuario}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!senhaUsuario.trim()}
            >
              Entrar no CavernaSPY
            </Button>
          </CardContent>
        </Card>

        {/* Botão para Administrador */}
        {!showAdmSection && (
          <Button 
            variant="outline" 
            onClick={() => setShowAdmSection(true)}
            className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
          >
            <Shield className="mr-2 h-4 w-4" />
            Sou Administrador
          </Button>
        )}

        {/* Seção de Login do Administrador */}
        {showAdmSection && !isAdmLoggedIn && (
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <Shield className="h-5 w-5" />
                Acesso de Administrador
              </CardTitle>
              <CardDescription>
                Digite sua senha de administrador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senha-adm">Senha do Administrador</Label>
                <div className="relative">
                  <Input
                    id="senha-adm"
                    type={showAdmPassword ? "text" : "password"}
                    placeholder="Digite sua senha de administrador"
                    value={senhaAdm}
                    onChange={(e) => {
                      setSenhaAdm(e.target.value);
                      clearError();
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoginAdm()}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowAdmPassword(!showAdmPassword)}
                  >
                    {showAdmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleLoginAdm}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!senhaAdm.trim()}
                >
                  Entrar como ADM
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAdmSection(false)}
                  className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Área de Administração */}
        {isAdmLoggedIn && (
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <Settings className="h-5 w-5" />
                Área de Administração
              </CardTitle>
              <CardDescription>
                Gerencie as senhas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seção 1: Alterar senha do usuário */}
              <div className="space-y-3 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
                <h3 className="font-medium text-blue-700 dark:text-blue-300">
                  Alterar senha de acesso do usuário
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="nova-senha-usuario">Nova senha de acesso do usuário</Label>
                  <div className="relative">
                    <Input
                      id="nova-senha-usuario"
                      type={showNewUserPassword ? "text" : "password"}
                      placeholder="Digite a nova senha do usuário"
                      value={novaSenhaUsuario}
                      onChange={(e) => setNovaSenhaUsuario(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    >
                      {showNewUserPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleAtualizarSenhaUsuario}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!novaSenhaUsuario.trim()}
                >
                  Atualizar senha de acesso
                </Button>
              </div>

              {/* Seção 2: Alterar senha do administrador */}
              <div className="space-y-3 p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50/50 dark:bg-red-950/50">
                <h3 className="font-medium text-red-700 dark:text-red-300">
                  Alterar senha do administrador
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="nova-senha-adm">Nova senha do administrador</Label>
                  <div className="relative">
                    <Input
                      id="nova-senha-adm"
                      type={showNewAdmPassword ? "text" : "password"}
                      placeholder="Digite a nova senha do administrador"
                      value={novaSenhaAdm}
                      onChange={(e) => setNovaSenhaAdm(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewAdmPassword(!showNewAdmPassword)}
                    >
                      {showNewAdmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleAtualizarSenhaAdm}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!novaSenhaAdm.trim()}
                >
                  Atualizar senha do ADM
                </Button>
              </div>

              {/* Botão para sair da área de administração */}
              <Button 
                variant="outline"
                onClick={() => {
                  setIsAdmLoggedIn(false);
                  setShowAdmSection(false);
                  setSenhaAdm('');
                }}
                className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300"
              >
                Sair da Área de Administração
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Link para voltar */}
        <div className="text-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Voltar para página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TelaLogin;
