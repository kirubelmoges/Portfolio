import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE_URL = 'https://portfolio-backend-ee1z.onrender.com/kirubel/api';
const MEDIA_URL = 'https://portfolio-backend-ee1z.onrender.com';

// Project Card Component
const ProjectCard = ({ item, isCenter, isBlurred = false, onImageClick, onVideoClick, getMediaUrl }) => {
  const toolsList = item.tools_used ? item.tools_used.split(',').map(t => t.trim()) : [];
  const screenshotUrl = getMediaUrl(item, 'screenshots');
  const videoUrl = getMediaUrl(item, 'video');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl transition-all duration-500 border border-gray-200 group h-full w-full ${isCenter ? 'border-blue-400 shadow-2xl scale-100' : 'hover:border-blue-400'} ${isBlurred ? 'blur-sm opacity-40' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(screenshotUrl || videoUrl) && (
        <div 
          className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => {
            if (!isCenter) return;
            if (videoUrl && !screenshotUrl) {
              onVideoClick(videoUrl, item.project_title);
            } else if (screenshotUrl) {
              onImageClick(screenshotUrl, item.project_title);
            }
          }}
        >
          {screenshotUrl && (
            <img
              src={screenshotUrl}
              alt={item.project_title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          {!screenshotUrl && videoUrl && (
            <video className="w-full h-full object-cover" src={videoUrl} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-500">
              {videoUrl && !screenshotUrl ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-4 sm:p-6">
        <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isCenter ? 'text-blue-600' : 'text-gray-900'} line-clamp-1`}>
          {item.project_title}
        </h3>
        <p className={`text-gray-600 text-sm mb-3 transition-all duration-300 ${isHovered ? 'line-clamp-none' : 'line-clamp-2'}`}>
          {item.description}
        </p>
        <div className={`flex flex-wrap gap-1 transition-all duration-300 ${isHovered ? 'max-h-40' : 'max-h-8 overflow-hidden'}`}>
          {toolsList.map((tool, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] border border-gray-200">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Certificate Card Component
const CertificateCard = ({ cert, isCenter, isBlurred = false, onImageClick, getMediaUrl }) => {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl transition-all duration-500 border border-gray-200 h-full w-full ${isCenter ? 'border-blue-400 shadow-2xl scale-100' : ''} ${isBlurred ? 'blur-sm opacity-40' : ''}`}
    >
      {cert.certificate_image && (
        <div 
          className="relative h-40 sm:h-48 overflow-hidden m-3 rounded-lg cursor-pointer group"
          onClick={() => isCenter && onImageClick(getMediaUrl(cert, 'certificate_image'), cert.certificate_name)}
        >
          <img
            src={getMediaUrl(cert, 'certificate_image')}
            alt={cert.certificate_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      <div className="p-4 pt-0 text-center">
        <h3 className={`text-sm font-bold mb-1 line-clamp-2 ${isCenter ? 'text-blue-600' : 'text-gray-900'}`}>
          {cert.certificate_name}
        </h3>
      </div>
    </div>
  );
};

const App1 = () => {
  const [portfolio, setPortfolio] = useState({
    introduction: null, skills: [], projects: [], experience: [], education: [], certificates: [], resume: [], articles: [], contact: null, last: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireFormData, setHireFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [downloadingCV, setDownloadingCV] = useState(false);
  
  // Carousel states
  const [projectIndex, setProjectIndex] = useState(0);
  const [certIndex, setCertIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const projectSliderRef = useRef(null);
  const certificateSliderRef = useRef(null);
  const isMounted = useRef(true);

  const sectionRefs = {
    home: useRef(null), about: useRef(null), skills: useRef(null), projects: useRef(null), experience: useRef(null), certificates: useRef(null), resume: useRef(null), education: useRef(null), articles: useRef(null), contact: useRef(null)
  };

  useEffect(() => {
    fetchFullPortfolio();
    return () => { isMounted.current = false; };
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (portfolio.projects?.length > 1 && !isPaused) {
      const timer = setInterval(() => {
        setProjectIndex((prev) => (prev + 1) % portfolio.projects.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [portfolio.projects, isPaused]);

  useEffect(() => {
    const filteredCerts = getFilteredCertificates();
    if (filteredCerts.length > 1 && !isPaused) {
      const timer = setInterval(() => {
        setCertIndex((prev) => (prev + 1) % filteredCerts.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [portfolio.certificates, isPaused]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
      const scrollPosition = window.scrollY + 150;
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

  const fetchFullPortfolio = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/full/`);
      const data = await response.json();
      
      const resumeResponse = await fetch(`${API_BASE_URL}/resume/`).catch(() => null);
      if (resumeResponse?.ok) {
        data.resume = await resumeResponse.json();
      }

      if (isMounted.current) {
        setPortfolio(data);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const getMediaUrl = (item, fieldName) => {
    if (!item) return null;
    const cloudinaryFields = { 'image': 'image_url', 'imagebackground': 'imagebackground_url', 'screenshots': 'screenshots_url', 'video': 'video_url', 'certificate_image': 'certificate_image_url', 'cv': 'cv_url', 'resume_file': 'resume_file_url', 'cv_file': 'cv_file_url' };
    const cloudinaryField = cloudinaryFields[fieldName];
    if (cloudinaryField && item[cloudinaryField]) return item[cloudinaryField];
    if (item[fieldName]) {
      const filePath = item[fieldName];
      if (filePath.startsWith('http')) return filePath;
      return `${MEDIA_URL}${filePath.startsWith('/') ? '' : '/'}${filePath.startsWith('media/') ? '' : 'media/'}${filePath}`;
    }
    return null;
  };

  const handleDownloadResume = async () => {
    const files = portfolio.resume?.filter(item => item.resume_file || item.resume_file_url) || [];
    if (files.length === 0) return alert('No resume available');
    setDownloadingResume(true);
    files.forEach(item => {
      const link = document.createElement('a');
      link.href = getMediaUrl(item, 'resume_file');
      link.download = `Resume_${item.resume_name}.pdf`;
      link.target = "_blank";
      link.click();
    });
    setDownloadingResume(false);
  };

  const handleDownloadCV = async () => {
    const files = portfolio.resume?.filter(item => item.cv_file || item.cv_file_url) || [];
    if (files.length === 0) return alert('No CV available');
    setDownloadingCV(true);
    files.forEach(item => {
      const link = document.createElement('a');
      link.href = getMediaUrl(item, 'cv_file');
      link.download = `CV_${item.resume_name}.pdf`;
      link.target = "_blank";
      link.click();
    });
    setDownloadingCV(false);
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openImageZoom = (imageUrl, title) => { setZoomedImage({ url: imageUrl, title }); document.body.style.overflow = 'hidden'; };
  const closeImageZoom = () => { setZoomedImage(null); document.body.style.overflow = 'auto'; };
  const openVideoFullscreen = (videoUrl, title) => { setFullscreenVideo({ url: videoUrl, title }); document.body.style.overflow = 'hidden'; };
  const closeVideoFullscreen = () => { setFullscreenVideo(null); document.body.style.overflow = 'auto'; };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/send-hire-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...hireFormData, subject: 'New Hire Request' })
      });
      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(() => setShowHireModal(false), 2000);
      } else { setSubmitStatus('error'); }
    } catch { setSubmitStatus('error'); }
    setIsSubmitting(false);
  };

  const goToPrev = (type) => {
    setIsPaused(true);
    if (type === 'projects') setProjectIndex(prev => (prev === 0 ? portfolio.projects.length - 1 : prev - 1));
    else setCertIndex(prev => (prev === 0 ? getFilteredCertificates().length - 1 : prev - 1));
  };

  const goToNext = (type) => {
    setIsPaused(true);
    if (type === 'projects') setProjectIndex(prev => (prev + 1) % portfolio.projects.length);
    else setCertIndex(prev => (prev + 1) % getFilteredCertificates().length);
  };

  const getFilteredCertificates = () => portfolio.certificates?.filter(c => !c.certificate_name?.toLowerCase().includes('resume') && !c.certificate_name?.toLowerCase().includes('cv')) || [];

  const getMobileCards = (items, currentIndex) => {
    if (!items || items.length === 0) return { left: null, center: null, right: null };
    const total = items.length;
    return {
      left: items[(currentIndex - 1 + total) % total],
      center: items[currentIndex],
      right: items[(currentIndex + 1) % total]
    };
  };

  const getDesktopItems = (items, currentIndex) => {
    if (!items || items.length === 0) return [];
    const visible = [];
    for (let i = 0; i < 5; i++) {
      const offset = i - 2;
      const idx = (currentIndex + offset + items.length) % items.length;
      const isCenter = offset === 0;
      const dist = Math.abs(offset);
      visible.push({
        ...items[idx],
        isCenter,
        scale: isCenter ? 1 : dist === 1 ? 0.85 : 0.7,
        translateY: dist * 20,
        opacity: isCenter ? 1 : dist === 1 ? 0.6 : 0.3,
        zIndex: 30 - dist * 5,
        blur: dist === 0 ? 'none' : `blur(${dist * 2}px)`,
        originalIndex: idx
      });
    }
    return visible;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-900"></div></div>;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const projectCards = isMobile ? getMobileCards(portfolio.projects, projectIndex) : getDesktopItems(portfolio.projects, projectIndex);
  const filteredCerts = getFilteredCertificates();
  const certCards = isMobile ? getMobileCards(filteredCerts, certIndex) : getDesktopItems(filteredCerts, certIndex);

  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolling ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className={`text-xl font-bold ${scrolling ? 'text-gray-900' : 'text-white drop-shadow-md'}`}>{portfolio.introduction?.name}</div>
          <div className="hidden lg:flex space-x-6">
            {['about', 'projects', 'certificates', 'contact'].map(s => (
              <button key={s} onClick={() => scrollToSection(s)} className={`capitalize ${scrolling ? 'text-gray-600 hover:text-black' : 'text-white/90 hover:text-white'}`}>{s}</button>
            ))}
          </div>
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className={`w-6 h-6 ${scrolling ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl p-4 flex flex-col space-y-3 lg:hidden">
            {['about', 'projects', 'certificates', 'contact'].map(s => (
              <button key={s} onClick={() => scrollToSection(s)} className="text-left py-2 border-b border-gray-100 capitalize">{s}</button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section ref={sectionRefs.home} className="relative">
        <div className="h-[250px] md:h-[350px] bg-gray-900 overflow-hidden">
          {portfolio.introduction?.imagebackground && (
            <img src={getMediaUrl(portfolio.introduction, 'imagebackground')} className="w-full h-full object-cover opacity-60" alt="bg" />
          )}
        </div>
        <div className="container mx-auto px-6">
          <div className="relative -mt-20 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden shadow-2xl bg-gray-200">
              <img src={getMediaUrl(portfolio.introduction, 'image')} className="w-full h-full object-cover" alt="profile" />
            </div>
            <div className="text-center md:text-left mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{portfolio.introduction?.name}</h1>
              <p className="text-gray-600 text-lg">{portfolio.introduction?.career}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <button onClick={() => setShowHireModal(true)} className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-black transition">Hire Me</button>
                <button onClick={handleDownloadResume} className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50">Resume</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={sectionRefs.projects} id="projects" className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Projects</h2>
          
          {/* Navigation Arrows - Increased Z-Index */}
          <div className="relative z-[50] flex justify-center gap-4 mb-8">
            <button onClick={() => goToPrev('projects')} className="p-3 bg-white shadow-md rounded-full hover:bg-gray-100 border border-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => goToNext('projects')} className="p-3 bg-white shadow-md rounded-full hover:bg-gray-100 border border-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="relative flex justify-center items-center">
            {isMobile ? (
              /* MOBILE: Pinned-edge zero spacing layout */
              <div className="relative w-[80%] max-w-[320px] h-[420px]">
                {/* Left Card */}
                {projectCards.left && (
                  <div className="absolute top-0 right-full w-full h-full pr-0 pointer-events-none transform scale-90 origin-right opacity-40 blur-[2px]">
                    <ProjectCard item={projectCards.left} isCenter={false} isBlurred={true} getMediaUrl={getMediaUrl} />
                  </div>
                )}
                {/* Center Card */}
                <div className="relative z-20 w-full h-full">
                  <ProjectCard item={projectCards.center} isCenter={true} onImageClick={openImageZoom} onVideoClick={openVideoFullscreen} getMediaUrl={getMediaUrl} />
                </div>
                {/* Right Card */}
                {projectCards.right && (
                  <div className="absolute top-0 left-full w-full h-full pl-0 pointer-events-none transform scale-90 origin-left opacity-40 blur-[2px]">
                    <ProjectCard item={projectCards.right} isCenter={false} isBlurred={true} getMediaUrl={getMediaUrl} />
                  </div>
                )}
              </div>
            ) : (
              /* DESKTOP: Pyramid stack */
              <div className="flex items-center justify-center h-[500px] w-full max-w-6xl">
                {projectCards.map((p, i) => (
                  <div 
                    key={i}
                    className="transition-all duration-500 absolute"
                    style={{
                      width: '320px',
                      transform: `translateX(${(i - 2) * 280}px) scale(${p.scale})`,
                      zIndex: p.zIndex,
                      opacity: p.opacity,
                      filter: p.blur
                    }}
                  >
                    <ProjectCard item={p} isCenter={p.isCenter} onImageClick={openImageZoom} onVideoClick={openVideoFullscreen} getMediaUrl={getMediaUrl} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section ref={sectionRefs.certificates} id="certificates" className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Certificates</h2>
          
          <div className="relative z-[50] flex justify-center gap-4 mb-8">
            <button onClick={() => goToPrev('certificates')} className="p-3 bg-white shadow-md rounded-full hover:bg-gray-100 border border-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => goToNext('certificates')} className="p-3 bg-white shadow-md rounded-full hover:bg-gray-100 border border-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="relative flex justify-center items-center">
            {isMobile ? (
              <div className="relative w-[75%] max-w-[280px] h-[320px]">
                {certCards.left && (
                  <div className="absolute top-0 right-full w-full h-full transform scale-90 origin-right opacity-30 blur-[2px]">
                    <CertificateCard cert={certCards.left} isCenter={false} isBlurred={true} getMediaUrl={getMediaUrl} />
                  </div>
                )}
                <div className="relative z-20 w-full h-full">
                  <CertificateCard cert={certCards.center} isCenter={true} onImageClick={openImageZoom} getMediaUrl={getMediaUrl} />
                </div>
                {certCards.right && (
                  <div className="absolute top-0 left-full w-full h-full transform scale-90 origin-left opacity-30 blur-[2px]">
                    <CertificateCard cert={certCards.right} isCenter={false} isBlurred={true} getMediaUrl={getMediaUrl} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] w-full max-w-5xl">
                {certCards.map((c, i) => (
                  <div 
                    key={i}
                    className="transition-all duration-500 absolute"
                    style={{
                      width: '260px',
                      transform: `translateX(${(i - 2) * 220}px) scale(${c.scale})`,
                      zIndex: c.zIndex,
                      opacity: c.opacity,
                      filter: c.blur
                    }}
                  >
                    <CertificateCard cert={c} isCenter={c.isCenter} onImageClick={openImageZoom} getMediaUrl={getMediaUrl} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience, Education, Contact... (Omitted for brevity but kept similar to original) */}
      <section ref={sectionRefs.contact} id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{portfolio.contact?.email}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">LinkedIn</p>
                        <a href={portfolio.contact?.linkedin} className="text-blue-600 break-all">{portfolio.contact?.linkedin}</a>
                    </div>
                </div>
                <form onSubmit={handleHireSubmit} className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full p-3 border rounded-lg" required onChange={e => setHireFormData({...hireFormData, name: e.target.value})} />
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" required onChange={e => setHireFormData({...hireFormData, email: e.target.value})} />
                    <textarea placeholder="Message" rows="4" className="w-full p-3 border rounded-lg" required onChange={e => setHireFormData({...hireFormData, message: e.target.value})}></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition disabled:opacity-50">
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
      </section>

      {/* Modals */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={closeImageZoom}>
            <img src={zoomedImage.url} className="max-w-full max-h-full object-contain" alt="zoom" />
        </div>
      )}

      {fullscreenVideo && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center" onClick={closeVideoFullscreen}>
            <video src={fullscreenVideo.url} controls autoPlay className="max-w-full max-h-full" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {showHireModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowHireModal(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">Hire Me</h3>
                <form onSubmit={handleHireSubmit} className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full p-3 border rounded-lg" required />
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" required />
                    <textarea placeholder="Tell me about your project" rows="4" className="w-full p-3 border rounded-lg" required></textarea>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg">Send Request</button>
                </form>
            </div>
        </div>
      )}

      <footer className="py-10 bg-gray-900 text-white text-center">
          <p>© {new Date().getFullYear()} {portfolio.introduction?.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App1;