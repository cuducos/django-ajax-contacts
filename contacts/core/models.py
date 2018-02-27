from hashlib import md5
from urllib.parse import urlencode

from django.db import models


class Contact(models.Model):
    name = models.CharField('Nome', max_length=128)
    fone = models.CharField('Telefone', max_length=16, null=True)
    email = models.EmailField('Email')

    def avatar(self):
        email = self.email.lower()
        hash = md5(email.encode()).hexdigest()
        default = f'https://api.adorable.io/avatars/256/{email}.png'
        params = urlencode({'d': default, 's': 512})
        return f'https://www.gravatar.com/avatar/{hash}?{params}'
