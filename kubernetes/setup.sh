#!/bin/bash

cd backend
docker build -t tadamczyk/backend .
docker push tadamczyk/backend
cd ..

kubectl.exe apply -f app-configmap.yml

kubectl.exe apply -f postgres-secret.yml
kubectl.exe apply -f postgres-pvc.yml
kubectl.exe apply -f postgres-deployment.yml
kubectl.exe apply -f postgres-service-clusterip.yml

kubectl.exe apply -f redis-deployment.yml
kubectl.exe apply -f redis-service-clusterip.yml

kubectl.exe apply -f backend-deployment.yml
kubectl.exe apply -f backend-service-nodeport.yml