# OSINT Intelligence Platform

Uma plataforma moderna de OSINT (Open Source Intelligence) para coleta e análise de informações públicas.

## 🚀 Funcionalidades

- **Busca Avançada de Pessoas**: Pesquisa em múltiplas plataformas sociais
- **Análise de Imagens**: Upload e análise de metadados EXIF
- **Validação de Telefone**: Verificação e formatação de números
- **Busca de Vazamentos**: Verificação de dados comprometidos
- **Relatórios PDF**: Geração automática de relatórios
- **Interface Moderna**: Design responsivo e intuitivo

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **Mapas**: Google Maps API
- **Autenticação**: Supabase Auth

## 📦 Instalação e Deploy

### Deploy na Hostinger

1. **Clone o repositório**:
   ```bash
   git clone [seu-repo-url]
   cd [nome-do-projeto]
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - O projeto usa Supabase integrado
   - APIs são gerenciadas via Edge Functions

4. **Build para produção**:
   ```bash
   npm run build
   ```

5. **Upload para Hostinger**:
   - Faça upload da pasta `dist` para o diretório público
   - O arquivo `.htaccess` já está configurado para SPA routing

### Deploy em outras plataformas

- **Vercel**: Conecte o repositório GitHub diretamente
- **Netlify**: Use o arquivo `_redirects` já configurado
- **Railway/Render**: Build automático com `npm run build`

## 🔧 Configuração

### Supabase

O projeto já está configurado com:
- Autenticação segura
- Edge Functions para APIs externas
- Políticas RLS implementadas

### APIs Externas

As chaves de API são gerenciadas via Supabase Secrets:
- RapidAPI para OSINT
- Google Maps para geolocalização
- Hunter.io para validação de emails

## 🔒 Segurança

- ✅ Autenticação segura com Supabase
- ✅ Rate limiting implementado
- ✅ Headers de segurança configurados
- ✅ Validação de entrada rigorosa
- ✅ Logging seguro sem exposição de dados

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting do código
```

## 📱 Responsividade

- Desktop: Interface completa
- Tablet: Layout adaptado
- Mobile: Interface otimizada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação do Supabase
- Verifique os logs das Edge Functions

---

**Nota**: Este projeto está otimizado para deployment em qualquer provedor de hospedagem que suporte aplicações React estáticas.

## Project info (Lovable)

**URL**: https://lovable.dev/projects/488e1895-04da-4f29-9162-5b15d8404656

### How to edit via Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/488e1895-04da-4f29-9162-5b15d8404656) and start prompting.

Changes made via Lovable will be committed automatically to this repo.