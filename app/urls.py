from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'mainapp.views.home', name='home'),
    url(r'^ajax/photo/more/$', 'mainapp.views.ajax_photo_more'),
    url(r'^photo/(?P<photo_slug>.*)/$', 'mainapp.views.photo'),

    url(r'^tags/$', 'mainapp.views.tags'),
    url(r'^tag/(?P<tag_slug>.*)/$', 'mainapp.views.tag'),
    url(r'^set/(?P<set_slug>.*)/$', 'mainapp.views.set_photos'),

    # Login and logout url's
    (r'^login/$', 'django.contrib.auth.views.login',
         {'template_name': 'login.html'}),
    (r'^accounts/login/$', 'django.contrib.auth.views.login',
         {'template_name': 'login.html'}),
    url(r'^register/$', 'mainapp.views.register'),
    url(r'^logout/$', 'mainapp.views.logout'),

    # Admin Url's
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
