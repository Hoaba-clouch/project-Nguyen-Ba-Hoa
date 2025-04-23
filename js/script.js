function signIn() {
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
    const errorBox = document.getElementById("errorBox");
    const successBox = document.getElementById("successBox");

    errorBox.hidden = true;
    successBox.hidden = true;

    if (!email || !password) {
        errorBox.hidden = false;
    } else {
        successBox.hidden = false;
    }
}