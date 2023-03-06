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
import React from "react"
import { createRoot } from "react-dom/client"
import App from "./components/App"
import "./index.css"
import Service from "./service/service"
import Theme from "./ui/theme"
import { ServicesContext } from "./utils/hooks/services"

function start() {
    console.log(
        '👋 This message is being logged by "renderer.js", included via webpack'
    )
    const theme = new Theme({
        colors: {
            input: "#eefe",
            neutral: { hue: 210, chroma: [5, 1], lightness: [20, 80] },
            primary: {
                hue: 210,
                chroma: [80, 100],
                lightness: [10, 90],
            },
            secondary: {
                hue: 72,
                chroma: [90, 100],
                lightness: [40, 75],
            },
            tertiary: {
                hue: [100, 100],
                chroma: [100, 120],
                lightness: [50, 120],
            },
        },
    })
    theme.apply()
    const container = document.getElementById("app")
    container.textContent = "Hello world!"
    const root = createRoot(container)
    root.render(
        <ServicesContext.Provider value={new Service()}>
            <App />
        </ServicesContext.Provider>
    )
}

start()
