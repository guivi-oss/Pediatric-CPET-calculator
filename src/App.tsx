import React, { useState } from 'react';
import { Activity, Heart, Wind, Zap, Scale, Ruler, User, Info, Percent } from 'lucide-react';
import { VARIABLES, PatientData } from './variables';

export default function App() {
  const [data, setData] = useState<PatientData>({
    sex: 'male',
    age: '',
    weight: '',
    height: '',
    protocol: 'godfrey',
  });

  const [actuals, setActuals] = useState<Record<string, number | ''>>({});
  const [refs, setRefs] = useState<Record<string, string>>({
    vo2: 'cooper_weight',
    work: 'harkel',
    hr: 'standard',
    o2pulse: 'wasserman',
    vt1: 'cooper_height',
    oues: 'bongers',
    maxBp: 'kaafarani',
    veVco2: 'harkel',
    rermax: 'blanchard',
    vtmax: 'blanchard',
    rrmax: 'blanchard',
    br: 'blanchard',
    veqco2max: 'blanchard',
    veqo2max: 'blanchard'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : name === 'sex' || name === 'protocol' ? value : Number(value),
    }));
  };

  const handleActualChange = (id: string, value: string) => {
    setActuals(prev => ({ ...prev, [id]: value === '' ? '' : Number(value) }));
  };

  const handleRefChange = (id: string, refId: string) => {
    setRefs(prev => ({ ...prev, [id]: refId }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pediatric Exercise Test</h1>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">How to use</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">References</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Normative Values & Analysis</h2>
          <p className="text-slate-600 max-w-3xl">
            Enter patient demographics to calculate expected values. Input actual test results to automatically calculate the percentage of predicted values based on your selected reference equations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Patient Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                Patient Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setData({ ...data, sex: 'male' })}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        data.sex === 'male' 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setData({ ...data, sex: 'female' })}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        data.sex === 'female' 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Age <span className="text-slate-400 font-normal">(years)</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={data.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 12"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <Scale className="w-4 h-4 text-slate-400" /> Weight <span className="text-slate-400 font-normal">(kg)</span>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={data.weight}
                      onChange={handleInputChange}
                      placeholder="e.g. 45"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <Ruler className="w-4 h-4 text-slate-400" /> Height <span className="text-slate-400 font-normal">(cm)</span>
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={data.height}
                      onChange={handleInputChange}
                      placeholder="e.g. 150"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Protocol</label>
                  <select
                    name="protocol"
                    value={data.protocol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="godfrey">Godfrey Protocol (Cycle)</option>
                    <option value="ramp">Ramp Protocol (Cycle)</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    <strong>Disclaimer:</strong> Formulas used are simplified representations of the published normative data for demonstration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Inputs */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-400" />
                  Test Variables
                </h3>
                <div className="text-sm text-slate-500">
                  Fill in actuals to see % predicted
                </div>
              </div>

              <div className="space-y-4">
                {VARIABLES.map(variable => {
                  const selectedRefId = refs[variable.id];
                  const selectedOption = variable.options.find(o => o.id === selectedRefId) || variable.options[0];
                  const expectedRaw = selectedOption.calc(data);
                  const expected = expectedRaw !== null ? expectedRaw.toFixed(1) : '--';
                  
                  const actual = actuals[variable.id];
                  let percent = '--';
                  let percentColor = 'text-slate-400';
                  let percentBg = 'bg-slate-50';
                  let isZScore = false;
                  
                  if (actual !== undefined && actual !== '') {
                    if (selectedOption.calcZScore) {
                      const zScore = selectedOption.calcZScore(Number(actual), data);
                      if (zScore !== null) {
                        isZScore = true;
                        percent = zScore.toFixed(2);
                        if (zScore >= -1.96 && zScore <= 1.96) {
                          percentColor = 'text-emerald-700';
                          percentBg = 'bg-emerald-50 border-emerald-200';
                        } else {
                          percentColor = 'text-rose-700';
                          percentBg = 'bg-rose-50 border-rose-200';
                        }
                      }
                    } else if (expectedRaw !== null && expectedRaw > 0) {
                      const p = (Number(actual) / expectedRaw) * 100;
                      percent = p.toFixed(1) + '%';
                      
                      if (p >= 85) {
                        percentColor = 'text-emerald-700';
                        percentBg = 'bg-emerald-50 border-emerald-200';
                      } else if (p >= 70) {
                        percentColor = 'text-amber-700';
                        percentBg = 'bg-amber-50 border-amber-200';
                      } else {
                        percentColor = 'text-rose-700';
                        percentBg = 'bg-rose-50 border-rose-200';
                      }
                    }
                  }

                  return (
                    <div key={variable.id} className="p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors bg-slate-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          {variable.icon}
                          <h4 className="font-semibold text-slate-900">{variable.title}</h4>
                          {variable.unit && <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{variable.unit}</span>}
                        </div>
                        
                        <div className="w-full sm:w-64">
                          <select
                            value={selectedRefId}
                            onChange={(e) => handleRefChange(variable.id, e.target.value)}
                            className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-slate-700"
                          >
                            {variable.options.map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {/* Expected */}
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Expected</div>
                          <div className="text-xl font-bold text-slate-900">{expected}</div>
                        </div>

                        {/* Actual */}
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm relative focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent transition-all">
                          <div className="text-xs font-medium text-indigo-600 mb-1 uppercase tracking-wider">Actual</div>
                          <input
                            type="number"
                            value={actual === undefined ? '' : actual}
                            onChange={(e) => handleActualChange(variable.id, e.target.value)}
                            placeholder="Enter value"
                            className="w-full text-xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal outline-none bg-transparent"
                          />
                        </div>

                        {/* % Predicted or Z-Score */}
                        <div className={`p-3 rounded-lg border shadow-sm flex flex-col justify-center items-center transition-colors ${percentBg}`}>
                          <div className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${percentColor} opacity-80`}>
                            {isZScore ? 'Z-Score' : '% Predicted'}
                          </div>
                          <div className={`text-xl font-bold ${percentColor}`}>{percent}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
