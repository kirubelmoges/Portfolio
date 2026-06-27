import React, { useState, useEffect } from 'react';
import { 
  Users, Code, FolderGit2, Briefcase, GraduationCap, 
  Award, Newspaper, Mail, Copyright, Plus, 
  Edit, Trash2, X, LogOut, Upload, File, Image as ImageIcon,
  FileText, FileArchive, Download, Link as LinkIcon, ExternalLink,
  FileCheck
} from 'lucide-react';

const API_BASE_URL = 'https://portfolio-backend-ee1z.onrender.com/kirubel/api';
const MEDIA_URL = 'https://portfolio-backend-ee1z.onrender.com';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('introduction');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [filePreviews, setFilePreviews] = useState({});

  const tabs = [
    { id: 'introduction', label: 'Introduction', icon: Users, color: 'purple' },
    { id: 'skills', label: 'Skills', icon: Code, color: 'blue' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, color: 'green' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'orange' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'red' },
    { id: 'certificates', label: 'Certificates', icon: Award, color: 'yellow' },
    { id: 'resume', label: 'Resume / CV', icon: FileCheck, color: 'teal' },
    { id: 'articles', label: 'Articles', icon: Newspaper, color: 'pink' },
    { id: 'contact', label: 'Contact', icon: Mail, color: 'indigo' },
    { id: 'last', label: 'Footer', icon: Copyright, color: 'gray' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${activeTab}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      setData(Array.isArray(result) ? result : [result]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getFileType = (filename) => {
    if (!filename) return 'unknown';
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
    return 'file';
  };

  const getFileIcon = (filename) => {
    const type = getFileType(filename);
    switch(type) {
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'word': return <FileArchive className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const handleFileChange = (fieldName, file) => {
    if (!file) return;
    
    setSelectedFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => ({
          ...prev,
          [fieldName]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, show file name
      setFilePreviews(prev => ({
        ...prev,
        [fieldName]: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem 
      ? `${API_BASE_URL}/${activeTab}/${editingItem.id}/`
      : `${API_BASE_URL}/${activeTab}/`;

    try {
      const token = localStorage.getItem('adminToken');
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'id' && formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add files
      Object.keys(selectedFiles).forEach(fieldName => {
        if (selectedFiles[fieldName]) {
          formDataToSend.append(fieldName, selectedFiles[fieldName]);
        }
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        fetchData();
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
        setSelectedFiles({});
        setFilePreviews({});
      } else {
        const error = await response.json();
        console.error('Validation errors:', error);
        alert('Please check your form data.\n' + JSON.stringify(error, null, 2));
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/${activeTab}/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Token ${token}` }
        });
        
        if (response.ok) {
          fetchData();
        } else {
          alert('Error deleting item');
        }
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting item');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Portfolio Admin
          </h1>
        </div>
        <nav className="mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 border-r-4 border-purple-500 text-purple-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="capitalize">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800 bg-gray-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-gray-400 mt-1">Manage your {activeTab} content</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({});
              setSelectedFiles({});
              setFilePreviews({});
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>

        {/* Content Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/50 rounded-xl">
            <p className="text-gray-400 text-lg">No {activeTab} found. Click "Add New" to create one.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {data.map((item, index) => (
              <DataCard
                key={item.id || index}
                item={item}
                type={activeTab}
                onEdit={() => {
                  setEditingItem(item);
                  setFormData(item);
                  setSelectedFiles({});
                  setFilePreviews({});
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDelete(item.id)}
                getFileIcon={getFileIcon}
                getFileType={getFileType}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          type={activeTab}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
            setSelectedFiles({});
            setFilePreviews({});
          }}
          isEditing={!!editingItem}
          handleFileChange={handleFileChange}
          uploading={uploading}
          selectedFiles={selectedFiles}
          filePreviews={filePreviews}
          getFileIcon={getFileIcon}
          getFileType={getFileType}
        />
      )}
    </div>
  );
};

// Data Card Component
const DataCard = ({ item, type, onEdit, onDelete, getFileIcon, getFileType }) => {
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    return `${MEDIA_URL}${filePath}`;
  };

  const renderFilePreview = (filePath, fieldName) => {
    if (!filePath) return null;
    const fileType = getFileType(filePath);
    const fileUrl = getFileUrl(filePath);
    
    if (fileType === 'image') {
      return (
        <img 
          src={fileUrl} 
          alt={fieldName}
          className="w-16 h-16 object-cover rounded-lg"
        />
      );
    } else if (fileType === 'pdf') {
      return (
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300"
        >
          <FileText className="w-5 h-5" />
          <span>View PDF</span>
          <Download className="w-3 h-3" />
        </a>
      );
    } else {
      return (
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
        >
          {getFileIcon(filePath)}
          <span>View {fieldName}</span>
          <Download className="w-3 h-3" />
        </a>
      );
    }
  };

  const getPreview = () => {
    switch (type) {
      case 'introduction':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              {item.image && renderFilePreview(item.image, 'Profile')}
              <div>
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.career}</p>
              </div>
            </div>
            {item.imagebackground && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">Banner Image:</p>
                {renderFilePreview(item.imagebackground, 'Banner')}
              </div>
            )}
            {item.role && (
              <p className="text-sm text-gray-400 mt-1">{item.role}</p>
            )}
            {item.about_me && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.about_me}</p>
            )}
          </div>
        );
      case 'projects':
        return (
          <div>
            <h3 className="font-semibold text-white">{item.project_title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
            {item.screenshots && (
              <div className="mt-2">
                {renderFilePreview(item.screenshots, 'Screenshot')}
              </div>
            )}
            {item.video && (
              <div className="mt-2">
                {renderFilePreview(item.video, 'Video')}
              </div>
            )}
            <div className="flex gap-2 mt-2 flex-wrap">
              {item.tools_used?.split(',').map((tool, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-purple-600/20 rounded-full text-purple-300">
                  {tool.trim()}
                </span>
              ))}
            </div>
            <div className="flex gap-3 mt-2">
              {item.github_link && (
                <a href={item.github_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
                  GitHub
                </a>
              )}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:text-green-300">
                  Live Demo
                </a>
              )}
            </div>
          </div>
        );
      case 'certificates':
        return (
          <div>
            <h3 className="font-semibold text-white">{item.certificate_name}</h3>
            {item.certificate_image && (
              <div className="mt-2">
                {renderFilePreview(item.certificate_image, 'Certificate Image')}
              </div>
            )}
            {item.certificate_link && (
              <a 
                href={item.certificate_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 mt-1"
              >
                <LinkIcon className="w-3 h-3" />
                <span>View Certificate</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        );
      case 'resume':
        return (
          <div>
            <h3 className="font-semibold text-white">{item.resume_name || 'Resume / CV'}</h3>
            {item.resume_file && (
              <div className="mt-2">
                {renderFilePreview(item.resume_file, 'Resume')}
              </div>
            )}
            {item.cv_file && (
              <div className="mt-2">
                {renderFilePreview(item.cv_file, 'CV')}
              </div>
            )}
          </div>
        );
      case 'skills':
        return (
          <div>
            {item.language && (
              <div className="mb-2">
                <p className="text-xs text-gray-400">Languages:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.language.split(',').map((lang, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-600/20 rounded-full text-blue-300">
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.framework && (
              <div className="mb-2">
                <p className="text-xs text-gray-400">Frameworks:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.framework.split(',').map((fw, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-green-600/20 rounded-full text-green-300">
                      {fw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.tools && (
              <div className="mb-2">
                <p className="text-xs text-gray-400">Tools:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tools.split(',').map((tool, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-orange-600/20 rounded-full text-orange-300">
                      {tool.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div>
            {Object.entries(item).map(([key, value]) => {
              // Skip file fields and IDs as they're handled separately
              const skipFields = ['id', 'image', 'imagebackground', 'screenshots', 'video', 'certificate_image', 'cv', 'resume_file', 'cv_file'];
              if (skipFields.includes(key)) return null;
              if (typeof value === 'string' && value.startsWith('http')) {
                return (
                  <div key={key} className="mb-2">
                    <p className="text-sm text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm break-all">
                      {value}
                    </a>
                  </div>
                );
              }
              return (
                <div key={key} className="mb-2">
                  <p className="text-sm text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-white text-sm">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">{getPreview()}</div>
        <div className="flex space-x-2 ml-4">
          <button 
            onClick={onEdit} 
            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component with all fields
const Modal = ({ type, formData, setFormData, onSubmit, onClose, isEditing, handleFileChange, uploading, selectedFiles, filePreviews, getFileIcon, getFileType }) => {
  
  const renderFileInput = (fieldName, label, accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/*", description = "") => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <label className="flex-1 cursor-pointer min-w-[150px]">
            <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition">
              <Upload className="w-5 h-5" />
              <span className="text-sm">Choose File</span>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(fieldName, e.target.files[0])}
              className="hidden"
            />
          </label>
          {selectedFiles[fieldName] && (
            <div className="text-sm text-green-400">
              {selectedFiles[fieldName].name}
            </div>
          )}
          {filePreviews?.[fieldName] && typeof filePreviews[fieldName] === 'string' && filePreviews[fieldName].startsWith('data:image') && (
            <img src={filePreviews[fieldName]} alt="Preview" className="w-12 h-12 object-cover rounded" />
          )}
        </div>
        {formData[fieldName] && !selectedFiles[fieldName] && (
          <p className="text-xs text-gray-400 mt-1">Current: {formData[fieldName].split('/').pop()}</p>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    );
  };

  const renderFormFields = () => {
    const fields = {
      introduction: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter your name' },
        { name: 'career', label: 'Career Title', type: 'text', required: true, placeholder: 'e.g., Software Developer' },
        { name: 'role', label: 'Role Description', type: 'textarea', required: false, placeholder: 'Describe your role in detail' },
        { name: 'about_me', label: 'About Me', type: 'textarea', required: false, placeholder: 'Tell your story - who you are, what you do' },
      ],
      projects: [
        { name: 'project_title', label: 'Project Title', type: 'text', required: true, placeholder: 'Project name' },
        { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe your project' },
        { name: 'tools_used', label: 'Tools Used', type: 'text', required: true, placeholder: 'React, Django, PostgreSQL (comma separated)' },
        { name: 'github_link', label: 'GitHub Link', type: 'url', required: false, placeholder: 'https://github.com/...' },
        { name: 'url', label: 'Live URL', type: 'url', required: false, placeholder: 'https://example.com' },
      ],
      skills: [
        { name: 'language', label: 'Languages', type: 'text', required: true, placeholder: 'Python, JavaScript, Java (comma separated)' },
        { name: 'framework', label: 'Frameworks', type: 'text', required: true, placeholder: 'React, Django, Spring (comma separated)' },
        { name: 'tools', label: 'Tools', type: 'text', required: true, placeholder: 'Git, Docker, AWS (comma separated)' },
      ],
      experience: [
        { name: 'job', label: 'Job Title', type: 'text', required: true, placeholder: 'Senior Developer at Company' },
        { name: 'what_have_you_done', label: 'Responsibilities & Achievements', type: 'textarea', required: true, placeholder: 'Describe your responsibilities and achievements' },
      ],
      education: [
        { name: 'attended_university', label: 'University', type: 'text', required: true, placeholder: 'University name' },
        { name: 'attended_college', label: 'College', type: 'text', required: true, placeholder: 'College name' },
        { name: 'pursuing_degree', label: 'Degree', type: 'text', required: false, placeholder: 'BSc in Computer Science' },
        { name: 'relevant_courses', label: 'Relevant Courses', type: 'textarea', required: false, placeholder: 'List relevant courses (comma separated)' },
      ],
      certificates: [
        { name: 'certificate_name', label: 'Certificate Name', type: 'text', required: true, placeholder: 'Certificate title' },
        { name: 'certificate_link', label: 'Certificate Link (URL)', type: 'url', required: false, placeholder: 'https://example.com/certificate' },
      ],
      resume: [
        { name: 'resume_name', label: 'Resume Name', type: 'text', required: true, placeholder: 'e.g., My Resume 2024' },
      ],
      articles: [
        { name: 'article_title', label: 'Article Title', type: 'text', required: true, placeholder: 'Title of article' },
        { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Brief description of the article' },
        { name: 'to_article_link', label: 'Article Link', type: 'url', required: true, placeholder: 'https://medium.com/...' },
      ],
      contact: [
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
        { name: 'linkedin', label: 'LinkedIn URL', type: 'url', required: true, placeholder: 'https://linkedin.com/in/...' },
        { name: 'github', label: 'GitHub URL', type: 'url', required: true, placeholder: 'https://github.com/...' },
        { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1234567890' },
      ],
      last: [
        { name: 'copyright', label: 'Copyright Text', type: 'text', required: true, placeholder: '© 2024 Your Name' },
        { name: 'logo_social_links', label: 'Social Links (comma separated)', type: 'text', required: true, placeholder: 'https://twitter.com/..., https://fb.com/...' },
      ],
    };

    const fileFields = {
      introduction: ['image', 'imagebackground'],
      projects: ['screenshots', 'video'],
      certificates: ['certificate_image'],
      resume: ['resume_file', 'cv_file'],
    };

    const currentFields = fields[type] || [];
    const currentFileFields = fileFields[type] || [];

    return (
      <>
        {/* Text/Input Fields */}
        {currentFields.map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                rows={4}
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}

        {/* File Upload Fields */}
        {currentFileFields.includes('image') && renderFileInput('image', 'Profile Image', 'image/*', 'Upload your profile picture (JPG, PNG, GIF)')}
        {currentFileFields.includes('imagebackground') && renderFileInput('imagebackground', 'Banner Background Image', 'image/*', 'LinkedIn-style banner image - Recommended size: 1200x300px')}
        {currentFileFields.includes('screenshots') && renderFileInput('screenshots', 'Project Screenshot', 'image/*', 'Upload a screenshot of your project')}
        {currentFileFields.includes('video') && renderFileInput('video', 'Project Video', 'video/*', 'Upload a video demo of your project (MP4, WebM)')}
        {currentFileFields.includes('certificate_image') && renderFileInput('certificate_image', 'Certificate Image', 'image/*,.pdf', 'Upload an image or PDF of your certificate')}
        {currentFileFields.includes('resume_file') && renderFileInput('resume_file', 'Resume File', '.pdf,.doc,.docx', 'Upload your resume (PDF, DOC, DOCX)')}
        {currentFileFields.includes('cv_file') && renderFileInput('cv_file', 'CV File', '.pdf,.doc,.docx', 'Upload your CV (PDF, DOC, DOCX)')}
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit' : 'Add New'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          {renderFormFields()}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                isEditing ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;