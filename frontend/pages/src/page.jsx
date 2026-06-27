import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/kirubel/api';
const MEDIA_URL = 'http://localhost:8000';

const App1 = () => {
  const [portfolio, setPortfolio] = useState({
    introduction: null,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certificates: [],
    articles: [],
    contact: null,
    last: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireFormData, setHireFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    certificates: useRef(null),
    education: useRef(null),
    articles: useRef(null),
    contact: useRef(null)
  };

  useEffect(() => {
    fetchFullPortfolio();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
      
      const scrollPosition = window.scrollY + 100;
      
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setZoomedImage(null);
        setFullscreenVideo(null);
        setShowHireModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchFullPortfolio = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/full/`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setPortfolio(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    if (filePath.startsWith('/media/')) {
      return `${MEDIA_URL}${filePath}`;
    }
    if (filePath.startsWith('media/')) {
      return `${MEDIA_URL}/${filePath}`;
    }
    return `${MEDIA_URL}/media/${filePath}`;
  };

  const handleDownloadCV = () => {
    const cvCertificate = portfolio.certificates?.find(cert => 
      cert.certificate_name?.toLowerCase().includes('cv') || 
      cert.certificate_name?.toLowerCase().includes('resume')
    );
    
    if (cvCertificate?.cv) {
      window.open(getFileUrl(cvCertificate.cv), '_blank');
    } else if (portfolio.certificates?.[0]?.cv) {
      window.open(getFileUrl(portfolio.certificates[0].cv), '_blank');
    } else {
      alert('CV not available. Please contact me directly.');
    }
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    if (sectionRefs[section]?.current) {
      sectionRefs[section].current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openImageZoom = (imageUrl, title) => {
    setZoomedImage({ url: imageUrl, title: title });
    document.body.style.overflow = 'hidden';
  };

  const closeImageZoom = () => {
    setZoomedImage(null);
    document.body.style.overflow = 'auto';
  };

  const openVideoFullscreen = (videoUrl, title) => {
    setFullscreenVideo({ url: videoUrl, title: title });
    document.body.style.overflow = 'hidden';
  };

  const closeVideoFullscreen = () => {
    setFullscreenVideo(null);
    document.body.style.overflow = 'auto';
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('http://localhost:8000/kirubel/api/send-hire-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...hireFormData,
          subject: 'New Hire Request from Portfolio'
        })
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setHireFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setSubmitStatus(null);
          setShowHireModal(false);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-gray-800">Error loading portfolio</h2>
          <p className="text-red-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Navigation Bar - Hidden initially, appears on scroll */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolling 
          ? 'bg-white shadow-md py-3 translate-y-0 opacity-100' 
          : 'bg-transparent py-5 -translate-y-full opacity-0'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              scrolling ? 'text-gray-800' : 'text-white'
            }`}>
              {portfolio.introduction?.name || 'Kirubel Moges'}
            </div>
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'skills', 'projects', 'experience', 'certificates', 'education', 'articles', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-all duration-300 ${
                    activeSection === item 
                      ? scrolling ? 'text-black border-b-2 border-gray-600' : 'text-white border-b-2 border-white'
                      : scrolling ? 'text-gray-500 hover:text-black' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden focus:outline-none transition-colors duration-300 ${
                scrolling ? 'text-gray-700' : 'text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {mobileMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 space-y-2 rounded-lg p-4 ${
              scrolling ? 'bg-white shadow-lg' : 'bg-black/50 backdrop-blur-md'
            }`}>
              {['home', 'about', 'skills', 'projects', 'experience', 'certificates', 'education', 'articles', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`block w-full text-left px-4 py-2 capitalize transition-colors duration-300 ${
                    activeSection === item 
                      ? 'text-black bg-gray-200 rounded-lg' 
                      : scrolling ? 'text-gray-600 hover:text-black' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - LinkedIn Style */}
      <section ref={sectionRefs.home} id="home" className="relative">
        {/* Banner - Only top portion, not full page */}
        <div className="w-full h-[200px] md:h-[280px] lg:h-[320px] overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 cursor-pointer">
          {portfolio.introduction?.imagebackground && (
            <img
              src={getFileUrl(portfolio.introduction.imagebackground)}
              alt="Banner"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onClick={() => openImageZoom(getFileUrl(portfolio.introduction.imagebackground), 'Banner Image')}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        
        {/* Profile Section - Below banner, LinkedIn style */}
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20">
            {/* Profile Image - Left side on desktop, center on mobile */}
            <div className="flex justify-center md:justify-start">
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden cursor-pointer group">
                {portfolio.introduction?.image ? (
                  <img
                    src={getFileUrl(portfolio.introduction.image)}
                    alt={portfolio.introduction.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={() => openImageZoom(getFileUrl(portfolio.introduction.image), portfolio.introduction.name)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-900 flex items-center justify-center text-white text-4xl">
                    {portfolio.introduction?.name?.charAt(0) || 'K'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Name and Title - Next to image on desktop, below on mobile */}
            <div className="md:ml-6 mt-3 md:mt-0 text-center md:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {portfolio.introduction?.name || 'Kirubel Moges'}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mt-1">
                {portfolio.introduction?.career || 'Software Developer'}
              </p>
              {portfolio.introduction?.role && (
                <p className="text-sm text-gray-500 mt-1">{portfolio.introduction.role}</p>
              )}
              
              {/* Buttons - Below name */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <button 
                  onClick={() => setShowHireModal(true)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 shadow-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                >
                  Hire Me
                </button>
                <button 
                  onClick={handleDownloadCV}
                  className="px-6 py-2 border-2 border-gray-600 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300 text-sm font-medium"
                >
                  Download CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {portfolio.introduction?.about_me && (
        <section ref={sectionRefs.about} id="about" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">About Me</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 text-lg leading-relaxed">{portfolio.introduction.about_me}</p>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {portfolio.skills?.length > 0 && portfolio.skills[0] && (
        <section ref={sectionRefs.skills} id="skills" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Technical Skills</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <SkillCard title="Languages" skills={portfolio.skills[0].language} icon="💻" />
              <SkillCard title="Frameworks" skills={portfolio.skills[0].framework} icon="🚀" />
              <SkillCard title="Tools" skills={portfolio.skills[0].tools} icon="🛠️" />
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {portfolio.projects?.length > 0 && (
        <section ref={sectionRefs.projects} id="projects" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.projects.map((project, index) => (
                <ProjectCard 
                  key={index} 
                  project={project} 
                  getFileUrl={getFileUrl}
                  onImageClick={openImageZoom}
                  onVideoClick={openVideoFullscreen}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {portfolio.experience?.length > 0 && (
        <section ref={sectionRefs.experience} id="experience" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Work Experience</h2>
            <div className="max-w-4xl mx-auto">
              {portfolio.experience.map((exp, index) => (
                <ExperienceCard key={index} experience={exp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certificates Section */}
      {portfolio.certificates?.length > 0 && (
        <section ref={sectionRefs.certificates} id="certificates" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Certificates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {portfolio.certificates.map((cert, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  {cert.certificate_image && (
                    <div 
                      className="relative h-40 overflow-hidden rounded-lg mb-4 cursor-pointer group"
                      onClick={() => openImageZoom(getFileUrl(cert.certificate_image), cert.certificate_name)}
                    >
                      <img
                        src={getFileUrl(cert.certificate_image)}
                        alt={cert.certificate_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.certificate_name}</h3>
                  {cert.certificate_link && (
                    <a 
                      href={cert.certificate_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-3 text-gray-700 hover:text-black text-sm font-medium"
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {portfolio.education?.length > 0 && (
        <section ref={sectionRefs.education} id="education" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Education</h2>
            <div className="max-w-3xl mx-auto">
              {portfolio.education.map((edu, index) => (
                <EducationCard key={index} education={edu} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      {portfolio.articles?.length > 0 && (
        <section ref={sectionRefs.articles} id="articles" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {portfolio.articles.map((article, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{article.article_title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  {article.to_article_link && (
                    <a 
                      href={article.to_article_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-700 hover:text-black font-medium inline-flex items-center"
                    >
                      Read Article →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {portfolio.contact && (
        <section ref={sectionRefs.contact} id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Get In Touch</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ContactItem icon="📧" label="Email" value={portfolio.contact.email} link={`mailto:${portfolio.contact.email}`} />
                  <ContactItem icon="🔗" label="LinkedIn" value={portfolio.contact.linkedin} link={portfolio.contact.linkedin} />
                  <ContactItem icon="🐙" label="GitHub" value={portfolio.contact.github} link={portfolio.contact.github} />
                  <ContactItem icon="📱" label="Phone" value={portfolio.contact.phone} link={`tel:${portfolio.contact.phone}`} />
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {portfolio.last && (
        <footer className="py-8 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center space-x-6 mb-4">
              {portfolio.last.logo_social_links?.split(',').map((link, index) => (
                <a key={index} href={link.trim()} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition text-2xl">
                  🔗
                </a>
              ))}
            </div>
            <p className="text-gray-400">{portfolio.last.copyright}</p>
          </div>
        </footer>
      )}

      {/* Hire Me Modal */}
      {showHireModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowHireModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowHireModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Hire Me</h3>
              <p className="text-gray-500 text-sm mt-1">Fill out the form below and I'll get back to you</p>
            </div>
            
            <form onSubmit={handleHireSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={hireFormData.name}
                  onChange={(e) => setHireFormData({ ...hireFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={hireFormData.email}
                  onChange={(e) => setHireFormData({ ...hireFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message / Project Details *</label>
                <textarea
                  required
                  rows="4"
                  value={hireFormData.message}
                  onChange={(e) => setHireFormData({ ...hireFormData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Tell me about your project, job opportunity, or collaboration..."
                />
              </div>
              
              {submitStatus === 'success' && (
                <div className="p-3 bg-green-50 border border-green-500 rounded-lg text-green-700 text-sm text-center">
                  ✅ Message sent successfully! I'll contact you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-500 rounded-lg text-red-700 text-sm text-center">
                  ❌ Failed to send. Please try again or email me directly.
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeImageZoom}>
          <div className="relative max-w-7xl max-h-screen p-4">
            <button 
              onClick={closeImageZoom}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={zoomedImage.url} 
              alt={zoomedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-center text-white mt-4">{zoomedImage.title}</p>
          </div>
        </div>
      )}

      {/* Video Fullscreen Modal */}
      {fullscreenVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeVideoFullscreen}>
          <div className="relative w-full max-w-6xl mx-4">
            <button 
              onClick={closeVideoFullscreen}
              className="absolute -top-12 right-0 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video 
              className="w-full max-h-[85vh] rounded-lg"
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            >
              <source src={fullscreenVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-center text-white mt-4">{fullscreenVideo.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Skill Card Component
const SkillCard = ({ title, skills, icon }) => {
  const skillsList = skills ? skills.split(',').map(s => s.trim()) : [];

  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skillsList.map((skill, index) => (
          <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, getFileUrl, onImageClick, onVideoClick }) => {
  const toolsList = project.tools_used ? project.tools_used.split(',').map(t => t.trim()) : [];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200">
      {project.screenshots && (
        <div 
          className="relative h-48 overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => onImageClick(getFileUrl(project.screenshots), project.project_title)}
        >
          <img
            src={getFileUrl(project.screenshots)}
            alt={project.project_title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      )}
      {project.video && (
        <div 
          className="relative cursor-pointer group"
          onClick={() => onVideoClick(getFileUrl(project.video), project.project_title)}
        >
          <video className="w-full h-48 object-cover" src={getFileUrl(project.video)} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{project.project_title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {toolsList.map((tool, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
              {tool}
            </span>
          ))}
        </div>
        <div className="flex space-x-4">
          {project.github_link && (
            <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition">
              GitHub
            </a>
          )}
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition">
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Experience Card Component
const ExperienceCard = ({ experience }) => {
  return (
    <div className="relative pl-8 pb-8 border-l-2 border-gray-400">
      <div className="absolute w-4 h-4 bg-gray-700 rounded-full -left-[9px] top-0"></div>
      <div className="bg-gray-50 rounded-lg p-6 ml-4 hover:shadow-md transition-all duration-300 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{experience.job}</h3>
        <p className="text-gray-700">{experience.what_have_you_done}</p>
      </div>
    </div>
  );
};

// Education Card Component
const EducationCard = ({ education }) => {
  return (
    <div className="bg-white rounded-xl p-8 mb-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{education.attended_university}</h3>
      <p className="text-gray-700 mb-2">{education.attended_college}</p>
      {education.pursuing_degree && <p className="text-gray-700 mb-2">🎓 {education.pursuing_degree}</p>}
      {education.relevant_courses && (
        <div className="mt-4">
          <p className="text-gray-700 font-semibold mb-2">Relevant Courses:</p>
          <p className="text-gray-600">{education.relevant_courses}</p>
        </div>
      )}
    </div>
  );
};

// Contact Item Component
const ContactItem = ({ icon, label, value, link }) => (
  <div className="flex items-center space-x-4 bg-white rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-gray-200">
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700 transition break-all">
          {value}
        </a>
      ) : (
        <p className="text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('http://localhost:8000/kirubel/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        rows="4"
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      
      {submitStatus === 'success' && (
        <div className="p-3 bg-green-50 border border-green-500 rounded-lg text-green-700 text-sm">
          ✅ Message sent successfully!
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-3 bg-red-50 border border-red-500 rounded-lg text-red-700 text-sm">
          ❌ Failed to send message. Please try again.
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default App1;