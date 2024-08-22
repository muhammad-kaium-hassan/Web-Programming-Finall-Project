
const handleLogin = async () => {
    const userIdInput = document.getElementById("user-id");
    const passwordInput = document.getElementById("password");

    const userId = userIdInput.value;
    const password = passwordInput.value;

    const user = {
        userId: userId,
        password: password,
    };

    const userInfo = await fetchUserInfo(user);
    
    const errorElement = document.getElementById("user-login-error");

    if(userInfo.length === 0){
        errorElement.classList.remove("hidden");
    }
    else{
        errorElement.classList.add("hidden");

        //save user information before jumping next page
        localStorage.setItem("loggedInUser", JSON.stringify(userInfo[0]));

        //then make jump to the next page
        window.location.href = "/post.html";

    }
};

const fetchUserInfo = async (user) => {
    let data;
    
    try {
        const res = await fetch("http://localhost:5000/getUserInfo", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(user),
        });

        data = await res.json();
    }

    catch (err) {
        console.log("Error connecting to the server: ", err);
    }

    finally {
        return data;
    }
};