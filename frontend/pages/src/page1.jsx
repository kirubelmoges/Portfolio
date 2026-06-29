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
      className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 group h-full w-full ${isCenter ? 'border-blue-400 shadow-2xl' : 'hover:border-blue-400'} ${isBlurred ? 'blur-sm opacity-40 scale-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(screenshotUrl || videoUrl) && (
        <div 
          className="relative h-52 overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => {
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
              onError={(e) => {
                const fallback = item.screenshots;
                if (fallback) {
                  e.target.src = getMediaUrl(item, 'screenshots');
                }
              }}
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
          {videoUrl && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Video
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isCenter ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'} line-clamp-2 break-words`}>
          {item.project_title}
        </h3>
        
        <div className="overflow-hidden">
          <p className={`text-gray-600 mb-3 transition-all duration-300 ${
            isHovered ? 'line-clamp-none' : 'line-clamp-2'
          }`}>
            {item.description}
          </p>
        </div>
        
        <div className={`flex flex-wrap gap-2 transition-all duration-300 overflow-hidden ${
          isHovered ? 'max-h-40 opacity-100' : 'max-h-8 opacity-100'
        }`}>
          {toolsList.slice(0, isHovered ? toolsList.length : 3).map((tool, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-200/70 text-gray-700 rounded text-xs border border-gray-300/50 hover:border-blue-400 transition-all duration-300">
              {tool}
            </span>
          ))}
          {!isHovered && toolsList.length > 3 && (
            <span className="px-2 py-1 text-gray-500 rounded text-xs">
              +{toolsList.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex gap-4 mt-4">
          {item.github_link && (
            <a href={item.github_link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              GitHub
            </a>
          )}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Certificate Card Component
const CertificateCard = ({ cert, isCenter, isBlurred = false, onImageClick, getMediaUrl }) => {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 group h-full w-full ${isCenter ? 'border-blue-400 shadow-2xl' : 'hover:border-blue-400'} ${isBlurred ? 'blur-sm opacity-40 scale-75' : ''}`}
    >
      {cert.certificate_image && (
        <div 
          className="relative h-48 overflow-hidden rounded-lg m-4 cursor-pointer group"
          onClick={() => onImageClick(getMediaUrl(cert, 'certificate_image'), cert.certificate_name)}
        >
          <img
            src={getMediaUrl(cert, 'certificate_image')}
            alt={cert.certificate_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const fallback = cert.certificate_image;
              if (fallback) {
                e.target.src = getMediaUrl(cert, 'certificate_image');
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="p-6 pt-0">
        <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 ${isCenter ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'} line-clamp-2 break-words`}>
          {cert.certificate_name}
        </h3>
        {cert.certificate_link && (
          <a 
            href={cert.certificate_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block mt-3 text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            View Certificate →
          </a>
        )}
      </div>
    </div>
  );
};

const App1 = () => {
  const [portfolio, setPortfolio] = useState({
    introduction: null,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certificates: [],
    resume: [],
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
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [downloadingCV, setDownloadingCV] = useState(false);
  
  // Carousel states
  const [projectIndex, setProjectIndex] = useState(0);
  const [certIndex, setCertIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  
  // Refs
  const projectAutoRef = useRef(null);
  const certAutoRef = useRef(null);
  const projectSliderRef = useRef(null);
  const certificateSliderRef = useRef(null);
  const isMounted = useRef(true);

  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    certificates: useRef(null),
    resume: useRef(null),
    education: useRef(null),
    articles: useRef(null),
    contact: useRef(null)
  };

  useEffect(() => {
    fetchFullPortfolio();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Get items per view based on screen width
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Auto-slide for projects
  useEffect(() => {
    if (portfolio.projects?.length > 1 && !isPaused && !isDragging && isMounted.current) {
      projectAutoRef.current = setInterval(() => {
        setProjectIndex((prev) => (prev + 1) % portfolio.projects.length);
      }, 2500);
    }
    return () => clearInterval(projectAutoRef.current);
  }, [portfolio.projects, isPaused, isDragging]);

  // Auto-slide for certificates
  useEffect(() => {
    const filteredCerts = getFilteredCertificates();
    if (filteredCerts.length > 1 && !isPaused && !isDragging && isMounted.current) {
      certAutoRef.current = setInterval(() => {
        setCertIndex((prev) => (prev + 1) % filteredCerts.length);
      }, 2500);
    }
    return () => clearInterval(certAutoRef.current);
  }, [portfolio.certificates, isPaused, isDragging]);

  // Pause on interaction
  useEffect(() => {
    if (!isPaused) return;
    const timer = setTimeout(() => {
      if (isMounted.current) setIsPaused(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isPaused]);

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
      
      try {
        const resumeResponse = await fetch(`${API_BASE_URL}/resume/`);
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json();
          data.resume = resumeData;
        }
      } catch (e) {
        console.log('Resume endpoint not available, using certificate fallback');
        if (data.certificates) {
          data.resume = data.certificates.filter(cert => 
            cert.certificate_name?.toLowerCase().includes('resume') ||
            cert.certificate_name?.toLowerCase().includes('cv')
          );
        }
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
    
    const cloudinaryFields = {
      'image': 'image_url',
      'imagebackground': 'imagebackground_url',
      'screenshots': 'screenshots_url',
      'video': 'video_url',
      'certificate_image': 'certificate_image_url',
      'cv': 'cv_url',
      'resume_file': 'resume_file_url',
      'cv_file': 'cv_file_url'
    };
    
    const cloudinaryField = cloudinaryFields[fieldName];
    if (cloudinaryField && item[cloudinaryField]) {
      return item[cloudinaryField];
    }
    
    if (item[fieldName]) {
      return getFileUrl(item[fieldName]);
    }
    
    return null;
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

  const handleDownloadResume = async () => {
    let resumeFiles = [];
    
    if (portfolio.resume && portfolio.resume.length > 0) {
      resumeFiles = portfolio.resume.filter(item => item.resume_file || item.resume_file_url);
    }
    
    if (resumeFiles.length === 0) {
      alert('Resume files not available. Please upload a resume in the admin panel.');
      return;
    }

    setDownloadingResume(true);
    
    try {
      for (const item of resumeFiles) {
        const fileUrl = getMediaUrl(item, 'resume_file');
        if (fileUrl) {
          const fileExt = fileUrl.split('.').pop() || 'pdf';
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = `Resume_${item.resume_name || 'file'}.${fileExt}`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error downloading files:', error);
      alert('Error downloading files. Please try again.');
    } finally {
      setDownloadingResume(false);
    }
  };

  const handleDownloadCV = async () => {
    let cvFiles = [];
    
    if (portfolio.resume && portfolio.resume.length > 0) {
      cvFiles = portfolio.resume.filter(item => item.cv_file || item.cv_file_url);
    }
    
    if (cvFiles.length === 0) {
      alert('CV files not available. Please upload a CV in the admin panel.');
      return;
    }

    setDownloadingCV(true);
    
    try {
      for (const item of cvFiles) {
        const fileUrl = getMediaUrl(item, 'cv_file');
        if (fileUrl) {
          const fileExt = fileUrl.split('.').pop() || 'pdf';
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = `CV_${item.resume_name || 'file'}.${fileExt}`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error downloading files:', error);
      alert('Error downloading files. Please try again.');
    } finally {
      setDownloadingCV(false);
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
      const response = await fetch(`${API_BASE_URL}/send-hire-email/`, {
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

  // Carousel navigation
  const goToPrev = (type) => {
    setIsPaused(true);
    if (type === 'projects' && portfolio.projects?.length > 0) {
      const newIndex = projectIndex === 0 ? portfolio.projects.length - 1 : projectIndex - 1;
      setProjectIndex(newIndex);
    } else if (type === 'certificates') {
      const filtered = getFilteredCertificates();
      if (filtered.length > 0) {
        const newIndex = certIndex === 0 ? filtered.length - 1 : certIndex - 1;
        setCertIndex(newIndex);
      }
    }
  };

  const goToNext = (type) => {
    setIsPaused(true);
    if (type === 'projects' && portfolio.projects?.length > 0) {
      setProjectIndex((prev) => (prev + 1) % portfolio.projects.length);
    } else if (type === 'certificates') {
      const filtered = getFilteredCertificates();
      if (filtered.length > 0) {
        setCertIndex((prev) => (prev + 1) % filtered.length);
      }
    }
  };

  const goToSlide = (type, index) => {
    setIsPaused(true);
    if (type === 'projects') {
      setProjectIndex(index);
    } else if (type === 'certificates') {
      setCertIndex(index);
    }
  };

  const getFilteredCertificates = () => {
    return portfolio.certificates?.filter(cert => 
      !cert.certificate_name?.toLowerCase().includes('resume') && 
      !cert.certificate_name?.toLowerCase().includes('cv')
    ) || [];
  };

  // Get the three cards for mobile view (left blur, center, right blur)
  const getMobileCards = (items, currentIndex) => {
    if (!items || items.length === 0) return { left: null, center: null, right: null };
    
    const total = items.length;
    const leftIdx = (currentIndex - 1 + total) % total;
    const rightIdx = (currentIndex + 1) % total;
    
    return {
      left: items[leftIdx],
      center: items[currentIndex],
      right: items[rightIdx]
    };
  };

  // Get visible items for desktop (pyramid effect)
  const getDesktopItems = (items, currentIndex) => {
    if (!items || items.length === 0) return [];
    
    const total = items.length;
    const visible = [];
    const cardsPerSide = 2;
    const totalCardsToShow = 1 + (cardsPerSide * 2);
    
    for (let i = 0; i < totalCardsToShow; i++) {
      const offset = i - cardsPerSide;
      const idx = (currentIndex + offset + total) % total;
      const isCenter = offset === 0;
      const distance = Math.abs(offset);
      
      let scale, translateY, opacity, zIndex, blur;
      
      if (isCenter) {
        scale = 1;
        translateY = 0;
        opacity = 1;
        zIndex = 30;
        blur = 'blur(0px)';
      } else if (distance === 1) {
        scale = 0.85;
        translateY = 15;
        opacity = 0.6;
        zIndex = 20;
        blur = 'blur(1px)';
      } else if (distance === 2) {
        scale = 0.7;
        translateY = 30;
        opacity = 0.3;
        zIndex = 15;
        blur = 'blur(3px)';
      } else {
        scale = 0.55;
        translateY = 45;
        opacity = 0.12;
        zIndex = 10;
        blur = 'blur(5px)';
      }
      
      visible.push({
        ...items[idx],
        originalIndex: idx,
        position: offset,
        isCenter: isCenter,
        scale: scale,
        translateY: translateY,
        opacity: opacity,
        zIndex: zIndex,
        blur: blur,
        isVisible: true,
      });
    }
    
    return visible;
  };

  // Handle drag/swipe
  const handleDragStart = (e, type) => {
    setIsDragging(true);
    setIsPaused(true);
    const pageX = e.type === 'touchstart' ? e.touches[0].pageX : e.pageX;
    setStartX(pageX);
    const ref = type === 'projects' ? projectSliderRef.current : certificateSliderRef.current;
    if (ref) setScrollLeft(ref.scrollLeft);
  };

  const handleDragMove = (e, type) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
    const diff = (startX - pageX) * 0.8;
    const ref = type === 'projects' ? projectSliderRef.current : certificateSliderRef.current;
    if (ref) ref.scrollLeft = scrollLeft + diff;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
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

  const filteredCertificates = getFilteredCertificates();
  const isMobile = window.innerWidth < 640;
  
  // Get cards based on screen size
  const getProjectCards = () => {
    if (isMobile) {
      return getMobileCards(portfolio.projects, projectIndex);
    } else {
      return getDesktopItems(portfolio.projects, projectIndex);
    }
  };

  const getCertificateCards = () => {
    if (isMobile) {
      return getMobileCards(filteredCertificates, certIndex);
    } else {
      return getDesktopItems(filteredCertificates, certIndex);
    }
  };

  const projectCards = getProjectCards();
  const certificateCards = getCertificateCards();

  return (
    <div className="bg-white">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolling 
          ? 'bg-white/50 backdrop-blur-md shadow-md py-3 translate-y-0 opacity-100' 
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
              {['home', 'about', 'skills', 'projects', 'experience', 'certificates', 'resume', 'education', 'articles', 'contact'].map((item) => (
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
              scrolling ? 'bg-white/50 backdrop-blur-md shadow-lg' : 'bg-black/50 backdrop-blur-md'
            }`}>
              {['home', 'about', 'skills', 'projects', 'experience', 'certificates', 'resume', 'education', 'articles', 'contact'].map((item) => (
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

      {/* Hero Section */}
      <section ref={sectionRefs.home} id="home" className="relative">
        <div className="w-full h-[200px] md:h-[280px] lg:h-[320px] overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 cursor-pointer">
          {portfolio.introduction?.imagebackground && (
            <img
              src={getMediaUrl(portfolio.introduction, 'imagebackground')}
              alt="Banner"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onClick={() => openImageZoom(getMediaUrl(portfolio.introduction, 'imagebackground'), 'Banner Image')}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20">
            <div className="flex justify-center md:justify-start">
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white/50 backdrop-blur-sm shadow-xl overflow-hidden cursor-pointer group">
                {portfolio.introduction?.image && (
                  <img
                    src={getMediaUrl(portfolio.introduction, 'image')}
                    alt={portfolio.introduction.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={() => openImageZoom(getMediaUrl(portfolio.introduction, 'image'), portfolio.introduction.name)}
                  />
                )}
                {!portfolio.introduction?.image && (
                  <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-900 flex items-center justify-center text-white text-4xl">
                    {portfolio.introduction?.name?.charAt(0) || 'K'}
                  </div>
                )}
              </div>
            </div>
            
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
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <button 
                  onClick={() => setShowHireModal(true)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 shadow-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                >
                  Hire Me
                </button>
                <button 
                  onClick={handleDownloadResume}
                  disabled={downloadingResume}
                  className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingResume ? 'Downloading...' : 'Download Resume'}
                </button>
                <button 
                  onClick={handleDownloadCV}
                  disabled={downloadingCV}
                  className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingCV ? 'Downloading...' : 'Download CV'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {portfolio.introduction?.about_me && (
        <section ref={sectionRefs.about} id="about" className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">About Me</h2>
            <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200">
              <div className="relative group">
                <p className="text-gray-700 text-lg leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                  {portfolio.introduction.about_me}
                </p>
                {portfolio.introduction.about_me && portfolio.introduction.about_me.length > 200 && (
                  <span className="text-gray-400 text-sm block mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Hover to expand
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {portfolio.skills?.length > 0 && portfolio.skills[0] && (
        <section ref={sectionRefs.skills} id="skills" className="py-16 bg-white/50 backdrop-blur-sm">
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
        <section ref={sectionRefs.projects} id="projects" className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Featured Projects</h2>
            
            {/* Navigation Arrows - Separate row under title */}
            {portfolio.projects.length > 1 && (
              <div className="flex justify-center gap-3 mb-6">
                <button 
                  onClick={() => goToPrev('projects')}
                  aria-label="Previous slide"
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition border border-gray-200 z-10 w-10 h-10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => goToNext('projects')}
                  aria-label="Next slide"
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition border border-gray-200 z-10 w-10 h-10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Projects Carousel */}
            <div className="relative w-full overflow-visible">
              {isMobile ? (
                // MOBILE VIEW: 3 cards with no gap
                <div className="flex justify-center items-center relative" style={{ minHeight: '450px' }}>
                  {/* Left Blur Card - touches main card with no gap */}
                  {projectCards.left && (
                    <div className="absolute left-0 w-[10%] min-w-[50px] z-10 pointer-events-none">
                      <div className="transform scale-75 opacity-40 blur-sm origin-right">
                        <ProjectCard 
                          item={projectCards.left}
                          isCenter={false}
                          isBlurred={true}
                          onImageClick={openImageZoom}
                          onVideoClick={openVideoFullscreen}
                          getMediaUrl={getMediaUrl}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Center Main Card - 90% width */}
                  {projectCards.center && (
                    <div className="w-[90%] max-w-[400px] z-20 mx-0">
                      <ProjectCard 
                        item={projectCards.center}
                        isCenter={true}
                        isBlurred={false}
                        onImageClick={openImageZoom}
                        onVideoClick={openVideoFullscreen}
                        getMediaUrl={getMediaUrl}
                      />
                    </div>
                  )}
                  
                  {/* Right Blur Card - touches main card with no gap */}
                  {projectCards.right && (
                    <div className="absolute right-0 w-[10%] min-w-[50px] z-10 pointer-events-none">
                      <div className="transform scale-75 opacity-40 blur-sm origin-left">
                        <ProjectCard 
                          item={projectCards.right}
                          isCenter={false}
                          isBlurred={true}
                          onImageClick={openImageZoom}
                          onVideoClick={openVideoFullscreen}
                          getMediaUrl={getMediaUrl}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // DESKTOP VIEW: Pyramid effect with scrolling
                <div 
                  ref={projectSliderRef}
                  className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory justify-center items-start"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    minHeight: '500px',
                    padding: '0 20px'
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {Array.isArray(projectCards) && projectCards.map((project, idx) => (
                    <div 
                      key={`${project.originalIndex}-${idx}`} 
                      className="flex-shrink-0 snap-center transition-all duration-500"
                      style={{
                        width: project.isCenter ? '320px' : '260px',
                        transform: `scale(${project.scale}) translateY(${project.translateY}px)`,
                        opacity: project.opacity,
                        zIndex: project.zIndex,
                        filter: project.blur,
                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease, filter 0.5s ease',
                        pointerEvents: project.isCenter ? 'auto' : 'none',
                      }}
                    >
                      <ProjectCard 
                        item={project}
                        isCenter={project.isCenter}
                        isBlurred={false}
                        onImageClick={openImageZoom}
                        onVideoClick={openVideoFullscreen}
                        getMediaUrl={getMediaUrl}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Dots */}
            {portfolio.projects.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {portfolio.projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide('projects', idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === projectIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {portfolio.experience?.length > 0 && (
        <section ref={sectionRefs.experience} id="experience" className="py-16 bg-white/50 backdrop-blur-sm">
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
      {filteredCertificates.length > 0 && (
        <section ref={sectionRefs.certificates} id="certificates" className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Certificates</h2>
            
            {/* Navigation Arrows - Separate row under title */}
            {filteredCertificates.length > 1 && (
              <div className="flex justify-center gap-3 mb-6">
                <button 
                  onClick={() => goToPrev('certificates')}
                  aria-label="Previous slide"
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition border border-gray-200 z-10 w-10 h-10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => goToNext('certificates')}
                  aria-label="Next slide"
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition border border-gray-200 z-10 w-10 h-10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Certificates Carousel */}
            <div className="relative w-full overflow-visible">
              {isMobile ? (
                // MOBILE VIEW: 3 cards with no gap
                <div className="flex justify-center items-center relative" style={{ minHeight: '450px' }}>
                  {/* Left Blur Card - touches main card with no gap */}
                  {certificateCards.left && (
                    <div className="absolute left-0 w-[10%] min-w-[50px] z-10 pointer-events-none">
                      <div className="transform scale-75 opacity-40 blur-sm origin-right">
                        <CertificateCard 
                          cert={certificateCards.left}
                          isCenter={false}
                          isBlurred={true}
                          onImageClick={openImageZoom}
                          getMediaUrl={getMediaUrl}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Center Main Card - 90% width */}
                  {certificateCards.center && (
                    <div className="w-[90%] max-w-[400px] z-20 mx-0">
                      <CertificateCard 
                        cert={certificateCards.center}
                        isCenter={true}
                        isBlurred={false}
                        onImageClick={openImageZoom}
                        getMediaUrl={getMediaUrl}
                      />
                    </div>
                  )}
                  
                  {/* Right Blur Card - touches main card with no gap */}
                  {certificateCards.right && (
                    <div className="absolute right-0 w-[10%] min-w-[50px] z-10 pointer-events-none">
                      <div className="transform scale-75 opacity-40 blur-sm origin-left">
                        <CertificateCard 
                          cert={certificateCards.right}
                          isCenter={false}
                          isBlurred={true}
                          onImageClick={openImageZoom}
                          getMediaUrl={getMediaUrl}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // DESKTOP VIEW: Pyramid effect with scrolling
                <div 
                  ref={certificateSliderRef}
                  className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory justify-center items-start"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    minHeight: '480px',
                    padding: '0 20px'
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {Array.isArray(certificateCards) && certificateCards.map((cert, idx) => (
                    <div 
                      key={`${cert.originalIndex}-${idx}`} 
                      className="flex-shrink-0 snap-center transition-all duration-500"
                      style={{
                        width: cert.isCenter ? '320px' : '260px',
                        transform: `scale(${cert.scale}) translateY(${cert.translateY}px)`,
                        opacity: cert.opacity,
                        zIndex: cert.zIndex,
                        filter: cert.blur,
                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease, filter 0.5s ease',
                        pointerEvents: cert.isCenter ? 'auto' : 'none',
                      }}
                    >
                      <CertificateCard 
                        cert={cert}
                        isCenter={cert.isCenter}
                        isBlurred={false}
                        onImageClick={openImageZoom}
                        getMediaUrl={getMediaUrl}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Dots */}
            {filteredCertificates.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {filteredCertificates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide('certificates', idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === certIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Resume Section */}
      {portfolio.resume && portfolio.resume.length > 0 && (
        <section ref={sectionRefs.resume} id="resume" className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Resume & CV</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {portfolio.resume.map((item, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.resume_name}</h3>
                  <div className="space-y-3">
                    {(item.resume_file || item.resume_file_url) && (
                      <a 
                        href={getMediaUrl(item, 'resume_file')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download Resume</span>
                      </a>
                    )}
                    {(item.cv_file || item.cv_file_url) && (
                      <a 
                        href={getMediaUrl(item, 'cv_file')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download CV</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {portfolio.education?.length > 0 && (
        <section ref={sectionRefs.education} id="education" className="py-16 bg-white/50 backdrop-blur-sm">
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
        <section ref={sectionRefs.articles} id="articles" className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {portfolio.articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {portfolio.contact && (
        <section ref={sectionRefs.contact} id="contact" className="py-16 bg-white/50 backdrop-blur-sm">
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
          <div className="bg-white/50 backdrop-blur-md rounded-2xl max-w-md w-full p-8 relative animate-fadeInUp border border-white/30" onClick={(e) => e.stopPropagation()}>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skillsList.map((skill, index) => (
          <span key={index} className="px-3 py-1 bg-gray-200/70 text-gray-800 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-all duration-300">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

// Experience Card Component
const ExperienceCard = ({ experience }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 pb-8 border-l-2 border-gray-400">
      <div className="absolute w-4 h-4 bg-gray-700 rounded-full -left-[9px] top-0"></div>
      <div 
        className="bg-white/50 backdrop-blur-sm rounded-lg p-6 ml-4 hover:shadow-xl transition-all duration-300 border border-gray-200"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-2">{experience.job}</h3>
        <p className={`text-gray-700 transition-all duration-300 ${
          isExpanded ? 'line-clamp-none' : 'line-clamp-3'
        }`}>
          {experience.what_have_you_done}
        </p>
        {experience.what_have_you_done && experience.what_have_you_done.length > 100 && (
          <span className={`text-gray-400 text-sm block mt-1 transition-opacity duration-300 ${
            isExpanded ? 'opacity-0' : 'opacity-100'
          }`}>
            hover to expand
          </span>
        )}
      </div>
    </div>
  );
};

// Education Card Component
const EducationCard = ({ education }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white/50 backdrop-blur-sm rounded-xl p-8 mb-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{education.attended_university}</h3>
      <p className="text-gray-700 mb-2">{education.attended_college}</p>
      {education.pursuing_degree && <p className="text-gray-700 mb-2">🎓 {education.pursuing_degree}</p>}
      {education.relevant_courses && (
        <div className="mt-4">
          <p className="text-gray-700 font-semibold mb-2">Relevant Courses:</p>
          <p className={`text-gray-600 transition-all duration-300 ${
            isExpanded ? 'line-clamp-none' : 'line-clamp-2'
          }`}>
            {education.relevant_courses}
          </p>
          {education.relevant_courses.length > 100 && (
            <span className={`text-gray-400 text-sm block mt-1 transition-opacity duration-300 ${
              isExpanded ? 'opacity-0' : 'opacity-100'
            }`}>
              hover to expand
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Article Card Component
const ArticleCard = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">{article.article_title}</h3>
      <p className={`text-gray-600 mb-4 transition-all duration-300 ${
        isExpanded ? 'line-clamp-none' : 'line-clamp-3'
      }`}>
        {article.description}
      </p>
      {article.description && article.description.length > 100 && (
        <span className={`text-gray-400 text-sm block -mt-2 mb-2 transition-opacity duration-300 ${
          isExpanded ? 'opacity-0' : 'opacity-100'
        }`}>
          hover to expand
        </span>
      )}
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
  );
};

// Contact Item Component
const ContactItem = ({ icon, label, value, link }) => (
  <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-gray-200">
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
      const response = await fetch(`${API_BASE_URL}/contact/`, {
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
        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        rows="4"
        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
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