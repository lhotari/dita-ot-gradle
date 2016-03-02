package com.github.eerohele

import org.gradle.api.Project
import org.gradle.api.Plugin

class DitaOtPlugin implements Plugin<Project> {
    static final String DITA = 'dita'
    static final String DITA_OT = 'ditaOt'

    void setRepositories(Project project) {
        project.repositories {
          mavenCentral()
        }
    }

    void setConfigurations(Project project) {
        project.configurations {
            runtime
            provided
        }
    }

    void setDependencies(Project project, DitaOtExtension ditaOt) {
        project.dependencies {
            runtime 'commons-io:commons-io:2.4'
            runtime 'commons-codec:commons-codec:1.9'
            runtime 'xerces:xercesImpl:2.11.0'
            runtime 'xml-apis:xml-apis:1.4.01'
            runtime 'xml-resolver:xml-resolver:1.2'
            runtime 'net.sourceforge.saxon:saxon:9.1.0.8:dom'
            runtime 'net.sourceforge.saxon:saxon:9.1.0.8'
            runtime 'com.ibm.icu:icu4j:54.1'
            runtime 'org.apache.ant:ant:1.9.4'
            runtime 'org.apache.ant:ant-launcher:1.9.4'
            runtime 'org.apache.ant:ant-apache-resolver:1.9.4'

            provided project.files("${ditaOt.home}/lib/dost.jar")
            provided project.files("${ditaOt.home}/plugins/org.dita.pdf2/lib/fo.jar")
            provided project.files("${ditaOt.home}/lib")
            provided project.files("${ditaOt.home}/resources")
        }
    }

    @Override
    void apply(Project project) {
        project.apply plugin: 'base'

        DitaOtExtension ditaOt = project.extensions.create(DITA_OT, DitaOtExtension, project)

        // Project extensions aren't available before afterEvaluate.
        project.afterEvaluate {
            // FIXME: These shouldn't simply override the properties defined by
            // the user in the buildfile but rather merge with them. I think?
            setRepositories(project)
            setConfigurations(project)
            setDependencies(project, ditaOt)
            augmentAntClassLoader(project)
        }

        def task = project.task(DITA, type: DitaOtTask, group: 'Documentation',
            description: 'Publishes DITA documentation with DITA Open Toolkit.')
        task.conventionMapping.with {
            ditaOtClasspath = { project.configurations.runtime + project.configurations.provided }
        }
    }

}
