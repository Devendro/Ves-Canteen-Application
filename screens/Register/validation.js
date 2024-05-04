// Function to validate name (alphabetic characters only)
const validateName = (name) => /^[a-zA-Z]+$/.test(name);

// Function to validate email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Function to validate password
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

// Function to verify if confirm password matches password
const confirmPasswordMatches = (password, confirmPassword) => password === confirmPassword;

// Exporting functions
export { validateName, validateEmail, validatePassword, confirmPasswordMatches };
