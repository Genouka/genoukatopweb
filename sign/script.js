const apkFileInput = document.getElementById('apkFile');

async function verityApk() { 
    const apkFile = apkFileInput.files[0];
    if (!apkFile) {
        alert('请选择一个文件.');
        return;
    }
    if (!apkFile.name.toUpperCase().endsWith(".APK")) {
        alert('只支持apk格式的文件.');
        return;
    }
    document.getElementById("verity-info").innerText = "加载中..."
    document.getElementById("org-sig").innerText = "加载中..."
    document.getElementById("consult-info").innerText = "加载中..."
    document.getElementById("consult-info").style = "color:cyan"
    document.getElementById("result-icon").src = ""
    document.getElementById("result-app-info").innerText = "加载中..."

    try{
        const parser = new window.AppInfoParser(apkFile)
        parser.parse().then(result => {
            console.log(result)
            var res = "包名: " + result.package + "\n" +
            "目标API: " + result.platformBuildVersionCode + "\n" +
            "应用名称: " + result.application.label + "\n" +
            "版本号: " + result.versionCode + "\n" +
            "版本名称: " + result.versionName
            document.getElementById("result-icon").src = result.icon
            document.getElementById("result-app-info").innerText = res
            var dres = ""
            if(
                result.package.startsWith("com.yuanwow.") ||
                result.package.startsWith("com.genouka.") ||
                result.package.includes("yuanwow.") ||
                result.package.startsWith("top.genouka.") ||
                result.package.startsWith("cn.genouka.") ||
                result.package.includes("genouka.") ||
                result.package.includes("qiuming.") ||
                result.package.startsWith("ga.left.")
            ){
                dres += "* 本应用可能是 秋冥散雨_Genuka 开发的。\n"
            }
            if(
                result.package.includes("mubai.") ||
                result.package.includes("MobileByMuBai")
            ){
                dres += "* 本应用可能是 沐白_official 开发的。\n"
            }
            if(
                result.package.includes("cgoat.")
            ){
                dres += "* 本应用可能是 C-G_O_A_T 开发的。\n"
            }
            if(
                result.package.startsWith("com.watchgeek.") ||
                result.package == "com.watch.watchgeek"
            ){
                dres += "* 本应用可能是 表极客开发团队 开发的。\n"
            }
            if(
                result.application.name == "com.refix.genouka.deltarune.GlobalApplication" ||
                result.application.name == "com.genouka.rrrecycle.RunnerApplication" ||
                result.application.name == "yuanwow.YApplication"
            ){
                dres += "* 本应用使用了 秋冥散雨_Genuka 的移植套件。\n"
            }
            if(
                result.application.name == "com.androlua.LuaApplication"
            ){
                dres += "* 本应用使用了 Androlua 开发套件\n"
            }
            if(
                result.application.name == "io.dcloud.application.DCloudApplication"
            ){
                dres += "* 本应用使用了 DCloud 开发套件\n"
            }
            result.application.activities.forEach(element => {
                if(element.name == "bin.mt.file.content.MTDataFilesWakeUpActivity"){
                    dres += "* 本应用支持基于SAF框架的文件提供器组件，可以从文件管理器访问应用内部数据。\n"
                }
            });
            document.getElementById("verity-info").innerText = dres
            
        }).catch(err => {
            console.log('err ----> ', err)
            document.getElementById("verity-info").innerText = ""
            document.getElementById("result-app-info").innerText = "文件加载错误: "+err.message
        })

        var vinfo = ""
        var besafe = false
        try {
            const zip = await loadZip(apkFile);
            const signature = await getSignature(zip);
            const certificate = getCertificate(signature);
            const sha256 = computeSHA256noformat(certificate);
            console.log("origin sha256: " + sha256)
            //document.getElementById("org-sig").innerText = sha256
            
            if(sha256 == "3157f8b209a9664ca079951bf85f638464189fbae9ccf325f63cc6de64295638"){
                vinfo += "* 该应用的签名是 秋冥散雨_Genuka、沐白_official、C-G_O_A_T 共用的3157签名。\n"
                besafe = true;
            }else if(sha256 == "9cea93b97cabb4d6f8a8acc98e0b24636084c552dd775c7690435bb983be62bc"){
                vinfo += "* 该应用的签名是 秋冥散雨_Genuka 独用的9cea签名。\n"
                besafe = true;
            }else if(sha256 == "063c6549bf3556e6dbecd6e1b185f2e7c6b630cb10db097a71c3095e3b6b06cb"){
                vinfo += "* 该应用的签名是 秋冥散雨_Genuka 独用的063c签名。\n"
                besafe = true;
            }else if(sha256 == "a40da80a59d170caa950cf15c18c454d47a39b26989d8b640ecd745ba71bf5dc"){
                vinfo += "* 该应用的签名是 C-G_O_A_T 独用的a40d签名。\n"
                besafe = true;
            }else if(sha256 == "e26f03e6caed1e114fd521d4babbe670a167a24c8691822d794e076c691a1d76"){
                vinfo += "* 该应用的签名是公用的e26f测试签名。\n"
            }else if(sha256 == "a40da80a59d170caa950cf15c18c454d47a39b26989d8b640ecd745ba71bf5dc"){
                vinfo += "* 该应用的签名是公用的a40d测试签名。\n"
            }else if(sha256 == "85b1f0f964a49bd62f03575235d72bc9f95a72e7a2b96d9b2253eeadeb4fc97e"){
                vinfo += "* 该应用的签名是公用的85b1测试签名。\n"
            }else if(sha256 == "f28a9f424f23825c3e6a650799d16a46ed075d8a269c539f483b71b2814c0a9c"){
                vinfo += "* 该应用的签名是未知者签发的f28a测试签名。\n"
            }else{
                vinfo += "* 该应用的签名为 "+sha256+"。\n"
            }
            const res = hexToBase64(sha256)
            //document.getElementById("sig").innerText = res
        } catch (error) {
            console.error(error);
            vinfo += "* 该应用的签名加载失败: "+ error.message +"\n";
            //alert('Error extracting SHA256 signature: ' + error.message);
        }
        document.getElementById("org-sig").innerText = vinfo

        if(besafe){
            document.getElementById("consult-info").innerText = "该应用安装包签名正常。"
            document.getElementById("consult-info").style = "color:green"
        }else{
            document.getElementById("consult-info").innerText = "该应用的来源安全性存疑。"
            document.getElementById("consult-info").style = "color:red"
        }
    }catch(err){
        console.log('berr ----> ', err)
        document.getElementById("verity-info").innerText = ""
        document.getElementById("org-sig").innerText = ""
        document.getElementById("result-icon").src = ""
        document.getElementById("result-app-info").innerText = ""
        document.getElementById("consult-info").innerText = "文件加载错误: "+err.message
        document.getElementById("consult-info").style = "color:red"
    }
}


function loadZip(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const zip = new JSZip();
                await zip.loadAsync(event.target.result);
                resolve(zip);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (event) => {
            reject(event.target.error);
        };
        reader.readAsArrayBuffer(file);
    });
}

async function getSignature(zip) {
    const signatureFilePattern = /^META-INF\/.*\.RSA$/;
    const signatureFileName = Object.keys(zip.files).find((name) => signatureFilePattern.test(name));

    if (!signatureFileName) {
        throw new Error('No signature file found in APK.');
    }

    const signatureFile = zip.files[signatureFileName];
    const signatureContent = await signatureFile.async('uint8array');
    return signatureContent;
}

function getCertificate(signature) {
    const asn1 = forge.asn1.fromDer(forge.util.binary.raw.encode(signature));
    const certList = forge.pkcs7.messageFromAsn1(asn1).certificates;
    if (certList.length === 0) {
        throw new Error('No certificates found in the signature file.');
    }
    return certList[0];
}

function computeSHA256(certificate) {
    const md = forge.md.sha256.create();
    md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(certificate)).getBytes());
    return md.digest().toHex().toUpperCase().match(/.{1,2}/g).join(':');
}

function computeSHA256noformat(certificate) {
    const md = forge.md.sha256.create();
    md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(certificate)).getBytes());
    return md.digest().toHex();
}

function hexToBase64(hexString) {
    const raw = hexDecodeString(hexString.replaceAll(':', ''));
    const base64 = encodeToBase64(raw);
    return base64;
}

function hexDecodeString(sha256HexString) {
    if (sha256HexString.length % 2 !== 0) {
        throw new Error('Invalid hex string length');
    }

    console.log(sha256HexString)

    const decodedBytes = new Uint8Array(sha256HexString.length / 2);

    for (let i = 0; i < sha256HexString.length; i += 2) {
        const byteValue = parseInt(sha256HexString.substr(i, 2), 16);
        if (isNaN(byteValue)) {
            throw new Error('Invalid hex string');
        }
        decodedBytes[i / 2] = byteValue;
    }

    return decodedBytes;
}

function encodeToBase64(decodedBytes) {
    let binary = '';
    const len = decodedBytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(decodedBytes[i]);
    }
    return window.btoa(binary);
}
window.dataversion.innerText="V20260220-1a"
