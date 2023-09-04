from django.db import models
import random
# Create your models here.

# DIFF_CHOICES = (
#     tuple for selection
#     ('easy','easy')
#     ('medium','medium')
#     ('hard','hard')
# )

class Quiz(models.Model):
     
    background_color = models.CharField(help_text ="enter background color"  ,max_length=50, default ="blue")
    name = models.CharField(max_length=150)
    topic = models.CharField(max_length=150)
    no_of_questions = models.IntegerField()
    time = models.IntegerField(help_text = "duration of quiz in minutes")
    required_score_to_pass = models.IntegerField(help_text = "required score to pass in %")
    # difficulty = models.CharField(max_length=6) #,choices = DIFF_CHOICES 

    def get_questions(self):
        questions = list(self.question_set.all())
        random.shuffle(questions)
        return questions[:self.no_of_questions]
    def __str__(self):
        return f"{self.name}-{self.topic}"
    

    class Meta:
        verbose_name_plural = 'quizes' 
    