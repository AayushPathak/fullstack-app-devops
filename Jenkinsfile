pipeline {
  environment {
    SHA = sh(returnStdout: true, script: "git rev-parse HEAD")
  }
  agent {
    kubernetes {
      yamlFile 'buildPod.yaml'
    }
  }
  stages {
    stage('test') {
      steps {
        container('docker') {
          sh 'docker build -t aayushpathak/frontend-test -f ./client/Dockerfile.dev ./client'
          sh 'docker run aayushpathak/frontend-test -e CI=true npm test'
        }
      }
    }

    stage('build-push-production-images') {
      steps {
        container('docker') {
          sh 'docker build -t aayushpathak/frontend-test -f ./client/Dockerfile.dev ./client'
          sh 'docker run aayushpathak/frontend-test -e CI=true npm test'
        }
      }
    }

    stage('deploy') {
      environment {
        GC_HOME = '$HOME/google-cloud-sdk/bin'
        GC_KEY = credentials('jenkins-secret')
      }

      steps {
        container('docker') {
          sh("rm -r -f /root/google-cloud-sdk")
          sh("curl https://sdk.cloud.google.com | bash > /dev/null;")
          sh("${GC_HOME}/gcloud components update kubectl")
          sh("${GC_HOME}/gcloud auth activate-service-account --key-file=${GC_KEY}")
          sh("${GC_HOME}/kubectl apply -f k8s")
          sh("${GC_HOME}/kubectl set image deployments/server-deployment server=aayushpathak/fullstack-server:${SHA}")
          sh("${GC_HOME}/kubectl set image deployments/client-deployment client=aayushpathak/fullstack-client:${SHA}")
        }
      }
    }
  }
}
