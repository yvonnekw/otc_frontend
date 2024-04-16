import { render, screen } from "@testing-library/react";
import NavBar from "../components/layout/NavBar"
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { idText } from "typescript";


describe("NavBar page tests", () =>{
    it("should not contain any Broken ARIA reference errors", () =>{
        render(
            <Router>
                <NavBar />
            </Router>
        );
        expect(screen.findByRole("list")).toContain('id="navbarDropdown"')

    })

    it("should reflect the expansion state of true", () => {
        render(
            <Router>
                <NavBar />
            </Router>
        );
        expect(screen.getAllByLabelText("navbarDropdown")).toBeEnabled

    })

    it("should reflect the expansion state of false", () => {
        render(
            <Router>
                <NavBar />
            </Router>
        );
        expect(screen.getAllByLabelText("navbarDropdown")).toBeDisabled

    })

    it("button role should function like native buttons.", () => {
        render(
            <Router>
                <NavBar />
            </Router>
        );
        expect(screen.getByRole("button")).toBeEnabled

    })
 
    
   
    
})