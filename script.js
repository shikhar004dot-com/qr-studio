
const textInput=document.getElementById("textInput");
const fileInput=document.getElementById("fileInput");
const generateBtn=document.getElementById("generateBtn");
const downloadBtn=document.getElementById("downloadBtn");

const qrContainer=document.getElementById("qrContainer");
const loader=document.getElementById("loader");
const status=document.getElementById("status");

generateBtn.addEventListener("click",generateQR);
downloadBtn.addEventListener("click",downloadQR);

async function generateQR(){
const text=textInput.value.trim();
const file=fileInput.files[0];

if(!text && !file){
    alert("Enter text or choose image");
    return;
}

qrContainer.innerHTML="";
qrContainer.classList.remove("show");
downloadBtn.classList.add("hidden");

generateBtn.disabled=true;
loader.classList.remove("hidden");
status.textContent="Processing...";

try{
    let dataToEncode;
    if(file){
        status.textContent="Uploading image...";
        dataToEncode=await uploadToCloudinary(file);
    }
    
else{
    dataToEncode=text;
}
    new QRCode(qrContainer,{
    text:dataToEncode,
    width:260,
    height:260
});
    qrContainer.classList.add("show");
    downloadBtn.classList.remove("hidden");
    status.textContent="QR generated successfully";
}
catch(error){
        status.textContent="Something went wrong";
    }
finally{
    loader.classList.add("hidden");
    generateBtn.disabled=false;
}
}

async function uploadToCloudinary(file){
const cloudName="dcqbqswms";
const uploadPreset="qr_upload";
const url=`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const formData=new FormData();
formData.append("file",file);
formData.append("upload_preset",uploadPreset);

const response=await fetch(url,{
    method:"POST",
    body:formData
});

const data=await response.json();

if(!data.secure_url){
    throw new Error("Upload failed");
}

    return data.secure_url;
}
function downloadQR() {
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) {
        alert("Generate QR first!");
        return;
    }
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


