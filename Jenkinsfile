pipeline {
    agent any

    // ── Environment Variables ─────────────────────────────────────────────
    environment {
        NODE_ENV     = 'test'
        APP_NAME     = 'quote-generator-api'
        ARTIFACT_DIR = 'artifacts'
    }

    // ── Polling trigger: checks SCM every 5 minutes ───────────────────────
    // For webhooks instead, remove this block and configure the webhook in GitHub
    triggers {
        pollSCM('H/5 * * * *')
    }

    options {
        // Keep only the last 10 builds to save disk space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Fail the build if it hangs for more than 15 minutes
        timeout(time: 15, unit: 'MINUTES')
        // Add timestamps to every log line
        timestamps()
        // Don't run concurrent builds on the same branch
        disableConcurrentBuilds()
    }

    // ══════════════════════════════════════════════════════════════════════
    //  STAGES
    // ══════════════════════════════════════════════════════════════════════
    stages {

        // ── Stage 1: Checkout ─────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "==> Checking out source code from SCM..."
                checkout scm
                // Print the commit that was checked out
                sh 'git log -1 --pretty=format:"Commit: %H%nAuthor: %an%nMessage: %s"'
            }
        }

        // ── Stage 2: Environment Info ─────────────────────────────────────
        stage('Environment Info') {
            steps {
                echo "==> Verifying Node.js and npm versions..."
                sh 'node --version'
                sh 'npm --version'
            }
        }

        // ── Stage 3: Install Dependencies ────────────────────────────────
        stage('Install Dependencies') {
            steps {
                echo "==> Installing npm dependencies..."
                // 'npm ci' is preferred over 'npm install' in CI:
                //   - Uses package-lock.json exactly (reproducible builds)
                //   - Fails if lock file is out of sync with package.json
                //   - Faster — skips dependency resolution
                sh 'npm ci'
            }
        }

        // ── Stage 4: Run Tests ────────────────────────────────────────────
        stage('Test') {
            steps {
                echo "==> Running test suite..."
                // 'npm test' calls: jest --forceExit --detectOpenHandles
                // A non-zero exit code from Jest will automatically fail this stage
                sh 'npm test'
            }
            post {
                always {
                    // If Jest is configured to emit JUnit XML (jest-junit reporter),
                    // publish results to Jenkins test trend charts.
                    // Uncomment once you add jest-junit to devDependencies:
                    // junit 'junit-results/*.xml'
                    echo "==> Test stage complete."
                }
                failure {
                    echo "❌ Tests FAILED — build marked as FAILURE."
                }
                success {
                    echo "✅ All tests PASSED."
                }
            }
        }

        // ── Stage 5: Archive Artifacts ────────────────────────────────────
        stage('Archive Artifacts') {
            steps {
                echo "==> Packaging application files for archival..."

                // Create a clean artifact directory (excluding dev files)
                sh '''
                    rm -rf ${ARTIFACT_DIR}
                    mkdir -p ${ARTIFACT_DIR}

                    # Copy only production-relevant files
                    cp -r app.js server.js data package.json package-lock.json README.md ${ARTIFACT_DIR}/

                    # Create a versioned tarball:  quote-generator-api-<buildNumber>.tar.gz
                    tar -czf ${APP_NAME}-${BUILD_NUMBER}.tar.gz ${ARTIFACT_DIR}/

                    echo "Artifact created: ${APP_NAME}-${BUILD_NUMBER}.tar.gz"
                    ls -lh ${APP_NAME}-${BUILD_NUMBER}.tar.gz
                '''
            }
            post {
                success {
                    // Archive the tarball in Jenkins so it can be downloaded
                    // from the build page under "Build Artifacts"
                    archiveArtifacts artifacts: '*.tar.gz', fingerprint: true
                    echo "==> Artifact archived in Jenkins."
                }
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    //  POST — Runs after all stages regardless of result
    // ══════════════════════════════════════════════════════════════════════
    post {
        always {
            echo "==> Pipeline finished. Build #${BUILD_NUMBER} | Status: ${currentBuild.currentResult}"
            // Clean workspace to free disk space after every build
            cleanWs()
        }
        success {
            echo "🎉 BUILD SUCCESS — ${APP_NAME} #${BUILD_NUMBER} is ready."
        }
        failure {
            echo "🔴 BUILD FAILED — Check the logs above for details."
            // Uncomment to send email notifications on failure:
            // mail to: 'your-team@example.com',
            //      subject: "FAILED: ${APP_NAME} Build #${BUILD_NUMBER}",
            //      body: "Check Jenkins: ${env.BUILD_URL}"
        }
        unstable {
            echo "⚠️  BUILD UNSTABLE — Tests may have partially failed."
        }
    }
}
