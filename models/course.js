
import mongoose from "mongoose";

const curriculumSchema = new mongoose.Schema({
  que: { type: String, required: true },
  ans: { type: String, required: true },
  topics: [String],
});

const faqSchema = new mongoose.Schema({
  que: { type: String, required: true },
  ans: { type: String, required: true },
});

const seoFaqSchema = new mongoose.Schema({
  que: { type: String, required: true },
  ans: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  company: { type: String, required: true },
  logo: { type: String, required: false },
  title: { type: String, required: true },
  scenario: { type: String, required: true },
  liveWork: [{ type: String, required: false }],
  outcome: { type: String, required: true },
  objective: { type: String, required: false, default: '' },
});


const interviewQuestionSchema = new mongoose.Schema({
  que: { type: String, required: false },
  ans: { type: String, required: false },
});

const jobRoleSchema = new mongoose.Schema({
  role: { type: String, required: false },
});
const aboutCertificateSchema = new mongoose.Schema({
  heading: { type: String, required: false },
  paragraph: { type: String, required: false },
  
});

const courseSchema = new mongoose.Schema(
  {
   
    link: { type: String, required: true, unique: true, index: true },
    // 💡 Change: Add index to 'title' (used in client-side search/filter)
    title: { type: String, required: true, index: true }, 
    shortDesc: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String },
    description: { type: String, required: true },
    certificateName: { type: String, required: false }, // Dynamic certificate name
    whoShouldTakeTitle: { type: String, required: false }, // Custom title for Who Should Take section
    jobRoleTitle: { type: String, required: false }, // Custom title for Job Role section
    curriculumTitle: { type: String, required: false }, // Custom title for Curriculum section
    projectTitle: { type: String, required: false }, // Custom title for Project section
    rating: { type: String, required: true },
    duration: { type: String, required: true },
    // 💡 Change: Add index to 'level' (used in filtering/sorting)
    level: { type: String, required: true, index: true }, 
    // 💡 Change: Add index to 'category' (critical for grouping and filtering)
    category: { type: String, required: true, index: true }, 
    // 💡 Change: Add index to 'trending' (used for filtering/sorting)
    trending: { type: Boolean, default: false, index: true },
    // 💡 Priority field for ordering courses (higher number = higher priority)
    priority: { type: Number, default: 0, index: true },
    placement_report: { type: String, required: true },
    // placement_report: { type: String, required: true },
    curriculum: { type: String, required: true },
    interview: { type: String, required: true },
    videoLink: { type: String, required: false },
    curriculum_data: [curriculumSchema],
    skills_data: [String],
    assesment_link: { type: String, required: true },
    faqs_data: [faqSchema],
    seo_faqs_data: [seoFaqSchema], // SEO FAQs for the new section
    project_data: [projectSchema],
    interview_questions_data: [interviewQuestionSchema],
    job_role: [jobRoleSchema],
    about_certificate_data: aboutCertificateSchema,
    metadata: {
      title: { type: String },
      description: { type: String },
      keywords: { type: [String] },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
