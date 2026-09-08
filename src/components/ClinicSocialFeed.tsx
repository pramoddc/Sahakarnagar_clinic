import React, { useState } from 'react';
import {
  Instagram,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ExternalLink,
  Laptop,
  ShieldCheck,
  Activity,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Play
} from 'lucide-react';

export interface SocialPost {
  id: string;
  category: 'ergonomics' | 'seniors' | 'rehab' | 'quick-tips';
  categoryLabel: string;
  type: 'carousel' | 'reel' | 'guide';
  thumbnailTheme: 'teal' | 'amber' | 'blue' | 'emerald';
  title: string;
  subtitle: string;
  authorName: string;
  authorRole: string;
  timeAgo: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  hookCaption: string;
  fullTipContent: {
    problemStatement: string;
    clinicalExplanation: string;
    actionSteps: string[];
    dos: string[];
    donts: string[];
    clinicRecommendation: string;
  };
  tags: string[];
}

const SAMPLE_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    category: 'ergonomics',
    categoryLabel: 'Desk Ergonomics',
    type: 'guide',
    thumbnailTheme: 'teal',
    title: 'The "90-90-90" Seating Rule for Manyata IT Techies',
    subtitle: 'Preventing lower back compression after 6+ hours of coding',
    authorName: 'Dr. Aditi Rao (MPT)',
    authorRole: 'Lead Orthopedic PT',
    timeAgo: '4 hours ago',
    likesCount: 142,
    commentsCount: 19,
    hookCaption: 'Working long hours in Manyata Tech Park or remote setups in Sahakarnagar? If your knees are tucked under your chair, your lumbar spine is bearing 140% more load.',
    fullTipContent: {
      problemStatement: 'Prolonged sitting with hips below knees shifts gravitational load onto L4-L5 discs, triggering posterior pelvic tilt and sciatica tension.',
      clinicalExplanation: 'The 90-90-90 posture ensures your elbows, hips, and knees each rest at neutral 90-degree angles. This distributes torso weight into your sit-bones and backrest rather than your spinal discs.',
      actionSteps: [
        'Raise your office chair so your elbows align with table height without shoulder elevation.',
        'Place feet flat on the floor; if your heels dangle, insert a ₹500 footrest or thick book.',
        'Pull your monitor to arm\'s length—the top third of the display must align with your natural eye horizon.',
        'Set a 45-minute chime for a 60-second standing spinal decompression stretch.'
      ],
      dos: [
        'Use an external keyboard and mouse when working on a laptop.',
        'Keep your lower back flush against the lumbar contour of your chair.'
      ],
      donts: [
        'Do not cross your legs or sit on one foot during focused work.',
        'Avoid leaning forward into the screen ("turtle necking").'
      ],
      clinicRecommendation: 'If lumbar stiffness radiates into the glute or hamstring, book an in-clinic spinal manual therapy assessment at our 60 Feet Road clinic.'
    },
    tags: ['#TechieSpine', '#ManyataTechPark', '#ErgonomicsBangalore', '#SahakarPhysio']
  },
  {
    id: 'post-2',
    category: 'seniors',
    categoryLabel: 'Elder Fall Safety',
    type: 'carousel',
    thumbnailTheme: 'amber',
    title: '3 Bathroom Hazard Checks for Seniors Living in Apartments',
    subtitle: '78% of elder falls occur between bedroom and wet tiled bathrooms',
    authorName: 'Dr. Vikram Sen (BPT)',
    authorRole: 'Mobile Geriatric Specialist',
    timeAgo: 'Yesterday',
    likesCount: 215,
    commentsCount: 34,
    hookCaption: 'Elderly parents living in Sahakarnagar and Judicial Layout apartments often hesitate to report near-slips. Here is our 5-minute home hazard audit checklist.',
    fullTipContent: {
      problemStatement: 'Wet vitrified ceramic tiles combined with diminished proprioception and reduced quadriceps power account for the vast majority of senior hip fractures.',
      clinicalExplanation: 'Aging reduces plantar tactile sensitivity and dynamic balance reflex speeds. Slippery thresholds and dim night pathways leave zero margin for postural recovery.',
      actionSteps: [
        'Install textured 32mm stainless steel grab bars anchored into wall studs next to the western commode and shower stall.',
        'Replace standard bathroom floor mats with perforated, suction-backed rubber drainage mats.',
        'Install plug-in warm LED motion-sensor nightlights along the hallway from the master bedroom to the bathroom.',
        'Practice daily Sit-to-Stand drills: 10 unassisted chair rises before morning tea to maintain knee extensor strength.'
      ],
      dos: [
        'Wear closed-heel, non-skid rubber soled slippers indoors.',
        'Keep bathroom doors opening outward or sliding so they cannot be blocked if a fall occurs.'
      ],
      donts: [
        'Never rely on towel rods or plastic soap holders to steady balance—they shear off under weight.',
        'Never walk across recently mopped tile floors before they are completely dry.'
      ],
      clinicRecommendation: 'Request a Doorstep Geriatric Home Assessment with Timed Up & Go (TUG) testing for your parents anywhere in Sahakarnagar, Hebbal, or Kodigehalli.'
    },
    tags: ['#SeniorCareBangalore', '#FallPrevention', '#ElderMobility', '#HomePhysio']
  },
  {
    id: 'post-3',
    category: 'ergonomics',
    categoryLabel: 'Tech Neck Relief',
    type: 'reel',
    thumbnailTheme: 'blue',
    title: 'The "Chin Tuck" Exercise to Undo Forward Head Posture',
    subtitle: 'Every inch your neck juts forward adds 10 lbs of tension to your upper trapezius',
    authorName: 'Dr. Aditi Rao (MPT)',
    authorRole: 'Lead Orthopedic PT',
    timeAgo: '2 days ago',
    likesCount: 389,
    commentsCount: 52,
    hookCaption: 'Staring at smartphone screens and multiple monitors tilts the head forward 45 degrees, making an adult head feel like it weighs 22 kg! Try this 10-second reset.',
    fullTipContent: {
      problemStatement: 'Upper Crossed Syndrome weakens deep cervical neck flexors while chronically tightening suboccipital muscles and upper trapezius cords.',
      clinicalExplanation: 'Chin tucks recruit longus colli and longus capitis muscles, retracting the cervical spine back over the thoracic cage to instantly relieve suboccipital tension headaches.',
      actionSteps: [
        'Sit upright with your spine supported. Look directly forward at eye level.',
        'Place two fingers gently on your chin as a guide.',
        'Glide your chin straight backward as if making a double chin (do not tilt head down).',
        'Hold the end-range stretch for 5 full seconds. Repeat 8 to 10 repetitions twice daily.'
      ],
      dos: [
        'Maintain relaxed shoulders; do not shrug upward while retracting the chin.',
        'Perform this at red lights or between Zoom meetings.'
      ],
      donts: [
        'Do not jerk your neck rapidly into extension.',
        'Stop if you feel shooting numbness or pins-and-needles down your arm.'
      ],
      clinicRecommendation: 'Persistent cervicogenic headaches or tingling down the thumb/fingers can indicate disc bulge. Consult our cervical manual therapy clinic.'
    },
    tags: ['#ChinTuck', '#PostureCorrection', '#CervicalPain', '#WFHHealth']
  },
  {
    id: 'post-4',
    category: 'rehab',
    categoryLabel: 'Post-Surgical Care',
    type: 'guide',
    thumbnailTheme: 'emerald',
    title: 'Week 2 vs. Week 6 After Total Knee Replacement (TKR)',
    subtitle: 'What your knee flexion angle and walking independence should look like',
    authorName: 'Dr. Aditi Rao (MPT)',
    authorRole: 'Lead Orthopedic PT',
    timeAgo: '4 days ago',
    likesCount: 178,
    commentsCount: 27,
    hookCaption: 'Undergoing knee replacement surgery at Aster CMI, Manipal Hebbal, or Baptist? Recovery is not about pushing through agonizing pain—it is about steady joint mobility.',
    fullTipContent: {
      problemStatement: 'Patients often either over-exercise into intense inflammatory flare-ups or become too cautious, leading to arthrofibrosis and scar tissue stiffness.',
      clinicalExplanation: 'Controlled range-of-motion combined with cryotherapy reduces synovial effusion, enabling early quadriceps activation without tearing capsular repairs.',
      actionSteps: [
        'Week 1–2: Focus on terminal knee extension (0 degrees flat) and gentle heel slides targeting 90 degrees flexion.',
        'Ice application: 15–20 minutes with a gel pack wrapped in a cotton towel after every active exercise session.',
        'Week 3–4: Transition from two-point walker to single elbow crutch or stick inside the home.',
        'Week 5–6: Target 110–120 degrees flexion for comfortable stair ascent and normal car ingress.'
      ],
      dos: [
        'Perform ankle pumps every hour while resting in bed to prevent deep vein thrombosis (DVT).',
        'Keep the leg elevated above heart level when icing to drain postoperative swelling.'
      ],
      donts: [
        'Never place a pillow directly under the knee while sleeping—always under the calf to preserve 0° straight extension.',
        'Avoid squatting or sitting cross-legged on the floor in the first 12 weeks.'
      ],
      clinicRecommendation: 'Our clinic works directly with North Bangalore orthopedic surgeons to provide continuous home and clinic TKR rehabilitation protocols.'
    },
    tags: ['#TKRRecovery', '#KneeRehab', '#AsterCMI', '#PostOpPhysio']
  },
  {
    id: 'post-5',
    category: 'quick-tips',
    categoryLabel: 'Daily Mobility',
    type: 'carousel',
    thumbnailTheme: 'teal',
    title: 'The 3-Minute Morning Spinal Mobility Routine',
    subtitle: '3 bed-friendly movements before taking your first step in the morning',
    authorName: 'Dr. Vikram Sen (BPT)',
    authorRole: 'Mobile Geriatric Specialist',
    timeAgo: '5 days ago',
    likesCount: 294,
    commentsCount: 41,
    hookCaption: 'Waking up with a stiff lower back? Overnight, intervertebral discs hydrate and expand. Sudden twisting right out of bed can cause muscle spasms. Do this first.',
    fullTipContent: {
      problemStatement: 'Morning disc pressure is highest right after waking. Cold muscles combined with sudden weight-bearing can trigger acute facet joint irritation.',
      clinicalExplanation: 'Low-load rhythmic mobilization warms synovial fluid in spinal facets and gently activates transverse abdominis and pelvic floor muscles.',
      actionSteps: [
        'Pelvic Tilts: Lie on back with knees bent. Gently flatten your lower back into the mattress, hold 3 seconds, then arch slightly. (10 reps)',
        'Knee-to-Chest Hug: Bring one knee toward chest with hands behind thigh. Alternate sides smoothly. (8 reps per side)',
        'Log Roll Exit: Roll onto your side as a single unit, drop legs over bed edge, and use your arms to push torso upright.'
      ],
      dos: [
        'Take slow, steady breaths throughout the morning movements.',
        'Drink a glass of warm water before morning activities to aid muscle hydration.'
      ],
      donts: [
        'Do not jump straight out of bed from a flat back posture (avoid sit-up motions).',
        'Avoid heavy bending forward to pick up items within 30 minutes of waking.'
      ],
      clinicRecommendation: 'Learn tailored home exercises customized for your spine through our Patient Portal HEP library.'
    },
    tags: ['#MorningStiffness', '#BackPainRelief', '#SpineHealth', '#HealthyHabits']
  },
  {
    id: 'post-6',
    category: 'seniors',
    categoryLabel: 'Balance Retraining',
    type: 'reel',
    thumbnailTheme: 'amber',
    title: 'The "Tandem Stance" Balance Challenge for 60+ Seniors',
    subtitle: 'Can you hold heel-to-toe balance for 10 seconds with eyes open?',
    authorName: 'Dr. Vikram Sen (BPT)',
    authorRole: 'Mobile Geriatric Specialist',
    timeAgo: 'Last week',
    likesCount: 167,
    commentsCount: 23,
    hookCaption: 'Balance is a skill like cycling—if you do not challenge it, neuromuscular pathways degrade. Here is a safe, kitchen-counter balance test for seniors.',
    fullTipContent: {
      problemStatement: 'Age-related loss of vestibular reflex and lower-leg muscle spindle sensitivity impairs rapid postural correction when tripping.',
      clinicalExplanation: 'Tandem stance (heel of one foot directly touching toes of the other) narrows the base of support, forcing ankle stabilisers and hip abductors to activate.',
      actionSteps: [
        'Stand beside a sturdy kitchen counter or heavy dining table for support.',
        'Place your right foot directly in front of your left foot in a straight line.',
        'Hover your hands 1 inch above the counter (ready to grab if unsteady).',
        'Aim to hold position for 10 seconds. Switch foot positions and repeat.'
      ],
      dos: [
        'Always practice with a firm surface within easy reach.',
        'Focus your gaze on a stationary point on the wall at eye level.'
      ],
      donts: [
        'Never practice this exercise in an open room with nothing to hold onto.',
        'Do not close your eyes unless supervised directly by your physiotherapist.'
      ],
      clinicRecommendation: 'Seniors who find tandem stance difficult should undergo a full Berg Balance Assessment to prevent avoidable falls.'
    },
    tags: ['#BalanceTraining', '#SeniorFitness', '#ActiveAging', '#SahakarPhysio']
  }
];

interface ClinicSocialFeedProps {
  onBookConsultation?: () => void;
  onNavigateToPortal?: () => void;
}

export const ClinicSocialFeed: React.FC<ClinicSocialFeedProps> = ({
  onBookConsultation,
  onNavigateToPortal
}) => {
  const [posts, setPosts] = useState<SocialPost[]>(SAMPLE_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePostModal, setActivePostModal] = useState<SocialPost | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'ergonomics', label: '💻 Ergonomics & Spine' },
    { id: 'seniors', label: '👴 Elder Fall Safety' },
    { id: 'rehab', label: '🦵 Joint & Post-Op Rehab' },
    { id: 'quick-tips', label: '⚡ Daily Mobility Tips' }
  ];

  const handleToggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  const handleToggleSave = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, isSaved: !p.isSaved };
        }
        return p;
      })
    );
  };

  const handleShare = (post: SocialPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setCopiedPostId(post.id);
    navigator.clipboard?.writeText(
      `https://instagram.com/sahakarphysio/p/${post.id} - ${post.title} | Sahakar Physio Bangalore`
    );
    setTimeout(() => {
      setCopiedPostId(null);
    }, 2500);
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const getThemeColors = (theme: SocialPost['thumbnailTheme']) => {
    switch (theme) {
      case 'teal':
        return {
          cardBg: 'bg-teal-900 text-white',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
          gradient: 'from-teal-800 to-teal-950',
          iconColor: 'text-teal-300'
        };
      case 'amber':
        return {
          cardBg: 'bg-stone-900 text-white',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          gradient: 'from-amber-950 via-stone-900 to-stone-950',
          iconColor: 'text-amber-400'
        };
      case 'blue':
        return {
          cardBg: 'bg-slate-900 text-white',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
          gradient: 'from-blue-950 via-slate-900 to-stone-950',
          iconColor: 'text-blue-300'
        };
      case 'emerald':
        return {
          cardBg: 'bg-emerald-950 text-white',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          gradient: 'from-emerald-900 to-stone-950',
          iconColor: 'text-emerald-300'
        };
      default:
        return {
          cardBg: 'bg-teal-900 text-white',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
          gradient: 'from-teal-900 to-stone-950',
          iconColor: 'text-teal-300'
        };
    }
  };

  return (
    <section id="clinic-social-feed" className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HEADER: INSTAGRAM BRAND & COMMUNITY OVERVIEW                           */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-teal-950 text-white border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            {/* Instagram Avatar with Gradient Ring */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-teal-400 shadow-sm flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-stone-950 flex flex-col items-center justify-center text-center p-1">
                  <Instagram className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />
                  <span className="text-[9px] font-black uppercase text-teal-300 tracking-tighter mt-0.5">
                    SP CARE
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-500 border-2 border-stone-950 flex items-center justify-center text-stone-950 shadow-xs">
                <ShieldCheck className="w-3 h-3" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center">
                  @sahakarphysio
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <ShieldCheck className="w-3 h-3 mr-1 text-teal-400" />
                  Verified Clinic Desk
                </span>
                <span className="hidden sm:inline-flex items-center text-xs text-stone-400">
                  Sahakarnagar, Bangalore
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                Daily health tips, desk ergonomic advice for Manyata IT professionals, and senior fall-safety tutorials curated by <strong>Dr. Aditi Rao (MPT)</strong> and our clinical physiotherapist team.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-stone-300">
                <div>
                  <strong className="text-white font-black">248</strong>{' '}
                  <span className="text-stone-400">Clinical Posts</span>
                </div>
                <div>
                  <strong className="text-white font-black">2.4k</strong>{' '}
                  <span className="text-stone-400">Patients & Followers</span>
                </div>
                <div className="text-amber-300 font-bold flex items-center">
                  <span>★ 4.9 Rating</span>
                  <span className="text-stone-400 font-normal ml-1">(Google & Practo)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Follow CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              id="btn-instagram-follow"
              className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-95 active:scale-[0.99] text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>

            {onBookConsultation && (
              <button
                onClick={onBookConsultation}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-teal-800/80 hover:bg-teal-700 active:scale-[0.99] text-teal-100 font-bold text-xs sm:text-sm border border-teal-700/60 transition-all flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
              >
                <span>Ask Doctor a Question</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CATEGORY FILTER TABS (TOUCH-OPTIMIZED HORIZONTAL SCROLL)              */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center space-x-2 min-w-max">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
            <span>Topics:</span>
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer touch-manipulation active:scale-[0.98] ${
                selectedCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 dark:text-stone-400 hidden md:inline font-medium">
          Showing {filteredPosts.length} clinical tips
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 3. RESPONSIVE SOCIAL MEDIA POST CARDS GRID                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map(post => {
          const theme = getThemeColors(post.thumbnailTheme);
          return (
            <div
              key={post.id}
              id={`social-post-${post.id}`}
              onClick={() => setActivePostModal(post)}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-teal-400/60 dark:hover:border-teal-600 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group touch-manipulation"
            >
              <div>
                {/* Visual Thumbnail Card Header */}
                <div className={`p-5 bg-gradient-to-br ${theme.gradient} text-white relative min-h-[160px] flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.badge}`}>
                      {post.category === 'ergonomics' && <Laptop className="w-3 h-3 mr-1" />}
                      {post.category === 'seniors' && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {post.category === 'rehab' && <Activity className="w-3 h-3 mr-1" />}
                      {post.category === 'quick-tips' && <Sparkles className="w-3 h-3 mr-1" />}
                      {post.categoryLabel}
                    </span>

                    <div className="flex items-center space-x-1 text-[11px] font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md text-stone-200">
                      {post.type === 'reel' ? (
                        <>
                          <Play className="w-3 h-3 fill-current text-teal-300" />
                          <span>Video Reel</span>
                        </>
                      ) : (
                        <span>Carousel Guide</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-teal-200 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                      {post.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-white/10">
                    <div className="flex items-center space-x-1.5 text-stone-300">
                      <div className="w-4 h-4 rounded-full bg-teal-500 text-stone-950 flex items-center justify-center font-bold text-[9px]">
                        PT
                      </div>
                      <span>{post.authorName}</span>
                    </div>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.timeAgo}
                    </span>
                  </div>
                </div>

                {/* Caption Hook & Tags */}
                <div className="p-4 sm:p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed line-clamp-3">
                    {post.hookCaption}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar (Like, Comment, Share, Read Full Advice) */}
              <div className="px-4 sm:px-5 py-3 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleToggleLike(post.id, e)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer touch-manipulation"
                    title="Like Post"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        post.isLiked
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-stone-400 hover:text-rose-500'
                      }`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Comments Info */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePostModal(post);
                    }}
                    className="flex items-center space-x-1 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </button>

                  {/* Share Link */}
                  <button
                    onClick={(e) => handleShare(post, e)}
                    className="text-stone-500 dark:text-stone-400 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer touch-manipulation"
                    title="Copy Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Save Bookmark */}
                  <button
                    onClick={(e) => handleToggleSave(post.id, e)}
                    className="text-stone-500 dark:text-stone-400 hover:text-amber-500 cursor-pointer touch-manipulation"
                    title="Save Tip"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        post.isSaved ? 'fill-amber-500 text-amber-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Read Full Tip CTA */}
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center group-hover:translate-x-1 transition-transform">
                  <span>Read Tip</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Toast Notification */}
      {copiedPostId && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-stone-900 text-white border border-teal-500/40 shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Instagram health tip link copied to clipboard!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: FULL CLINICAL ADVICE & PHYSIO RECOMMENDATIONS                   */}
      {/* ========================================================================= */}
      {activePostModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 dark:border-stone-800 shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-900 to-teal-950 text-white sticky top-0 z-10 flex items-start justify-between border-b border-stone-800">
              <div className="pr-4">
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    {activePostModal.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-400">
                    Curated by {activePostModal.authorName} ({activePostModal.authorRole})
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {activePostModal.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  {activePostModal.subtitle}
                </p>
              </div>

              <button
                onClick={() => setActivePostModal(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer touch-manipulation shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 sm:p-6 space-y-6 text-stone-800 dark:text-stone-200 text-xs sm:text-sm">
              {/* Problem Breakdown Card */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Clinical Problem
                </h4>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {activePostModal.fullTipContent.problemStatement}
                </p>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed pt-1">
                  {activePostModal.fullTipContent.clinicalExplanation}
                </p>
              </div>

              {/* Actionable Step-by-Step Protocol */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                  Actionable Steps to Practice Today:
                </h4>
                <div className="space-y-2">
                  {activePostModal.fullTipContent.actionSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 flex items-start space-x-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Do's & Don'ts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 space-y-2">
                  <h5 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider flex items-center">
                    ✓ Recommended Habits (Do)
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                    {activePostModal.fullTipContent.dos.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-emerald-600 dark:text-emerald-400 mr-1.5 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800/60 space-y-2">
                  <h5 className="font-bold text-rose-900 dark:text-rose-300 text-xs uppercase tracking-wider flex items-center">
                    ✕ Common Mistakes (Don't)
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                    {activePostModal.fullTipContent.donts.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-rose-600 dark:text-rose-400 mr-1.5 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* When to Seek Clinical Attention */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-xs space-y-1.5">
                <span className="font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider text-[11px] block">
                  When to Consult Sahakar Physio:
                </span>
                <p className="text-teal-800 dark:text-teal-300 leading-relaxed">
                  {activePostModal.fullTipContent.clinicRecommendation}
                </p>
              </div>

              {/* Tags and Stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500">
                <div className="flex flex-wrap gap-1.5">
                  {activePostModal.tags.map((t, idx) => (
                    <span key={idx} className="font-medium text-stone-600 dark:text-stone-400">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    ❤️ {activePostModal.likesCount} Likes
                  </span>
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    💬 {activePostModal.commentsCount} Comments
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Follow <strong className="text-stone-800 dark:text-stone-200">@sahakarphysio</strong> for weekly rehabilitation videos.
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-900 dark:text-stone-100 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer touch-manipulation"
                >
                  <Instagram className="w-4 h-4" />
                  <span>View on Instagram</span>
                </a>

                {onBookConsultation && (
                  <button
                    onClick={() => {
                      setActivePostModal(null);
                      onBookConsultation();
                    }}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-black text-xs flex items-center justify-center space-x-1.5 cursor-pointer touch-manipulation"
                  >
                    <span>Book Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
