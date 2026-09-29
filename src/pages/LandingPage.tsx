// import { type ReactNode, useState } from "react";
// import { Link } from "react-router-dom";
// import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// import {
//   AlertTriangleIcon,
//   ArrowRightIcon,
//   BadgeCheckIcon,
//   BriefcaseBusinessIcon,
//   CalendarDaysIcon,
//   CheckCircle2Icon,
//   CircleCheckBigIcon,
//   Clock3Icon,
//   FileTextIcon,
//   HammerIcon,
//   HardHatIcon,
//   LayoutDashboardIcon,
//   MapPinIcon,
//   MessageSquareIcon,
//   PaintbrushIcon,
//   SearchIcon,
//   SendIcon,
//   StarIcon,
//   TruckIcon,
//   UserPlusIcon,
//   UsersIcon,
//   WrenchIcon,
//   ZapIcon,
//   type LucideIcon,
// } from "lucide-react";

// import assets from "@/assets/assets";
// import { useAuth } from "@/auth/useAuth";

// import SiteFooter from "@/components/SiteFooter";
// import SiteHeader from "@/components/SiteHeader";
// import { Button } from "@/components/ui/button";

// /* =========================================================
//    BRAND
// ========================================================= */

// const lime = "#DEDA00";
// const green = "#38D200";
// const amber = "#F0A23A";
// const red = "#AD3A12";

// const primaryButton = [
//   "bg-[#303030] text-[#DEDA00]",
//   "hover:bg-[#202020] hover:text-[#DEDA00]",
//   "dark:bg-[#DEDA00] dark:text-[#202020]",
//   "dark:hover:bg-[#d3cf00] dark:hover:text-[#202020]",
// ].join(" ");

// const outlineButton = [
//   "border-black/[0.14] bg-white text-[#303030]",
//   "hover:border-black/[0.22] hover:bg-[#f4f4f1] hover:text-[#303030]",
//   "dark:border-white/[0.11] dark:bg-white/[0.025] dark:text-white",
//   "dark:hover:border-white/[0.18] dark:hover:bg-white/[0.05]",
// ].join(" ");

// const previewPrimaryAction = [
//   "bg-[#303030] text-[#DEDA00]",
//   "dark:bg-[#DEDA00] dark:text-[#202020]",
// ].join(" ");

// /* =========================================================
//    STOCK AVATARS

//    Temporary Pexels photography.
//    Replace with owned / real Allocat profile media later.
// ========================================================= */

// type AvatarKey = "tawanda" | "leroy" | "kuda" | "tatenda";

// const profileAvatars: Record<AvatarKey, string> = {
//   tawanda:
//     "https://images.pexels.com/photos/34592823/pexels-photo-34592823.jpeg?auto=compress&cs=tinysrgb&w=320",
//   leroy:
//     "https://images.pexels.com/photos/20595361/pexels-photo-20595361/free-photo-of-portrait-of-a-man-smiling.jpeg?auto=compress&cs=tinysrgb&w=320",
//   kuda:
//     "https://images.pexels.com/photos/18744477/pexels-photo-18744477/free-photo-of-portrait-of-an-african-man.jpeg?auto=compress&cs=tinysrgb&w=320",
//   tatenda:
//     "https://images.pexels.com/photos/19379640/pexels-photo-19379640.jpeg?auto=compress&cs=tinysrgb&w=320",
// };

// /* =========================================================
//    DATA
// ========================================================= */

// const journeySteps = [
//   {
//     number: "01",
//     label: "Brief",
//     title: "Define the project.",
//     description: "Set the project information, schedule, priority and skills required.",
//     icon: FileTextIcon,
//   },
//   {
//     number: "02",
//     label: "Allocate",
//     title: "Find the right Allocats.",
//     description: "Discover professionals using the skills already attached to the project.",
//     icon: UserPlusIcon,
//   },
//   {
//     number: "03",
//     label: "Work",
//     title: "Run the project.",
//     description: "Move tasks through Pending, Active, Complete and Overdue states.",
//     icon: LayoutDashboardIcon,
//   },
//   {
//     number: "04",
//     label: "Review",
//     title: "Close it properly.",
//     description: "Finished work is submitted to the client for completion confirmation.",
//     icon: CircleCheckBigIcon,
//   },
// ];

// const allocationRoles = [
//   {
//     icon: ZapIcon,
//     role: "Electrical",
//     person: "Tawanda M.",
//     avatar: "tawanda" as AvatarKey,
//     title: "Electrical specialist",
//     experience: "8 years experience",
//     accent: amber,
//     surface: "bg-[#F0A23A]/[0.10]",
//     rotation: -6,
//   },
//   {
//     icon: HammerIcon,
//     role: "Carpentry",
//     person: "Leroy N.",
//     avatar: "leroy" as AvatarKey,
//     title: "Carpenter & joiner",
//     experience: "6 years experience",
//     accent: lime,
//     surface: "bg-[#DEDA00]/[0.12]",
//     rotation: -2,
//   },
//   {
//     icon: PaintbrushIcon,
//     role: "Painting",
//     person: "Kuda M.",
//     avatar: "kuda" as AvatarKey,
//     title: "Painter & finisher",
//     experience: "5 years experience",
//     accent: green,
//     surface: "bg-[#38D200]/[0.09]",
//     rotation: 3,
//   },
//   {
//     icon: HardHatIcon,
//     role: "Construction",
//     person: "Tatenda R.",
//     avatar: "tatenda" as AvatarKey,
//     title: "Construction specialist",
//     experience: "7 years experience",
//     accent: "#D1D1D1",
//     surface: "bg-black/[0.055] dark:bg-white/[0.055]",
//     rotation: 7,
//   },
// ];

// const workCategories = [
//   {
//     icon: ZapIcon,
//     title: "Electrical",
//     detail: "Wiring · lighting · installations · fault finding",
//     accent: "text-[#986000] dark:text-[#F0A23A]",
//     surface: "bg-[#F0A23A]/[0.11]",
//     glow: "bg-[#F0A23A]/[0.16]",
//   },
//   {
//     icon: HammerIcon,
//     title: "Carpentry & joinery",
//     detail: "Cabinetry · furniture · fittings · repairs",
//     accent: "text-[#666400] dark:text-[#DEDA00]",
//     surface: "bg-[#DEDA00]/[0.13]",
//     glow: "bg-[#DEDA00]/[0.15]",
//   },
//   {
//     icon: HardHatIcon,
//     title: "Construction",
//     detail: "Building · renovations · tiling · structural work",
//     accent: "text-[#4c4c47] dark:text-white/70",
//     surface: "bg-black/[0.055] dark:bg-white/[0.055]",
//     glow: "bg-black/[0.07] dark:bg-white/[0.07]",
//   },
//   {
//     icon: PaintbrushIcon,
//     title: "Painting & finishing",
//     detail: "Painting · decorating · preparation · finishing",
//     accent: "text-[#986000] dark:text-[#F0A23A]",
//     surface: "bg-[#F0A23A]/[0.11]",
//     glow: "bg-[#F0A23A]/[0.16]",
//   },
//   {
//     icon: WrenchIcon,
//     title: "Repairs & maintenance",
//     detail: "Property repairs · installations · general maintenance",
//     accent: "text-[#247c08] dark:text-[#38D200]",
//     surface: "bg-[#38D200]/[0.10]",
//     glow: "bg-[#38D200]/[0.13]",
//   },
//   {
//     icon: TruckIcon,
//     title: "Transport & delivery",
//     detail: "Moving · delivery · courier work · transport",
//     accent: "text-[#666400] dark:text-[#DEDA00]",
//     surface: "bg-[#DEDA00]/[0.13]",
//     glow: "bg-[#DEDA00]/[0.15]",
//   },
// ];

// /* =========================================================
//    PAGE
// ========================================================= */

// function LandingPage() {
//   const { user } = useAuth();

//   const postProjectHref = user ? "/projects/new" : "/register";
//   const allocatHref = user?.isAllocat ? "/projects" : "/become-an-allocat";
//   const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";

//   return (
//     <>
//       <SiteHeader />

//       <main className="min-w-0 overflow-x-hidden bg-[#f6f6f3] text-[#303030] transition-colors dark:bg-[#080808] dark:text-white">
//         <HeroSection postProjectHref={postProjectHref} />
//         <JourneySection />
//         <AllocationSection />
//         <ProjectLifecycleSection />
//         <WorkNetworkSection />
//         <WorkspaceSection />

//         <SharedProjectSection
//           postProjectHref={postProjectHref}
//           allocatHref={allocatHref}
//           allocatLabel={allocatLabel}
//         />

//         <ProfileSection />
//         <CompletionSection />

//         <FinalCta
//           postProjectHref={postProjectHref}
//           allocatHref={allocatHref}
//           allocatLabel={allocatLabel}
//         />
//       </main>

//       <SiteFooter />
//     </>
//   );
// }

// /* =========================================================
//    HERO
// ========================================================= */

// function HeroSection({ postProjectHref }: { postProjectHref: string }) {
//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-[#f7f7f4] dark:border-white/[0.07] dark:bg-[#080808]">
//       <GridTexture />

//       <div
//         aria-hidden
//         className={[
//           "pointer-events-none absolute left-1/2 top-[42%]",
//           "h-[28rem] w-[68rem] -translate-x-1/2 rounded-[50%]",
//           "bg-[#303030]/[0.03] blur-[120px]",
//           "dark:bg-white/[0.014]",
//         ].join(" ")}
//       />

//       <div className="container relative mx-auto px-4 pb-16 pt-14 sm:px-5 sm:pb-20 sm:pt-20 md:px-8 lg:pb-28 lg:pt-24">
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.55, ease: "easeOut" }}
//           className="mx-auto max-w-6xl text-center"
//         >
//           <div className="inline-flex items-center gap-2.5">
//             <img
//               src={assets.allocatrIcon}
//               alt="Allocatr"
//               className="h-6 w-6 object-contain sm:h-7 sm:w-7"
//             />

//             <span className="text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-[#5e5e58] sm:text-[0.58rem] sm:tracking-[0.2em] dark:text-white/38">
//               Work, properly allocated
//             </span>
//           </div>

//           <h1 className="mx-auto mt-7 max-w-[13ch] text-[2.9rem] font-black leading-[0.9] tracking-[-0.058em] text-[#303030] sm:mt-8 sm:text-[4.4rem] md:text-[5.5rem] lg:text-[6.6rem] dark:text-white">
//             Put the right people on{" "}
//             <HeadlineAccent>the right work.</HeadlineAccent>
//           </h1>

//           <p className="mx-auto mt-6 max-w-xl text-[0.82rem] leading-6 text-[#5f5f59] sm:mt-7 sm:max-w-2xl sm:text-base sm:leading-8 dark:text-white/48">
//             Find skilled professionals, build the project team and keep the
//             people, tasks, deadlines and progress connected until the work is
//             reviewed and complete.
//           </p>

//           <div className="mt-8 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
//             <Button
//               asChild
//               className={[
//                 "group h-11 rounded-lg px-6 text-xs font-bold shadow-none sm:h-12 sm:px-7",
//                 primaryButton,
//               ].join(" ")}
//             >
//               <Link to="/discover">
//                 Find an Allocat

//                 <ArrowRightIcon
//                   size={14}
//                   className="transition-transform duration-200 group-hover:translate-x-0.5"
//                 />
//               </Link>
//             </Button>

//             <Button
//               asChild
//               variant="outline"
//               className={[
//                 "h-11 rounded-lg px-6 text-xs font-semibold shadow-none sm:h-12 sm:px-7",
//                 outlineButton,
//               ].join(" ")}
//             >
//               <Link to={postProjectHref}>Create a project</Link>
//             </Button>
//           </div>

//           <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2.5 sm:mt-8 sm:gap-x-6">
//             <HeroProof>Find by project skill</HeroProof>
//             <HeroProof>Manage the work</HeroProof>

//             <div className="hidden sm:block">
//               <HeroProof>Confirm completion</HeroProof>
//             </div>
//           </div>
//         </motion.div>

//         <HeroProductScene />
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    HERO PRODUCT
// ========================================================= */

// function HeroProductScene() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 28 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
//       className={[
//         "relative mx-auto mt-12 max-w-6xl overflow-hidden",
//         "rounded-[1.25rem] border border-black/[0.10]",
//         "bg-white p-3",
//         "shadow-[0_28px_80px_-52px_rgba(0,0,0,0.30)]",
//         "sm:mt-16 sm:rounded-[1.6rem] sm:p-6",
//         "lg:mt-20 lg:p-8",
//         "dark:border-white/[0.08] dark:bg-[#141414]",
//         "dark:shadow-2xl dark:shadow-black/35",
//       ].join(" ")}
//     >
//       <div className="flex items-center justify-between border-b border-black/[0.09] pb-3.5 dark:border-white/[0.07] sm:pb-4">
//         <div className="flex items-center gap-2.5">
//           <span className="relative flex h-2 w-2">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#303030] opacity-10 dark:bg-[#DEDA00] dark:opacity-20" />
//             <span className="relative inline-flex h-2 w-2 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
//           </span>

//           <p className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#5e5e58] sm:text-[0.58rem] sm:tracking-[0.16em] dark:text-white/45">
//             Project allocation
//           </p>
//         </div>

//         <p className="hidden text-[0.58rem] text-[#767670] sm:block dark:text-white/28">
//           AL-0182
//         </p>
//       </div>

//       <div className="mt-4 sm:mt-6 lg:grid lg:grid-cols-[0.88fr_90px_1.12fr] lg:items-center lg:gap-6">
//         <MarketingProjectCard />

//         <div className="hidden lg:block">
//           <AllocationConnector />
//         </div>

//         <div className="hidden lg:block">
//           <DiscoverResultsPreview />
//         </div>

//         <div className="mt-3 lg:hidden">
//           <HeroMatchSummary />
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function HeroMatchSummary() {
//   return (
//     <div className="flex items-center gap-3 rounded-xl border border-black/[0.09] bg-[#f5f5f1] p-3 dark:border-white/[0.07] dark:bg-white/[0.025]">
//       <div className="flex -space-x-2">
//         <ProfileAvatar avatar="tawanda" size="sm" overlap />
//         <ProfileAvatar avatar="leroy" size="sm" overlap />
//         <ProfileAvatar avatar="kuda" size="sm" overlap />
//       </div>

//       <div className="min-w-0">
//         <p className="text-[0.62rem] font-bold text-[#303030] dark:text-white">
//           3 matching Allocats
//         </p>

//         <p className="mt-0.5 truncate text-[0.52rem] text-[#666660] dark:text-white/34">
//           Electrical · Carpentry · Painting
//         </p>
//       </div>

//       <ArrowRightIcon
//         size={13}
//         className="ml-auto shrink-0 text-[#5f5f59] dark:text-[#DEDA00]"
//       />
//     </div>
//   );
// }

// /* =========================================================
//    PROJECT CARD
// ========================================================= */

// function MarketingProjectCard() {
//   return (
//     <div className="overflow-hidden rounded-xl border border-black/[0.10] bg-white dark:border-white/[0.09] dark:bg-[#101010]">
//       <div className="flex min-h-[46px] items-center justify-between gap-3 border-b border-black/[0.08] bg-[#f0f0ec] px-3.5 sm:min-h-[48px] sm:px-4 dark:border-white/[0.06] dark:bg-[#1B1B1B]">
//         <div className="flex min-w-0 items-center gap-2.5">
//           <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#303030] text-[#DEDA00] dark:bg-white/[0.06]">
//             <WrenchIcon size={13} />
//           </span>

//           <div className="min-w-0">
//             <p className="truncate text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[#51514c] sm:text-[0.53rem] sm:tracking-[0.14em] dark:text-white/55">
//               Home improvement
//             </p>

//             <p className="mt-0.5 hidden text-[0.5rem] text-[#777771] sm:block dark:text-white/28">
//               AL-0182
//             </p>
//           </div>
//         </div>

//         <ProjectStatus status="active" />
//       </div>

//       <div className="p-3.5 sm:p-[1.125rem]">
//         <h3 className="text-base font-black leading-[1.2] tracking-[-0.025em] text-[#303030] sm:text-lg dark:text-white">
//           Kitchen renovation
//         </h3>

//         <p className="mt-2 line-clamp-2 text-[0.63rem] leading-[1.05rem] text-[#62625c] sm:text-[0.68rem] sm:leading-[1.15rem] dark:text-white/40">
//           Replace cabinetry, update electrical fittings and complete final
//           finishing before handover.
//         </p>

//         <div className="mt-4 sm:mt-5">
//           <div className="mb-2 flex items-center justify-between">
//             <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[#686862] sm:text-[0.53rem] dark:text-white/30">
//               Progress
//             </span>

//             <span className="text-[0.68rem] font-black text-[#303030] sm:text-xs dark:text-white">
//               68%
//             </span>
//           </div>

//           <ProjectProgressBar value={68} />
//         </div>

//         <div className="mt-4 flex items-center justify-between gap-3 sm:mt-5">
//           <span className="hidden items-center gap-1.5 text-[0.59rem] text-[#676761] sm:flex dark:text-white/32">
//             <CalendarDaysIcon size={11} />
//             12 Sep 2026
//           </span>

//           <span className="ml-auto inline-flex items-center gap-1.5 text-[0.59rem] font-semibold text-[#303030] sm:text-[0.61rem] dark:text-white/75">
//             Open
//             <ArrowRightIcon size={11} />
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ProjectStatus({ status }: { status: "active" | "pending" | "complete" }) {
//   const appearance =
//     status === "complete"
//       ? {
//           label: "Complete",
//           dotClass: "bg-[#38D200]",
//           textClass: "text-[#247e08] dark:text-[#38D200]",
//         }
//       : status === "pending"
//         ? {
//             label: "Pending",
//             dotClass: "bg-[#F0A23A]",
//             textClass: "text-[#8c5800] dark:text-[#F0A23A]",
//           }
//         : {
//             label: "Active",
//             dotClass: "bg-[#303030] dark:bg-[#DEDA00]",
//             textClass: "text-[#55554f] dark:text-[#DEDA00]",
//           };

//   return (
//     <span
//       className={[
//         "inline-flex items-center gap-1.5 text-[0.52rem] font-semibold sm:text-[0.55rem]",
//         appearance.textClass,
//       ].join(" ")}
//     >
//       <span className={["h-1.5 w-1.5 rounded-full", appearance.dotClass].join(" ")} />
//       {appearance.label}
//     </span>
//   );
// }

// /* =========================================================
//    DISCOVER
// ========================================================= */

// function DiscoverResultsPreview() {
//   return (
//     <div>
//       <div className="mb-3 flex items-end justify-between gap-4">
//         <div>
//           <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-[#666660] dark:text-white/30">
//             Find Allocats
//           </p>

//           <p className="mt-1 text-xs font-semibold text-[#303030] dark:text-white/72">
//             Professionals matching project skills
//           </p>
//         </div>

//         <span className="hidden text-[0.52rem] font-semibold text-[#4f4f49] xl:block dark:text-[#DEDA00]">
//           3 shown
//         </span>
//       </div>

//       <div className="space-y-2.5">
//         <DiscoverPerson
//           avatar="tawanda"
//           name="Tawanda Moyo"
//           title="Electrical specialist"
//           experience="8 years experience"
//           skills={["Electrical wiring", "Installation"]}
//           active
//         />

//         <DiscoverPerson
//           avatar="leroy"
//           name="Leroy Nyathi"
//           title="Carpenter & joiner"
//           experience="6 years experience"
//           skills={["Carpentry", "Cabinetry"]}
//         />

//         <DiscoverPerson
//           avatar="kuda"
//           name="Kuda M."
//           title="Painter & finisher"
//           experience="5 years experience"
//           skills={["Painting", "Finishing"]}
//         />
//       </div>
//     </div>
//   );
// }

// function DiscoverPerson({
//   avatar,
//   name,
//   title,
//   experience,
//   skills,
//   active = false,
//   className = "",
// }: {
//   avatar: AvatarKey;
//   name: string;
//   title: string;
//   experience: string;
//   skills: string[];
//   active?: boolean;
//   className?: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{ x: 3 }}
//       className={[
//         "relative flex items-center gap-3 rounded-xl border p-3 sm:p-3.5",
//         active
//           ? "border-black/[0.14] bg-[#f5f5f1] dark:border-[#DEDA00]/20 dark:bg-white/[0.045]"
//           : "border-black/[0.09] bg-white dark:border-white/[0.07] dark:bg-white/[0.025]",
//         className,
//       ].join(" ")}
//     >
//       {active && (
//         <span className="absolute bottom-3 left-0 top-3 w-[2px] rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
//       )}

//       <ProfileAvatar avatar={avatar} size="md" />

//       <div className="min-w-0 flex-1">
//         <p className="truncate text-xs font-bold text-[#303030] dark:text-white">
//           {name}
//         </p>

//         <p className="mt-0.5 truncate text-[0.52rem] text-[#666660] sm:text-[0.54rem] dark:text-white/36">
//           {title}

//           <span className="hidden sm:inline">
//             {" "}· {experience}
//           </span>
//         </p>

//         <div className="mt-2 hidden flex-wrap gap-1.5 md:flex">
//           {skills.map(skill => (
//             <span
//               key={skill}
//               className="rounded-md bg-[#eeeeea] px-2 py-1 text-[0.48rem] font-medium text-[#5f5f59] dark:bg-white/[0.045] dark:text-white/40"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       </div>

//       <span
//         className={[
//           "hidden shrink-0 rounded-lg px-2.5 py-1.5 text-[0.53rem] font-semibold sm:inline-flex",
//           active
//             ? previewPrimaryAction
//             : "border border-black/[0.12] text-[#55554f] dark:border-white/[0.08] dark:text-white/42",
//         ].join(" ")}
//       >
//         Invite
//       </span>
//     </motion.div>
//   );
// }

// /* =========================================================
//    CONNECTOR
// ========================================================= */

// function AllocationConnector() {
//   const reduceMotion = useReducedMotion();

//   return (
//     <div className="relative flex min-h-72 items-center justify-center">
//       <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-black/[0.06] dark:bg-white/[0.06]" />

//       <motion.span
//         animate={
//           reduceMotion
//             ? undefined
//             : {
//                 boxShadow: [
//                   "0 0 0 0 rgba(222,218,0,0)",
//                   "0 0 0 14px rgba(222,218,0,0.06)",
//                   "0 0 0 0 rgba(222,218,0,0)",
//                 ],
//               }
//         }
//         transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
//         className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.13] bg-white text-[#303030] dark:border-[#DEDA00]/30 dark:bg-[#1A1A1A] dark:text-[#DEDA00]"
//       >
//         <ArrowRightIcon size={16} />
//       </motion.span>
//     </div>
//   );
// }

// /* =========================================================
//    JOURNEY
// ========================================================= */

// function JourneySection() {
//   const [activeStep, setActiveStep] = useState(0);

//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-white py-20 dark:border-white/[0.07] dark:bg-[#111111] sm:py-24 lg:py-32">
//       <NeonWaveField variant="neutral" side="right" top="4%" />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="max-w-5xl">
//           <SectionEyebrow>Inside Allocatr</SectionEyebrow>

//           <SectionTitle>
//             The project doesn't stop{" "}
//             <HeadlineAccent>after the match.</HeadlineAccent>
//           </SectionTitle>

//           <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/44">
//             The same project moves from creation to recruitment, task execution
//             and completion review.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[0.34fr_0.66fr] lg:gap-10">
//           <div className="grid grid-cols-2 gap-2 sm:block sm:space-y-2">
//             {journeySteps.map((step, index) => (
//               <JourneyStepButton
//                 key={step.number}
//                 step={step}
//                 active={activeStep === index}
//                 onClick={() => setActiveStep(index)}
//               />
//             ))}
//           </div>

//           <ProductWindow activeStep={activeStep} />
//         </div>
//       </div>
//     </section>
//   );
// }

// function JourneyStepButton({
//   step,
//   active,
//   onClick,
// }: {
//   step: (typeof journeySteps)[number];
//   active: boolean;
//   onClick: () => void;
// }) {
//   const Icon = step.icon;

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={[
//         "group relative flex min-h-[82px] w-full gap-3 rounded-xl border p-3 text-left transition-all sm:min-h-0 sm:gap-4 sm:p-5",
//         active
//           ? "border-black/[0.13] bg-[#f4f4f0] dark:border-white/[0.12] dark:bg-white/[0.055]"
//           : "border-transparent bg-[#f8f8f5] hover:border-black/[0.09] hover:bg-[#f6f6f3] sm:bg-transparent dark:bg-white/[0.018] dark:hover:border-white/[0.06] dark:hover:bg-white/[0.025]",
//       ].join(" ")}
//     >
//       <span
//         className={[
//           "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9",
//           active
//             ? "bg-[#303030] text-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#202020]"
//             : "bg-[#ecece8] text-[#55554f] dark:bg-white/[0.05] dark:text-white/38",
//         ].join(" ")}
//       >
//         <Icon size={14} />
//       </span>

//       <div className="min-w-0">
//         <div className="flex items-center gap-2">
//           <span className="hidden text-[0.48rem] font-black tracking-[0.14em] text-[#73736d] sm:inline dark:text-white/26">
//             {step.number}
//           </span>

//           <p
//             className={[
//               "text-[0.7rem] font-bold sm:text-xs",
//               active
//                 ? "text-[#303030] dark:text-white"
//                 : "text-[#5c5c56] dark:text-white/45",
//             ].join(" ")}
//           >
//             {step.label}
//           </p>
//         </div>

//         <p
//           className={[
//             "mt-1.5 hidden text-[0.68rem] leading-5 sm:block",
//             active
//               ? "text-[#5e5e58] dark:text-white/55"
//               : "text-[#70706a] dark:text-white/32",
//           ].join(" ")}
//         >
//           {step.description}
//         </p>
//       </div>

//       {active && (
//         <motion.span
//           layoutId="journey-step"
//           className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-[#303030] sm:bottom-3 sm:top-3 dark:bg-[#DEDA00]"
//         />
//       )}
//     </button>
//   );
// }

// /* =========================================================
//    PRODUCT WINDOW
// ========================================================= */

// function ProductWindow({ activeStep }: { activeStep: number }) {
//   return (
//     <div className="overflow-hidden rounded-[1.2rem] border border-black/[0.10] bg-white shadow-[0_24px_70px_-45px_rgba(0,0,0,0.30)] sm:rounded-[1.4rem] dark:border-white/[0.09] dark:bg-[#090909] dark:shadow-2xl dark:shadow-black/30">
//       <div className="hidden sm:block">
//         <BrowserChrome />
//       </div>

//       <div className="p-4 sm:min-h-[500px] sm:p-6">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeStep}
//             initial={{ opacity: 0, y: 7 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -7 }}
//             transition={{ duration: 0.2 }}
//           >
//             {activeStep === 0 && <ProjectDetailsPreview />}
//             {activeStep === 1 && <FindAllocatsPreview />}
//             {activeStep === 2 && <TaskBoardPreview />}
//             {activeStep === 3 && <CompletionPreview />}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    PROJECT DETAILS
// ========================================================= */

// function ProjectDetailsPreview() {
//   return (
//     <>
//       <PreviewHeading
//         eyebrow="Project settings"
//         title="Kitchen renovation"
//         subtitle="Update the project information, schedule and required skills."
//       />

//       <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-5">
//         <PreviewField label="Project title" value="Kitchen renovation" wide />
//         <PreviewField label="Category" value="Home improvement" locked />

//         <div className="hidden sm:block">
//           <PreviewField label="Priority" value="Standard" />
//         </div>
//       </div>

//       <div className="mt-5 sm:mt-6">
//         <PreviewLabel>Skills needed</PreviewLabel>

//         <div className="mt-3 flex flex-wrap gap-2">
//           <SkillTag>Electrical wiring</SkillTag>
//           <SkillTag>Carpentry</SkillTag>

//           <div className="hidden sm:block">
//             <SkillTag>Painting</SkillTag>
//           </div>
//         </div>
//       </div>

//       <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
//         <PreviewField label="Start date" value="12 Sep 2026" />

//         <div className="hidden sm:block">
//           <PreviewField label="Due date" value="30 Oct 2026" />
//         </div>
//       </div>
//     </>
//   );
// }

// /* =========================================================
//    FIND ALLOCATS
// ========================================================= */

// function FindAllocatsPreview() {
//   return (
//     <>
//       <PreviewHeading
//         eyebrow="Find Allocats"
//         title="Professionals for this project"
//         subtitle="Showing professionals with skills relevant to the project."
//       />

//       <div className="mt-4 space-y-2.5 sm:mt-5">
//         <DiscoverPerson
//           avatar="tawanda"
//           name="Tawanda Moyo"
//           title="Electrical specialist"
//           experience="8 years experience"
//           skills={["Electrical wiring", "Installation"]}
//           active
//         />

//         <DiscoverPerson
//           avatar="leroy"
//           name="Leroy Nyathi"
//           title="Carpenter & joiner"
//           experience="6 years experience"
//           skills={["Carpentry", "Cabinetry"]}
//         />

//         <DiscoverPerson
//           avatar="kuda"
//           name="Kuda M."
//           title="Painter & finisher"
//           experience="5 years experience"
//           skills={["Painting", "Finishing"]}
//           className="hidden sm:flex"
//         />
//       </div>
//     </>
//   );
// }

// /* =========================================================
//    TASK BOARD
// ========================================================= */

// function TaskBoardPreview() {
//   return (
//     <>
//       <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/[0.09] pb-4 sm:pb-5 dark:border-white/[0.07]">
//         <div>
//           <PreviewLabel>Project tasks</PreviewLabel>

//           <h3 className="mt-2 text-lg font-black tracking-[-0.03em] text-[#303030] sm:text-xl dark:text-white">
//             Kitchen renovation
//           </h3>
//         </div>

//         <span className="text-xs font-black text-[#303030] dark:text-white">
//           68%
//         </span>
//       </div>

//       <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 xl:grid-cols-4">
//         <StatusColumn title="Pending" accent={amber} count="02">
//           <TaskPreviewCard title="Fit cabinet doors" priority="Standard" due="14 Oct" />

//           <div className="hidden sm:block">
//             <TaskPreviewCard title="Paint touch-ups" priority="Standard" due="16 Oct" />
//           </div>
//         </StatusColumn>

//         <StatusColumn title="Active" accent={lime} count="02">
//           <TaskPreviewCard
//             title="Install sockets"
//             priority="High"
//             due="Today"
//             assigned="Tawanda M."
//             active
//           />

//           <div className="hidden sm:block">
//             <TaskPreviewCard
//               title="Build base units"
//               priority="Standard"
//               due="15 Oct"
//               assigned="Leroy N."
//               active
//             />
//           </div>
//         </StatusColumn>

//         <div className="hidden sm:block">
//           <StatusColumn title="Complete" accent={green} count="07">
//             <TaskPreviewCard title="Site inspection" priority="Standard" due="Complete" complete />
//             <TaskPreviewCard title="Remove old fittings" priority="Standard" due="Complete" complete />
//           </StatusColumn>
//         </div>

//         <div className="hidden xl:block">
//           <StatusColumn title="Overdue" accent={red} count="01">
//             <TaskPreviewCard title="Confirm fitting sizes" priority="High" due="Overdue" overdue />
//           </StatusColumn>
//         </div>
//       </div>
//     </>
//   );
// }

// function StatusColumn({
//   title,
//   accent,
//   count,
//   children,
// }: {
//   title: string;
//   accent: string;
//   count: string;
//   children: ReactNode;
// }) {
//   const isActiveSignal = accent === lime;

//   return (
//     <div className="h-full rounded-xl bg-[#f3f3ef] p-3 dark:bg-white/[0.025]">
//       <div className="mb-3 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           {isActiveSignal ? (
//             <span className="h-1.5 w-1.5 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
//           ) : (
//             <span
//               className="h-1.5 w-1.5 rounded-full"
//               style={{ backgroundColor: accent }}
//             />
//           )}

//           <p className="text-[0.58rem] font-semibold text-[#585852] dark:text-white/48">
//             {title}
//           </p>
//         </div>

//         <span className="text-[0.48rem] font-black text-[#767670] dark:text-white/24">
//           {count}
//         </span>
//       </div>

//       <div className="space-y-2">{children}</div>
//     </div>
//   );
// }

// function TaskPreviewCard({
//   title,
//   priority,
//   due,
//   assigned,
//   active = false,
//   complete = false,
//   overdue = false,
// }: {
//   title: string;
//   priority: string;
//   due: string;
//   assigned?: string;
//   active?: boolean;
//   complete?: boolean;
//   overdue?: boolean;
// }) {
//   return (
//     <div className="rounded-lg border border-black/[0.09] bg-white p-3 dark:border-white/[0.07] dark:bg-[#101010]">
//       <div className="flex items-start gap-2">
//         {active ? (
//           <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
//         ) : (
//           <span
//             className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
//             style={{
//               backgroundColor: complete ? green : overdue ? red : amber,
//             }}
//           />
//         )}

//         <div className="min-w-0">
//           <p className="text-[0.61rem] font-semibold leading-4 text-[#41413c] dark:text-white/78">
//             {title}
//           </p>

//           {assigned && (
//             <p className="mt-1 text-[0.48rem] text-[#696963] dark:text-white/30">
//               {assigned}
//             </p>
//           )}

//           <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.48rem] text-[#74746e] dark:text-white/28">
//             <span>{priority}</span>
//             <span>·</span>

//             <span style={{ color: overdue ? red : undefined }}>
//               {due}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    COMPLETION PREVIEW
// ========================================================= */

// function CompletionPreview() {
//   return (
//     <>
//       <PreviewHeading
//         eyebrow="Completion"
//         title="Project completion"
//         subtitle="The Allocat submits the finished project to the client for final confirmation."
//       />

//       <div className="mt-5 grid gap-3 sm:mt-7 sm:gap-5 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
//         <PreviewCompletionCard
//           icon={CircleCheckBigIcon}
//           iconClass="bg-[#38D200]/[0.10] text-[#247e08] dark:text-[#38D200]"
//           eyebrow="Allocat"
//           title="Mark project complete?"
//           description="All tasks are complete. Send the project to the client for confirmation."
//           action="Send for confirmation"
//         />

//         <div className="hidden justify-center lg:flex">
//           <ArrowRightIcon size={16} className="text-[#55554f] dark:text-[#DEDA00]" />
//         </div>

//         <PreviewCompletionCard
//           icon={Clock3Icon}
//           iconClass="bg-[#F0A23A]/[0.10] text-[#8c5800] dark:text-[#F0A23A]"
//           eyebrow="Client"
//           title="Confirm project completion"
//           description="Confirm the finished work or return the project if more work is needed."
//           action="Confirm completion"
//           secondary="Needs more work"
//         />
//       </div>
//     </>
//   );
// }

// function PreviewCompletionCard({
//   icon: Icon,
//   iconClass,
//   eyebrow,
//   title,
//   description,
//   action,
//   secondary,
// }: {
//   icon: LucideIcon;
//   iconClass: string;
//   eyebrow: string;
//   title: string;
//   description: string;
//   action: string;
//   secondary?: string;
// }) {
//   return (
//     <div className="rounded-xl border border-black/[0.10] bg-[#f7f7f4] p-4 sm:p-5 dark:border-white/[0.08] dark:bg-[#151515]">
//       <span className={["flex h-9 w-9 items-center justify-center rounded-lg", iconClass].join(" ")}>
//         <Icon size={16} />
//       </span>

//       <PreviewLabel className="mt-4 sm:mt-5">{eyebrow}</PreviewLabel>

//       <h4 className="mt-2 text-base font-black text-[#303030] sm:text-lg dark:text-white">
//         {title}
//       </h4>

//       <p className="mt-2 hidden text-[0.62rem] leading-5 text-[#60605a] sm:block dark:text-white/40">
//         {description}
//       </p>

//       <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
//         {secondary && (
//           <span className="hidden rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-[0.55rem] font-semibold text-[#55554f] sm:inline-flex dark:border-white/[0.09] dark:bg-transparent dark:text-white/40">
//             {secondary}
//           </span>
//         )}

//         <span
//           className={[
//             "rounded-lg px-3 py-2 text-[0.55rem] font-bold",
//             previewPrimaryAction,
//           ].join(" ")}
//         >
//           {action}
//         </span>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    BUILD THE TEAM
// ========================================================= */

// function AllocationSection() {
//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-[#f3f3ef] py-20 dark:border-white/[0.07] dark:bg-[#080808] sm:py-24 lg:py-32">
//       <NeonWaveField variant="lime" side="right" top="15%" flip />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
//           <div>
//             <SectionEyebrow>Build the team</SectionEyebrow>

//             <SectionTitle>
//               One project can need{" "}
//               <HeadlineAccent>several different people.</HeadlineAccent>
//             </SectionTitle>

//             <p className="mt-5 max-w-lg text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/44">
//               Required skills belong to the project. Bring the right people
//               together around the same brief instead of treating each trade as
//               a separate job.
//             </p>

//             <div className="mt-7 flex flex-wrap gap-2 sm:mt-8">
//               <SkillTag>Electrical</SkillTag>
//               <SkillTag>Carpentry</SkillTag>

//               <div className="hidden sm:block">
//                 <SkillTag>Painting</SkillTag>
//               </div>

//               <div className="hidden sm:block">
//                 <SkillTag>Construction</SkillTag>
//               </div>
//             </div>
//           </div>

//           <AllocationFan />
//         </div>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    ALLOCATION FAN
// ========================================================= */

// function AllocationFan() {
//   return (
//     <div className="relative min-h-[410px] sm:min-h-[535px] lg:min-h-[550px]">
//       <motion.div
//         initial={{ opacity: 0, y: -8 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.45 }}
//         className="absolute left-1/2 top-0 z-30 w-[94%] max-w-md -translate-x-1/2 rounded-xl border border-black/[0.10] bg-white p-4 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] sm:w-[84%] sm:p-5 dark:border-white/[0.09] dark:bg-[#1A1A1A] dark:shadow-2xl dark:shadow-black/25"
//       >
//         <div className="flex items-center justify-between">
//           <span className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-[#666660] dark:text-white/30">
//             Project
//           </span>

//           <span className="hidden text-[0.5rem] text-[#777771] sm:block dark:text-white/24">
//             AL-0182
//           </span>
//         </div>

//         <h3 className="mt-3 text-lg font-black text-[#303030] sm:text-xl dark:text-white">
//           Kitchen renovation
//         </h3>

//         <p className="mt-2 text-[0.68rem] text-[#62625c] sm:text-xs dark:text-white/40">
//           4 skill areas · 4 project members
//         </p>

//         <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
//           <SkillTag>Electrical</SkillTag>
//           <SkillTag>Carpentry</SkillTag>
//           <SkillTag>Painting</SkillTag>
//           <SkillTag>Construction</SkillTag>
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ scaleY: 0 }}
//         whileInView={{ scaleY: 1 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.15, duration: 0.45 }}
//         className="absolute left-1/2 top-[116px] h-12 w-px origin-top -translate-x-1/2 bg-black/[0.12] sm:top-[142px] sm:h-16 dark:bg-[#DEDA00]/20"
//       />

//       <motion.div
//         initial={{ scaleX: 0 }}
//         whileInView={{ scaleX: 1 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.35, duration: 0.55 }}
//         className="absolute left-[16%] right-[16%] top-[163px] h-px origin-center bg-gradient-to-r from-transparent via-black/[0.13] to-transparent sm:left-[12%] sm:right-[12%] sm:top-[205px] dark:via-[#DEDA00]/20"
//       />

//       <div className="absolute inset-x-0 top-[184px] grid grid-cols-2 gap-2.5 sm:hidden">
//         {allocationRoles.slice(0, 2).map((item, index) => (
//           <motion.div
//             key={item.role}
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.08, duration: 0.35 }}
//             className="rounded-xl border border-black/[0.10] bg-white p-3.5 dark:border-white/[0.08] dark:bg-[#171717]"
//           >
//             <AllocationFanCard item={item} compact />
//           </motion.div>
//         ))}
//       </div>

//       <div className="absolute inset-x-0 top-[228px] hidden grid-cols-2 gap-3 sm:grid lg:hidden">
//         {allocationRoles.map((item, index) => (
//           <motion.div
//             key={item.role}
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.08, duration: 0.35 }}
//             className="rounded-xl border border-black/[0.10] bg-white p-4 dark:border-white/[0.08] dark:bg-[#171717]"
//           >
//             <AllocationFanCard item={item} />
//           </motion.div>
//         ))}
//       </div>

//       <div className="absolute inset-x-0 top-[228px] hidden items-end justify-center lg:flex">
//         {allocationRoles.map((item, index) => (
//           <motion.div
//             key={item.role}
//             initial={{ opacity: 0, y: 28, rotate: item.rotation * 1.4 }}
//             whileInView={{ opacity: 1, y: 0, rotate: item.rotation }}
//             viewport={{ once: true }}
//             transition={{
//               delay: 0.25 + index * 0.08,
//               type: "spring",
//               stiffness: 240,
//               damping: 24,
//             }}
//             whileHover={{ y: -12, rotate: 0, scale: 1.04, zIndex: 50 }}
//             className={[
//               "relative w-48 rounded-xl border",
//               "border-black/[0.10] bg-white p-4",
//               "shadow-[0_20px_50px_-35px_rgba(0,0,0,0.35)]",
//               "dark:border-white/[0.08] dark:bg-[#171717]",
//               "dark:shadow-2xl dark:shadow-black/25",
//               index > 0 ? "-ml-5" : "",
//             ].join(" ")}
//             style={{ zIndex: 10 + index }}
//           >
//             <AllocationFanCard item={item} />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function AllocationFanCard({
//   item,
//   compact = false,
// }: {
//   item: (typeof allocationRoles)[number];
//   compact?: boolean;
// }) {
//   const Icon = item.icon;

//   const iconColor =
//     item.accent === lime
//       ? "#686500"
//       : item.accent === "#D1D1D1"
//         ? "#55554f"
//         : item.accent;

//   const isLimeSignal = item.accent === lime;

//   return (
//     <>
//       <div className="flex items-start justify-between gap-3">
//         <div className="relative">
//           <ProfileAvatar avatar={item.avatar} size={compact ? "md" : "lg"} />

//           <span
//             className={[
//               "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-md",
//               "border-2 border-white dark:border-[#171717]",
//               item.surface,
//             ].join(" ")}
//             style={{ color: iconColor }}
//           >
//             <Icon size={10} />
//           </span>
//         </div>

//         {isLimeSignal ? (
//           <span className="mt-1 h-2 w-2 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
//         ) : (
//           <span
//             className="mt-1 h-2 w-2 rounded-full"
//             style={{ backgroundColor: item.accent }}
//           />
//         )}
//       </div>

//       <p
//         className={[
//           "font-semibold uppercase tracking-[0.14em] text-[#686862] dark:text-white/26",
//           compact ? "mt-4 text-[0.46rem]" : "mt-5 text-[0.5rem]",
//         ].join(" ")}
//       >
//         {item.role}
//       </p>

//       <h4 className="mt-1.5 truncate text-xs font-bold text-[#303030] sm:text-sm dark:text-white">
//         {item.person}
//       </h4>

//       {!compact && (
//         <>
//           <p className="mt-1 text-[0.56rem] text-[#62625c] dark:text-white/40">
//             {item.title}
//           </p>

//           <p className="mt-1 text-[0.52rem] text-[#777771] dark:text-white/28">
//             {item.experience}
//           </p>

//           <div className="mt-5 flex items-center gap-1.5 border-t border-black/[0.09] pt-3 text-[0.52rem] font-semibold text-[#247e08] dark:border-white/[0.07] dark:text-[#38D200]">
//             <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />
//             Accepted
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// /* =========================================================
//    PROJECT LIFECYCLE
// ========================================================= */

// function ProjectLifecycleSection() {
//   const stages = [
//     {
//       number: "01",
//       label: "Pending",
//       title: "Project created",
//       meta: "Waiting for the team",
//       signal: "pending" as const,
//     },
//     {
//       number: "02",
//       label: "Allocated",
//       title: "Team accepted",
//       meta: "Project can start",
//       signal: "active" as const,
//     },
//     {
//       number: "03",
//       label: "Active",
//       title: "Work moving",
//       meta: "Tasks in progress",
//       signal: "active" as const,
//     },
//     {
//       number: "04",
//       label: "Complete",
//       title: "Client confirmed",
//       meta: "Project closed",
//       signal: "complete" as const,
//     },
//   ];

//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-white py-20 dark:border-white/[0.07] dark:bg-[#141414] sm:py-24 lg:py-32">
//       <ArchitecturalColumns />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="max-w-5xl">
//           <SectionEyebrow>Project lifecycle</SectionEyebrow>

//           <SectionTitle>
//             The work has state.{" "}
//             <HeadlineAccent>You can see where it is.</HeadlineAccent>
//           </SectionTitle>

//           <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base dark:text-white/42">
//             Project and task states make progress visible instead of leaving it
//             hidden inside calls and message threads.
//           </p>
//         </div>

//         <div className="relative mt-10 sm:mt-16">
//           <LifecycleRail />

//           <div className="relative grid gap-3 sm:grid-cols-2 sm:gap-7 md:grid-cols-4 md:gap-6">
//             {stages.map((stage, index) => (
//               <LifecycleStage key={stage.number} stage={stage} index={index} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function LifecycleRail() {
//   const reduceMotion = useReducedMotion();

//   const motionProps = reduceMotion
//     ? {}
//     : {
//         initial: { scaleX: 0, opacity: 0 },
//         whileInView: { scaleX: 1, opacity: 1 },
//         viewport: { once: true },
//         transition: { duration: 1.2, ease: "easeOut" as const },
//       };

//   return (
//     <div
//       aria-hidden
//       className="absolute left-0 right-0 top-3 hidden h-12 -translate-y-1/2 md:block"
//     >
//       <motion.div
//         {...motionProps}
//         className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 origin-left blur-xl dark:hidden"
//         style={{
//           background:
//             "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.06) 13%, rgba(48,48,48,0.055) 38%, rgba(108,105,0,0.055) 63%, rgba(56,210,0,0.05) 86%, transparent 100%)",
//         }}
//       />

//       <motion.div
//         {...motionProps}
//         className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 origin-left dark:hidden"
//         style={{
//           background:
//             "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.30) 13%, rgba(90,90,83,0.22) 37%, rgba(101,99,0,0.18) 63%, rgba(56,210,0,0.24) 86%, transparent 100%)",
//         }}
//       />

//       <motion.div
//         {...motionProps}
//         className="absolute inset-x-0 top-1/2 hidden h-8 -translate-y-1/2 origin-left blur-xl dark:block"
//         style={{
//           background:
//             "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.10) 14%, rgba(222,218,0,0.12) 44%, rgba(222,218,0,0.11) 66%, rgba(56,210,0,0.09) 87%, transparent 100%)",
//         }}
//       />

//       <motion.div
//         {...motionProps}
//         className="absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 origin-left dark:block"
//         style={{
//           background:
//             "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.46) 14%, rgba(222,218,0,0.52) 42%, rgba(222,218,0,0.46) 67%, rgba(56,210,0,0.42) 87%, transparent 100%)",
//         }}
//       />
//     </div>
//   );
// }

// function LifecycleStage({
//   stage,
//   index,
// }: {
//   stage: {
//     number: string;
//     label: string;
//     title: string;
//     meta: string;
//     signal: "pending" | "active" | "complete";
//   };
//   index: number;
// }) {
//   const signalClass =
//     stage.signal === "pending"
//       ? "bg-[#F0A23A]"
//       : stage.signal === "complete"
//         ? "bg-[#38D200]"
//         : "bg-[#303030] dark:bg-[#DEDA00]";

//   const glowClass =
//     stage.signal === "pending"
//       ? "shadow-[0_0_0_4px_rgba(240,162,58,0.06)] dark:shadow-[0_0_12px_rgba(240,162,58,0.16)]"
//       : stage.signal === "complete"
//         ? "shadow-[0_0_0_4px_rgba(56,210,0,0.05)] dark:shadow-[0_0_12px_rgba(56,210,0,0.14)]"
//         : "shadow-[0_0_0_4px_rgba(48,48,48,0.035)] dark:shadow-[0_0_12px_rgba(222,218,0,0.13)]";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.3 }}
//       transition={{
//         delay: 0.08 + index * 0.08,
//         duration: 0.42,
//         ease: "easeOut",
//       }}
//       className={[
//         "relative rounded-xl border border-black/[0.08]",
//         "bg-[#f8f8f5] p-4",
//         "sm:border-0 sm:bg-transparent sm:p-0",
//         "dark:border-white/[0.05] dark:bg-white/[0.018]",
//         "sm:dark:bg-transparent",
//       ].join(" ")}
//     >
//       <span className="relative z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-black/[0.10] bg-white md:flex dark:border-white/[0.10] dark:bg-[#141414]">
//         <span className={["h-2 w-2 rounded-full", signalClass, glowClass].join(" ")} />
//       </span>

//       <div className="flex items-center gap-2 md:mt-5">
//         <span className={["h-1.5 w-1.5 rounded-full md:hidden", signalClass].join(" ")} />

//         <p className="text-[0.48rem] font-black uppercase tracking-[0.14em] text-[#60605a] md:text-[0.5rem] md:tracking-[0.16em] dark:text-white/36">
//           {stage.number} / {stage.label}
//         </p>
//       </div>

//       <h3 className="mt-2 text-base font-black text-[#303030] sm:text-lg dark:text-white">
//         {stage.title}
//       </h3>

//       <p className="mt-2 hidden text-xs leading-6 text-[#65655f] sm:block dark:text-white/40">
//         {stage.meta}
//       </p>
//     </motion.div>
//   );
// }

// /* =========================================================
//    SKILLS
// ========================================================= */

// function WorkNetworkSection() {
//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-[#f3f3ef] py-20 dark:border-white/[0.07] dark:bg-[#080808] sm:py-24 lg:py-32">
//       <GridTexture />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="grid gap-6 sm:gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
//           <div>
//             <SectionEyebrow>Skills on Allocatr</SectionEyebrow>

//             <SectionTitle>
//               Practical work needs{" "}
//               <HeadlineAccent>practical skills.</HeadlineAccent>
//             </SectionTitle>
//           </div>

//           <p className="max-w-xl text-sm leading-7 text-[#5f5f59] sm:text-base sm:leading-8 lg:justify-self-end dark:text-white/42">
//             Projects can bring together several different capabilities while
//             keeping everybody connected to the same brief and outcome.
//           </p>
//         </div>

//         <SkillsTicker />
//       </div>
//     </section>
//   );
// }

// function SkillsTicker() {
//   const reduceMotion = useReducedMotion();

//   return (
//     <div className="relative mt-10 overflow-hidden rounded-[1.25rem] border border-black/[0.10] bg-white shadow-[0_24px_70px_-52px_rgba(0,0,0,0.20)] sm:mt-16 sm:rounded-[1.5rem] dark:border-white/[0.08] dark:bg-[#111111] dark:shadow-none">
//       <div className="flex items-center justify-between border-b border-black/[0.09] px-4 py-4 sm:px-6 dark:border-white/[0.07]">
//         <div>
//           <PreviewLabel>Skill categories</PreviewLabel>

//           <p className="mt-1 text-xs font-semibold text-[#42423e] dark:text-white/65">
//             Different work. One project system.
//           </p>
//         </div>

//         <span className="hidden items-center gap-1.5 text-[0.52rem] font-semibold text-[#4f4f49] sm:flex dark:text-[#DEDA00]">
//           <span className="h-1.5 w-1.5 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
//           Explore
//         </span>
//       </div>

//       <div className="divide-y divide-black/[0.07] dark:divide-white/[0.06] md:hidden">
//         {workCategories.slice(0, 3).map(item => (
//           <CompactSkillRow key={item.title} item={item} />
//         ))}
//       </div>

//       <div className="hidden overflow-hidden py-7 md:block">
//         <motion.div
//           animate={reduceMotion ? undefined : { x: ["0%", "-10%", "0%"] }}
//           transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
//           className="flex w-max gap-3 px-5"
//         >
//           {[...workCategories, ...workCategories].map((item, index) => (
//             <SkillTickerCard key={`${item.title}-${index}`} item={item} />
//           ))}
//         </motion.div>
//       </div>

//       <div className="hidden border-t border-black/[0.09] dark:border-white/[0.07] md:grid md:grid-cols-3">
//         <NetworkMetric
//           number="01"
//           title="Project skills"
//           description="The requirements belong to the project."
//         />

//         <NetworkMetric
//           number="02"
//           title="Project people"
//           description="Invite the professionals you actually need."
//         />

//         <NetworkMetric
//           number="03"
//           title="Shared workspace"
//           description="Everyone works from the same project."
//         />
//       </div>
//     </div>
//   );
// }

// function CompactSkillRow({ item }: { item: (typeof workCategories)[number] }) {
//   const Icon = item.icon;

//   return (
//     <div className="relative flex items-center gap-3 overflow-hidden p-4">
//       <div
//         aria-hidden
//         className={["absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl", item.glow].join(" ")}
//       />

//       <span
//         className={[
//           "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
//           item.surface,
//           item.accent,
//         ].join(" ")}
//       >
//         <Icon size={15} />
//       </span>

//       <div className="relative min-w-0 flex-1">
//         <p className="text-xs font-bold text-[#303030] dark:text-white">
//           {item.title}
//         </p>

//         <p className="mt-0.5 truncate text-[0.52rem] text-[#666660] dark:text-white/34">
//           {item.detail}
//         </p>
//       </div>

//       <ArrowRightIcon
//         size={12}
//         className="relative shrink-0 text-[#82827b] dark:text-white/20"
//       />
//     </div>
//   );
// }

// function SkillTickerCard({ item }: { item: (typeof workCategories)[number] }) {
//   const Icon = item.icon;

//   return (
//     <div
//       className={[
//         "group relative w-[270px] shrink-0 overflow-hidden rounded-xl",
//         "border border-black/[0.10] bg-[#f8f8f5] p-5",
//         "transition-[transform,border-color,box-shadow] duration-300",
//         "hover:-translate-y-1 hover:border-black/[0.15]",
//         "hover:shadow-[0_18px_45px_-34px_rgba(0,0,0,0.28)]",
//         "dark:border-white/[0.08] dark:bg-[#181818]",
//         "dark:hover:border-white/[0.12] dark:hover:shadow-none",
//         "sm:w-[300px]",
//       ].join(" ")}
//     >
//       <div
//         aria-hidden
//         className={[
//           "absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl opacity-60",
//           item.glow,
//         ].join(" ")}
//       />

//       <div className="relative flex items-start justify-between">
//         <span
//           className={[
//             "flex h-9 w-9 items-center justify-center rounded-lg",
//             item.surface,
//             item.accent,
//           ].join(" ")}
//         >
//           <Icon size={15} />
//         </span>

//         <ArrowRightIcon
//           size={12}
//           className="text-[#82827b] transition-transform duration-200 group-hover:translate-x-0.5 dark:text-white/20"
//         />
//       </div>

//       <h3 className="relative mt-7 text-sm font-black text-[#303030] dark:text-white">
//         {item.title}
//       </h3>

//       <p className="relative mt-2 text-[0.6rem] leading-5 text-[#64645e] dark:text-white/34">
//         {item.detail}
//       </p>
//     </div>
//   );
// }

// function NetworkMetric({
//   number,
//   title,
//   description,
// }: {
//   number: string;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="border-r border-black/[0.09] p-6 last:border-r-0 dark:border-white/[0.07]">
//       <p className="text-[0.48rem] font-black tracking-[0.15em] text-[#5d5d57] dark:text-[#DEDA00]">
//         {number}
//       </p>

//       <h3 className="mt-4 text-lg font-black text-[#303030] dark:text-white">
//         {title}
//       </h3>

//       <p className="mt-1.5 text-xs leading-6 text-[#64645e] dark:text-white/38">
//         {description}
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    WORKSPACE
// ========================================================= */

// function WorkspaceSection() {
//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-white py-20 dark:border-white/[0.07] dark:bg-[#111111] sm:py-24 lg:py-32">
//       <NeonWaveField variant="lime" side="right" top="12%" flip />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="mx-auto max-w-5xl text-center">
//           <SectionEyebrow center>Project workspace</SectionEyebrow>

//           <SectionTitle center>
//             The project becomes{" "}
//             <HeadlineAccent>the source of truth.</HeadlineAccent>
//           </SectionTitle>

//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base dark:text-white/42">
//             Project details, progress, accepted Allocats and task execution
//             remain connected around the same piece of work.
//           </p>
//         </div>

//         <WorkspaceComposition />
//       </div>
//     </section>
//   );
// }

// function WorkspaceComposition() {
//   return (
//     <div className="relative mx-auto mt-10 max-w-6xl sm:mt-14 sm:pb-12 sm:pt-6">
//       <motion.div
//         initial={{ opacity: 0, y: 18 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.55 }}
//         className="overflow-hidden rounded-[1.25rem] border border-black/[0.11] bg-[#f4f4f1] shadow-[0_30px_90px_-56px_rgba(0,0,0,0.38)] sm:rounded-[1.5rem] dark:border-white/[0.08] dark:bg-[#090909] dark:shadow-2xl dark:shadow-black/35"
//       >
//         <WorkspaceHeader />

//         <div className="p-3.5 sm:p-6">
//           <WorkspaceOverview />

//           <div className="mt-5 border-t border-black/[0.09] pt-5 sm:mt-7 sm:pt-6 dark:border-white/[0.07]">
//             <div className="flex flex-wrap items-end justify-between gap-4">
//               <div>
//                 <PreviewLabel>Project tasks</PreviewLabel>

//                 <h4 className="mt-1.5 text-sm font-black text-[#303030] sm:text-base dark:text-white">
//                   Task status board
//                 </h4>
//               </div>

//               <span className="hidden text-[0.55rem] text-[#676761] sm:block dark:text-white/32">
//                 Drag tasks between valid statuses
//               </span>
//             </div>

//             <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 xl:grid-cols-4">
//               <StatusColumn title="Pending" accent={amber} count="02">
//                 <TaskPreviewCard title="Fit cabinet doors" priority="Standard" due="14 Oct" />

//                 <div className="hidden sm:block">
//                   <TaskPreviewCard title="Paint touch-ups" priority="Standard" due="16 Oct" />
//                 </div>
//               </StatusColumn>

//               <StatusColumn title="Active" accent={lime} count="02">
//                 <TaskPreviewCard
//                   title="Install sockets"
//                   priority="High"
//                   due="Today"
//                   assigned="Tawanda M."
//                   active
//                 />

//                 <div className="hidden sm:block">
//                   <TaskPreviewCard
//                     title="Build base units"
//                     priority="Standard"
//                     due="15 Oct"
//                     assigned="Leroy N."
//                     active
//                   />
//                 </div>
//               </StatusColumn>

//               <div className="hidden sm:block">
//                 <StatusColumn title="Complete" accent={green} count="07">
//                   <TaskPreviewCard title="Site inspection" priority="Standard" due="Complete" complete />
//                   <TaskPreviewCard title="Remove old fittings" priority="Standard" due="Complete" complete />
//                 </StatusColumn>
//               </div>

//               <div className="hidden xl:block">
//                 <StatusColumn title="Overdue" accent={red} count="01">
//                   <TaskPreviewCard title="Confirm fitting sizes" priority="High" due="Overdue" overdue />
//                 </StatusColumn>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       <WorkspaceMessageFloat />
//       <WorkspaceTeamFloat />
//     </div>
//   );
// }

// function WorkspaceHeader() {
//   return (
//     <div className="flex flex-col gap-4 border-b border-black/[0.09] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 dark:border-white/[0.07] dark:bg-[#121212]">
//       <div className="flex items-center gap-3">
//         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#303030] text-[#DEDA00] sm:h-11 sm:w-11 dark:bg-white/[0.06]">
//           <WrenchIcon size={16} />
//         </span>

//         <div className="min-w-0">
//           <div className="flex flex-wrap items-center gap-2">
//             <h3 className="truncate text-base font-black tracking-[-0.025em] text-[#303030] sm:text-lg dark:text-white">
//               Kitchen renovation
//             </h3>

//             <div className="hidden sm:block">
//               <ProjectStatus status="active" />
//             </div>
//           </div>

//           <p className="mt-1 truncate text-[0.55rem] text-[#666660] sm:text-[0.58rem] dark:text-white/32">
//             Home improvement · AL-0182
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="hidden rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-[0.56rem] font-semibold text-[#55554f] sm:inline-flex dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/42">
//           Project details
//         </span>

//         <span
//           className={[
//             "rounded-lg px-3 py-2 text-[0.56rem] font-semibold",
//             previewPrimaryAction,
//           ].join(" ")}
//         >
//           Find Allocats
//         </span>
//       </div>
//     </div>
//   );
// }

// function WorkspaceOverview() {
//   return (
//     <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
//       <div className="rounded-xl border border-black/[0.10] bg-white p-4 sm:p-5 dark:border-white/[0.07] dark:bg-[#111111]">
//         <div className="flex items-start justify-between gap-5">
//           <div>
//             <PreviewLabel>Project progress</PreviewLabel>

//             <div className="mt-2 flex items-end gap-2">
//               <span className="text-3xl font-black tracking-[-0.05em] text-[#303030] sm:text-4xl dark:text-white">
//                 68
//               </span>

//               <span className="mb-1 text-sm font-bold text-[#62625c] dark:text-white/30">
//                 %
//               </span>
//             </div>
//           </div>

//           <span className="rounded-full border border-black/[0.12] bg-[#f3f3ef] px-3 py-1.5 text-[0.54rem] font-semibold text-[#55554f] dark:border-[#DEDA00]/20 dark:bg-white/[0.035] dark:text-[#DEDA00]">
//             Active
//           </span>
//         </div>

//         <ProjectProgressBar value={68} className="mt-5 h-1.5 sm:mt-6" />

//         <div className="mt-5 grid grid-cols-3 border-t border-black/[0.09] pt-4 sm:mt-6 sm:pt-5 dark:border-white/[0.07]">
//           <WorkspaceMetric label="Tasks" value="12" />
//           <WorkspaceMetric label="Complete" value="07" />
//           <WorkspaceMetric label="Due" value="30 Oct" />
//         </div>
//       </div>

//       <div className="hidden rounded-xl border border-black/[0.10] bg-white p-5 md:block dark:border-white/[0.07] dark:bg-[#111111]">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <PreviewLabel>Project team</PreviewLabel>

//             <p className="mt-1.5 text-sm font-bold text-[#303030] dark:text-white">
//               Accepted Allocats
//             </p>
//           </div>

//           <span className="text-lg font-black text-[#303030] dark:text-white">
//             03
//           </span>
//         </div>

//         <div className="mt-5 space-y-2.5">
//           <WorkspaceMember avatar="tawanda" name="Tawanda M." skill="Electrical" />
//           <WorkspaceMember avatar="leroy" name="Leroy N." skill="Carpentry" />
//           <WorkspaceMember avatar="kuda" name="Kuda M." skill="Painting" />
//         </div>
//       </div>
//     </div>
//   );
// }

// function WorkspaceMetric({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="border-l border-black/[0.09] px-2.5 first:border-l-0 first:pl-0 sm:px-4 dark:border-white/[0.07]">
//       <p className="truncate text-[0.43rem] font-semibold uppercase tracking-[0.08em] text-[#6b6b65] sm:text-[0.48rem] sm:tracking-[0.1em] dark:text-white/26">
//         {label}
//       </p>

//       <p className="mt-1 truncate text-xs font-black text-[#303030] sm:text-sm dark:text-white">
//         {value}
//       </p>
//     </div>
//   );
// }

// function WorkspaceMember({
//   avatar,
//   name,
//   skill,
// }: {
//   avatar: AvatarKey;
//   name: string;
//   skill: string;
// }) {
//   return (
//     <div className="flex items-center gap-3">
//       <ProfileAvatar avatar={avatar} size="sm" />

//       <div className="min-w-0 flex-1">
//         <p className="truncate text-[0.6rem] font-semibold text-[#303030] dark:text-white/75">
//           {name}
//         </p>

//         <p className="mt-0.5 text-[0.48rem] text-[#676761] dark:text-white/28">
//           {skill}
//         </p>
//       </div>

//       <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />
//     </div>
//   );
// }

// function WorkspaceMessageFloat() {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
//       transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//       className="absolute -left-8 bottom-1 hidden w-64 rounded-xl border border-black/[0.11] bg-white p-4 shadow-xl lg:block dark:border-white/[0.08] dark:bg-[#1A1A1A]/95"
//     >
//       <div className="flex items-center gap-3">
//         <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00] dark:bg-[#DEDA00]/[0.07] dark:text-[#DEDA00]">
//           <MessageSquareIcon size={15} />
//         </span>

//         <div>
//           <p className="text-[0.52rem] text-[#686862] dark:text-white/30">
//             Project update
//           </p>

//           <p className="mt-0.5 text-xs font-semibold text-[#303030] dark:text-white">
//             Electrical work started
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function WorkspaceTeamFloat() {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
//       transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
//       className="absolute -right-8 top-0 hidden w-56 rounded-xl border border-black/[0.11] bg-white p-4 shadow-xl lg:block dark:border-white/[0.08] dark:bg-[#1A1A1A]/95"
//     >
//       <PreviewLabel>Team</PreviewLabel>

//       <div className="mt-3 flex -space-x-2">
//         <ProfileAvatar avatar="tawanda" size="sm" overlap />
//         <ProfileAvatar avatar="leroy" size="sm" overlap />
//         <ProfileAvatar avatar="kuda" size="sm" overlap />
//       </div>

//       <p className="mt-3 flex items-center gap-1.5 text-[0.58rem] font-medium text-[#247e08] dark:text-[#38D200]">
//         <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />
//         3 accepted Allocats
//       </p>
//     </motion.div>
//   );
// }

// /* =========================================================
//    SAME PROJECT
// ========================================================= */

// function SharedProjectSection({
//   postProjectHref,
//   allocatHref,
//   allocatLabel,
// }: {
//   postProjectHref: string;
//   allocatHref: string;
//   allocatLabel: string;
// }) {
//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f3f3ef] py-20 dark:border-white/[0.07] dark:bg-[#080808] sm:py-24 lg:py-32">
//       <SharedProjectAtmosphere />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="max-w-4xl">
//           <SectionEyebrow>Same project</SectionEyebrow>

//           <SectionTitle>
//             Different responsibilities.{" "}
//             <HeadlineAccent>Shared visibility.</HeadlineAccent>
//           </SectionTitle>

//           <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/42">
//             The client and the Allocat work from the same project. What changes
//             is ownership of each decision, not the information surrounding the work.
//           </p>
//         </div>

//         <SharedProjectBoard
//           postProjectHref={postProjectHref}
//           allocatHref={allocatHref}
//           allocatLabel={allocatLabel}
//         />
//       </div>
//     </section>
//   );
// }

// function SharedProjectAtmosphere() {
//   return (
//     <div
//       aria-hidden
//       className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
//     >
//       <div className="absolute -left-40 top-[28%] h-72 w-72 rounded-full bg-[#F0A23A]/[0.035] blur-[110px] dark:bg-[#F0A23A]/[0.018]" />
//       <div className="absolute -right-40 top-[34%] h-72 w-72 rounded-full bg-[#38D200]/[0.03] blur-[110px] dark:bg-[#38D200]/[0.016]" />
//     </div>
//   );
// }

// function SharedProjectBoard({
//   postProjectHref,
//   allocatHref,
//   allocatLabel,
// }: {
//   postProjectHref: string;
//   allocatHref: string;
//   allocatLabel: string;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 18 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       className={[
//         "relative mt-10 overflow-hidden rounded-[1.25rem]",
//         "border border-black/[0.10] bg-white",
//         "shadow-[0_28px_80px_-58px_rgba(0,0,0,0.28)]",
//         "sm:mt-14 sm:rounded-[1.5rem]",
//         "dark:border-white/[0.07] dark:bg-[#111111]",
//         "dark:shadow-2xl dark:shadow-black/25",
//       ].join(" ")}
//     >
//       <SharedProjectHeader />

//       <div className="grid lg:grid-cols-[1fr_0.84fr_1fr]">
//         <ResponsibilityLane
//           role="Client"
//           title="Own the outcome."
//           description="The client defines what success looks like and makes the final project decisions."
//           icon={UsersIcon}
//           tone="amber"
//           items={[
//             {
//               label: "Create the brief",
//               description: "Set the project scope, schedule and required skills.",
//             },
//             {
//               label: "Build the team",
//               description: "Find and invite the Allocats needed for the work.",
//             },
//             {
//               label: "Review completion",
//               description: "Confirm the work or return it for further attention.",
//             },
//           ]}
//           href={postProjectHref}
//           action="Start a project"
//         />

//         <SharedProjectCore />

//         <ResponsibilityLane
//           role="Allocat"
//           title="Own the execution."
//           description="The Allocat manages the work itself and keeps project execution visible."
//           icon={BriefcaseBusinessIcon}
//           tone="green"
//           items={[
//             {
//               label: "Work the tasks",
//               description: "Move assigned work through the project task states.",
//             },
//             {
//               label: "Keep progress current",
//               description: "Project status stays connected to what is actually happening.",
//             },
//             {
//               label: "Submit the finish",
//               description: "Send completed work to the client for confirmation.",
//             },
//           ]}
//           href={allocatHref}
//           action={allocatLabel}
//         />
//       </div>

//       <SharedProjectFooter />
//     </motion.div>
//   );
// }

// function SharedProjectHeader() {
//   return (
//     <div
//       className={[
//         "relative border-b border-black/[0.08]",
//         "bg-[#f8f8f5] px-4 py-4",
//         "sm:px-6 sm:py-5",
//         "dark:border-white/[0.06] dark:bg-[#171717]",
//       ].join(" ")}
//     >
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex min-w-0 items-center gap-3">
//           <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#303030] text-[#DEDA00] dark:bg-white/[0.06] dark:text-[#DEDA00]">
//             <WrenchIcon size={16} />
//           </span>

//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-2">
//               <h3 className="truncate text-sm font-black tracking-[-0.02em] text-[#303030] sm:text-base dark:text-white">
//                 Kitchen renovation
//               </h3>

//               <ProjectStatus status="active" />
//             </div>

//             <p className="mt-1 text-[0.54rem] text-[#696963] dark:text-white/30">
//               Home improvement · AL-0182
//             </p>
//           </div>
//         </div>

//         <div className="w-full sm:w-52">
//           <div className="mb-2 flex items-center justify-between">
//             <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[#686862] dark:text-white/28">
//               Project progress
//             </span>

//             <span className="text-xs font-black text-[#303030] dark:text-white">
//               68%
//             </span>
//           </div>

//           <ProjectProgressBar value={68} />
//         </div>
//       </div>
//     </div>
//   );
// }

// function ResponsibilityLane({
//   role,
//   title,
//   description,
//   icon: Icon,
//   tone,
//   items,
//   href,
//   action,
// }: {
//   role: string;
//   title: string;
//   description: string;
//   icon: LucideIcon;
//   tone: "amber" | "green";
//   items: { label: string; description: string }[];
//   href: string;
//   action: string;
// }) {
//   const toneClasses =
//     tone === "green"
//       ? {
//           icon: "bg-[#38D200]/[0.09] text-[#247e08] dark:text-[#38D200]",
//           signal: "bg-[#38D200]",
//           wash: "bg-[#38D200]/[0.025] dark:bg-[#38D200]/[0.018]",
//         }
//       : {
//           icon: "bg-[#F0A23A]/[0.10] text-[#8c5800] dark:text-[#F0A23A]",
//           signal: "bg-[#F0A23A]",
//           wash: "bg-[#F0A23A]/[0.025] dark:bg-[#F0A23A]/[0.018]",
//         };

//   return (
//     <div className={["relative p-5 sm:p-7 lg:p-8", toneClasses.wash].join(" ")}>
//       <div className="flex items-center justify-between gap-4">
//         <span
//           className={[
//             "flex h-10 w-10 items-center justify-center rounded-xl",
//             toneClasses.icon,
//           ].join(" ")}
//         >
//           <Icon size={16} />
//         </span>

//         <div className="flex items-center gap-2">
//           <span className={["h-1.5 w-1.5 rounded-full", toneClasses.signal].join(" ")} />

//           <span className="text-[0.5rem] font-semibold uppercase tracking-[0.15em] text-[#686862] dark:text-white/30">
//             {role}
//           </span>
//         </div>
//       </div>

//       <h3 className="mt-6 text-2xl font-black leading-[0.98] tracking-[-0.035em] text-[#303030] sm:text-3xl dark:text-white">
//         {title}
//       </h3>

//       <p className="mt-3 max-w-md text-xs leading-6 text-[#62625c] sm:text-sm sm:leading-7 dark:text-white/40">
//         {description}
//       </p>

//       <div className="mt-7 divide-y divide-black/[0.08] border-y border-black/[0.08] dark:divide-white/[0.06] dark:border-white/[0.06]">
//         {items.map((item, index) => (
//           <ResponsibilityItem
//             key={item.label}
//             number={`0${index + 1}`}
//             label={item.label}
//             description={item.description}
//             tone={tone}
//           />
//         ))}
//       </div>

//       <Link
//         to={href}
//         className={[
//           "group mt-7 inline-flex items-center gap-2",
//           "text-xs font-bold text-[#303030]",
//           "transition-colors hover:text-black",
//           "dark:text-[#DEDA00] dark:hover:text-[#e7e300]",
//         ].join(" ")}
//       >
//         {action}

//         <ArrowRightIcon
//           size={13}
//           className="transition-transform duration-200 group-hover:translate-x-0.5"
//         />
//       </Link>
//     </div>
//   );
// }

// function ResponsibilityItem({
//   number,
//   label,
//   description,
//   tone,
// }: {
//   number: string;
//   label: string;
//   description: string;
//   tone: "amber" | "green";
// }) {
//   const numberClass =
//     tone === "green"
//       ? "text-[#247e08] dark:text-[#38D200]"
//       : "text-[#8c5800] dark:text-[#F0A23A]";

//   return (
//     <div className="grid grid-cols-[28px_1fr] gap-3 py-4">
//       <span className={["text-[0.48rem] font-black tracking-[0.12em]", numberClass].join(" ")}>
//         {number}
//       </span>

//       <div>
//         <p className="text-xs font-bold text-[#303030] dark:text-white/80">
//           {label}
//         </p>

//         <p className="mt-1 text-[0.58rem] leading-5 text-[#6b6b65] dark:text-white/32">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
// }

// function SharedProjectCore() {
//   return (
//     <div
//       className={[
//         "relative border-y border-black/[0.08]",
//         "bg-[#f5f5f1] p-5",
//         "sm:p-7",
//         "lg:border-x lg:border-y-0 lg:p-6",
//         "dark:border-white/[0.06] dark:bg-[#0c0c0c]",
//       ].join(" ")}
//     >
//       <div className="flex h-full flex-col justify-center">
//         <div className="text-center">
//           <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#303030] text-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#202020]">
//             <LayoutDashboardIcon size={17} />
//           </span>

//           <PreviewLabel className="mt-4">Shared project</PreviewLabel>

//           <h4 className="mt-2 text-lg font-black tracking-[-0.025em] text-[#303030] dark:text-white">
//             One source of truth.
//           </h4>

//           <p className="mx-auto mt-2 max-w-xs text-[0.62rem] leading-5 text-[#666660] dark:text-white/34">
//             Scope, people, tasks, status and completion stay attached to the
//             same project.
//           </p>
//         </div>

//         <div className="relative mx-auto my-6 h-16 w-px bg-black/[0.10] dark:bg-white/[0.08]">
//           <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
//         </div>

//         <div className="space-y-2">
//           <SharedProjectSignal icon={FileTextIcon} label="Project brief" />
//           <SharedProjectSignal icon={UsersIcon} label="Project team" />
//           <SharedProjectSignal icon={LayoutDashboardIcon} label="Task progress" />
//           <SharedProjectSignal icon={CircleCheckBigIcon} label="Completion" />
//         </div>
//       </div>
//     </div>
//   );
// }

// function SharedProjectSignal({
//   icon: Icon,
//   label,
// }: {
//   icon: LucideIcon;
//   label: string;
// }) {
//   return (
//     <div className="flex items-center gap-2.5 rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
//       <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black/[0.045] text-[#55554f] dark:bg-white/[0.05] dark:text-[#DEDA00]">
//         <Icon size={11} />
//       </span>

//       <span className="text-[0.56rem] font-semibold text-[#55554f] dark:text-white/50">
//         {label}
//       </span>

//       <CheckCircle2Icon
//         size={11}
//         className="ml-auto text-[#247e08] dark:text-[#38D200]"
//       />
//     </div>
//   );
// }

// function SharedProjectFooter() {
//   return (
//     <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.08] bg-[#fafaf7] px-5 py-4 sm:px-7 dark:border-white/[0.06] dark:bg-[#151515]">
//       <div className="flex items-center gap-2">
//         <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />

//         <span className="text-[0.55rem] font-medium text-[#5f5f59] dark:text-white/38">
//           3 Allocats accepted
//         </span>
//       </div>

//       <span className="text-[0.55rem] font-medium text-[#5f5f59] dark:text-white/30">
//         12 tasks · 7 complete · Due 30 Oct
//       </span>
//     </div>
//   );
// }

// /* =========================================================
//    PROFILE
// ========================================================= */

// function ProfileSection() {
//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-white py-20 dark:border-white/[0.07] dark:bg-[#141414] sm:py-24 lg:py-32">
//       <SoftAtmosphere position="left" />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="grid gap-10 sm:gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16">
//           <div>
//             <SectionEyebrow>Before the invitation</SectionEyebrow>

//             <SectionTitle>
//               More context than{" "}
//               <HeadlineAccent>a contact number.</HeadlineAccent>
//             </SectionTitle>

//             <p className="mt-5 max-w-lg text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/42">
//               Allocat profiles bring skills, experience, professional
//               information and project feedback together before the client makes
//               an invitation.
//             </p>
//           </div>

//           <AllocatProfilePreview />
//         </div>
//       </div>
//     </section>
//   );
// }

// function AllocatProfilePreview() {
//   return (
//     <div className="overflow-hidden rounded-[1.25rem] border border-black/[0.11] bg-[#f7f7f4] p-4 shadow-[0_26px_70px_-50px_rgba(0,0,0,0.30)] sm:rounded-[1.5rem] sm:p-6 dark:border-white/[0.08] dark:bg-[#0A0A0A] dark:shadow-2xl dark:shadow-black/30">
//       <div className="flex items-center gap-4 border-b border-black/[0.09] pb-5 sm:gap-5 sm:pb-6 dark:border-white/[0.07]">
//         <ProfileAvatar avatar="tawanda" size="xl" />

//         <div className="min-w-0">
//           <div className="flex flex-wrap items-center gap-2">
//             <h3 className="truncate text-lg font-black text-[#303030] sm:text-xl dark:text-white">
//               Tawanda Moyo
//             </h3>

//             <BadgeCheckIcon
//               size={15}
//               className="shrink-0 text-[#55554f] dark:text-[#DEDA00]"
//             />
//           </div>

//           <p className="mt-1 text-xs font-medium text-[#5f5f59] dark:text-white/44">
//             Electrical specialist
//           </p>

//           <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.55rem] text-[#676761] sm:gap-4 sm:text-[0.57rem] dark:text-white/30">
//             <span className="flex items-center gap-1.5">
//               <MapPinIcon size={11} />
//               Harare
//             </span>

//             <span className="flex items-center gap-1.5">
//               <StarIcon size={11} className="fill-[#F0A23A] text-[#F0A23A]" />
//               4.9
//             </span>
//           </div>
//         </div>

//         <div className="ml-auto hidden text-right sm:block">
//           <p className="text-2xl font-black text-[#303030] dark:text-white">
//             8
//           </p>

//           <p className="text-[0.5rem] uppercase tracking-[0.11em] text-[#686862] dark:text-white/26">
//             years experience
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-5 py-5 sm:grid-cols-3 sm:gap-6 sm:py-6">
//         <ProfileDetail label="Hourly rate" value="$18 / hour" />
//         <ProfileDetail label="Experience" value="8 years" />

//         <div className="hidden sm:block">
//           <ProfileDetail label="Rating" value="4.9 / 5" accent={amber} />
//         </div>
//       </div>

//       <div className="border-t border-black/[0.09] pt-5 sm:pt-6 dark:border-white/[0.07]">
//         <PreviewLabel>Skills</PreviewLabel>

//         <div className="mt-3 flex flex-wrap gap-2">
//           <SkillTag>Electrical wiring</SkillTag>
//           <SkillTag>Installation</SkillTag>

//           <div className="hidden sm:block">
//             <SkillTag>Fault finding</SkillTag>
//           </div>

//           <div className="hidden sm:block">
//             <SkillTag>Lighting</SkillTag>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 hidden border-t border-black/[0.09] pt-6 sm:block dark:border-white/[0.07]">
//         <PreviewLabel>About</PreviewLabel>

//         <p className="mt-3 max-w-xl text-xs leading-6 text-[#60605a] dark:text-white/40">
//           Experienced electrical professional focused on residential and
//           commercial installation, maintenance and fault diagnosis.
//         </p>
//       </div>

//       <div className="mt-5 flex justify-end border-t border-black/[0.09] pt-4 sm:mt-6 sm:pt-5 dark:border-white/[0.07]">
//         <span className="inline-flex items-center gap-2 text-[0.58rem] font-semibold text-[#303030] dark:text-[#DEDA00]">
//           View profile
//           <ArrowRightIcon size={11} />
//         </span>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    COMPLETION
// ========================================================= */

// function CompletionSection() {
//   return (
//     <section className="relative overflow-hidden border-b border-black/[0.09] bg-[#f3f3ef] py-20 dark:border-white/[0.07] dark:bg-[#080808] sm:py-24 lg:py-32">
//       <SoftAtmosphere position="center" />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="mx-auto max-w-5xl text-center">
//           <SectionEyebrow center>Completion</SectionEyebrow>

//           <SectionTitle center>
//             Completion is a{" "}
//             <HeadlineAccent>handshake.</HeadlineAccent>
//           </SectionTitle>

//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base dark:text-white/42">
//             The project team submits the work. The client reviews it. Only then
//             does the project close.
//           </p>
//         </div>

//         <div className="mx-auto mt-10 grid max-w-6xl gap-3 sm:mt-16 sm:gap-6 lg:grid-cols-[1fr_120px_1fr] lg:items-center">
//           <CompletionSubmitCard />
//           <CompletionSignal />
//           <CompletionReviewCard />
//         </div>

//         <RatingsPreview />
//       </div>
//     </section>
//   );
// }

// function CompletionSubmitCard() {
//   return (
//     <div className="relative overflow-hidden rounded-[1.15rem] border border-black/[0.11] bg-white p-5 sm:rounded-[1.3rem] sm:p-7 dark:border-white/[0.08] dark:bg-[#171717]">
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#38D200]/[0.045] blur-3xl dark:bg-[#38D200]/[0.025]"
//       />

//       <div className="relative">
//         <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#38D200]/[0.09] text-[#247e08] dark:text-[#38D200]">
//           <CircleCheckBigIcon size={17} />
//         </span>

//         <PreviewLabel className="mt-5 sm:mt-7">Allocat</PreviewLabel>

//         <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#303030] sm:text-2xl dark:text-white">
//           Mark project complete?
//         </h3>

//         <p className="mt-3 hidden text-sm leading-7 text-[#60605a] sm:block dark:text-white/40">
//           The project is ready to be sent to the client for completion
//           confirmation.
//         </p>

//         <div className="mt-6 hidden rounded-lg border border-[#38D200]/20 bg-[#38D200]/[0.055] p-3.5 sm:block">
//           <p className="text-[0.6rem] font-semibold text-[#247e08] dark:text-[#38D200]">
//             All project tasks are complete.
//           </p>
//         </div>

//         <div className="mt-5 border-t border-black/[0.09] pt-4 sm:mt-6 sm:pt-5 dark:border-white/[0.07]">
//           <span
//             className={[
//               "inline-flex rounded-lg px-4 py-2.5 text-[0.58rem] font-bold",
//               previewPrimaryAction,
//             ].join(" ")}
//           >
//             Send for confirmation
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CompletionSignal() {
//   const reduceMotion = useReducedMotion();

//   return (
//     <div className="relative hidden min-h-24 items-center justify-center lg:flex">
//       <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-black/[0.14] to-transparent dark:via-white/[0.08]" />

//       <motion.div
//         animate={reduceMotion ? undefined : { x: [-10, 10, -10] }}
//         transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//         className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.14] bg-white text-[#303030] dark:border-[#DEDA00]/30 dark:bg-[#151515] dark:text-[#DEDA00]"
//       >
//         <SendIcon size={15} />
//       </motion.div>
//     </div>
//   );
// }

// function CompletionReviewCard() {
//   return (
//     <div className="relative overflow-hidden rounded-[1.15rem] border border-black/[0.11] bg-white p-5 sm:rounded-[1.3rem] sm:p-7 dark:border-white/[0.08] dark:bg-[#171717]">
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#F0A23A]/[0.05] blur-3xl dark:bg-[#F0A23A]/[0.025]"
//       />

//       <div className="relative">
//         <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0A23A]/[0.09] text-[#8c5800] dark:text-[#F0A23A]">
//           <Clock3Icon size={17} />
//         </span>

//         <PreviewLabel className="mt-5 sm:mt-7">Client</PreviewLabel>

//         <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#303030] sm:text-2xl dark:text-white">
//           Confirm project completion
//         </h3>

//         <p className="mt-3 hidden text-sm leading-7 text-[#60605a] sm:block dark:text-white/40">
//           Confirm the finished work or send the project back if more work is
//           needed.
//         </p>

//         <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6">
//           <span className="hidden items-center gap-1.5 rounded-lg border border-[#AD3A12]/25 bg-white px-3 py-2 text-[0.56rem] font-semibold text-[#8c3f23] sm:inline-flex dark:bg-transparent dark:text-[#c86a49]">
//             <AlertTriangleIcon size={11} />
//             Needs more work
//           </span>

//           <span
//             className={[
//               "rounded-lg px-3 py-2 text-[0.56rem] font-bold",
//               previewPrimaryAction,
//             ].join(" ")}
//           >
//             Confirm completion
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RatingsPreview() {
//   return (
//     <div className="mx-auto mt-8 hidden max-w-2xl rounded-xl border border-black/[0.11] bg-white p-6 sm:block dark:border-white/[0.08] dark:bg-[#141414]">
//       <div className="flex items-center">
//         <div>
//           <PreviewLabel>After completion</PreviewLabel>

//           <h4 className="mt-1.5 text-sm font-bold text-[#303030] dark:text-white">
//             Rate your Allocats
//           </h4>
//         </div>

//         <div className="ml-auto flex items-center gap-1">
//           {[1, 2, 3, 4, 5].map(value => (
//             <StarIcon
//               key={value}
//               size={16}
//               className={
//                 value <= 4
//                   ? "fill-[#F0A23A] text-[#F0A23A]"
//                   : "text-black/20 dark:text-white/15"
//               }
//             />
//           ))}

//           <span className="ml-2 text-[0.58rem] font-semibold text-[#5f5f59] dark:text-white/38">
//             4/5
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    FINAL CTA
// ========================================================= */

// function FinalCta({
//   postProjectHref,
//   allocatHref,
//   allocatLabel,
// }: {
//   postProjectHref: string;
//   allocatHref: string;
//   allocatLabel: string;
// }) {
//   return (
//     <section className="relative overflow-hidden bg-[#f7f7f4] py-20 dark:bg-[#111111] sm:py-24 lg:py-32">
//       <GridTexture />

//       <div
//         aria-hidden
//         className={[
//           "pointer-events-none absolute left-1/2 top-[30%]",
//           "h-[34rem] w-[74rem] -translate-x-1/2 rounded-[50%]",
//           "bg-[#303030]/[0.030] blur-[120px]",
//           "dark:bg-white/[0.016]",
//         ].join(" ")}
//       />

//       <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
//         <div className="mx-auto max-w-5xl text-center">
//           <p className="text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-[#60605a] sm:text-[0.58rem] sm:tracking-[0.2em] dark:text-white/30">
//             Ready when the work is
//           </p>

//           <h2 className="mt-5 text-[2.8rem] font-black leading-[0.9] tracking-[-0.055em] text-[#303030] sm:mt-6 sm:text-6xl lg:text-7xl dark:text-white">
//             There's work to be done.

//             <HeadlineAccent block>
//               Allocate it properly.
//             </HeadlineAccent>
//           </h2>

//           <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#5f5f59] sm:mt-7 sm:text-base dark:text-white/42">
//             Start with the project, find the people you need and keep the work
//             moving in one place.
//           </p>

//           <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-black/[0.11] bg-white p-2 shadow-[0_18px_50px_-38px_rgba(0,0,0,0.24)] sm:mt-10 dark:border-white/[0.08] dark:bg-[#090909] dark:shadow-none">
//             <Link
//               to={postProjectHref}
//               className="group flex min-h-13 items-center gap-3 rounded-lg px-3 text-left transition-colors hover:bg-[#f4f4f1] sm:min-h-14 sm:gap-4 sm:px-5 dark:hover:bg-white/[0.035]"
//             >
//               <SearchIcon
//                 size={15}
//                 className="shrink-0 text-[#55554f] sm:size-4 dark:text-[#DEDA00]"
//               />

//               <span className="min-w-0 flex-1 text-sm text-[#686862] dark:text-white/38">
//                 What needs doing?
//               </span>

//               <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#202020]">
//                 <ArrowRightIcon
//                   size={14}
//                   className="transition-transform group-hover:translate-x-0.5"
//                 />
//               </span>
//             </Link>
//           </div>

//           <div className="mt-5 hidden flex-wrap justify-center gap-2 sm:flex">
//             <SkillTag>Electrical</SkillTag>
//             <SkillTag>Carpentry</SkillTag>
//             <SkillTag>Construction</SkillTag>
//             <SkillTag>Painting</SkillTag>
//             <SkillTag>Repairs</SkillTag>
//             <SkillTag>Transport</SkillTag>
//           </div>

//           <div className="mt-9 grid gap-2.5 border-t border-black/[0.09] pt-7 sm:mt-12 sm:grid-cols-2 sm:gap-3 sm:pt-8 dark:border-white/[0.07]">
//             <CtaChoice
//               href={postProjectHref}
//               eyebrow="Need the work done?"
//               title="Start a project"
//               icon={FileTextIcon}
//               tone="amber"
//             />

//             <CtaChoice
//               href={allocatHref}
//               eyebrow="Have the skills?"
//               title={allocatLabel}
//               icon={BriefcaseBusinessIcon}
//               tone="green"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function CtaChoice({
//   href,
//   eyebrow,
//   title,
//   icon: Icon,
//   tone,
// }: {
//   href: string;
//   eyebrow: string;
//   title: string;
//   icon: LucideIcon;
//   tone: "amber" | "green";
// }) {
//   const accent =
//     tone === "green"
//       ? {
//           icon: "bg-[#38D200]/[0.09] text-[#247e08] dark:text-[#38D200]",
//           wash: "hover:bg-[#38D200]/[0.025] dark:hover:bg-[#38D200]/[0.025]",
//         }
//       : {
//           icon: "bg-[#F0A23A]/[0.10] text-[#8c5800] dark:text-[#F0A23A]",
//           wash: "hover:bg-[#F0A23A]/[0.025] dark:hover:bg-[#F0A23A]/[0.025]",
//         };

//   return (
//     <Link
//       to={href}
//       className={[
//         "group flex items-center gap-4 rounded-xl border border-black/[0.10]",
//         "bg-white/80 p-4 text-left transition-all",
//         "hover:-translate-y-0.5",
//         "hover:shadow-[0_16px_40px_-30px_rgba(0,0,0,0.30)]",
//         "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#303030]/15",
//         "sm:p-5",
//         "dark:border-white/[0.07] dark:bg-white/[0.018]",
//         "dark:hover:shadow-none dark:focus-visible:ring-[#DEDA00]/15",
//         accent.wash,
//       ].join(" ")}
//     >
//       <span
//         className={[
//           "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
//           accent.icon,
//         ].join(" ")}
//       >
//         <Icon size={15} />
//       </span>

//       <div className="min-w-0 flex-1">
//         <p className="text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-[#686862] sm:text-[0.52rem] sm:tracking-[0.14em] dark:text-white/26">
//           {eyebrow}
//         </p>

//         <p className="mt-1.5 truncate text-sm font-bold text-[#303030] dark:text-white">
//           {title}
//         </p>
//       </div>

//       <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00] transition-transform group-hover:translate-x-0.5 dark:bg-[#DEDA00] dark:text-[#202020]">
//         <ArrowRightIcon size={13} />
//       </span>
//     </Link>
//   );
// }

// /* =========================================================
//    PROFILE AVATAR
// ========================================================= */

// function ProfileAvatar({
//   avatar,
//   size = "md",
//   overlap = false,
// }: {
//   avatar: AvatarKey;
//   size?: "sm" | "md" | "lg" | "xl";
//   overlap?: boolean;
// }) {
//   const sizeClass =
//     size === "xl"
//       ? "h-14 w-14 sm:h-16 sm:w-16"
//       : size === "lg"
//         ? "h-12 w-12"
//         : size === "sm"
//           ? "h-8 w-8"
//           : "h-10 w-10";

//   return (
//     <span
//       className={[
//         "relative block shrink-0 overflow-hidden rounded-full",
//         "border border-black/[0.10] bg-[#e7e7e2]",
//         "dark:border-white/[0.10] dark:bg-[#1a1a1a]",
//         overlap ? "ring-2 ring-white dark:ring-[#1A1A1A]" : "",
//         sizeClass,
//       ].join(" ")}
//     >
//       <img
//         src={profileAvatars[avatar]}
//         alt=""
//         loading="lazy"
//         decoding="async"
//         className="h-full w-full object-cover object-center"
//       />
//     </span>
//   );
// }

// /* =========================================================
//    BACKGROUND SYSTEM
// ========================================================= */

// function NeonWaveField({
//   variant = "lime",
//   side = "right",
//   top = "18%",
//   flip = false,
// }: {
//   variant?: "lime" | "neutral";
//   side?: "left" | "center" | "right";
//   top?: string;
//   flip?: boolean;
// }) {
//   const reduceMotion = useReducedMotion();

//   const colorClass =
//     variant === "lime"
//       ? "text-[#777400] dark:text-[#DEDA00]"
//       : "text-[#303030] dark:text-white";

//   const horizontalClass =
//     side === "left"
//       ? "left-[-54rem] sm:left-[-42vw]"
//       : side === "right"
//         ? "right-[-54rem] sm:right-[-42vw]"
//         : "left-1/2 -translate-x-1/2";

//   return (
//     <div
//       aria-hidden
//       className={[
//         "pointer-events-none absolute z-0",
//         "h-[28rem] w-[112rem]",
//         "sm:h-[34rem] sm:w-[180vw] sm:min-w-[1800px]",
//         horizontalClass,
//         colorClass,
//         "opacity-[0.025] sm:opacity-[0.035]",
//         "dark:opacity-[0.055] sm:dark:opacity-[0.075]",
//       ].join(" ")}
//       style={{
//         top,
//         maskImage:
//           "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.015) 4%, rgba(0,0,0,0.08) 10%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0.8) 34%, black 44%, black 56%, rgba(0,0,0,0.8) 66%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.08) 90%, rgba(0,0,0,0.015) 96%, transparent 100%)",
//         WebkitMaskImage:
//           "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.015) 4%, rgba(0,0,0,0.08) 10%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0.8) 34%, black 44%, black 56%, rgba(0,0,0,0.8) 66%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.08) 90%, rgba(0,0,0,0.015) 96%, transparent 100%)",
//       }}
//     >
//       <motion.div
//         animate={reduceMotion ? undefined : { x: [0, 5, 0], y: [0, -3, 0] }}
//         transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
//         className="h-full w-full"
//       >
//         <svg
//           viewBox="0 0 2400 580"
//           preserveAspectRatio="none"
//           className="h-full w-full overflow-visible"
//           style={{ transform: flip ? "scaleX(-1)" : undefined }}
//         >
//           <g fill="none" stroke="currentColor" strokeLinecap="round">
//             <path
//               d="
//                 M -420 385
//                 C -80 132, 230 108, 525 258
//                 C 815 406, 1075 401, 1340 237
//                 C 1601 77, 1841 92, 2088 251
//                 C 2310 394, 2510 353, 2740 179
//               "
//               strokeWidth="18"
//               opacity="0.04"
//               style={{ filter: "blur(22px)" }}
//             />

//             <path
//               d="
//                 M -420 385
//                 C -80 132, 230 108, 525 258
//                 C 815 406, 1075 401, 1340 237
//                 C 1601 77, 1841 92, 2088 251
//                 C 2310 394, 2510 353, 2740 179
//               "
//               strokeWidth="0.9"
//               opacity="0.78"
//             />

//             <path
//               d="
//                 M -455 438
//                 C -95 247, 246 196, 560 322
//                 C 852 439, 1118 430, 1378 304
//                 C 1634 179, 1880 181, 2120 296
//                 C 2355 410, 2547 373, 2768 260
//               "
//               strokeWidth="0.65"
//               opacity="0.26"
//             />

//             <path
//               d="
//                 M -382 309
//                 C -52 61, 257 47, 566 208
//                 C 854 357, 1110 343, 1372 170
//                 C 1606 14, 1870 26, 2118 175
//                 C 2355 318, 2550 281, 2750 153
//               "
//               strokeWidth="0.55"
//               opacity="0.13"
//             />
//           </g>
//         </svg>
//       </motion.div>
//     </div>
//   );
// }

// function GridTexture() {
//   return (
//     <>
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 dark:hidden"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(48,48,48,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(48,48,48,0.032) 1px, transparent 1px)",
//           backgroundSize: "56px 56px",
//           maskImage:
//             "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.72) 34%, transparent 78%)",
//           WebkitMaskImage:
//             "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.72) 34%, transparent 78%)",
//         }}
//       />

//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 hidden dark:block"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
//           backgroundSize: "56px 56px",
//           maskImage:
//             "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.65) 34%, transparent 78%)",
//           WebkitMaskImage:
//             "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.65) 34%, transparent 78%)",
//         }}
//       />
//     </>
//   );
// }

// function ArchitecturalColumns() {
//   return (
//     <div
//       aria-hidden
//       className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-4"
//     >
//       <span className="border-r border-black/[0.03] dark:border-white/[0.022]" />
//       <span className="border-r border-black/[0.03] dark:border-white/[0.022]" />
//       <span className="border-r border-black/[0.03] dark:border-white/[0.022]" />
//       <span />
//     </div>
//   );
// }

// function SoftAtmosphere({
//   position = "center",
// }: {
//   position?: "left" | "center" | "right";
// }) {
//   const positionClass =
//     position === "left"
//       ? "-left-[16rem]"
//       : position === "right"
//         ? "-right-[16rem]"
//         : "left-1/2 -translate-x-1/2";

//   return (
//     <div
//       aria-hidden
//       className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
//     >
//       <div
//         className={[
//           "absolute top-[20%] h-[36rem] w-[36rem] rounded-full blur-[140px]",
//           "bg-[#303030]/[0.024] dark:bg-white/[0.014]",
//           positionClass,
//         ].join(" ")}
//       />
//     </div>
//   );
// }

// /* =========================================================
//    SHARED
// ========================================================= */

// function BrowserChrome() {
//   return (
//     <div className="flex h-11 items-center gap-2 border-b border-black/[0.09] bg-[#f3f3ef] px-4 dark:border-white/[0.07] dark:bg-[#111111]">
//       <span className="h-2 w-2 rounded-full bg-[#aaa] dark:bg-white/15" />
//       <span className="h-2 w-2 rounded-full bg-[#aaa] dark:bg-white/15" />
//       <span className="h-2 w-2 rounded-full bg-[#aaa] dark:bg-white/15" />

//       <span className="ml-3 truncate rounded-md border border-black/[0.09] bg-white px-3 py-1 text-[0.48rem] text-[#70706a] dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/28">
//         allocatr / projects / kitchen-renovation
//       </span>
//     </div>
//   );
// }

// function PreviewHeading({
//   eyebrow,
//   title,
//   subtitle,
// }: {
//   eyebrow: string;
//   title: string;
//   subtitle: string;
// }) {
//   return (
//     <div className="border-b border-black/[0.09] pb-4 sm:pb-5 dark:border-white/[0.07]">
//       <PreviewLabel>{eyebrow}</PreviewLabel>

//       <h3 className="mt-2 text-lg font-black tracking-[-0.03em] text-[#303030] sm:text-xl dark:text-white">
//         {title}
//       </h3>

//       <p className="mt-2 hidden text-[0.6rem] leading-5 text-[#62625c] sm:block dark:text-white/36">
//         {subtitle}
//       </p>
//     </div>
//   );
// }

// function PreviewField({
//   label,
//   value,
//   wide = false,
//   locked = false,
// }: {
//   label: string;
//   value: string;
//   wide?: boolean;
//   locked?: boolean;
// }) {
//   return (
//     <div
//       className={[
//         "rounded-lg border border-black/[0.10] bg-[#f7f7f4] p-3.5 sm:p-4",
//         "dark:border-white/[0.07] dark:bg-white/[0.025]",
//         wide ? "sm:col-span-2" : "",
//       ].join(" ")}
//     >
//       <div className="flex items-center justify-between gap-4">
//         <PreviewLabel>{label}</PreviewLabel>

//         {locked && (
//           <span className="hidden text-[0.46rem] text-[#767670] sm:block dark:text-white/22">
//             Fixed
//           </span>
//         )}
//       </div>

//       <p className="mt-2 text-xs leading-5 text-[#44443f] sm:leading-6 dark:text-white/62">
//         {value}
//       </p>
//     </div>
//   );
// }

// function PreviewLabel({
//   children,
//   className = "",
// }: {
//   children: ReactNode;
//   className?: string;
// }) {
//   return (
//     <p
//       className={[
//         "text-[0.48rem] font-semibold uppercase tracking-[0.12em]",
//         "text-[#686862] sm:text-[0.5rem] sm:tracking-[0.14em]",
//         "dark:text-white/28",
//         className,
//       ].join(" ")}
//     >
//       {children}
//     </p>
//   );
// }

// function SkillTag({ children }: { children: ReactNode }) {
//   return (
//     <span className="inline-flex rounded-lg border border-black/[0.11] bg-white px-2.5 py-1.5 text-[0.54rem] font-semibold text-[#55554f] sm:text-[0.56rem] dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white/48">
//       {children}
//     </span>
//   );
// }

// function SectionEyebrow({
//   children,
//   center = false,
// }: {
//   children: ReactNode;
//   center?: boolean;
// }) {
//   return (
//     <div className={["flex items-center gap-2.5", center ? "justify-center" : ""].join(" ")}>
//       <span className="h-1.5 w-1.5 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />

//       <span className="text-[0.53rem] font-semibold uppercase tracking-[0.17em] text-[#5e5e58] sm:text-[0.56rem] sm:tracking-[0.2em] dark:text-white/32">
//         {children}
//       </span>
//     </div>
//   );
// }

// function SectionTitle({
//   children,
//   center = false,
// }: {
//   children: ReactNode;
//   center?: boolean;
// }) {
//   return (
//     <h2
//       className={[
//         "mt-4 max-w-5xl text-[2.4rem] font-black leading-[0.94] tracking-[-0.045em]",
//         "text-[#303030] dark:text-white",
//         "sm:mt-5 sm:text-5xl sm:leading-[0.92] sm:tracking-[-0.05em]",
//         "lg:text-6xl",
//         center ? "mx-auto" : "",
//       ].join(" ")}
//     >
//       {children}
//     </h2>
//   );
// }

// function HeadlineAccent({
//   children,
//   block = false,
// }: {
//   children: ReactNode;
//   block?: boolean;
// }) {
//   return (
//     <span className={["text-[#303030] dark:text-[#DEDA00]", block ? "block" : ""].join(" ")}>
//       {children}
//     </span>
//   );
// }

// function HeroProof({ children }: { children: ReactNode }) {
//   return (
//     <span className="inline-flex items-center gap-2 text-[0.58rem] font-medium text-[#5f5f59] sm:text-[0.62rem] dark:text-white/36">
//       <CheckCircle2Icon size={12} className="text-[#247e08] dark:text-[#38D200]" />
//       {children}
//     </span>
//   );
// }

// function ProjectProgressBar({
//   value,
//   className = "",
// }: {
//   value: number;
//   className?: string;
// }) {
//   const progress = Math.max(0, Math.min(100, value));

//   return (
//     <div
//       className={[
//         "h-[3px] overflow-hidden rounded-full bg-black/[0.09]",
//         "dark:bg-white/[0.07]",
//         className,
//       ].join(" ")}
//     >
//       <motion.div
//         initial={{ width: 0 }}
//         whileInView={{ width: `${progress}%` }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.7, ease: "easeOut" }}
//         className="h-full rounded-full bg-[#303030] dark:bg-[#DEDA00]"
//       />
//     </div>
//   );
// }

// function ProfileDetail({
//   label,
//   value,
//   accent,
// }: {
//   label: string;
//   value: string;
//   accent?: string;
// }) {
//   return (
//     <div>
//       <PreviewLabel>{label}</PreviewLabel>

//       <p
//         className="mt-2 text-xs font-bold text-[#303030] sm:text-sm dark:text-white"
//         style={accent ? { color: accent } : undefined}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// export default LandingPage;

import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  FileCheck2Icon,
  FileTextIcon,
  HammerIcon,
  HardHatIcon,
  Layers3Icon,
  MapPinIcon,
  MessageSquareIcon,
  PaintbrushIcon,
  SearchIcon,
  SendIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

import assets from "@/assets/assets";
import { useAuth } from "@/auth/useAuth";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

/* =========================================================
   BRAND
========================================================= */

const lime = "#DEDA00";
const green = "#38D200";
const amber = "#F0A23A";
const red = "#AD3A12";

const primaryButton = [
  "bg-[#303030] text-[#DEDA00]",
  "hover:bg-[#202020] hover:text-[#DEDA00]",
  "dark:bg-[#DEDA00] dark:text-[#202020]",
  "dark:hover:bg-[#d3cf00] dark:hover:text-[#202020]",
].join(" ");

const outlineButton = [
  "border-black/[0.13] bg-white text-[#303030]",
  "hover:border-black/[0.20] hover:bg-[#f4f4f1] hover:text-[#303030]",
  "dark:border-white/[0.11] dark:bg-white/[0.025] dark:text-white",
  "dark:hover:border-white/[0.18] dark:hover:bg-white/[0.05]",
].join(" ");

/* =========================================================
   PROFILE MEDIA
========================================================= */

type AvatarKey = "tawanda" | "leroy" | "kuda" | "tatenda";

const profileAvatars: Record<AvatarKey, string> = {
  tawanda:
    "https://images.pexels.com/photos/34592823/pexels-photo-34592823.jpeg?auto=compress&cs=tinysrgb&w=320",
  leroy:
    "https://images.pexels.com/photos/20595361/pexels-photo-20595361/free-photo-of-portrait-of-a-man-smiling.jpeg?auto=compress&cs=tinysrgb&w=320",
  kuda:
    "https://images.pexels.com/photos/18744477/pexels-photo-18744477/free-photo-of-portrait-of-an-african-man.jpeg?auto=compress&cs=tinysrgb&w=320",
  tatenda:
    "https://images.pexels.com/photos/19379640/pexels-photo-19379640.jpeg?auto=compress&cs=tinysrgb&w=320",
};

/* =========================================================
   DATA
========================================================= */

const lifecycleStages = [
  {
    number: "01",
    label: "Pending",
    title: "Project created",
    description: "The brief, schedule and required skills are defined.",
    signal: "pending" as const,
  },
  {
    number: "02",
    label: "Allocated",
    title: "Team accepted",
    description: "The right people join the project and work can begin.",
    signal: "active" as const,
  },
  {
    number: "03",
    label: "Active",
    title: "Work moving",
    description: "Tasks, ownership, deadlines and progress stay visible.",
    signal: "active" as const,
  },
  {
    number: "04",
    label: "Complete",
    title: "Client confirmed",
    description: "Finished work is reviewed and the project formally closes.",
    signal: "complete" as const,
  },
];

const allocationRoles = [
  {
    icon: ZapIcon,
    role: "Electrical",
    person: "Tawanda M.",
    avatar: "tawanda" as AvatarKey,
    title: "Electrical specialist",
    experience: "8 years experience",
    tone: "amber" as const,
    rotation: -6,
  },
  {
    icon: HammerIcon,
    role: "Carpentry",
    person: "Leroy N.",
    avatar: "leroy" as AvatarKey,
    title: "Carpenter & joiner",
    experience: "6 years experience",
    tone: "neutral" as const,
    rotation: -2,
  },
  {
    icon: PaintbrushIcon,
    role: "Painting",
    person: "Kuda M.",
    avatar: "kuda" as AvatarKey,
    title: "Painter & finisher",
    experience: "5 years experience",
    tone: "green" as const,
    rotation: 3,
  },
  {
    icon: HardHatIcon,
    role: "Construction",
    person: "Tatenda R.",
    avatar: "tatenda" as AvatarKey,
    title: "Construction specialist",
    experience: "7 years experience",
    tone: "neutral" as const,
    rotation: 7,
  },
];

const workCategories = [
  {
    icon: ZapIcon,
    title: "Electrical",
    detail: "Wiring · lighting · installations · fault finding",
    iconClass: "text-[#8c5800] dark:text-[#F0A23A]",
    surface: "bg-[#F0A23A]/[0.11]",
    signal: "bg-[#F0A23A]",
  },
  {
    icon: HammerIcon,
    title: "Carpentry & joinery",
    detail: "Cabinetry · furniture · fittings · repairs",
    iconClass: "text-[#50504a] dark:text-[#DEDA00]",
    surface: "bg-black/[0.055] dark:bg-[#DEDA00]/[0.08]",
    signal: "bg-[#303030] dark:bg-[#DEDA00]",
  },
  {
    icon: HardHatIcon,
    title: "Construction",
    detail: "Building · renovations · tiling · structural work",
    iconClass: "text-[#50504a] dark:text-white/70",
    surface: "bg-black/[0.055] dark:bg-white/[0.055]",
    signal: "bg-[#303030] dark:bg-white/45",
  },
  {
    icon: PaintbrushIcon,
    title: "Painting & finishing",
    detail: "Preparation · painting · decorating · finishing",
    iconClass: "text-[#8c5800] dark:text-[#F0A23A]",
    surface: "bg-[#F0A23A]/[0.11]",
    signal: "bg-[#F0A23A]",
  },
  {
    icon: WrenchIcon,
    title: "Repairs & maintenance",
    detail: "Property repairs · installations · general maintenance",
    iconClass: "text-[#247c08] dark:text-[#38D200]",
    surface: "bg-[#38D200]/[0.10]",
    signal: "bg-[#38D200]",
  },
  {
    icon: TruckIcon,
    title: "Transport & delivery",
    detail: "Moving · delivery · courier work · transport",
    iconClass: "text-[#50504a] dark:text-[#DEDA00]",
    surface: "bg-black/[0.055] dark:bg-[#DEDA00]/[0.08]",
    signal: "bg-[#303030] dark:bg-[#DEDA00]",
  },
];

/* =========================================================
   PAGE
========================================================= */

function LandingPage() {
  const { user } = useAuth();

  const postProjectHref = user ? "/projects/new" : "/register";
  const allocatHref = user?.isAllocat ? "/projects" : "/become-an-allocat";
  const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";

  return (
    <>
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-[#f6f6f3] text-[#303030] dark:bg-[#080808] dark:text-white">
        <HeroSection postProjectHref={postProjectHref} />
        <LifecycleSection />
        <AllocationSection />
        <SkillsSection />
        <WorkspaceSection />
        <ResponsibilitySection />
        <ProfileSection />
        <CompletionSection />

        <FinalCta
          postProjectHref={postProjectHref}
          allocatHref={allocatHref}
          allocatLabel={allocatLabel}
        />
      </main>

      <SiteFooter />
    </>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection({ postProjectHref }: { postProjectHref: string }) {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f7f7f4] dark:border-white/[0.07] dark:bg-[#080808]">
      <GridTexture />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[26%] h-[34rem] w-[76rem] -translate-x-1/2 rounded-full bg-[#F0A23A]/[0.025] blur-[130px] dark:bg-[#DEDA00]/[0.016]"
      />

      <div className="container relative mx-auto px-4 pb-16 pt-14 sm:px-5 sm:pb-20 sm:pt-20 md:px-8 lg:pb-28 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-6xl text-center"
        >
          <div className="inline-flex items-center gap-2.5">
            <img
              src={assets.allocatrIcon}
              alt="Allocatr"
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
            />

            <span className="text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-[#5e5e58] sm:text-[0.58rem] sm:tracking-[0.2em] dark:text-white/38">
              Work, properly allocated
            </span>
          </div>

          <h1 className="mx-auto mt-7 max-w-[13ch] text-[2.9rem] font-black leading-[0.9] tracking-[-0.058em] text-[#303030] sm:mt-8 sm:text-[4.4rem] md:text-[5.5rem] lg:text-[6.6rem] dark:text-white">
            Put the right people on{" "}
            <HeadlineAccent>the right work.</HeadlineAccent>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[0.82rem] leading-6 text-[#5f5f59] sm:mt-7 sm:max-w-2xl sm:text-base sm:leading-8 dark:text-white/48">
            Create the project, find the people it needs and keep execution,
            responsibility and completion connected in one place.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
            <Button
              asChild
              className={[
                "group h-11 rounded-lg px-6 text-xs font-bold shadow-none sm:h-12 sm:px-7",
                primaryButton,
              ].join(" ")}
            >
              <Link to="/discover">
                Find an Allocat

                <ArrowRightIcon
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className={[
                "h-11 rounded-lg px-6 text-xs font-semibold shadow-none sm:h-12 sm:px-7",
                outlineButton,
              ].join(" ")}
            >
              <Link to={postProjectHref}>Create a project</Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2.5 sm:mt-8 sm:gap-x-6">
            <HeroProof>Skills-based discovery</HeroProof>
            <HeroProof>Shared project workspace</HeroProof>

            <div className="hidden sm:block">
              <HeroProof>Client-confirmed completion</HeroProof>
            </div>
          </div>
        </motion.div>

        <HeroProductScene />
      </div>
    </section>
  );
}

/* =========================================================
   HERO PRODUCT
========================================================= */

function HeroProductScene() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto mt-12 max-w-6xl sm:mt-16 lg:mt-20"
    >
      <div className="absolute -left-3 top-12 hidden h-20 w-1 rounded-full bg-[#F0A23A] lg:block" />
      <div className="absolute -right-3 bottom-16 hidden h-16 w-1 rounded-full bg-[#38D200] lg:block" />

      <div
        className={[
          "overflow-hidden rounded-[1.25rem] border border-black/[0.10]",
          "bg-[#303030] shadow-[0_32px_90px_-54px_rgba(0,0,0,0.38)]",
          "sm:rounded-[1.6rem]",
          "dark:border-white/[0.08] dark:bg-[#111111]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-white/[0.09] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#DEDA00] opacity-20" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#DEDA00]" />
            </span>

            <span className="text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-white/48">
              Allocatr project workspace
            </span>
          </div>

          <span className="hidden text-[0.54rem] text-white/24 sm:block">
            AL-0182
          </span>
        </div>

        <div className="grid gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
          <HeroProjectSummary />
          <HeroPeoplePanel />
        </div>
      </div>
    </motion.div>
  );
}

function HeroProjectSummary() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#242424] p-4 text-white sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DEDA00] text-[#303030]">
            <WrenchIcon size={15} />
          </span>

          <div className="min-w-0">
            <p className="text-[0.48rem] font-semibold uppercase tracking-[0.13em] text-white/34">
              Home improvement
            </p>

            <h3 className="mt-1.5 truncate text-lg font-black tracking-[-0.025em] sm:text-xl">
              Kitchen renovation
            </h3>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.54rem] font-semibold text-[#DEDA00]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#DEDA00]" />
          Active
        </span>
      </div>

      <p className="mt-5 text-xs leading-6 text-white/42 sm:text-sm sm:leading-7">
        Replace cabinetry, update electrical fittings and complete final
        finishing before handover.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 border-y border-white/[0.08] py-4">
        <DarkStat label="Skills" value="04" />
        <DarkStat label="Team" value="03" />
        <DarkStat label="Due" value="30 Oct" />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-white/30">
            Progress
          </span>

          <span className="text-xs font-black">68%</span>
        </div>

        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.09]">
          <div className="h-full w-[68%] rounded-full bg-[#DEDA00]" />
        </div>
      </div>
    </div>
  );
}

function HeroPeoplePanel() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white p-4 sm:p-5 dark:bg-[#181818]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <PreviewLabel>Recommended team</PreviewLabel>

          <h3 className="mt-1.5 text-sm font-black text-[#303030] sm:text-base dark:text-white">
            Matching project skills
          </h3>
        </div>

        <span className="hidden rounded-full bg-[#F0A23A]/[0.10] px-2.5 py-1 text-[0.52rem] font-semibold text-[#8c5800] sm:inline-flex dark:text-[#F0A23A]">
          3 matches
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        <HeroPerson
          avatar="tawanda"
          name="Tawanda Moyo"
          role="Electrical specialist"
          skill="Electrical wiring"
          tone="amber"
        />

        <HeroPerson
          avatar="leroy"
          name="Leroy Nyathi"
          role="Carpenter & joiner"
          skill="Carpentry"
          tone="neutral"
        />

        <HeroPerson
          avatar="kuda"
          name="Kuda M."
          role="Painter & finisher"
          skill="Painting"
          tone="green"
        />
      </div>
    </div>
  );
}

function HeroPerson({
  avatar,
  name,
  role,
  skill,
  tone,
}: {
  avatar: AvatarKey;
  name: string;
  role: string;
  skill: string;
  tone: "amber" | "green" | "neutral";
}) {
  const toneClass =
    tone === "amber"
      ? "bg-[#F0A23A]/[0.10] text-[#8c5800] dark:text-[#F0A23A]"
      : tone === "green"
        ? "bg-[#38D200]/[0.08] text-[#247c08] dark:text-[#38D200]"
        : "bg-black/[0.05] text-[#55554f] dark:bg-white/[0.05] dark:text-white/48";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-black/[0.07] bg-[#fafaf8] p-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
      <ProfileAvatar avatar={avatar} size="md" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-[#303030] dark:text-white">
          {name}
        </p>

        <p className="mt-0.5 truncate text-[0.53rem] text-[#696963] dark:text-white/34">
          {role}
        </p>
      </div>

      <span
        className={[
          "hidden rounded-md px-2.5 py-1.5 text-[0.5rem] font-semibold sm:inline-flex",
          toneClass,
        ].join(" ")}
      >
        {skill}
      </span>
    </div>
  );
}

/* =========================================================
   LIFECYCLE
========================================================= */

function LifecycleSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-white py-20 dark:border-white/[0.07] dark:bg-[#141414] sm:py-24 lg:py-32">
      <ArchitecturalColumns />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.76fr_1.24fr] lg:items-end lg:gap-16">
          <div>
            <SectionEyebrow>Project lifecycle</SectionEyebrow>

            <SectionTitle>
              The work has state.{" "}
              <HeadlineAccent>You can see where it is.</HeadlineAccent>
            </SectionTitle>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#5f5f59] sm:text-base sm:leading-8 lg:justify-self-end dark:text-white/42">
            Every project follows a visible path from brief to allocation,
            execution and client-confirmed completion.
          </p>
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mt-20">
          <LifecycleRail />

          <div className="relative grid gap-3 sm:grid-cols-2 sm:gap-7 md:grid-cols-4 md:gap-6">
            {lifecycleStages.map((stage, index) => (
              <LifecycleStage key={stage.number} stage={stage} index={index} />
            ))}
          </div>
        </div>

        <LifecycleSummary />
      </div>
    </section>
  );
}

function LifecycleRail() {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { scaleX: 0, opacity: 0 },
        whileInView: { scaleX: 1, opacity: 1 },
        viewport: { once: true },
        transition: { duration: 1.15, ease: "easeOut" as const },
      };

  return (
    <div
      aria-hidden
      className="absolute left-0 right-0 top-3 hidden h-14 -translate-y-1/2 md:block"
    >
      <motion.div
        {...motionProps}
        className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 origin-left blur-2xl dark:hidden"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.09) 11%, rgba(240,162,58,0.04) 24%, rgba(48,48,48,0.04) 43%, rgba(111,108,0,0.05) 67%, rgba(56,210,0,0.07) 88%, transparent 100%)",
        }}
      />

      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/[0.055] dark:hidden" />

      <motion.div
        {...motionProps}
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 origin-left dark:hidden"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.58) 11%, rgba(194,124,34,0.40) 25%, rgba(78,78,73,0.34) 43%, rgba(101,99,0,0.32) 66%, rgba(56,210,0,0.52) 88%, transparent 100%)",
        }}
      />

      <motion.div
        {...motionProps}
        className="absolute inset-x-0 top-1/2 hidden h-10 -translate-y-1/2 origin-left blur-2xl dark:block"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.14) 11%, rgba(222,218,0,0.14) 42%, rgba(222,218,0,0.12) 67%, rgba(56,210,0,0.12) 88%, transparent 100%)",
        }}
      />

      <motion.div
        {...motionProps}
        className="absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 origin-left dark:block"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.72) 11%, rgba(222,218,0,0.64) 41%, rgba(222,218,0,0.58) 67%, rgba(56,210,0,0.64) 88%, transparent 100%)",
        }}
      />
    </div>
  );
}

function LifecycleStage({
  stage,
  index,
}: {
  stage: (typeof lifecycleStages)[number];
  index: number;
}) {
  const signalClass =
    stage.signal === "pending"
      ? "bg-[#F0A23A]"
      : stage.signal === "complete"
        ? "bg-[#38D200]"
        : "bg-[#303030] dark:bg-[#DEDA00]";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        delay: 0.08 + index * 0.08,
        duration: 0.42,
        ease: "easeOut",
      }}
      className={[
        "relative rounded-xl border border-black/[0.08] bg-[#f8f8f5] p-4",
        "sm:p-5 md:border-0 md:bg-transparent md:p-0",
        "dark:border-white/[0.05] dark:bg-white/[0.018] md:dark:bg-transparent",
      ].join(" ")}
    >
      <span className="relative z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-black/[0.10] bg-white md:flex dark:border-white/[0.10] dark:bg-[#141414]">
        <span className={["h-2 w-2 rounded-full", signalClass].join(" ")} />
      </span>

      <div className="flex items-center gap-2 md:mt-6">
        <span className={["h-1.5 w-1.5 rounded-full md:hidden", signalClass].join(" ")} />

        <p className="text-[0.48rem] font-black uppercase tracking-[0.14em] text-[#60605a] md:text-[0.5rem] md:tracking-[0.16em] dark:text-white/36">
          {stage.number} / {stage.label}
        </p>
      </div>

      <h3 className="mt-2 text-base font-black tracking-[-0.02em] text-[#303030] sm:text-lg dark:text-white">
        {stage.title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-[#65655f] dark:text-white/40">
        {stage.description}
      </p>
    </motion.article>
  );
}

function LifecycleSummary() {
  return (
    <div className="mt-10 grid overflow-hidden rounded-xl bg-[#303030] text-white sm:mt-14 sm:grid-cols-4 dark:bg-[#0d0d0d]">
      <DarkMetric label="Brief" value="Defined" />
      <DarkMetric label="People" value="Allocated" />
      <DarkMetric label="Work" value="Visible" />
      <DarkMetric label="Outcome" value="Confirmed" success />
    </div>
  );
}

/* =========================================================
   ALLOCATION
========================================================= */

function AllocationSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f3f3ef] py-20 dark:border-white/[0.07] dark:bg-[#080808] sm:py-24 lg:py-32">
      <SoftWave tone="amber" side="left" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow>Build the team</SectionEyebrow>

            <SectionTitle>
              One project can need{" "}
              <HeadlineAccent>several different people.</HeadlineAccent>
            </SectionTitle>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/44">
              Skills belong to the project. Bring together the right mix of
              people around one brief instead of managing each trade as a
              separate job.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <SkillTag>Electrical</SkillTag>
              <SkillTag>Carpentry</SkillTag>
              <SkillTag>Painting</SkillTag>
              <SkillTag>Construction</SkillTag>
            </div>

            <div className="mt-8 max-w-md rounded-xl bg-[#303030] p-5 text-white dark:bg-[#171717]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DEDA00] text-[#303030]">
                  <Layers3Icon size={14} />
                </span>

                <div>
                  <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/36">
                    Allocation principle
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    The project comes first.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/44">
                People are selected around what the project needs, keeping every
                role connected to one shared outcome.
              </p>
            </div>
          </div>

          <AllocationFan />
        </div>
      </div>
    </section>
  );
}

function AllocationFan() {
  return (
    <div className="relative min-h-[410px] sm:min-h-[535px] lg:min-h-[550px]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="absolute left-1/2 top-0 z-30 w-[94%] max-w-md -translate-x-1/2 rounded-xl bg-[#303030] p-4 text-white shadow-[0_28px_70px_-42px_rgba(0,0,0,0.44)] sm:w-[84%] sm:p-5 dark:bg-[#1A1A1A]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/35">
            Project team
          </span>

          <span className="text-[0.5rem] text-[#DEDA00]">4 roles</span>
        </div>

        <h3 className="mt-3 text-lg font-black sm:text-xl">
          Kitchen renovation
        </h3>

        <p className="mt-2 text-[0.68rem] text-white/42 sm:text-xs">
          The team is assembled around the skills the work requires.
        </p>

        <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
          {["Electrical", "Carpentry", "Painting", "Construction"].map(skill => (
            <span
              key={skill}
              className="rounded-md border border-white/[0.10] bg-white/[0.055] px-2.5 py-1.5 text-[0.53rem] font-semibold text-white/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="absolute left-1/2 top-[116px] h-12 w-px -translate-x-1/2 bg-black/[0.10] sm:top-[142px] sm:h-16 dark:bg-white/[0.08]" />

      <div className="absolute left-[16%] right-[16%] top-[163px] h-px bg-gradient-to-r from-transparent via-black/[0.13] to-transparent sm:left-[12%] sm:right-[12%] sm:top-[205px] dark:via-white/[0.10]" />

      <div className="absolute inset-x-0 top-[184px] grid grid-cols-2 gap-2.5 sm:hidden">
        {allocationRoles.slice(0, 2).map((item, index) => (
          <AllocationCard key={item.role} item={item} index={index} compact />
        ))}
      </div>

      <div className="absolute inset-x-0 top-[228px] hidden grid-cols-2 gap-3 sm:grid lg:hidden">
        {allocationRoles.map((item, index) => (
          <AllocationCard key={item.role} item={item} index={index} />
        ))}
      </div>

      <div className="absolute inset-x-0 top-[228px] hidden items-end justify-center lg:flex">
        {allocationRoles.map((item, index) => (
          <AllocationCard key={item.role} item={item} index={index} desktop />
        ))}
      </div>
    </div>
  );
}

function AllocationCard({
  item,
  index,
  compact = false,
  desktop = false,
}: {
  item: (typeof allocationRoles)[number];
  index: number;
  compact?: boolean;
  desktop?: boolean;
}) {
  const Icon = item.icon;

  const signalClass =
    item.tone === "amber"
      ? "bg-[#F0A23A]"
      : item.tone === "green"
        ? "bg-[#38D200]"
        : "bg-[#303030] dark:bg-[#DEDA00]";

  const iconClass =
    item.tone === "amber"
      ? "bg-[#F0A23A]/[0.10] text-[#8c5800] dark:text-[#F0A23A]"
      : item.tone === "green"
        ? "bg-[#38D200]/[0.09] text-[#247c08] dark:text-[#38D200]"
        : "bg-black/[0.055] text-[#55554f] dark:bg-white/[0.055] dark:text-[#DEDA00]";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
        rotate: desktop ? item.rotation * 1.4 : 0,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotate: desktop ? item.rotation : 0,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.18 + index * 0.07,
        type: desktop ? "spring" : "tween",
        stiffness: 240,
        damping: 24,
        duration: desktop ? undefined : 0.35,
      }}
      whileHover={
        desktop
          ? {
              y: -10,
              rotate: 0,
              scale: 1.03,
              zIndex: 40,
            }
          : undefined
      }
      className={[
        "rounded-xl border border-black/[0.10] bg-white p-3.5",
        "dark:border-white/[0.08] dark:bg-[#171717]",
        desktop
          ? "relative w-48 p-4 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.35)]"
          : "",
        desktop && index > 0 ? "-ml-5" : "",
      ].join(" ")}
      style={desktop ? { zIndex: 10 + index } : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="relative">
          <ProfileAvatar avatar={item.avatar} size={compact ? "md" : "lg"} />

          <span
            className={[
              "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-md",
              "border-2 border-white dark:border-[#171717]",
              iconClass,
            ].join(" ")}
          >
            <Icon size={10} />
          </span>
        </div>

        <span className={["mt-1 h-2 w-2 rounded-full", signalClass].join(" ")} />
      </div>

      <p
        className={[
          "font-semibold uppercase tracking-[0.14em] text-[#686862] dark:text-white/26",
          compact ? "mt-4 text-[0.46rem]" : "mt-5 text-[0.5rem]",
        ].join(" ")}
      >
        {item.role}
      </p>

      <h4 className="mt-1.5 truncate text-xs font-bold text-[#303030] sm:text-sm dark:text-white">
        {item.person}
      </h4>

      {!compact && (
        <>
          <p className="mt-1 text-[0.56rem] text-[#62625c] dark:text-white/40">
            {item.title}
          </p>

          <p className="mt-1 text-[0.52rem] text-[#777771] dark:text-white/28">
            {item.experience}
          </p>

          <div className="mt-5 flex items-center gap-1.5 border-t border-black/[0.08] pt-3 text-[0.52rem] font-semibold text-[#247e08] dark:border-white/[0.06] dark:text-[#38D200]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />
            Accepted
          </div>
        </>
      )}
    </motion.article>
  );
}

/* =========================================================
   SKILLS
========================================================= */

function SkillsSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-white py-20 dark:border-white/[0.07] dark:bg-[#111111] sm:py-24 lg:py-32">
      <GridTexture />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-16">
          <div>
            <SectionEyebrow>Skills on Allocatr</SectionEyebrow>

            <SectionTitle>
              Practical work needs{" "}
              <HeadlineAccent>practical capability.</HeadlineAccent>
            </SectionTitle>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#5f5f59] sm:text-base sm:leading-8 lg:justify-self-end dark:text-white/42">
            A single project can call for several different capabilities. Find
            the skills the work needs without breaking the job into disconnected
            pieces.
          </p>
        </div>

        <SkillsTicker />
      </div>
    </section>
  );
}

function SkillsTicker() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mt-10 overflow-hidden rounded-[1.25rem] border border-black/[0.09] bg-[#f4f4f1] sm:mt-14 sm:rounded-[1.5rem] lg:mt-16 dark:border-white/[0.08] dark:bg-[#0d0d0d]">
      <div className="flex items-center justify-between bg-[#303030] px-4 py-4 text-white sm:px-6 sm:py-5 dark:bg-[#181818]">
        <div>
          <p className="text-[0.48rem] font-semibold uppercase tracking-[0.14em] text-white/34">
            Skill categories
          </p>

          <p className="mt-1.5 text-xs font-semibold text-white/70">
            Different capabilities. One project system.
          </p>
        </div>

        <Link
          to="/discover"
          className="group hidden items-center gap-2 text-[0.56rem] font-semibold text-[#DEDA00] sm:flex"
        >
          Explore Allocats

          <ArrowRightIcon
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {reduceMotion ? (
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
          {workCategories.map(item => (
            <SkillTickerCard key={item.title} item={item} />
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden py-5 sm:py-7">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#f4f4f1] via-[#f4f4f1]/90 to-transparent sm:w-24 dark:from-[#0d0d0d] dark:via-[#0d0d0d]/90" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#f4f4f1] via-[#f4f4f1]/90 to-transparent sm:w-24 dark:from-[#0d0d0d] dark:via-[#0d0d0d]/90" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            className="flex w-max gap-3 px-3 sm:gap-4 sm:px-4"
          >
            {[...workCategories, ...workCategories].map((item, index) => (
              <SkillTickerCard key={`${item.title}-${index}`} item={item} />
            ))}
          </motion.div>
        </div>
      )}

      <div className="grid border-t border-black/[0.08] sm:grid-cols-3 dark:border-white/[0.07]">
        <SkillsMetric
          number="01"
          title="Define the need"
          description="Skills are attached directly to the project."
        />

        <SkillsMetric
          number="02"
          title="Find the people"
          description="Discover professionals relevant to those skills."
        />

        <SkillsMetric
          number="03"
          title="Keep one project"
          description="Everyone stays connected to the same outcome."
        />
      </div>
    </div>
  );
}

function SkillTickerCard({
  item,
}: {
  item: (typeof workCategories)[number];
}) {
  const Icon = item.icon;

  return (
    <div
      className={[
        "group w-[250px] shrink-0 rounded-xl border border-black/[0.09]",
        "bg-white p-5 transition-all duration-200",
        "hover:-translate-y-1 hover:border-black/[0.14]",
        "hover:shadow-[0_20px_40px_-32px_rgba(0,0,0,0.26)]",
        "sm:w-[285px] sm:p-6",
        "dark:border-white/[0.07] dark:bg-[#181818]",
        "dark:hover:border-white/[0.12] dark:hover:shadow-none",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            item.surface,
            item.iconClass,
          ].join(" ")}
        >
          <Icon size={16} />
        </span>

        <span className={["mt-1 h-1.5 w-1.5 rounded-full", item.signal].join(" ")} />
      </div>

      <h3 className="mt-7 text-sm font-black tracking-[-0.015em] text-[#303030] dark:text-white">
        {item.title}
      </h3>

      <p className="mt-2 min-h-10 text-[0.6rem] leading-5 text-[#64645e] dark:text-white/34">
        {item.detail}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-black/[0.07] pt-4 dark:border-white/[0.06]">
        <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[#777771] dark:text-white/25">
          Find specialists
        </span>

        <ArrowRightIcon
          size={12}
          className="text-[#777771] transition-transform group-hover:translate-x-0.5 dark:text-white/25"
        />
      </div>
    </div>
  );
}

function SkillsMetric({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-black/[0.08] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6 dark:border-white/[0.07]">
      <p className="text-[0.48rem] font-black tracking-[0.15em] text-[#777771] dark:text-[#DEDA00]">
        {number}
      </p>

      <h3 className="mt-3 text-sm font-black text-[#303030] sm:text-base dark:text-white">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-6 text-[#64645e] dark:text-white/36">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   WORKSPACE
========================================================= */

function WorkspaceSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f3f3ef] py-20 dark:border-white/[0.07] dark:bg-[#080808] sm:py-24 lg:py-32">
      <SoftWave tone="neutral" side="right" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>Project workspace</SectionEyebrow>

          <SectionTitle center>
            One place to see{" "}
            <HeadlineAccent>what is actually happening.</HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/42">
            The workspace brings the brief, team, progress and task execution
            together without turning the project into another stream of
            disconnected updates.
          </p>
        </div>

        <WorkspaceDemo />
      </div>
    </section>
  );
}

function WorkspaceDemo() {
  return (
    <div className="relative mx-auto mt-10 max-w-6xl sm:mt-14 sm:pb-10 lg:mt-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="overflow-hidden rounded-[1.25rem] border border-black/[0.10] bg-[#303030] shadow-[0_32px_90px_-56px_rgba(0,0,0,0.48)] sm:rounded-[1.5rem] dark:border-white/[0.08] dark:bg-[#090909]"
      >
        <WorkspaceHeader />

        <div className="grid gap-3 p-3.5 sm:gap-4 sm:p-6 lg:grid-cols-[1.22fr_0.78fr]">
          <WorkspaceMain />
          <WorkspaceSidebar />
        </div>
      </motion.div>

      <WorkspaceMessageFloat />
    </div>
  );
}

function WorkspaceHeader() {
  return (
    <div className="flex flex-col gap-4 border-b border-white/[0.08] px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DEDA00] text-[#303030]">
          <WrenchIcon size={16} />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-black tracking-[-0.025em] sm:text-lg">
              Kitchen renovation
            </h3>

            <span className="inline-flex items-center gap-1.5 text-[0.54rem] font-semibold text-[#DEDA00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DEDA00]" />
              Active
            </span>
          </div>

          <p className="mt-1 truncate text-[0.55rem] text-white/30">
            Home improvement · AL-0182
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden rounded-lg border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-[0.56rem] font-semibold text-white/48 sm:inline-flex">
          Project details
        </span>

        <span className="rounded-lg bg-[#DEDA00] px-3 py-2 text-[0.56rem] font-semibold text-[#303030]">
          Find Allocats
        </span>
      </div>
    </div>
  );
}

function WorkspaceMain() {
  return (
    <div className="rounded-xl bg-white p-4 sm:p-5 dark:bg-[#111111]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <PreviewLabel>Project progress</PreviewLabel>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-black tracking-[-0.05em] text-[#303030] sm:text-5xl dark:text-white">
              68
            </span>

            <span className="mb-1 text-sm font-bold text-[#62625c] dark:text-white/30">
              %
            </span>
          </div>
        </div>

        <span className="rounded-full border border-black/[0.10] bg-[#f3f3ef] px-3 py-1.5 text-[0.54rem] font-semibold text-[#55554f] dark:border-[#DEDA00]/20 dark:bg-white/[0.035] dark:text-[#DEDA00]">
          Active
        </span>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.08] sm:mt-6 dark:bg-white/[0.07]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "68%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="h-full rounded-full bg-[#303030] dark:bg-[#DEDA00]"
        />
      </div>

      <div className="mt-6 grid grid-cols-3 border-y border-black/[0.08] py-4 dark:border-white/[0.06]">
        <ProjectStat label="Tasks" value="12" />
        <ProjectStat label="Complete" value="07" />
        <ProjectStat label="Due" value="30 Oct" />
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <PreviewLabel>Tasks</PreviewLabel>

            <h4 className="mt-1.5 text-sm font-black text-[#303030] dark:text-white">
              Current execution
            </h4>
          </div>

          <span className="hidden text-[0.52rem] text-[#70706a] sm:block dark:text-white/28">
            Status board
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <WorkspaceTask
            title="Install kitchen sockets"
            person="Tawanda M."
            status="Active"
            tone="active"
          />

          <WorkspaceTask
            title="Fit cabinet doors"
            person="Leroy N."
            status="Pending"
            tone="pending"
          />

          <WorkspaceTask
            title="Site inspection"
            person="Project team"
            status="Complete"
            tone="complete"
          />

          <WorkspaceTask
            title="Confirm fitting sizes"
            person="Client review"
            status="Overdue"
            tone="overdue"
          />
        </div>
      </div>
    </div>
  );
}

function WorkspaceTask({
  title,
  person,
  status,
  tone,
}: {
  title: string;
  person: string;
  status: string;
  tone: "active" | "pending" | "complete" | "overdue";
}) {
  const dotClass =
    tone === "complete"
      ? "bg-[#38D200]"
      : tone === "pending"
        ? "bg-[#F0A23A]"
        : tone === "overdue"
          ? "bg-[#AD3A12]"
          : "bg-[#303030] dark:bg-[#DEDA00]";

  const statusClass =
    tone === "complete"
      ? "text-[#247c08] dark:text-[#38D200]"
      : tone === "pending"
        ? "text-[#8c5800] dark:text-[#F0A23A]"
        : tone === "overdue"
          ? "text-[#8c3f23] dark:text-[#c86a49]"
          : "text-[#55554f] dark:text-[#DEDA00]";

  return (
    <div className="rounded-lg border border-black/[0.08] bg-[#f8f8f5] p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
      <div className="flex items-start gap-2.5">
        <span className={["mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", dotClass].join(" ")} />

        <div className="min-w-0 flex-1">
          <p className="text-[0.66rem] font-semibold leading-5 text-[#3f3f3a] dark:text-white/76">
            {title}
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="truncate text-[0.5rem] text-[#72726c] dark:text-white/28">
              {person}
            </span>

            <span className={["text-[0.5rem] font-semibold", statusClass].join(" ")}>
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSidebar() {
  return (
    <div className="grid gap-3">
      <div className="rounded-xl bg-white p-4 sm:p-5 dark:bg-[#111111]">
        <div className="flex items-center justify-between">
          <div>
            <PreviewLabel>Project team</PreviewLabel>

            <p className="mt-1.5 text-sm font-bold text-[#303030] dark:text-white">
              Accepted Allocats
            </p>
          </div>

          <span className="text-xl font-black text-[#303030] dark:text-white">
            03
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <WorkspaceMember avatar="tawanda" name="Tawanda M." skill="Electrical" />
          <WorkspaceMember avatar="leroy" name="Leroy N." skill="Carpentry" />
          <WorkspaceMember avatar="kuda" name="Kuda M." skill="Painting" />
        </div>
      </div>

      <div className="rounded-xl bg-[#F0A23A] p-4 text-[#332000] sm:p-5 dark:bg-[#F0A23A]/[0.10] dark:text-[#F0A23A]">
        <div className="flex items-center gap-2.5">
          <FileCheck2Icon size={14} />

          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em]">
            Next milestone
          </span>
        </div>

        <p className="mt-3 text-sm font-black dark:text-white">
          Electrical installation review
        </p>

        <p className="mt-1.5 text-xs leading-6 text-black/55 dark:text-white/40">
          Due 18 October · assigned to Tawanda M.
        </p>
      </div>

      <div className="rounded-xl bg-[#e7f9e1] p-4 sm:p-5 dark:bg-[#38D200]/[0.055]">
        <div className="flex items-center gap-2.5 text-[#247c08] dark:text-[#38D200]">
          <ShieldCheckIcon size={14} />

          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em]">
            Project health
          </span>
        </div>

        <p className="mt-3 text-sm font-black text-[#303030] dark:text-white">
          Moving as planned
        </p>

        <p className="mt-1.5 text-xs leading-6 text-[#62625c] dark:text-white/40">
          7 of 12 tasks complete with three accepted Allocats active.
        </p>
      </div>
    </div>
  );
}

function WorkspaceMember({
  avatar,
  name,
  skill,
}: {
  avatar: AvatarKey;
  name: string;
  skill: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <ProfileAvatar avatar={avatar} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.62rem] font-semibold text-[#303030] dark:text-white/75">
          {name}
        </p>

        <p className="mt-0.5 text-[0.5rem] text-[#676761] dark:text-white/28">
          {skill}
        </p>
      </div>

      <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />
    </div>
  );
}

function WorkspaceMessageFloat() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -left-8 bottom-0 hidden w-64 rounded-xl border border-black/[0.10] bg-white p-4 shadow-xl lg:block dark:border-white/[0.08] dark:bg-[#1A1A1A]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00]">
          <MessageSquareIcon size={15} />
        </span>

        <div>
          <p className="text-[0.52rem] text-[#686862] dark:text-white/30">
            Project update
          </p>

          <p className="mt-0.5 text-xs font-semibold text-[#303030] dark:text-white">
            Electrical work started
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   RESPONSIBILITY
========================================================= */

function ResponsibilitySection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-white py-20 dark:border-white/[0.07] dark:bg-[#111111] sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div className="max-w-4xl">
          <SectionEyebrow>Same project</SectionEyebrow>

          <SectionTitle>
            Different responsibilities.{" "}
            <HeadlineAccent>Shared visibility.</HeadlineAccent>
          </SectionTitle>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/42">
            The client and Allocat work from the same project. What changes is
            what each person is responsible for.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[1.25rem] border border-black/[0.09] bg-[#f7f7f4] sm:mt-14 lg:grid-cols-[1fr_0.72fr_1fr] dark:border-white/[0.07] dark:bg-[#0d0d0d]">
          <ResponsibilityPanel
            role="Client"
            icon={UsersIcon}
            title="Own the outcome"
            description="Define what needs to happen, choose the team and make the final decision on completion."
            items={[
              "Create the brief",
              "Invite the team",
              "Review progress",
              "Confirm completion",
            ]}
          />

          <SharedProjectCore />

          <ResponsibilityPanel
            role="Allocat"
            icon={BriefcaseBusinessIcon}
            title="Own the execution"
            description="Take responsibility for assigned work, keep tasks moving and return the finished project for review."
            items={[
              "Accept the work",
              "Execute tasks",
              "Update progress",
              "Submit completion",
            ]}
            allocat
          />
        </div>
      </div>
    </section>
  );
}

function ResponsibilityPanel({
  role,
  icon: Icon,
  title,
  description,
  items,
  allocat = false,
}: {
  role: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  allocat?: boolean;
}) {
  return (
    <div
      className={[
        "p-5 sm:p-8 lg:p-10",
        allocat
          ? "border-t border-black/[0.08] lg:border-l lg:border-t-0 dark:border-white/[0.06]"
          : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00] dark:bg-white/[0.06]">
          <Icon size={16} />
        </span>

        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-[#686862] dark:text-white/28">
          {role}
        </span>
      </div>

      <h3 className="mt-7 text-2xl font-black tracking-[-0.035em] text-[#303030] sm:text-3xl dark:text-white">
        {title}.
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#5f5f59] dark:text-white/42">
        {description}
      </p>

      <div className="mt-7 space-y-3 border-t border-black/[0.08] pt-5 dark:border-white/[0.06]">
        {items.map(item => (
          <div key={item} className="flex items-center gap-2.5">
            <CheckCircle2Icon
              size={13}
              className="text-[#247c08] dark:text-[#38D200]"
            />

            <span className="text-xs font-medium text-[#55554f] dark:text-white/48">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SharedProjectCore() {
  return (
    <div className="relative flex flex-col justify-center border-y border-black/[0.08] bg-[#303030] p-6 text-white sm:p-8 lg:border-x lg:border-y-0 lg:border-black/[0.08] lg:p-7 dark:border-white/[0.06] dark:bg-[#181818]">
      <div className="mx-auto max-w-xs text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#DEDA00] text-[#202020]">
          <Layers3Icon size={17} />
        </span>

        <p className="mt-5 text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-white/42">
          Shared project
        </p>

        <h4 className="mt-2 text-lg font-black tracking-[-0.025em]">
          One source of truth
        </h4>

        <p className="mt-3 text-xs leading-6 text-white/48">
          Brief, people, tasks, status and completion stay connected regardless
          of who is viewing the work.
        </p>

        <div className="mt-6 flex justify-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-[#F0A23A]" />
          <span className="h-1.5 w-5 rounded-full bg-[#DEDA00]" />
          <span className="h-1.5 w-5 rounded-full bg-[#38D200]" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f3f3ef] py-20 dark:border-white/[0.07] dark:bg-[#080808] sm:py-24 lg:py-32">
      <SoftAtmosphere position="left" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow>Before the invitation</SectionEyebrow>

            <SectionTitle>
              More context than{" "}
              <HeadlineAccent>a contact number.</HeadlineAccent>
            </SectionTitle>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/42">
              Profiles bring skills, experience, professional information and
              project feedback together before a client makes an invitation.
            </p>

            <ProfileTrustCard />
          </div>

          <AllocatProfilePreview />
        </div>
      </div>
    </section>
  );
}

function ProfileTrustCard() {
  return (
    <div className="mt-8 max-w-md rounded-xl bg-[#303030] p-5 text-white dark:bg-[#171717]">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#38D200]/[0.12] text-[#38D200]">
          <BadgeCheckIcon size={15} />
        </span>

        <div>
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/34">
            Professional context
          </p>

          <p className="mt-1 text-sm font-bold">
            Make the invitation with context.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 border-t border-white/[0.08] pt-4">
        <DarkStat label="Skills" value="04" />
        <DarkStat label="Experience" value="8 yrs" />
        <DarkStat label="Rating" value="4.9" />
      </div>
    </div>
  );
}

function AllocatProfilePreview() {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-black/[0.10] bg-white shadow-[0_26px_70px_-50px_rgba(0,0,0,0.30)] sm:rounded-[1.5rem] dark:border-white/[0.08] dark:bg-[#101010]">
      <div className="flex items-center gap-4 border-b border-black/[0.08] bg-[#f8f8f5] p-4 sm:gap-5 sm:p-6 dark:border-white/[0.07] dark:bg-[#171717]">
        <ProfileAvatar avatar="tawanda" size="xl" />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-black text-[#303030] sm:text-xl dark:text-white">
              Tawanda Moyo
            </h3>

            <BadgeCheckIcon
              size={15}
              className="shrink-0 text-[#55554f] dark:text-[#DEDA00]"
            />
          </div>

          <p className="mt-1 text-xs font-medium text-[#5f5f59] dark:text-white/44">
            Electrical specialist
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-[0.56rem] text-[#676761] dark:text-white/30">
            <span className="flex items-center gap-1.5">
              <MapPinIcon size={11} />
              Harare
            </span>

            <span className="flex items-center gap-1.5">
              <StarIcon
                size={11}
                className="fill-[#F0A23A] text-[#F0A23A]"
              />
              4.9
            </span>
          </div>
        </div>

        <div className="ml-auto hidden text-right sm:block">
          <p className="text-2xl font-black text-[#303030] dark:text-white">
            8
          </p>

          <p className="text-[0.5rem] uppercase tracking-[0.11em] text-[#686862] dark:text-white/26">
            years experience
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
          <ProfileDetail label="Hourly rate" value="$18 / hour" />
          <ProfileDetail label="Experience" value="8 years" />
          <ProfileDetail label="Rating" value="4.9 / 5" tone="amber" />
        </div>

        <div className="mt-6 border-t border-black/[0.08] pt-5 dark:border-white/[0.06]">
          <PreviewLabel>Skills</PreviewLabel>

          <div className="mt-3 flex flex-wrap gap-2">
            <SkillTag>Electrical wiring</SkillTag>
            <SkillTag>Installation</SkillTag>
            <SkillTag>Fault finding</SkillTag>
            <SkillTag>Lighting</SkillTag>
          </div>
        </div>

        <div className="mt-6 hidden border-t border-black/[0.08] pt-5 sm:block dark:border-white/[0.06]">
          <PreviewLabel>About</PreviewLabel>

          <p className="mt-3 max-w-xl text-xs leading-6 text-[#60605a] dark:text-white/40">
            Experienced electrical professional focused on residential and
            commercial installation, maintenance and fault diagnosis.
          </p>
        </div>

        <div className="mt-6 flex justify-end border-t border-black/[0.08] pt-4 dark:border-white/[0.06]">
          <span className="inline-flex items-center gap-2 text-[0.58rem] font-semibold text-[#303030] dark:text-[#DEDA00]">
            View profile
            <ArrowRightIcon size={11} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPLETION
========================================================= */

function CompletionSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-white py-20 dark:border-white/[0.07] dark:bg-[#111111] sm:py-24 lg:py-32">
      <SoftWave tone="green" side="right" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>Completion & reputation</SectionEyebrow>

          <SectionTitle center>
            Done means{" "}
            <HeadlineAccent>reviewed, confirmed and remembered.</HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:mt-6 sm:text-base sm:leading-8 dark:text-white/42">
            Completion creates a clear handover, a client decision and feedback
            that follows the professional beyond one project.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-3 sm:mt-14 lg:grid-cols-3 lg:gap-4">
          <CompletionStep
            number="01"
            icon={SendIcon}
            title="Submit the work"
            description="The project team sends completed work to the client for confirmation."
            tone="neutral"
          />

          <CompletionStep
            number="02"
            icon={FileCheck2Icon}
            title="Confirm the outcome"
            description="The client confirms completion or returns the project when more work is needed."
            tone="amber"
          />

          <CompletionStep
            number="03"
            icon={StarIcon}
            title="Build reputation"
            description="Ratings and comments become part of the professional context available on future projects."
            tone="green"
          />
        </div>

        <CompletionResult />
      </div>
    </section>
  );
}

function CompletionStep({
  number,
  icon: Icon,
  title,
  description,
  tone,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "neutral" | "amber" | "green";
}) {
  const iconClass =
    tone === "amber"
      ? "bg-[#F0A23A]/[0.10] text-[#8c5800] dark:text-[#F0A23A]"
      : tone === "green"
        ? "bg-[#38D200]/[0.09] text-[#247c08] dark:text-[#38D200]"
        : "bg-[#303030] text-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#202020]";

  return (
    <div className="rounded-xl border border-black/[0.09] bg-[#f8f8f5] p-5 sm:p-6 dark:border-white/[0.07] dark:bg-[#171717]">
      <div className="flex items-start justify-between">
        <span className={["flex h-10 w-10 items-center justify-center rounded-lg", iconClass].join(" ")}>
          <Icon size={16} />
        </span>

        <span className="text-[0.48rem] font-black tracking-[0.15em] text-[#777771] dark:text-white/25">
          {number}
        </span>
      </div>

      <h3 className="mt-7 text-lg font-black tracking-[-0.025em] text-[#303030] dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-[#62625c] dark:text-white/40">
        {description}
      </p>
    </div>
  );
}

function CompletionResult() {
  return (
    <div className="mx-auto mt-4 max-w-4xl overflow-hidden rounded-xl bg-[#303030] text-white sm:mt-6 dark:bg-[#0b0b0b]">
      <div className="grid sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-4 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#38D200]/[0.12] text-[#38D200]">
            <CircleCheckBigIcon size={16} />
          </span>

          <div>
            <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/34">
              Project complete
            </p>

            <p className="mt-1 text-sm font-bold">
              Kitchen renovation successfully closed.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08] px-4 py-4 sm:border-l sm:border-t-0 sm:px-6">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(value => (
              <StarIcon
                key={value}
                size={15}
                className={
                  value <= 4
                    ? "fill-[#F0A23A] text-[#F0A23A]"
                    : "text-white/18"
                }
              />
            ))}

            <span className="ml-2 text-[0.58rem] font-semibold text-white/48">
              4/5
            </span>
          </div>

          <p className="mt-1 text-[0.5rem] text-[#DEDA00]">
            Rating saved
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FINAL CTA
========================================================= */

function FinalCta({
  postProjectHref,
  allocatHref,
  allocatLabel,
}: {
  postProjectHref: string;
  allocatHref: string;
  allocatLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#f7f7f4] py-20 dark:bg-[#111111] sm:py-24 lg:py-32">
      <GridTexture />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[20%] h-[28rem] w-[64rem] -translate-x-1/2 rounded-full bg-[#F0A23A]/[0.025] blur-[120px] dark:bg-[#DEDA00]/[0.015]"
      />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>
            Ready when the work is
          </SectionEyebrow>

          <h2 className="mx-auto mt-5 max-w-[13ch] text-[2.8rem] font-black leading-[0.9] tracking-[-0.055em] text-[#303030] sm:mt-6 sm:text-6xl lg:text-7xl dark:text-white">
            There's work to be done.

            <span className="block text-[#303030] dark:text-[#DEDA00]">
              Allocate it properly.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#5f5f59] sm:mt-7 sm:text-base sm:leading-8 dark:text-white/42">
            Start with the project, find the people it needs and keep the work
            connected from brief to completion.
          </p>

          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-black/[0.10] bg-white p-2 shadow-[0_20px_55px_-42px_rgba(0,0,0,0.24)] sm:mt-10 dark:border-white/[0.08] dark:bg-[#0c0c0c] dark:shadow-none">
            <Link
              to={postProjectHref}
              className="group flex min-h-[3.5rem] items-center gap-3 rounded-lg px-3 text-left transition-colors hover:bg-[#f4f4f1] sm:gap-4 sm:px-5 dark:hover:bg-white/[0.035]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#202020]">
                <SearchIcon size={14} />
              </span>

              <span className="min-w-0 flex-1 text-sm text-[#686862] dark:text-white/38">
                What needs doing?
              </span>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00] transition-transform group-hover:translate-x-0.5 dark:bg-[#DEDA00] dark:text-[#202020]">
                <ArrowRightIcon size={14} />
              </span>
            </Link>
          </div>

          <div className="mt-5 hidden flex-wrap justify-center gap-2 sm:flex">
            <SkillTag>Electrical</SkillTag>
            <SkillTag>Carpentry</SkillTag>
            <SkillTag>Construction</SkillTag>
            <SkillTag>Painting</SkillTag>
            <SkillTag>Repairs</SkillTag>
            <SkillTag>Transport</SkillTag>
          </div>

          <div className="mt-10 grid gap-3 border-t border-black/[0.08] pt-7 sm:mt-12 sm:grid-cols-2 sm:pt-8 dark:border-white/[0.07]">
            <FinalCtaChoice
              href={postProjectHref}
              icon={FileTextIcon}
              eyebrow="Need the work done?"
              title="Start a project"
              description="Create the brief and build the right team around it."
            />

            <FinalCtaChoice
              href={allocatHref}
              icon={BriefcaseBusinessIcon}
              eyebrow="Have the skills?"
              title={allocatLabel}
              description="Build your professional profile and join client projects."
            />
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 rounded-xl bg-[#303030] px-4 py-4 text-left sm:mt-10 sm:px-6 dark:bg-[#181818]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DEDA00] text-[#202020]">
              <CheckCircle2Icon size={14} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-bold text-white">
                One project. The right people. Clear ownership.
              </p>

              <p className="mt-0.5 hidden text-[0.55rem] text-white/36 sm:block">
                From the first brief to final client confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCtaChoice({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={href}
      className={[
        "group flex items-center gap-4 rounded-xl border border-black/[0.09]",
        "bg-white p-4 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-black/[0.14]",
        "hover:shadow-[0_18px_45px_-34px_rgba(0,0,0,0.28)]",
        "sm:p-5",
        "dark:border-white/[0.07] dark:bg-white/[0.025]",
        "dark:hover:border-white/[0.12] dark:hover:bg-white/[0.04] dark:hover:shadow-none",
      ].join(" ")}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#303030] text-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#202020]">
        <Icon size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[0.48rem] font-semibold uppercase tracking-[0.13em] text-[#686862] dark:text-white/26">
          {eyebrow}
        </p>

        <p className="mt-1.5 text-sm font-bold text-[#303030] dark:text-white">
          {title}
        </p>

        <p className="mt-1 hidden text-[0.56rem] leading-5 text-[#696963] sm:block dark:text-white/32">
          {description}
        </p>
      </div>

      <ArrowRightIcon
        size={13}
        className="shrink-0 text-[#777771] transition-transform group-hover:translate-x-0.5 dark:text-[#DEDA00]"
      />
    </Link>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function ProjectStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-black/[0.08] px-3 first:border-l-0 first:pl-0 dark:border-white/[0.06]">
      <p className="text-[0.47rem] font-semibold uppercase tracking-[0.1em] text-[#73736d] dark:text-white/26">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-[#303030] sm:text-sm dark:text-white">
        {value}
      </p>
    </div>
  );
}

function DarkStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-white/[0.08] px-3 first:border-l-0 first:pl-0">
      <p className="text-[0.46rem] font-semibold uppercase tracking-[0.1em] text-white/28">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-white">{value}</p>
    </div>
  );
}

function DarkMetric({
  label,
  value,
  success = false,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="border-b border-white/[0.07] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-5">
      <p className="text-[0.46rem] font-semibold uppercase tracking-[0.13em] text-white/28">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            success ? "bg-[#38D200]" : "bg-[#DEDA00]",
          ].join(" ")}
        />

        <p
          className={[
            "text-xs font-bold",
            success ? "text-[#38D200]" : "text-white",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ProfileDetail({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "amber";
}) {
  return (
    <div>
      <PreviewLabel>{label}</PreviewLabel>

      <p
        className={[
          "mt-2 text-xs font-bold sm:text-sm",
          tone === "amber"
            ? "text-[#8c5800] dark:text-[#F0A23A]"
            : "text-[#303030] dark:text-white",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function PreviewLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={[
        "text-[0.48rem] font-semibold uppercase tracking-[0.13em]",
        "text-[#686862] sm:text-[0.5rem] sm:tracking-[0.14em]",
        "dark:text-white/28",
        className,
      ].join(" ")}
    >
      {children}
    </p>
  );
}

function SkillTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-lg border border-black/[0.10] bg-white px-2.5 py-1.5 text-[0.54rem] font-semibold text-[#55554f] sm:text-[0.56rem] dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white/48">
      {children}
    </span>
  );
}

function SectionEyebrow({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={["flex items-center gap-2.5", center ? "justify-center" : ""].join(" ")}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />

      <span className="text-[0.53rem] font-semibold uppercase tracking-[0.17em] text-[#5e5e58] sm:text-[0.56rem] sm:tracking-[0.2em] dark:text-white/32">
        {children}
      </span>
    </div>
  );
}

function SectionTitle({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <h2
      className={[
        "mt-4 max-w-5xl text-[2.4rem] font-black leading-[0.94] tracking-[-0.045em]",
        "text-[#303030] dark:text-white",
        "sm:mt-5 sm:text-5xl sm:leading-[0.92] sm:tracking-[-0.05em]",
        "lg:text-6xl",
        center ? "mx-auto" : "",
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function HeadlineAccent({
  children,
  block = false,
}: {
  children: ReactNode;
  block?: boolean;
}) {
  return (
    <span
      className={[
        "text-[#303030] dark:text-[#DEDA00]",
        block ? "block" : "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function HeroProof({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.58rem] font-medium text-[#5f5f59] sm:text-[0.62rem] dark:text-white/36">
      <CheckCircle2Icon
        size={12}
        className="text-[#247e08] dark:text-[#38D200]"
      />

      {children}
    </span>
  );
}

/* =========================================================
   PROFILE AVATAR
========================================================= */

function ProfileAvatar({
  avatar,
  size = "md",
}: {
  avatar: AvatarKey;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass =
    size === "xl"
      ? "h-14 w-14 sm:h-16 sm:w-16"
      : size === "lg"
        ? "h-12 w-12"
        : size === "sm"
          ? "h-8 w-8"
          : "h-10 w-10";

  return (
    <span
      className={[
        "relative block shrink-0 overflow-hidden rounded-full",
        "border border-black/[0.10] bg-[#e7e7e2]",
        "dark:border-white/[0.10] dark:bg-[#1a1a1a]",
        sizeClass,
      ].join(" ")}
    >
      <img
        src={profileAvatars[avatar]}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
    </span>
  );
}

/* =========================================================
   BACKGROUNDS
========================================================= */

function GridTexture() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(48,48,48,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(48,48,48,0.032) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.72) 34%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.72) 34%, transparent 78%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.65) 34%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.65) 34%, transparent 78%)",
        }}
      />
    </>
  );
}

function SoftWave({
  tone,
  side,
}: {
  tone: "neutral" | "amber" | "green";
  side: "left" | "right";
}) {
  const reduceMotion = useReducedMotion();

  const colorClass =
    tone === "amber"
      ? "text-[#F0A23A]"
      : tone === "green"
        ? "text-[#38D200]"
        : "text-[#303030] dark:text-white";

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute top-[10%] h-[32rem] w-[100rem]",
        side === "left" ? "-left-[48rem]" : "-right-[48rem]",
        colorClass,
        "opacity-[0.035] dark:opacity-[0.07]",
      ].join(" ")}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.25) 20%, black 45%, black 55%, rgba(0,0,0,.25) 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.25) 20%, black 45%, black 55%, rgba(0,0,0,.25) 80%, transparent 100%)",
      }}
    >
      <motion.svg
        animate={reduceMotion ? undefined : { x: [0, 6, 0], y: [0, -4, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 1800 520"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path
            d="M-200 365 C100 120 370 110 650 265 C930 420 1160 395 1420 220 C1620 85 1830 110 2020 250"
            strokeWidth="18"
            opacity="0.035"
            style={{ filter: "blur(22px)" }}
          />

          <path
            d="M-200 365 C100 120 370 110 650 265 C930 420 1160 395 1420 220 C1620 85 1830 110 2020 250"
            strokeWidth="0.9"
            opacity="0.72"
          />

          <path
            d="M-210 420 C130 240 405 185 690 315 C960 438 1200 420 1460 300 C1690 195 1870 190 2040 285"
            strokeWidth="0.6"
            opacity="0.22"
          />
        </g>
      </motion.svg>
    </div>
  );
}

function ArchitecturalColumns() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-4"
    >
      <span className="border-r border-black/[0.028] dark:border-white/[0.022]" />
      <span className="border-r border-black/[0.028] dark:border-white/[0.022]" />
      <span className="border-r border-black/[0.028] dark:border-white/[0.022]" />
      <span />
    </div>
  );
}

function SoftAtmosphere({
  position = "center",
}: {
  position?: "left" | "center" | "right";
}) {
  const positionClass =
    position === "left"
      ? "-left-[16rem]"
      : position === "right"
        ? "-right-[16rem]"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
    >
      <div
        className={[
          "absolute top-[20%] h-[36rem] w-[36rem] rounded-full blur-[140px]",
          "bg-[#F0A23A]/[0.025] dark:bg-[#DEDA00]/[0.012]",
          positionClass,
        ].join(" ")}
      />
    </div>
  );
}

export default LandingPage;