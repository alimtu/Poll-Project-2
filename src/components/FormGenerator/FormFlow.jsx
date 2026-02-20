'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ArrowRightIcon, CheckIcon, CircleCheckBigIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import FieldRenderer from './FieldRenderer';
import buildFormSchema from '../../lib/utils/buildFormSchema';
import { getSavedLocation } from '../../lib/hooks/useGeolocation';

export default function FormFlow({ form, onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const steps = form.steps || [];
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const schema = buildFormSchema(steps);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {},
    mode: 'onChange',
  });

  const allSections = [...(step?.sections || [])];

  const scrollToFirstError = () => {
    const firstError = document.querySelector('[data-field] [aria-invalid="true"], [data-field] .text-danger-500');
    if (firstError) {
      const wrapper = firstError.closest('[data-field]');
      (wrapper || firstError).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goNext = async () => {
    const fieldsToValidate = allSections.map((s) => `section_${s.sectionId}`);
    const valid = await trigger(fieldsToValidate);
    if (valid) {
      setCurrentStep((i) => i + 1);
    } else {
      setTimeout(scrollToFirstError, 100);
    }
  };

  const goPrev = () => setCurrentStep((i) => i - 1);

  const onSubmit = (values) => {
    const location = getSavedLocation();
    const payload = {
      ...values,
      ...(location ? { lat: location.lat, lng: location.lng } : {}),
    };
    console.log(`Form [${form.formId}] submitted:`, payload);
    toast.success('فرم با موفقیت ثبت شد.');
    setSubmitted(true);
  };

  const onSubmitError = () => {
    setTimeout(scrollToFirstError, 100);
  };

  useEffect(() => {
    if (!submitted) return;
    if (countdown <= 0) { onBack(); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [submitted, countdown, onBack]);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] p-6 text-center">
        <div className="size-16 rounded-full bg-success-50 flex items-center justify-center mb-5">
          <CircleCheckBigIcon className="size-8 text-success-500" />
        </div>
        <h2 className="text-base font-bold text-grey-800 mb-2">فرم ثبت شد</h2>
        <p className="text-sm text-grey-500 leading-relaxed mb-1">
          فرم «{form.title}» با موفقیت ثبت شد.
        </p>
        <p className="text-xs text-grey-400 mb-6">
          بازگشت خودکار تا {countdown} ثانیه...
        </p>
        <Button type="button" variant="outline" onClick={onBack} className="px-8">
          بازگشت به فرم‌ها
        </Button>
      </div>
    );
  }

  if (!step) {
    return <div className="py-12 text-center text-sm text-grey-400">این فرم مرحله‌ای ندارد.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onSubmitError)} className="flex flex-col min-h-[calc(100dvh-56px)]">
      <div className="flex-1 pb-24">

        {/* Sticky header */}
        <div className="sticky top-14 z-30 bg-white border-b border-grey-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <button type="button" onClick={onBack} className="p-1 -mr-1 rounded-md text-grey-400 hover:text-grey-700 hover:bg-grey-50 transition-colors">
              <ArrowRightIcon className="size-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-grey-800 truncate">{form.title}</p>
              <p className="text-[11px] text-grey-400 mt-0.5">
                مرحله {currentStep + 1} از {steps.length}
              </p>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="p-4">
          <div className="flex items-start">
            {steps.map((s, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  {/* Dots row */}
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div className={`flex-1 h-0.5 transition-colors duration-300 ${done || active ? 'bg-primary-400' : 'bg-grey-100'}`} />
                    )}
                    <button
                      type="button"
                      onClick={() => { if (done) setCurrentStep(i); }}
                      className={`shrink-0 size-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 ${done
                        ? 'bg-primary-500 text-white cursor-pointer'
                        : active
                          ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                          : 'bg-grey-100 text-grey-400 cursor-default'
                        }`}
                    >
                      {done ? <CheckIcon className="size-3 stroke-3" /> : i + 1}
                    </button>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 transition-colors duration-300 ${done ? 'bg-primary-400' : 'bg-grey-100'}`} />
                    )}
                  </div>
                  {/* Label */}
                  <span className={`text-[10px] mt-1.5 text-center leading-tight max-w-[64px] truncate ${active ? 'text-primary-600 font-medium' : done ? 'text-grey-500' : 'text-grey-300'
                    }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step title & description */}
        <div className="p-4 pb-5">
          <div className='flex w-full border border-primary-100 p-2 rounded-md'>
            <h2 className="text-sm font-semibold text-grey-800">{step.title}</h2>
          </div>
          {step.discription && (
            <p className="text-xs text-grey-400 mt-1 leading-relaxed">{step.discription}</p>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-5 p-4">
          {allSections.length === 0 ? (
            <p className="text-sm text-grey-300 text-center py-6">بدون فیلد</p>
          ) : (
            allSections.map((section) => (
              <FieldRenderer key={section.sectionId} section={section} control={control} />
            ))
          )}
        </div>
      </div>

      {/* Sticky bottom nav */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-grey-100 p-4 flex gap-3">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={goPrev} className="flex-1 h-11">
            قبلی
          </Button>
        )}
        {!isLast ? (
          <Button type="button" onClick={goNext} className="flex-1 h-11">
            بعدی
          </Button>
        ) : (
          <Button type="submit" className="flex-1 h-11" disabled={isSubmitting}>
            {isSubmitting ? 'در حال ارسال...' : 'ثبت'}
          </Button>
        )}
      </div>
    </form>
  );
}
