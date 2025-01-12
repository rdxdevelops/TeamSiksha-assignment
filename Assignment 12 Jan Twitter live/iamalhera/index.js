let actualData =[];
const jsonData = document.getElementById("searchInput").addEventListener("change",(e)=>{
    // console.log(e.target.value);
})
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function displayData(data){
    const profileContainer = document.getElementById("dataContainer");
    console.log("displayData function called");
    data.forEach((profile)=>{
        // console.log(profile.slug);
        // console.log("YYYY");
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile');
        profileDiv.innerHTML = `<h2>Title: ${capitalizeFirstLetter(profile.title)}</h2><p>Slug: ${capitalizeFirstLetter(profile.slug)}</p><br/><p>Description: ${capitalizeFirstLetter(profile.description)}</p><br/><p>CreatedAt: ${profile.created}</p>`;
        profileContainer.appendChild(profileDiv);
    });
}
async function getDataInScript(){
    try{
        const dataResponse = await fetch('./src/data.json');
         actualData = await dataResponse.json();

        // console.log(actualData);
        //exported the whole display syntax to a function
        displayData(actualData);

    }
    catch(e){
        console.log("Error: ",e);
    }
}
getDataInScript();

function sortData(){
    const selectedoption = document.querySelector('input[name="option"]:checked');
    console.log("cursor reached SortData",selectedoption)
    if(selectedoption){
        const order = selectedoption.value;
        let sortedData;

        if(order == "asc"){
            sortedData= [...actualData].sort((a,b) => new Date(a.created) - new Date(b.created));
        } else if(order == "desc"){
            sortedData= [...actualData].sort((a,b) => new Date(b.created) - new Date(a.created));
        }

        displayData(sortedData);
    }
}

document.querySelectorAll('input[name="option"]').forEach(radio=>{
    radio.addEventListener('change',sortData);
})

//just to make initially as ascedning [doing it from here instead of from tags itself]
document.querySelector('input[name="option"][value="asc"]').checked = true;
sortData();