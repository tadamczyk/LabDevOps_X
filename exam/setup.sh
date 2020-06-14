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

kubectl.exe apply -f k8s/app-configmap.yml

kubectl.exe apply -f k8s/postgres-secret.yml
kubectl.exe apply -f k8s/postgres-pvc.yml
kubectl.exe apply -f k8s/postgres-deployment.yml
kubectl.exe apply -f k8s/postgres-service-clusterip.yml

kubectl.exe apply -f k8s/redis-deployment.yml
kubectl.exe apply -f k8s/redis-service-clusterip.yml

kubectl.exe apply -f k8s/backend-deployment.yml
kubectl.exe apply -f k8s/backend-service-clusterip.yml

kubectl.exe apply -f k8s/frontend-deployment.yml
kubectl.exe apply -f k8s/frontend-service-clusterip.yml

kubectl.exe apply -f k8s/ingress-service.yml