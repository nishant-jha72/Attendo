
import {Navigate} from 'react-router-dom';

const LandingPage = () => {
    
// Add these helper functions to use in your onClick events

  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-slate-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}

      {/* --- HERO SECTION --- */}
      <header className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
        <div className="max-w-4xl">
          <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-6 inline-block">
            Smart Attendance 2.0
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 leading-tight">
            Manage Presence <br className="hidden md:block" />
            <span className="text-indigo-600">With Precision.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto px-2">
            A secure ecosystem where Admins hold the keys. Effortless user onboarding and zero-friction logins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-6 sm:px-0">
            <button className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl">
              Get Started
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition">
              View Demo
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURE SECTION --- */}
      <section className="py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { id: "01", title: "Admin Registration", desc: "Exclusive entry point for organization heads to set up workspaces." },
            { id: "02", title: "Managed Users", desc: "Total security control. Admins generate and distribute credentials." },
            { id: "03", title: "Direct Access", desc: "Users skip the forms and jump straight into work with pre-verified accounts." }
          ].map((feature) => (
            <div key={feature.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl mb-6 flex items-center justify-center font-bold">{feature.id}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-10 px-4 text-center border-t border-slate-100">
        <p className="text-slate-400 text-sm italic">© 2026 Attendo Management Systems.</p>
      </footer>
    </div>
  );
};

export default LandingPage;