import React from 'react'
import { Navbar } from './Navbar'

export const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <div className="container m-auto">
                <Navbar />
                { children }
            </div>
        </React.Fragment>
    )
}
