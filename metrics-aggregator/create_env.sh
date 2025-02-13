#!/bin/sh
c8y microservices serviceusers get --id metrics-aggregator \
| c8y template execute \
  --template "'C8Y_USER=\"%s\"\nC8Y_PASSWORD=\"%s\"\nC8Y_TENANT=\"%s\"\n' % [input.value.name, input.value.password, input.value.tenant]" > .env
c8y currenttenant get | c8y template execute --template "'C8Y_BASEURL=\"https://%s\"' % [input.value.domainName]" >> .env

c8y microservices getBootstrapUser --id metrics-aggregator \
| c8y template execute \
  --template "'C8Y_BOOTSTRAP_USER=\"%s\"\nC8Y_BOOTSTRAP_PASSWORD=\"%s\"\nC8Y_BOOTSTRAP_TENANT=\"%s\"\n' % [input.value.name, input.value.password, input.value.tenant]" >> .env

echo C8Y_MICROSERVICE_ISOLATION="PER_TENANT">> .env