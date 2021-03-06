#!/bin/bash

kubectl.exe delete ingress my-ingress-service

kubectl.exe delete svc my-frontend-service
kubectl.exe delete svc my-backend-service
kubectl.exe delete svc my-redis-service
kubectl.exe delete svc my-postgres-service

kubectl.exe delete deploy my-frontend-deployment
kubectl.exe delete deploy my-backend-deployment
kubectl.exe delete deploy my-redis-deployment
kubectl.exe delete deploy my-postgres-deployment

kubectl.exe delete pvc my-postgres-pvc
kubectl.exe delete secret my-postgres-secret
kubectl.exe delete configmap my-app-configmap