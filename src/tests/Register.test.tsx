import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Register from "../components/auth/Register";

describe('Login Page tests',() =>{
    it("should verify the login text", () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        const message = screen.queryByText(/Register here/)
    expect(message).toBeVisible
        
    });

    it("Page should not contain a second level heading (<h2> element)", () => {
        render(
            <Router>
                <Register />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, }))

    })

    it("form label should correctly associate with a form control.", () => {
        render(
            <Router>
                <Register />
            </Router>
        );
       // expect(screen.getByRole('form', { level: 1, })
       

    })

    it("Input element should have a form control corresponding label.", () => {
        render(
            <Router>
                <Register />
            </Router>
        );
        // expect(screen.getByRole('form', { level: 1, })


    })

    it("should not contain redundant links that goes to the same URL.", () => {
        render(
            <Router>
                <Register />
            </Router>
        );
        // expect(screen.getByRole('form', { level: 1, })


    })


});