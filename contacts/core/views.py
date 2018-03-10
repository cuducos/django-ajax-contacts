from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, resolve_url

from contacts.core.models import Contact


def home(request):
    return render(request, 'core/base.html')


def contacts(request):
    contacts = [_contact_summary(contact) for contact in Contact.objects.all()]
    return JsonResponse(dict(contacts=contacts))


def contact_detail(request, pk):
    contact = get_object_or_404(Contact, pk=pk)
    response = dict(
        name=contact.name,
        avatar=contact.avatar(),
        email=contact.email,
        phone=contact.fone
    )
    return JsonResponse(response)


def _contact_summary(contact):
    return dict(
        name=contact.name,
        avatar=contact.avatar(),
        url=resolve_url('contact-details', pk=contact.pk)
    )
