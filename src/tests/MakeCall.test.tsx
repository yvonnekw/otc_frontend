import { render, screen } from "@testing-library/react";
import  MakeCall  from "../components/calls/MakeCall"
import React from "react";


import { BrowserRouter as Router } from 'react-router-dom';


describe("", () => {
    it("should verify the home welcome message is heading 1", () => {
        render(
            <Router>
                <MakeCall />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, })
        ).toHaveTextContent('Welcome to Optical Telephone Company')
        
    });

    it("Page should not contain a second level heading (<h2> element)", () => {
        render(
            <Router>
                <MakeCall />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 2 });
        expect(secondLevelHeadings.length).toBe(0);

    })


});
