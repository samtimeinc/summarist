// Validation tool for creating or registering an account with email and password

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePasswordStrength = (password: string): { 
    isValid: boolean; 
    message: string 
} => {
    const requirements = [
        { regex: /.{8,}/, message: "at least 8 characters" },
        { regex: /[A-Z]/, message: "an uppercase letter" },
        { regex: /[a-z]/, message: "a lowercase letter" },
        { regex: /[0-9]/, message: "a number" },
        { regex: /[@$!%*?&]/, message: "a special character (@$!%*?&)" },
    ];

    const missing = requirements
        .filter(req => !req.regex.test(password))
        .map(req => req.message);

    if (missing.length === 0) {
        return { isValid: true, message: "" };
    }

    return { 
        isValid: false, 
        message: `Password needs: ${missing.join(", ")}.` 
    };
};