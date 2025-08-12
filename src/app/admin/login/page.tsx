'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminLoginPage() {
  useDocumentTitle('나란히 관리자 로그인 - 나란히정신건강의학과의원');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if user is admin
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role, is_active')
          .eq('email', data.user.email)
          .single();

        if (adminError || !adminUser || !adminUser.is_active) {
          await supabase.auth.signOut();
          throw new Error('관리자 권한이 없습니다.');
        }

        // Update login activity
        await supabase
          .from('admin_users')
          .update({
            last_login_at: new Date().toISOString(),
            login_count: supabase
              .from('admin_users')
              .select('login_count')
              .eq('email', data.user.email)
              .single()
              .then(({ data }) => (data?.login_count || 0) + 1),
          })
          .eq('email', data.user.email);

        // Log admin activity
        await supabase.from('admin_activity_log').insert({
          admin_user_id: adminUser.id,
          action: 'login',
          details: { user_agent: navigator.userAgent },
          ip_address: '127.0.0.1', // In production, get real IP
        });

        setMessage('로그인 성공! 대시보드로 이동합니다...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create admin user record
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({
            email: data.user.email,
            name: email.split('@')[0],
            role: 'admin',
            is_active: true,
          });

        if (adminError) {
          console.error('Admin user creation error:', adminError);
        }

        setMessage('계정이 생성되었습니다. 로그인해주세요.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || '계정 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">나란히 관리자</CardTitle>
          <CardDescription>관리자 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="관리자용 이메일 입력"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자용 비밀번호 입력"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </Button>
              {/* <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? '계정 생성 중...' : '관리자 계정 생성'}
              </Button> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
