import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Register from "../components/auth/Register";

describe('Register Page Accessibility tests',() =>{
    it("should verify the login text", () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        const message = screen.queryByText(/Register here/)
    expect(message).toBeVisible
        
    });

    it("should ensure page contains a one-level heading", () => {
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
        // Query for all anchor elements
        const anchorElements = screen.getAllByRole('link');

        console.log("all links " + anchorElements.length)

        // Extract href attribute values and store unique values in a Set
        const hrefSet = new Set();
        anchorElements.forEach((anchor) => {
            hrefSet.add(anchor.getAttribute('href'));

            console.log("" + hrefSet.size)

        });

        // Check if the number of unique href values is equal to the total number of anchor elements
        expect(hrefSet.size).toBe(anchorElements.length);
  
    
    })


});