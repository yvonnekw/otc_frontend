import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Login from "../components/auth/Login";

describe('Login Page tests',() =>{
    it("should verify the login text", () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        const message = screen.queryByText(/Login here/)
    expect(message).toBeVisible
        
    });

    it("Page should not contain a second level heading (<h2> element)", () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 2 });
        expect(secondLevelHeadings.length).toBe(0);

    })

});