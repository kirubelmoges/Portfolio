from django.db import models

class Introduction(models.Model):
    # Upload fields (keep for backward compatibility)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    imagebackground = models.FileField(upload_to='images/', blank=True, null=True)
    
    # Text fields
    name = models.CharField(max_length=500, default="Kirubel Moges")
    career = models.CharField(max_length=500, default="Software Developer")
    role = models.CharField(max_length=600, blank=True, null=True)
    about_me = models.CharField(max_length=600, blank=True, null=True)
    
    # Cloudinary URL fields
    image_url = models.URLField(max_length=650, blank=True, null=True)
    imagebackground_url = models.URLField(max_length=650, blank=True, null=True)

    def __str__(self):
        return self.name


class Skills(models.Model):
    language = models.CharField(max_length=650)
    framework = models.CharField(max_length=650)
    tools = models.CharField(max_length=600)

    def __str__(self):
        return f"Skills {self.id}"


class Projects(models.Model):
    # Text fields
    project_title = models.CharField(max_length=650)
    description = models.CharField(max_length=650)
    tools_used = models.CharField(max_length=600)
    github_link = models.CharField(max_length=650, blank=True, null=True)
    url = models.CharField(max_length=650, blank=True, null=True)
    
    # Upload fields (keep for backward compatibility)
    screenshots = models.FileField(upload_to='projects/', blank=True, null=True)
    video = models.FileField(upload_to='projects/', blank=True, null=True)
    
    # Cloudinary URL fields
    screenshots_url = models.URLField(max_length=650, blank=True, null=True)
    video_url = models.URLField(max_length=650, blank=True, null=True)

    def __str__(self):
        return self.project_title


class Experience(models.Model):
    job = models.CharField(max_length=650)
    what_have_you_done = models.CharField(max_length=650)

    def __str__(self):
        return self.job


class Education(models.Model):
    attended_university = models.CharField(max_length=650)
    attended_college = models.CharField(max_length=650)
    pursuing_degree = models.CharField(max_length=650, blank=True, null=True)
    relevant_courses = models.CharField(max_length=650, blank=True, null=True)

    def __str__(self):
        return self.attended_university


class Certificate(models.Model):
    # Text fields
    certificate_name = models.CharField(max_length=650)
    certificate_link = models.URLField(max_length=650, blank=True, null=True)
    
    # Upload fields (keep for backward compatibility)
    certificate_image = models.FileField(upload_to='certificates/', blank=True, null=True)
    cv = models.FileField(upload_to='cv/', blank=True, null=True)
    
    # Cloudinary URL fields
    certificate_image_url = models.URLField(max_length=650, blank=True, null=True)
    cv_url = models.URLField(max_length=650, blank=True, null=True)

    def __str__(self):
        return self.certificate_name


class Articles(models.Model):
    article_title = models.CharField(max_length=650)
    description = models.CharField(max_length=650)
    to_article_link = models.CharField(max_length=650)

    def __str__(self):
        return self.article_title


class Contact(models.Model):
    email = models.EmailField(max_length=650)
    linkedin = models.CharField(max_length=650)
    github = models.CharField(max_length=650)
    phone = models.CharField(max_length=650)

    def __str__(self):
        return self.email


class Last(models.Model):
    copyright = models.CharField(max_length=650)
    logo_social_links = models.CharField(max_length=650)

    def __str__(self):
        return self.copyright


class Resume(models.Model):
    resume_name = models.CharField(max_length=650, default="Resume")
    
    # Upload fields (keep for backward compatibility)
    resume_file = models.FileField(upload_to='resume/', blank=True, null=True)
    cv_file = models.FileField(upload_to='cv/', blank=True, null=True)
    
    # Cloudinary URL fields
    resume_file_url = models.URLField(max_length=650, blank=True, null=True)
    cv_file_url = models.URLField(max_length=650, blank=True, null=True)

    def __str__(self):
        return self.resume_name