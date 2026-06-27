from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'projects', views.ProjectsViewSet, basename='projects')

urlpatterns = [
    path('api/send-hire-email/', views.send_hire_email, name='send-hire-email'),
    
    # Introduction URLs
    path('api/introduction/', views.IntroductionListCreateView.as_view(), name='introduction-list'),
    path('api/introduction/<int:pk>/', views.IntroductionDetailView.as_view(), name='introduction-detail'),
    
    # Skills URLs
    path('api/skills/', views.SkillsListCreateView.as_view(), name='skills-list'),
    path('api/skills/<int:pk>/', views.SkillsDetailView.as_view(), name='skills-detail'),
    
    # Projects URLs (from ViewSet)
    path('api/', include(router.urls)),
    
    # Experience URLs
    path('api/experience/', views.ExperienceListCreateView.as_view(), name='experience-list'),
    path('api/experience/<int:pk>/', views.ExperienceDetailView.as_view(), name='experience-detail'),
    
    # Education URLs
    path('api/education/', views.EducationListCreateView.as_view(), name='education-list'),
    path('api/education/<int:pk>/', views.EducationDetailView.as_view(), name='education-detail'),
    
    # Certificate URLs
    path('api/certificates/', views.CertificateListCreateView.as_view(), name='certificate-list'),
    path('api/certificates/<int:pk>/', views.CertificateDetailView.as_view(), name='certificate-detail'),
    
    # Resume URLs
    path('api/resume/', views.ResumeListCreateView.as_view(), name='resume-list'),
    path('api/resume/<int:pk>/', views.ResumeDetailView.as_view(), name='resume-detail'),
    
    # Articles URLs
    path('api/articles/', views.ArticlesListCreateView.as_view(), name='articles-list'),
    path('api/articles/<int:pk>/', views.ArticlesDetailView.as_view(), name='articles-detail'),
    
    # Contact URLs
    path('api/contact/', views.ContactListCreateView.as_view(), name='contact-list'),
    path('api/contact/<int:pk>/', views.ContactDetailView.as_view(), name='contact-detail'),
    
    # Last URLs
    path('api/last/', views.LastListCreateView.as_view(), name='last-list'),
    path('api/last/<int:pk>/', views.LastDetailView.as_view(), name='last-detail'),
    
    # Custom function-based views
    path('api/portfolio/intro/', views.portfolio_introduction, name='portfolio-intro'),
    path('api/portfolio/full/', views.get_full_portfolio, name='full-portfolio'),
    
    # Resume function view (for getting resume files from certificates)
    path('api/resume-files/', views.get_resume, name='resume-files'),
    
    # Authentication endpoints
    path('api/auth/login/', obtain_auth_token, name='api_login'),
    path('api/verify-token/', views.verify_token, name='verify_token'),
]