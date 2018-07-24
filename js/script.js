$(document).ready(function(){
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event){
        localStorage.setItem("character", event.target.result);

        /*jQuery.post("character.php", event.target.result, function(data)
		{
		  alert("Do something with example.php response");
		}).fail(function()
		{
		  alert("Damn, something broke");
		});

		$value = $_POST['myKey']
		*/
    }
 
    document.getElementById('file').addEventListener('change', onChange);
});