# Generated by Django 2.0.2 on 2018-02-27 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='Nome')),
                ('fone', models.CharField(max_length=16, null=True, verbose_name='Telefone')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
            ],
        ),
    ]