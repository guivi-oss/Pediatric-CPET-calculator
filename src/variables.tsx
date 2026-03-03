import React from 'react';
import { Activity, Heart, Wind, Zap } from 'lucide-react';

export type Sex = 'male' | 'female';
export type Protocol = 'ramp' | 'godfrey';

export interface PatientData {
  sex: Sex;
  age: number | '';
  weight: number | '';
  height: number | '';
  protocol: Protocol;
}

export interface Option {
  id: string;
  label: string;
  calc: (d: PatientData) => number | null;
  calcZScore?: (actual: number, d: PatientData) => number | null;
}

export interface Variable {
  id: string;
  title: string;
  unit: string;
  icon: React.ReactNode;
  options: Option[];
}

export const VARIABLES: Variable[] = [
  {
    id: 'vo2',
    title: 'VO₂ max',
    unit: 'mL/min',
    icon: <Wind className="w-5 h-5 text-blue-500" />,
    options: [
      { id: 'cooper_weight', label: 'Cooper et al. Weight (1984)', calc: (d: PatientData) => d.weight ? (d.sex === 'male' ? Number(d.weight) * 45 : Number(d.weight) * 40) : null },
      { id: 'cooper_height', label: 'Cooper et al. Height (1984)', calc: (d: PatientData) => d.height ? (d.sex === 'male' ? Number(d.height) * 20 : Number(d.height) * 18) : null },
      { id: 'bongers', label: 'Bongers, Takken et al. (2014)', calc: (d: PatientData) => (d.weight && d.height) ? (d.sex === 'male' ? Number(d.weight) * 40 + Number(d.height) * 10 : Number(d.weight) * 35 + Number(d.height) * 8) : null },
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (!d.height || !d.weight) return null;
          const heightCm = Number(d.height);
          const weightKg = Number(d.weight);
          const bmi = weightKg / Math.pow(heightCm / 100, 2);
          const lnH = Math.log(heightCm);
          const lnBMI = Math.log(bmi);
          return d.sex === 'female'
            ? Math.exp(-2.826 + 1.863 * lnH + 0.285 * lnBMI)
            : Math.exp(-4.448 + 2.305 * lnH + 0.139 * lnBMI);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (!d.height || !d.weight || actual <= 0) return null;
          const heightCm = Number(d.height);
          const weightKg = Number(d.weight);
          const bmi = weightKg / Math.pow(heightCm / 100, 2);
          const lnH = Math.log(heightCm);
          const lnBMI = Math.log(bmi);
          const lnActual = Math.log(actual);
          return d.sex === 'female'
            ? (lnActual + 2.826 - 1.863 * lnH - 0.285 * lnBMI) / 0.146
            : (lnActual + 4.448 - 2.305 * lnH - 0.139 * lnBMI) / 0.142;
        }
      }
    ]
  },
  {
    id: 'work',
    title: 'Max Work',
    unit: 'Watts',
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    options: [
      { id: 'harkel', label: 'Ten Harkel et al. (2011)', calc: (d: PatientData) => d.weight ? (d.sex === 'male' ? Number(d.weight) * 3.5 : Number(d.weight) * 3.0) : null },
      { id: 'bongers', label: 'Bongers, Takken et al. (2014)', calc: (d: PatientData) => d.weight ? (d.sex === 'male' ? Number(d.weight) * 3.2 : Number(d.weight) * 2.8) : null },
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (!d.height || !d.age) return null;
          const lnH = Math.log(Number(d.height));
          const lnA = Math.log(Number(d.age));
          return d.sex === 'female' 
            ? Math.exp(-5.951 + 1.947 * lnH + 0.39 * lnA)
            : Math.exp(-7.662 + 2.309 * lnH + 0.408 * lnA);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (!d.height || !d.age || actual <= 0) return null;
          const lnH = Math.log(Number(d.height));
          const lnA = Math.log(Number(d.age));
          const lnActual = Math.log(actual);
          return d.sex === 'female'
            ? (lnActual + 5.951 - 1.947 * lnH - 0.39 * lnA) / 0.1932
            : (lnActual + 7.662 - 2.309 * lnH - 0.408 * lnA) / 0.1713;
        }
      }
    ]
  },
  {
    id: 'hr',
    title: 'Max Heart Rate',
    unit: 'bpm',
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    options: [
      { id: 'standard', label: 'Standard 220 - age', calc: (d: PatientData) => d.age ? 220 - Number(d.age) : null },
      { id: 'bongers', label: 'Bongers, Takken et al. (2014)', calc: (d: PatientData) => d.age ? (d.sex === 'male' ? 208 - 0.7 * Number(d.age) : 210 - 0.7 * Number(d.age)) : null },
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: () => 188.1,
        calcZScore: (actual: number) => (actual - 188.1) / 8.9
      }
    ]
  },
  {
    id: 'o2pulse',
    title: 'O₂ Pulse',
    unit: 'mL/beat',
    icon: <Activity className="w-5 h-5 text-emerald-500" />,
    options: [
      { id: 'wasserman', label: 'Wasserman (2012)', calc: (d: PatientData) => (d.weight && d.age) ? ((d.sex === 'male' ? Number(d.weight) * 45 : Number(d.weight) * 40) / (220 - Number(d.age))) : null },
      { id: 'bongers', label: 'Bongers, Takken et al. (2014)', calc: (d: PatientData) => (d.weight && d.age) ? ((d.sex === 'male' ? Number(d.weight) * 40 : Number(d.weight) * 35) / (208 - 0.7 * Number(d.age))) : null },
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (!d.weight || !d.height) return null;
          const lnW = Math.log(Number(d.weight));
          const lnH = Math.log(Number(d.height));
          return d.sex === 'female'
            ? Math.exp(-6.266 + 1.049 * lnW - 0.091 * Math.pow(lnW, 2) + 1.147 * lnH)
            : Math.exp(-8.04 + 0.15 * lnW + 1.946 * lnH);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (!d.weight || !d.height || actual <= 0) return null;
          const lnW = Math.log(Number(d.weight));
          const lnH = Math.log(Number(d.height));
          const lnActual = Math.log(actual);
          return d.sex === 'female'
            ? (lnActual + 6.266 - 1.049 * lnW + 0.091 * Math.pow(lnW, 2) - 1.147 * lnH) / 0.1484
            : (lnActual + 8.04 - 0.15 * lnW - 1.946 * lnH) / 0.1458;
        }
      }
    ]
  },
  {
    id: 'vt1',
    title: 'VT1',
    unit: 'mL/min',
    icon: <Wind className="w-5 h-5 text-cyan-500" />,
    options: [
      { id: 'cooper_height', label: 'Cooper et al. Height (1984)', calc: (d: PatientData) => d.height ? ((d.sex === 'male' ? Number(d.height) * 20 : Number(d.height) * 18) * 0.55) : null },
      { id: 'bongers', label: 'Bongers, Takken et al. (2014)', calc: (d: PatientData) => (d.weight && d.height) ? ((d.sex === 'male' ? Number(d.weight) * 40 + Number(d.height) * 10 : Number(d.weight) * 35 + Number(d.height) * 8) * 0.5) : null },
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (!d.height || !d.weight) return null;
          const lnH = Math.log(Number(d.height));
          const lnW = Math.log(Number(d.weight));
          return d.sex === 'female'
            ? Math.exp(1.603 + 0.7875 * lnH + 0.3824 * lnW)
            : Math.exp(-1.5616 + 1.5681 * lnH + 0.228 * lnW);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (!d.height || !d.weight || actual <= 0) return null;
          const lnH = Math.log(Number(d.height));
          const lnW = Math.log(Number(d.weight));
          const lnActual = Math.log(actual);
          return d.sex === 'female'
            ? (lnActual - 1.603 - 0.7875 * lnH - 0.3824 * lnW) / 0.1872
            : (lnActual + 1.5616 - 1.5681 * lnH - 0.228 * lnW) / 0.1714;
        }
      }
    ]
  },
  {
    id: 'oues',
    title: 'OUES',
    unit: '',
    icon: <Activity className="w-5 h-5 text-violet-500" />,
    options: [
      { id: 'bongers', label: 'Bongers, Takken et al. (2014)', calc: (d: PatientData) => d.height ? (d.sex === 'male' ? Number(d.height) * 20 : Number(d.height) * 18) : null },
      { id: 'akkerman', label: 'Akkerman et al. (2016)', calc: (d: PatientData) => d.height ? (d.sex === 'male' ? Number(d.height) * 22 : Number(d.height) * 19) : null },
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (!d.height || !d.weight) return null;
          const lnH = Math.log(Number(d.height));
          const lnW = Math.log(Number(d.weight));
          return d.sex === 'female'
            ? Math.exp(0.4262 + 1.1554 * lnH + 0.3173 * lnW)
            : Math.exp(-3.1486 + 2.0259 * lnH + 0.1520 * lnW);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (!d.height || !d.weight || actual <= 0) return null;
          const lnH = Math.log(Number(d.height));
          const lnW = Math.log(Number(d.weight));
          const lnActual = Math.log(actual);
          return d.sex === 'female'
            ? (lnActual - 0.4262 - 1.1554 * lnH - 0.3173 * lnW) / 0.1906
            : (lnActual + 3.1486 - 2.0259 * lnH - 0.1520 * lnW) / 0.1848;
        }
      }
    ]
  },
  {
    id: 'maxBp',
    title: 'Max BP (Systolic)',
    unit: 'mmHg',
    icon: <Heart className="w-5 h-5 text-red-500" />,
    options: [
      { id: 'kaafarani', label: 'Kaafarani et al. (2017)', calc: (d: PatientData) => d.age ? 120 + (Number(d.age) * 2) : null }
    ]
  },
  {
    id: 'veVco2',
    title: 'VE/VCO₂ slope',
    unit: '',
    icon: <Wind className="w-5 h-5 text-teal-500" />,
    options: [
      { id: 'harkel', label: 'Ten Harkel et al. (2011)', calc: (d: PatientData) => d.age ? 28 - (Number(d.age) * 0.1) : null },
      { id: 'bongers', label: 'Bongers, Takken et al. (2014)', calc: (d: PatientData) => d.age ? 29 - (Number(d.age) * 0.12) : null },
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (!d.age) return null;
          const lnA = Math.log(Number(d.age));
          return d.sex === 'female'
            ? Math.exp(3.80 - 0.158 * lnA)
            : Math.exp(4.016 - 0.255 * lnA);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (!d.age || actual <= 0) return null;
          const lnA = Math.log(Number(d.age));
          const lnActual = Math.log(actual);
          return d.sex === 'female'
            ? (lnActual - 3.80 + 0.158 * lnA) / 0.1411
            : (lnActual - 4.016 + 0.255 * lnA) / 0.123;
        }
      }
    ]
  },
  {
    id: 'rermax',
    title: 'RERmax',
    unit: '',
    icon: <Activity className="w-5 h-5 text-indigo-500" />,
    options: [
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (d.sex === 'female') {
            if (!d.age) return null;
            return 0.985 + 0.015 * Number(d.age);
          } else {
            if (!d.height || !d.weight) return null;
            const lnH = Math.log(Number(d.height));
            const lnW = Math.log(Number(d.weight));
            return Math.exp(-2.01 + 0.475 * lnH - 0.064 * lnW);
          }
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (d.sex === 'female') {
            if (!d.age) return null;
            return (actual - 0.985 - 0.015 * Number(d.age)) / 0.098;
          } else {
            if (!d.height || !d.weight || actual <= 0) return null;
            const lnH = Math.log(Number(d.height));
            const lnW = Math.log(Number(d.weight));
            const lnActual = Math.log(actual);
            return (lnActual + 2.01 - 0.475 * lnH + 0.064 * lnW) / 0.0769;
          }
        }
      }
    ]
  },
  {
    id: 'vtmax',
    title: 'VTmax',
    unit: 'L',
    icon: <Wind className="w-5 h-5 text-blue-400" />,
    options: [
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (!d.height || !d.weight) return null;
          const lnH = Math.log(Number(d.height));
          const lnW = Math.log(Number(d.weight));
          return d.sex === 'female'
            ? Math.exp(-12.1409 + 2.3285 * lnH + 0.17293 * lnW)
            : Math.exp(-13.4373 + 2.6582 * lnH + 0.0998 * lnW);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (!d.height || !d.weight || actual <= 0) return null;
          const lnH = Math.log(Number(d.height));
          const lnW = Math.log(Number(d.weight));
          const lnActual = Math.log(actual);
          return d.sex === 'female'
            ? (lnActual + 12.1409 - 2.3285 * lnH - 0.17293 * lnW) / 0.17085
            : (lnActual + 13.4373 - 2.6582 * lnH - 0.0998 * lnW) / 0.1727;
        }
      }
    ]
  },
  {
    id: 'rrmax',
    title: 'RRmax',
    unit: '1/min',
    icon: <Wind className="w-5 h-5 text-cyan-400" />,
    options: [
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          if (d.sex === 'female') {
            if (!d.height) return null;
            return 73.62 - 0.161 * Number(d.height);
          } else {
            if (!d.weight) return null;
            const lnW = Math.log(Number(d.weight));
            return Math.exp(4.42 - 0.133 * lnW);
          }
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (d.sex === 'female') {
            if (!d.height) return null;
            return (actual - 73.62 + 0.161 * Number(d.height)) / 9.56;
          } else {
            if (!d.weight || actual <= 0) return null;
            const lnW = Math.log(Number(d.weight));
            const lnActual = Math.log(actual);
            return (lnActual - 4.42 + 0.133 * lnW) / 0.194;
          }
        }
      }
    ]
  },
  {
    id: 'br',
    title: 'Breathing Reserve (BR)',
    unit: '%',
    icon: <Activity className="w-5 h-5 text-emerald-400" />,
    options: [
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          return d.sex === 'female' ? 28.70 : 24.31;
        },
        calcZScore: (actual: number, d: PatientData) => {
          return d.sex === 'female' ? (actual - 28.70) / 15.48 : (actual - 24.31) / 13.71;
        }
      }
    ]
  },
  {
    id: 'veqco2max',
    title: 'VEqCO₂max',
    unit: '',
    icon: <Wind className="w-5 h-5 text-teal-400" />,
    options: [
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: () => Math.exp(3.421),
        calcZScore: (actual: number) => {
          if (actual <= 0) return null;
          return (Math.log(actual) - 3.421) / 0.1195;
        }
      }
    ]
  },
  {
    id: 'veqo2max',
    title: 'VEqO₂max',
    unit: '',
    icon: <Wind className="w-5 h-5 text-blue-300" />,
    options: [
      { id: 'blanchard', label: 'Blanchard et al. (2023)', calc: (d: PatientData) => {
          return d.sex === 'female' ? Math.exp(3.575) : Math.exp(3.544);
        },
        calcZScore: (actual: number, d: PatientData) => {
          if (actual <= 0) return null;
          const lnActual = Math.log(actual);
          return d.sex === 'female' ? (lnActual - 3.575) / 0.1602 : (lnActual - 3.544) / 0.1488;
        }
      }
    ]
  }
];
