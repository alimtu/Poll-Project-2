'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import {
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import MinimalError from '../../../components/Error/MinimalError';
import ChartsPageSkeleton from '../../../components/Skeleton/ChartsPageSkeleton';
import useFormData from '../../../lib/hooks/useFormData';

const COLORS = ['#3b5998', '#4c8bf5', '#f5a623', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22'];

const FIELD_TYPE_LABELS = {
  0: 'متن',
  1: 'متن بلند',
  3: 'عدد',
  4: 'تک انتخابی',
  5: 'چند انتخابی',
  6: 'تاریخ',
  7: 'تصویر',
  8: 'فایل',
  9: 'ویدیو',
  10: 'زمان',
  14: 'دسته‌بندی',
};

function buildChartData(forms) {
  const stepsPerForm = forms.map((f) => ({
    name: f.title,
    value: f.steps?.length || 0,
  }));

  const fieldsPerForm = forms.map((f) => {
    let count = 0;
    (f.steps || []).forEach((s) => {
      count += (s.sections || []).length + (s.sections2 || []).length;
    });
    return { name: f.title, value: count };
  });

  const typeCountMap = {};
  forms.forEach((f) => {
    (f.steps || []).forEach((s) => {
      [...(s.sections || []), ...(s.sections2 || [])].forEach((sec) => {
        const label = FIELD_TYPE_LABELS[sec.type] || `نوع ${sec.type}`;
        typeCountMap[label] = (typeCountMap[label] || 0) + 1;
      });
    });
  });
  const fieldTypeDist = Object.entries(typeCountMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const requiredData = forms.map((f) => {
    let req = 0;
    let opt = 0;
    (f.steps || []).forEach((s) => {
      [...(s.sections || []), ...(s.sections2 || [])].forEach((sec) => {
        if (sec.required) req++;
        else opt++;
      });
    });
    return { name: f.title, الزامی: req, اختیاری: opt };
  });

  return { stepsPerForm, fieldsPerForm, fieldTypeDist, requiredData };
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-grey-100 bg-white overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-semibold text-grey-700">{title}</h3>
      </div>
      <div className="px-2 pb-4">{children}</div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-grey-100 bg-white p-4 flex flex-col items-center gap-1">
      <div className="size-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <span className="text-base font-bold" style={{ color }}>{value}</span>
      </div>
      <span className="text-[10px] text-grey-500 mt-1">{label}</span>
    </div>
  );
}

function LegendList({ data, colors }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="space-y-2 px-2">
      {data.map((d, i) => {
        const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : 0;
        return (
          <div key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="flex-1 text-xs text-grey-600 truncate">{d.name}</span>
            <span className="text-xs font-semibold text-grey-800 tabular-nums">{d.value}</span>
            <span className="text-[10px] text-grey-400 w-8 text-left tabular-nums">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalList({ data, color, unit }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3 px-2">
      {data.map((d) => (
        <div key={d.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-grey-600 truncate max-w-[70%]">{d.name}</span>
            <span className="text-xs font-semibold text-grey-800 tabular-nums">{d.value} {unit}</span>
          </div>
          <div className="h-2 rounded-full bg-grey-50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-grey-100 rounded-lg shadow-sm px-3 py-2 text-xs" dir="rtl">
      {payload.map((p, i) => (
        <p key={i} className="text-grey-700">
          <span style={{ color: p.fill || p.color }}>{p.name}</span>: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function ChartsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useFormData('m_forms');

  if (isLoading) return <ChartsPageSkeleton />;
  if (error) return <MinimalError onRetry={refetch} />;

  const forms = data?.forms || data || [];
  const formList = Array.isArray(forms) ? forms : [];

  if (formList.length === 0) {
    return (
      <div className="p-4">
        <button type="button" onClick={() => router.back()} className="p-1 rounded-md text-grey-400 hover:text-grey-700 hover:bg-grey-50 transition-colors">
          <ArrowRightIcon className="size-5" />
        </button>
        <p className="text-sm text-grey-400 text-center py-12">داده‌ای برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  const { stepsPerForm, fieldsPerForm, fieldTypeDist, requiredData } = buildChartData(formList);

  const totalForms = formList.length;
  const totalSteps = stepsPerForm.reduce((s, d) => s + d.value, 0);
  const totalFields = fieldsPerForm.reduce((s, d) => s + d.value, 0);

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="p-1 -mr-1 rounded-md text-grey-400 hover:text-grey-700 hover:bg-grey-50 transition-colors">
          <ArrowRightIcon className="size-5" />
        </button>
        <h1 className="text-sm font-bold text-grey-800">آمار فرم‌ها</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="فرم" value={totalForms} color="#3b5998" />
        <StatCard label="مرحله" value={totalSteps} color="#4c8bf5" />
        <StatCard label="فیلد" value={totalFields} color="#2ecc71" />
      </div>

      {/* Steps per form — progress bars */}
      <ChartCard title="تعداد مراحل هر فرم">
        <HorizontalList data={stepsPerForm} color="#3b5998" unit="مرحله" />
      </ChartCard>

      {/* Fields per form — progress bars */}
      <ChartCard title="تعداد فیلدهای هر فرم">
        <HorizontalList data={fieldsPerForm} color="#4c8bf5" unit="فیلد" />
      </ChartCard>

      {/* Field type distribution — donut + legend */}
      <ChartCard title="توزیع نوع فیلدها">
        <div className="flex flex-col items-center gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={fieldTypeDist}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {fieldTypeDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <LegendList data={fieldTypeDist} colors={COLORS} />
        </div>
      </ChartCard>

      {/* Required vs Optional */}
      <ChartCard title="فیلدهای الزامی و اختیاری">
        <div className="space-y-3 px-2">
          {requiredData.map((d) => {
            const total = d['الزامی'] + d['اختیاری'];
            const reqPct = total > 0 ? Math.round((d['الزامی'] / total) * 100) : 0;
            const optPct = 100 - reqPct;
            return (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-grey-600 truncate max-w-[60%]">{d.name}</span>
                  <span className="text-[10px] text-grey-400 tabular-nums">{d['الزامی']} الزامی · {d['اختیاری']} اختیاری</span>
                </div>
                <div className="flex h-2.5 rounded-full overflow-hidden bg-grey-50">
                  {reqPct > 0 && (
                    <div className="bg-[#e74c3c] transition-all duration-500" style={{ width: `${reqPct}%` }} />
                  )}
                  {optPct > 0 && (
                    <div className="bg-[#2ecc71] transition-all duration-500" style={{ width: `${optPct}%` }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-5 mt-3 pt-2 border-t border-grey-50">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#e74c3c]" />
            <span className="text-[10px] text-grey-500">الزامی</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#2ecc71]" />
            <span className="text-[10px] text-grey-500">اختیاری</span>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
