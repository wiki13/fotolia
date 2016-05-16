var topv=0;

function topbox() {
  if(topv>-270){
    topv-=30;
    document.getElementById("photos").style="top:"+topv+"px";
  }
}
function bottombox() {
  if(topv<0){
    topv+=30;
    document.getElementById("photos").style="top:"+topv+"px";
  }
}

function like(){
  var xhttp = new XMLHttpRequest();
    xhttp.open("POST", document.URL , true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("f=true");
    xhttp.onreadystatechange= function(){
      if(xhttp.readyState ==4 && xhttp.status==200){
        alert(xhttp.responseText);
        if(xhttp.responseText=="ok"){
          var count = document.getElementById("liked-you").nextSibling.innerHTML;
          count= parseInt(count);
          count++;
          document.getElementById("liked-you").nextSibling.innerHTML=count;
        }
      }
    };
}

function check(){
  var error=false;
  var napis=""
  var formularz=document.forms[0];
  var textarea=document.getElementsByTagName("textarea")[0];
  if(formularz.title.value=="" || textarea.value==""){
    error=true;
    napis+="nie uzupełniłeś wszystkich pól"
  }else{
    if(formularz.title.length>5){
      error=true;
      napis+="tytuł nie może mieć mniej niż 5 znaków \n";
    }
  }
  if(error){
    alert(napis)
  }else{
    formularz.submit();
  }
}

function exit(){
  if(document.getElementById("messagecontainer").className=="visible frame"){
    document.getElementById("messagecontainer").className="transparent frame";
  }else{
    document.getElementById("messagecontainer").className="visible frame";
  }
}

document.getElementById("ok").addEventListener("click", check);
document.getElementById("exit1").addEventListener("click", exit);
document.getElementById("arrow1").addEventListener("click", topbox);
document.getElementById("arrow2").addEventListener("click", bottombox);
document.getElementById("liked").addEventListener("click", like);
document.getElementById("message").addEventListener("click", exit);
