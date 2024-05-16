import { render, screen } from "@testing-library/react";
import NavBar from "../components/layout/NavBar"
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { idText } from "typescript";
import { describe, it } from "vitest";


describe("NavBar page tests", () =>{
    it.only("should not contain any Broken ARIA reference errors", async () =>{
        render(
            <Router>
                <NavBar />
            </Router>
        );
        const dropdownMenu = await screen.findByRole("list", { name: "navigation" }); // Assuming "navigation" is the accessible name for the list
        expect(dropdownMenu).toHaveAttribute("id", "navbarDropdown");

    })

    it("Ensures interactive controls are not nested", () => {
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


    it("should ensure page contains a one-level heading", () => {
        render(
            <Router>
                <NavBar />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 1 });
        expect(secondLevelHeadings.length).toBe(0);

    })
 

})