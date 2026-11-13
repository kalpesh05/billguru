import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  UserPlus,
  KeyRound,
  Eye,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Lock,
  Building,
  Store,
  Calculator,
  Briefcase,
  FileText,
  BadgeAlert,
  LogOut,
  Sliders,
  Send,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export const INITIAL_SYSTEM_USERS = [
  {
    id: 1,
    name: 'Super Admin (Product Owner)',
    email: 'admin@billguru.ai',
    phone: '9999900000',
    role: 'super_admin',
    organization: 'BillGuru AI HQ',
    must_change_password: false,
    status: 'active',
    created_at: '2026-01-01',
    last_login: 'Just now',
  },
  {
    id: 2,
    name: 'CA Rajesh Shah, FCA',
    email: 'rajesh@shah.com',
    phone: '9876543210',
    role: 'partner_ca',
    organization: 'Shah & Associates (Chartered Accountants)',
    must_change_password: false,
    status: 'active',
    created_at: '2026-01-15',
    last_login: '2 hours ago',
  },
  {
    id: 3,
    name: 'Karan Dave',
    email: 'karan@shah.com',
    phone: '9876543211',
    role: 'article_assistant',
    organization: 'Shah & Associates',
    must_change_password: false,
    status: 'active',
    created_at: '2026-02-01',
    last_login: 'Yesterday',
  },
  {
    id: 4,
    name: 'Ramesh Patel (Mall Owner)',
    email: 'ramesh@apexmall.in',
    phone: '9825011223',
    role: 'mall_owner',
    organization: 'Apex Supermall & Hypermarket',
    must_change_password: false,
    status: 'active',
    created_at: '2026-03-10',
    last_login: '3 days ago',
  },
  {
    id: 5,
    name: 'Meena Devi (Shop Owner)',
    email: 'meena@kirana.in',
    phone: '9123456789',
    role: 'shop_owner',
    organization: 'Meena Kirana Store',
    must_change_password: true,
    status: 'pending_pw_change',
    created_at: '2026-04-12',
    last_login: 'Never',
  },
  {
    id: 6,
    name: 'Suresh Munshi (Mehtaji)',
    email: 'suresh@munshi.in',
    phone: '9345678901',
    role: 'mehtaji',
    organization: 'Ganesh Wholesale & Staples',
    must_change_password: true,
    status: 'pending_pw_change',
    created_at: '2026-05-05',
    last_login: 'Never',
  },
  {
    id: 7,
    name: 'Ananya Sharma',
    email: 'ananya.s@techcorp.in',
    phone: '9876500001',
    role: 'salaried',
    organization: 'TechCorp India Pvt Ltd',
    must_change_password: false,
    status: 'active',
    created_at: '2026-06-01',
    last_login: '1 week ago',
  },
];

export const ROLE_CONFIGS = {
  super_admin: {
    label: 'Super Admin',
    desc: 'Platform Owner: master user control, cross-tenant visibility, billing & global config',
    badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    icon: ShieldAlert,
    allowedModules: ['Super Admin Console', 'All Client Portals', 'Cross-Firm Telemetry'],
  },
  partner_ca: {
    label: 'Partner CA',
    desc: 'Chartered Accountant Firm Owner: full multi-client audit hub, Tally push & SA 230 sign-off',
    badgeClass: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    icon: Calculator,
    allowedModules: ['Client Hub', 'Inward OCR', 'Bank AI', 'GSTR-2B', 'Notices', 'Tally Sync'],
  },
  article_assistant: {
    label: 'Article Clerk',
    desc: 'Junior CA firm staff: OCR review queue, draft voucher creation, and reconciliation',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    icon: Briefcase,
    allowedModules: ['Inward Review Queue', 'GSTR-2B Matcher', 'Draft Vouchers'],
  },
  mall_owner: {
    label: 'Mall / Supermarket Owner',
    desc: 'High-turnover retail promoter: ₹17L vendor default watchdog & Safe-Pay payout escrow',
    badgeClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    icon: Building,
    allowedModules: ['Retail & GST Shield', 'Safe-Pay Payout Gate', 'Vendor Risk Check'],
  },
  shop_owner: {
    label: 'Chhota Dukan (Solo Shop)',
    desc: 'Micro-merchant & Kirana: dead-simple billing, WhatsApp bot hisab & net GST due',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    icon: Store,
    allowedModules: ['Dukan Billing (DIY)', 'WhatsApp Assistant', 'Basic GST Summary'],
  },
  mehtaji: {
    label: 'In-House Mehtaji (Munshi)',
    desc: 'Retail accountant: daily purchase bills, Safe-Pay approvals, stock damage & CA pack',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    icon: FileText,
    allowedModules: ['Purchase Register', 'Safe-Pay Approval', 'Tuta-Phoota Maal Snap', 'CA WhatsApp Pack'],
  },
  salaried: {
    label: 'Director / Salaried',
    desc: 'Executive & salaried individual: Form 16 analyzer, 80C/80D deduction locker',
    badgeClass: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
    icon: Users,
    allowedModules: ['Tax Locker', 'Form 16 Analyzer', 'Old vs New Regime'],
  },
};

export default function SuperAdminView({
  currentUser,
  onImpersonateUser,
  showToast,
  systemUsers = INITIAL_SYSTEM_USERS,
  onUpdateUsers,
}) {
  const [users, setUsers] = useState(systemUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newRole, setNewRole] = useState('shop_owner');
  const [newPassword, setNewPassword] = useState('Temp@2026#');
  const [generatedInvite, setGeneratedInvite] = useState(null);

  // Reset Password Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [tempResetPw, setTempResetPw] = useState('Temp@2026#');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const caUsersCount = users.filter((u) => u.role === 'partner_ca' || u.role === 'article_assistant').length;
  const retailUsersCount = users.filter((u) => u.role === 'mall_owner' || u.role === 'shop_owner' || u.role === 'mehtaji').length;
  const pendingPwCount = users.filter((u) => u.must_change_password).length;

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newOrg.trim()) {
      showToast?.('Please fill all mandatory fields', 'error');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || '9800000000',
      role: newRole,
      organization: newOrg.trim(),
      password_plain: newPassword,
      must_change_password: true,
      status: 'pending_pw_change',
      created_at: new Date().toISOString().split('T')[0],
      last_login: 'Never',
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    if (onUpdateUsers) onUpdateUsers(updated);

    const inviteText = `Namaste ${newUser.name}! Your BillGuru AI workspace has been created with role [${ROLE_CONFIGS[newUser.role]?.label}] for "${newUser.organization}".\n\n🔗 Login Link: http://localhost:5173\n👤 Email: ${newUser.email}\n🔑 Temporary Password: ${newPassword}\n\n⚠️ You will be prompted to change this temporary password upon your first login for security.`;
    setGeneratedInvite(inviteText);
    showToast?.(`✅ User "${newUser.name}" created with role "${ROLE_CONFIGS[newUser.role]?.label}"!`, 'success');
  };

  const handleConfirmResetPassword = () => {
    if (!selectedUserForReset) return;
    const updated = users.map((u) => {
      if (u.id === selectedUserForReset.id) {
        return {
          ...u,
          password_plain: tempResetPw,
          must_change_password: true,
          status: 'pending_pw_change',
        };
      }
      return u;
    });

    setUsers(updated);
    if (onUpdateUsers) onUpdateUsers(updated);

    const inviteText = `Namaste ${selectedUserForReset.name}! Your BillGuru AI password has been reset.\n\n👤 Email: ${selectedUserForReset.email}\n🔑 New Temporary Password: ${tempResetPw}\n\n⚠️ You will be prompted to create your new permanent password when you log in.`;
    setGeneratedInvite(inviteText);
    setIsResetModalOpen(false);
    showToast?.(`Temporary password generated for ${selectedUserForReset.name}. Client must change on next login.`, 'success');
  };

  const handleCopyInvite = (text) => {
    navigator.clipboard.writeText(text);
    showToast?.('📋 Invite credentials copied to clipboard! Paste directly into WhatsApp or Email.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-900/40 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-7 h-7 text-rose-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    Super Admin Console
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
                    Platform Owner
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  Manage all users in one place. Create accounts, assign specific roles, and enforce password change on first login.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setGeneratedInvite(null);
              setIsAddModalOpen(true);
            }}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>＋ Create User & Assign Role</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-rose-900/30">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-rose-400" /> Total Users
            </div>
            <div className="text-2xl font-black text-white mt-1">{totalUsers}</div>
            <div className="text-[10px] text-slate-500">Across all organizations</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" /> CA Firms & Staff
            </div>
            <div className="text-2xl font-black text-white mt-1">{caUsersCount}</div>
            <div className="text-[10px] text-slate-500">Full audit suite access</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Retail & Mall Clients
            </div>
            <div className="text-2xl font-black text-white mt-1">{retailUsersCount}</div>
            <div className="text-[10px] text-slate-500">Safe-Pay & Dukan portals</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Pending PW Changes
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingPwCount}</div>
            <div className="text-[10px] text-slate-500">Must change on first login</div>
          </div>
        </div>
      </div>

      {/* Generated Invite Callout (if active) */}
      {generatedInvite && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">Temporary Credentials Ready to Share</span>
            </div>
            <button
              onClick={() => handleCopyInvite(generatedInvite)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy WhatsApp Message</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs whitespace-pre-wrap border border-slate-800 leading-relaxed">
            {generatedInvite}
          </pre>
          <p className="text-[11px] text-emerald-400/80">
            * Once the user logs in with this temporary password, the application automatically blocks them until they configure their permanent password.
          </p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or store..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Role:</span>
          {['all', 'super_admin', 'partner_ca', 'mall_owner', 'shop_owner', 'mehtaji', 'salaried'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                roleFilter === r
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {r === 'all' ? 'All Roles' : ROLE_CONFIGS[r]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Master Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            <span>Master User Directory ({filteredUsers.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Click <strong>"👁️ Login As"</strong> to test what any client sees.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User & Contact</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Organization / Shop</th>
                <th className="py-3 px-4">Password Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No users matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleConfig = ROLE_CONFIGS[u.role] || ROLE_CONFIGS.shop_owner;
                  const RoleIcon = roleConfig.icon;
                  const isCurrentLoggedUser = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{u.name}</span>
                          {isCurrentLoggedUser && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Smartphone className="w-3 h-3 text-emerald-400" /> +91 {u.phone}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${roleConfig.badgeClass}`}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          <span>{roleConfig.label}</span>
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-tight">
                          {roleConfig.allowedModules[0]}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{u.organization}</div>
                        <div className="text-[10px] text-slate-500">Joined: {u.created_at}</div>
                      </td>

                      <td className="py-3 px-4">
                        {u.must_change_password ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            <BadgeAlert className="w-3 h-3 text-amber-400" />
                            <span>Temporary (Needs Change)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Permanent Active</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">{u.last_login}</td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate Button */}
                          <button
                            onClick={() => {
                              onImpersonateUser?.(u);
                              showToast?.(`Switched view to "${u.name}" (${roleConfig.label})!`, 'info');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-semibold transition flex items-center gap-1"
                            title="Preview exactly what this client sees"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Login As</span>
                          </button>

                          {/* Reset Password Button */}
                          <button
                            onClick={() => {
                              setSelectedUserForReset(u);
                              setTempResetPw(`Temp@${Math.floor(1000 + Math.random() * 9000)}#`);
                              setIsResetModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition"
                            title="Reset Password & require change"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER & ASSIGN ROLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create User & Assign Role</h3>
                  <p className="text-xs text-slate-400">Only Super Admin can provision client logins.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Patel, Meena Devi, or CA Rajesh"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. ramesh@apexmall.in"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. 9825011223"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Business / Store / Firm Name *
                </label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g. Apex Supermall, Meena Kirana Store, or Shah & Associates"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* ROLE PICKER */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Assign User Role (What screen will they see?) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(ROLE_CONFIGS).map(([roleKey, conf]) => {
                    const isSelected = newRole === roleKey;
                    const IconComponent = conf.icon;
                    return (
                      <button
                        type="button"
                        key={roleKey}
                        onClick={() => setNewRole(roleKey)}
                        className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-rose-500/15 border-rose-500 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {conf.label}
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{conf.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Temporary Password */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Initial Temporary Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPassword(`Temp@${Math.floor(1000 + Math.random() * 9000)}#`)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                  >
                    🎲 Regenerate
                  </button>
                </div>
                <p className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> User will be forced to change this password immediately on their first login.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition active:scale-95"
                >
                  Save & Generate Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetModalOpen && selectedUserForReset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Reset Temporary Password</span>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Reset password for <strong>{selectedUserForReset.name}</strong> ({selectedUserForReset.email}). They will be required to change it immediately upon login.
            </p>

            <div>
              <label className="text-xs text-slate-400 block mb-1">New Temporary Password:</label>
              <input
                type="text"
                value={tempResetPw}
                onChange={(e) => setTempResetPw(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetPassword}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition"
              >
                Confirm & Require Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
