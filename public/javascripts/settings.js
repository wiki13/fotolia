function check(){
 var error=false;
  var formularz=document.forms[0];
  var napis="";
  var wzorMaila = new RegExp("^[0-9a-z_.-]+@[0-9a-z.-]+\.[a-z]{2,3}$","i");
  var filename = new RegExp("^[A-Z0-9\-][A-Z0-9\-]*.png$","i");

  if (formularz.password.value.length<6 || formularz.password.value.length>20||
      formularz.password2.value.length<6 || formularz.password2.value.length>20){
    napis += "hasło (nie może mieć mniej znaków niż 6 i więcej niż 20) \n"
    error=true;
  }

  if (wzorMaila.test(formularz.email.value)!= true){
    napis += " email\n"
    error=true;
  }

  if (formularz.nick.value.length<6 ){
    napis += "nick (nie może mieć mniej niż 6 znaków)\n"
    error=true;
  }

  if (filename.test(formularz.picture.value)!= true ){
    napis += "plik musi być w formacie png i nie może zaiwerać żadnych znaków specjalnych \n"
    error=true;
  }

 if(!error){
    formularz.submit();
  }else{
    alert ("Niepoprawnie wypełniłeś pola :\n" + napis);
  }
}

document.getElementById("formbutton").addEventListener("click", check);v
