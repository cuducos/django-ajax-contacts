from hashlib import md5
from urllib.parse import urlencode

from django.test import TestCase
from mixer.backend.django import mixer

from contacts.core.models import Contact


class TestContactModel(TestCase):

    def setUp(self):
        self.contact = mixer.blend(Contact)

    def test_create(self):
        self.assertEqual(1, Contact.objects.count())

    def test_phone_is_optional(self):
        Contact.objects.create(name='Fulano', email='fulano@server.org')
        self.assertEqual(2, Contact.objects.count())

    def test_email_is_required(self):
        with  self.assertRaises(TypeError):
            Contact.objects.create(name='Fulano', phone='011 1406')
        self.assertEqual(1, Contact.objects.count())

    def test_avatar(self):
        email = self.contact.email.lower()
        hash = md5(email.encode()).hexdigest()
        params = urlencode({
            'd': f'https://api.adorable.io/avatars/256/{email}.png',
            's': 512
        })
        expected = f'https://www.gravatar.com/avatar/{hash}?{params}'
        self.assertEqual(expected, self.contact.avatar())
