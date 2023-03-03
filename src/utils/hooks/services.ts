import React from "react"

export const ServicesContext = React.createContext<ApiInterface>(window.API)

export function useServices(): ApiInterface {
    return React.useContext(ServicesContext)
}
