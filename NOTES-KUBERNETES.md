# Kubernetes commands

TYPE = `[pod|(rs|replicaset)|(deploy|deployment)|(svc|service)|ingress|pvc|pv|secret|configmap|namespaces]`

`kubectl version` -> get version information  
`kubectl cluster-info` -> get cluster information  
`kubectl config current-context` -> get current context information  
`kubectl get TYPE` -> get all elements in passed type  
`kubectl get all` -> get all elements in all types  
`kubectl describe TYPE NAME` -> get information about passed type with passed name  
`kubectl logs TYPE NAME` -> get logs for passed type with passed name  
`kubectl create -f FILE` -> create types for passed file  
`kubectl delete TYPE NAME` -> delete type with passed name  
`kubectl scale --replicas=VALUE rs RSNAME` -> set replicas for passed replicaset name  
`kubectl replace -f FILE` -> replace elements by file  
`kubectl apply -f FILE` -> apply configuration from file  
`kubectl exec -ti dnsutils -- nslookup SVCNAME` -> get DNS information for service with passed name