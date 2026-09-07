import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  Users,
  Activity,
  Target,
  Award,
  AlertTriangle,
  Building2,
  Home,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Stethoscope,
  Briefcase,
  Zap,
  HelpCircle
} from 'lucide-react';
import { PatientRecord, TreatmentType } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  ENRICHED_ANALYTICS_PATIENTS,
  PACKAGE_FUNNEL_STAGES,
  MARKETING_CHANNELS_DATA,
  DemographicCohort,
  InjuryTrendData,
  PackageCompletionMetric
} from '../data/analyticsDataset';

interface PatientAnalyticsProps {
  onNavigateToScheduler?: () => void;
  onNavigateToPatients?: () => void;
}

// Color palettes for Recharts
const INJURY_COLORS: Record<string, string> = {
  'Chronic': '#0d9488',       // Teal-600
  'Sports': '#f59e0b',        // Amber-500
  'IT/Posture': '#3b82f6',    // Blue-500
  'Post-Surgery': '#10b981',  // Emerald-500
};

const COHORT_COLORS = ['#3b82f6', '#0d9488', '#f59e0b', '#8b5cf6', '#10b981'];

export const PatientAnalytics: React.FC<PatientAnalyticsProps> = ({
  onNavigateToScheduler,
  onNavigateToPatients
}) => {
  const { isDark } = useTheme();

  const chartTheme = useMemo(() => ({
    gridStroke: isDark ? '#2e2a27' : '#f1f5f9',
    axisStroke: isDark ? '#57534e' : '#cbd5e1',
    tickColor: isDark ? '#a8a29e' : '#64748b',
    tooltipStyle: {
      backgroundColor: isDark ? '#1c1917' : '#ffffff',
      borderRadius: '12px',
      border: isDark ? '1px solid #3d3834' : '1px solid #e2e8f0',
      boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
      color: isDark ? '#f5f5f4' : '#1c1917',
      fontSize: '12px'
    }
  }), [isDark]);

  // Load patients: Combine localStorage records with enriched cohort for statistical significance
  const [careFilter, setCareFilter] = useState<'all' | 'clinic' | 'home_care'>('all');
  const [selectedCohortKey, setSelectedCohortKey] = useState<string | null>(null);
  const [selectedInjuryCategory, setSelectedInjuryCategory] = useState<TreatmentType | null>(null);

  // Load all patients dynamically
  const allPatients = useMemo<PatientRecord[]>(() => {
    try {
      const stored = localStorage.getItem('sahakar_patients_v1');
      if (stored) {
        const parsed = JSON.parse(stored) as PatientRecord[];
        if (parsed.length >= 20) {
          return parsed;
        }
        // Merge stored with enriched to ensure a rich 24-record dataset
        const storedIds = new Set(parsed.map((p) => p.id));
        const combined = [...parsed, ...ENRICHED_ANALYTICS_PATIENTS.filter((p) => !storedIds.has(p.id))];
        return combined;
      }
    } catch {
      // Fallback
    }
    return ENRICHED_ANALYTICS_PATIENTS;
  }, []);

  // Filtered dataset
  const filteredPatients = useMemo(() => {
    return allPatients.filter((p) => {
      if (careFilter === 'all') return true;
      return p.careType === careFilter;
    });
  }, [allPatients, careFilter]);

  // 1. AGE COHORTS AGGREGATION
  const ageCohorts = useMemo<DemographicCohort[]>(() => {
    const cohorts = [
      {
        key: '18-29',
        range: '18–29 yrs',
        label: 'Athletes & Students',
        min: 18,
        max: 29,
        dominant: 'Sports Sprains & Tendinopathy',
        primaryChannel: 'Badminton Courts & Local Google Maps',
        cac: 380,
        ltv: 12200,
        conversion: 62,
        opportunity: 'Promote quick-recovery 10-session sports packages with return-to-play testing.'
      },
      {
        key: '30-44',
        range: '30–44 yrs',
        label: 'Manyata Tech / Corporate',
        min: 30,
        max: 44,
        dominant: 'Cervical Radiculopathy & Posture Strain',
        primaryChannel: 'Manyata B2B Desk Camps & Tech Referrals',
        cac: 476,
        ltv: 14200,
        conversion: 47,
        opportunity: 'High evening clinic demand (17:30–20:00). Sell 15-session Ergonomic Spine packages.'
      },
      {
        key: '45-59',
        range: '45–59 yrs',
        label: 'Active Adults & Mid-Age',
        min: 45,
        max: 59,
        dominant: 'Sciatica, Frozen Shoulder & Plantar Fasciitis',
        primaryChannel: 'Word-of-Mouth & Family Physicians',
        cac: 410,
        ltv: 18500,
        conversion: 54,
        opportunity: 'High adherence to 15-20 session programs when combining traction and manual mobilization.'
      },
      {
        key: '60-74',
        range: '60–74 yrs',
        label: 'Young Seniors & Post-Op',
        min: 60,
        max: 74,
        dominant: 'Post-TKR/THR Rehab & Spinal Stenosis',
        primaryChannel: 'Aster CMI & Baptist Orthopedic Surgeons',
        cac: 428,
        ltv: 25400,
        conversion: 78,
        opportunity: 'Hospital discharge liaison ensures direct conversion to 20-session home-to-clinic continuum.'
      },
      {
        key: '75+',
        range: '75+ yrs',
        label: 'Super Seniors (Home Care)',
        min: 75,
        max: 120,
        dominant: 'Bilateral Knee OA & Fall Risk Gait Decline',
        primaryChannel: 'RWA Gated Society Camps & Senior WhatsApp Groups',
        cac: 421,
        ltv: 28500,
        conversion: 59,
        opportunity: '100% Home Visit demand. High recurring retention with quarterly maintenance subscriptions.'
      }
    ];

    return cohorts.map((c) => {
      const cohortPatients = filteredPatients.filter((p) => p.age >= c.min && p.age <= c.max);
      const count = cohortPatients.length;
      const maleCount = cohortPatients.filter((p) => p.gender === 'Male').length;
      const femaleCount = cohortPatients.filter((p) => p.gender === 'Female').length;
      const clinicCount = cohortPatients.filter((p) => p.careType === 'clinic').length;
      const homeCareCount = cohortPatients.filter((p) => p.careType === 'home_care').length;

      const totalCompletion = cohortPatients.reduce(
        (sum, p) => sum + (p.sessionsCompleted / (p.packageType || 15)) * 100,
        0
      );
      const avgCompletionRate = count > 0 ? Math.round(totalCompletion / count) : 0;

      const totalRevenue = cohortPatients.reduce((sum, p) => sum + (p.totalPackageFee || 0), 0);
      const avgRevenue = count > 0 ? Math.round(totalRevenue / count) : 0;
      const avgAge = count > 0 ? Math.round(cohortPatients.reduce((sum, p) => sum + p.age, 0) / count) : 0;

      return {
        cohortKey: c.key,
        ageRange: c.range,
        label: c.label,
        patientCount: count,
        avgAge,
        maleCount,
        femaleCount,
        clinicCount,
        homeCareCount,
        dominantCondition: c.dominant,
        avgCompletionRate,
        avgRevenue,
        primaryMarketingChannel: c.primaryChannel,
        cacInr: c.cac,
        ltvInr: c.ltv,
        conversionRate: c.conversion,
        marketingOpportunity: c.opportunity
      };
    });
  }, [filteredPatients]);

  // 2. INJURY TRENDS AGGREGATION
  const injuryTrends = useMemo<InjuryTrendData[]>(() => {
    const categories: { key: TreatmentType; label: string; marketingTarget: string; campaign: string; peak: string }[] = [
      {
        key: 'Chronic',
        label: 'Chronic Joint & Spine',
        marketingTarget: 'Elderly 65+ & middle-aged residents with degenerative arthritis and chronic back pain',
        campaign: 'Sahakarnagar RWA Senior Citizen Arthritis Screenings & Lake Walker Camps',
        peak: 'Monsoon (July-Aug) & Winter (Nov-Jan) joint stiffness flare-ups'
      },
      {
        key: 'Sports',
        label: 'Sports & Musculoskeletal',
        marketingTarget: 'Young athletes, college sports players, gym members, and weekend badminton players',
        campaign: 'Partnerships with Reva University sports fests and Sahakarnagar badminton arenas',
        peak: 'Tournament weekends and summer fitness sprints (March–June)'
      },
      {
        key: 'IT/Posture',
        label: 'IT / Postural Strain',
        marketingTarget: 'Tech leads, software engineers, and remote workers in Manyata Tech Park / Hebbal corridor',
        campaign: 'Corporate "Tech Neck & Ergonomics" lunch-hour webinar & posture voucher distribution',
        peak: 'Quarter-end sprint deadlines and prolonged desk work cycles'
      },
      {
        key: 'Post-Surgery',
        label: 'Post-Surgical Rehab',
        marketingTarget: 'Patients discharged after Total Knee/Hip Replacement or Spinal decompression surgery',
        campaign: 'Formal surgeon liaison with Aster CMI, Bangalore Baptist & Manipal Hebbal orthopedics',
        peak: 'Year-round steady surgical referral pipeline'
      }
    ];

    const totalFiltered = filteredPatients.length || 1;

    return categories.map((cat) => {
      const pts = filteredPatients.filter((p) => {
        if (p.treatmentType) return p.treatmentType === cat.key;
        // Fallback matching
        if (cat.key === 'Sports') return p.injuryCategory.includes('Sports');
        if (cat.key === 'IT/Posture') return p.injuryCategory.includes('Posture') || p.injuryCategory.includes('Spine');
        if (cat.key === 'Post-Surgery') return p.injuryCategory.includes('Post-Surgical');
        return p.injuryCategory.includes('Geriatric') || p.injuryCategory.includes('Joint');
      });

      const count = pts.length;
      const percentage = Math.round((count / totalFiltered) * 100);

      const clinicPatients = pts.filter((p) => p.careType === 'clinic').length;
      const homePatients = pts.filter((p) => p.careType === 'home_care').length;

      const avgInitialVAS =
        count > 0 ? Number((pts.reduce((sum, p) => sum + (p.initialPainVAS || 7), 0) / count).toFixed(1)) : 0;
      const avgFinalVAS =
        count > 0 ? Number((pts.reduce((sum, p) => sum + (p.currentPainVAS || 2), 0) / count).toFixed(1)) : 0;
      const avgPainReduction = Number((avgInitialVAS - avgFinalVAS).toFixed(1));

      const avgSessionsTaken =
        count > 0 ? Math.round(pts.reduce((sum, p) => sum + p.sessionsCompleted, 0) / count) : 0;
      const avgPackageSize =
        count > 0 ? Math.round(pts.reduce((sum, p) => sum + (p.packageType || 15), 0) / count) : 0;

      const totalRevenue = pts.reduce((sum, p) => sum + (p.totalPackageFee || 0), 0);
      const avgRevenuePerPatient = count > 0 ? Math.round(totalRevenue / count) : 0;

      const topDiagnoses = Array.from(new Set(pts.map((p) => p.diagnosis.split(' - ')[0].split(' (')[0]))).slice(0, 3);

      return {
        category: cat.key,
        label: cat.label,
        count,
        percentage,
        avgInitialVAS,
        avgFinalVAS,
        avgPainReduction,
        clinicPatients,
        homePatients,
        topDiagnoses,
        avgSessionsTaken,
        avgPackageSize,
        avgRevenuePerPatient,
        marketingTarget: cat.marketingTarget,
        recommendedCampaign: cat.campaign,
        peakSeasonality: cat.peak
      };
    });
  }, [filteredPatients]);

  // 3. PACKAGE COMPLETION METRICS
  const packageMetrics = useMemo<PackageCompletionMetric[]>(() => {
    const packageTypes: (10 | 15 | 20 | 25)[] = [10, 15, 20, 25];

    return packageTypes.map((pkgSize) => {
      const pts = filteredPatients.filter((p) => (p.packageType || 15) === pkgSize);
      const enrolledCount = pts.length;
      const completedCount = pts.filter((p) => p.sessionsCompleted >= pkgSize || p.status === 'Completed').length;

      const totalSessions = pts.reduce((sum, p) => sum + p.sessionsCompleted, 0);
      const avgSessionsAttended = enrolledCount > 0 ? Number((totalSessions / enrolledCount).toFixed(1)) : 0;

      const completionRatePercent =
        enrolledCount > 0 ? Math.round((totalSessions / (enrolledCount * pkgSize)) * 100) : 0;

      const totalRevenue = pts.reduce((sum, p) => sum + (p.totalPackageFee || 0), 0);
      const avgRevenuePerPackage = enrolledCount > 0 ? Math.round(totalRevenue / enrolledCount) : 0;

      let name = '';
      let targetUser = '';
      let dropOffStage = '';
      let primaryDropOffReason = '';
      let retentionIntervention = '';
      let marginPercent = 0;

      if (pkgSize === 10) {
        name = 'Rapid Recovery (10 Sessions)';
        targetUser = 'Acute sports sprains & early desk posture strain';
        dropOffStage = 'Session 4–5 (False Recovery)';
        primaryDropOffReason = 'Pain drops to 3/10 quickly; patient prematurely believes condition is resolved.';
        retentionIntervention = 'Perform Session 5 functional movement challenge to demonstrate remaining ligament instability.';
        marginPercent = 68;
      } else if (pkgSize === 15) {
        name = 'Spine & Posture Rehab (15 Sessions)';
        targetUser = 'Cervical radiculopathy, tech neck, moderate knee OA';
        dropOffStage = 'Session 9–10 (Work Schedule Conflict)';
        primaryDropOffReason = 'Late project sprints in Manyata Tech Park cause missed weekday appointments.';
        retentionIntervention = 'Offer flexible early morning (7:30 AM) or Saturday evening catch-up clinic slots.';
        marginPercent = 74;
      } else if (pkgSize === 20) {
        name = 'Surgical & Severe Spine (20 Sessions)';
        targetUser = 'Post-TKR, Post-THR, severe sciatica with motor weakness';
        dropOffStage = 'Session 15–16 (Stagnation Plateau)';
        primaryDropOffReason = 'Slow progress after initial dramatic recovery during active hypertrophy phase.';
        retentionIntervention = 'Deliver objective ROM and strength dynamometer progress report showing 25% quad gain.';
        marginPercent = 71;
      } else {
        name = 'Geriatric Independence (25 Sessions)';
        targetUser = 'Elderly bilateral knee OA, Parkinsonian balance, fall risk';
        dropOffStage = 'Session 18–19 (Caregiver Fatigue)';
        primaryDropOffReason = 'Family caregiver scheduling fatigue or patient illness/flu interruption.';
        retentionIntervention = 'Assign dedicated primary therapist continuity and monthly family progress video calls.';
        marginPercent = 65;
      }

      return {
        packageType: pkgSize,
        name,
        targetUser,
        enrolledCount,
        completedCount,
        avgSessionsAttended,
        completionRatePercent,
        adherenceRatePercent: Math.max(70, completionRatePercent - 5),
        dropOffStage,
        primaryDropOffReason,
        retentionIntervention,
        avgRevenuePerPackage,
        marginPercent
      };
    });
  }, [filteredPatients]);

  // High-level KPI Summary
  const summaryKpis = useMemo(() => {
    const totalPatients = filteredPatients.length;
    const avgAge = totalPatients > 0 ? Math.round(filteredPatients.reduce((sum, p) => sum + p.age, 0) / totalPatients) : 0;
    const totalRevenue = filteredPatients.reduce((sum, p) => sum + (p.totalPackageFee || 0), 0);
    const totalSessionsDone = filteredPatients.reduce((sum, p) => sum + p.sessionsCompleted, 0);
    const totalSessionsPrescribed = filteredPatients.reduce((sum, p) => sum + (p.packageType || 15), 0);
    const overallCompletionRate =
      totalSessionsPrescribed > 0 ? Math.round((totalSessionsDone / totalSessionsPrescribed) * 100) : 0;

    const avgInitialVAS =
      totalPatients > 0
        ? Number((filteredPatients.reduce((sum, p) => sum + (p.initialPainVAS || 7), 0) / totalPatients).toFixed(1))
        : 0;
    const avgCurrentVAS =
      totalPatients > 0
        ? Number((filteredPatients.reduce((sum, p) => sum + (p.currentPainVAS || 2), 0) / totalPatients).toFixed(1))
        : 0;
    const avgPainDrop = Number((avgInitialVAS - avgCurrentVAS).toFixed(1));

    return {
      totalPatients,
      avgAge,
      totalRevenue,
      overallCompletionRate,
      avgInitialVAS,
      avgCurrentVAS,
      avgPainDrop
    };
  }, [filteredPatients]);

  // Chart data formatting for Age Demographics
  const demographicChartData = useMemo(() => {
    return ageCohorts.map((c) => ({
      name: c.ageRange,
      label: c.label,
      Clinic: c.clinicCount,
      'Home Care': c.homeCareCount,
      total: c.patientCount,
      completion: c.avgCompletionRate,
      avgRevenue: Math.round(c.avgRevenue / 1000) // in kINR
    }));
  }, [ageCohorts]);

  // Chart data for Pain Score Efficacy
  const painReductionChartData = useMemo(() => {
    return injuryTrends.map((it) => ({
      category: it.category,
      label: it.label,
      'Initial Pain (VAS)': it.avgInitialVAS,
      'Current Pain (VAS)': it.avgFinalVAS,
      'Pain Relief': it.avgPainReduction,
      patients: it.count
    }));
  }, [injuryTrends]);

  // Chart data for Package Completion
  const packageCompletionChartData = useMemo(() => {
    return packageMetrics.map((pm) => ({
      name: `${pm.packageType} Sessions`,
      completionRate: pm.completionRatePercent,
      adherence: pm.adherenceRatePercent,
      avgSessions: pm.avgSessionsAttended,
      enrolled: pm.enrolledCount,
      margin: pm.marginPercent
    }));
  }, [packageMetrics]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Title Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Clinical Intelligence & Marketing ROI
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-semibold text-stone-600">Sahakarnagar Cohort Analysis</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
            Patient Demographics & Treatment Analytics
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Data-driven segmentation across age cohorts, injury patterns (Chronic, Sports, IT/Posture), and package adherence curves to refine marketing acquisition and clinical retention.
          </p>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center space-x-3 shrink-0">
          {onNavigateToPatients && (
            <button
              onClick={onNavigateToPatients}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors flex items-center cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 mr-1.5 text-stone-600" />
              Patient Records
            </button>
          )}
          {onNavigateToScheduler && (
            <button
              onClick={onNavigateToScheduler}
              className="px-3.5 py-2 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5 text-teal-300" />
              Smart Scheduler
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <span className="font-bold text-stone-700">Filter Analysis:</span>
          <div className="inline-flex p-0.5 bg-stone-100 rounded-lg border border-stone-200">
            <button
              onClick={() => setCareFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                careFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Modes ({allPatients.length})
            </button>
            <button
              onClick={() => setCareFilter('clinic')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center cursor-pointer ${
                careFilter === 'clinic'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3 h-3 mr-1" />
              In-Clinic Only
            </button>
            <button
              onClick={() => setCareFilter('home_care')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center cursor-pointer ${
                careFilter === 'home_care'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-3 h-3 mr-1" />
              Elder Home Care Only
            </button>
          </div>
        </div>

        <div className="text-stone-500 font-medium flex items-center space-x-4">
          <span>
            Active Patient Base: <strong className="text-stone-900">{filteredPatients.length} Patients</strong>
          </span>
          <span>•</span>
          <span>
            Average Patient Age: <strong className="text-stone-900">{summaryKpis.avgAge} years</strong>
          </span>
          <span>•</span>
          <span>
            Overall Package Adherence: <strong className="text-emerald-700">{summaryKpis.overallCompletionRate}%</strong>
          </span>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Average Completion Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">
              {summaryKpis.overallCompletionRate}%
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              Benchmark: 72%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Across 10, 15, 20 & 25 multi-session packages.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Average Pain Reduction (VAS)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-700">
              -{summaryKpis.avgPainDrop} pts
            </span>
            <span className="text-xs text-stone-500 font-medium">
              (From {summaryKpis.avgInitialVAS} down to {summaryKpis.avgCurrentVAS}/10)
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Significant clinical relief fuels 4.9★ Google reviews and referrals.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Top Acquisition Segment
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-stone-900 block leading-tight">
              Manyata IT & Corporate
            </span>
            <span className="text-xs text-blue-700 font-semibold">
              30–44 Years (Cervical / Spine)
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Accounts for 33% of new clinic footfall & 74% margin.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Highest LTV Segment
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-stone-900 block leading-tight">
              Elderly 75+ Home Care
            </span>
            <span className="text-xs text-amber-700 font-semibold">
              ₹28,500 Avg Patient LTV
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Longest relationship horizon with 20–25 session recurring cycles.
          </p>
        </div>
      </div>

      {/* SECTION 1: PATIENT DEMOGRAPHICS (AGE GROUPS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Segment 1 of 3
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Patient Demographics by Age Groups
            </h3>
            <p className="text-xs text-stone-500">
              Age distribution reveals two distinct demand poles in Sahakarnagar: Corporate Tech Workers (30–44) and Geriatric Seniors (60–85+).
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
              <Building2 className="w-3 h-3 mr-1" /> In-Clinic
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              <Home className="w-3 h-3 mr-1" /> Home Care
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recharts Bar Chart: Age Cohort Volume & Mode */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Patient Volume & Location Split by Age Group
                </h4>
                <span className="text-xs text-stone-500">
                  Visualizing Clinic vs. Home Care adoption across life stages
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demographicChartData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: chartTheme.tickColor }}
                    axisLine={{ stroke: chartTheme.axisStroke }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: chartTheme.tickColor }}
                    axisLine={{ stroke: chartTheme.axisStroke }}
                  />
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      `${val} Patients`,
                      name === 'Clinic' ? 'In-Clinic Sessions' : 'Home Concierge Care'
                    ]}
                    contentStyle={chartTheme.tooltipStyle}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <Bar
                    dataKey="Clinic"
                    name="In-Clinic"
                    fill="#0f766e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="Home Care"
                    name="Home Care"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Strategic Insight Pill */}
            <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start space-x-2">
              <Zap className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Demographic Polarization:</strong> 100% of patients aged 75+ choose <em>Home Care</em> due to mobility barriers in Sahakarnagar apartments without elevators. Conversely, 88% of patients aged 18–44 prefer <em>In-Clinic care</em> for access to high-tech IFT, cervical traction, and the active exercise gym.
              </div>
            </div>
          </div>

          {/* Demographic Cohort Cards & Marketing Focus */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Age Cohort Marketing Strategy Breakdown
            </h4>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {ageCohorts.map((cohort) => {
                const isSelected = selectedCohortKey === cohort.cohortKey;
                return (
                  <div
                    key={cohort.cohortKey}
                    onClick={() => setSelectedCohortKey(isSelected ? null : cohort.cohortKey)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-400 ring-1 ring-teal-400/40'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-black bg-stone-900 text-white">
                          {cohort.ageRange}
                        </span>
                        <h5 className="font-bold text-xs text-stone-900">
                          {cohort.label}
                        </h5>
                      </div>
                      <span className="text-xs font-extrabold text-stone-700">
                        {cohort.patientCount} Patients
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-stone-600">
                      <span className="text-stone-500 font-medium">Dominant Injury: </span>
                      <strong className="text-stone-800">{cohort.dominantCondition}</strong>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-100 grid grid-cols-3 gap-1 text-[10px]">
                      <div>
                        <span className="text-stone-400 block">Avg Revenue</span>
                        <span className="font-bold text-stone-800">₹{cohort.avgRevenue.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">CAC / LTV</span>
                        <span className="font-bold text-teal-700">₹{cohort.cacInr} / ₹{Math.round(cohort.ltvInr / 1000)}k</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Conversion</span>
                        <span className="font-bold text-emerald-700">{cohort.conversionRate}%</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-stone-600 bg-stone-100/70 p-2 rounded-lg">
                      <span className="font-bold text-stone-900">Targeting Action: </span>
                      {cohort.marketingOpportunity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INJURY TRENDS (CHRONIC, SPORTS, IT/POSTURE, POST-SURGERY) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Segment 2 of 3
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Injury Trends & Clinical Pain Efficacy
            </h3>
            <p className="text-xs text-stone-500">
              Comparing patient volume, clinical outcome (VAS pain drop from admission to discharge), and marketing referral engines across the 4 core clinical conditions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pie / Donut Chart of Patient Share by Injury */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Patient Share by Injury Category
              </h4>
              <span className="text-xs text-stone-500">
                Prevalence among Sahakarnagar residents
              </span>

              <div className="h-56 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={injuryTrends}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="label"
                    >
                      {injuryTrends.map((entry) => (
                        <Cell
                          key={`cell-${entry.category}`}
                          fill={INJURY_COLORS[entry.category] || '#0d9488'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number, name: string) => [
                        `${val} Patients (${Math.round((val / filteredPatients.length) * 100)}%)`,
                        name
                      ]}
                      contentStyle={chartTheme.tooltipStyle}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend with numbers */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
              {injuryTrends.map((it) => (
                <div key={it.category} className="flex items-center space-x-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: INJURY_COLORS[it.category] }}
                  />
                  <span className="text-stone-700 truncate font-medium text-[11px]">
                    {it.category}: <strong>{it.percentage}%</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Composed Chart: Initial Pain vs Final Pain (Clinical Efficacy Proof) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Clinical Pain Reduction (VAS Score on 0–10 Scale)
                </h4>
                <span className="text-xs text-stone-500">
                  Initial vs. Current/Discharge Pain score proving clinical outcomes for marketing case studies
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Avg 5.1 Point Drop
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={painReductionChartData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: chartTheme.tickColor }}
                    axisLine={{ stroke: chartTheme.axisStroke }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 11, fill: chartTheme.tickColor }}
                    axisLine={{ stroke: chartTheme.axisStroke }}
                  />
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      `${val} / 10`,
                      name
                    ]}
                    contentStyle={chartTheme.tooltipStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="Initial Pain (VAS)"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="Current Pain (VAS)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-stone-500 pt-1 flex items-center justify-between">
              <span>*VAS = Visual Analogue Scale (0 = No Pain, 10 = Worst Imaginable Pain).</span>
              <span className="text-teal-700 font-semibold">Post-Surgical achieved largest raw pain reduction (-5.5 pts)</span>
            </div>
          </div>
        </div>

        {/* Injury Category Detailed Cards & Marketing Playbooks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {injuryTrends.map((it) => (
            <div
              key={it.category}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: INJURY_COLORS[it.category] }}
                  >
                    {it.category}
                  </span>
                  <span className="text-xs font-black text-stone-900">
                    {it.count} Patients ({it.percentage}%)
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-stone-900 mt-2">
                  {it.label}
                </h4>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Care Split:</span>
                    <span className="font-medium text-stone-900">
                      {it.clinicPatients} Clinic / {it.homePatients} Home
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Avg Revenue:</span>
                    <span className="font-bold text-stone-900">
                      ₹{it.avgRevenuePerPatient.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Avg Sessions:</span>
                    <span className="font-semibold text-teal-700">
                      {it.avgSessionsTaken} of {it.avgPackageSize} sessions
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block">
                    Key Diagnoses
                  </span>
                  <ul className="mt-1 space-y-0.5 text-[11px] text-stone-700">
                    {it.topDiagnoses.map((diag, i) => (
                      <li key={i} className="truncate flex items-center">
                        <span className="w-1 h-1 rounded-full bg-stone-400 mr-1.5 shrink-0" />
                        {diag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 bg-stone-50/70 p-2.5 rounded-lg">
                <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wide block">
                  Recommended Marketing Campaign
                </span>
                <p className="text-[11px] text-stone-700 mt-0.5 font-medium leading-tight">
                  {it.recommendedCampaign}
                </p>
                <div className="text-[10px] text-stone-500 mt-1">
                  <strong>Peak Season:</strong> {it.peakSeasonality}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AVERAGE COMPLETION RATES ACROSS TREATMENT PACKAGES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Segment 3 of 3
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Average Completion Rates Across Treatment Packages
            </h3>
            <p className="text-xs text-stone-500">
              Analyzing completion metrics for 10, 15, 20, and 25-session packages to pinpoint exact drop-off milestones (like the "Session 5 False Recovery Trap").
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recharts Bar Chart: Completion Rate % by Package Type */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Package Completion Rate (%) & Clinical Adherence
                </h4>
                <span className="text-xs text-stone-500">
                  Percentage of prescribed sessions completed by enrolled patients
                </span>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                15-Session = Highest Margin (74%)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={packageCompletionChartData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: chartTheme.tickColor }}
                    axisLine={{ stroke: chartTheme.axisStroke }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: chartTheme.tickColor }}
                    axisLine={{ stroke: chartTheme.axisStroke }}
                  />
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      `${val}%`,
                      name === 'completionRate' ? 'Total Completion Rate' : 'Gross Margin'
                    ]}
                    contentStyle={chartTheme.tooltipStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="completionRate"
                    name="Completion Rate (%)"
                    fill="#0d9488"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="margin"
                    name="Gross Margin (%)"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Strategic Commentary */}
            <div className="mt-3 p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-900">
              <strong>Package Sizing Recommendation:</strong> The <strong>15-Session Package</strong> is the sweet spot for Sahakarnagar. It achieves an <strong>87% completion rate</strong> and the highest clinic gross margin (74%), avoiding the scheduling fatigue seen in 25-session programs while providing ample time for neuromuscular tissue remodeling.
            </div>
          </div>

          {/* Drop-Off Funnel Milestones (Sessions 1-3 to 20+) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-stone-900 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5" />
                  Drop-Off Funnel & "False Recovery Trap"
                </h4>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                Patient attrition curve across session intervals:
              </p>

              <div className="space-y-2">
                {PACKAGE_FUNNEL_STAGES.map((stage, idx) => (
                  <div
                    key={stage.milestone}
                    className="p-2.5 rounded-xl border border-stone-100 bg-stone-50/70 hover:bg-stone-50 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <strong className="text-stone-900">{stage.milestone}</strong>
                        <span className="text-[10px] text-stone-500">({stage.sessionRange})</span>
                      </div>
                      <div className="flex items-center space-x-2 font-bold">
                        <span className="text-emerald-700">{stage.retentionPercent}% Retained</span>
                        {stage.dropOffPercent > 5 && (
                          <span className="text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 text-[10px]">
                            -{stage.dropOffPercent}% Risk
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1.5 text-[11px] text-stone-600">
                      <span className="text-stone-500">Driver: </span>
                      {stage.psychologicalDriver}
                    </div>

                    <div className="mt-1 text-[10px] text-teal-800 font-semibold bg-white p-1.5 rounded border border-stone-200">
                      Action: {stage.clinicalAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Package Comparison Table */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs overflow-hidden">
          <h4 className="text-sm font-bold text-stone-900 mb-3">
            Package Performance & Retention Playbook Summary
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Package Tier</th>
                  <th className="py-2.5 px-3">Target Patient Type</th>
                  <th className="py-2.5 px-3">Avg Attended</th>
                  <th className="py-2.5 px-3">Completion %</th>
                  <th className="py-2.5 px-3">Typical Drop-Off Point</th>
                  <th className="py-2.5 px-3">Clinical Retention Protocol</th>
                  <th className="py-2.5 px-3">Avg Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {packageMetrics.map((pkg) => (
                  <tr key={pkg.packageType} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3 font-bold text-stone-900 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 mr-1.5 font-black">
                        {pkg.packageType}
                      </span>
                      {pkg.name}
                    </td>
                    <td className="py-3 px-3 text-stone-600 max-w-[200px]">
                      {pkg.targetUser}
                    </td>
                    <td className="py-3 px-3 font-bold text-stone-900">
                      {pkg.avgSessionsAttended} / {pkg.packageType}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-black ${
                        pkg.completionRatePercent >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pkg.completionRatePercent}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-rose-700 font-semibold">
                      {pkg.dropOffStage}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-stone-600 max-w-[260px]">
                      {pkg.retentionIntervention}
                    </td>
                    <td className="py-3 px-3 font-black text-stone-900 whitespace-nowrap">
                      ₹{pkg.avgRevenuePerPackage.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 4: MARKETING STRATEGY REFINEMENT & ACQUISITION ROI */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center">
                <Target className="w-3 h-3 mr-1" />
                Data-Driven Marketing Playbook
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-300 font-semibold">Sahakarnagar & North Bangalore</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Marketing Channel ROI & Budget Allocation
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Based on patient demographics and injury volumes, reallocate monthly marketing spend (₹33,000) to maximize Patient Lifetime Value (LTV) and lower Customer Acquisition Cost (CAC).
            </p>
          </div>

          <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Blended Clinic CAC
            </span>
            <span className="text-2xl font-black text-emerald-400">
              ₹415 <span className="text-xs text-stone-300 font-normal">/ enrolled patient</span>
            </span>
            <span className="text-[10px] text-teal-300 block mt-0.5">
              Avg LTV: ₹21,400 (51.5x Return)
            </span>
          </div>
        </div>

        {/* Marketing Channels Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKETING_CHANNELS_DATA.map((ch) => (
            <div
              key={ch.channel}
              className="bg-stone-800/60 rounded-xl border border-stone-700/80 p-4 flex flex-col justify-between hover:bg-stone-800 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-white">
                    {ch.channel}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                    {ch.roiMultiple}x ROI
                  </span>
                </div>

                <div className="text-[11px] text-teal-300 font-medium mt-1">
                  Target: {ch.segmentTarget}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 py-2 border-y border-stone-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Spend/Mo</span>
                    <span className="font-bold text-stone-200">₹{ch.monthlySpendInr.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">CAC / LTV</span>
                    <span className="font-bold text-emerald-400">₹{ch.cacInr} / ₹{Math.round(ch.ltvInr / 1000)}k</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Conversion</span>
                    <span className="font-bold text-teal-300">{ch.conversionRatePercent}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[11px] text-stone-300">
                <span className="font-bold text-teal-400">Operational Key Action: </span>
                {ch.keyAction}
              </div>
            </div>
          ))}

          {/* Summary Strategy Card */}
          <div className="bg-gradient-to-br from-teal-950 to-stone-900 rounded-xl border border-teal-700/60 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-teal-400" />
                <h4 className="font-extrabold text-sm text-teal-200">
                  Recommended Marketing Budget Mix
                </h4>
              </div>

              <ul className="mt-3 space-y-2 text-xs text-stone-300">
                <li className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>35% to Doctor Liaisons:</strong> Direct relationship with 6 orthopedic surgeons at Aster CMI and Baptist yields highest conversion (77.8%).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>30% to RWA Senior Camps:</strong> Sunday morning clubhouse screenings in Judicial Layout & Tata Nagar drive high-margin home visits.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>20% to Manyata Corporate:</strong> Desk ergonomics webinars capture evening clinic footfall.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>15% to Local SEO & Sports:</strong> Google Maps 4.9★ review automation + badminton court tie-ups.</span>
                </li>
              </ul>
            </div>

            <div className="mt-3 pt-2 border-t border-teal-800 text-[11px] text-teal-300 font-semibold">
              Projected Monthly Enrolled Patients: 35–42 Patients / Month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
