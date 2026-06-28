from django.contrib import admin
from .models import (
    Introduction, Skills, Projects,
    Experience, Education, Certificate,
    Articles, Contact, Last, Resume
)


@admin.register(Introduction)
class IntroductionAdmin(admin.ModelAdmin):
    list_display = ('name', 'career')
    search_fields = ('name', 'career')
    fieldsets = (
        (None, {
            'fields': ('name', 'career', 'role', 'about_me')
        }),
        ('Images (Upload Files)', {
            'fields': ('image', 'imagebackground'),
            'classes': ('collapse',)
        }),
        ('Images (Cloudinary URLs)', {
            'fields': ('image_url', 'imagebackground_url'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Skills)
class SkillsAdmin(admin.ModelAdmin):
    list_display = ('language', 'framework', 'tools')
    search_fields = ('language', 'framework', 'tools')


@admin.register(Projects)
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ('project_title', 'github_link', 'url')
    search_fields = ('project_title', 'description')
    list_filter = ('tools_used',)
    fieldsets = (
        (None, {
            'fields': ('project_title', 'description', 'tools_used', 'github_link', 'url')
        }),
        ('Media (Upload Files)', {
            'fields': ('screenshots', 'video'),
            'classes': ('collapse',)
        }),
        ('Media (Cloudinary URLs)', {
            'fields': ('screenshots_url', 'video_url'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('job',)
    search_fields = ('job', 'what_have_you_done')


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('attended_university', 'attended_college')
    search_fields = ('attended_university', 'attended_college', 'pursuing_degree')


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('certificate_name', 'has_image', 'has_cv', 'has_image_url', 'has_cv_url')
    search_fields = ('certificate_name',)
    fieldsets = (
        (None, {
            'fields': ('certificate_name', 'certificate_link')
        }),
        ('Media (Upload Files)', {
            'fields': ('certificate_image', 'cv'),
            'classes': ('collapse',)
        }),
        ('Media (Cloudinary URLs)', {
            'fields': ('certificate_image_url', 'cv_url'),
            'classes': ('collapse',)
        }),
    )
    
    def has_image(self, obj):
        return bool(obj.certificate_image)
    has_image.boolean = True
    has_image.short_description = 'Has Image (Upload)'
    
    def has_cv(self, obj):
        return bool(obj.cv)
    has_cv.boolean = True
    has_cv.short_description = 'Has CV (Upload)'
    
    def has_image_url(self, obj):
        return bool(obj.certificate_image_url)
    has_image_url.boolean = True
    has_image_url.short_description = 'Has Image (Cloudinary)'
    
    def has_cv_url(self, obj):
        return bool(obj.cv_url)
    has_cv_url.boolean = True
    has_cv_url.short_description = 'Has CV (Cloudinary)'


@admin.register(Articles)
class ArticlesAdmin(admin.ModelAdmin):
    list_display = ('article_title', 'to_article_link')
    search_fields = ('article_title', 'description')


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'linkedin', 'github')
    search_fields = ('email', 'phone')


@admin.register(Last)
class LastAdmin(admin.ModelAdmin):
    list_display = ('copyright',)
    search_fields = ('copyright',)


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('resume_name', 'has_resume_file', 'has_cv_file', 'has_resume_url', 'has_cv_url')
    search_fields = ('resume_name',)
    fieldsets = (
        (None, {
            'fields': ('resume_name',)
        }),
        ('Files (Upload)', {
            'fields': ('resume_file', 'cv_file'),
            'classes': ('collapse',)
        }),
        ('Files (Cloudinary URLs)', {
            'fields': ('resume_file_url', 'cv_file_url'),
            'classes': ('collapse',)
        }),
    )
    
    def has_resume_file(self, obj):
        return bool(obj.resume_file)
    has_resume_file.boolean = True
    has_resume_file.short_description = 'Has Resume (Upload)'
    
    def has_cv_file(self, obj):
        return bool(obj.cv_file)
    has_cv_file.boolean = True
    has_cv_file.short_description = 'Has CV (Upload)'
    
    def has_resume_url(self, obj):
        return bool(obj.resume_file_url)
    has_resume_url.boolean = True
    has_resume_url.short_description = 'Has Resume (Cloudinary)'
    
    def has_cv_url(self, obj):
        return bool(obj.cv_url)
    has_cv_url.boolean = True
    has_cv_url.short_description = 'Has CV (Cloudinary)'