/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { createRoot } from "react-dom/client"
import App from "./components/App"
import "./index.css"

console.log(
    '👋 This message is being logged by "renderer.js", included via webpack'
)
console.log(window.myAPI)
console.log("🚀 [renderer] window.API = ", window.API) // @FIXME: Remove this line written on 2023-02-22 at 17:23
const container = document.getElementById("app")
container.textContent = "Hello world!"
const root = createRoot(container)
root.render(<App services={window.API} />)
