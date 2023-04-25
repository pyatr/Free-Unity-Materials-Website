export default function FileToBase64(file: Blob, onLoad: Function) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        onLoad(reader.result);
    };
}