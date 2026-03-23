import { GraduationCap, Users, BookOpen, DollarSign, ClipboardCheck, FileText } from 'lucide-react'

const STATS = [
  { label: 'Total Students',   value: '—', icon: GraduationCap, color: 'blue'   },
  { label: 'Total Teachers',   value: '—', icon: Users,         color: 'green'  },
  { label: 'Classes',          value: '—', icon: BookOpen,      color: 'purple' },
  { label: 'Fee Collected',    value: '—', icon: DollarSign,    color: 'amber'  },
  { label: 'Attendance Today', value: '—', icon: ClipboardCheck,color: 'rose'   },
  { label: 'Exams This Month', value: '—', icon: FileText,      color: 'indigo' },
]

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <h2>Welcome back, Admin 👋</h2>
        <p>Here's what's happening at your school today.</p>
      </div>

      <div className="stat-grid">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`stat-card-icon ${color}`}>
              <Icon />
            </div>
            <div>
              <div className="stat-card-label">{label}</div>
              <div className="stat-card-value">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="card-body">
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-400)', fontStyle: 'italic' }}>
              Activity feed will appear here.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Upcoming Exams</h3>
          </div>
          <div className="card-body">
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-400)', fontStyle: 'italic' }}>
              Upcoming exams will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
