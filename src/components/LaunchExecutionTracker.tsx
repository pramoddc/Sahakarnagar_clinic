import React, { useState } from 'react';
import { WEEK_1_TASKS, RISKS_DATA } from '../data/businessDefaults';
import { Week1Task, RiskItem } from '../types';
import { formatINR } from '../utils/finance';
import { 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Search, 
  Building, 
  UserCheck, 
  FileText, 
  ShieldAlert, 
  Plus, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export const LaunchExecutionTracker: React.FC = () => {
  const [tasks, setTasks] = useState<Week1Task[]>(WEEK_1_TASKS);
  const [activeTab, setActiveTab] = useState<'week1' | 'competitors' | 'risks'>('week1');
  const [expandedTaskId, setExpandedTaskId] = useState<string>('task-pt-hiring');
  const [selectedRiskId, setSelectedRiskId] = useState<string>('risk-pt-dependency');

  // Competitor mystery shopping entries
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: "Sahakar Physio & Pain Relief Centre (60 Feet Rd)",
      type: "Standalone Clinic",
      consultFee: 700,
      singleSessionFee: 800,
      package10Price: 7000,
      hasHomeCare: "No, clinic only",
      equipmentCondition: "Average (Older IFT, basic traction)",
      cleanlinessRating: 3.5,
      serviceGaps: "No dedicated active exercise rehab area; receptionist was busy on mobile; no digital booking; handwritten paper cards.",
      differentiatorOpportunity: "Our modern exercise rehab zone, sleek digital booking, and premium elder home-visit layer."
    },
    {
      id: 2,
      name: "Orthopedic Multi-Specialty Clinic (Near CQAL)",
      type: "Hospital-attached OPD",
      consultFee: 900,
      singleSessionFee: 1100,
      package10Price: 9500,
      hasHomeCare: "Limited hospital referral only",
      equipmentCondition: "Good but shared across crowded hospital ward",
      cleanlinessRating: 4.0,
      serviceGaps: "Patients wait 45+ minutes in crowded waiting area; physiotherapist rushed through 3 patients simultaneously.",
      differentiatorOpportunity: "Dedicated 1-on-1 personalized 45-minute slots with zero wait times in a serene boutique setting."
    }
  ]);

  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    type: "Standalone Clinic",
    consultFee: 800,
    singleSessionFee: 900,
    package10Price: 8000,
    hasHomeCare: "No",
    equipmentCondition: "Good",
    cleanlinessRating: 4.0,
    serviceGaps: "",
    differentiatorOpportunity: ""
  });
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.name.trim()) return;
    setCompetitors([
      ...competitors,
      {
        id: Date.now(),
        ...newCompetitor
      }
    ]);
    setNewCompetitor({
      name: "",
      type: "Standalone Clinic",
      consultFee: 800,
      singleSessionFee: 900,
      package10Price: 8000,
      hasHomeCare: "No",
      equipmentCondition: "Good",
      cleanlinessRating: 4.0,
      serviceGaps: "",
      differentiatorOpportunity: ""
    });
    setShowAddCompetitor(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ClipboardList className="w-4 h-4" />
              <span>Execution Priority & De-risking</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Week 1 Launch Action & Risk Playbooks
            </h2>
            <p className="text-stone-300 text-sm max-w-3xl mt-1 leading-relaxed">
              Don't wait to sign the lease. Start reaching out to physiotherapists in Bangalore now, 
              walk Sahakarnagar's main roads for accessible spaces, mystery shop local competitors, 
              and verify KPME licensing requirements.
            </p>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center space-x-3 bg-stone-800 p-3.5 rounded-xl border border-stone-700">
            <div className="text-right">
              <div className="text-xs text-stone-400">Week 1 Readiness</div>
              <div className="text-lg font-bold text-teal-300">
                {completedCount} of {tasks.length} Completed
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-teal-500/30 border-t-teal-400 flex items-center justify-center font-extrabold text-sm text-white">
              {Math.round((completedCount / tasks.length) * 100)}%
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800">
          <button
            onClick={() => setActiveTab('week1')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'week1'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            "What To Do This Week" Checklist ({completedCount}/{tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('competitors')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'competitors'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Mystery Shopping Intel ({competitors.length} Clinics Logged)
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'risks'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Risks to Watch & Mitigation Matrix (4 Key Areas)
          </button>
        </div>
      </div>

      {/* View 1: Week 1 Actionable Checklist */}
      {activeTab === 'week1' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-xl border transition-all shadow-xs ${
                    task.completed
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-stone-400 hover:text-teal-600 cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-stone-400" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            task.category === 'PT Hiring'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : task.category === 'Space Hunting'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : task.category === 'Competitor Intel'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {task.category}
                          </span>
                          {task.completed && (
                            <span className="text-[10px] font-bold text-emerald-700">Completed</span>
                          )}
                        </div>

                        <h3 className={`text-sm font-bold mt-1 ${task.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                          {task.title}
                        </h3>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-3xl">
                          {task.detail}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? '' : task.id)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Step-by-Step Guidance */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-3 bg-stone-50/50 rounded-b-xl text-xs">
                      <div className="font-bold text-stone-800 uppercase tracking-wide text-[11px]">
                        Detailed Action Steps:
                      </div>
                      <div className="space-y-2">
                        {task.actionableSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-stone-700">
                            <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-between items-center text-[11px] text-stone-500">
                        <span>Status: {task.completed ? 'Verified & Completed' : 'Pending action this week'}</span>
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                            task.completed
                              ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                              : 'bg-teal-700 text-white hover:bg-teal-800'
                          }`}
                        >
                          {task.completed ? 'Mark as Incomplete' : 'Mark as Done'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Mystery Shopping Competitor Intel */}
      {activeTab === 'competitors' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Sahakarnagar Local Clinics Mystery Shopping Log
              </h3>
              <p className="text-xs text-stone-500">
                "Visit two or three existing physiotherapy clinics nearby as a patient to see what the real pricing and experience looks like."
              </p>
            </div>
            <button
              onClick={() => setShowAddCompetitor(!showAddCompetitor)}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Log Another Clinic Visit
            </button>
          </div>

          {/* Add Form Modal/Drawer */}
          {showAddCompetitor && (
            <form onSubmit={handleAddCompetitor} className="bg-stone-50 p-5 rounded-xl border border-stone-300 space-y-4 text-xs">
              <div className="font-bold text-sm text-stone-900">New Clinic Mystery Shopping Entry</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Clinic Name & Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Physio, 60 Feet Road"
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Single Session Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCompetitor.singleSessionFee}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, singleSessionFee: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">10-Session Package Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCompetitor.package10Price}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, package10Price: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Service Gaps Observed</label>
                  <textarea
                    rows={2}
                    placeholder="What did they do poorly? (Rushed session, wait time, no exercise area...)"
                    value={newCompetitor.serviceGaps}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, serviceGaps: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Our Differentiator Opportunity</label>
                  <textarea
                    rows={2}
                    placeholder="How will Sahakar Physio win their patients?"
                    value={newCompetitor.differentiatorOpportunity}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, differentiatorOpportunity: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCompetitor(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-700 text-white font-bold hover:bg-teal-800"
                >
                  Save Clinic Log
                </button>
              </div>
            </form>
          )}

          {/* Competitor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {competitors.map((comp) => (
              <div key={comp.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{comp.name}</h4>
                    <span className="text-[11px] text-stone-500">{comp.type}</span>
                  </div>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {formatINR(comp.singleSessionFee)} / session
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-[11px]">
                  <div>
                    <span className="text-stone-400 block">10-Session Package</span>
                    <span className="font-bold text-stone-800">{formatINR(comp.package10Price)}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Home Care Available?</span>
                    <span className="font-bold text-stone-800">{comp.hasHomeCare}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block">Equipment Spec:</span>
                    <span className="text-stone-700">{comp.equipmentCondition}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded bg-rose-50/70 border border-rose-100 text-rose-900">
                    <strong>Observed Gap:</strong> {comp.serviceGaps}
                  </div>
                  <div className="p-2 rounded bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                    <strong>Our Winning Edge:</strong> {comp.differentiatorOpportunity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Risks & Mitigation Matrix */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-xs text-stone-600">
            <h3 className="font-bold text-stone-900 text-sm mb-1">
              Anticipating Failure Modes Before Signing the Lease
            </h3>
            <p>
              Healthcare business failures rarely happen because of bad medicine; they happen because of 
              key-person dependency, cash-flow starvation in Q1, or logistics burnout. Here is the concrete defense playbook.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Risk Selector List (5 cols) */}
            <div className="lg:col-span-5 space-y-2">
              {RISKS_DATA.map((r) => {
                const isSelected = selectedRiskId === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRiskId(r.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 shadow-2xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        r.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : r.severity === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {r.severity} Risk
                      </span>
                    </div>
                    <div className="font-bold text-stone-900 text-xs mt-1">
                      {r.risk}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Risk Mitigation Deep Dive (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-xs text-xs space-y-4">
              {(() => {
                const activeRisk = RISKS_DATA.find(r => r.id === selectedRiskId) || RISKS_DATA[0];
                return (
                  <>
                    <div className="border-b border-stone-100 pb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-sm text-stone-900">{activeRisk.risk}</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed mt-1">
                        <strong>Why it matters:</strong> {activeRisk.whyItMatters}
                      </p>
                    </div>

                    {/* Warning Signs */}
                    <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200 space-y-1">
                      <div className="font-bold text-amber-900 text-[11px] uppercase tracking-wide">
                        Early Warning Signs to Detect:
                      </div>
                      <ul className="list-disc pl-4 text-amber-800 space-y-0.5 text-[11px]">
                        {activeRisk.warningSigns.map((sign, i) => (
                          <li key={i}>{sign}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Concrete Mitigation Playbook */}
                    <div className="space-y-2">
                      <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wide flex items-center">
                        <ShieldAlert className="w-3.5 h-3.5 mr-1 text-teal-700" />
                        Concrete Mitigation Playbook:
                      </div>
                      <div className="space-y-1.5">
                        {activeRisk.mitigationPlaybook.map((play, i) => (
                          <div key={i} className="flex items-start space-x-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-stone-700">
                            <span className="w-4 h-4 rounded bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span className="leading-relaxed">{play}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
