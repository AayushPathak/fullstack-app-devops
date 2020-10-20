pipeline {
  environment {
    SHA = sh(returnStdout: true, script: "git rev-parse HEAD")
  }
  agent any
  stages {
    stage('test') {
      agent {
        dockerfile {
          filename 'Dockerfile.dev'
          dir 'client'
          additionalBuildArgs '-t aayushpathak/react-test'
          args '-e CI=true'
        }
      }
      steps {
        sh 'npm test'
      }
    }

    stage('build-push-production-images') {
      steps {
        script {
          def frontEndProd = docker.build("aayushpathak/fullstack-client", "./client")
          def serverProd = docker.build("aayushpathak/fullstack-server", "./server")
          docker.withRegistry('', dockerhub-creds) {
            frontEndProd.push('latest')
            frontEndProd.push("${SHA}")
            serverProd.push('latest')
            serverProd.push("${SHA}")
          }
        }
      }
    }

    stage('deploy') {
      environment {
        GC_HOME = '$HOME/google-cloud-sdk/bin'
        GC_KEY = credentials('jenkins-secret')
      }

      steps {
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
