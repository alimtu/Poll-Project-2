'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3Icon } from 'lucide-react';
import MinimalError from '../../components/Error/MinimalError';
import HomePageSkeleton from '../../components/Skeleton/HomePageSkeleton';
import FormGenerator from '../../components/FormGenerator/FormGenerator';
import useFormData from '../../lib/hooks/useFormData';
import { Divider } from '@/components/ui/divider';

export default function HomePage() {
  const router = useRouter();
  const [activeForm, setActiveForm] = useState(null);
  const { data, isLoading, error, refetch } = useFormData('m_forms');

  if (isLoading) return <HomePageSkeleton />;
  if (error) return <MinimalError onRetry={refetch} />;

  const forms = data?.forms || data;

  if (!forms || (Array.isArray(forms) && forms.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-sm text-grey-400">فرمی برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div>
      {!activeForm && (
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-grey-800">مدیریت فرم‌ها</h1>
            <button
              type="button"
              onClick={() => router.push('/charts')}
              className="flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-600 transition-colors"
            >
              <BarChart3Icon className="size-4" />
              <span>آمار</span>
            </button>
          </div>
          <Divider label="فرم‌ها" />
        </div>
      )}
      <div className={activeForm ? '' : 'px-4 pb-4'}>
        <FormGenerator
          forms={Array.isArray(forms) ? forms : []}
          activeForm={activeForm}
          onSelectForm={setActiveForm}
        />
      </div>
    </div>
  );
}
