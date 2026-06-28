from rest_framework import serializers
from .models import (
    Introduction, Skills, Projects, Experience, 
    Education, Certificate, Articles, Contact, Last, Resume
)

class IntroductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Introduction
        fields = '__all__'


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'


class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = '__all__'


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'


class ArticlesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Articles
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class LastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Last
        fields = '__all__'


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'


class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Prioritize Cloudinary URLs over uploaded files
        if instance.screenshots_url:
            data['screenshots'] = instance.screenshots_url
        if instance.video_url:
            data['video'] = instance.video_url
        return data


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.certificate_image_url:
            data['certificate_image'] = instance.certificate_image_url
        if instance.cv_url:
            data['cv'] = instance.cv_url
        return data


class IntroductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Introduction
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image_url:
            data['image'] = instance.image_url
        if instance.imagebackground_url:
            data['imagebackground'] = instance.imagebackground_url
        return data


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.resume_file_url:
            data['resume_file'] = instance.resume_file_url
        if instance.cv_file_url:
            data['cv_file'] = instance.cv_file_url
        return data