import { Star } from 'lucide-react';

interface ClientReview {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatar: string;
  rating: number;
}

const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'review-1',
    name: 'Julian De Castro',
    role: 'Homeowner',
    location: 'IMUS, CAVITE',
    quote:
      'We were skeptical about solar yielding actual savings in high-temp months. Solareign proved us wrong: Our household energy bills dropped by 64% from month one! The certified crew was exceptionally fast, neat, and highly professional.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    id: 'review-2',
    name: 'Victoria Morente',
    role: 'Homeowner & Environmentalist',
    location: 'DASMARIÑAS, CAVITE',
    quote:
      'The net metering installation was completely smooth. We went from paying skyrocketed monthly bills to receiving energy credits from our provider. Deciding to go off-grid during power cuts with their battery reserve was the best decision.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    id: 'review-3',
    name: 'Marcus Vance',
    role: 'Homeowner',
    location: 'BACOOR, CAVITE',
    quote:
      'Solareign provided absolute clarity during the technical site audit. Their detailed engineering blueprints and honest ROI projection made execution straightforward. Our residential array now offsets 100% of our midday household loads.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-slate-100 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Centered Flow Following Reference Layout */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
            <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
            <span>OUR CLIENT ENDORSEMENTS</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className="text-[#0F172A]">Let Our Savings </span>
            <span className="text-[#0F5A29]">Do the Talking</span>
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            We monitor home energy accounts live. Read verified statements from industrial partners and private homeowners alike who made the Solareign switch.
          </p>
        </div>

        {/* 3-Column Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CLIENT_REVIEWS.map((review, index) => (
            <div
              key={review.id}
              id={`client-review-${index + 1}`}
              className="group relative p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left shadow-xs"
            >
              {/* Card Body: Stars & Quote */}
              <div className="space-y-5">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#88D628] text-[#88D628]"
                    />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed font-normal">
                  "{review.quote}"
                </p>
              </div>

              {/* Card Footer: Client Info & Avatar with Divider */}
              <div className="pt-6 mt-8 border-t border-slate-100 flex items-center gap-3.5">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 group-hover:border-slate-300 transition-colors flex-shrink-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#0F5A29] transition-colors">
                    {review.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-tight">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
