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
        ('Images', {
            'fields': ('image', 'imagebackground'),
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
    list_display = ('certificate_name', 'has_image', 'has_cv')
    search_fields = ('certificate_name',)
    
    def has_image(self, obj):
        return bool(obj.certificate_image)
    has_image.boolean = True
    has_image.short_description = 'Has Image'
    
    def has_cv(self, obj):
        return bool(obj.cv)
    has_cv.boolean = True
    has_cv.short_description = 'Has CV'


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
    list_display = ('resume_name', 'has_resume_file', 'has_cv_file')
    search_fields = ('resume_name',)
    
    def has_resume_file(self, obj):
        return bool(obj.resume_file)
    has_resume_file.boolean = True
    has_resume_file.short_description = 'Has Resume'
    
    def has_cv_file(self, obj):
        return bool(obj.cv_file)
    has_cv_file.boolean = True
    has_cv_file.short_description = 'Has CV'
