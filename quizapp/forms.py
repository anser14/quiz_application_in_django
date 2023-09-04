from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User  # Make sure you import the User model



class SignUpForm(UserCreationForm):
    email = forms.CharField(max_length=150)
    username = forms.CharField(label='Username', max_length=150)
    # these are for strong passwords 
    # password1 = forms.CharField(
    #     label='Password',
    #     widget=forms.PasswordInput,
    #     help_text="Your password should contain at least 8 characters",
    # )
    # password2 = forms.CharField(
    #     label='Confirm Password',
    #     widget=forms.PasswordInput,
    #     help_text="Enter the same password as before.",
    # )

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        # fields = ('username', 'email')

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150, required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)





















