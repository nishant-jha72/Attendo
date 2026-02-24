import React from 'react';

const EmployeeDetailView = ({ user, onClose, isDashboardView = true }) => {
  if (!user) return null;

  const containerStyles = isDashboardView 
    ? "absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
    : "w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col mx-auto my-8";

  const LayoutWrapper = ({ children }) => {
    if (!isDashboardView) return <div className="p-4">{children}</div>;
    return (
      <div className="fixed inset-0 z-[120] overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
        {children}
      </div>
    );
  };

  return (
    <LayoutWrapper>
      <div className={containerStyles}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {isDashboardView ? 'Employee Profile' : 'My Personal Details'}
          </h2>
          {isDashboardView && (
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <img 
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&size=200`} 
                alt={user.name} 
                className="w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-xl mb-4 group-hover:scale-[1.02] transition-transform"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" title="Active Account"></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{user.name}</h3>
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-1 px-3 py-1 bg-indigo-50 rounded-full">
              {user.position}
            </p>
          </div>

          <div className="space-y-8">
            {/* Contact Info */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Identity & Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Changed from Email to Username (@userName) */}
                <DetailCard label="Username" value={`@${user.userName}`} icon="👤" color="text-indigo-600" />
                <DetailCard label="Phone Number" value={user.phoneNumber} icon="📞" />
                <DetailCard label="Residential Address" value={user.address} icon="🏠" isFull />
              </div>
            </section>

            {/* Employment Info */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Employment Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailCard label="Monthly Salary" value={`₹${user.salary}`} icon="💰" />
                <DetailCard label="System ID" value={user?._id?.slice(-6).toUpperCase() || 'N/A'} icon="🆔" />
                <DetailCard label="Present Days" value={user.presentDays} icon="✅" color="text-green-600" />
                <DetailCard label="Absent Days" value={user.absentDays} icon="❌" color="text-red-600" />
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button 
            className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95"
            onClick={() => window.print()}
          >
            {isDashboardView ? 'Download Report' : 'Print My Profile'}
          </button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

const DetailCard = ({ label, value, icon, isFull, color = "text-slate-700" }) => (
  <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-indigo-100 ${isFull ? 'md:col-span-2' : ''}`}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs">{icon}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
    <p className={`text-sm font-bold ${color} break-words`}>{value || 'N/A'}</p>
  </div>
);

export default EmployeeDetailView;