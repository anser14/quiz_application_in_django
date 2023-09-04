from django.urls import path
from . import views


urlpatterns = [
    # path('',views.index,name="index"),
    path('',views.index_view, name = 'main_view'),
    path('<pk>/',views.quiz_view, name = 'index'),
    path('<pk>/save/',views.save_quiz_view, name = 'save_quiz_view'),
    path('<pk>/data/',views.quiz_data_view, name = 'quiz_data_view'),
    path('app/login/', views.loginpage, name='login'),
    path('app/signup/', views.signuppage, name='signup'),
    path('app/logout/', views.Logoutnow, name='logoutnow'),
]