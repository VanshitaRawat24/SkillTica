// ─────────────────────────────────────────────
// PEOPLE INTELLIGENCE DASHBOARD – MOCK DATA
// ─────────────────────────────────────────────

export const ROLES_DB = {
  "Frontend Developer": {
    requiredSkills: ["React", "JavaScript", "CSS", "TypeScript", "UI/UX", "REST APIs"],
    experienceYears: 2,
  },
  "Backend Developer": {
    requiredSkills: ["Node.js", "Python", "SQL", "REST APIs", "Docker", "AWS"],
    experienceYears: 3,
  },
  "Full Stack Developer": {
    requiredSkills: ["React", "Node.js", "SQL", "REST APIs", "JavaScript", "Docker"],
    experienceYears: 3,
  },
  "Data Scientist": {
    requiredSkills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow", "Data Analysis"],
    experienceYears: 2,
  },
  "DevOps Engineer": {
    requiredSkills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"],
    experienceYears: 3,
  },
  "Product Manager": {
    requiredSkills: ["Agile", "Roadmapping", "Data Analysis", "Stakeholder Management", "Leadership"],
    experienceYears: 4,
  },
  "UI/UX Designer": {
    requiredSkills: ["Figma", "UI/UX", "Prototyping", "User Research", "CSS"],
    experienceYears: 2,
  },
  "Engineering Manager": {
    requiredSkills: ["Leadership", "Agile", "System Design", "Stakeholder Management", "Node.js", "Architecture"],
    experienceYears: 6,
  },
};

export const EMPLOYEES = [
  {
    id: "emp_001",
    name: "Alex Mercer",
    email: "alex@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Alex+Mercer&background=6366f1&color=fff&size=100",
    department: "Engineering",
    currentRole: "Senior Frontend Developer",
    desiredRole: "Full Stack Developer",
    yearsExperience: 5,
    joinDate: "2021-03-15",
    personal: { phone: "+1 555-0101", location: "San Francisco, CA", linkedin: "alexmercer", github: "alexmercer" },
    education: [{ degree: "B.S. Computer Science", institution: "UC Berkeley", year: 2019 }],
    skills: ["React", "JavaScript", "TypeScript", "CSS", "REST APIs", "Node.js", "GraphQL"],
    certifications: ["AWS Cloud Practitioner", "Meta React Developer"],
    projects: [
      { name: "Dashboard SaaS App", description: "Led front-end for a 50k user SaaS platform", impact: "High" },
      { name: "Design System Library", description: "Built internal component library from scratch", impact: "Medium" }
    ],
    behavioralScore: 82,
    assessmentScore: 88,
    workloadHours: 42,
    teamCollaboration: 90,
    careerInterests: ["Full Stack", "Tech Lead", "Startups"],
    profileCompletion: 95,
    roleFitScores: { "Full Stack Developer": 88, "Frontend Developer": 96, "Engineering Manager": 60 },
    aiInsight: "Alex demonstrates exceptional frontend mastery with growing full-stack exposure. Strong behavioral metrics make them a top candidate for a Full Stack transition or Lead role. Recommend fast-tracking to Staff Engineer review.",
    riskLevel: "low",
    promotionReady: true,
    highPotential: true,
  },
  {
    id: "emp_002",
    name: "Sara Chen",
    email: "sara@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Sara+Chen&background=ec4899&color=fff&size=100",
    department: "Data",
    currentRole: "Data Analyst",
    desiredRole: "Data Scientist",
    yearsExperience: 3,
    joinDate: "2022-06-01",
    personal: { phone: "+1 555-0102", location: "New York, NY", linkedin: "sarachen", github: "sarachen" },
    education: [{ degree: "M.S. Statistics", institution: "Columbia University", year: 2021 }],
    skills: ["Python", "SQL", "Data Analysis", "Statistics", "Tableau", "Machine Learning"],
    certifications: ["Google Data Analytics", "Coursera ML Specialization"],
    projects: [
      { name: "Churn Prediction Model", description: "Built 91% accuracy model reducing churn by 18%", impact: "High" }
    ],
    behavioralScore: 91,
    assessmentScore: 85,
    workloadHours: 46,
    teamCollaboration: 87,
    careerInterests: ["Data Science", "AI/ML", "Research"],
    profileCompletion: 88,
    roleFitScores: { "Data Scientist": 87, "Backend Developer": 45, "Product Manager": 62 },
    aiInsight: "Sara is a high-impact data professional with a sharp statistical foundation. Her churn prediction project directly demonstrates business value. Missing TensorFlow experience is the only gap to close for a full Data Scientist transition.",
    riskLevel: "low",
    promotionReady: true,
    highPotential: true,
  },
  {
    id: "emp_003",
    name: "Marcus Johnson",
    email: "marcus@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=10b981&color=fff&size=100",
    department: "Engineering",
    currentRole: "Backend Developer",
    desiredRole: "DevOps Engineer",
    yearsExperience: 4,
    joinDate: "2021-09-01",
    personal: { phone: "+1 555-0103", location: "Austin, TX", linkedin: "marcusjohnson", github: "marcusdev" },
    education: [{ degree: "B.S. Software Engineering", institution: "UT Austin", year: 2020 }],
    skills: ["Node.js", "Python", "SQL", "Docker", "REST APIs", "AWS", "Linux"],
    certifications: ["AWS Solutions Architect", "Docker Certified"],
    projects: [
      { name: "Microservices Migration", description: "Led migration from monolith to microservices", impact: "High" },
      { name: "API Gateway Design", description: "Designed high-performance API gateway handling 1M rps", impact: "High" }
    ],
    behavioralScore: 79,
    assessmentScore: 91,
    workloadHours: 55,
    teamCollaboration: 70,
    careerInterests: ["DevOps", "Cloud Architecture", "SRE"],
    profileCompletion: 92,
    roleFitScores: { "DevOps Engineer": 82, "Backend Developer": 94, "Full Stack Developer": 72 },
    aiInsight: "Marcus has a rock-solid backend foundation with emerging cloud expertise. At 55 hrs/week, burnout risk is rising. His technical depth in Docker and AWS make him a prime candidate for the DevOps transition. Recommend workload reduction and CI/CD certification.",
    riskLevel: "medium",
    promotionReady: false,
    highPotential: true,
  },
  {
    id: "emp_004",
    name: "Priya Patel",
    email: "priya@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=f59e0b&color=fff&size=100",
    department: "Product",
    currentRole: "Product Manager",
    desiredRole: "Engineering Manager",
    yearsExperience: 7,
    joinDate: "2019-01-10",
    personal: { phone: "+1 555-0104", location: "Seattle, WA", linkedin: "priyapatel", github: "" },
    education: [{ degree: "MBA", institution: "Stanford GSB", year: 2018 }],
    skills: ["Agile", "Roadmapping", "Stakeholder Management", "Leadership", "Data Analysis", "Figma"],
    certifications: ["PMP", "Certified Scrum Master"],
    projects: [
      { name: "Product 0 to 1", description: "Launched B2B SaaS product from concept to $2M ARR", impact: "High" }
    ],
    behavioralScore: 95,
    assessmentScore: 80,
    workloadHours: 40,
    teamCollaboration: 98,
    careerInterests: ["Leadership", "Engineering Growth", "Strategy"],
    profileCompletion: 100,
    roleFitScores: { "Engineering Manager": 83, "Product Manager": 98, "Data Scientist": 30 },
    aiInsight: "Priya is the highest behavioral performer in the organization. With 7+ years of cross-functional leadership and a proven track record of launching products, she is an immediate candidate for an Engineering Manager or Director of Product role.",
    riskLevel: "low",
    promotionReady: true,
    highPotential: true,
  },
  {
    id: "emp_005",
    name: "Jordan Williams",
    email: "jordan@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Jordan+Williams&background=8b5cf6&color=fff&size=100",
    department: "Design",
    currentRole: "UI/UX Designer",
    desiredRole: "Product Designer Lead",
    yearsExperience: 3,
    joinDate: "2022-02-15",
    personal: { phone: "+1 555-0105", location: "Los Angeles, CA", linkedin: "jordanwilliams", github: "" },
    education: [{ degree: "B.A. Graphic Design", institution: "Art Center College", year: 2021 }],
    skills: ["Figma", "UI/UX", "Prototyping", "User Research", "CSS", "Adobe XD"],
    certifications: ["Google UX Design Certificate"],
    projects: [
      { name: "Mobile App Redesign", description: "Redesigned app increasing retention by 32%", impact: "High" }
    ],
    behavioralScore: 88,
    assessmentScore: 75,
    workloadHours: 38,
    teamCollaboration: 93,
    careerInterests: ["Design Systems", "Product Strategy", "Mobile UX"],
    profileCompletion: 78,
    roleFitScores: { "UI/UX Designer": 95, "Product Manager": 58, "Frontend Developer": 40 },
    aiInsight: "Jordan is an exceptional designer whose mobile redesign work demonstrates direct business impact. Strong collaboration metrics indicate team-building capabilities. Completing profile sections (Certifications and Behavioral) would unlock senior-level visibility.",
    riskLevel: "low",
    promotionReady: false,
    highPotential: true,
  },
  {
    id: "emp_006",
    name: "Danny Kim",
    email: "danny@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Danny+Kim&background=ef4444&color=fff&size=100",
    department: "Engineering",
    currentRole: "Junior Backend Developer",
    desiredRole: "Backend Developer",
    yearsExperience: 1,
    joinDate: "2024-01-20",
    personal: { phone: "+1 555-0106", location: "Chicago, IL", linkedin: "dannykim", github: "dannykim" },
    education: [{ degree: "B.S. Computer Science", institution: "UIC", year: 2023 }],
    skills: ["Python", "SQL", "REST APIs"],
    certifications: [],
    projects: [
      { name: "Inventory API", description: "Built internal REST API for inventory management", impact: "Low" }
    ],
    behavioralScore: 70,
    assessmentScore: 65,
    workloadHours: 58,
    teamCollaboration: 65,
    careerInterests: ["Backend Dev", "Databases"],
    profileCompletion: 55,
    roleFitScores: { "Backend Developer": 45, "Full Stack Developer": 30, "DevOps Engineer": 20 },
    aiInsight: "Danny is early in their career with a promising foundation. Current skill gaps in Docker and Node.js are critical for advancement. Note: 58-hour workload weeks are unsustainable. Recommend mentoring program enrollment and an immediate workload review.",
    riskLevel: "high",
    promotionReady: false,
    highPotential: false,
  },
  {
    id: "emp_007",
    name: "Elena Rodriguez",
    email: "elena@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=06b6d4&color=fff&size=100",
    department: "Data",
    currentRole: "Data Scientist",
    desiredRole: "Data Scientist",
    yearsExperience: 6,
    joinDate: "2020-04-01",
    personal: { phone: "+1 555-0107", location: "Boston, MA", linkedin: "elenarodriguez", github: "elenards" },
    education: [{ degree: "Ph.D. Data Science", institution: "MIT", year: 2019 }],
    skills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow", "Data Analysis", "R", "Spark"],
    certifications: ["TensorFlow Developer Cert", "Google Cloud ML Engineer"],
    projects: [
      { name: "Demand Forecasting Engine", description: "Built ML pipeline saving $4M/year in inventory costs", impact: "High" },
      { name: "NLP Sentiment Analysis", description: "Real-time product review analysis system", impact: "High" },
    ],
    behavioralScore: 86,
    assessmentScore: 97,
    workloadHours: 44,
    teamCollaboration: 80,
    careerInterests: ["AI Research", "MLOps", "Tech Lead"],
    profileCompletion: 100,
    roleFitScores: { "Data Scientist": 98, "ML Engineer": 94, "Engineering Manager": 65 },
    aiInsight: "Elena is the strongest technical individual contributor in the organization. Her PhD foundation, combined with two high-business-impact projects and near-perfect assessment scores, make her a top candidate for a Principal or Staff Data Scientist role.",
    riskLevel: "low",
    promotionReady: true,
    highPotential: true,
  },
  {
    id: "emp_008",
    name: "Ben Carter",
    email: "ben@peopleiq.io",
    avatar: "https://ui-avatars.com/api/?name=Ben+Carter&background=64748b&color=fff&size=100",
    department: "Engineering",
    currentRole: "DevOps Engineer",
    desiredRole: "DevOps Engineer",
    yearsExperience: 5,
    joinDate: "2021-07-12",
    personal: { phone: "+1 555-0108", location: "Denver, CO", linkedin: "bencarter", github: "bencarter" },
    education: [{ degree: "B.S. Information Technology", institution: "Colorado State", year: 2020 }],
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Ansible"],
    certifications: ["AWS Solutions Architect Pro", "CKA (Kubernetes Admin)"],
    projects: [
      { name: "Zero-Downtime Deployment System", description: "Eliminated 99.9% of deployment errors org-wide", impact: "High" }
    ],
    behavioralScore: 75,
    assessmentScore: 90,
    workloadHours: 41,
    teamCollaboration: 72,
    careerInterests: ["Platform Engineering", "SRE", "Cloud Architecture"],
    profileCompletion: 82,
    roleFitScores: { "DevOps Engineer": 97, "Backend Developer": 70, "Engineering Manager": 45 },
    aiInsight: "Ben is the most complete DevOps profile in the organization with every key skill verified. His deployment system project demonstrates direct operational impact. A Platform Engineering Lead role would be a natural and high-value promotion path.",
    riskLevel: "low",
    promotionReady: true,
    highPotential: false,
  },
];

// ─── SCORING ENGINE ─────────────────────────────
export function computeRoleFit(employee, roleName) {
  const role = ROLES_DB[roleName];
  if (!role) return 0;

  const empSkills = Array.isArray(employee.skills) ? employee.skills : Object.values(employee.skills || {});
  const matched = role.requiredSkills.filter(s => empSkills.includes(s)).length;
  // Handle case where requiredSkills is empty
  const skillMatch = role.requiredSkills.length > 0 ? (matched / role.requiredSkills.length) * 100 : 100;

  const expYears = Number(employee.yearsExperience) || 0;
  const expMatch = role.experienceYears > 0 ? Math.min((expYears / role.experienceYears) * 100, 100) : 100;

  const behavioral = Number(employee.behavioralScore) || 0;
  const assessment = Number(employee.assessmentScore) || 0;

  return Math.round(
    skillMatch * 0.40 +
    expMatch * 0.30 +
    behavioral * 0.20 +
    assessment * 0.10
  ) || 0;
}

export function getSkillGap(employee, roleName) {
  const role = ROLES_DB[roleName];
  if (!role) return [];
  return role.requiredSkills.filter(s => !(employee.skills || []).includes(s));
}

export function generateAiInsight(employee) {
  if (employee.aiInsight) return employee.aiInsight;
  const topSkill = employee.skills?.[0] || "general skills";
  return `${employee.name} has a strong background in ${topSkill} with ${employee.yearsExperience} years of experience. Completing the remaining profile sections will unlock more precise career recommendations.`;
}

export function computeTeamScore(members) {
  if (!members.length) return { score: 0, skills: [], gaps: [], behavioralAvg: 0, warning: "" };
  const allSkills = [...new Set(members.flatMap(m => m.skills))];
  const behavioralAvg = Math.round(members.reduce((s, m) => s + m.behavioralScore, 0) / members.length);
  const skillDiversity = Math.min(allSkills.length * 6, 100);
  const expSpread = members.length > 1 ? Math.min(
    (Math.max(...members.map(m => m.yearsExperience)) - Math.min(...members.map(m => m.yearsExperience))) * 10, 30
  ) : 0;
  const score = Math.round((skillDiversity * 0.5) + (behavioralAvg * 0.3) + (expSpread * 0.2));
  const warning = behavioralAvg < 75 ? "Low behavioral compatibility detected." : members.length < 3 ? "Consider adding more members for balance." : "";
  return { score: Math.min(score, 100), skills: allSkills, behavioralAvg, warning, memberCount: members.length };
}
