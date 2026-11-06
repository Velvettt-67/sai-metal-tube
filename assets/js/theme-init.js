/* Applies the saved light/dark theme before first paint (prevents a flash). */
try{if(localStorage.getItem("smt-theme")==="light"){document.documentElement.classList.add("light");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#E7EAEE');}}catch(e){}
