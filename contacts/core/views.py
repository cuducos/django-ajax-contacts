from django.http import JsonResponse, HttpResponseNotAllowed
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


def contacts_new(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(('POST',))

    data = {
        key: value for key, value in request.POST.items()
        if key in ('name', 'fone', 'email')
    }
    contact = Contact.objects.create(**data)
    response = dict(
        name=contact.name,
        avatar=contact.avatar(),
        email=contact.email,
        phone=contact.fone
    )

    return JsonResponse(response, status=201)


def _contact_summary(contact):
    return dict(
        name=contact.name,
        avatar=contact.avatar(),
        url=resolve_url('contact-details', pk=contact.pk)
    )
