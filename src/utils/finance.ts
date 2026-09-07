import { MonthlyOperatingParams, HomeCareParams, StartupCapital, TimelineMonth } from '../types';

export interface FinancialSummary {
  monthlySessions: number;
  monthlyRevenue: number;
  consumablesCost: number;
  totalExpenses: number;
  netProfit: number;
  netMarginPercent: number;
  breakEvenPatientsPerDay: number;
  breakEvenMonthlyRevenue: number;

  // Home Care additions
  homeCareSessions: number;
  homeCareRevenue: number;
  homeCareExpenses: number;
  homeCareNetProfit: number;

  // Combined totals
  combinedRevenue: number;
  combinedExpenses: number;
  combinedNetProfit: number;
  combinedMarginPercent: number;
}

export function calculateMonthlyFinancials(
  params: MonthlyOperatingParams,
  homeCare: HomeCareParams
): FinancialSummary {
  const monthlySessions = params.patientsPerDay * params.workingDaysPerMonth;
  const monthlyRevenue = monthlySessions * params.avgSessionPrice;
  const consumablesCost = Math.round(monthlyRevenue * (params.consumablesPercent / 100));

  const clinicExpenses =
    params.physiotherapistSalary +
    params.assistantSalary +
    params.rent +
    consumablesCost +
    params.marketingBudget +
    params.utilitiesAndSundries;

  const netProfit = monthlyRevenue - clinicExpenses;
  const netMarginPercent = monthlyRevenue > 0 ? (netProfit / monthlyRevenue) * 100 : 0;

  // Fixed costs for breakeven (staff, rent, marketing, utilities)
  const fixedCosts =
    params.physiotherapistSalary +
    params.assistantSalary +
    params.rent +
    params.marketingBudget +
    params.utilitiesAndSundries;

  // Contribution margin per session = price * (1 - consumablesPercent/100)
  const contributionMarginPerSession = params.avgSessionPrice * (1 - params.consumablesPercent / 100);
  const breakEvenSessions = contributionMarginPerSession > 0 ? fixedCosts / contributionMarginPerSession : 0;
  const breakEvenPatientsPerDay = Math.ceil(breakEvenSessions / params.workingDaysPerMonth);
  const breakEvenMonthlyRevenue = Math.round(breakEvenSessions * params.avgSessionPrice);

  // Home care calculations
  let homeCareSessions = 0;
  let homeCareRevenue = 0;
  let homeCareExpenses = 0;
  let homeCareNetProfit = 0;

  if (homeCare.activeInMonth) {
    homeCareSessions = homeCare.homeVisitsPerDay * params.workingDaysPerMonth;
    homeCareRevenue = homeCareSessions * homeCare.homeVisitPrice;
    const travelCost = homeCareSessions * homeCare.travelAllowancePerVisit;
    const homeStaffCost = homeCare.secondPhysioHired ? homeCare.secondPhysioSalary : 0;
    const homeConsumables = Math.round(homeCareRevenue * 0.05); // low consumables for home visits
    homeCareExpenses = travelCost + homeStaffCost + homeConsumables;
    homeCareNetProfit = homeCareRevenue - homeCareExpenses;
  }

  const combinedRevenue = monthlyRevenue + homeCareRevenue;
  const combinedExpenses = clinicExpenses + homeCareExpenses;
  const combinedNetProfit = combinedRevenue - combinedExpenses;
  const combinedMarginPercent = combinedRevenue > 0 ? (combinedNetProfit / combinedRevenue) * 100 : 0;

  return {
    monthlySessions,
    monthlyRevenue,
    consumablesCost,
    totalExpenses: clinicExpenses,
    netProfit,
    netMarginPercent,
    breakEvenPatientsPerDay,
    breakEvenMonthlyRevenue,

    homeCareSessions,
    homeCareRevenue,
    homeCareExpenses,
    homeCareNetProfit,

    combinedRevenue,
    combinedExpenses,
    combinedNetProfit,
    combinedMarginPercent,
  };
}

export function calculateCapExSummary(capex: StartupCapital) {
  const totalSpent =
    capex.spaceDepositAndFitout +
    capex.equipment +
    capex.interiorsAndElectrical +
    capex.licensesAndRegistration +
    capex.bookingAndBranding +
    capex.workingCapitalBuffer;

  const reserveRemaining = capex.totalCapital - totalSpent;
  const runwayMonthsCovered = Math.round(
    capex.workingCapitalBuffer / 75000 // approx conservative baseline monthly burn
  );

  return {
    totalSpent,
    reserveRemaining,
    reservePercent: (reserveRemaining / capex.totalCapital) * 100,
    runwayMonthsCovered,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLakh(amount: number): string {
  const lakhs = amount / 100000;
  return `₹${lakhs.toFixed(2)} Lakh`;
}
