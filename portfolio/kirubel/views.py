from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from .models import (
    Introduction, Skills, Projects, Experience, 
    Education, Certificate, Articles, Contact, Last, Resume
)
from .serializers import (
    IntroductionSerializer, SkillsSerializer, ProjectsSerializer,
    ExperienceSerializer, EducationSerializer, CertificateSerializer,
    ArticlesSerializer, ContactSerializer, LastSerializer, ResumeSerializer
)

# ============== INTRODUCTION VIEWS ==============
class IntroductionListCreateView(generics.ListCreateAPIView):
    queryset = Introduction.objects.all()
    serializer_class = IntroductionSerializer

class IntroductionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Introduction.objects.all()
    serializer_class = IntroductionSerializer

# ============== SKILLS VIEWS ==============
class SkillsListCreateView(generics.ListCreateAPIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer

class SkillsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer

# ============== PROJECTS VIEWS ==============
class ProjectsViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

# ============== EXPERIENCE VIEWS ==============
class ExperienceListCreateView(generics.ListCreateAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

# ============== EDUCATION VIEWS ==============
class EducationListCreateView(generics.ListCreateAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

# ============== CERTIFICATE VIEWS ==============
class CertificateListCreateView(generics.ListCreateAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer

class CertificateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer

# ============== RESUME VIEWS ==============
class ResumeListCreateView(generics.ListCreateAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

# ============== ARTICLES VIEWS ==============
class ArticlesListCreateView(generics.ListCreateAPIView):
    queryset = Articles.objects.all()
    serializer_class = ArticlesSerializer

class ArticlesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Articles.objects.all()
    serializer_class = ArticlesSerializer

# ============== CONTACT VIEWS ==============
class ContactListCreateView(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

# ============== LAST VIEWS ==============
class LastListCreateView(generics.ListCreateAPIView):
    queryset = Last.objects.all()
    serializer_class = LastSerializer

class LastDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Last.objects.all()
    serializer_class = LastSerializer

# ============== FUNCTION-BASED VIEWS ==============
@api_view(['GET', 'POST'])
def portfolio_introduction(request):
    if request.method == 'GET':
        intro = Introduction.objects.first()
        serializer = IntroductionSerializer(intro)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = IntroductionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_full_portfolio(request):
    """Get all portfolio data in one request"""
    data = {
        'introduction': IntroductionSerializer(Introduction.objects.first()).data if Introduction.objects.exists() else None,
        'skills': SkillsSerializer(Skills.objects.all(), many=True).data,
        'projects': ProjectsSerializer(Projects.objects.all(), many=True).data,
        'experience': ExperienceSerializer(Experience.objects.all(), many=True).data,
        'education': EducationSerializer(Education.objects.all(), many=True).data,
        'certificates': CertificateSerializer(Certificate.objects.all(), many=True).data,
        'articles': ArticlesSerializer(Articles.objects.all(), many=True).data,
        'contact': ContactSerializer(Contact.objects.first()).data if Contact.objects.exists() else None,
        'last': LastSerializer(Last.objects.first()).data if Last.objects.exists() else None,
    }
    return Response(data)

# ============== TOKEN VERIFICATION VIEW ==============
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """Verify if the authentication token is valid"""
    return Response({
        'valid': True, 
        'user': request.user.username,
        'user_id': request.user.id,
        'email': request.user.email
    })

# ============== SEND HIRE EMAIL VIEW ==============
@api_view(['POST'])
@permission_classes([AllowAny])
def send_hire_email(request):
    try:
        data = request.data
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        subject = data.get('subject', 'New Hire Request')
        
        email_message = f"""
        New Hire Request from Portfolio Website
        
        Name: {name}
        Email: {email}
        
        Message:
        {message}
        """
        
        send_mail(
            subject=f"Portfolio: {subject} from {name}",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.CONTACT_EMAIL],
            fail_silently=False,
        )
        
        return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ============== GET RESUME FUNCTION ==============
def get_resume(request):
    """Get all certificates that are resumes/CVs"""
    resumes = Certificate.objects.filter(
        certificate_name__icontains='resume'
    ) | Certificate.objects.filter(
        certificate_name__icontains='cv'
    )
    data = [{'id': r.id, 'certificate_name': r.certificate_name, 'cv': r.cv.url if r.cv else None} for r in resumes]
    return JsonResponse(data, safe=False)