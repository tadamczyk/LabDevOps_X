# K8S - commands

TYPE = `[pod|rs|deployment]`

`kubectl cluster-info` => show information about K8S master  
`kubectl config current-context` => show current context information  
`kubectl get TYPE` => show all elements on TYPE  
`kubectl get all` => show all elements  
`kubectl describe TYPE NAME` => show more information about TYPE for passed NAME  
`kubectl create -f FILENAME` => create types for passed FILENAME  
`kubectl delete TYPE NAME` => delete TYPE for passed NAME  
`kubectl scale --replicas=VALUE rs RSNAME` => set VALUE replicas for passed RSNAME  
`kubectl replace -f FILENAME` => replace elements by passed in FILENAME