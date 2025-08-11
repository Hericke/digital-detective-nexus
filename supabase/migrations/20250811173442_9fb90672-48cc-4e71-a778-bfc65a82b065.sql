-- Corrigir política de segurança da tabela profiles
-- Remover política pública que expõe dados sensíveis
DROP POLICY IF EXISTS "Perfis são publicamente visíveis" ON public.profiles;

-- Criar novas políticas mais seguras
-- Permitir que usuários autenticados vejam apenas perfis de suas próprias pesquisas
CREATE POLICY "Usuários podem ver perfis de suas pesquisas" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.search_profiles sp
    JOIN public.searches s ON sp.search_id = s.id
    WHERE sp.profile_id = profiles.id 
    AND s.user_id = auth.uid()
  )
);

-- Permitir inserção de perfis apenas para usuários autenticados
-- (assumindo que perfis são criados durante pesquisas OSINT)
CREATE POLICY "Usuários autenticados podem inserir perfis" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Política para atualização (caso necessário)
CREATE POLICY "Usuários podem atualizar perfis de suas pesquisas" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.search_profiles sp
    JOIN public.searches s ON sp.search_id = s.id
    WHERE sp.profile_id = profiles.id 
    AND s.user_id = auth.uid()
  )
);

-- Política para deleção (caso necessário)
CREATE POLICY "Usuários podem deletar perfis de suas pesquisas" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.search_profiles sp
    JOIN public.searches s ON sp.search_id = s.id
    WHERE sp.profile_id = profiles.id 
    AND s.user_id = auth.uid()
  )
);