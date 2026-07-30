const Base_url = "https://mihrab-al-muhajireen-default-rtdb.europe-west1.firebasedatabase.app/";
const dataContainer = document.querySelector(".container");

const isControl = true;

function checkIfIsControl() {
    if (!document.querySelector(".addBtn")) return;

    if (!isControl) {
        document.querySelector(".addBtn").style.display = "";
    } else {
        document.querySelector(".addBtn").style.display = "flex";
    }
}

checkIfIsControl();

const urls = {
    lessons: `${Base_url}lessons.json`,
    lectures: `${Base_url}lectures.json`,
    sermons: `${Base_url}sermons.json`
}

// function to send data to the server.
async function sendDataToServer(url, data) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        alert("Data sent successfully:");
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// Get the Date of today.
function getDateOfToday() {
    let now = new Date();
    let year = now.getFullYear();
    let month = String((now.getMonth() + 1)).padStart(2, "0");
    let today = String(now.getDate()).padStart(2, "0");

    return today + "/" + month + "/" + year;
}

// preparation for sending data to the server
async function saveData(dataType, name, status, description) {
    if (!name || !description) {
        alert("Please fill in all required fields.");
        return;
    } else {
        const data = {
            name: name,
            status: status,
            description: description,
            date: getDateOfToday()
        };
        // send data to the server.
        let sendData = await sendDataToServer(urls[dataType], data);
        if (sendData) location.href = dataType + ".html";
    }
}

// function to get data from the server.
async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result && typeof result == 'object' && !Array.isArray(result)) {
            return result;
        }
        return result || [];
    } catch (error) {
        console.error(error.message); // print the error massege in console if server don't response or any error else.
        return null; // return null for print internet disconnected massage in displayData function.
    }
}

let arrType = JSON.parse(localStorage.getItem("arr")) || [];

async function displayData(dataType) {
    var arr = await getData(urls[dataType]);

    arr && localStorage.setItem("arr", JSON.stringify(Object.values(arr)));

    if (arr) {arr = Object.values(arr); var id = Object.keys(arr)}

    var randomFirst = Math.floor(Math.random() * 999999);
    var randomSecond = Math.floor(Math.random() * 999999);

    if (arr === null) { // if (arr) value eqaul null print internet disconnected massage.
        dataContainer.innerHTML = `
        <div class="error">
            <span>
                <i class="fa-solid fa-wifi"></i>
                <i class="slash"></i>
            </span>
            <h3>أنت غير متصل بالانترنت</h3>
            <button onclick="location.reload()">إعادة المحاولة</button>
        </div>
        `;
        return; // for stop function.
    }

    dataContainer.innerHTML = "";
    if (arr && arr.length > 0) {
        arr.toReversed().forEach((data, index) => {
            dataContainer.innerHTML += `
            <div class="dataCard" onclick="location.href = 'path.html?index=${randomFirst + id[index] + randomSecond}'">
                <div>
                    <h4>${index + 1}. ${data.name}</h4>
                    <small>${data.description}</small>
                </div>
                <i class="fas fa-chevron-left"></i>
            </div>
        `   ;
        });
    } else {
        dataContainer.innerHTML = `
            <div class="error">
                <i class="fa-solid fa-box-open"></i>
                <h3 class=>لا توجد بيانات مخزنة هنا</h3>
            </div>
        `;
    }
}

function display() {
    let queryString = window.location.search;

    let urlParams = new URLSearchParams(queryString);
    let index = urlParams.get("index");

    let arr = [...arrType];

    arr.reverse();

    if (arr[index[6]]) {
        document.querySelector("#h3").textContent = arr[index[6]].name;
        document.querySelector("#p").textContent = arr[index[6]].description;
    } else {
        document.querySelector("#h3").textContent = "404 Not Found"
        document.querySelector("#p").innerHTML = `
        <div class="notFoundError">
            <span>404</span>
            <h2>Page Not Found</h2>
        </div>
        `;
    }

}