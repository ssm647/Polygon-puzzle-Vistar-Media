const fetchResponse = async () => {
    var lat =  document.getElementById("lat").value;
    var long = document.getElementById("long").value;
    var str = "lat="+lat+"&long="+long;
    fetch('http://localhost:8888/', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      mode: 'cors',
      body: str
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      if(data===""){
        document.getElementById("demo").innerHTML = "&nbsp;&nbsp;The point does not lies in any of the USA states";
      } else {
        document.getElementById("demo").innerHTML = "&nbsp;&nbsp;The point lies in the state <b>"+data+"</b>";
      }     
    }); 
  }

