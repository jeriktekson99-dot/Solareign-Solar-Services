import { useState, useMemo } from 'react';
import { Zap, Copy, Download, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { SOLAREIGN_LOGO_BASE64 } from '../data/logoBase64';

interface ApplianceItem {
  name: string;
  wattage: string;
}

const APPLIANCES: ApplianceItem[] = [
  { name: 'INVERTER AIRCON (1 HP)', wattage: '750 W' },
  { name: 'TELEVISION (55" LED)', wattage: '100 W' },
  { name: 'REFRIGERATOR', wattage: '150 W' },
  { name: 'WASHING MACHINE', wattage: '500 W' },
  { name: 'LAPTOP + MONITOR', wattage: '80 W' },
  { name: 'MICROWAVE OVEN', wattage: '1,000 W' },
  { name: 'ELECTRIC FAN', wattage: '55 W' },
  { name: 'INDUCTION COOKER', wattage: '1,500 W' },
];

export default function SolarCalculator() {
  const [monthlyBill, setMonthlyBill] = useState<number>(12000);
  const [pricePerKwh, setPricePerKwh] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);

  // Dynamic calculations based on Philippine solar engineering standards
  const calculation = useMemo(() => {
    // 1. Sanitize user inputs
    const validBill = Math.max(1000, Number(monthlyBill) || 12000);
    const validRate = Math.max(5, Number(pricePerKwh) || 15);

    // 2. Base Energy Consumption
    const monthlyKwh = Math.round(validBill / validRate);
    const dailyKwh = monthlyKwh / 30;

    // 3. Recommended System Sizing (kWp)
    // - 65% daytime load target (solar harvesting hours: 8:00 AM - 4:00 PM)
    // - 4.5 Peak Sun Hours (PSH) per day in Philippines (Cavite/NCR)
    // - 0.80 System Performance Ratio (PR derate for inverter, tropical heat, wiring)
    const daytimeDailyKwh = dailyKwh * 0.65;
    const rawKwp = daytimeDailyKwh / (4.5 * 0.80); // daily kWh / 3.6
    const recommendedKwp = Math.max(1.5, Math.round(rawKwp * 10) / 10);

    // 4. Solar Energy Generation
    const dailySolarGenKwh = Math.round(recommendedKwp * 4.5 * 0.80 * 10) / 10;
    const monthlySolarGenKwh = Math.round(dailySolarGenKwh * 30);
    const annualSolarGenKwh = Math.round(dailySolarGenKwh * 365);

    // 5. Monthly & Annual Bill Savings (PHP)
    const calculatedMonthlySavings = Math.round(monthlySolarGenKwh * validRate);
    const monthlySavings = Math.min(Math.round(validBill * 0.85), calculatedMonthlySavings);
    const annualSavings = monthlySavings * 12;

    // 6. Turnkey System Investment Cost in PHP (Tier-1 Monocrystalline + Inverter + Aluminum Racking + Install)
    const costPerKwp = recommendedKwp <= 3 ? 80000 : recommendedKwp <= 7 ? 74000 : 68000;
    const estimatedCost = Math.round(recommendedKwp * costPerKwp);

    // 7. ROI Payback Timeline (Years & Months)
    const paybackYearsDecimal = Math.max(1.8, estimatedCost / Math.max(1, annualSavings));
    let fullYears = Math.floor(paybackYearsDecimal);
    let remainingMonths = Math.round((paybackYearsDecimal - fullYears) * 12);
    if (remainingMonths === 12) {
      fullYears += 1;
      remainingMonths = 0;
    }

    const roiLabel = remainingMonths === 0
      ? `${fullYears} YEAR${fullYears !== 1 ? 'S' : ''}`
      : `${fullYears} YEAR${fullYears !== 1 ? 'S' : ''}, ${remainingMonths} MONTH${remainingMonths !== 1 ? 'S' : ''}`;

    // 8. 25-Year Cumulative Savings & Environmental Impact
    const lifetimeSavings = Math.max(0, (annualSavings * 25) - estimatedCost);
    const co2OffsetTons = Math.round((annualSolarGenKwh * 0.7) / 100) / 10;

    // 9. Instantaneous Peak Usable Solar Power in Watts
    const peakSolarWatts = Math.round(recommendedKwp * 1000 * 0.82);

    return {
      monthlyKwh,
      dailyKwh: Math.round(dailyKwh * 10) / 10,
      recommendedKwp,
      dailySolarGenKwh,
      monthlySolarGenKwh,
      annualSolarGenKwh,
      monthlySavings,
      annualSavings,
      estimatedCost,
      paybackYearsDecimal,
      fullYears,
      remainingMonths,
      roiLabel,
      isRapid: paybackYearsDecimal <= 4.5,
      lifetimeSavings,
      co2OffsetTons,
      peakSolarWatts,
    };
  }, [monthlyBill, pricePerKwh]);

  const handleCopyResults = async () => {
    const reportText = `--- SOLAREIGN SOLAR ROI & CAPACITY ASSESSMENT ---
Monthly Electric Bill: ₱${monthlyBill.toLocaleString()} PHP
Price per kWh: ₱${pricePerKwh} / kWh
Estimated Monthly Usage: ${calculation.monthlyKwh.toLocaleString()} kWh
Recommended System Size: ${calculation.recommendedKwp} kWp Tier-1 Setup
Estimated Daily Generation: ${calculation.dailySolarGenKwh} kWh / day (~${calculation.monthlySolarGenKwh.toLocaleString()} kWh/month)
Estimated Bill Savings: ₱${calculation.monthlySavings.toLocaleString()} / month
Estimated Annual Savings: ₱${calculation.annualSavings.toLocaleString()} / year
Estimated Turnkey Investment: ₱${calculation.estimatedCost.toLocaleString()} PHP
Calculated ROI Payback Timeline: ${calculation.roiLabel}
25-Year Cumulative Savings: ₱${calculation.lifetimeSavings.toLocaleString()} PHP
Supported Daytime Loads: Inverter Aircon, Refrigerator, LED TV, Washing Machine, Workstations, Microwave, Induction Cooker
Direct Engineering Support: 0908 145 4906 | engineering@solareign.ph | www.solareignsolarpower.com`;

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadReport = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // 1. Top Header Banner (Dark Green #061D0F)
      doc.setFillColor(6, 29, 15);
      doc.rect(0, 0, 210, 28, 'F');

      // Company Symbol from Navigation Bar
      try {
        doc.addImage(SOLAREIGN_LOGO_BASE64, 'PNG', 18, 5, 18, 18);
      } catch (imgErr) {
        // Fallback sun circle if image rendering encounters issue
        doc.setFillColor(250, 204, 21);
        doc.circle(27, 14, 6, 'F');
      }

      // Brand Typography: Solareign Solar Power Services
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14.5);
      doc.setTextColor(255, 255, 255);
      doc.text('SOLA', 39, 13.5);
      const solaWidth = doc.getTextWidth('SOLA');
      doc.setTextColor(136, 214, 40); // #88D628 Lime
      doc.text('REIGN', 39 + solaWidth, 13.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(136, 214, 40); // #88D628
      doc.text('SOLAR POWER SERVICES', 39, 18.5);

      // Header Date & Version on Right
      const today = new Date();
      const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`DATE: ${dateStr || '10/1/2026'}`, 192, 12, { align: 'right' });
      doc.text('VERSION: 2.4', 192, 18, { align: 'right' });

      // 2. Introductory Note
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text(
        'Thank you for choosing Solareign Solar Power Services. Below is your custom high-fidelity energy simulation and solar investment report based on the parameters provided.',
        18,
        38,
        { maxWidth: 174 }
      );

      // 3. Section 1: CUSTOMER ENERGY PROFILE
      const sec1Y = 48;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(18, sec1Y, 174, 21, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(18, sec1Y, 174, 21, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 90, 41); // #0F5A29
      doc.text('1. CUSTOMER ENERGY PROFILE', 23, sec1Y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('Monthly Electric Bill:', 23, sec1Y + 15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`PHP ${monthlyBill.toLocaleString()}`, 62, sec1Y + 15);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('Current Utility Price:', 115, sec1Y + 15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`PHP ${pricePerKwh.toFixed(2)} / kWh`, 155, sec1Y + 15);

      // 4. Section 2: RECOMMENDED SYSTEM SPECIFICATIONS
      const sec2Y = 78;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 90, 41);
      doc.text('2. RECOMMENDED SYSTEM SPECIFICATIONS', 18, sec2Y);

      const specs = [
        { label: 'Recommended System Size', value: `${calculation.recommendedKwp} kWp` },
        { label: 'Est. Monthly Solar Generation', value: `${calculation.monthlySolarGenKwh.toLocaleString()} kWh` },
        { label: 'Est. Monthly Savings', value: `PHP ${calculation.monthlySavings.toLocaleString()}` },
        { label: 'Est. Annual Savings', value: `PHP ${calculation.annualSavings.toLocaleString()}` },
        { label: 'Estimated Payback Period', value: calculation.roiLabel },
      ];

      let currentY = sec2Y + 5;
      specs.forEach((item) => {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(18, currentY, 192, currentY);

        currentY += 5.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        doc.text(item.label, 23, currentY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(item.value, 192, currentY, { align: 'right' });

        currentY += 3;
      });
      doc.line(18, currentY, 192, currentY);

      // 5. Section 3: REPRESENTATIVE LOAD CAPABILITIES
      const sec3Y = currentY + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 90, 41);
      doc.text('3. REPRESENTATIVE LOAD CAPABILITIES', 18, sec3Y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        'Based on your recommended system configuration, here are the daytime operational loads powered by solar energy:',
        18,
        sec3Y + 5
      );

      const boxY = sec3Y + 9;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(18, boxY, 174, 38, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(18, boxY, 174, 38, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 90, 41);
      doc.text('Daytime Operations (Direct Solar Power)', 23, boxY + 7);

      const col1 = [
        '• Inverter Aircon (1 HP): 750 W',
        '• Refrigerator: 150 W',
        '• Laptop + Monitor: 80 W',
        '• Electric Fan: 55 W',
      ];
      const col2 = [
        '• Television (55" LED): 100 W',
        '• Washing Machine: 500 W',
        '• Microwave Oven: 1,000 W',
        '• Induction Cooker: 1,500 W',
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      col1.forEach((text, i) => {
        doc.text(text, 23, boxY + 14 + i * 6);
      });
      col2.forEach((text, i) => {
        doc.text(text, 110, boxY + 14 + i * 6);
      });

      // 6. Footer Divider & Contact Info
      const footerY = boxY + 48;
      doc.setDrawColor(15, 90, 41);
      doc.setLineWidth(0.6);
      doc.line(18, footerY, 192, footerY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 90, 41);
      doc.text('CONTACT OUR ENGINEERING DESK TO GET A DETAILED PROPOSAL', 18, footerY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Email: engineering@solareign.ph  |  Phone: 0908 145 4906  |  Web: www.solareignsolarpower.com', 18, footerY + 10);

      // Download actual PDF file
      doc.save(`Solareign_Solar_Power_Services_Report_${monthlyBill}PHP_${calculation.recommendedKwp}kWp.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  return (
    <section id="solar-calculator-section" className="py-20 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
            <span className="w-2.5 h-2.5 bg-[#88D628] shrink-0 inline-block" aria-hidden="true" />
            <span>TECHNICAL SIMULATION FOR ROOF SYSTEM ASSETS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F5A29] tracking-tight leading-tight">
            Solar ROI &amp; Capacity Calculator
          </h2>

          <p className="text-base sm:text-lg font-normal text-slate-600 leading-relaxed">
            Compute your recommended setup size, customized asset budgets, and appliance capability vectors under direct solar harvesting.
          </p>
        </div>

        {/* Main Calculator Card with Split Left & Right Architecture */}
        <div className="border-2 border-[#88D628]/40 rounded-3xl bg-white overflow-hidden shadow-2xl shadow-slate-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Panel: Parameter Configuration (Dark Green Sidebar) */}
            <div className="lg:col-span-4 bg-[#061D0F] text-white p-6 sm:p-8 lg:p-9 flex flex-col justify-between text-left border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#88D628] font-mono">
                    SETUP CALCULATOR
                  </span>
                  <h3 className="text-[21px] font-black tracking-tight text-white uppercase mt-1 leading-snug">
                    PARAMETER CONFIGURATION
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    Define your parameters to generate a custom system sizing report. This interface operates solely via precise manual numeric inputs.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Input 1: Monthly Electric Bill */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                      MONTHLY ELECTRIC BILL (PHP)
                    </label>
                    <div className="relative rounded-xl bg-[#031308] border border-white/20 focus-within:border-[#88D628] focus-within:ring-1 focus-within:ring-[#88D628] flex items-center px-4 py-3 transition-all">
                      <span className="text-[#88D628] font-bold font-mono text-base mr-2 select-none">
                        ₱
                      </span>
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(Number(e.target.value) || 0)}
                        className="w-full bg-transparent text-white font-mono font-bold text-base outline-none placeholder:text-slate-600"
                        placeholder="12000"
                      />
                    </div>
                  </div>

                  {/* Input 2: Price Per kWh */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                      PRICE PER KWH (PHP)
                    </label>
                    <div className="relative rounded-xl bg-[#031308] border border-white/20 focus-within:border-[#88D628] focus-within:ring-1 focus-within:ring-[#88D628] flex items-center px-4 py-3 transition-all">
                      <span className="text-[#88D628] font-bold font-mono text-base mr-2 select-none">
                        ₱
                      </span>
                      <input
                        type="number"
                        min="5"
                        max="30"
                        step="0.5"
                        value={pricePerKwh}
                        onChange={(e) => setPricePerKwh(Number(e.target.value) || 0)}
                        className="w-full bg-transparent text-white font-mono font-bold text-base outline-none placeholder:text-slate-600"
                        placeholder="15"
                      />
                    </div>
                  </div>

                  {/* Calculate Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      // Triggers re-computation and smooth scroll highlight
                      const targetEl = document.getElementById('calculator-results-panel');
                      if (targetEl && window.innerWidth < 1024) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full mt-2 py-3.5 px-5 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] font-black text-xs sm:text-sm tracking-widest uppercase transition-colors duration-150 cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>CALCULATE MY SETUP</span>
                  </button>
                </div>
              </div>

              {/* Version & System Tag Footer */}
              <div className="pt-8 border-t border-white/10 mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#88D628] font-mono">
                  SOLAREIGN SOLAR POWER SERVICES
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                  SYSTEM SIZING &amp; INVESTMENT MODEL V2.4
                </p>
              </div>
            </div>

            {/* Right Panel: Dynamic Load Support Analysis & ROI Payback */}
            <div id="calculator-results-panel" className="lg:col-span-8 p-6 sm:p-8 lg:p-9 flex flex-col justify-between bg-white text-left">
              {/* Subheader */}
              <div className="shrink-0 mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0F5A29] font-mono block">
                  DYNAMIC LOAD SUPPORT ANALYSIS &amp; GRID CAPABILITIES
                </span>
              </div>

              {/* Stacked Content: Daytime Operations & Calculated ROI */}
              <div className="flex flex-col gap-5 sm:gap-6">
                
                {/* 1. Daytime Operations Card */}
                <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-5 sm:p-6 lg:p-7 shadow-xs">
                  {/* Box Title with Lightning Icon */}
                  <div className="flex items-center gap-2.5 text-sm sm:text-base font-black text-[#0F172A] tracking-tight shrink-0 mb-4">
                    <Zap className="w-5 h-5 text-[#88D628] fill-current" />
                    <span>DAYTIME OPERATIONS (DIRECT SOLAR POWER)</span>
                  </div>

                  {/* 2-Column Appliances Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {APPLIANCES.map((appliance, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 sm:py-3.5 flex items-center justify-between shadow-2xs hover:border-[#88D628] transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">
                          {appliance.name}
                        </span>
                        <span className="text-xs sm:text-sm font-black font-mono text-[#0F172A] ml-2 shrink-0">
                          {appliance.wattage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Bottom ROI Card */}
                <div className="rounded-3xl bg-[#061D0F] border border-white/10 text-white p-5 sm:p-6 lg:p-7 shadow-sm">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#88D628] font-mono block">
                      CALCULATED ROI PAYBACK TIMELINE
                    </span>

                    <div className="flex items-center gap-3.5 flex-wrap mt-1">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono tracking-tight">
                        {calculation.roiLabel}
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black font-mono tracking-wider bg-[#88D628] text-[#0F5A29] uppercase shadow-xs">
                        {calculation.isRapid ? 'RAPID ROI' : 'OPTIMIZED ROI'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-mono text-[#88D628] font-bold mt-1 tracking-wide">
                      EST. BILL SAVINGS OFFSETS: ₱{calculation.monthlySavings.toLocaleString()} / MONTH
                    </p>
                  </div>

                  {/* Action Buttons - Placed side-by-side underneath */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={handleCopyResults}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] font-black text-xs font-mono tracking-wider uppercase transition-colors duration-150 cursor-pointer shadow-xs"
                    >
                      {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY RESULTS TO CLIPBOARD'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-[#0F172A] font-bold text-xs font-mono tracking-wider uppercase transition-colors duration-150 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD PDF REPORT</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
