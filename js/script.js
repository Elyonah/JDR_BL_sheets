$(document).ready(function(){
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event){
        localStorage.setItem("character", event.target.result);
    }
 
    document.getElementById('file').addEventListener('change', onChange);
});