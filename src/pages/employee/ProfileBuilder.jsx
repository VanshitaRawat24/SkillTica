import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';

const SECTIONS = [
  { id: 'personal',        label: 'Personal Details',          icon: '👤' },
  { id: 'education',       label: 'Education',                 icon: '🎓' },
  { id: 'skills',          label: 'Skills',                    icon: '⚡' },
  { id: 'experience',      label: 'Experience',                icon: '💼' },
  { id: 'certs',           label: 'Certifications',            icon: '📜' },
  { id: 'projects',        label: 'Projects / Achievements',   icon: '🚀' },
  { id: 'behavioral',      label: 'Behavioral Assessment',      icon: '🧠' },
  { id: 'career',          label: 'Career Interests',          icon: '🎯' },
];

const ALL_SKILLS = ['React', 'JavaScript', 'TypeScript', 'CSS', 'Node.js', 'Python', 'SQL', 'REST APIs',
  'Docker', 'AWS', 'GraphQL', 'Machine Learning', 'TensorFlow', 'Figma', 'UI/UX', 'Agile', 'Leadership',
  'Kubernetes', 'CI/CD', 'Linux', 'Terraform', 'Data Analysis', 'Statistics', 'Prototyping'];

// ─── FORMS ───
const PersonalForm = ({ emp, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="form-group">
      <label className="form-label">Phone</label>
      <input className="form-control" defaultValue={emp.personal?.phone} placeholder="+1 555-0000"
        onChange={e => onChange({ phone: e.target.value, location: emp.personal?.location || '' })} />
    </div>
    <div className="form-group">
      <label className="form-label">Location</label>
      <input className="form-control" defaultValue={emp.personal?.location} placeholder="City, State"
        onChange={e => onChange({ location: e.target.value, phone: emp.personal?.phone || '' })} />
    </div>
  </div>
);

const EducationForm = ({ emp, onChange }) => {
  const edu = emp.education || {};
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="form-group" style={{ gridColumn: 'span 2' }}>
        <label className="form-label">Degree / Qualification</label>
        <select className="form-control" value={edu.degree || ""} onChange={e => onChange({ ...edu, degree: e.target.value })}>
          <option value="" disabled>Select a Degree</option>
          <option value="High School">High School</option>
          <option value="Associate Degree">Associate Degree</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
          <option value="Master's Degree">Master's Degree</option>
          <option value="Ph.D.">Ph.D.</option>
          <option value="Diploma / Certification">Diploma / Certification</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Institution</label>
        <input className="form-control" defaultValue={edu.institution} placeholder="University Name"
          onChange={e => onChange({ ...edu, institution: e.target.value })} />
      </div>
    </div>
  );
};

const SkillsForm = ({ emp, onChange }) => {
  const current = Array.isArray(emp.skills) ? emp.skills : Object.keys(emp.skills || {});
  const addSkill = (e) => {
    const skill = e.target.value;
    if (skill && !current.includes(skill)) {
      onChange([...current, skill]);
    }
    e.target.value = ""; // Reset dropdown
  };
  const removeSkill = (skill) => {
    onChange(current.filter(s => s !== skill));
  };
  return (
    <div>
      <div className="form-group mb-4">
        <label className="form-label">Add a Skill</label>
        <select className="form-control" onChange={addSkill} defaultValue="">
          <option value="" disabled>-- Select a Skill --</option>
          {ALL_SKILLS.filter(s => !current.includes(s)).map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {current.map(skill => (
          <div key={skill} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.75rem', borderRadius: 99, fontSize: '0.82rem', fontWeight: 500,
            border: '1px solid var(--accent-primary)', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)'
          }}>
            {skill}
            <button onClick={() => removeSkill(skill)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, display: 'flex', color: 'var(--accent-primary)' }}>
              &times;
            </button>
          </div>
        ))}
        {current.length === 0 && <div className="text-secondary text-sm">No skills added yet. Select from the dropdown above.</div>}
      </div>
    </div>
  );
};

const ExperienceForm = ({ emp, onChange }) => {
  const exp = emp.experience || {};
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="form-group">
        <label className="form-label">Current Role</label>
        <input className="form-control" defaultValue={exp.currentRole} onChange={e => onChange({ ...exp, currentRole: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Department</label>
        <input className="form-control" defaultValue={exp.department} onChange={e => onChange({ ...exp, department: e.target.value })} />
      </div>
    </div>
  );
};

const BehavioralForm = ({ emp, onChange }) => {
  const bev = emp.behavioral || {};
  return (
    <div className="flex flex-col gap-4">
      <div className="form-group">
        <label className="form-label">1. How do you approach complex problems?</label>
        <select className="form-control" value={bev.q1 || ""} onChange={e => onChange({ ...bev, q1: e.target.value })}>
          <option value="" disabled>Select an approach...</option>
          <option value="analytical">I break them down into smaller, logical parts.</option>
          <option value="creative">I brainstorm unconventional solutions.</option>
          <option value="collaborative">I seek input and collaborate with others.</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">2. How do you handle tight deadlines?</label>
        <select className="form-control" value={bev.q2 || ""} onChange={e => onChange({ ...bev, q2: e.target.value })}>
          <option value="" disabled>Select an approach...</option>
          <option value="focus">I prioritize tasks and focus deeply.</option>
          <option value="delegate">I delegate where possible and track progress.</option>
          <option value="stress">I work faster but manage stress independently.</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">3. What motivates you the most at work?</label>
        <select className="form-control" value={bev.q3 || ""} onChange={e => onChange({ ...bev, q3: e.target.value })}>
          <option value="" disabled>Select an option...</option>
          <option value="impact">Seeing the direct impact of my work.</option>
          <option value="learning">Continuous learning and new challenges.</option>
          <option value="team">A supportive and collaborative team environment.</option>
        </select>
      </div>
    </div>
  );
};

const EmptyForm = ({ emp, onChange, sectionName }) => (
  <div className="p-4 text-secondary text-sm">Form logic for {sectionName} goes here in a full build. Type something to save and pass completion check:
    <input className="form-control mt-2" onChange={e => onChange({ test: e.target.value })} />
  </div>
);

// ─── BUILDER ───
const ProfileBuilder = () => {
  const { currentUser, updateProfileSection } = useApp();
  const [active, setActive] = useState('personal');
  const [pending, setPending] = useState({});
  const [saved, setSaved] = useState({});

  if (!currentUser) return null;

  const handleSave = async () => {
    await updateProfileSection(active, pending);
    setSaved({ ...saved, [active]: true });
    setTimeout(() => setSaved(s => ({ ...s, [active]: false })), 2000);
  };

  const FORMS = { personal: PersonalForm, education: EducationForm, skills: SkillsForm, experience: ExperienceForm, behavioral: BehavioralForm };
  const ActiveForm = FORMS[active] || EmptyForm;

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Profile Builder</h1>
        <p className="page-subtitle">Save data to the database to watch completion percentage grow.</p>
        <div className="mt-4" style={{ maxWidth: 500 }}>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-secondary">Overall Completion</span>
            <span className="text-sm font-bold text-accent">{currentUser.completionPct || 0}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 99 }}>
            <div style={{ width: `${currentUser.completionPct || 0}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 99, transition: 'width 0.5s' }} />
          </div>
        </div>
      </div>

      <div className="profile-builder-layout">
        <aside className="profile-section-list">
          {SECTIONS.map(s => {
            const isDone = currentUser[s.id] && currentUser[s.id] !== 'null' && currentUser[s.id] !== '[]' && currentUser[s.id] !== '{}';
            const isActive = active === s.id;
            return (
              <button key={s.id} className={`section-nav-item${isActive ? ' active' : ''}`} onClick={() => setActive(s.id)}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.87rem', fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</div>
                </div>
                {isDone ? <CheckCircle size={16} color="var(--success)" /> : <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />}
              </button>
            );
          })}
        </aside>

        <div className="card profile-form-area">
          <h2 className="font-bold text-lg mb-5">
            {SECTIONS.find(s => s.id === active)?.icon} {SECTIONS.find(s => s.id === active)?.label}
          </h2>
          <ActiveForm emp={currentUser} onChange={data => setPending(data)} sectionName={active} />
          
          <div className="flex justify-end mt-6">
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> {saved[active] ? 'Saved to Details DB!' : 'Save to DB'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBuilder;
