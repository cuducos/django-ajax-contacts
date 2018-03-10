var fail = function (request) {};
var error_ = function () {};

var ajax = function(url, method, success, fail, error_) {
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

  request.send();
};

var contact_details = function (e) {
  var url = e.target.dataset.url;

  var contacts = document.querySelectorAll('aside ol li');
  for (var i = 0; i < contacts.length; i++) {
    contacts[i].setAttribute('class', '');
  }
  e.target.setAttribute('class', 'active');

  var article = document.querySelector('article');
  article.innerHTML = '';

  var success = function (request) {
    var contact = JSON.parse(request.responseText);

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
  };

  ajax(url, 'GET', success, fail, error_);
};

var load_contacts = function () {
  var success = function (request) {
    var resp = JSON.parse(request.responseText);
    var contacts = document.querySelector('aside ol');

    for (var i = 0; i < resp.contacts.length; i++) {
      var contact = resp.contacts[i];
      var li = document.createElement('li');
      var img = document.createElement('img');
      var name = document.createTextNode(contact.name);

      img.setAttribute('src', contact.avatar);
      img.setAttribute('alt', contact.name);
      img.setAttribute('class', 'img-circle');

      li.setAttribute('data-url', contact.url);
      li.appendChild(img);
      li.appendChild(name);
      li.onclick = contact_details;

      contacts.appendChild(li);
    }

  };

  ajax('/contacts/', 'GET', success, fail, error_);
};

load_contacts();
