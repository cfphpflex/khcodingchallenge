

// The keys (e.g. valueMissing) map onto
// a key in the `input.validity` object
const customMessages = {
    valueMissing:    '  required!',       // `required` attr
    emailMismatch:   '    mismatch',  // Invalid email
    patternMismatch: '  pattern mismatch',// `pattern` attr
}

function getCustomMessage (type, validity) {
    if (validity.typeMismatch) {
        return customMessages[`${type}Mismatch`]
    } else {
        for (const invalidKey in customMessages) {
            if (validity[invalidKey]) {
                return customMessages[invalidKey]
            }
        }
    }
}

// var inputs = document.querySelectorAll('input, select, textarea')
// inputs.forEach(function (input) {
//     // Each time the user types or submits, this will
//     // check validity, and set a custom message if invalid.
//     function checkValidity () {
//         const message = input.validity.valid
//             ? null
//             : getCustomMessage(input.type, input.validity, customMessages)
//         input.setCustomValidity(message || '')
//     }
//     input.addEventListener('input', checkValidity)
//     input.addEventListener('invalid', checkValidity)
// })
