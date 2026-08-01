(function() {
    const menuCheckBox = document.getElementById("menu");

    let serverPassword = ""; // Variable to store the password from the server.
    let password = ""; // Keep password varible empty to get password from server.
    let attempts = 6;

    let passwordInput = document.getElementById("passwordInput");
    let submitPassword = document.getElementById("submitPassword");
    let backdrop = document.querySelector(".backdrop");
    let passwordBox = document.querySelector(".passwordBox");
    let errBox = document.querySelector(".errorsBox");
    let correctBox = document.querySelector(".correctBox");

    let passwordBox_isOpen = sessionStorage.getItem("passwordBoxOpen") || "";

    if (!passwordBox_isOpen) {
        backdrop.style.display = "";
        passwordBox.style.display = "";
    } else {
        backdrop.style.display = "none";
        passwordBox.style.display = "none";
    }

    // get password from the server.
    async function getPassword() {
        try {
            const response = await fetch("https://mihrab-al-muhajireen-default-rtdb.europe-west1.firebasedatabase.app/password.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();

            // Assuming the password is the first value in the returned object
            serverPassword = Object.values(result)[0];
            password = serverPassword; // Update the password variable with the fetched password.
        } catch (error) {
            console.error(error.message);
            password = null;
            return;
        }
    }

    let div = document.createElement("div");
    div.classList.add("menu");
    div.innerHTML = `
        <a>عدد المستخدمين الحاليين 0</a>
    `;

    menuCheckBox.addEventListener("change", () => {
        if (menuCheckBox.checked) {
            document.body.appendChild(div);
        } else if(!menuCheckBox.checked) {
            div.remove();
        }
    });

    getPassword(); // Call function for get password.

    window.ononline = () => {
        getPassword();
    }

    function checkPassword() {
        if (!password) return; // Don't check of password if is null.
        if (attempts > 1) {
            if (passwordInput.value.trim()) {
                if (passwordInput.value.trim() === password) {
                    passwordInput.style.borderColor = "green";
                    errBox.style.display = "";
                    correctBox.style.display = "block";
                    correctBox.textContent = "كلمة المرور صحيحة!";
                    setTimeout(() => {
                        backdrop.style.display = "none";
                        passwordBox.style.display = "none";
                        passwordBox_isOpen = 'true';
                        sessionStorage.setItem("passwordBoxOpen", passwordBox_isOpen);
                    }, 500);
                } else {
                    attempts--;
                    passwordInput.style.borderColor = "red";
                    passwordInput.value = "";
                    errBox.style.display = "block";
                    errBox.textContent = `كلمة المرور غير صحيحة، لديك ${attempts} محاولات متبقية.`;
                }
            }
        } else {
            passwordInput.disabled = true;
            passwordInput.value = "";
            errBox.textContent = "تم حظرك! يرجى المحاولة لاحقاً.";
        }
    }

    setInterval(() => {if (passwordBox.style.display == "none" && !passwordBox_isOpen || backdrop.style.display == "none" && !passwordBox_isOpen) location.reload(true)}, 300);

    submitPassword.addEventListener("click", () => {
        checkPassword();
    });
    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {// Check if the pressed key is "Enter" not any other key.
            checkPassword();
        }
    });
})();