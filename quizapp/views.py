from django.shortcuts import render , redirect
from django.urls import reverse_lazy
from .models import Quiz
from django.views.generic import ListView
from django.http import JsonResponse
from django.shortcuts import HttpResponse ,HttpResponseRedirect
from questions.models import Question , Answer
from django.contrib.auth.models import User
from results.models import Result
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm, LoginForm

# Create your views here.

class QuizListView(ListView):
    model = Quiz
    template_name = "quizapp/index.html"
    
@login_required
def index_view(request):

    quiz_list_view = QuizListView.as_view()
    return quiz_list_view(request)



@login_required
def quiz_view(request,pk):
    
        quiz = Quiz.objects.get(pk = pk)
        return render(request, 'quizapp/quiz.html',{'obj':quiz})
    
    
@login_required
def quiz_data_view(request,pk):
    
        quiz = Quiz.objects.get(pk = pk)
        questions = []
        for q in quiz.get_questions():
            answers = []
            for a in q.get_answers():
                answers.append(a.text)
            questions.append({str(q):answers})
        return JsonResponse({
            'data':questions,
            'time':quiz.time,
        })
    
@login_required
def save_quiz_view(request,pk):
    print(request.POST)
    # if request.is_ajax():
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        questions = []
        data = request.POST
        data_ = dict(data.lists())
        # print(type(data_))
        data_.pop('csrfmiddlewaretoken')
        # print(data_)
        for k in data_.keys():
            # print('key',k)
            question = Question.objects.get(text = k)
            questions.append(question)
            # print(questions)
        user = request.user
        quiz = Quiz.objects.get(pk=pk)
        score = 0
        multiplier = 100 / quiz.no_of_questions
        results = []
        correct_ans = None

        for q in questions:
            a_selected = request.POST.get(q.text)
            if a_selected != "":
                question_answers = Answer.objects.filter(question=q)
                for a in question_answers:
                    if a_selected == a.text:
                        if a.correct:
                            score +=1
                            correct_ans = a.text
                    else:
                        if a.correct:
                            correct_ans = a.text
                results.append({str(q):{'correct_ans':correct_ans,'answered':a_selected}})
            else:
                results.append({str(q):'not answered'})
        score_ = score * multiplier
        Result.objects.create(quiz = quiz,user = user,score = score_)

        if score_ >= quiz.required_score_to_pass:
            return JsonResponse({'passed':True,'score':score_,'results':results})
        else:
            return JsonResponse({'passed':False,'score':score_,'results':results})
    else:
        return redirect('/')



def signuppage(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Log the user in
            login(request, user)
            return HttpResponseRedirect('/app/login')  # Change 'home' to the appropriate URL name
    else:
        form = SignUpForm()
    return render(request, 'quizapp/signup.html', {'form': form})
    


def loginpage(request):

    if request.user.is_authenticated:
        # return render(request,'quizapp/index.html')
        return redirect("/")
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        validate_user = authenticate(username=username, password=password)
        if validate_user is not None:
            login(request, validate_user)
            return redirect("/")
        else:
            form = LoginForm()
            return render(request, 'quizapp/login.html',{'form':form})

            # return HttpResponseRedirect('/login')

    form = LoginForm()
    return render(request, 'quizapp/login.html',{'form':form})


@login_required
def Logoutnow(request):
    logout(request)
    return redirect('/')

