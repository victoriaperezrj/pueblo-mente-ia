import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
  Target,
  Award,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Filter,
  MoreVertical,
  Send,
  Video
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  contact_type: string;
  lifetime_value: number;
  engagement_score: number;
  created_at: string;
  last_contacted?: string;
  tags: string[];
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date?: string;
  created_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description?: string;
  scheduled_at?: string;
  completed: boolean;
  priority: string;
  created_at: string;
}

const CRM360: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [filter, setFilter] = useState<'all' | 'lead' | 'prospect' | 'customer'>('all');

  // Mock data
  const contacts: Contact[] = [
    {
      id: '1',
      first_name: 'María',
      last_name: 'González',
      email: 'maria.gonzalez@techcorp.com',
      phone: '+54 11 1234-5678',
      company: 'TechCorp Argentina',
      job_title: 'CEO',
      contact_type: 'customer',
      lifetime_value: 125000,
      engagement_score: 85,
      created_at: '2024-01-15',
      last_contacted: '2024-11-10',
      tags: ['vip', 'enterprise', 'tech']
    },
    {
      id: '2',
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      email: 'carlos.r@startup.io',
      phone: '+54 9 2345-6789',
      company: 'StartupIO',
      job_title: 'Founder',
      contact_type: 'prospect',
      lifetime_value: 0,
      engagement_score: 65,
      created_at: '2024-10-20',
      tags: ['startup', 'saas']
    },
    {
      id: '3',
      first_name: 'Ana',
      last_name: 'Martínez',
      email: 'ana.martinez@retail.com',
      company: 'Retail SA',
      job_title: 'Operations Manager',
      contact_type: 'lead',
      lifetime_value: 0,
      engagement_score: 45,
      created_at: '2024-11-05',
      tags: ['retail']
    }
  ];

  const deals: Deal[] = [
    {
      id: 'd1',
      title: 'Enterprise Platform License',
      value: 50000,
      stage: 'proposal',
      probability: 70,
      expected_close_date: '2025-01-15',
      created_at: '2024-10-01'
    },
    {
      id: 'd2',
      title: 'Consulting Services Package',
      value: 35000,
      stage: 'negotiation',
      probability: 85,
      expected_close_date: '2024-12-20',
      created_at: '2024-09-15'
    }
  ];

  const activities: Activity[] = [
    {
      id: 'a1',
      activity_type: 'meeting',
      title: 'Product Demo Call',
      description: 'Show enterprise features',
      scheduled_at: '2024-11-18T14:00:00',
      completed: false,
      priority: 'high',
      created_at: '2024-11-15'
    },
    {
      id: 'a2',
      activity_type: 'email',
      title: 'Follow-up email sent',
      completed: true,
      priority: 'medium',
      created_at: '2024-11-10'
    },
    {
      id: 'a3',
      activity_type: 'call',
      title: 'Discovery Call',
      completed: true,
      priority: 'high',
      created_at: '2024-11-01'
    }
  ];

  const selectedContactData = selectedContact || contacts[0];

  // Customer 360 data
  const interactionHistory = [
    { month: 'Jun', emails: 12, calls: 3, meetings: 2 },
    { month: 'Jul', emails: 15, calls: 4, meetings: 3 },
    { month: 'Aug', emails: 10, calls: 5, meetings: 2 },
    { month: 'Sep', emails: 18, calls: 2, meetings: 4 },
    { month: 'Oct', emails: 20, calls: 6, meetings: 5 },
    { month: 'Nov', emails: 14, calls: 4, meetings: 3 }
  ];

  const dealStageBreakdown = [
    { stage: 'Qualification', count: 3, color: '#6366f1' },
    { stage: 'Proposal', count: 5, color: '#8b5cf6' },
    { stage: 'Negotiation', count: 4, color: '#ec4899' },
    { stage: 'Won', count: 8, color: '#10b981' }
  ];

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'customer': return 'from-green-500 to-emerald-600';
      case 'prospect': return 'from-blue-500 to-cyan-600';
      case 'lead': return 'from-orange-500 to-yellow-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = `${contact.first_name} ${contact.last_name} ${contact.email} ${contact.company}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || contact.contact_type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">CRM & Customer 360°</h1>
                <p className="text-blue-200">Complete customer relationship management</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts by name, email, or company..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {['all', 'lead', 'prospect', 'customer'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as any)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    filter === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-blue-200 hover:bg-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-h-[800px] overflow-y-auto"
          >
            <h2 className="text-lg font-bold text-white mb-4">Contacts ({filteredContacts.length})</h2>

            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedContactData.id === contact.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getContactTypeColor(contact.contact_type)} rounded-full flex items-center justify-center text-white font-bold`}>
                        {contact.first_name[0]}{contact.last_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{contact.first_name} {contact.last_name}</p>
                        <p className="text-xs text-blue-200">{contact.company}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(contact.engagement_score > 70 ? 'high' : contact.engagement_score > 40 ? 'medium' : 'low')}`}>
                      {contact.engagement_score}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-blue-200">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {contact.email.split('@')[0]}...
                    </span>
                    {contact.lifetime_value > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${(contact.lifetime_value / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 mt-2">
                    {contact.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Customer 360° View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getContactTypeColor(selectedContactData.contact_type)} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                    {selectedContactData.first_name[0]}{selectedContactData.last_name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedContactData.first_name} {selectedContactData.last_name}</h2>
                    <p className="text-blue-200">{selectedContactData.job_title} at {selectedContactData.company}</p>
                    <div className="flex gap-2 mt-2">
                      {selectedContactData.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                    <Mail className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                    <Phone className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                    <MoreVertical className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">${(selectedContactData.lifetime_value / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-blue-200">Lifetime Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{selectedContactData.engagement_score}</div>
                  <div className="text-xs text-blue-200">Engagement Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{deals.length}</div>
                  <div className="text-xs text-blue-200">Active Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{activities.filter(a => a.completed).length}/{activities.length}</div>
                  <div className="text-xs text-blue-200">Activities</div>
                </div>
              </div>
            </div>

            {/* Interaction History Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Interaction History</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interactionHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="month" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="emails" fill="#3b82f6" name="Emails" />
                    <Bar dataKey="calls" fill="#8b5cf6" name="Calls" />
                    <Bar dataKey="meetings" fill="#ec4899" name="Meetings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Deals & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Deals */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Active Deals</h3>
                <div className="space-y-3">
                  {deals.map((deal) => (
                    <div key={deal.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white">{deal.title}</p>
                          <p className="text-sm text-blue-200 capitalize">{deal.stage.replace('_', ' ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">${(deal.value / 1000).toFixed(0)}k</p>
                          <p className="text-xs text-blue-200">{deal.probability}% prob</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 h-1.5 rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className={`p-2 rounded-lg ${activity.completed ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold text-white">{activity.title}</p>
                          {activity.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </div>
                        {activity.description && <p className="text-xs text-blue-200 mt-1">{activity.description}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(activity.priority)}`}>
                            {activity.priority}
                          </span>
                          {activity.scheduled_at && (
                            <span className="text-xs text-blue-300 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(activity.scheduled_at).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CRM360;
