function frame1(){
  if(document.getElementById("frame1").className=="visible frame"){
    document.getElementById("frame1").className="transparent frame";
  }else{
    document.getElementById("frame1").className="visible frame";
  }
}

function frame2(){
  if(document.getElementById("frame2").className=="visible frame"){
    document.getElementById("frame2").className="transparent frame";
  }else{
    document.getElementById("frame2").className="visible frame";
  }
}

function sendPhoto (){
      var error=false;
      var formularz=document.forms[1];
      var napis="";
      var extensions = "png";
      var filename = new RegExp("^[A-Z0-9][A-Z0-9]*.png$","i");

      if (formularz.description.value == "" || formularz.description.value.length<4 || formularz.description.value.length>20 ){
        napis += "tytuł nie może mieć mniej znaków niż 4 i więcej niż 15\n"
        error=true;
      }
      if (filename.test(formularz.picture.value)!= true ){
        napis += "plik musi być w formacie png i nie może zaiwerać żadnych znaków specjalnych \n"
        error=true;
      }

      if (!error)
        formularz.submit();
      else
        alert (napis);
}

function deletePhoto(id_photo){
  var formularz=document.forms[0];
  var input=document.createElement("input");
  input.className="transparent";
  input.type="text";
  input.name="id";
  input.value="--"+id_photo+"--";
  formularz.appendChild(input);
  formularz.submit();
}

document.getElementById("button2").addEventListener("click", frame1);
document.getElementById("exit1").addEventListener("click", frame1);
document.getElementById("button1").addEventListener("click", frame2);
document.getElementById("exit2").addEventListener("click", frame2);

document.getElementById("arrow4").addEventListener("click", nextComment);
document.getElementById("arrow3").addEventListener("click", previousComment);


document.getElementById("send").addEventListener("click", sendPhoto);

document.getElementById("arrow1").addEventListener("click", previousPhoto);
document.getElementById("arrow2").addEventListener("click", nextPhoto);
