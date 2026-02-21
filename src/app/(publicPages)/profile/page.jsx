'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, SaveIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import MinimalError from '../../../components/Error/MinimalError';
import ProfilePageSkeleton from '../../../components/Skeleton/ProfilePageSkeleton';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import useProfile, { useUpdateProfile } from '../../../lib/hooks/useProfile';
import logout from '../../../lib/logout';

const FIELDS = [
  { key: 'fname', label: 'نام' },
  { key: 'lname', label: 'نام خانوادگی' },
  { key: 'mobile', label: 'موبایل', disabled: true },
  { key: 'email', label: 'ایمیل' },
  { key: 'codem', label: 'کد ملی' },
  { key: 'adr', label: 'آدرس' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useProfile();
  const updateMutation = useUpdateProfile();
  const [form, setForm] = useState({});

  const prof = data?.prof;

  useEffect(() => {
    if (prof) {
      const initial = {};
      FIELDS.forEach(({ key }) => { initial[key] = prof[key] || ''; });
      setForm(initial);
    }
  }, [prof]);

  if (isLoading) return <ProfilePageSkeleton />;
  if (error) return <MinimalError onRetry={refetch} />;
  if (!prof) return <div className="p-8 text-center text-sm text-grey-400">اطلاعات کاربری یافت نشد.</div>;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const updates = {};
    FIELDS.forEach(({ key, disabled }) => {
      if (!disabled && form[key] !== (prof[key] || '')) {
        updates[key] = form[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      toast.info('تغییری اعمال نشده است.');
      return;
    }

    updateMutation.mutate(updates, {
      onSuccess: (body) => {
        toast.success(body?.message || 'اطلاعات با موفقیت ذخیره شد.');
      },
      onError: (err) => {
        toast.error(err?.message || 'خطا در ذخیره اطلاعات');
      },
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="text-grey-500 hover:text-grey-700">
          <ArrowRightIcon className="size-5" />
        </button>
        <h1 className="text-sm font-bold text-grey-800">حساب کاربری</h1>
      </div>

      {/* Avatar section */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-lg font-bold">
          {(prof.fname?.[0] || '') + (prof.lname?.[0] || '')}
        </div>
        <p className="text-sm font-semibold text-grey-800 mt-2">{prof.fname} {prof.lname}</p>
        <p className="text-xs text-grey-400">{prof.mobile}</p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {FIELDS.map(({ key, label, disabled }) => (
          <div key={key}>
            <Label className="text-xs text-grey-500 font-normal">{label}</Label>
            <Input
              value={form[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={disabled}
              className="mt-1"
              dir={key === 'email' ? 'ltr' : 'rtl'}
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          className="w-full h-11"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          <SaveIcon className="size-4 ml-2" />
          {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>

        <Button
          variant="outline"
          className="w-full h-11 text-danger-500 border-danger-100 hover:bg-danger-50"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4 ml-2" />
          خروج از حساب
        </Button>
      </div>
    </div>
  );
}
