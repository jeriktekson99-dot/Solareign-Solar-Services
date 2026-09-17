import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'HOW LONG DOES INSTALLATION TAKE?',
    answer:
      'Physical installation for typical residential setups takes between 1 to 3 days, with roof rails, panels, and inverters mounted and wired. Commercial setups take 1 to 3 weeks depending on facility scale. Utility Net Metering energization typically follows within 3 to 4 weeks.',
  },
  {
    id: 'faq-2',
    question: 'WHAT HAPPENS DURING CLOUDY DAYS OR TYPHOONS?',
    answer:
      'Our high-efficiency solar panels continue to harvest energy under cloudy conditions. For power outages or stormy weather, our battery storage systems seamlessly supply backup power.',
  },
  {
    id: 'faq-3',
    question: 'HOW DOES NET METERING SAVE ME MONEY?',
    answer:
      'Net metering allows you to export excess solar energy back to the grid during peak daytime production. Your utility credits this surplus against your night and cloudy-day consumption, significantly reducing your monthly electricity bills.',
  },
  {
    id: 'faq-4',
    question: 'WILL THE ROOF INSTALLATION CAUSE LEAKS?',
    answer:
      'No. We utilize heavy-duty commercial flashing, UV-stabilized EPDM rubber compression gaskets, and high-grade structural polyurethane sealants on all penetrations to ensure complete, leak-free waterproofing backed by our structural warranty.',
  },
  {
    id: 'faq-5',
    question: 'WHAT IS THE LIFESPAN OF THE SOLAR SYSTEM?',
    answer:
      'Our Tier-1 solar panels carry a 25 to 30-year linear performance warranty. Inverters typically provide 5 to 10 years of standard warranty, while Lithium Iron Phosphate (LiFePO4) storage batteries deliver over 6,000 deep discharge cycles.',
  },
];

export default function FAQSection() {
  // Default to all closed (none automatically open)
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Structured Subtitle + Main Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-16 space-y-3">
          {/* Subtitle / Eyebrow with Solid Square Indicator */}
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
            <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          {/* Main Display Headline matching reference image */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="text-[#0F172A]">Got Questions? </span>
            <span className="text-[#0F5A29]">We Have Answers.</span>
          </h2>
        </div>

        {/* Accordion List matching the reference image structure */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                id={`faq-card-${index + 1}`}
                className={`rounded-2xl transition-all duration-200 border bg-white overflow-hidden ${
                  isOpen
                    ? 'border-slate-300 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Accordion Header Button */}
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer group select-none"
                >
                  <span
                    className={`font-black text-sm sm:text-base tracking-wide uppercase transition-colors ${
                      isOpen
                        ? 'text-[#0F5A29]'
                        : 'text-[#0F172A] group-hover:text-[#0F5A29]'
                    }`}
                  >
                    {item.question}
                  </span>

                  {/* Icon Box on the Right matching the reference placement */}
                  <span
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                      isOpen
                        ? 'bg-white text-[#0F5A29] border-slate-200 shadow-2xs'
                        : 'bg-white text-slate-400 border-slate-200 group-hover:text-[#0F5A29] group-hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#0F5A29]' : 'rotate-0 text-slate-400'
                      }`}
                    />
                  </span>
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      {/* Crisp divider line separating header from the answer body */}
                      <div className="border-t border-slate-100 px-6 py-6 sm:px-8 sm:py-7">
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
