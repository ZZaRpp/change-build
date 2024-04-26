const fs = require('fs'),
    path = require('path'),
    xml2js = require('xml2js'),
    os = require("os");

//Initial configs
const configs = {
    androidRootPath: "/platforms/android/",
    androidPath: "/platforms/android/app/src/main/assets/www/",
    androidMainPath: "/platforms/android/app/src/main/",
    androidAppPath: "/platforms/android/app/",
    configPathAndroid: "/platforms/android/app/src/main/res/xml/config.xml",
    androidManifest: "AndroidManifest.xml",
    indexFile: 'index.html',
    urlPath: 'ARUnity_Sample',
    pluginId: 'cordova-unity-ar-config-plugin'
};

function getConfigs() {
    return configs;
}

function logFile(path) {
    let fileContent = fs.readFileSync(path, "utf8");
    console.log("---- Start " + path + " ----");
    console.log(fileContent);
    console.log("---- End " + path + " ----");
}

function logAppFolders(foldersPath) {
    const files = fs.readdirSync(foldersPath);
    console.log("---- Start " + foldersPath + " ----");
    files.forEach(folder => {
        console.log(folder);
    })
    console.log("---- End " + foldersPath + " ----");
}

function changeFileContent(path, strToFind, replaceByStr) {
    let content = fs.readFileSync(path, "utf8");
    content = content.replace(strToFind, replaceByStr);
    fs.writeFileSync(path, content);
}



function changeConfigXML() {
    let path = "platforms/android/app/src/main/res/xml/config.xml";
    //logFile(path);
    let strToFind = "preference name=\"android-minSdkVersion\" value=\"28\"";
    let replaceByStr = "preference name=\"android-minSdkVersion\" value=\"24\"";
    changeFileContent(path,strToFind,replaceByStr);
    //Log the changed file
    logFile(path);
}


function changeProjectProperties() {
    let path = "platforms/android/project.properties";
    logFile(path);
    let strToFind = "android.library.reference.2=app";
    let replaceByStr = "android.library.reference.2=app" + os.EOL + "android.library.reference.3=unityLibrary" + os.EOL;
    changeFileContent(path,strToFind,replaceByStr);
    //Log the changed file
    logFile(path);
}

function changeGradleProperties() {
    let path = "platforms/android/gradle.properties";
    logFile(path);
    // let strToFind = "android.library.reference.2=app";
    // let replaceByStr = "android.library.reference.2=app" + os.EOL + "android.library.reference.3=unityLibrary" + os.EOL;
    // changeFileContent(path,strToFind,replaceByStr);
    // //Log the changed file
    // logFile(path);
}

function changeAndroidBuildGradle() {
    let path = "platforms/android/build.gradle";
    logFile(path);

    let replaceByStr = "repositories {\nrepos" + os.EOL + "flatDir { dirs \"${project(':unityLibrary').projectDir}/libs\" " + os.EOL + " } " + os.EOL + " }";
    
    let content = fs.readFileSync(path, "utf8");

    let search = /repositories repos/g;
    let t = 0
    content = content.replace(search, match => ++t === 2 ? replaceByStr : match)

    fs.writeFileSync(path, content);

    //Log the changed file
    logFile(path);
}


function changeAppBuildGradle() {
    let path = "platforms/android/app/build.gradle";
    logFile(path);
    let strToFind = "// SUB-PROJECT DEPENDENCIES END";
    let replaceByStr = "implementation(project(path: \":unityLibrary\"))\n" + strToFind;
    changeFileContent(path,strToFind,replaceByStr);
    //Log the changed file
    logFile(path);
}


function changeSettingsGradle() {
    let path = "platforms/android/settings.gradle";
    logFile(path);
    let strToFind = "include \":app\"";
    let replaceByStr = "include \":unityLibrary\"\n" + strToFind;
    changeFileContent(path,strToFind,replaceByStr);
    //Log the changed file
    logFile(path);
}



function generateUnityLibrary() {
    let dir = "platforms/android/unityLibrary/libs/";
    let res_path = "platforms/android/app/src/main/assets/www/libs/";
    fs.mkdirSync("platforms/android/unityLibrary/");
    fs.mkdirSync(dir);

    var oldPath1 = res_path + 'unity-classes.jar';
    var newPath1 = dir + 'unity-classes.jar';
    fs.renameSync(oldPath1, newPath1);
    console.log("Successfully renamed 'unity-classes.jar' - AKA moved!");

    var oldPath2 = res_path + 'VuforiaEngine.aar';
    var newPath2 = dir + 'VuforiaEngine.aar';
    fs.renameSync(oldPath2, newPath2);
    console.log("Successfully renamed 'VuforiaEngine.aar' - AKA moved!");

    var oldPath_build_gradle = 'platforms/android/app/src/main/assets/www/build.gradle';
    var newPath_build_gradle = 'platforms/android/unityLibrary/build.gradle';
    fs.renameSync(oldPath_build_gradle, newPath_build_gradle);
    console.log("Successfully renamed 'build.gradle' - AKA moved!");

    var oldPath_proguard_unity = 'platforms/android/app/src/main/assets/www/proguard-unity.txt';
    var newPath_proguard_unity = 'platforms/android/unityLibrary/proguard-unity.txt';
    fs.renameSync(oldPath_proguard_unity, newPath_proguard_unity);
    console.log("Successfully renamed 'proguard-unity' - AKA moved!");



    var files = fs.readdirSync("platforms/android/unityLibrary/");
    console.log("--- Reading files in " + "platforms/android/unityLibrary/" + " ---");
    files.forEach(folder => {
        console.log(folder);
    })

    files = fs.readdirSync(dir);
    console.log("--- Reading files in " + dir + " ---");
    files.forEach(folder => {
        console.log(folder);
    })
}




module.exports = {
    getConfigs,
    logFile,
    changeProjectProperties,
    changeAndroidBuildGradle,
    changeAppBuildGradle,
    logAppFolders,
    generateUnityLibrary,
    changeSettingsGradle,
    changeConfigXML,
    changeGradleProperties
}
