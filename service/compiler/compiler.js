///
// Base class for all compilers. Must have the following methods:
///
function Compiler() {
}

///
// Compile(): Compiles and returns output, asynchronously.
///
Compiler.prototype.Compile = function (language, input) {
}

///
// SupportedLanguages: Returns all supported languages;
///
Compiler.prototype.SupportedLanguages = function () {
}

///
// Language: Represents a programming language in the IdeOne Service.
///
function Language(key, value) {
    this.langKey = key;
    this.langName = value;
}

module.exports.Compiler = Compiler;
module.exports.Language = Language;