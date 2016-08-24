from django.http.response import HttpResponse
from django.template import loader, RequestContext,Template
from settings import default


class BaseLayout(object):
  header_file = ""
  footer_file = ""
  contents_file = ""
  loader_file = ""
  def __init__(self, header_file="layout/header.html", footer_file="layout/footer.html", contents_file="layout/contents.html", loader_file="layout/loader.html"):
    if not header_file is None:
      self.header_file = header_file
    if not footer_file is None:
      self.footer_file = footer_file
    if not contents_file is None:
      self.contents_file = contents_file
    if not loader_file is None:
      self.loader_file = loader_file
    
  def render_one( self, template_name, request, options ):
    renderer = loader.get_template ( template_name )
    return renderer.render( RequestContext(request, options) )

  def render_template( self,  request,  view_file, view_opts, **kwargs):
    header_string =  self.render_one(self.header_file, request, view_opts)
    view_contents_file = self.render_one( view_file, request, view_opts)
    view_opts['content'] = view_contents_file
    view_opts['application_http_directory']=  default.APPLICATION_HTTP_DIRECTORY

    view_contents_outer = self.render_one( self.contents_file, request, view_opts )
    footer_file = self.render_one(self.footer_file, request, view_opts)
    render = loader.get_template( self.loader_file )
      
   
    requestContext = {
         "header":  header_string,
         "content": view_contents_outer,
         "footer": footer_file
    }
    return HttpResponse(content=render.render(requestContext))


class MainLayout(BaseLayout):
  def __init__(self, header_file="layout/header.html", footer_file="layout/footer.html", contents_file="layout/contents.html", loader_file="layout/loader.html"):
    super(MainLayout,self).__init__(header_file=header_file,footer_file=footer_file,contents_file=contents_file,loader_file=loader_file)
  

class JSONLayout(BaseLayout):
  def __init__(self, header_file="layout/header_blank.html",footer_file="layout/footer_blank.html"):
    super(JSONLayout,self).__init__(header_file=header_file, footer_file=footer_file)

class SearchLayout(BaseLayout):
  def __init__(self, header_file="layout/header_search.html", footer_file="layout/footer_search.html"):
    super(SearchLayout,self).__init__("layout/header_search.html", "layout/footer_search.html", "layout/contents.html", "layout/loader.html")
class ViewLayout(BaseLayout):
  def __init__(self, header_file='layout/header_view.html', footer_file='layout/footer_view.html'):
    super(ViewLayout,self).__init__('layout/header_view.html', 'layout/footer_view.html', 'layout/contents.html', 'layout/loader.html')

class BackendLayout(BaseLayout):
  def __init__(self, header_file='layout/header_backend.html', footer_file='layout/footer_backend.html'):
    super(BackendLayout,self).__init__('layout/header_backend.html', 'layout/footer_backend.html', 'layout/contents.html', 'layout/loader.html')

class UserLayout(BaseLayout):
  def __init__(self, header_file='layout/header_user.html', footer_file='layout/footer_user.html'):
    super(UserLayout,self).__init__('layout/header_user.html', 'layout/footer_user.html', 'layout/contents.html', 'layout/loader.html')

class HomeLayout(BaseLayout):
  def __init__(self, header_file='layout/header_home.html', footer_file='layout/footer_home.html'):
    super(HomeLayout,self).__init__('layout/header_home.html', 'layout/footer_home.html', 'layout/contents.html', 'layout/loader.html')

class PagesLayout(BaseLayout):
  def __init__(self, header_file='layout/header_pages.html', footer_file='layout/footer_pages.html'):
    super(PagesLayout,self).__init__('layout/header_pages.html', 'layout/footer_pages.html', 'layout/contents.html', 'layout/loader.html')



