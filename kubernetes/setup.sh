#!/bin/bash

cd backend
docker build -t tadamczyk/backend .
docker push tadamczyk/backend
cd ..

cd frontend
docker build -t tadamczyk/frontend .
docker push tadamczyk/frontend
cd ..

# Install ingress-nginx (needed only once)
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml

kubectl.exe apply -f app-configmap.yml

kubectl.exe apply -f postgres-secret.yml
kubectl.exe apply -f postgres-pvc.yml
kubectl.exe apply -f postgres-deployment.yml
kubectl.exe apply -f postgres-service-clusterip.yml

kubectl.exe apply -f redis-deployment.yml
kubectl.exe apply -f redis-service-clusterip.yml

kubectl.exe apply -f backend-deployment.yml
kubectl.exe apply -f backend-service-clusterip.yml

kubectl.exe apply -f frontend-deployment.yml
kubectl.exe apply -f frontend-service-clusterip.yml

kubectl.exe apply -f ingress-service.yml