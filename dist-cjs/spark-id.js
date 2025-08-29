"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sparkId = void 0;
// Re-export everything from the main module
__exportStar(require("./lib/secure-id.js"), exports);
// Add the sparkId alias for better naming consistency
const secure_id_js_1 = require("./lib/secure-id.js");
exports.sparkId = secure_id_js_1.generateId;
// Default export for CommonJS compatibility
const secure_id_js_2 = require("./lib/secure-id.js");
exports.default = {
    generateId: secure_id_js_2.generateId,
    createId: secure_id_js_2.createId,
    isValidId: secure_id_js_2.isValidId,
    parseId: secure_id_js_2.parseId,
    sparkId: secure_id_js_2.generateId,
    SecureId: secure_id_js_2.SecureId,
};
//# sourceMappingURL=spark-id.js.map