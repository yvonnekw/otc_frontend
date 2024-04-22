import { render, screen } from "@testing-library/react";
import  ListAllCalls  from "../components/calls/ListAllCalls"
import React from "react";


import { BrowserRouter as Router } from 'react-router-dom';


describe("", () => {
    it("should verify the home welcome message is heading 1", () => {
        render(
            <Router>
                <ListAllCalls />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, })
        ).toHaveTextContent('Welcome to Optical Telephone Company')
        
    });

    it("Page should not contain more than 1 second level heading (<h2> element)", () => {
        render(
            <Router>
                <ListAllCalls />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 2 });
        expect(secondLevelHeadings.length).toBe(0);

    })


    it("should ensure all th elements has a scope attribute value of row or col", () => {
        render(
            <Router>
                <ListAllCalls />
            </Router>
        );

        const thElements = screen.getAllByRole('columnheader');

        thElements.forEach(thElement => {
            const scopeAttributeValue = thElement.getAttribute('scope');
            expect(scopeAttributeValue).toMatch(/^(row|col)$/);
        });

    });



});
