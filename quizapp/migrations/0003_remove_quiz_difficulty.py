# Generated by Django 4.1.7 on 2023-08-23 13:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quizapp', '0002_alter_quiz_options'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='difficulty',
        ),
    ]
