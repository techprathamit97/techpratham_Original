// AWS S3 Video Configuration
// Add your S3 video URLs here for easy management

export interface VideoConfig {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
}

// Main S3 bucket base URL
export const S3_BASE_URL = "https://content.techpratham.com";

// Video configurations
export const VIDEOS: VideoConfig[] = [
  {
    id: "study-materials",
    url: `${S3_BASE_URL}/study_metrial.mp4`,
    title: "Learning Materials",
    description: "Comprehensive study materials for your success",
    category: "education",
    duration: "5:30"
  },
  {
    id: "resume-building",
    url: `${S3_BASE_URL}/resume-buidling-session.mp4`,
    title: "Resume Building Session",
    description: "Professional resume building session with experts",
    category: "career",
    duration: "8:45"
  },
  {
    id: "interview-prep",
    url: `${S3_BASE_URL}/interview_preparation.mp4`,
    title: "Interview Preparation",
    description: "Master your interview skills with our guidance",
    category: "career",
    duration: "12:20"
  },
  {
    id: "live-project",
    url: `${S3_BASE_URL}/Live%20Project%20Demonstration.mp4`,
    title: "Live Project Demonstration",
    description: "Real-world project demonstrations and walkthroughs",
    category: "practical",
    duration: "15:10"
  }
];

// Video categories
export const VIDEO_CATEGORIES = {
  education: "Educational Content",
  career: "Career Development", 
  practical: "Practical Training",
  testimonial: "Student Testimonials"
};

// Helper functions
export const getVideoById = (id: string): VideoConfig | undefined => {
  return VIDEOS.find(video => video.id === id);
};

export const getVideosByCategory = (category: string): VideoConfig[] => {
  return VIDEOS.filter(video => video.category === category);
};

export const getRandomVideo = (): VideoConfig => {
  const randomIndex = Math.floor(Math.random() * VIDEOS.length);
  return VIDEOS[randomIndex];
};

// Banner specific videos (for homepage banner)
export const BANNER_VIDEOS = VIDEOS.slice(0, 2); // First 2 videos for banner

// Featured video (main banner video)
export const FEATURED_VIDEO = VIDEOS[0];

export default VIDEOS;