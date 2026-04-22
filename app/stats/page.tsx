'use client';

import { useState } from 'react';
import { personalRecords, bodyMeasurements } from '@/app/data/mock-data';
import { IconTrophy, IconScale, IconTrendingDown, IconTrendingUp, IconActivity } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Header } from '../ui/Header';
import { useTranslations } from 'next-intl';

type StatsTab = 'progress' | 'records';

const chartData = bodyMeasurements.map((m) => ({
  date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  weight: m.weight,
  waist: m.waist,
}));

export default function Stats() {
  const t = useTranslations("stats");
  const [activeTab, setActiveTab] = useState<StatsTab>('progress');
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'waist'>('weight');

  const latestMeasurement = bodyMeasurements[bodyMeasurements.length - 1];
  const firstMeasurement = bodyMeasurements[0];
  
  const weightChange = latestMeasurement.weight! - firstMeasurement.weight!;
  const waistChange = latestMeasurement.waist! - firstMeasurement.waist!;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        <button
          onClick={() => setActiveTab('progress')}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'progress'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconActivity className="h-4 w-4" />
          Progress
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'records'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconTrophy className="h-4 w-4" />
          Records
        </button>
      </div>

      {activeTab === 'progress' ? (
        <>
          {/* Metric Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMetric('weight')}
              className={cn(
                "rounded-xl p-4 text-left transition-all",
                selectedMetric === 'weight'
                  ? "bg-primary/10 ring-2 ring-primary"
                  : "bg-card"
              )}
            >
              <div className="flex items-center gap-2">
                <IconScale className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Weight</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {latestMeasurement.weight} kg
              </p>
              <div className={cn(
                "mt-1 flex items-center gap-1 text-sm",
                weightChange < 0 ? "text-primary" : "text-destructive"
              )}>
                {weightChange < 0 ? (
                  <IconTrendingDown className="h-3.5 w-3.5" />
                ) : (
                  <IconTrendingUp className="h-3.5 w-3.5" />
                )}
                <span>{Math.abs(weightChange).toFixed(1)} kg</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedMetric('waist')}
              className={cn(
                "rounded-xl p-4 text-left transition-all",
                selectedMetric === 'waist'
                  ? "bg-primary/10 ring-2 ring-primary"
                  : "bg-card"
              )}
            >
              <div className="flex items-center gap-2">
                <IconActivity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Waist</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {latestMeasurement.waist} cm
              </p>
              <div className={cn(
                "mt-1 flex items-center gap-1 text-sm",
                waistChange < 0 ? "text-primary" : "text-destructive"
              )}>
                {waistChange < 0 ? (
                  <IconTrendingDown className="h-3.5 w-3.5" />
                ) : (
                  <IconTrendingUp className="h-3.5 w-3.5" />
                )}
                <span>{Math.abs(waistChange).toFixed(1)} cm</span>
              </div>
            </button>
          </div>

          {/* Chart */}
          <div className="rounded-xl bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
              {selectedMetric === 'weight' ? 'Weight' : 'Waist'} Progress
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Other Measurements */}
          <div className="rounded-xl bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Other Measurements
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{latestMeasurement.chest}</p>
                <p className="text-xs text-muted-foreground">Chest (cm)</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{latestMeasurement.arms}</p>
                <p className="text-xs text-muted-foreground">Arms (cm)</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{latestMeasurement.thighs}</p>
                <p className="text-xs text-muted-foreground">Thighs (cm)</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Personal Records */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Personal Records</h2>
            {personalRecords.map((pr) => (
              <div
                key={pr.id}
                className="flex items-center gap-4 rounded-xl bg-card p-4"
              >
                {/* Trophy */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                  <IconTrophy className="h-6 w-6 text-primary" />
                </div>

                {/* PR Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{pr.exerciseName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(pr.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Weight & Reps */}
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{pr.weight}kg</p>
                  <p className="text-sm text-muted-foreground">x{pr.reps}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Stats */}
          <div className="rounded-xl bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              All-Time Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {personalRecords.length}
                </p>
                <p className="text-sm text-muted-foreground">Personal Records</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.max(...personalRecords.map((pr) => pr.weight))}kg
                </p>
                <p className="text-sm text-muted-foreground">Heaviest Lift</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
