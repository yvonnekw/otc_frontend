import { render, screen } from "@testing-library/react";
import  AdminUI  from "../components/admin/AdminUI"
import React from "react";


import { BrowserRouter as Router } from 'react-router-dom';


describe("Admin UI accessiblity tests", () => {
    it("should verify the home welcome message is heading 1", () => {
        render(
            <Router>
                <AdminUI />
            </Router>
        );
        expect(screen.getByRole('heading', { level: 1, })
        ).toHaveTextContent('Welcome to Optical Telephone Company')
        
    });

    it("Page should not contain more than 1 second level heading (<h2> element)", () => {
        render(
            <Router>
                <AdminUI />
            </Router>
        );
        const secondLevelHeadings = screen.queryAllByRole("heading", { level: 2 });
        expect(secondLevelHeadings.length).toBe(0);

    })

    it("Ensure the ARIA role, state, or property is used correctly.", () => {
        render(
            <Router>
                <AdminUI />
            </Router>
        );

        const linkElement = screen.getByRole('link', { name: /Admin/i });

        expect(linkElement).toHaveAttribute('role', 'label');

    })



});
