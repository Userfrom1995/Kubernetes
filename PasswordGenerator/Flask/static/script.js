function generatePassword() {
    var length = document.getElementById("length").value;
    var strength = document.getElementById("strength").value;

    var charset = "";
    if (strength === "low") {
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    } else if (strength === "medium") {
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    } else {
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    }

    var password = "";
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    document.getElementById("result").value = password;

    // Update password strength indicator bar
    var strengthBar = document.getElementById("strengthBar");
    var strengthPercentage = (length / 50) * 100; // Assuming maximum password length is 50
    strengthBar.style.width = strengthPercentage + "%";
    strengthBar.setAttribute("aria-valuenow", strengthPercentage);
}
