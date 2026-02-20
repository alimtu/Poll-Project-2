'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import http from '../../../lib/axios';
import { DEFAULT_MOBILE } from '../../../lib/auth/constants';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mob, setMob] = useState(DEFAULT_MOBILE);
  const [code, setCode] = useState('');
  const [finger, setFinger] = useState('');

  const canSubmitMobile = useMemo(() => mob?.trim()?.length >= 10, [mob]);
  const canSubmitVerify = useMemo(() => code?.trim()?.length >= 4, [code]);

  const loginMutation = useMutation({
    mutationFn: async (mobile) => {
      return http.get('/', {
        params: { op: 'm_login', mob: mobile },
        _returnFullBody: true,
      });
    },
    onSuccess: (body) => {
      if (body?.finger) {
        setFinger(body.finger);
        setStep(2);
        toast.success(body?.message || 'کد تایید ارسال شد.');
      } else {
        toast.error(body?.message || 'خطا در دریافت کد تایید');
      }
    },
    onError: (err) => {
      toast.error(err?.message || 'خطا در برقراری ارتباط');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (verifyCode) => {
      return http.get('/', {
        params: { op: 'm_verify', finger, code: verifyCode },
        _returnFullBody: true,
      });
    },
    onSuccess: (body) => {
      if (body?.success) {
        localStorage.setItem('finger', finger);
        toast.success(body?.message || 'ورود موفقیت آمیز بود.');
        router.push('/');
      } else {
        toast.error(body?.message || 'کد وارد شده صحیح نیست.');
      }
    },
    onError: (err) => {
      toast.error(err?.message || 'خطا در تایید کد');
    },
  });

  return (
    <div className="flex min-h-dvh items-center justify-center p-5">
      <div className="w-full space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-bold text-grey-800">ورود به سامانه</h1>
          <p className="text-sm text-grey-500">
            {step === 1
              ? 'شماره موبایل خود را وارد کنید'
              : `کد تایید ارسال شده به ${mob}`}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 px-8">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-grey-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-grey-200'}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mob">شماره موبایل</Label>
              <Input
                id="mob"
                value={mob}
                onChange={(e) => setMob(e.target.value)}
                placeholder="09XX XXX XXXX"
                inputMode="numeric"
                dir="ltr"
                className="text-center tracking-widest"
              />
            </div>
            <Button
              className="w-full"
              disabled={!canSubmitMobile || loginMutation.isPending}
              onClick={() => loginMutation.mutate(mob.trim())}
            >
              {loginMutation.isPending ? 'در حال ارسال...' : 'دریافت کد تایید'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">کد تایید</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="- - - - -"
                inputMode="numeric"
                autoFocus
                dir="ltr"
                className="text-center tracking-[0.5em] text-lg"
              />
            </div>
            <Button
              className="w-full"
              disabled={!canSubmitVerify || verifyMutation.isPending}
              onClick={() => verifyMutation.mutate(code.trim())}
            >
              {verifyMutation.isPending ? 'در حال بررسی...' : 'ورود'}
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-primary-500 w-full text-center"
            >
              تغییر شماره موبایل
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
