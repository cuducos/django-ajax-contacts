/****************************************************************************/
/* Boilerplate                                                               /
/****************************************************************************/

var fail = function (request) {};
var error_ = function () {};

var ajax = function(url, method, data, success, fail, error_) {
  var request = new XMLHttpRequest();
  request.open(method, url, true);
  request.onerror = error_;
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      success(request);
    } else {
      fail(request);
    }
  };

  if (method == 'POST') {
    var csrftoken = document.querySelector('input[name=csrfmiddlewaretoken]').value;
    request.setRequestHeader("X-CSRFToken", csrftoken);

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(data);
  } else {
    request.send();
  }
};


/****************************************************************************/
/* Contact details                                                           /
/****************************************************************************/

var enable_edit_button = function (contact) {
  var button = document.querySelector('button.edit');
  var current_classes = button.className.split(' ');
  var new_classes = current_classes.filter(
    function (cls) { return cls != 'hide'; }
  );
  button.className = new_classes.join(' ');
  button.removeAttribute('disabled');
  button.onclick = function () {
    show_form(contact);
  };
};

var disable_edit_button = function () {
  var button = document.querySelector('button.edit');
  if (button.className.indexOf('hide') == -1) {
    button.className += ' hide';
  }
  button.setAttribute('disabled', true);
};

var show_contact_details = function (contact) {
  var article = document.querySelector('article');
  article.innerHTML = '';

  var h2 = document.createElement('h2');
  var img = document.createElement('img');
  var dl = document.createElement('dl');
  var a = document.createElement('a');
  var dt_phone = document.createElement('dt');
  var dd_phone = document.createElement('dd');
  var dt_email = document.createElement('dt');
  var dd_email = document.createElement('dd');

  var name = document.createTextNode(contact.name);
  var phone = document.createTextNode(contact.phone);
  var phone_label = document.createTextNode('Telefone');
  var email = document.createTextNode(contact.email);
  var email_label = document.createTextNode('E-mail');

  img.setAttribute('src', contact.avatar);
  img.setAttribute('alt', contact.name);
  img.setAttribute('class', 'img-circle');

  h2.appendChild(img);
  h2.appendChild(name);

  dt_phone.appendChild(phone_label);
  dd_phone.appendChild(phone);

  a.setAttribute('href', 'mailto:' + contact.email);
  a.appendChild(email);

  dt_email.appendChild(email_label);
  dd_email.appendChild(a);

  dl.appendChild(dt_phone);
  dl.appendChild(dd_phone);
  dl.appendChild(dt_email);
  dl.appendChild(dd_email);

  article.appendChild(h2);
  article.appendChild(dl);
  article.dataset.editContactUrl = contact.url;

  enable_edit_button(contact);

};

var load_contact_details = function (e) {
  var url = e.target.dataset.url;

  var contacts = document.querySelectorAll('aside ol li');
  for (var i = 0; i < contacts.length; i++) {
    contacts[i].setAttribute('class', '');
  }
  e.target.setAttribute('class', 'active');

  var success = function (request) {
    var contact = JSON.parse(request.responseText);
    show_contact_details(contact);
  };

  ajax(url, 'GET', {},  success, fail, error_);
};


/****************************************************************************/
/* Contact list                                                              /
/****************************************************************************/

var add_to_contact_list = function (contact, contact_list) {
  var li = document.createElement('li');
  var img = document.createElement('img');
  var name = document.createTextNode(contact.name);

  img.setAttribute('src', contact.avatar);
  img.setAttribute('alt', contact.name);
  img.setAttribute('class', 'img-circle');

  li.setAttribute('data-url', contact.url);
  li.appendChild(img);
  li.appendChild(name);
  li.onclick = load_contact_details;

  contact_list.appendChild(li);
};

var load_contacts = function () {
  var success = function (request) {
    var resp = JSON.parse(request.responseText);
    var contacts = document.querySelector('aside ol');
    contacts.innerHTML = '';

    for (var i = 0; i < resp.contacts.length; i++) {
      var contact = resp.contacts[i];
      add_to_contact_list(contact, contacts);
    }
  };

  ajax('/contacts/', 'GET', {},  success, fail, error_);
};


/****************************************************************************/
/* Forms                                                                     /
/****************************************************************************/

var form_group = function (field_name, field_label, field_type, value) {
  var div = document.createElement('div');
  var label = document.createElement('label');
  var input = document.createElement('input');

  label.setAttribute('for', field_name);
  label.innerHTML = field_label;

  input.setAttribute('type', field_type);
  input.setAttribute('id', field_name);
  input.className = 'form-control input-sm';
  if (Boolean(value)) {
    input.setAttribute('value', value);
  }

  div.className = 'form-group';
  div.appendChild(label);
  div.appendChild(input);

  return div;
};

var show_form = function (contact) {
  disable_edit_button();

  var article = document.querySelector('article');
  article.innerHTML = '';


  var name_value = '';
  var telephone_value = '';
  var email_value = '';
  if (Boolean(contact)) {
    name_value = contact.name;
    telephone_value = contact.phone;
    email_value = contact.email;
  }

  var h2 = document.createElement('h2');
  var form = document.createElement('form');
  var name = form_group('name', 'Nome', 'text', name_value);
  var telephone = form_group('telephone', 'Telefone', 'text', telephone_value);
  var email = form_group('email', 'E-mail', 'email', email_value);
  var p = document.createElement('p');
  var button = document.createElement('button');

  if (Boolean(contact)) {
    h2.innerHTML = 'Editar contato';
  } else {
    h2.innerHTML = 'Novo contato';
  }

  button.setAttribute('type', 'submit');
  button.className = 'btn btn-default';
  button.innerHTML = 'Salvar';

  p.className = 'pull-right';
  p.appendChild(button);

  form.setAttribute('role', 'form');
  form.appendChild(name);
  form.appendChild(telephone);
  form.appendChild(email);
  form.appendChild(p);

  if (Boolean(contact)) {
    form.onsubmit = edit_contact;
  } else {
    form.onsubmit = new_contact;
  }

  article.appendChild(h2);
  article.appendChild(form);

};


/****************************************************************************/
/* User actions                                                              /
/****************************************************************************/

var get_form_data = function () {
  var name = document.forms[0].name.value;
  var telephone = document.forms[0].telephone.value;
  var email = document.forms[0].email.value;

  var article = document.querySelector('article');
  article.innerHTML = '';

  return 'name=' + encodeURI(name) + '&fone=' + encodeURI(telephone) + '&email=' + encodeURI(email);
};

var success_insert_or_update = function (request) {
  var contact = JSON.parse(request.responseText);
  show_contact_details(contact);
  load_contacts();
};

var new_contact = function (e) {
  e.preventDefault();
  var url = document.querySelector('article').dataset.newContactUrl;
  var data = get_form_data();
  ajax(url, 'POST', data, success_insert_or_update, fail, error_);
};

var edit_contact = function (e) {
  e.preventDefault();
  var url = document.querySelector('article').dataset.editContactUrl;
  var data = get_form_data();
  ajax(url, 'POST', data, success_insert_or_update, fail, error_);
};


/****************************************************************************/
/* Init                                                                      /
/****************************************************************************/

load_contacts();
document.querySelector('button.new').onclick = show_form;
