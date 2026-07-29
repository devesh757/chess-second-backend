"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./Routes/auth"));
const app = (0, express_1.default)();
const mongourl = process.env.MONGO_URL;
const Port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/auth", auth_1.default);
async function main() {
    await mongoose_1.default.connect(mongourl);
    app.listen(Port, () => console.log(`server running on port${Port}`));
}
main();
//# sourceMappingURL=index.js.map